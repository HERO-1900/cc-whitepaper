# Skill 加载基础设施完全解析

本章解析 Claude Code 的 Skill 插件加载机制——从内置技能、用户自定义 Markdown 文件到 MCP 远程技能，解析发现、元数据解析、按需加载的完整链路。

---

> **🌍 行业背景**：插件/技能扩展机制是 AI 编程工具的核心竞争力之一。**Cursor** 通过 `.cursorrules` 文件（纯文本提示词）实现项目级行为定制，但不支持参数化调用或远程技能加载。**Aider** 通过 `.aider.conf.yml` 和命令行参数定制行为，没有独立的插件系统。**GitHub Copilot** 通过 Copilot Extensions（基于 GitHub Apps）实现第三方扩展，采用 OAuth + API 的重量级方案。**Windsurf** 使用 `.windsurfrules` 文件，类似 Cursor 的纯文本方案。Claude Code 的 Skill 系统独特之处在于采用 **Markdown + YAML frontmatter** 作为统一格式，同时支持本地文件和 MCP 远程加载，兼顾了轻量级（手写 .md 文件即可发布技能）和可扩展性（MCP 协议连接远程服务）。这种"提示词即插件"的设计理念，在 AI 原生工具中正在形成一种新范式。

---

## 本章导读

Skill（技能）是 Claude Code 2.1.88 中用于扩展 AI 能力的插件机制。每个 Skill 本质上是一个 Markdown 文件（包含 YAML frontmatter 元数据和 Markdown 正文提示词），当用户通过 `/skill-name` 斜杠命令或 Claude 自动判断调用时，Skill 的内容会作为上下文注入到对话中。

**技术比喻（OS 视角）**：Skill 加载系统像操作系统中的**动态链接库（DLL/SO）加载器**——有内置库（bundled skills，相当于 libc），有用户安装的库（目录中的 .md 文件，相当于 /usr/lib 下的库），有远程仓库的库（MCP skills，相当于 apt 源的包）。加载器负责发现、解析元数据（frontmatter ≈ ELF header）、解决依赖（allowed-tools ≈ symbol resolution）、按需加载（getPromptForCommand ≈ dlopen）。

> 💡 **通俗理解**：Skill 像**手机 App Store**——有内置 App（bundled skills，如计算器、天气），有第三方 App（用户自己写的 .md 文件或从 MCP 加载的），每个 App 有说明书（frontmatter 元数据），安装后就能用（加载执行），不同的来源有不同的信任级别（内置 > 本地 > MCP）。

## 文件结构

| 文件 | 大小 | 职责 |
|------|------|------|
| `loadSkillsDir.ts` | 34KB | 核心加载器——目录扫描、frontmatter 解析、命令构建 |
| `bundledSkills.ts` | 7.5KB | 内置技能注册框架——编译进二进制的技能 |
| `mcpSkillBuilders.ts` | 1.6KB | MCP 技能适配器——打破循环依赖的注册表 |
| `bundled/` 目录 | 17+ 个文件 | 具体的内置技能实现（含辅助内容文件） |

加上 `bundled/` 目录下的技能文件（17 个技能注册 + 辅助文件），Skill 子系统总计约 20+ 个文件。

## 1. 技能来源分类

### 1.1 六种来源（含一种废弃兼容）

`loadSkillsDir.ts` 第 67-75 行定义了技能的来源类型：

```typescript
export type LoadedFrom =
  | 'commands_DEPRECATED'  // 旧 /commands 目录（已废弃，向后兼容保留）
  | 'skills'               // .claude/skills/ 目录
  | 'plugin'               // 插件提供的技能
  | 'managed'              // 企业管理的技能
  | 'bundled'              // 编译进二进制的内置技能
  | 'mcp'                  // MCP 服务器提供的技能
```

类型定义中包含六种来源。其中 `commands_DEPRECATED` 是旧版 `/commands` 目录的兼容入口，代码中仍然被处理（加载逻辑会扫描该目录并标记来源），但已不推荐使用。五种现行来源为 `skills`、`plugin`、`managed`、`bundled`、`mcp`。

### 1.2 目录层级

技能文件按层级存放，高层级覆盖低层级：

```typescript
export function getSkillsPath(
  source: SettingSource | 'plugin',
  dir: 'skills' | 'commands',
): string {
  switch (source) {
    case 'policySettings':    return join(getManagedFilePath(), '.claude', dir)
    case 'userSettings':      return join(getClaudeConfigHomeDir(), dir)
    case 'projectSettings':   return `.claude/${dir}`
    case 'plugin':            return 'plugin'
    default:                  return ''
  }
}
```

优先级从高到低：企业策略 → 项目级 → 用户级 → 插件 → 内置。

## 2. Frontmatter 解析

### 2.1 核心解析函数

`parseSkillFrontmatterFields`（第 185-265 行）是整个 Skill 系统最重要的函数，它从 YAML frontmatter 中提取所有元数据：

```typescript
export function parseSkillFrontmatterFields(
  frontmatter: FrontmatterData,
  markdownContent: string,
  resolvedName: string,
  descriptionFallbackLabel: 'Skill' | 'Custom command' = 'Skill',
): {
  displayName: string | undefined
  description: string
  hasUserSpecifiedDescription: boolean
  allowedTools: string[]
  argumentHint: string | undefined
  argumentNames: string[]
  whenToUse: string | undefined
  version: string | undefined
  model: ReturnType<typeof parseUserSpecifiedModel> | undefined
  disableModelInvocation: boolean
  userInvocable: boolean
  hooks: HooksSettings | undefined
  executionContext: 'fork' | undefined
  agent: string | undefined
  effort: EffortValue | undefined
  shell: FrontmatterShell | undefined
}
```

一个典型的 Skill Markdown 文件的 frontmatter 如下：

```yaml
---
name: Code Review
description: Review code for bugs and style issues
when_to_use: When the user asks for a code review or mentions PR review
allowed-tools: [Read, Grep, Glob]
argument-hint: <file-or-directory>
arguments: [path]
model: sonnet
effort: high
context: fork
user-invocable: true
---

You are a code review expert. Analyze the following code...
```

### 2.2 关键字段处理细节

**description 回退链**（第 208-214 行）：

```typescript
const validatedDescription = coerceDescriptionToString(
  frontmatter.description, resolvedName,
)
const description =
  validatedDescription ??
  extractDescriptionFromMarkdown(markdownContent, descriptionFallbackLabel)
```

如果 frontmatter 没有 description，则从 Markdown 正文中提取第一段作为描述。

**model 继承语义**（第 222-227 行）：

```typescript
const model =
  frontmatter.model === 'inherit'
    ? undefined                              // 继承主循环模型
    : frontmatter.model
      ? parseUserSpecifiedModel(frontmatter.model as string)
      : undefined                            // 未指定也继承
```

`model: inherit` 是一个显式声明——"使用当前对话的模型"，与省略 model 字段效果相同。

**effort 验证**（第 228-235 行）：

```typescript
const effortRaw = frontmatter['effort']
const effort = effortRaw !== undefined ? parseEffortValue(effortRaw) : undefined
if (effortRaw !== undefined && effort === undefined) {
  logForDebugging(
    `Skill ${resolvedName} has invalid effort '${effortRaw}'. ` +
    `Valid options: ${EFFORT_LEVELS.join(', ')} or an integer`,
  )
}
```

effort 支持预定义级别（如 `low`, `medium`, `high`）或整数值。

**agent 字段——子 Agent 类型指定**：

frontmatter 支持 `agent` 字段（`agent?: string`），`BundledSkillDefinition` 中也有对应定义。源码中 `command.ts` 的类型注释明确说明了其用途：

```typescript
// Agent type to use when forked (e.g., 'Bash', 'general-purpose')
// Only applicable when context is 'fork'
agent?: string
```

当技能声明 `context: fork` 时，它会在独立的子 Agent 中执行（拥有独立的上下文和 token 预算）。`agent` 字段进一步指定该子 Agent 的**类型**——例如 `'Bash'` 表示使用专注于 Shell 执行的 Agent，`'general-purpose'` 表示通用 Agent。这暗示 Claude Code 内部维护着多种 Agent 类型的定义，不同类型可能配备不同的工具集、系统提示词或行为策略。结合 `scheduleRemoteAgents.ts` 技能的存在，`agent` 字段是 Claude Code 多 Agent 架构的一个关键接口——Skill 不仅可以注入提示词，还可以声明式地指定由哪种 Agent 来执行，实现任务到执行者的路由。

**frontmatter 命名风格不一致（设计观察）**：

值得注意的是，frontmatter 字段的命名存在三种不同的风格混用：

| 命名风格 | 示例字段 |
|----------|----------|
| kebab-case（连字符） | `allowed-tools`、`argument-hint`、`user-invocable`、`disable-model-invocation` |
| snake_case（下划线） | `when_to_use` |
| camelCase（驼峰） | `userInvocable`（BundledSkillDefinition 中） |

这不是无关紧要的代码风格问题——它反映了 Skill schema 可能是多个迭代周期、多位开发者逐步添加字段的产物，缺乏统一的命名规范治理。对于一个快速迭代的产品来说这很常见（实用性优先于一致性），但随着字段数量增长（当前已有 15+ 个字段），这种不一致会增加 Skill 作者的认知负担——`user-invocable` 还是 `userInvocable`？`when_to_use` 还是 `when-to-use`？JSON Schema 可以通过别名（aliases）缓解这个问题，但纯 frontmatter 方案缺乏这种机制。

### 2.3 路径匹配（Skill Paths）

`parseSkillPaths` 函数（第 159-178 行）支持 gitignore 风格的路径模式：

```typescript
function parseSkillPaths(frontmatter: FrontmatterData): string[] | undefined {
  if (!frontmatter.paths) return undefined

  const patterns = splitPathInFrontmatter(frontmatter.paths)
    .map(pattern => {
      return pattern.endsWith('/**') ? pattern.slice(0, -3) : pattern
    })
    .filter((p: string) => p.length > 0)

  // 如果所有模式都是 **（匹配所有），视为未指定
  if (patterns.length === 0 || patterns.every((p: string) => p === '**')) {
    return undefined
  }
  return patterns
}
```

这允许技能声明它只在特定目录下激活，例如 `paths: src/components/**` 表示只在组件目录下可用。

## 3. 命令构建管线

### 3.1 createSkillCommand

`createSkillCommand` 函数（第 270-399 行）将解析后的元数据组装成一个可执行的 Command 对象：

```typescript
export function createSkillCommand({
  skillName, displayName, description, markdownContent,
  allowedTools, source, baseDir, loadedFrom, hooks, ...
}): Command {
  return {
    type: 'prompt',
    name: skillName,
    description,
    allowedTools,
    isHidden: !userInvocable,
    progressMessage: 'running',

    async getPromptForCommand(args, toolUseContext) {
      let finalContent = baseDir
        ? `Base directory for this skill: ${baseDir}\n\n${markdownContent}`
        : markdownContent

      // 1. 替换参数占位符
      finalContent = substituteArguments(finalContent, args, true, argumentNames)

      // 2. 替换 ${CLAUDE_SKILL_DIR}
      if (baseDir) {
        const skillDir = process.platform === 'win32'
          ? baseDir.replace(/\\/g, '/') : baseDir
        finalContent = finalContent.replace(/\$\{CLAUDE_SKILL_DIR\}/g, skillDir)
      }

      // 3. 替换 ${CLAUDE_SESSION_ID}
      finalContent = finalContent.replace(
        /\$\{CLAUDE_SESSION_ID\}/g, getSessionId()
      )

      // 4. 执行内嵌 Shell 命令（仅非 MCP 来源）
      if (loadedFrom !== 'mcp') {
        finalContent = await executeShellCommandsInPrompt(
          finalContent, toolUseContext, `/${skillName}`, shell
        )
      }

      return [{ type: 'text', text: finalContent }]
    },
  }
}
```

### 3.2 变量替换系统

Skill 正文支持三种变量替换：

| 变量 | 含义 | 示例 |
|------|------|------|
| `$1`, `$2`, `${argName}` | 用户传入的参数 | `/review $1` → `/review src/app.ts` |
| `${CLAUDE_SKILL_DIR}` | 技能文件所在目录 | 引用同目录下的参考文件 |
| `${CLAUDE_SESSION_ID}` | 当前会话 ID | 用于日志关联 |

### 3.3 MCP 安全隔离

注意第 372-376 行的安全限制：

```typescript
// Security: MCP skills are remote and untrusted — never execute inline
// shell commands (!`…` / ```! … ```) from their markdown body.
if (loadedFrom !== 'mcp') {
  finalContent = await executeShellCommandsInPrompt(...)
}
```

MCP 来源的技能**禁止执行内嵌 Shell 命令**。这是因为 MCP 服务器是远程的、不受信任的——如果允许它们在 Skill 内容中嵌入 Shell 命令，就等于给远程服务器任意代码执行的权限。

### 3.4 内嵌 Shell 执行的安全分析

`executeShellCommandsInPrompt` 是整个 Skill 系统中**最强大也最危险的特性**。它让 Skill 从"静态提示词模板"升级为"可执行的提示词"——Skill 正文中可以嵌入 Shell 命令（`!` 前缀行或 ` ```! ``` ` 代码块），加载时自动执行并将输出内联到提示词中。

```typescript
// promptShellExecution.ts 中的两种语法模式
const BLOCK_PATTERN = /```!\s*\n?([\s\S]*?)\n?```/g    // 代码块: ```! command ```
const INLINE_PATTERN = /(?<=^|\s)!`([^`]+)`/gm          // 内联: !`command`
```

**这意味着 Skill 文件在功能上等价于可执行程序**。一个放在 `.claude/skills/` 目录下的 Markdown 文件可以：

1. **通过内嵌 Shell 命令执行任意代码**：`!`git log --oneline -5`` 会在加载时直接执行
2. **通过 `allowed-tools` 请求工具访问权限**：如请求 BashTool、文件读写等
3. **通过 hooks 字段注册生命周期钩子**：在特定事件触发时执行额外逻辑

**安全防线分析**：

代码中确实存在权限检查——`executeShellCommandsInPrompt` 在执行每条命令前会调用 `hasPermissionsToUseTool`：

```typescript
const permissionResult = await hasPermissionsToUseTool(
  shellTool, { command }, context,
  createAssistantMessage({ content: [] }), '',
)
if (permissionResult.behavior !== 'allow') {
  throw new MalformedCommandError(
    `Shell command permission check failed for pattern "${match[0]}": ...`
  )
}
```

但需要注意的**供应链风险**：如果开源项目的 `.claude/skills/` 目录中被放入了恶意 Skill 文件（类似 `.github/workflows` 中的恶意 Action），用户 clone 后可能在不知情的情况下执行恶意命令。这与 Git hooks（`.git/hooks/`）的信任模型类似——区别在于 Git hooks 需要用户手动启用，而 Skill 文件在路径匹配后可能被 Claude 自动推荐调用。

**与 GitHub Actions `run:` 步骤的类比**：GitHub Actions 的 YAML 中 `run:` 字段允许执行 Shell 命令，社区为此建立了完善的审计工具链（Dependabot、CodeQL 扫描 workflow 文件等）。Skill 文件的 Shell 执行能力在性质上与之相同，但目前缺乏类似的静态分析和审计机制——Skill 的行为不是静态可分析的（Shell 命令的输出会影响最终的提示词内容）。

> 💡 **通俗理解**：普通 Skill 像菜谱——告诉厨师（Claude）怎么做菜。但带有 `!` Shell 命令的 Skill 像一个"会自己先去菜市场买菜"的菜谱——它在被使用之前就先执行了一些操作。这很方便（可以动态获取环境信息），但也意味着你需要信任菜谱的作者不会在"买菜"步骤中做坏事。

## 4. 内置技能系统（Bundled Skills）

### 4.1 注册框架

`bundledSkills.ts` 提供了内置技能的注册和管理：

```typescript
export type BundledSkillDefinition = {
  name: string
  description: string
  aliases?: string[]
  whenToUse?: string
  argumentHint?: string
  allowedTools?: string[]
  model?: string
  disableModelInvocation?: boolean
  userInvocable?: boolean
  isEnabled?: () => boolean
  hooks?: HooksSettings
  context?: 'inline' | 'fork'
  agent?: string
  files?: Record<string, string>  // 附带的参考文件
  getPromptForCommand: (args: string, context: ToolUseContext) =>
    Promise<ContentBlockParam[]>
}
```

注册接口采用与 Claude Code 内部其他子系统（如 `registerPostSamplingHook()`）相同的"启动时注册"模式——在模块初始化阶段将定义推入全局注册表：

```typescript
export function registerBundledSkill(definition: BundledSkillDefinition): void {
  const command: Command = {
    type: 'prompt',
    name: definition.name,
    source: 'bundled',
    loadedFrom: 'bundled',
    // ...
  }
  bundledSkills.push(command)
}
```

### 4.2 附带文件提取

内置技能可以包含参考文件（`files` 字段），这些文件在首次调用时解压到磁盘：

```typescript
if (files && Object.keys(files).length > 0) {
  skillRoot = getBundledSkillExtractDir(definition.name)
  let extractionPromise: Promise<string | null> | undefined
  const inner = definition.getPromptForCommand
  getPromptForCommand = async (args, ctx) => {
    extractionPromise ??= extractBundledSkillFiles(definition.name, files)
    const extractedDir = await extractionPromise
    const blocks = await inner(args, ctx)
    if (extractedDir === null) return blocks
    return prependBaseDir(blocks, extractedDir)
  }
}
```

这里使用了 Promise 记忆化（`extractionPromise ??= ...`）——多次并发调用只会触发一次提取操作。

### 4.3 安全写入

文件写入使用了防符号链接攻击的安全模式（第 176-193 行）：

```typescript
const O_NOFOLLOW = fsConstants.O_NOFOLLOW ?? 0
const SAFE_WRITE_FLAGS = process.platform === 'win32'
  ? 'wx'                                          // Windows 用字符串标志
  : fsConstants.O_WRONLY | fsConstants.O_CREAT |
    fsConstants.O_EXCL | O_NOFOLLOW               // Unix 用数字标志

async function safeWriteFile(p: string, content: string): Promise<void> {
  const fh = await open(p, SAFE_WRITE_FLAGS, 0o600)
  try {
    await fh.writeFile(content, 'utf8')
  } finally {
    await fh.close()
  }
}
```

使用 `O_EXCL`（文件存在则失败）+ `O_NOFOLLOW`（拒绝符号链接）+ `0o600`（仅所有者可读写）+ `0o700` 目录权限。注释解释了设计："The per-process nonce in getBundledSkillsRoot() is the primary defense against pre-created symlinks/dirs"——随机目录名是主要防御，文件系统标志是额外保障。

> **📚 课程关联**：这段代码是《操作系统》课程中**文件系统安全**的教科书案例。`O_EXCL | O_NOFOLLOW` 组合防御的是经典的 **TOCTOU（Time-of-Check to Time-of-Use）竞态攻击**——攻击者在检查文件不存在和创建文件之间的窗口期插入符号链接，将写入重定向到敏感文件（如 `/etc/passwd`）。`O_EXCL` 将检查和创建合并为原子操作，`O_NOFOLLOW` 拒绝解引用符号链接，随机目录名（nonce）则让攻击者无法预测目标路径。这是**纵深防御（Defense in Depth）**策略的典型实践。

### 4.4 具体内置技能

`bundled/` 目录包含 17 个内置技能注册（其中 10 个始终注册，7 个受 feature flag 或运行时条件控制）：

| 文件 | 技能名 | 用途 | 注册条件 |
|------|--------|------|----------|
| `updateConfig.ts` | update-config | 配置更新 | 始终注册 |
| `keybindings.ts` | keybindings | 快捷键配置 | 始终注册 |
| `verify.ts` | verify | 代码验证 | 始终注册 |
| `debug.ts` | debug | 调试辅助 | 始终注册 |
| `loremIpsum.ts` | lorem-ipsum | 测试数据生成 | 始终注册 |
| `skillify.ts` | skillify | 将操作转化为 Skill | 始终注册 |
| `remember.ts` | remember | 记忆管理 | 始终注册 |
| `simplify.ts` | simplify | 代码简化审查 | 始终注册 |
| `batch.ts` | batch | 批量处理 | 始终注册 |
| `stuck.ts` | stuck | 卡住时的辅助 | 始终注册 |
| `dream.ts` | dream | Dream 功能 | `KAIROS` / `KAIROS_DREAM` feature flag |
| `hunter.ts` | hunter | 审查工件 | `REVIEW_ARTIFACT` feature flag |
| `loop.ts` | loop | 循环执行任务 | `AGENT_TRIGGERS` feature flag |
| `scheduleRemoteAgents.ts` | schedule | 远程 Agent 调度 | `AGENT_TRIGGERS_REMOTE` feature flag |
| `claudeApi.ts` | claude-api | Claude API / SDK 使用指导 | `BUILDING_CLAUDE_APPS` feature flag |
| `claudeInChrome.ts` | claude-in-chrome | Chrome 扩展集成 | `shouldAutoEnableClaudeInChrome()` |
| `runSkillGenerator.ts` | run-skill-generator | Skill 生成器 | `RUN_SKILL_GENERATOR` feature flag |

注意：`bundled/` 目录中还有 `index.ts`（注册入口）、`claudeApiContent.ts`、`verifyContent.ts` 等辅助文件，它们不是独立技能，而是为对应技能提供内容数据。feature flag 控制的技能使用动态 `require()` 延迟加载，避免在该功能未启用时加载不必要的代码。

## 5. MCP 技能桥接

### 5.1 循环依赖问题

`mcpSkillBuilders.ts` 的存在纯粹是为了解决一个循环依赖问题。如注释所述：

```typescript
/**
 * Write-once registry for the two loadSkillsDir functions that MCP skill
 * discovery needs. This module is a dependency-graph leaf: it imports nothing
 * but types, so both mcpSkills.ts and loadSkillsDir.ts can depend on it
 * without forming a cycle (client.ts → mcpSkills.ts → loadSkillsDir.ts → …
 * → client.ts).
 */
```

依赖链条：`client.ts → mcpSkills.ts → loadSkillsDir.ts → ... → client.ts`，如果直接 import 就会形成循环。解决方案是将共享的两个函数通过注册表模式解耦：

```typescript
export type MCPSkillBuilders = {
  createSkillCommand: typeof createSkillCommand
  parseSkillFrontmatterFields: typeof parseSkillFrontmatterFields
}

let builders: MCPSkillBuilders | null = null

export function registerMCPSkillBuilders(b: MCPSkillBuilders): void {
  builders = b
}

export function getMCPSkillBuilders(): MCPSkillBuilders {
  if (!builders) {
    throw new Error(
      'MCP skill builders not registered — loadSkillsDir.ts has not been evaluated yet',
    )
  }
  return builders
}
```

注册发生在 `loadSkillsDir.ts` 的模块初始化阶段——由于 `commands.ts` 静态导入了 `loadSkillsDir.ts`，注册会在任何 MCP 服务器连接之前完成。

> **📚 课程关联**：这里的循环依赖打破策略是《软件工程》中**依赖倒置原则（DIP）**的实际应用。通过引入一个无依赖的"注册表"叶节点模块，将直接依赖转换为间接的运行时注册——本质上是**服务定位器模式（Service Locator Pattern）**。这也是 Java Spring 的 IoC 容器和 Angular 的依赖注入在解决循环依赖时采用的同族技术。

### 5.2 动态导入的陷阱

注释还提到了一个 Bun 打包的技术限制：

```
// The non-literal dynamic-import approach ("await import(variable)") fails at
// runtime in Bun-bundled binaries — the specifier is resolved against the
// chunk's /$bunfs/root/… path, not the original source tree
```

在 Bun 打包的二进制中，`await import(variablePath)` 会失败，因为路径解析指向虚拟文件系统（`$bunfs/root`）而非源码树。字面量动态导入可以工作，但会被依赖分析工具（dependency-cruiser）追踪到，产生新的循环依赖告警。

## 6. 文件去重机制

### 6.1 基于 realpath 的去重

`loadSkillsDir.ts` 第 118-124 行通过解析符号链接来检测重复文件：

```typescript
async function getFileIdentity(filePath: string): Promise<string | null> {
  try {
    return await realpath(filePath)
  } catch {
    return null
  }
}
```

注释引用了一个具体的 issue（#13893）："Uses realpath to resolve symlinks, which is filesystem-agnostic and avoids issues with filesystems that report unreliable inode values (e.g., inode 0 on some virtual/container/NFS filesystems, or precision loss on ExFAT)"

最初的实现可能使用了 inode 进行去重，但某些文件系统（ExFAT、NFS、容器虚拟 FS）的 inode 值不可靠（可能为 0 或溢出），所以改用 realpath。

### 6.2 Token 估算

```typescript
export function estimateSkillFrontmatterTokens(skill: Command): number {
  const frontmatterText = [skill.name, skill.description, skill.whenToUse]
    .filter(Boolean)
    .join(' ')
  return roughTokenCountEstimation(frontmatterText)
}
```

只对 frontmatter 进行 Token 估算（而非完整内容），因为技能内容是延迟加载的——只在调用时才读取。

## 7. Hooks 集成

技能可以通过 frontmatter 定义 hooks：

```typescript
function parseHooksFromFrontmatter(
  frontmatter: FrontmatterData,
  skillName: string,
): HooksSettings | undefined {
  if (!frontmatter.hooks) return undefined
  const result = HooksSchema().safeParse(frontmatter.hooks)
  if (!result.success) {
    logForDebugging(`Invalid hooks in skill '${skillName}': ${result.error.message}`)
    return undefined
  }
  return result.data
}
```

使用 Zod schema 进行验证，格式不正确的 hooks 会被安静地忽略（日志记录但不报错）。

## 批判性分析

### 优点

1. **统一的 Markdown 格式**：用 frontmatter + Markdown 作为技能描述格式是一个成熟且实用的选择（Hugo、Jekyll 等静态站点生成器早已验证了这种模式）——它人类可读、版本控制友好、易于编写，同时 frontmatter 提供了结构化元数据
2. **分层覆盖**：企业策略 > 项目 > 用户 > 内置的覆盖层级，既保证了企业合规需求，又给了个人用户足够的定制空间
3. **MCP 安全隔离**：禁止 MCP 来源的技能执行内嵌 Shell 命令，是正确的安全决策
4. **延迟加载**：只在技能被调用时才读取完整内容，减少了启动时的内存和 I/O 开销
5. **安全文件写入**：`O_EXCL | O_NOFOLLOW` + 随机目录名的防御组合非常专业

### 不足

1. **单文件巨无霸**：`loadSkillsDir.ts` 有 34KB，包含了解析、加载、构建、去重、Hooks 处理等过多职责，应该拆分
2. **`commands_DEPRECATED` 残留**：旧的 `/commands` 目录仍然被支持（LoadedFrom 类型中有 `commands_DEPRECATED`），这种兼容性负担何时清除没有明确计划
3. **缺乏版本兼容**：frontmatter 没有版本字段的标准化处理——虽然有 `version` 字段，但没有看到基于版本的兼容性检查逻辑
4. **MCP 技能的二等公民地位**：MCP 技能被禁止执行 Shell 命令、不能使用 `${CLAUDE_SKILL_DIR}`——这些限制是安全驱动的，但如果 MCP 服务器是可信的（如企业内部的），用户没有办法覆盖这些限制
5. **循环依赖的味道**：`mcpSkillBuilders.ts` 的存在说明模块间的依赖关系需要重构。使用运行时注册表来打破编译时循环依赖，虽然有效，但增加了"注册顺序"这个隐式约束——如果 MCP 服务器在 `loadSkillsDir.ts` 加载之前连接，系统会 throw
