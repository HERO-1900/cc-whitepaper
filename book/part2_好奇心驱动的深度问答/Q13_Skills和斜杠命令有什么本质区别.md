# Skills 和斜杠命令有什么本质区别？

在 Claude Code 中，"命令"和"Skills"看起来都是 Markdown 文件，都能通过 `/` 触发，但它们的设计哲学截然不同。命令是用户手动调用的工具，Skills 则是 AI 可以自主决策使用的能力——这个区别决定了它们在触发方式、加载机制和 token 效率上的差异。本章深入对比这两套系统，揭示从 Commands 到 Skills 的演进逻辑。

> 💡 **通俗理解**：打个比方，Skills 就像餐厅的菜单——厨师（AI）可以根据食客需求自主选择合适的菜品来搭配；而斜杠命令相当于服务铃——必须由食客（用户）亲手按下才会触发，服务员不会自己按铃。

---

### 🌍 行业背景

"用户手动触发"与"AI 自主调用"的能力区分，是 AI Agent 框架的核心设计问题。**LangChain** 的 Tool 系统从一开始就是 AI 自主调用的——Agent 根据任务描述（类似 `whenToUse`）自主决定使用哪个 Tool，用户没有手动触发的概念。**Cursor** 的 Rules 文件（`.cursorrules`）类似于 Claude Code 的 Skills——它们是项目级的指令文件，AI 自动读取并遵循，但用户不能通过命令手动触发一个 Rule。**Aider** 的 `/` 命令（如 `/run`、`/test`）全部是用户手动触发的，没有 AI 自主调用的能力层。**CodeX（OpenAI）** 通过 system prompt 中的指令和开源技能库（Figma/Linear 原生集成）定义 Agent 行为，其 Skills Library 的设计与 Claude Code 的 Skills 在概念上最为接近，但 CodeX 的技能更偏向"预定义领域集成"而非"AI 自主调度"。

Claude Code 的设计特点在于它**同时保留了两种模式**，并通过 `user-invocable` 字段允许同一个 Skill 在两种模式之间切换。从 Commands 到 Skills 的演进，反映了整个行业从"AI 作为工具"到"AI 作为自主 Agent"的认知转变。不过，这种"AI 自主触发"的设计也带来了可预测性的挑战——这是所有 Agent 框架共同面对的问题。

---

## 问题

Claude Code 里有"命令"（你手动输入 `/commit`），也有"Skills"（在 `.claude/skills/` 目录里）。文件格式看起来差不多，都是 Markdown。它们到底有什么不同？

---

## 本质区别：谁来触发

**命令**是用户触发的。你输入 `/build`，系统执行 `build.md` 里的提示词。

**Skills** 是 AI 可以自主触发的。这是关键区别。

---

## `whenToUse` 字段

Skills 有一个命令没有的 frontmatter 字段：

```markdown
---
description: 运行完整的测试套件
whenToUse: 当用户要求运行测试、验证代码正确性、或在提交代码之前时使用
allowed-tools: Bash
---

运行 `npm test` 并报告结果...
```

`whenToUse` 字段会被放进系统提示词，告诉 AI 在什么情况下应该调用这个 Skill。

这意味着用户可以不输入任何命令，只是说"帮我把这个 bug 修好然后提交"——AI 会自动识别"需要运行测试"然后调用对应的 Skill。

---

## 六种加载来源

Skills 来自六个不同的源，优先级不同：

| 来源 | 目录/方式 | 说明 |
|------|----------|------|
| `bundled` | 内置于 CLI 二进制 | 随 Claude Code 发布的内置技能 |
| `managed` | 企业策略目录 | 企业强制安装的 Skills |
| `userSettings` | `~/.claude/skills/` | 用户全局 Skills |
| `projectSettings` | `.claude/skills/` | 项目级 Skills |
| `plugin` | 插件的 skills/ 目录 | 插件提供的 Skills |
| `mcp` | MCP 服务器 | 通过 mcpSkillBuilders.ts 注册 |

还有 `commands_DEPRECATED`——这是旧的 `.claude/commands/` 目录，现已弃用，但仍支持。

---

## 四个额外的 frontmatter 字段

Skills 比命令支持更多的 frontmatter 配置：

**`user-invocable`**（默认 true）
```markdown
---
user-invocable: false
---
```
设为 false 时，这个 Skill 不会出现在 `/` 命令列表里，只有 AI 可以调用它。

**`context: fork`**
```markdown
---
context: fork
---
```
在隔离的上下文中执行（不影响主对话的状态）。

**`hooks`**
```markdown
---
hooks:
  PostToolUse:
    - hooks:
        - type: command
          command: echo "工具调用完成"
---
```
Skills 可以在自己的 frontmatter 里定义 hooks！这些 hooks 只在这个 Skill 执行期间生效。

**`paths`**
```markdown
---
paths:
  - "src/**/*.ts"
---
```
与 CLAUDE.md 的 `paths` 字段相同语义——只有当工作目录匹配这些路径时，这个 Skill 才会被加载到系统提示词中。

---

## BundledSkill：编译进二进制的技能

系统有一类特殊的 Skills——`BundledSkillDefinition`——它们不是文件，而是直接注册到系统里：

```typescript
registerBundledSkill({
  name: 'run-tests',
  description: '运行测试套件',
  whenToUse: '当需要验证代码正确性时',
  allowedTools: ['Bash'],
  getPromptForCommand: async (args, context) => {
    // 动态生成提示词
    return [{ type: 'text', text: '...' }]
  },
})
```

内置 Skills 可以携带文件（`files` 字段），这些文件在首次调用时解压到磁盘，让 AI 可以按需读取。这和 skills 文件夹里的 Markdown 文件是同等的——只是来源不同。

---

## Token 效率考量

Skills 系统有一个优化：**只估算 frontmatter 的 token 数**，而不加载完整内容：

```typescript
export function estimateSkillFrontmatterTokens(skill: Command): number {
  const frontmatterText = [skill.name, skill.description, skill.whenToUse]
    .filter(Boolean)
    .join(' ')
  return roughTokenCountEstimation(frontmatterText)
}
```

Skills 的完整内容（实际的提示词）只有在 AI 决定调用这个 Skill 时才被加载。这和"延迟加载"原则一致——只把 AI 做决策需要的最小信息放进 context。

> 📚 **课程关联**：这种"只加载元数据，按需加载完整内容"的策略与**操作系统**课程中的按需分页（demand paging）原理一致——页表项始终存在，但物理页帧只在首次访问时才从磁盘加载。在**数据库系统**中，这也类似于索引与数据分离的设计——B+树的内部节点只存储键值（类似 frontmatter），叶子节点才存储完整数据（类似 Skill 的提示词正文）。

---

## 从 Commands 到 Skills 的演进

`.claude/commands/` 目录现在标注为 `commands_DEPRECATED`。新的推荐方式是使用 `.claude/skills/`。

这个演进反映了一个认知的转变：**把 AI 的能力从"用户调用的工具"变成"AI 可以自主决策使用的能力"**。命令是用户界面的概念，Skills 是 AI 认知层面的概念。这种从命令式到声明式的演变在整个 AI Agent 领域都在发生——LangChain 从早期的 Sequential Chain（命令式流水线）演进到 Agent（自主决策），Semantic Kernel 从 Plugin 演进到 Planner，方向一致。

---

## 局限性与批判

- **AI 触发的不确定性**：Skills 依赖 AI 根据 `whenToUse` 描述自主判断何时调用，但模型可能在不恰当的场景触发 Skill，或者遗漏应该触发的场景
- **旧 commands 目录未完全迁移**：`commands_DEPRECATED` 仍然被支持，两套系统并存增加了理解和维护成本
- **frontmatter 能力边界不清**：Skills 的 `hooks`、`paths`、`context: fork` 等高级 frontmatter 字段缺乏文档说明，用户很难发现和正确使用这些能力

---

## 代码落点

- `src/skills/` — Skills 系统顶层目录
- `src/tools/SkillTool/` — Skill 工具调用实现
- `src/skills/loadSkillsDir.ts`，第 67-73 行：`LoadedFrom` 类型定义（6 种来源）
- `src/skills/loadSkillsDir.ts`，第 185-250 行：`parseSkillFrontmatterFields()`（Skills frontmatter 解析）
- `src/skills/bundledSkills.ts`，第 15-41 行：`BundledSkillDefinition` 类型
- `src/skills/bundledSkills.ts`，第 53 行：`registerBundledSkill()` 函数
- `src/skills/loadSkillsDir.ts`，第 100-105 行：`estimateSkillFrontmatterTokens()`（延迟加载优化）
