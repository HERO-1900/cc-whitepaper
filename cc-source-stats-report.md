# Claude Code 2.1.88 源码全量统计报告

> 扫描时间: 2026-04-05
> 源码路径: `~/Desktop/Claude Code源代码合集 copy/Claude Code源代码1号/cc-recovered-main/src/`
> 扫描方法: find + wc + grep 实际计数，非估算

---

## 1. 全局维度

### 1.1 文件总数: 1,902 个

| 扩展名 | 文件数 | 占比 |
|--------|--------|------|
| .ts    | 1,332  | 70.0% |
| .tsx   | 552    | 29.0% |
| .js    | 18     | 0.9% |
| **合计** | **1,902** | **100%** |

### 1.2 代码行数 (LOC): 512,695 行

| 扩展名 | 行数 | 占比 |
|--------|------|------|
| .ts    | 380,006 | 74.1% |
| .tsx   | 132,668 | 25.9% |
| .js    | 21      | 0.004% |
| **合计** | **512,695** | **100%** |

**有效代码行 (非空行):** 476,875 行 (93.0%)
**空白行:** 35,799 行 (7.0%)

### 1.3 目录结构: 35 个顶层子系统 + 18 个根文件

| 目录 | 文件数 | 行数 | 说明 |
|------|--------|------|------|
| utils | 564 | 180,472 | 工具函数库 (占总量 35.2%) |
| components | 389 | 81,546 | React UI 组件 |
| services | 130 | 53,680 | 后端服务层 |
| tools | 184 | 50,828 | AI 工具定义 |
| commands | 207 | 26,449 | 斜杠命令系统 |
| hooks | 104 | 19,204 | React 自定义 Hooks |
| ink | 96 | 19,842 | Ink 终端 UI 框架 |
| bridge | 31 | 12,613 | IDE 桥接层 |
| cli | 19 | 12,353 | CLI 主入口 |
| (根文件) | 18 | 11,969 | main.tsx 等核心入口 |
| screens | 3 | 5,977 | 页面级组件 |
| entrypoints | 8 | 4,051 | 启动入口 |
| skills | 20 | 4,066 | 技能系统 |
| native-ts | 4 | 4,081 | 原生 TS 绑定 |
| types | 11 | 3,446 | 类型定义 |
| tasks | 12 | 3,286 | 任务管理 |
| keybindings | 14 | 3,159 | 快捷键系统 |
| constants | 21 | 2,648 | 常量定义 |
| memdir | 8 | 1,736 | 记忆目录系统 |
| bootstrap | 1 | 1,767 | 启动引导 |
| vim | 5 | 1,513 | Vim 模式 |
| buddy | 6 | 1,298 | Buddy/伴侣功能 |
| state | 6 | 1,190 | 全局状态管理 |
| remote | 4 | 1,127 | 远程连接 |
| context | 9 | 1,004 | React Context |
| upstreamproxy | 2 | 740 | 上游代理 |
| query | 4 | 652 | 查询引擎 |
| migrations | 11 | 603 | 数据迁移 |
| coordinator | 1 | 369 | 协调器 |
| server | 3 | 358 | 服务端 |
| schemas | 1 | 222 | 数据模式 |
| plugins | 2 | 182 | 插件系统入口 |
| outputStyles | 1 | 98 | 输出样式 |
| assistant | 1 | 87 | Assistant 定义 |
| voice | 1 | 54 | 语音功能 |
| moreright | 1 | 25 | 权限扩展 |

**总目录数:** 301 个 (含所有嵌套)
**最大嵌套深度:** 6 层

---

## 2. 模块/子系统维度

### 2.1 主要子系统: 35 个顶层模块

按规模排序前 5:
1. **utils** — 564 文件 / 180,472 行 (巨型工具箱)
2. **components** — 389 文件 / 81,546 行 (UI 组件库)
3. **services** — 130 文件 / 53,680 行 (服务层)
4. **tools** — 184 文件 / 50,828 行 (AI 工具)
5. **commands** — 207 文件 / 26,449 行 (命令系统)

### 2.2 Top 20 最大文件 (按 LOC)

| 排名 | 文件 | 行数 | 所属子系统 |
|------|------|------|-----------|
| 1 | cli/print.ts | 5,594 | CLI 输出 |
| 2 | utils/messages.ts | 5,512 | 消息处理 |
| 3 | utils/sessionStorage.ts | 5,105 | 会话存储 |
| 4 | utils/hooks.ts | 5,022 | Hook 工具 |
| 5 | screens/REPL.tsx | 5,005 | REPL 主界面 |
| 6 | main.tsx | 4,684 | 应用主入口 |
| 7 | utils/bash/bashParser.ts | 4,436 | Bash 解析器 |
| 8 | utils/attachments.ts | 3,997 | 附件处理 |
| 9 | services/api/claude.ts | 3,419 | Claude API 客户端 |
| 10 | services/mcp/client.ts | 3,348 | MCP 客户端 |
| 11 | utils/plugins/pluginLoader.ts | 3,302 | 插件加载器 |
| 12 | commands/insights.ts | 3,200 | 洞察命令 |
| 13 | bridge/bridgeMain.ts | 2,999 | IDE 桥接主逻辑 |
| 14 | utils/bash/ast.ts | 2,679 | Bash AST |
| 15 | utils/plugins/marketplaceManager.ts | 2,643 | 插件市场 |
| 16 | tools/BashTool/bashPermissions.ts | 2,621 | Bash 权限控制 |
| 17 | tools/BashTool/bashSecurity.ts | 2,592 | Bash 安全检查 |
| 18 | native-ts/yoga-layout/index.ts | 2,578 | Yoga 布局引擎 |
| 19 | services/mcp/auth.ts | 2,465 | MCP 认证 |
| 20 | bridge/replBridge.ts | 2,406 | REPL 桥接 |

### 2.3 最小 10 个非空 .ts 文件 (均为 1 行)

| 文件 | 行数 |
|------|------|
| components/Spinner/teammateSelectHint.ts | 1 |
| constants/messages.ts | 1 |
| tools/ConfigTool/constants.ts | 1 |
| tools/EnterPlanModeTool/constants.ts | 1 |
| tools/EnterWorktreeTool/constants.ts | 1 |
| tools/ExitWorktreeTool/constants.ts | 1 |
| tools/SendMessageTool/constants.ts | 1 |
| tools/SkillTool/constants.ts | 1 |
| tools/TaskCreateTool/constants.ts | 1 |
| tools/TaskGetTool/constants.ts | 1 |

> 这些 1 行文件多为工具的常量导出 (toolName)

---

## 3. Prompt 维度

| 指标 | 数值 |
|------|------|
| 文件名含 "prompt" 的文件 | **80 个** |
| 包含 prompt/template 关键词的文件 | **537 个** |
| 包含 systemPrompt 模式的文件 | **111 个** |
| systemPrompt 模式出现总次数 | **559 次** |
| getSystemPrompt 引用次数 | **74 次** |
| buildPrompt/buildSystemPrompt 引用次数 | **11 次** |
| 工具级 prompt.ts 文件 (tools/*/prompt.ts) | **36 个** |
| 系统级 prompt 文件 (constants/prompts.ts 等) | **5 个** |
| 服务级 prompt 文件 (services/*/prompt*.ts) | **7 个** |

### Prompt 文件分布

- **tools/** 下 36 个 prompt.ts — 每个工具独立的 prompt 描述
- **services/** 下 7 个 — compact/prompt.ts, extractMemories/prompts.ts, SessionMemory/prompts.ts, MagicDocs/prompts.ts, autoDream/consolidationPrompt.ts, api/dumpPrompts.ts, PromptSuggestion/promptSuggestion.ts
- **utils/** 下 8 个 — systemPrompt.ts, handlePromptSubmit.ts, promptEditor.ts, promptCategory.ts, promptShellExecution.ts 等
- **constants/** 下 2 个 — prompts.ts, systemPromptSections.ts
- **components/** 下 21 个 — PromptInput/ 组件群 (11 个) + 权限/消息相关
- **hooks/** 下 2 个 — usePromptsFromClaudeInChrome.tsx, usePromptSuggestion.ts
- **buddy/** 下 1 个 — prompt.ts

---

## 4. 安全维度

| 指标 | 数值 |
|------|------|
| 安全关键词出现次数 (deny/block/reject/forbidden/security) | **4,709 次** |
| 涉及安全关键词的文件数 | **621 个** (占总文件 32.7%) |
| 权限关键词出现次数 (permission/allow/authorized/authorize) | **5,160 次** |
| 涉及权限关键词的文件数 | **626 个** (占总文件 32.9%) |

> 安全+权限相关代码密度极高，近 1/3 的文件涉及安全逻辑

### 安全关键文件

- `tools/BashTool/bashSecurity.ts` — 2,592 行，Bash 命令安全检查
- `tools/BashTool/bashPermissions.ts` — 2,621 行，Bash 权限管理
- `utils/permissions/` — 24 文件 / 9,409 行，权限子系统
- `components/permissions/` — 51 文件，权限 UI 组件

---

## 5. 工具维度

### 5.1 工具定义: 40 个独立工具

| 序号 | 工具名 | 类别 |
|------|--------|------|
| 1 | AgentTool | 子 Agent |
| 2 | AskUserQuestionTool | 用户交互 |
| 3 | BashTool | 命令执行 |
| 4 | BriefTool | 简要模式 |
| 5 | ConfigTool | 配置管理 |
| 6 | EnterPlanModeTool | 计划模式 |
| 7 | EnterWorktreeTool | 工作树 |
| 8 | ExitPlanModeTool | 退出计划 |
| 9 | ExitWorktreeTool | 退出工作树 |
| 10 | FileEditTool | 文件编辑 |
| 11 | FileReadTool | 文件读取 |
| 12 | FileWriteTool | 文件写入 |
| 13 | GlobTool | 文件搜索 |
| 14 | GrepTool | 内容搜索 |
| 15 | ListMcpResourcesTool | MCP 资源列表 |
| 16 | LSPTool | LSP 集成 |
| 17 | McpAuthTool | MCP 认证 |
| 18 | MCPTool | MCP 调用 |
| 19 | NotebookEditTool | Notebook 编辑 |
| 20 | PowerShellTool | PowerShell |
| 21 | ReadMcpResourceTool | MCP 资源读取 |
| 22 | RemoteTriggerTool | 远程触发 |
| 23 | REPLTool | REPL 执行 |
| 24 | ScheduleCronTool | 定时任务 |
| 25 | SendMessageTool | 消息发送 |
| 26 | SkillTool | 技能调用 |
| 27 | SleepTool | 等待/睡眠 |
| 28 | SyntheticOutputTool | 合成输出 |
| 29 | TaskCreateTool | 任务创建 |
| 30 | TaskGetTool | 任务查询 |
| 31 | TaskListTool | 任务列表 |
| 32 | TaskOutputTool | 任务输出 |
| 33 | TaskStopTool | 任务停止 |
| 34 | TaskUpdateTool | 任务更新 |
| 35 | TeamCreateTool | 团队创建 |
| 36 | TeamDeleteTool | 团队删除 |
| 37 | TodoWriteTool | TODO 写入 |
| 38 | ToolSearchTool | 工具搜索 |
| 39 | WebFetchTool | 网页获取 |
| 40 | WebSearchTool | 网页搜索 |

**工具目录总文件数:** 184 个 (含 shared/ 和 testing/)
**工具目录总行数:** 50,828 行
**含 inputSchema 的工具文件:** 41 个
**含 userFacingName 的工具文件:** 40 个
**工具级 description: 出现次数:** 65 次

### 5.2 MCP 相关

| 指标 | 数值 |
|------|------|
| MCP 关键词总出现次数 | **5,718 次** |
| 涉及 MCP 的文件数 | **422 个** (22.2%) |
| MCP Server 相关 | **2,240 次** |
| MCP Client 相关 | **493 次** |
| MCP Tool 相关 | **772 次** |

---

## 6. 测试维度

| 指标 | 数值 |
|------|------|
| .test.ts / .spec.ts 文件 | **0 个** |
| __tests__ 目录 | **0 个** |
| testing/ 目录文件 | **1 个** (tools/testing/TestingPermissionTool.tsx) |
| mock/stub/spy 出现次数 | **98 次** |
| 涉及 mock/stub/spy 的文件 | **49 个** |
| vitest/jest import | **0 个** |

> 注: 源码中不包含测试文件，测试代码可能在独立仓库或构建时剥离。mock 相关代码存在于运行时代码中 (如 mock-limits 命令)。

---

## 7. 依赖维度

### 7.1 Import 统计

| 指标 | 数值 |
|------|------|
| import 语句总数 | **16,029 条** |
| 内部相对引用 (../) | **8,732 条** |
| 内部同级引用 (./) | **3,443 条** |
| **内部引用合计** | **12,175 条** (75.9%) |
| 外部包引用 | **4,000 条** (24.1%) — 注:含 Node.js 内置模块 |

### 7.2 package.json 依赖

| 类型 | 数量 |
|------|------|
| dependencies | **93 个** |
| devDependencies | **1 个** |
| **合计** | **94 个** |

### 7.3 Top 20 最常引用的外部包

| 排名 | 包名 | 引用次数 |
|------|------|----------|
| 1 | react | 756 |
| 2 | react/compiler-runtime | 395 |
| 3 | path | 253 |
| 4 | bun:bundle | 196 |
| 5 | fs/promises | 146 |
| 6 | zod/v4 | 125 |
| 7 | crypto | 122 |
| 8 | figures | 89 |
| 9 | lodash-es/memoize.js | 65 |
| 10 | os | 59 |
| 11 | axios | 57 |
| 12 | fs | 53 |
| 13 | @anthropic-ai/sdk | 53+24=77 |
| 14 | chalk | 47 |
| 15 | child_process | 25 |

### 7.4 Top 20 最常引用的内部模块

| 排名 | 模块路径 | 引用次数 |
|------|----------|----------|
| 1 | ink.js | 240+145=385 |
| 2 | Tool.js | 165 |
| 3 | commands.js | 127 |
| 4 | bootstrap/state.js | 126+90=216 |
| 5 | types.js (本地) | 107 |
| 6 | debug.js | 96+85+73+83=337 |
| 7 | utils/errors.js | 95 |
| 8 | utils/log.js | 87 |
| 9 | types/message.js | 81+71=152 |
| 10 | utils/slowOperations.js | 80 |
| 11 | services/analytics/index.js | 78 |
| 12 | envUtils.js | 69+69=138 |
| 13 | state/AppState.js | 64 |

### 7.5 关键依赖分类

| 类别 | 包名 | 数量 |
|------|------|------|
| **Anthropic SDK** | @anthropic-ai/sdk, bedrock-sdk, vertex-sdk, foundry-sdk, claude-agent-sdk, mcpb, sandbox-runtime | 7 |
| **AWS SDK** | @aws-sdk/client-bedrock, client-bedrock-runtime, client-sts, credential-provider-node, credential-providers | 5 |
| **OpenTelemetry** | @opentelemetry/* (api, core, exporters, sdk) | 18 |
| **MCP** | @modelcontextprotocol/sdk | 1 |
| **React/UI** | react, react-reconciler, ink, chalk, figures, cli-boxes, emoji-regex, wrap-ansi | 8 |
| **解析/处理** | marked, turndown, highlight.js, cli-highlight, diff, shell-quote, yaml, jsonc-parser | 8 |
| **安全** | xss, ignore | 2 |
| **Schema** | zod, ajv | 2 |
| **网络** | axios, undici, ws, https-proxy-agent | 4 |

---

## 8. 命令系统维度

### 8.1 斜杠命令: 86 个子目录 + 12 个根命令文件

**根命令文件 (12):** advisor, bridge-kick, brief, commit, commit-push-pr, createMovedToPluginCommand, init, init-verifiers, insights, review, security-review, version

**子目录命令 (86):** remote-setup, ide, vim, sandbox-toggle, perf-issue, btw, upgrade, install-github-app, stickers, tasks, compact, branch, context, autofix-pr, memory, keybindings, add-dir, config, plan, effort, bridge, color, resume, doctor, cost, passes, plugin, output-style, break-cache, fast, teleport, terminalSetup, agents, desktop, diff, logout, usage, rewind, mcp, status, backfill-sessions, remote-env, release-notes, permissions, ctx_viz, reload-plugins, feedback, extra-usage, env, clear, reset-limits, install-slack-app, voice, theme, mobile, issue, hooks, review, chrome, model, rate-limit-options, files, exit, thinkback-play, copy, rename, skills, ant-trace, heapdump, thinkback, export, privacy-settings, mock-limits, good-claude, tag, oauth-refresh, login, bughunter, stats, pr_comments, onboarding, summary, help, share, debug-tool-call, session

**命令总文件数:** 207 个
**命令总行数:** 26,449 行

---

## 9. Hook 系统维度

| 指标 | 数值 |
|------|------|
| Hook 文件数 | **104 个** |
| Hook 总行数 | **19,204 行** |
| 独立 Hook 函数 (use* 模式) | **94 个** |

---

## 10. 技能系统维度

| 指标 | 数值 |
|------|------|
| skills/ 目录总文件数 | **20 个** |
| 内置技能 (bundled/) | **17 个** |

**内置技能列表:** batch, claudeApi, claudeApiContent, claudeInChrome, debug, keybindings, loop, loremIpsum, remember, scheduleRemoteAgents, simplify, skillify, stuck, updateConfig, verify, verifyContent, index

---

## 11. 服务层维度

### services/ 下 20 个子服务

| 服务 | 说明 |
|------|------|
| AgentSummary | Agent 摘要 |
| analytics | 分析追踪 |
| api | API 客户端 (含 claude.ts 3,419 行) |
| autoDream | 自动做梦/灵感 |
| compact | 上下文压缩 |
| extractMemories | 记忆提取 |
| lsp | 语言服务器协议 |
| MagicDocs | 魔法文档 |
| mcp | MCP 协议 (含 client.ts 3,348 行) |
| oauth | OAuth 认证 |
| plugins | 插件服务 |
| policyLimits | 策略限制 |
| PromptSuggestion | Prompt 建议 |
| remoteManagedSettings | 远程设置 |
| SessionMemory | 会话记忆 |
| settingsSync | 设置同步 |
| teamMemorySync | 团队记忆同步 |
| tips | 提示系统 |
| tools | 工具服务 |
| toolUseSummary | 工具使用摘要 |

---

## 12. 代码质量维度

### 12.1 TODO/FIXME/HACK

| 类型 | 数量 |
|------|------|
| TODO | **138** |
| FIXME | **0** |
| HACK | **0** |

### 12.2 类型系统

| 类型 | 数量 |
|------|------|
| interface 定义 | **83 个** |
| type 定义 (type X = ...) | **2,363 个** |
| enum 定义 | **0 个** |
| const enum 定义 | **1 个** |
| Zod schema 定义 | **1,666 处** |
| 使用 Zod 的文件 | **130 个** |

> 注: 类型系统高度依赖 `type` 而非 `interface`，比例约 28.5:1。完全不使用 `enum`，改用联合类型 + Zod。

### 12.3 函数/方法统计

| 类型 | 数量 |
|------|------|
| export function | **4,215** |
| export const | **1,275** |
| export default function | **12** |
| async function | **1,736** |
| async 箭头函数 | **609** |
| **异步函数合计** | **2,345** |

### 12.4 错误处理

| 类型 | 数量 |
|------|------|
| try { | **1,931** |
| catch( | **1,425** |
| throw new | **683** |

### 12.5 注释

| 类型 | 数量 |
|------|------|
| 单行注释 (//) | **44,294 行** |
| 多行注释 (/*) | **8,189 处** |
| JSDoc 注释 (/**) | **7,704 处** |
| **注释总计** | **~52,483 行** |
| 注释占比 (vs 总行数) | **~10.2%** |

---

## 13. React/UI 维度

| 指标 | 数值 |
|------|------|
| .tsx 文件总数 | **552 个** |
| React 函数组件 | **394 个** |
| 自定义 Hook (use*) | **94 个** |
| 组件子目录数 (components/) | **31 个** |
| 使用 className/style 的文件 | **17 个** |

### 组件子目录 Top 10

| 目录 | 文件数 |
|------|--------|
| permissions | 51 |
| messages | 41 |
| agents | 26 |
| PromptInput | 21 |
| design-system | 16 |
| LogoV2 | 15 |
| mcp | 13 |
| tasks | 12 |
| Spinner | 12 |
| CustomSelect | 10 |

---

## 14. 异步/并发维度

| 指标 | 数值 |
|------|------|
| async function 声明 | **1,736** |
| async 箭头函数 | **609** |
| await 表达式 | **5,469** |
| Promise<T> 类型引用 | **2,529** |

---

## 15. 特性标记与遥测维度

| 指标 | 数值 |
|------|------|
| Feature flag 相关代码行 | **419 行** |
| Feature flag 涉及文件 | **139 个** |
| 遥测/分析相关代码行 | **1,275 行** |
| 遥测涉及文件 | **101 个** |
| OpenTelemetry 依赖包数 | **18 个** |

---

## 16. utils/ 子系统深度拆解

| 子目录 | 文件数 | 行数 | 说明 |
|--------|--------|------|------|
| plugins | 44 | 20,521 | 插件系统核心 |
| bash | 23 | 12,306 | Bash 解析器/AST |
| permissions | 24 | 9,409 | 权限管理 |
| swarm | 22 | 7,548 | Swarm 多 Agent 协调 |
| settings | 19 | 4,562 | 设置管理 |
| telemetry | 9 | 4,044 | 遥测数据 |
| hooks | 17 | 3,721 | Hook 工具函数 |
| shell | 10 | 3,069 | Shell 操作 |
| nativeInstaller | 5 | 3,018 | 原生安装器 |
| model | 16 | 2,710 | 模型管理 |
| claudeInChrome | 7 | 2,337 | Chrome 集成 |
| powershell | 3 | 2,305 | PowerShell 支持 |
| computerUse | 15 | 2,161 | Computer Use 功能 |
| processUserInput | 4 | 1,765 | 用户输入处理 |
| deepLink | 6 | 1,388 | Deep Link |
| suggestions | 5 | 1,213 | 建议系统 |
| task | 5 | 1,223 | 任务工具 |
| git | 3 | 1,075 | Git 操作 |
| sandbox | 2 | 997 | 沙箱 |
| teleport | 4 | 955 | 会话传送 |
| secureStorage | 6 | 629 | 安全存储 |
| ultraplan | 2 | 476 | 超级计划 |
| mcp | 2 | 457 | MCP 工具 |
| filePersistence | 2 | 413 | 文件持久化 |
| messages | 2 | 386 | 消息工具 |
| background | 2 | 333 | 后台任务 |
| dxt | 2 | 314 | DXT 格式 |
| skills | 1 | 311 | 技能工具 |
| github | 1 | 29 | GitHub 工具 |
| memory | 2 | 20 | 记忆工具 |
| todo | 1 | 18 | TODO 工具 |

---

## 汇总仪表盘数据

```json
{
  "version": "2.1.88",
  "scanDate": "2026-04-05",
  "global": {
    "totalFiles": 1902,
    "totalLOC": 512695,
    "effectiveLOC": 476875,
    "blankLines": 35799,
    "totalDirectories": 301,
    "maxNestingDepth": 6,
    "topLevelModules": 35,
    "rootFiles": 18
  },
  "filesByExtension": {
    ".ts": { "files": 1332, "lines": 380006 },
    ".tsx": { "files": 552, "lines": 132668 },
    ".js": { "files": 18, "lines": 21 }
  },
  "codeStructure": {
    "exportFunction": 4215,
    "exportConst": 1275,
    "exportDefaultFunction": 12,
    "asyncFunction": 1736,
    "asyncArrow": 609,
    "totalAsyncFunctions": 2345,
    "awaitExpressions": 5469,
    "promiseTypes": 2529,
    "tryCatch": 1931,
    "throwNew": 683,
    "catchBlocks": 1425
  },
  "typeSystem": {
    "interfaceDefinitions": 83,
    "typeDefinitions": 2363,
    "enumDefinitions": 0,
    "constEnum": 1,
    "zodSchemaUsages": 1666,
    "zodFiles": 130
  },
  "comments": {
    "singleLine": 44294,
    "multiLine": 8189,
    "jsDoc": 7704,
    "todo": 138,
    "fixme": 0,
    "hack": 0
  },
  "tools": {
    "totalTools": 40,
    "toolDirectoryFiles": 184,
    "toolDirectoryLOC": 50828,
    "inputSchemaFiles": 41,
    "userFacingNameFiles": 40,
    "toolDescriptions": 65,
    "toolPromptFiles": 36
  },
  "commands": {
    "totalSlashCommands": 98,
    "commandSubdirs": 86,
    "rootCommandFiles": 12,
    "commandFiles": 207,
    "commandLOC": 26449
  },
  "hooks": {
    "hookFiles": 104,
    "hookLOC": 19204,
    "uniqueHooks": 94
  },
  "skills": {
    "totalSkillFiles": 20,
    "bundledSkills": 17
  },
  "services": {
    "serviceSubdirs": 20,
    "serviceFiles": 130,
    "serviceLOC": 53680
  },
  "prompts": {
    "promptNamedFiles": 80,
    "promptRelatedFiles": 537,
    "systemPromptFiles": 111,
    "systemPromptOccurrences": 559,
    "getSystemPromptRefs": 74,
    "toolPromptFiles": 36
  },
  "security": {
    "securityKeywordOccurrences": 4709,
    "securityKeywordFiles": 621,
    "permissionKeywordOccurrences": 5160,
    "permissionKeywordFiles": 626
  },
  "mcp": {
    "totalOccurrences": 5718,
    "involvedFiles": 422,
    "serverRefs": 2240,
    "clientRefs": 493,
    "toolRefs": 772
  },
  "testing": {
    "testFiles": 0,
    "testDirs": 0,
    "mockOccurrences": 98,
    "mockFiles": 49
  },
  "imports": {
    "totalImports": 16029,
    "relativeImports": 12175,
    "externalImports": 4000
  },
  "dependencies": {
    "production": 93,
    "dev": 1,
    "total": 94,
    "anthropicSdkPackages": 7,
    "awsSdkPackages": 5,
    "openTelemetryPackages": 18
  },
  "reactUI": {
    "tsxFiles": 552,
    "reactComponents": 394,
    "customHooks": 94,
    "componentSubdirs": 31
  },
  "featureFlags": {
    "flagRelatedLines": 419,
    "flagRelatedFiles": 139
  },
  "telemetry": {
    "telemetryLines": 1275,
    "telemetryFiles": 101,
    "otelDependencies": 18
  }
}
```

---

## 关键发现

1. **巨型代码库**: 51.3 万行代码，1,902 个文件，纯 TypeScript/TSX 构成
2. **utils 是最大模块**: 占总代码量 35.2% (180,472 行)，是一个"什么都有"的工具箱
3. **安全是第一公民**: 近 1/3 的文件包含安全/权限相关代码，BashTool 安全检查单独 5,213 行
4. **40 个 AI 工具**: 从文件操作到 MCP 到任务管理，工具体系完整
5. **98 个斜杠命令**: 86 个子目录 + 12 个根命令，几乎覆盖所有操作
6. **94 个自定义 Hook**: React 架构深度使用 Hook 模式
7. **MCP 深度集成**: 5,718 次 MCP 引用，422 个文件涉及，是核心协议层
8. **零测试文件**: 源码发行包不含测试（可能在构建流程中剥离）
9. **类型偏好**: 使用 type (2,363) 远多于 interface (83)，不使用 enum
10. **高异步密度**: 2,345 个异步函数，5,469 个 await，充分体现 I/O 密集型架构
11. **93 个生产依赖**: 含 7 个 Anthropic 官方包、18 个 OpenTelemetry 包
12. **Prompt 无处不在**: 80 个 prompt 命名文件，537 个文件包含 prompt 相关代码
