# Claude Code 源码 vs 书籍覆盖率完全审计报告

> 审计时间：2026-04-02
> 源码版本：cc-recovered-main (2.1.88)
> 书籍位置：book/

---

## 总览统计

| 指标 | 数值 |
|------|------|
| 顶层目录数 | 35 |
| 总文件数 (TS/TSX/JS) | ~1,868 |
| 总代码行数 | ~480,000+ |
| 书籍章节数 | 43 (12+20+11) |
| 完全覆盖 (✅) | 14 个目录 |
| 部分覆盖 (⚠️) | 16 个目录 |
| 完全缺失 (❌) | 5 个目录 |

---

## 逐目录审计

### Directory: src/assistant/ (1 file, 87 lines)
**Summary:** 会话历史 API 客户端，从远程服务器分页拉取 SDK 消息历史。
**Coverage:** ⚠️ PARTIAL
**Missing topics:** `sessionHistory.ts` 的远程历史拉取机制（分页游标、API 端点）未被深入分析。仅在 Q16 远程驾驶章节提及 session 概念。
**Key files not analyzed:** `sessionHistory.ts`

---

### Directory: src/bootstrap/ (1 file, 1,767 lines)
**Summary:** 全局状态单例，保存整个应用的运行时上下文（模型配置、API Key、遥测 provider、信号系统等）。是整个系统的"脊柱"。
**Coverage:** ✅ COVERED
**Notes:** 在 02_启动序列、01_代码地图中有详细分析。Q01 专门讨论了 bootstrap 阶段的 import 前代码。

---

### Directory: src/bridge/ (31 files, 12,613 lines)
**Summary:** REPL Bridge 系统——实现 Claude Code 与外部 IDE（VS Code 等）的双向通信。包含 WebSocket 传输层、JWT 鉴权、会话管理、权限回调代理、调试工具等。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- 31 个文件仅在 Q16 中概述了远程驾驶的高层架构（211 行），但 bridge 本身有 12,613 行代码
- `bridgeMessaging.ts`、`bridgeMain.ts` 的消息路由协议未被深入分析
- `flushGate.ts` 的背压控制机制未被分析
- `capacityWake.ts` 的容量唤醒机制未被分析
- `trustedDevice.ts` 的设备信任链未被分析
- `inboundAttachments.ts`/`inboundMessages.ts` 的入站消息处理未被分析
- `workSecret.ts` 的密钥管理未被分析
- `pollConfig.ts` 的配置轮询机制未被分析
**Key files not analyzed:** `bridgeMain.ts`, `bridgeMessaging.ts`, `flushGate.ts`, `capacityWake.ts`, `trustedDevice.ts`, `workSecret.ts`

---

### Directory: src/buddy/ (6 files, 1,298 lines)
**Summary:** Companion/Buddy 宠物系统——终端里的小动物（duck、cat、axolotl 等），使用种子 PRNG 生成角色属性（物种、帽子、眼睛、稀有度），有独立的 sprite 渲染和对话提示词。
**Coverage:** ✅ COVERED
**Notes:** Q15 "终端里那只小动物是怎么活起来的" 专门分析了这个系统（267 行）。sprite 渲染、PRNG 生成等均有覆盖。

---

### Directory: src/cli/ (19 files, 12,353 lines)
**Summary:** CLI 核心架构——命令行参数解析、输出打印、退出处理、自动更新、NDJSON 安全序列化，以及多种传输层实现（SSE、WebSocket、CCR 客户端、混合传输、事件上传）。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- `transports/` 子目录（7 files）包含 SSETransport、WebSocketTransport、HybridTransport、CCR Client 等传输层实现，这些是客户端-服务端通信的核心，但书中未专门分析
- `handlers/` 子目录（6 files）的 CLI 子命令处理器（agents、auth、autoMode、MCP、plugins）未被分析
- `SerialBatchEventUploader.ts` 和 `WorkerStateUploader.ts` 的事件批量上传机制未被分析
**Key files not analyzed:** `transports/HybridTransport.ts`, `transports/SSETransport.ts`, `transports/WebSocketTransport.ts`, `handlers/autoMode.ts`

---

### Directory: src/commands/ (207 files, 26,449 lines)
**Summary:** 所有斜杠命令的实现——超过 80 个命令目录（compact、config、mcp、memory、voice、vim、tasks、review 等），加上顶层命令文件（commit.ts、init.ts 等）。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- Q20 "这个工具到底藏了多少命令" 做了命令清单式概览，但 207 个文件、26,449 行代码中大量实现细节未被深入
- 具体缺失的重要命令分析：`autofix-pr/`（自动修复 PR）、`bughunter/`（Bug 猎手）、`ctx_viz/`（上下文可视化）、`doctor/`（诊断工具）、`issue/`（Issue 处理）、`review/`（代码审查）、`teleport/`（远程传送）、`thinkback/`（思考回放）
- `commit-push-pr.ts` 的一键提交-推送-PR 流程未被分析
- `security-review.ts` 的安全审查命令未被分析
- `advisor.ts`、`insights.ts` 的 AI 顾问功能未被分析
**Key files not analyzed:** `autofix-pr/`, `bughunter/`, `ctx_viz/`, `doctor/`, `review/`, `thinkback/`, `teleport/`, `commit-push-pr.ts`

---

### Directory: src/components/ (389 files, 81,546 lines)
**Summary:** React/Ink UI 组件库——整个终端界面的视觉层。包含消息渲染、权限对话框、MCP 面板、任务面板、diff 查看器、设计系统、输入框、沙箱 UI、设置面板等。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- 这是代码量最大的目录（81,546 行），但 12_终端UI 章节仅 193 行
- `components/permissions/`（51 files, 12,155 lines）是一个庞大的权限 UI 子系统，01_权限系统完全解析主要分析逻辑层，UI 层未被深入
- `components/messages/`（41 files, 6,016 lines）消息渲染的完整组件树未被分析
- `components/PromptInput/`（21 files, 5,161 lines）输入框的完整实现未被分析
- `components/agents/`（26 files, 4,524 lines）Agent 面板 UI 未被分析
- `components/tasks/`（12 files, 3,938 lines）任务面板 UI 未被分析
- `components/mcp/`（13 files, 3,920 lines）MCP 面板 UI 未被分析
- `components/design-system/`（16 files, 2,238 lines）设计系统未被分析
- `components/grove/`（1 file, 462 lines）完全未被提及
- `components/StructuredDiff/`（2 files, 523 lines）结构化 diff 未被分析
- `components/FeedbackSurvey/`（9 files, 1,372 lines）反馈调查系统未被分析
- `components/teams/`（2 files, 793 lines）团队 UI 未被分析
**Key files not analyzed:** `permissions/` (整个子目录), `messages/` (整个子目录), `PromptInput/`, `design-system/`, `grove/`, `FeedbackSurvey/`, `StructuredDiff/`

---

### Directory: src/constants/ (21 files, 2,648 lines)
**Summary:** 全局常量定义——系统提示词分段标识、OAuth 配置、产品标识、工具限制、API 限制、错误码、XML 标签、Beta 特性标志等。
**Coverage:** ✅ COVERED
**Notes:** 在多个章节中引用了这些常量（03_提示词工厂引用 systemPromptSections，10_Token 经济学引用 apiLimits/toolLimits 等）。

---

### Directory: src/context/ (9 files, 1,004 lines)
**Summary:** React Context 提供者——FPS 指标、邮箱系统、模态框、通知、Overlay、提示词 Overlay、队列消息、统计数据、语音上下文。
**Coverage:** ⚠️ PARTIAL
**Missing topics:** 这些 React Context 作为 UI 层的状态管道，在 12_终端UI 中仅概略提及。`mailbox.tsx`（跨组件消息通信）、`QueuedMessageContext.tsx`（消息队列上下文）未被深入分析。

---

### Directory: src/coordinator/ (1 file, 369 lines)
**Summary:** 协调者模式——定义异步 Agent 的工具白名单、Scratchpad 权限检查、内部 Worker 工具集。是 Agent 编排系统中"leader"角色的核心配置。
**Coverage:** ✅ COVERED
**Notes:** 在 06_Agent编排、Part3 10_Agent与任务系统完全解析中有分析。coordinatorMode 作为 Agent 编排的关键概念被多次引用。

---

### Directory: src/entrypoints/ (8 files, 4,051 lines)
**Summary:** 应用入口点——CLI 入口 (`cli.tsx`)、初始化逻辑 (`init.ts`)、MCP server 入口 (`mcp.ts`)、SDK 类型定义 (`agentSdkTypes.ts`)、沙箱类型。
**Coverage:** ✅ COVERED
**Notes:** 02_启动序列详细分析了入口点的启动流程。SDK 入口也在 Q16 中有涉及。

---

### Directory: src/hooks/ (104 files, 19,204 lines)
**Summary:** React Hooks 集合——包含 80+ 个自定义 hooks（API Key 验证、取消请求、剪贴板、Diff 数据、动态配置、主题、语音输入等），加上通知子系统（16 files）和工具权限子系统（5 files）。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- 104 个文件、19,204 行代码，但书中仅在 12_终端UI 中概略提及 hooks 机制
- `hooks/toolPermission/`（5 files, 1,386 lines）工具权限相关 hooks 未被深入分析
- `hooks/notifs/`（16 files, 1,342 lines）通知系统的完整 hooks 未被分析
- 大量实用 hooks 未被分析：`useCommandQueue`、`useDirectConnect`、`useDynamicConfig`、`useBackgroundTaskNavigation` 等
- `useAwaySummary.ts` 的离开摘要 hook 未被分析
- `useDiffData.ts`/`useDiffInIDE.ts` 的 diff 查看 hooks 未被分析
**Key files not analyzed:** `toolPermission/`, `notifs/`, `useCommandQueue.ts`, `useDirectConnect.ts`, `useAwaySummary.ts`

---

### Directory: src/ink/ (96 files, 19,842 lines)
**Summary:** 分叉的 Ink 渲染引擎——Claude Code 自己维护的终端 React 渲染器。包含完整的 Yoga 布局引擎集成、React reconciler、DOM 节点系统、ANSI 渲染、事件系统（10 files）、终端 I/O 解析器（9 files: CSI/SGR/OSC/DEC/ESC）、组件库（18 files）、Hooks（12 files）、布局引擎（4 files）、搜索高亮、选择系统、Tab Stop、双向文本支持等。
**Coverage:** ⚠️ PARTIAL (严重不足)
**Missing topics:**
- 96 个文件、19,842 行代码，是一个完整的"终端浏览器引擎"，但 12_终端UI 仅 193 行，只有约 12 处提及 ink
- **reconciler.ts** — React fiber reconciler 的实现细节未被深入分析（这是理解整个 UI 渲染的核心）
- **layout/** — Yoga 布局引擎的集成（`engine.ts`, `geometry.ts`, `node.ts`, `yoga.ts`）未被分析
- **termio/** — 完整的终端协议解析器（9 files: CSI/SGR/OSC/DEC/ESC 序列的 tokenizer 和 parser）完全未被分析
- **events/** — 事件分发系统（10 files: click、focus、input、keyboard、terminal 事件）未被分析
- **dom.ts** — 虚拟 DOM 节点系统未被分析
- **render-node-to-output.ts / render-border.ts / render-to-screen.ts** — 渲染管线的三个阶段未被分析
- **optimizer.ts** — 输出优化器未被分析
- **selection.ts / searchHighlight.ts** — 文本选择和搜索高亮未被分析
- **bidi.ts** — 双向文本支持未被分析
- **tabstops.ts** — Tab Stop 系统未被分析
- **components/** 中的 ScrollBox、RawAnsi、AlternateScreen 等核心组件未被分析
**Key files not analyzed:** `reconciler.ts`, `dom.ts`, `layout/engine.ts`, `termio/parser.ts`, `events/dispatcher.ts`, `optimizer.ts`, `render-node-to-output.ts`, `selection.ts`

---

### Directory: src/keybindings/ (14 files, 3,159 lines)
**Summary:** 快捷键系统——默认绑定定义、用户自定义加载、键序列解析器、匹配器、解析器、模板系统、保留快捷键列表、校验器。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- 14 个文件、3,159 行代码的完整快捷键子系统，但书中仅在 12_终端UI 和 Q20 中简略提及
- `parser.ts`（键序列语法解析）、`resolver.ts`（绑定冲突解决）、`match.ts`（匹配算法）未被分析
- Chord 绑定（组合键序列）的实现未被分析
- `reservedShortcuts.ts` 的保留快捷键管理未被分析
**Key files not analyzed:** `parser.ts`, `resolver.ts`, `match.ts`, `schema.ts`

---

### Directory: src/memdir/ (8 files, 1,736 lines)
**Summary:** 自动记忆目录系统——管理 `.claude/memory/` 目录下的结构化记忆文件，包括记忆扫描、相关性匹配、记忆老化、团队记忆路径/提示词。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- Q18 "AI 的记忆是怎么跨越对话存活的" 和 Q09 "Session 里那个默默记笔记的 AI" 覆盖了记忆概念
- 但 `memdir/` 的具体实现（8 files, 1,736 lines）中的关键机制未被深入：
  - `memoryScan.ts` 的扫描算法
  - `findRelevantMemories.ts` 的相关性检索算法
  - `memoryAge.ts` 的记忆老化策略
  - `teamMemPaths.ts`/`teamMemPrompts.ts` 的团队记忆特有逻辑
**Key files not analyzed:** `memoryScan.ts`, `findRelevantMemories.ts`, `memoryAge.ts`

---

### Directory: src/migrations/ (11 files, 603 lines)
**Summary:** 配置迁移脚本——处理模型名称变更（Fennec->Opus, Sonnet1m->Sonnet4.5->Sonnet4.6）、设置格式升级（bypass permissions、auto updates、MCP servers 等）。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- 02_启动序列提到了 migration 的存在，但未深入分析具体迁移策略
- 模型名称变更的历史链条（Fennec -> Opus -> Opus1m -> Sonnet1m -> Sonnet4.5 -> Sonnet4.6）未被记录
- 迁移的执行时机和幂等性保证未被分析
**Key files not analyzed:** 所有 11 个迁移文件的具体逻辑

---

### Directory: src/moreright/ (1 file, 25 lines)
**Summary:** 内部功能的外部构建 stub——`useMoreRight` hook 是内部版本独有功能的占位符，外部版本只返回空操作。
**Coverage:** ⚠️ PARTIAL
**Missing topics:** 01_代码地图提到了它的存在，但未解释它在内部版本中的实际功能（可能是 Anthropic 内部的代码审查/权限扩展功能）。

---

### Directory: src/native-ts/ (4 files, 4,081 lines)
**Summary:** Native TypeScript 绑定——Yoga Layout 引擎的 TS 封装（枚举+API）、文件索引引擎、颜色差异计算。这些是性能关键路径的 native 模块。
**Coverage:** ❌ MISSING
**Missing topics:**
- 4,081 行代码完全未在书中分析
- `yoga-layout/` 的 TypeScript 绑定层（Yoga 是 Facebook 的 Flexbox 布局引擎，被 Ink 用于终端布局计算）
- `file-index/` 的文件索引引擎（可能是 Glob/Grep 工具的底层实现）
- `color-diff/` 的颜色差异计算（用于终端颜色匹配）
**Key files not analyzed:** 全部 4 个文件

---

### Directory: src/outputStyles/ (1 file, 98 lines)
**Summary:** 输出样式加载器——从 `.claude/output-styles/` 目录加载 Markdown 格式的自定义输出样式配置。
**Coverage:** ⚠️ PARTIAL
**Missing topics:** 12_终端UI 和 Q20 提及了 outputStyle 的存在，但加载机制（frontmatter 解析、多目录合并）未被分析。

---

### Directory: src/plugins/ (2 files, 182 lines)
**Summary:** 插件注册入口——内置插件列表和 bundled 插件的 index。
**Coverage:** ✅ COVERED
**Notes:** Part3 05_插件系统完全解析 和 Q12 有深入覆盖。此目录只是入口文件。

---

### Directory: src/query/ (4 files, 652 lines)
**Summary:** 查询循环配置——token 预算计算、停止钩子、查询配置、依赖注入。
**Coverage:** ✅ COVERED
**Notes:** 04_查询循环详细分析了查询循环机制。这些配置文件是辅助性质的。

---

### Directory: src/remote/ (4 files, 1,127 lines)
**Summary:** 远程会话管理——WebSocket 会话连接、远程权限桥接、SDK 消息适配器、远程会话管理器。用于 Claude Code Remote (CCR) 场景。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- Q16 "从浏览器远程驾驶终端 AI" 覆盖了高层概念
- 但 `SessionsWebSocket.ts` 的 WebSocket 协议细节、重连机制未被深入
- `RemoteSessionManager.ts` 的会话生命周期管理未被分析
- `sdkMessageAdapter.ts` 的消息类型转换逻辑未被分析
**Key files not analyzed:** `SessionsWebSocket.ts`, `RemoteSessionManager.ts`

---

### Directory: src/schemas/ (1 file, 222 lines)
**Summary:** Hooks schema 定义——使用 Zod v4 定义 hooks 配置的验证 schema。
**Coverage:** ✅ COVERED
**Notes:** Part3 04_Hooks子系统完全解析 中有覆盖。

---

### Directory: src/screens/ (3 files, 5,977 lines)
**Summary:** 三个主要屏幕组件——`REPL.tsx`（主交互界面）、`Doctor.tsx`（诊断屏幕）、`ResumeConversation.tsx`（恢复对话屏幕）。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- `REPL.tsx` 是整个应用最核心的 UI 入口（可能超过 3,000 行），但书中未对其结构做专门分析
- `Doctor.tsx` 的诊断系统未被分析
- `ResumeConversation.tsx` 的对话恢复流程未被分析
**Key files not analyzed:** `REPL.tsx` (主屏幕), `Doctor.tsx`

---

### Directory: src/server/ (3 files, 358 lines)
**Summary:** Direct Connect 服务器——创建直连会话、管理直连连接（WebSocket 双向通信，用于 SDK 直接连接模式）。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- Q16 提及了远程连接概念，但 DirectConnect 模式（不经过 Anthropic 中继的直连方式）未被专门分析
- 连接建立的 schema 验证、错误处理未被分析
**Key files not analyzed:** `directConnectManager.ts`, `createDirectConnectSession.ts`

---

### Directory: src/services/ (130 files, 53,680 lines)
**Summary:** 核心服务层——20 个子系统，包括 API 客户端(20 files, 10,477 lines)、MCP 服务(23 files, 12,310 lines)、Compact 压缩(11 files, 3,960 lines)、分析/遥测(9 files, 4,040 lines)、LSP(7 files, 2,460 lines)、OAuth(5 files, 1,051 lines)、工具服务(4 files, 3,113 lines)等。

#### Sub-audit by service:

| 子目录 | Files | Lines | Coverage |
|--------|-------|-------|----------|
| api/ | 20 | 10,477 | ⚠️ PARTIAL — API 客户端的重试机制、错误处理、多 provider 支持未深入 |
| mcp/ | 23 | 12,310 | ✅ COVERED — Part3 03_MCP平台完全解析 |
| compact/ | 11 | 3,960 | ⚠️ PARTIAL — Q02 概述了六套压缩机制(142行)，但 3,960 行实现细节不足 |
| analytics/ | 9 | 4,040 | ✅ COVERED — Part3 08_遥测与可观测性完全解析 |
| tools/ | 4 | 3,113 | ⚠️ PARTIAL — toolExecution.ts 的投机执行在 Part3 02 中有覆盖，但 tool 注册/调度逻辑不够深入 |
| lsp/ | 7 | 2,460 | ⚠️ PARTIAL — 代码地图提及 LSP 集成，但 LSPServerManager/LSPDiagnosticRegistry 未被深入 |
| teamMemorySync/ | 5 | 2,167 | ⚠️ PARTIAL — Q18 提及团队记忆同步，但同步协议细节未被分析 |
| plugins/ | 3 | 1,616 | ✅ COVERED — Part3 05_插件系统完全解析 |
| PromptSuggestion/ | 2 | 1,514 | ⚠️ PARTIAL — 概念在多处提及，但 1,514 行实现未被深入 |
| oauth/ | 5 | 1,051 | ⚠️ PARTIAL — OAuth 流程在启动序列中提及，但 5 文件的完整实现未被分析 |
| SessionMemory/ | 3 | 1,026 | ⚠️ PARTIAL — Q09 讨论了 Session 记忆概念 |
| remoteManagedSettings/ | 5 | 950 | ✅ COVERED — Part3 09_设置系统完全解析 |
| tips/ | 3 | 761 | ❌ MISSING — 提示/小贴士系统完全未被分析 |
| extractMemories/ | 2 | 769 | ⚠️ PARTIAL — Q09/Q18 覆盖概念，但提取算法未被深入 |
| policyLimits/ | 2 | 690 | ⚠️ PARTIAL — Token经济学中提及，但策略限制的详细实现未被分析 |
| settingsSync/ | 2 | 648 | ✅ COVERED — Part3 09_设置系统完全解析 |
| autoDream/ | 4 | 550 | ⚠️ PARTIAL — DreamTask 概念在 Q03/Part3 10 中被提及，但 autoDream 服务(自动触发机制、consolidation 锁、consolidation 提示词)未被分析 |
| MagicDocs/ | 2 | 381 | ❌ MISSING — Magic Docs(自动维护的文档系统)完全未被分析 |
| AgentSummary/ | 1 | 179 | ❌ MISSING — Agent 摘要服务完全未被分析 |
| toolUseSummary/ | 1 | 112 | ❌ MISSING — 工具使用摘要服务完全未被分析 |
| 根级文件 | 15 | ~5,000 | ⚠️ PARTIAL — voice.ts(语音录音)、vcr.ts(录制/回放)、preventSleep.ts 等未被分析 |

**Key files not analyzed:**
- `services/api/client.ts` — API 客户端核心
- `services/api/grove.ts` — Grove API（完全未提及）
- `services/api/sessionIngress.ts` — 会话入口
- `services/api/promptCacheBreakDetection.ts` — 缓存破坏检测
- `services/compact/` — 全部 11 个文件的深入分析
- `services/MagicDocs/` — 全部 2 个文件
- `services/autoDream/consolidationPrompt.ts` — 整合提示词
- `services/voice.ts` — 语音录制服务
- `services/vcr.ts` — VCR 录制/回放系统
- `services/lsp/LSPDiagnosticRegistry.ts` — LSP 诊断注册

---

### Directory: src/skills/ (20 files, 4,066 lines)
**Summary:** Skills 系统——内置技能定义（remember、loop、verify、batch、scheduleRemoteAgents、claudeApi、debug、stuck、simplify、skillify、keybindings、updateConfig、claudeInChrome 等），MCP skill 构建器，技能目录加载器。
**Coverage:** ✅ COVERED
**Notes:** Q13 "Skills 和斜杠命令有什么本质区别" 覆盖了 Skills 架构。09_扩展生态也有涉及。

---

### Directory: src/state/ (6 files, 1,190 lines)
**Summary:** 应用状态管理——AppState 类型定义、状态 Store（发布-订阅模式）、状态变更处理器、选择器（Selectors）、队友视图辅助函数。
**Coverage:** ✅ COVERED
**Notes:** 08_状态与持久化详细分析了状态管理架构。

---

### Directory: src/tasks/ (12 files, 3,286 lines)
**Summary:** 后台任务系统——5 种任务类型（DreamTask/后台整合、InProcessTeammateTask/进程内队友、LocalAgentTask/本地 Agent、LocalShellTask/本地 Shell、RemoteAgentTask/远程 Agent），加上 LocalMainSessionTask（主会话后台化）、类型定义、任务停止逻辑、标签渲染。types.ts 还引用了 LocalWorkflowTask 和 MonitorMcpTask。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- Part3 10_Agent与任务系统完全解析（241行）覆盖了整体架构
- 但以下具体任务实现未被深入分析：
  - `DreamTask/DreamTask.ts`（157 lines）— 后台"做梦"整合任务的详细机制
  - `InProcessTeammateTask/`（2 files, 246 lines）— 进程内队友任务
  - `LocalShellTask/`（3 files, 639 lines）— Shell 任务的进程管理和清理
  - `RemoteAgentTask/`（1 file, 855 lines）— 远程 Agent 任务的最大文件，WebSocket 通信细节
  - `LocalMainSessionTask.ts` — Ctrl+B 后台化主会话的机制完全未被提及
  - `LocalWorkflowTask` 和 `MonitorMcpTask` 在 types.ts 中被引用但源文件不在当前构建中
**Key files not analyzed:** `RemoteAgentTask.ts`, `LocalShellTask/`, `LocalMainSessionTask.ts`, `InProcessTeammateTask/`

---

### Directory: src/tools/ (184 files, 50,828 lines)
**Summary:** 全部工具实现——42 个工具子目录 + shared/ + testing/。包含 BashTool(18 files, 12,411 lines)、AgentTool(20 files, 6,782 lines)、PowerShellTool(14 files, 8,959 lines)、FileEditTool(6 files, 1,812 lines) 等。

#### Sub-audit by tool:

| 工具 | Files | Lines | Coverage |
|------|-------|-------|----------|
| **BashTool/** | 18 | 12,411 | ⚠️ PARTIAL — 安全架构和沙箱章节覆盖了 Sandbox/Seatbelt(35处)，但 12,411 行中 AST 解析、命令黑名单、heredoc 处理等未被深入 |
| **PowerShellTool/** | 14 | 8,959 | ❌ MISSING — 书中仅 3 处提及"powershell"，9,000 行实现完全未被分析 |
| **AgentTool/** | 20 | 6,782 | ⚠️ PARTIAL — Q03/06_Agent编排覆盖了 Fork/子Agent 概念，但 runAgent.ts、agentColorManager.ts、loadAgentsDir.ts 等细节未被深入 |
| **LSPTool/** | 6 | 2,005 | ⚠️ PARTIAL — 提及 LSP 集成存在，但 LSP 工具的完整实现未被分析 |
| **FileEditTool/** | 6 | 1,812 | ⚠️ PARTIAL — 在工具列表中提及，但 diff 算法、冲突处理未被深入 |
| **FileReadTool/** | 5 | 1,602 | ✅ COVERED — 在工具运行时章节中有分析 |
| **SkillTool/** | 4 | 1,477 | ✅ COVERED — Skills 系统章节覆盖 |
| **shared/** | 2 | 1,370 | ⚠️ PARTIAL — 工具共享逻辑未被深入 |
| **WebFetchTool/** | 5 | 1,131 | ⚠️ PARTIAL — 概念层面在权限系统中提及 |
| **MCPTool/** | 4 | 1,086 | ✅ COVERED — MCP 平台完全解析 |
| **SendMessageTool/** | 4 | 997 | ⚠️ PARTIAL — Agent 编排中提及 |
| **ConfigTool/** | 5 | 809 | ⚠️ PARTIAL |
| **GrepTool/** | 3 | 795 | ✅ COVERED |
| **BriefTool/** | 5 | 610 | ⚠️ PARTIAL |
| **ExitPlanModeTool/** | 4 | 605 | ⚠️ PARTIAL — PlanMode 机制在权限系统中提及 |
| **NotebookEditTool/** | 4 | 587 | ⚠️ PARTIAL — 在工具列表中提及 |
| **ToolSearchTool/** | 3 | 593 | ✅ COVERED |
| **WebSearchTool/** | 3 | 569 | ⚠️ PARTIAL |
| **ScheduleCronTool/** | 5 | 543 | ⚠️ PARTIAL — 仅在工具运行时概念层提及 |
| **TaskOutputTool/** | 2 | 584 | ⚠️ PARTIAL |
| **TaskUpdateTool/** | 3 | 484 | ⚠️ PARTIAL |
| **ExitWorktreeTool/** | 4 | 386 | ⚠️ PARTIAL — Worktree 概念在多处提及 |
| **TeamCreateTool/** | 4 | 359 | ⚠️ PARTIAL — Q14 团队协作中提及 |
| **EnterPlanModeTool/** | 4 | 329 | ⚠️ PARTIAL |
| **AskUserQuestionTool/** | 2 | 309 | ⚠️ PARTIAL |
| **TodoWriteTool/** | 3 | 300 | ⚠️ PARTIAL |
| **GlobTool/** | 3 | 267 | ✅ COVERED |
| **McpAuthTool/** | 1 | 215 | ⚠️ PARTIAL |
| **ReadMcpResourceTool/** | 3 | 210 | ⚠️ PARTIAL |
| **TaskCreateTool/** | 3 | 195 | ⚠️ PARTIAL |
| **RemoteTriggerTool/** | 3 | 192 | ⚠️ PARTIAL |
| **TaskStopTool/** | 3 | 179 | ⚠️ PARTIAL |
| **EnterWorktreeTool/** | 4 | 177 | ⚠️ PARTIAL |
| **TeamDeleteTool/** | 4 | 175 | ⚠️ PARTIAL |
| **ListMcpResourcesTool/** | 3 | 171 | ⚠️ PARTIAL |
| **SyntheticOutputTool/** | 1 | 163 | ⚠️ PARTIAL |
| **TaskGetTool/** | 3 | 153 | ⚠️ PARTIAL |
| **TaskListTool/** | 3 | 166 | ⚠️ PARTIAL |
| **FileWriteTool/** | 3 | 856 | ⚠️ PARTIAL |
| **REPLTool/** | 2 | 85 | ⚠️ PARTIAL |
| **SleepTool/** | 1 | 17 | ⚠️ PARTIAL |

**Key files not analyzed:**
- `BashTool/` 的 18 个文件中的 AST 分析、命令分类、安全过滤细节
- `PowerShellTool/` 全部 14 个文件（Windows 支持的完整实现）
- `AgentTool/runAgent.ts`、`agentColorManager.ts`、`loadAgentsDir.ts`
- `tools/shared/` 的工具共享逻辑

---

### Directory: src/types/ (11 files, 3,446 lines)
**Summary:** 类型定义——生成的 protobuf 类型（Google Timestamp、GrowthBook 实验事件、Claude Code 内部事件）、ID 类型、文本输入类型、插件类型、权限类型、日志类型、命令类型、Hooks 类型。
**Coverage:** ✅ COVERED
**Notes:** 类型定义作为基础设施在各章节中被引用。protobuf 生成的事件类型在遥测章节中有涉及。

---

### Directory: src/upstreamproxy/ (2 files, 740 lines)
**Summary:** CCR 上游代理——在 CCR 容器内运行，通过 WebSocket 建立 CONNECT 隧道到上游代理服务器，实现 TLS MITM（注入 org 级别的 API 密钥），支持 curl/gh/kubectl 等工具透过代理访问外部服务。
**Coverage:** ❌ MISSING
**Missing topics:**
- 02_启动序列仅提及 `upstreamproxy` 名字，但 740 行代码的完整实现未被分析
- CONNECT-over-WebSocket 的协议设计（为什么不能直接用 CONNECT：GKE L7 ingress 限制）
- UpstreamProxyChunk protobuf 消息格式
- session_token 的安全处理（prctl PR_SET_DUMPABLE=0 防止 ptrace）
- CA 证书注入和 TLS 信任链
- 环境变量注入（HTTPS_PROXY / SSL_CERT_FILE）
**Key files not analyzed:** `relay.ts`, `upstreamproxy.ts`

---

### Directory: src/utils/ (564 files, 180,472 lines)
**Summary:** 最大的目录——通用工具函数库。31 个子目录 + 298 个根级文件（90,759 行）。涵盖从 auth 到 bash 解析、从 MCP 到 swarm 的一切。

#### Sub-audit by major subdirectory:

| 子目录 | Files | Lines | Coverage |
|--------|-------|-------|----------|
| **plugins/** | 44 | 20,521 | ⚠️ PARTIAL — Part3 05 覆盖了插件架构，但 20,521 行的完整实现（DXT 格式解析、插件安全沙箱、插件输出样式加载等）未被深入 |
| **bash/** | 23 | 12,306 | ⚠️ PARTIAL — Bash 解析器的 AST 分析(ast.ts)、heredoc 处理、shell 补全、tree-sitter 分析等 12,306 行代码未被深入 |
| **permissions/** | 24 | 9,409 | ✅ COVERED — Part3 01_权限系统完全解析 |
| **swarm/** | 22 | 7,548 | ⚠️ PARTIAL (严重不足) — Q14(152行)概述了多实例协作，但 22 files/7,548 lines 中大量机制未被分析 |
| **settings/** | 19 | 4,562 | ✅ COVERED — Part3 09_设置系统完全解析 |
| **telemetry/** | 9 | 4,044 | ✅ COVERED — Part3 08_遥测与可观测性完全解析 |
| **hooks/** | 17 | 3,721 | ✅ COVERED — Part3 04_Hooks子系统完全解析 |
| **shell/** | 10 | 3,069 | ⚠️ PARTIAL — Shell 环境管理(检测、状态快照等)未被深入分析 |
| **nativeInstaller/** | 5 | 3,018 | ❌ MISSING — Native 安装器(macOS/Linux/Windows 的本地安装流程)完全未被分析 |
| **model/** | 16 | 2,710 | ⚠️ PARTIAL — 模型选择逻辑在 Token 经济学中提及，但 modelStrings、modelCost、多 provider routing 未被深入 |
| **claudeInChrome/** | 7 | 2,337 | ❌ MISSING — Claude in Chrome 集成(浏览器内运行 Claude Code)的 7 个文件完全未被深入分析 |
| **computerUse/** | 15 | 2,161 | ❌ MISSING — Computer Use 功能(屏幕控制、鼠标键盘操作)的 15 个文件完全未被分析 |
| **powershell/** | 3 | 2,305 | ❌ MISSING — PowerShell 工具的共享逻辑未被分析 |
| **processUserInput/** | 4 | 1,765 | ⚠️ PARTIAL — 用户输入处理管线未被深入分析 |
| **deepLink/** | 6 | 1,388 | ❌ MISSING — Deep Link 系统(协议注册、终端启动器、URL 解析)完全未被分析 |
| **task/** | 5 | 1,223 | ⚠️ PARTIAL — 任务管理辅助函数 |
| **suggestions/** | 5 | 1,213 | ⚠️ PARTIAL — 提示建议系统，概念层面在投机执行中提及 |
| **git/** | 3 | 1,075 | ⚠️ PARTIAL — Git 操作工具函数 |
| **sandbox/** | 2 | 997 | ✅ COVERED — Part3 07_Sandbox沙箱系统完全解析 |
| **teleport/** | 4 | 955 | ❌ MISSING — Teleport 系统(远程环境选择、Git Bundle、API)完全未被分析 |
| **secureStorage/** | 6 | 629 | ⚠️ PARTIAL — 02_启动序列提及，但 Keychain 集成细节未被深入 |
| **ultraplan/** | 2 | 476 | ❌ MISSING — UltraPlan 系统(可能是高级规划功能)仅在 Q20 中一笔带过 |
| **filePersistence/** | 2 | 413 | ❌ MISSING — 文件持久化机制完全未被分析 |
| **mcp/** | 2 | 457 | ✅ COVERED |
| **messages/** | 2 | 386 | ⚠️ PARTIAL |
| **background/** | 2 | 333 | ⚠️ PARTIAL |
| **dxt/** | 2 | 314 | ❌ MISSING — DXT(Desktop Extension)格式解析完全未被分析 |
| **skills/** | 1 | 311 | ✅ COVERED |
| **memory/** | 2 | 20 | ⚠️ PARTIAL |
| **todo/** | 1 | 18 | ⚠️ PARTIAL |
| **根级文件** | 298 | 90,759 | ⚠️ PARTIAL (严重不足) — 大量核心工具函数未被分析 |

**根级文件中的重要缺失:**
- `auth.ts`/`authPortable.ts`/`authFileDescriptor.ts` — 完整的认证系统（多 provider: API Key, OAuth, AWS, GCP, Vertex）
- `autoUpdater.ts` — 自动更新机制
- `aws.ts`/`gcp.ts`/`vertex.ts`/`foundry.ts` — 多云 provider 集成
- `billing.ts` — 计费逻辑
- `claudeMd.ts`/`claudeMdQuery.ts` — CLAUDE.md 加载的核心逻辑（Part3 06 覆盖了概念但可能未覆盖所有实现）
- `ansiToSvg.ts`/`ansiToPng.ts` — ANSI 到图片转换
- `asciicast.ts` — 终端录制格式
- `apiPreconnect.ts` — API 预连接优化
- `autoModeDenials.ts` — 自动模式拒绝追踪
- `argumentSubstitution.ts` — 参数替换逻辑
- `backgroundHousekeeping.ts` — 后台清理任务
- `managedEnv.ts` — 受管环境变量

**Key files not analyzed:**
- `utils/swarm/` 的 backends/（9 files: iTerm、Tmux、InProcess 三种后端的完整实现）
- `utils/bash/ast.ts`、`bashParser.ts`、`treeSitterAnalysis.ts`
- `utils/computerUse/` 全部 15 个文件
- `utils/claudeInChrome/` 全部 7 个文件
- `utils/nativeInstaller/` 全部 5 个文件
- `utils/deepLink/` 全部 6 个文件
- `utils/teleport/` 全部 4 个文件
- `utils/auth.ts` (认证核心)

---

### Directory: src/vim/ (5 files, 1,513 lines)
**Summary:** Vim 模式实现——动作（motions）、操作符（operators）、文本对象（textObjects）、状态转换（transitions）、类型定义。完整的 Vim 按键绑定模拟。
**Coverage:** ⚠️ PARTIAL
**Missing topics:**
- 12_终端UI 和 Q20 提及 Vim 模式存在，但 1,513 行的完整实现（motion 系统、operator 系统、text object 系统、状态机转换）未被分析
- Vim 状态机的设计模式未被分析
**Key files not analyzed:** `motions.ts`, `operators.ts`, `textObjects.ts`, `transitions.ts`

---

### Directory: src/voice/ (1 file, 54 lines)
**Summary:** 语音模式启用检查——GrowthBook kill switch、OAuth 认证检查、运行时完整检查。
**Coverage:** ✅ COVERED
**Notes:** Q17 "你的声音是怎么变成代码指令的" 详细分析了语音系统。此文件只是 gate 检查。

---

## 严重缺失总结（按重要性排序）

### 1. ❌ src/ink/ — 终端渲染引擎（96 files, 19,842 lines）
**书中仅 193 行的终端UI章节，覆盖率 <1%**
缺失：React reconciler、Yoga 布局集成、终端协议解析器（CSI/SGR/OSC/DEC/ESC）、事件系统、虚拟DOM、渲染管线、优化器

### 2. ❌ src/tools/PowerShellTool/ (14 files, 8,959 lines)
**完全未被分析的 Windows 支持核心**
缺失：PowerShell 命令执行、安全沙箱、脚本解析、参数过滤

### 3. ⚠️ src/utils/swarm/ (22 files, 7,548 lines)
**Q14 仅 152 行概述，覆盖率 ~2%**
缺失：iTerm/Tmux/InProcess 三种后端实现、leader-worker 权限同步、队友初始化流程、布局管理器、重连机制

### 4. ⚠️ src/tools/BashTool/ (18 files, 12,411 lines)
**安全章节覆盖了沙箱层，但 Bash 工具自身的解析/执行层严重不足**
缺失：Bash AST 解析器、命令分类注册表、heredoc 安全处理、shell 引号/转义处理、tree-sitter 分析

### 5. ⚠️ src/services/compact/ (11 files, 3,960 lines)
**Q02 仅 142 行概述六套机制，覆盖率 ~3.6%**
缺失：每种压缩策略的实现细节、压缩质量评估、上下文预算分配算法

### 6. ❌ src/native-ts/ (4 files, 4,081 lines)
**完全未被提及**
缺失：Yoga Layout TS 绑定、文件索引引擎、颜色差异算法

### 7. ❌ src/upstreamproxy/ (2 files, 740 lines)
**仅提及名字，实现完全未分析**
缺失：CONNECT-over-WebSocket 协议、TLS MITM、session token 安全处理

### 8. ❌ src/utils/computerUse/ (15 files, 2,161 lines)
**Computer Use 功能完全未被分析**
缺失：屏幕控制、鼠标键盘操作、MCP Server 集成、Swift 原生模块加载

### 9. ❌ src/utils/claudeInChrome/ (7 files, 2,337 lines)
**Claude in Chrome 浏览器集成未被深入分析**

### 10. ❌ src/utils/nativeInstaller/ (5 files, 3,018 lines)
**多平台本地安装器完全未被分析**

### 11. ❌ src/utils/deepLink/ (6 files, 1,388 lines)
**Deep Link 协议系统完全未被分析**

### 12. ❌ src/utils/teleport/ (4 files, 955 lines)
**Teleport 远程传送系统完全未被分析**

### 13. ❌ src/services/MagicDocs/ (2 files, 381 lines)
**Magic Docs 自动文档维护系统完全未被分析**

### 14. ❌ src/utils/ultraplan/ (2 files, 476 lines)
**UltraPlan 高级规划功能完全未被分析**

### 15. ❌ src/utils/dxt/ (2 files, 314 lines)
**DXT Desktop Extension 格式完全未被分析**

---

## 按代码体量的缺失率统计

| 类别 | 代码行数 | 占总量比 |
|------|----------|----------|
| 完全覆盖 (✅) | ~60,000 | ~12.5% |
| 部分覆盖 (⚠️) | ~370,000 | ~77% |
| 完全缺失 (❌) | ~50,000 | ~10.5% |

**注意：** "部分覆盖"中的大部分实际上只覆盖了概念层（10-20%的深度），真正有源码级深入分析的代码可能只占总量的 15-20%。最大的覆盖深度缺口在于：
1. **src/components/**（81,546 行）— UI 组件层只有概览级覆盖
2. **src/utils/ 根级文件**（90,759 行）— 大量工具函数未被任何章节深入
3. **src/services/api/**（10,477 行）— API 客户端层未被深入
4. **src/bridge/**（12,613 行）— IDE 桥接层未被深入
