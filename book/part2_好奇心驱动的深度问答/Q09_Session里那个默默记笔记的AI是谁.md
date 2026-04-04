# Session 里那个默默记笔记的 AI 是谁？

你可能从未注意到，Claude Code 在你工作的过程中，后台悄悄运行着一个"记笔记"的独立 AI 实例。它把你的对话要点、任务进展、遇到的错误自动整理成结构化的 `session-memory.md` 文件，让 AI 在下次打开项目时就能记起"上次做到哪了"。本章解析这个 SessionMemory 系统的触发机制、笔记结构和工程设计。

> 💡 **通俗理解**：就像会议有专人做笔记——你只管开会讨论，它把要点记录下来，下次开会时你可以快速回忆。

### 🌍 行业背景

"让 AI 在工作过程中自动积累上下文记忆"是 AI 编码工具和 Agent 框架的共同追求，但各家的实现路径差异很大：

- **Cursor（长期记忆 / Memories）**：2024 年底引入记忆功能，通过用户手动标记或 AI 自动提取关键信息，存储在云端。但它不像 Claude Code 这样运行独立的后台 AI 实例来持续记笔记，更偏向"关键事实提取"而非"会话进展追踪"。
- **Aider（chat history + repo map）**：将对话历史持久化到 `.aider.chat.history.md` 文件，但这是原始对话的直接记录，没有经过 AI 摘要和结构化整理。Aider 的 repo map 功能会维护代码库结构的缓存，但这属于代码理解而非会话记忆。
- **Windsurf（Cascade Memory）**：声称具备跨会话的"记忆"能力，但具体实现未公开，文档中没有描述类似 SessionMemory 的独立后台提取机制。
- **LangChain / LangGraph（Memory 模块）**：提供了多种记忆实现——`ConversationBufferMemory`（全量保存）、`ConversationSummaryMemory`（AI 摘要）、`EntityMemory`（实体追踪）。LangChain 的 `ConversationSummaryMemory` 与 Claude Code 的 SessionMemory 最相似，都用一个 LLM 调用来压缩对话历史，但 LangChain 是同步执行，而 Claude Code 是后台异步执行。
- **ChatGPT（Memory）**：OpenAI 的记忆功能会在对话中提取用户偏好和关键事实，跨会话持久化。但它是云端服务而非本地文件，用户对记忆内容的控制粒度不同。

Claude Code 的 SessionMemory 的独特之处在于：（1）后台异步运行，不阻塞主对话；（2）输出是结构化的本地 Markdown 文件，用户可以直接查看和编辑；（3）通过 `runForkedAgent` 复用 prompt cache 降低成本。这种"用独立 AI 实例做后台记录员"的模式在 AI 编码工具中目前较为少见。

---

## 问题

如果你仔细看过 `~/.claude/projects/` 目录，可能会发现里面有一个 `session-memory.md`。这个文件是谁写的？什么时候写的？写的是什么？

---

## 实际上是这样的

Claude Code 在你工作的过程中，偷偷运行着一个**后台记笔记的 AI**。

### 机制

每次你发消息并等到 AI 回复完成后，系统会检查是否需要"提取记忆"：

```
shouldExtractMemory(messages):
  1. token 数超过初始化阈值？（如不超过，还不用记）
  2. 上次记忆提取以来，token 增长超过阈值？
  3. 工具调用次数超过阈值？
  4. 当前 AI 没在执行工具？（在工具执行中不打扰）
  
  满足条件 → 触发 extractSessionMemory()
```

满足条件时，系统启动一个 `runForkedAgent`——一个独立的 AI 实例，任务只有一件事：**用 Edit 工具更新 session-memory.md 文件**。

### 笔记的结构

生成的笔记文件有 10 个固定节：

```markdown
# Session Title
_5-10 字描述本次会话_

# Current State
_当前正在做什么？下一步是什么？_

# Task specification
_用户要求构建什么？有哪些设计决策？_

# Files and Functions
_重要的文件是哪些？它们包含什么？_

# Workflow
_通常运行哪些命令？顺序是什么？_

# Errors & Corrections
_遇到了什么错误？如何修复？哪些方法失败了？_

# Codebase and System Documentation
_重要的系统组件是什么？它们如何运作？_

# Learnings
_什么有效？什么无效？要避免什么？_

# Key results
_如果用户要求了特定输出，完整的结果在这里_

# Worklog
_每步做了什么？极简摘要_
```

更新时，记笔记的 AI **只能修改**每节标题下面的内容——节名（`# ...`）和斜体说明行（`_..._`）不能被修改或删除。所有 Edit 操作必须并行执行，然后立即停止。

### 这个设计的工程亮点

**记笔记的 AI 复用了主请求的 prompt cache。** 同样是 `runForkedAgent` + `CacheSafeParams`，和投机执行一样——这让记笔记的额外成本降至最低（只需要处理新增的 token）。

> 📚 **课程关联**：`sequential()` 串行化机制直接对应《操作系统》课程中的**互斥与同步**章节。这本质上是一个生产者-消费者问题的简化版——多个"记笔记触发事件"（生产者）竞争同一个 `session-memory.md` 文件（临界资源），`sequential()` 充当了互斥锁（mutex）的角色，确保同一时刻只有一个写操作在执行。这比使用文件锁（`flock`）更轻量，因为所有操作都在同一个 Node.js 进程内，JavaScript 的单线程事件循环天然避免了真正的并发写入，`sequential()` 解决的是**异步操作的逻辑串行化**问题。

**`sequential()` 防止并发写入。** 如果上一次记笔记还没完成，新的触发会排队等待，不会并发写入文件造成内容混乱。

**只在主 REPL 线程运行。** 子 Agent、teammate、speculation 运行期间，记笔记的 AI 不会工作。这防止了噪音：只记录主线对话，不记录辅助 Agent 的内部状态。

### 笔记的用途

这个文件可以被 AutoMem（自动记忆）系统读取，成为未来 session 的上下文。当你重新打开一个项目时，AI 已经知道你上次做到哪里了——这就是 SessionMemory 的价值。

### 相关阈值（可通过 GrowthBook 远程配置）

- `minimumMessageTokensToInit`：多少 token 后开始首次提取
- `minimumTokensBetweenUpdate`：两次提取之间最少需要增加多少 token
- `toolCallsBetweenUpdates`：两次提取之间最少需要多少次工具调用

整个功能由 `tengu_session_memory` GrowthBook 特性门控制。

---

## 这个设计的工程价值

**把"AI 监视 AI 并记笔记"变成了一个可靠的后台服务。**

三个关键决策保证了可靠性：
1. `sequential()` — 串行化，防止并发
2. 阈值检查 — 防止每次 AI 回复都触发（成本控制）
3. 只更新内容，不修改结构 — 让文件格式在多次更新后保持稳定

---

## 局限性与批判

- **笔记质量不可控**：记笔记的 AI 用 Sonnet 模型，对于高度技术性的对话可能遗漏关键细节或产生不准确的摘要
- **只记主线对话**：子 Agent、Speculation 等辅助线程的工作不被记录，但这些辅助工作可能包含重要的探索结果
- **阈值调优困难**：`minimumMessageTokensToInit` 和 `minimumTokensBetweenUpdate` 等阈值通过 GrowthBook 远程配置，但最优值因用户工作模式而异——快节奏的调试会话和慢节奏的架构讨论需要不同的触发频率

---

## 代码落点

- `src/services/SessionMemory/sessionMemory.ts`，第 272 行：`extractSessionMemory` 函数（完整逻辑）
- `src/services/SessionMemory/sessionMemory.ts`，第 134 行：`shouldExtractMemory()` 触发逻辑
- `src/services/SessionMemory/prompts.ts`，第 11 行：`DEFAULT_SESSION_MEMORY_TEMPLATE` 模板内容
- `src/services/SessionMemory/prompts.ts`，第 43 行：`getDefaultUpdatePrompt()` 提示词（包含详细规则）
