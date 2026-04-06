# QA 质量报告 — Claude Code 源码白皮书

> 生成时间: 2026-04-06T10:48:14.838Z

## 总体统计

| 指标 | 值 |
|------|----|
| 章节总数 | 83 |
| 总行数 | 36,528 |
| 总中文字数（CJK 字符） | 360,580 |
| 平均完整性评分 | 4.95 / 5 |
| 平均比喻平衡度 | 0.337 |
| 总问题数 | 4（0 错误 / 3 警告 / 1 提示） |

## 重要问题（按严重度排序）

| 严重度 | 章节 | 类型 | 说明 |
|--------|------|------|------|
| WARN | 第 83 章 Harness Engineering：从 Claude Code 看 Agent 工程化范式 | no_src_ref | 没有源文件引用（src/ 路径） |
| WARN | 引用与致谢 | no_code | 没有代码块（``` 标记） |
| WARN | 引用与致谢 | no_src_ref | 没有源文件引用（src/ 路径） |
| INFO | 引用与致谢 | no_critical | 缺少批判/局限性分析 |

## 最需要完善的章节 (Top 10)

| 章节 | 完整性 | 问题数 | 文件 |
|------|--------|--------|------|
| 引用与致谢 | 2/5 | 3 | `references.md` |
| 第 83 章 Harness Engineering：从 Claude Code 看 Agent 工程化范式 | 4/5 | 1 | `part5_supplementary/83_Harness_Engineering.md` |
| 序章：当你打开一个"聊天助手"的引擎盖 | 5/5 | 0 | `part0_序章/00_序章.md` |
| 这不是聊天机器人 | 5/5 | 0 | `part1_认识这个系统/01_这不是聊天机器人.md` |
| 五分钟看懂系统架构 | 5/5 | 0 | `part1_认识这个系统/02_五分钟看懂系统架构.md` |
| 读懂本书需要的全部概念 | 5/5 | 0 | `part1_认识这个系统/03_读懂本书需要的全部概念.md` |
| 八个子系统的全景地图 | 5/5 | 0 | `part1_认识这个系统/04_八个子系统的全景地图.md` |
| 代码地图：1,884 个文件的完整拓扑 | 5/5 | 0 | `part2_代码架构完全解构/01_代码地图.md` |
| 启动序列：从敲下 `claude` 到系统就绪 | 5/5 | 0 | `part2_代码架构完全解构/02_启动序列.md` |
| 提示词工厂：系统提示词的组装流水线 | 5/5 | 0 | `part2_代码架构完全解构/03_提示词工厂.md` |

## 各章节详情

### 序章：当你打开一个"聊天助手"的引擎盖

**文件**: `part0_序章/00_序章.md`

| 指标 | 值 |
|------|----|
| 行数 | 242 |
| CJK 字数 | 4,840 |
| 代码块数 | 1 |
| 源码引用数 | 5 |
| OS 隐喻 | 64 |
| 日常类比 | 38 |
| 比喻平衡度 | 0.373 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/main.tsx`, `src/services/claude.ts`, `src/tools/`, `src/utils/permissions/`, `src/memdir/`

---

### 这不是聊天机器人

**文件**: `part1_认识这个系统/01_这不是聊天机器人.md`

| 指标 | 值 |
|------|----|
| 行数 | 118 |
| CJK 字数 | 1,621 |
| 代码块数 | 1 |
| 源码引用数 | 4 |
| OS 隐喻 | 6 |
| 日常类比 | 10 |
| 比喻平衡度 | 0.625 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/main.tsx`, `src/query.ts`, `src/services/claude.ts`, `src/Tool.ts`

---

### 五分钟看懂系统架构

**文件**: `part1_认识这个系统/02_五分钟看懂系统架构.md`

| 指标 | 值 |
|------|----|
| 行数 | 202 |
| CJK 字数 | 1,841 |
| 代码块数 | 5 |
| 源码引用数 | 4 |
| OS 隐喻 | 13 |
| 日常类比 | 5 |
| 比喻平衡度 | 0.278 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/main.tsx`, `src/services/claude.ts`, `src/tools/tools.ts`, `src/utils/permissions/permissions.ts`

---

### 读懂本书需要的全部概念

**文件**: `part1_认识这个系统/03_读懂本书需要的全部概念.md`

| 指标 | 值 |
|------|----|
| 行数 | 526 |
| CJK 字数 | 5,603 |
| 代码块数 | 4 |
| 源码引用数 | 5 |
| OS 隐喻 | 70 |
| 日常类比 | 45 |
| 比喻平衡度 | 0.391 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/main.tsx`, `src/Tool.ts`, `src/services/claude.ts`, `src/utils/permissions/permissions.ts`, `src/utils/settings/settings.ts`

---

### 八个子系统的全景地图

**文件**: `part1_认识这个系统/04_八个子系统的全景地图.md`

| 指标 | 值 |
|------|----|
| 行数 | 298 |
| CJK 字数 | 2,713 |
| 代码块数 | 6 |
| 源码引用数 | 8 |
| OS 隐喻 | 17 |
| 日常类比 | 9 |
| 比喻平衡度 | 0.346 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (8): `src/main.tsx`, `src/tools/`, `src/utils/permissions/`, `src/services/claude.ts`, `src/state/`, `src/utils/forkedAgent.ts`, `src/hooks/`, `src/services/mcp/`

---

### 代码地图：1,884 个文件的完整拓扑

**文件**: `part2_代码架构完全解构/01_代码地图.md`

| 指标 | 值 |
|------|----|
| 行数 | 465 |
| CJK 字数 | 4,825 |
| 代码块数 | 8 |
| 源码引用数 | 8 |
| OS 隐喻 | 10 |
| 日常类比 | 19 |
| 比喻平衡度 | 0.655 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (8): `src/main.tsx`, `src/utils/`, `src/tools/`, `src/Tool.ts`, `src/tools.ts`, `src/state/AppStateStore.ts`, `src/Task.ts`, `src/context.ts`

---

### 启动序列：从敲下 `claude` 到系统就绪

**文件**: `part2_代码架构完全解构/02_启动序列.md`

| 指标 | 值 |
|------|----|
| 行数 | 333 |
| CJK 字数 | 3,578 |
| 代码块数 | 7 |
| 源码引用数 | 2 |
| OS 隐喻 | 27 |
| 日常类比 | 8 |
| 比喻平衡度 | 0.229 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/main.tsx`, `src/entrypoints/init.ts`

---

### 提示词工厂：系统提示词的组装流水线

**文件**: `part2_代码架构完全解构/03_提示词工厂.md`

| 指标 | 值 |
|------|----|
| 行数 | 554 |
| CJK 字数 | 6,357 |
| 代码块数 | 6 |
| 源码引用数 | 6 |
| OS 隐喻 | 66 |
| 日常类比 | 7 |
| 比喻平衡度 | 0.096 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/memdir/memoryTypes.ts`, `src/utils/queryContext.ts`, `src/constants/prompts.ts`, `src/constants/systemPromptSections.ts`, `src/utils/api.ts`, `src/context.ts`

---

### 心脏：查询循环与流式处理引擎

**文件**: `part2_代码架构完全解构/04_查询循环.md`

| 指标 | 值 |
|------|----|
| 行数 | 466 |
| CJK 字数 | 6,444 |
| 代码块数 | 9 |
| 源码引用数 | 4 |
| OS 隐喻 | 27 |
| 日常类比 | 28 |
| 比喻平衡度 | 0.509 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/query.ts`, `src/services/claude.ts`, `src/tools/tools.ts`, `src/utils/messages.ts`

---

### 手与工具：工具注册、调度与执行运行时

**文件**: `part2_代码架构完全解构/05_工具运行时.md`

| 指标 | 值 |
|------|----|
| 行数 | 640 |
| CJK 字数 | 6,546 |
| 代码块数 | 6 |
| 源码引用数 | 6 |
| OS 隐喻 | 52 |
| 日常类比 | 15 |
| 比喻平衡度 | 0.224 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/tools/`, `src/Tool.ts`, `src/tools/tools.ts`, `src/tools/BashTool/prompt.ts`, `src/tools/AgentTool/prompt.ts`, `src/tools/EnterPlanModeTool/prompt.ts`

---

### 分身术：Agent 编排与多实例协调

**文件**: `part2_代码架构完全解构/06_Agent编排.md`

| 指标 | 值 |
|------|----|
| 行数 | 381 |
| CJK 字数 | 5,132 |
| 代码块数 | 5 |
| 源码引用数 | 5 |
| OS 隐喻 | 43 |
| 日常类比 | 13 |
| 比喻平衡度 | 0.232 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/Task.ts`, `src/utils/forkedAgent.ts`, `src/coordinator/coordinatorMode.ts`, `src/tools/AgentTool/built-in/verificationAgent.ts`, `src/tools/AgentTool/AgentTool.tsx`

---

### 免疫系统：安全模型与信任边界

**文件**: `part2_代码架构完全解构/07_安全架构.md`

| 指标 | 值 |
|------|----|
| 行数 | 901 |
| CJK 字数 | 8,850 |
| 代码块数 | 17 |
| 源码引用数 | 6 |
| OS 隐喻 | 34 |
| 日常类比 | 21 |
| 比喻平衡度 | 0.382 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/commands/security-review.ts`, `src/commands/init.ts`, `src/utils/permissions/permissions.ts`, `src/utils/sandbox/sandbox-adapter.ts`, `src/tools/BashTool/shouldUseSandbox.ts`, `src/Tool.ts`

---

### 记忆宫殿：状态管理与持久化架构

**文件**: `part2_代码架构完全解构/08_状态与持久化.md`

| 指标 | 值 |
|------|----|
| 行数 | 302 |
| CJK 字数 | 4,169 |
| 代码块数 | 7 |
| 源码引用数 | 12 |
| OS 隐喻 | 20 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.231 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (12): `src/state/`, `src/utils/fileHistory.ts`, `src/memdir/`, `src/utils/sessionStorage.ts`, `src/state/AppStateStore.ts`, `src/state/store.ts`, `src/memdir/teamMemPaths.ts`, `src/services/teamMemorySync/`, `src/state/selectors.ts`, `src/utils/sessionStoragePortable.ts` ...

---

### 外交网络：MCP、Hooks、插件与 Skills

**文件**: `part2_代码架构完全解构/09_扩展生态.md`

| 指标 | 值 |
|------|----|
| 行数 | 283 |
| CJK 字数 | 3,443 |
| 代码块数 | 3 |
| 源码引用数 | 11 |
| OS 隐喻 | 24 |
| 日常类比 | 7 |
| 比喻平衡度 | 0.226 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (11): `src/services/mcp/`, `src/utils/hooks.ts`, `src/utils/hooks/`, `src/utils/plugins/`, `src/skills/`, `src/entrypoints/sdk/coreSchemas.ts`, `src/schemas/hooks.ts`, `src/services/mcp/MCPConnectionManager.tsx`, `src/services/mcp/types.ts`, `src/utils/plugins/schemas.ts` ...

---

### Token 经济学：成本、缓存与性能工程

**文件**: `part2_代码架构完全解构/10_Token经济学.md`

| 指标 | 值 |
|------|----|
| 行数 | 325 |
| CJK 字数 | 5,124 |
| 代码块数 | 2 |
| 源码引用数 | 5 |
| OS 隐喻 | 101 |
| 日常类比 | 24 |
| 比喻平衡度 | 0.192 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/utils/token.ts`, `src/utils/compact.ts`, `src/services/claude.ts`, `src/tools/AgentTool/prompt.ts`, `src/utils/attachments.ts`

---

### 九层宝塔：配置治理与策略执行

**文件**: `part2_代码架构完全解构/11_配置治理.md`

| 指标 | 值 |
|------|----|
| 行数 | 230 |
| CJK 字数 | 2,148 |
| 代码块数 | 6 |
| 源码引用数 | 3 |
| OS 隐喻 | 2 |
| 日常类比 | 4 |
| 比喻平衡度 | 0.667 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (3): `src/utils/settings/`, `src/utils/settings/constants.ts`, `src/utils/settings/settings.ts`

---

### 终端里的 React：Ink Fork 深度解构

**文件**: `part2_代码架构完全解构/12_终端UI.md`

| 指标 | 值 |
|------|----|
| 行数 | 748 |
| CJK 字数 | 8,478 |
| 代码块数 | 11 |
| 源码引用数 | 1 |
| OS 隐喻 | 41 |
| 日常类比 | 15 |
| 比喻平衡度 | 0.268 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (1): `src/native-ts/yoga-layout/`

---

### 横切关注点：贯穿整个系统的 12 个隐藏模式

**文件**: `part2_代码架构完全解构/13_横切关注点.md`

| 指标 | 值 |
|------|----|
| 行数 | 616 |
| CJK 字数 | 5,715 |
| 代码块数 | 16 |
| 源码引用数 | 18 |
| OS 隐喻 | 13 |
| 日常类比 | 31 |
| 比喻平衡度 | 0.705 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (18): `src/services/api/withRetry.ts`, `src/services/extractMemories/extractMemories.ts`, `src/services/analytics/`, `src/services/analytics/index.ts`, `src/services/oauth/`, `src/services/oauth/client.ts`, `src/services/autoDream/autoDream.ts`, `src/tasks/DreamTask/DreamTask.ts`, `src/context/notifications.tsx`, `src/state/store.ts` ...

---

### Prompt 原文集：Claude Code 的完整提示词库

**文件**: `part2_代码架构完全解构/14_Prompt原文集.md`

| 指标 | 值 |
|------|----|
| 行数 | 5663 |
| CJK 字数 | 15,868 |
| 代码块数 | 146 |
| 源码引用数 | 84 |
| OS 隐喻 | 19 |
| 日常类比 | 11 |
| 比喻平衡度 | 0.367 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (84): `src/constants/prompts.ts`, `src/constants/cyberRiskInstruction.ts`, `src/services/compact/prompt.ts`, `src/memdir/memoryTypes.ts`, `src/memdir/memdir.ts`, `src/services/SessionMemory/prompts.ts`, `src/memdir/teamMemPrompts.ts`, `src/memdir/findRelevantMemories.ts`, `src/services/extractMemories/prompts.ts`, `src/services/autoDream/consolidationPrompt.ts` ...

---

### 那三行在 import 之前的代码，是什么把戏？

**文件**: `part2_好奇心驱动的深度问答/Q01_那三行在import之前的代码是什么把戏.md`

| 指标 | 值 |
|------|----|
| 行数 | 126 |
| CJK 字数 | 1,846 |
| 代码块数 | 2 |
| 源码引用数 | 3 |
| OS 隐喻 | 10 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.167 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (3): `src/main.tsx`, `src/utils/settings/mdm/rawRead.ts`, `src/utils/secureStorage/keychainPrefetch.ts`

---

### 上下文压缩为什么需要六套机制，而不是一套？

**文件**: `part2_好奇心驱动的深度问答/Q02_上下文压缩为什么需要六套机制.md`

| 指标 | 值 |
|------|----|
| 行数 | 275 |
| CJK 字数 | 3,850 |
| 代码块数 | 4 |
| 源码引用数 | 3 |
| OS 隐喻 | 12 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.143 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (3): `src/query.ts`, `src/services/compact/autoCompact.ts`, `src/services/compact/compact.ts`

---

### 子 Agent 是怎么被创建和管理的？

**文件**: `part2_好奇心驱动的深度问答/Q03_子Agent是怎么被创建和管理的.md`

| 指标 | 值 |
|------|----|
| 行数 | 182 |
| CJK 字数 | 2,941 |
| 代码块数 | 1 |
| 源码引用数 | 4 |
| OS 隐喻 | 25 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.074 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/tools/AgentTool/runAgent.ts`, `src/tools/AgentTool/AgentTool.tsx`, `src/coordinator/coordinatorMode.ts`, `src/Task.ts`

---

### 工具为什么能在模型还没停止说话时就开始执行？

**文件**: `part2_好奇心驱动的深度问答/Q04_工具为什么能在模型还没停止说话时就开始执行.md`

| 指标 | 值 |
|------|----|
| 行数 | 167 |
| CJK 字数 | 2,294 |
| 代码块数 | 4 |
| 源码引用数 | 5 |
| OS 隐喻 | 17 |
| 日常类比 | 3 |
| 比喻平衡度 | 0.15 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/main.tsx`, `src/tools/StreamingToolExecutor.ts`, `src/utils/processToolCallGroup.ts`, `src/services/tools/toolOrchestration.ts`, `src/query.ts`

---

### 权限系统是怎么在灵活性和安全性之间走钢丝的？

**文件**: `part2_好奇心驱动的深度问答/Q05_权限系统是怎么在灵活性和安全性之间走钢丝的.md`

| 指标 | 值 |
|------|----|
| 行数 | 197 |
| CJK 字数 | 2,819 |
| 代码块数 | 3 |
| 源码引用数 | 5 |
| OS 隐喻 | 2 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.5 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/utils/permissions/permissions.ts`, `src/utils/permissions/PermissionMode.ts`, `src/utils/permissions/denialTracking.ts`, `src/utils/permissions/yoloClassifier.ts`, `src/hooks/toolPermission/`

---

### Claude 在你打字的时候偷偷在做什么？

**文件**: `part2_好奇心驱动的深度问答/Q06_Claude在你打字的时候偷偷在做什么.md`

| 指标 | 值 |
|------|----|
| 行数 | 220 |
| CJK 字数 | 2,561 |
| 代码块数 | 5 |
| 源码引用数 | 6 |
| OS 隐喻 | 38 |
| 日常类比 | 4 |
| 比喻平衡度 | 0.095 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/services/promptSuggestion/`, `src/utils/speculation/`, `src/services/PromptSuggestion/speculation.ts`, `src/services/PromptSuggestion/promptSuggestion.ts`, `src/utils/forkedAgent.ts`, `src/state/AppStateStore.ts`

---

### CLAUDE.md 是怎么被找到和组装的？

**文件**: `part2_好奇心驱动的深度问答/Q07_CLAUDE_md是怎么被找到和组装的.md`

| 指标 | 值 |
|------|----|
| 行数 | 211 |
| CJK 字数 | 2,103 |
| 代码块数 | 7 |
| 源码引用数 | 2 |
| OS 隐喻 | 2 |
| 日常类比 | 1 |
| 比喻平衡度 | 0.333 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/utils/claudemd.ts`, `src/context.ts`

---

### 设置系统为什么需要五层优先级？

**文件**: `part2_好奇心驱动的深度问答/Q08_设置系统为什么需要五层优先级.md`

| 指标 | 值 |
|------|----|
| 行数 | 159 |
| CJK 字数 | 1,649 |
| 代码块数 | 6 |
| 源码引用数 | 4 |
| OS 隐喻 | 0 |
| 日常类比 | 2 |
| 比喻平衡度 | 1 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/utils/settings/`, `src/services/settingsSync/`, `src/utils/settings/constants.ts`, `src/utils/settings/settings.ts`

---

### Session 里那个默默记笔记的 AI 是谁？

**文件**: `part2_好奇心驱动的深度问答/Q09_Session里那个默默记笔记的AI是谁.md`

| 指标 | 值 |
|------|----|
| 行数 | 257 |
| CJK 字数 | 2,283 |
| 代码块数 | 4 |
| 源码引用数 | 2 |
| OS 隐喻 | 8 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.2 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/services/SessionMemory/sessionMemory.ts`, `src/services/SessionMemory/prompts.ts`

---

### 用户能在 Claude 的生命周期里插多少个钩子？

**文件**: `part2_好奇心驱动的深度问答/Q10_用户能在Claude的生命周期里插多少个钩子.md`

| 指标 | 值 |
|------|----|
| 行数 | 192 |
| CJK 字数 | 1,847 |
| 代码块数 | 10 |
| 源码引用数 | 5 |
| OS 隐喻 | 8 |
| 日常类比 | 3 |
| 比喻平衡度 | 0.273 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/hooks/`, `src/services/hooks/`, `src/utils/hooks.ts`, `src/utils/hooks/hooksConfigManager.ts`, `src/utils/hooks/execAgentHook.ts`

---

### 对话也可以像代码一样分支和回滚吗？

**文件**: `part2_好奇心驱动的深度问答/Q11_对话也可以像代码一样分支和回滚吗.md`

| 指标 | 值 |
|------|----|
| 行数 | 163 |
| CJK 字数 | 1,609 |
| 代码块数 | 7 |
| 源码引用数 | 6 |
| OS 隐喻 | 4 |
| 日常类比 | 1 |
| 比喻平衡度 | 0.2 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/utils/sessionBranching.ts`, `src/components/BranchSelector.tsx`, `src/commands/branch/branch.ts`, `src/commands/rewind/rewind.ts`, `src/commands/btw/btw.tsx`, `src/utils/sessionStorage.ts`

---

### 插件系统是怎么防止你被恶意扩展攻击的？

**文件**: `part2_好奇心驱动的深度问答/Q12_插件系统是怎么防止你被恶意扩展攻击的.md`

| 指标 | 值 |
|------|----|
| 行数 | 180 |
| CJK 字数 | 1,880 |
| 代码块数 | 7 |
| 源码引用数 | 7 |
| OS 隐喻 | 8 |
| 日常类比 | 8 |
| 比喻平衡度 | 0.5 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (7): `src/utils/plugins/`, `src/services/plugins/`, `src/commands/plugin/`, `src/utils/plugins/schemas.ts`, `src/utils/plugins/pluginBlocklist.ts`, `src/utils/hooks/hooksSettings.ts`, `src/utils/hooks/hooksConfigManager.ts`

---

### Skills 和斜杠命令有什么本质区别？

**文件**: `part2_好奇心驱动的深度问答/Q13_Skills和斜杠命令有什么本质区别.md`

| 指标 | 值 |
|------|----|
| 行数 | 176 |
| CJK 字数 | 1,479 |
| 代码块数 | 7 |
| 源码引用数 | 4 |
| OS 隐喻 | 4 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.6 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/skills/`, `src/tools/SkillTool/`, `src/skills/loadSkillsDir.ts`, `src/skills/bundledSkills.ts`

---

### 多个 Claude 实例是怎么协同工作的？

**文件**: `part2_好奇心驱动的深度问答/Q14_多个Claude实例是怎么协同工作的.md`

| 指标 | 值 |
|------|----|
| 行数 | 819 |
| CJK 字数 | 4,997 |
| 代码块数 | 36 |
| 源码引用数 | 18 |
| OS 隐喻 | 32 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.158 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (18): `src/utils/swarm/inProcessRunner.ts`, `src/utils/swarm/spawnInProcess.ts`, `src/utils/swarm/leaderPermissionBridge.ts`, `src/utils/swarm/permissionSync.ts`, `src/utils/swarm/teammateLayoutManager.ts`, `src/utils/swarm/backends/types.ts`, `src/utils/swarm/backends/InProcessBackend.ts`, `src/utils/swarm/backends/TmuxBackend.ts`, `src/utils/swarm/backends/registry.ts`, `src/utils/swarm/backends/detection.ts` ...

---

### 终端里那只小动物是怎么"活"起来的？

**文件**: `part2_好奇心驱动的深度问答/Q15_终端里那只小动物是怎么活起来的.md`

| 指标 | 值 |
|------|----|
| 行数 | 292 |
| CJK 字数 | 2,981 |
| 代码块数 | 9 |
| 源码引用数 | 9 |
| OS 隐喻 | 1 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.667 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (9): `src/buddy/types.ts`, `src/buddy/companion.ts`, `src/buddy/CompanionSprite.tsx`, `src/screens/REPL.tsx`, `src/buddy/useBuddyNotification.tsx`, `src/buddy/sprites.ts`, `src/buddy/prompt.ts`, `src/state/AppStateStore.ts`, `src/utils/config.ts`

---

### 如何从浏览器远程"驾驶"你的终端 AI？

**文件**: `part2_好奇心驱动的深度问答/Q16_如何从浏览器远程驾驶你的终端AI.md`

| 指标 | 值 |
|------|----|
| 行数 | 230 |
| CJK 字数 | 2,347 |
| 代码块数 | 6 |
| 源码引用数 | 11 |
| OS 隐喻 | 8 |
| 日常类比 | 4 |
| 比喻平衡度 | 0.333 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (11): `src/bridge/bridgeMain.ts`, `src/bridge/types.ts`, `src/bridge/workSecret.ts`, `src/bridge/bridgeEnabled.ts`, `src/bridge/bridgeConfig.ts`, `src/bridge/remoteBridgeCore.ts`, `src/bridge/replBridgeTransport.ts`, `src/bridge/sessionRunner.ts`, `src/bridge/bridgeMessaging.ts`, `src/bridge/initReplBridge.ts` ...

---

### 你的声音是怎么变成代码指令的？

**文件**: `part2_好奇心驱动的深度问答/Q17_你的声音是怎么变成代码指令的.md`

| 指标 | 值 |
|------|----|
| 行数 | 223 |
| CJK 字数 | 3,147 |
| 代码块数 | 8 |
| 源码引用数 | 3 |
| OS 隐喻 | 6 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.25 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (3): `src/commands/voice/voice.ts`, `src/hooks/useVoice.ts`, `src/voice/voiceModeEnabled.ts`

---

### AI 的记忆是怎么跨越对话存活的？

**文件**: `part2_好奇心驱动的深度问答/Q18_AI的记忆是怎么跨越对话存活的.md`

| 指标 | 值 |
|------|----|
| 行数 | 258 |
| CJK 字数 | 3,450 |
| 代码块数 | 6 |
| 源码引用数 | 3 |
| OS 隐喻 | 11 |
| 日常类比 | 4 |
| 比喻平衡度 | 0.267 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (3): `src/memdir/memdir.ts`, `src/memdir/paths.ts`, `src/memdir/memoryTypes.ts`

---

### Claude 是怎么决定该"想多深"的？

**文件**: `part2_好奇心驱动的深度问答/Q19_Claude是怎么决定该想多深的.md`

| 指标 | 值 |
|------|----|
| 行数 | 251 |
| CJK 字数 | 2,856 |
| 代码块数 | 8 |
| 源码引用数 | 7 |
| OS 隐喻 | 8 |
| 日常类比 | 7 |
| 比喻平衡度 | 0.467 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (7): `src/utils/effort.ts`, `src/utils/thinking.ts`, `src/utils/advisor.ts`, `src/utils/thinkingBudget.ts`, `src/services/api/`, `src/utils/modelCost.ts`, `src/cost-tracker.ts`

---

### 这个工具到底藏了多少命令？

**文件**: `part2_好奇心驱动的深度问答/Q20_这个工具到底藏了多少命令.md`

| 指标 | 值 |
|------|----|
| 行数 | 214 |
| CJK 字数 | 2,589 |
| 代码块数 | 4 |
| 源码引用数 | 6 |
| OS 隐喻 | 3 |
| 日常类比 | 4 |
| 比喻平衡度 | 0.571 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/commands/`, `src/commands.ts`, `src/commands/advisor.ts`, `src/commands/voice/voice.ts`, `src/commands/output-style/output-style.tsx`, `src/commands/effort/effort.tsx`

---

### MagicDocs 是怎么自动维护文档的？

**文件**: `part2_好奇心驱动的深度问答/Q21_MagicDocs是怎么自动维护文档的.md`

| 指标 | 值 |
|------|----|
| 行数 | 234 |
| CJK 字数 | 3,517 |
| 代码块数 | 8 |
| 源码引用数 | 2 |
| OS 隐喻 | 7 |
| 日常类比 | 8 |
| 比喻平衡度 | 0.533 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/services/MagicDocs/magicDocs.ts`, `src/services/MagicDocs/prompts.ts`

---

### Computer Use 是怎么让 AI 操控你的屏幕的？

**文件**: `part2_好奇心驱动的深度问答/Q22_Computer_Use是怎么让AI操控你的屏幕的.md`

| 指标 | 值 |
|------|----|
| 行数 | 233 |
| CJK 字数 | 4,428 |
| 代码块数 | 2 |
| 源码引用数 | 7 |
| OS 隐喻 | 18 |
| 日常类比 | 9 |
| 比喻平衡度 | 0.333 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (7): `src/utils/computerUse/executor.ts`, `src/utils/computerUse/drainRunLoop.ts`, `src/utils/computerUse/escHotkey.ts`, `src/utils/computerUse/hostAdapter.ts`, `src/utils/computerUse/gates.ts`, `src/tools/ComputerUseTool/mcpServer.ts`, `src/tools/ComputerUseTool/wrapper.tsx`

---

### Deep Link 和 Teleport 是怎么跨设备连接的？

**文件**: `part2_好奇心驱动的深度问答/Q23_Deep_Link和Teleport是怎么跨设备连接的.md`

| 指标 | 值 |
|------|----|
| 行数 | 224 |
| CJK 字数 | 3,943 |
| 代码块数 | 3 |
| 源码引用数 | 9 |
| OS 隐喻 | 11 |
| 日常类比 | 9 |
| 比喻平衡度 | 0.45 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (9): `src/utils/deepLink/parseDeepLink.ts`, `src/utils/deepLink/registerProtocol.ts`, `src/utils/deepLink/protocolHandler.ts`, `src/utils/deepLink/terminalLauncher.ts`, `src/utils/deepLink/banner.ts`, `src/utils/claudeInChrome/`, `src/utils/teleport/gitBundle.ts`, `src/utils/teleport/api.ts`, `src/utils/teleport/environments.ts`

---

### 用户输入是怎么一步步变成 AI 请求的？

**文件**: `part2_好奇心驱动的深度问答/Q24_用户输入是怎么一步步变成AI请求的.md`

| 指标 | 值 |
|------|----|
| 行数 | 241 |
| CJK 字数 | 3,850 |
| 代码块数 | 5 |
| 源码引用数 | 4 |
| OS 隐喻 | 31 |
| 日常类比 | 5 |
| 比喻平衡度 | 0.139 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/utils/processUserInput/processUserInput.ts`, `src/utils/processUserInput/processTextPrompt.ts`, `src/utils/processUserInput/processBashCommand.tsx`, `src/components/TextInput.tsx`

---

### BashTool 的八层安全防线是怎么工作的？

**文件**: `part2_好奇心驱动的深度问答/Q25_BashTool的安全防线是怎么工作的.md`

| 指标 | 值 |
|------|----|
| 行数 | 464 |
| CJK 字数 | 6,490 |
| 代码块数 | 7 |
| 源码引用数 | 2 |
| OS 隐喻 | 25 |
| 日常类比 | 4 |
| 比喻平衡度 | 0.138 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/tools/BashTool/`, `src/utils/bash/`

---

### 权限系统完全解析

**文件**: `part3_子系统完全解析/01_权限系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 309 |
| CJK 字数 | 4,193 |
| 代码块数 | 7 |
| 源码引用数 | 11 |
| OS 隐喻 | 5 |
| 日常类比 | 8 |
| 比喻平衡度 | 0.615 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (11): `src/utils/permissions/`, `src/hooks/toolPermission/`, `src/tools/tools.ts`, `src/utils/permissions/permissions.ts`, `src/utils/permissions/PermissionMode.ts`, `src/utils/permissions/denialTracking.ts`, `src/utils/permissions/PermissionResult.ts`, `src/utils/permissions/PermissionUpdate.ts`, `src/utils/permissions/permissionRuleParser.ts`, `src/utils/permissions/permissionSetup.ts` ...

---

### 投机执行子系统完全解析

**文件**: `part3_子系统完全解析/02_投机执行子系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 454 |
| CJK 字数 | 5,373 |
| 代码块数 | 11 |
| 源码引用数 | 4 |
| OS 隐喻 | 65 |
| 日常类比 | 3 |
| 比喻平衡度 | 0.044 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/services/promptSuggestion/`, `src/utils/speculation/`, `src/services/speculative/`, `src/services/PromptSuggestion/promptSuggestion.ts`

---

### MCP 平台完全解析

**文件**: `part3_子系统完全解析/03_MCP平台完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 380 |
| CJK 字数 | 5,595 |
| 代码块数 | 8 |
| 源码引用数 | 2 |
| OS 隐喻 | 17 |
| 日常类比 | 11 |
| 比喻平衡度 | 0.393 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/services/mcp/`, `src/tools/MCPTool/`

---

### Hooks 子系统完全解析

**文件**: `part3_子系统完全解析/04_Hooks子系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 371 |
| CJK 字数 | 5,095 |
| 代码块数 | 4 |
| 源码引用数 | 6 |
| OS 隐喻 | 16 |
| 日常类比 | 12 |
| 比喻平衡度 | 0.429 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/hooks/`, `src/services/hooks/`, `src/schemas/hooks.ts`, `src/utils/hooks.ts`, `src/utils/hooks/execAgentHook.ts`, `src/entrypoints/sdk/coreSchemas.ts`

---

### 插件系统完全解析

**文件**: `part3_子系统完全解析/05_插件系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 463 |
| CJK 字数 | 5,710 |
| 代码块数 | 13 |
| 源码引用数 | 3 |
| OS 隐喻 | 20 |
| 日常类比 | 7 |
| 比喻平衡度 | 0.259 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (3): `src/utils/plugins/`, `src/services/plugins/`, `src/commands/plugin/`

---

### CLAUDE.md 加载系统完全解析

**文件**: `part3_子系统完全解析/06_CLAUDE_md加载系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 490 |
| CJK 字数 | 4,698 |
| 代码块数 | 20 |
| 源码引用数 | 7 |
| OS 隐喻 | 26 |
| 日常类比 | 8 |
| 比喻平衡度 | 0.235 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (7): `src/utils/claudemd.ts`, `src/context.ts`, `src/utils/memory/types.ts`, `src/utils/frontmatterParser.ts`, `src/utils/config.ts`, `src/utils/settings/managedPath.ts`, `src/components/`

---

### Sandbox 沙箱系统完全解析

**文件**: `part3_子系统完全解析/07_Sandbox沙箱系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 329 |
| CJK 字数 | 4,832 |
| 代码块数 | 7 |
| 源码引用数 | 2 |
| OS 隐喻 | 30 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.167 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/utils/sandbox/`, `src/entrypoints/sandbox/`

---

### 遥测与可观测性完全解析

**文件**: `part3_子系统完全解析/08_遥测与可观测性完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 432 |
| CJK 字数 | 5,186 |
| 代码块数 | 7 |
| 源码引用数 | 2 |
| OS 隐喻 | 32 |
| 日常类比 | 3 |
| 比喻平衡度 | 0.086 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/utils/telemetry/`, `src/services/analytics/`

---

### 设置系统完全解析

**文件**: `part3_子系统完全解析/09_设置系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 307 |
| CJK 字数 | 4,551 |
| 代码块数 | 4 |
| 源码引用数 | 2 |
| OS 隐喻 | 14 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.125 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/utils/settings/`, `src/services/settingsSync/`

---

### Agent 与任务系统完全解析

**文件**: `part3_子系统完全解析/10_Agent与任务系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 369 |
| CJK 字数 | 5,090 |
| 代码块数 | 6 |
| 源码引用数 | 5 |
| OS 隐喻 | 24 |
| 日常类比 | 10 |
| 比喻平衡度 | 0.294 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/tasks/`, `src/tools/AgentTool/`, `src/buddy/`, `src/tasks/DreamTask/DreamTask.ts`, `src/services/autoDream/autoDream.ts`

---

### 文件历史系统完全解析

**文件**: `part3_子系统完全解析/11_文件历史系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 270 |
| CJK 字数 | 4,396 |
| 代码块数 | 5 |
| 源码引用数 | 2 |
| OS 隐喻 | 11 |
| 日常类比 | 5 |
| 比喻平衡度 | 0.313 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (2): `src/utils/fileHistory/`, `src/utils/fsOperations/`

---

### Bridge 远程架构完全解析

**文件**: `part3_子系统完全解析/12_Bridge远程架构完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 492 |
| CJK 字数 | 5,091 |
| 代码块数 | 16 |
| 源码引用数 | 1 |
| OS 隐喻 | 24 |
| 日常类比 | 8 |
| 比喻平衡度 | 0.25 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (1): `src/bridge/`

---

### Buddy 伴侣系统完全解析

**文件**: `part3_子系统完全解析/13_Buddy伴侣系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 524 |
| CJK 字数 | 4,542 |
| 代码块数 | 24 |
| 源码引用数 | 7 |
| OS 隐喻 | 4 |
| 日常类比 | 7 |
| 比喻平衡度 | 0.636 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (7): `src/buddy/`, `src/buddy/companion.ts`, `src/buddy/types.ts`, `src/buddy/sprites.ts`, `src/buddy/prompt.ts`, `src/buddy/useBuddyNotification.tsx`, `src/buddy/CompanionSprite.tsx`

---

### 语音系统完全解析

**文件**: `part3_子系统完全解析/14_语音系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 394 |
| CJK 字数 | 3,846 |
| 代码块数 | 16 |
| 源码引用数 | 8 |
| OS 隐喻 | 4 |
| 日常类比 | 3 |
| 比喻平衡度 | 0.429 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (8): `src/voice/`, `src/commands/voice/`, `src/context/`, `src/hooks/`, `src/services/`, `src/components/`, `src/commands/voice/voice.ts`, `src/context/voice.tsx`

---

### Skill 加载基础设施完全解析

**文件**: `part3_子系统完全解析/15_Skill加载基础设施完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 867 |
| CJK 字数 | 5,062 |
| 代码块数 | 27 |
| 源码引用数 | 5 |
| OS 隐喻 | 9 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.4 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/components/`, `src/app.ts`, `src/skills/bundled/simplify.ts`, `src/skills/bundled/skillify.ts`, `src/skills/bundled/loop.ts`

---

### 输出样式系统完全解析

**文件**: `part3_子系统完全解析/16_输出样式系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 516 |
| CJK 字数 | 4,956 |
| 代码块数 | 18 |
| 源码引用数 | 6 |
| OS 隐喻 | 23 |
| 日常类比 | 5 |
| 比喻平衡度 | 0.179 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/outputStyles/`, `src/constants/`, `src/commands/`, `src/components/`, `src/utils/plugins/`, `src/constants/prompts.ts`

---

### 遥测与分析系统完全解析

**文件**: `part3_子系统完全解析/17_遥测与分析系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 655 |
| CJK 字数 | 6,117 |
| 代码块数 | 28 |
| 源码引用数 | 1 |
| OS 隐喻 | 29 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.065 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (1): `src/services/analytics/`

---

### Bash AST 解析器完全解析

**文件**: `part3_子系统完全解析/18_Bash_AST解析器完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 663 |
| CJK 字数 | 5,193 |
| 代码块数 | 24 |
| 源码引用数 | 3 |
| OS 隐喻 | 13 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.316 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (3): `src/utils/bash/`, `src/tools/BashTool/`, `src/utils/permissions/`

---

### Cron 调度系统完全解析

**文件**: `part3_子系统完全解析/19_Cron调度系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 351 |
| CJK 字数 | 2,294 |
| 代码块数 | 13 |
| 源码引用数 | 5 |
| OS 隐喻 | 27 |
| 日常类比 | 4 |
| 比喻平衡度 | 0.129 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/utils/cronScheduler.ts`, `src/utils/cronTasks.ts`, `src/utils/cron.ts`, `src/utils/cronTasksLock.ts`, `src/utils/cronJitterConfig.ts`

---

### 团队记忆同步完全解析

**文件**: `part3_子系统完全解析/20_团队记忆同步完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 349 |
| CJK 字数 | 2,199 |
| 代码块数 | 13 |
| 源码引用数 | 4 |
| OS 隐喻 | 2 |
| 日常类比 | 3 |
| 比喻平衡度 | 0.6 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/services/teamMemorySync/index.ts`, `src/services/teamMemorySync/watcher.ts`, `src/services/teamMemorySync/secretScanner.ts`, `src/services/teamMemorySync/types.ts`

---

### Fast Mode 与 UltraPlan 完全解析

**文件**: `part3_子系统完全解析/21_FastMode与UltraPlan完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 298 |
| CJK 字数 | 1,955 |
| 代码块数 | 10 |
| 源码引用数 | 4 |
| OS 隐喻 | 2 |
| 日常类比 | 3 |
| 比喻平衡度 | 0.6 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/utils/fastMode.ts`, `src/commands/fast/`, `src/commands/ultraplan.tsx`, `src/utils/ultraplan/`

---

### Prompt Cache 可观测性完全解析

**文件**: `part3_子系统完全解析/22_PromptCache可观测性完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 503 |
| CJK 字数 | 4,441 |
| 代码块数 | 16 |
| 源码引用数 | 12 |
| OS 隐喻 | 38 |
| 日常类比 | 10 |
| 比喻平衡度 | 0.208 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (12): `src/services/api/promptCacheBreakDetection.ts`, `src/utils/tokenBudget.ts`, `src/components/permissions/ComputerUseApproval/ComputerUseApproval.tsx`, `src/skills/bundled/claudeInChrome.ts`, `src/utils/claudeInChrome/setup.ts`, `src/utils/claudeInChrome/prompt.ts`, `src/services/rateLimitMessages.ts`, `src/services/rateLimitMocking.ts`, `src/services/mockRateLimits.ts`, `src/commands/rate-limit-options/` ...

---

### Vim 模式完全解析

**文件**: `part3_子系统完全解析/Vim模式完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 576 |
| CJK 字数 | 3,862 |
| 代码块数 | 24 |
| 源码引用数 | 5 |
| OS 隐喻 | 13 |
| 日常类比 | 3 |
| 比喻平衡度 | 0.188 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/vim/types.ts`, `src/vim/motions.ts`, `src/vim/operators.ts`, `src/vim/textObjects.ts`, `src/vim/transitions.ts`

---

### 任务执行管道完全解析

**文件**: `part3_子系统完全解析/任务执行管道完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 674 |
| CJK 字数 | 4,018 |
| 代码块数 | 25 |
| 源码引用数 | 10 |
| OS 隐喻 | 32 |
| 日常类比 | 7 |
| 比喻平衡度 | 0.179 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (10): `src/tasks/types.ts`, `src/tasks/LocalShellTask/guards.ts`, `src/tasks/LocalAgentTask/LocalAgentTask.tsx`, `src/foo.ts`, `src/tasks/RemoteAgentTask/RemoteAgentTask.tsx`, `src/tasks/pillLabel.ts`, `src/tasks/InProcessTeammateTask/types.ts`, `src/tasks/DreamTask/DreamTask.ts`, `src/tasks/LocalMainSessionTask.ts`, `src/tasks/stopTask.ts`

---

### 协调器模式完全解析

**文件**: `part3_子系统完全解析/协调器模式完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 790 |
| CJK 字数 | 6,083 |
| 代码块数 | 25 |
| 源码引用数 | 4 |
| OS 隐喻 | 19 |
| 日常类比 | 5 |
| 比喻平衡度 | 0.208 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (4): `src/coordinator/coordinatorMode.ts`, `src/auth/validate.ts`, `src/auth/types.ts`, `src/auth/.`

---

### 记忆系统完全解析

**文件**: `part3_子系统完全解析/记忆系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 793 |
| CJK 字数 | 7,183 |
| 代码块数 | 19 |
| 源码引用数 | 25 |
| OS 隐喻 | 15 |
| 日常类比 | 11 |
| 比喻平衡度 | 0.423 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (25): `src/memdir/`, `src/services/`, `src/utils/`, `src/components/memory/`, `src/memdir/memdir.ts`, `src/utils/claudemd.ts`, `src/services/SessionMemory/`, `src/tools/AgentTool/agentMemory.ts`, `src/memdir/teamMemPaths.ts`, `src/memdir/paths.ts` ...

---

### 远程 Agent 管理完全解析

**文件**: `part3_子系统完全解析/远程Agent管理完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 638 |
| CJK 字数 | 5,831 |
| 代码块数 | 15 |
| 源码引用数 | 14 |
| OS 隐喻 | 4 |
| 日常类比 | 18 |
| 比喻平衡度 | 0.818 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (14): `src/tasks/RemoteAgentTask/RemoteAgentTask.tsx`, `src/utils/teleport.tsx`, `src/utils/teleport/api.ts`, `src/utils/ultraplan/ccrSession.ts`, `src/utils/teleport/gitBundle.ts`, `src/utils/teleport/environments.ts`, `src/utils/sessionStorage.ts`, `src/utils/background/remote/remoteSession.ts`, `src/tasks/pillLabel.ts`, `src/utils/background/remote/preconditions.ts` ...

---

### 键绑定系统完全解析

**文件**: `part3_子系统完全解析/键绑定系统完全解析.md`

| 指标 | 值 |
|------|----|
| 行数 | 672 |
| CJK 字数 | 3,590 |
| 代码块数 | 27 |
| 源码引用数 | 8 |
| OS 隐喻 | 7 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.462 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (8): `src/keybindings/schema.ts`, `src/keybindings/parser.ts`, `src/keybindings/match.ts`, `src/keybindings/resolver.ts`, `src/keybindings/defaultBindings.ts`, `src/keybindings/loadUserBindings.ts`, `src/keybindings/reservedShortcuts.ts`, `src/keybindings/validate.ts`

---

### 在等待时间里藏工作

**文件**: `part4_工程哲学/01_在等待时间里藏工作.md`

| 指标 | 值 |
|------|----|
| 行数 | 161 |
| CJK 字数 | 3,697 |
| 代码块数 | 3 |
| 源码引用数 | 7 |
| OS 隐喻 | 34 |
| 日常类比 | 1 |
| 比喻平衡度 | 0.029 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (7): `src/main.tsx`, `src/utils/settings/mdm/rawRead.ts`, `src/utils/secureStorage/keychainPrefetch.ts`, `src/utils/apiPreconnect.ts`, `src/services/tools/StreamingToolExecutor.ts`, `src/services/PromptSuggestion/speculation.ts`, `src/utils/forkedAgent.ts`

---

### Token 是一等公民

**文件**: `part4_工程哲学/02_token是一等公民.md`

| 指标 | 值 |
|------|----|
| 行数 | 207 |
| CJK 字数 | 4,028 |
| 代码块数 | 6 |
| 源码引用数 | 7 |
| OS 隐喻 | 51 |
| 日常类比 | 10 |
| 比喻平衡度 | 0.164 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (7): `src/utils/forkedAgent.ts`, `src/services/api/promptCacheBreakDetection.ts`, `src/services/PromptSuggestion/promptSuggestion.ts`, `src/services/SessionMemory/sessionMemoryUtils.ts`, `src/services/mcp/client.ts`, `src/services/compact/autoCompact.ts`, `src/tools/AgentTool/loadAgentsDir.ts`

---

### 把 AI 当乐高积木

**文件**: `part4_工程哲学/03_把AI当乐高积木.md`

| 指标 | 值 |
|------|----|
| 行数 | 211 |
| CJK 字数 | 3,999 |
| 代码块数 | 4 |
| 源码引用数 | 5 |
| OS 隐喻 | 17 |
| 日常类比 | 18 |
| 比喻平衡度 | 0.514 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (5): `src/tools/AgentTool/prompt.ts`, `src/components/agents/generateAgent.ts`, `src/services/claude.ts`, `src/tools/AgentTool.ts`, `src/services/sideQuery.ts`

---

### 多层防线不是偏执，是必要

**文件**: `part4_工程哲学/04_多层防线不是偏执是必要.md`

| 指标 | 值 |
|------|----|
| 行数 | 260 |
| CJK 字数 | 4,396 |
| 代码块数 | 4 |
| 源码引用数 | 6 |
| OS 隐喻 | 5 |
| 日常类比 | 1 |
| 比喻平衡度 | 0.167 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/utils/permissions/permissions.ts`, `src/utils/permissions/denialTracking.ts`, `src/utils/permissions/yoloClassifier.ts`, `src/utils/permissions/filesystem.ts`, `src/utils/permissions/permissionSetup.ts`, `src/hooks/`

---

### 可观测性是产品功能，不是运维工具

**文件**: `part4_工程哲学/05_可观测性是产品功能不是运维工具.md`

| 指标 | 值 |
|------|----|
| 行数 | 278 |
| CJK 字数 | 5,085 |
| 代码块数 | 8 |
| 源码引用数 | 9 |
| OS 隐喻 | 10 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.375 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (9): `src/services/analytics/index.ts`, `src/utils/telemetry/instrumentation.ts`, `src/utils/telemetry/sessionTracing.ts`, `src/services/PromptSuggestion/promptSuggestion.ts`, `src/tasks/InProcessTeammateTask/types.ts`, `src/tools/AgentTool/runAgent.ts`, `src/utils/hooks/hookEvents.ts`, `src/utils/telemetry/`, `src/services/analytics/`

---

### Prompt 的八大设计智慧：从 124 个提示词模板中提炼的工程哲学

**文件**: `part4_工程哲学/06_Prompt的八大设计智慧.md`

| 指标 | 值 |
|------|----|
| 行数 | 555 |
| CJK 字数 | 6,012 |
| 代码块数 | 19 |
| 源码引用数 | 10 |
| OS 隐喻 | 16 |
| 日常类比 | 8 |
| 比喻平衡度 | 0.333 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (10): `src/tools/AgentTool/built-in/verificationAgent.ts`, `src/constants/prompts.ts`, `src/commands/security-review.ts`, `src/commands/init.ts`, `src/memdir/memoryTypes.ts`, `src/utils/forkedAgent.ts`, `src/skills/bundled/loop.ts`, `src/tools/AgentTool/prompt.ts`, `src/components/agents/generateAgent.ts`, `src/services/autoDream/consolidationPrompt.ts`

---

### 第 83 章 Harness Engineering：从 Claude Code 看 Agent 工程化范式

**文件**: `part5_supplementary/83_Harness_Engineering.md`

| 指标 | 值 |
|------|----|
| 行数 | 404 |
| CJK 字数 | 6,336 |
| 代码块数 | 1 |
| 源码引用数 | 0 |
| OS 隐喻 | 7 |
| 日常类比 | 6 |
| 比喻平衡度 | 0.462 |
| 完整性评分 | 4/5 |

完整性: 引言=Y 代码=Y 源码引用=- 比喻=Y 批判分析=Y

**问题:**
- [WARNING] 没有源文件引用（src/ 路径）

---

### 这个系统的代价

**文件**: `part5_批判与超越/01_这个系统的代价.md`

| 指标 | 值 |
|------|----|
| 行数 | 289 |
| CJK 字数 | 6,864 |
| 代码块数 | 2 |
| 源码引用数 | 6 |
| OS 隐喻 | 39 |
| 日常类比 | 7 |
| 比喻平衡度 | 0.152 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/services/analytics/`, `src/main.tsx`, `src/commands/`, `src/services/api/promptCacheBreakDetection.ts`, `src/services/api/claude.ts`, `src/hooks/`

---

### 如果我来重新设计

**文件**: `part5_批判与超越/02_如果我来重新设计.md`

| 指标 | 值 |
|------|----|
| 行数 | 268 |
| CJK 字数 | 5,286 |
| 代码块数 | 4 |
| 源码引用数 | 6 |
| OS 隐喻 | 8 |
| 日常类比 | 16 |
| 比喻平衡度 | 0.667 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (6): `src/services/claude.ts`, `src/utils/claudemd.ts`, `src/utils/forkedAgent.ts`, `src/hooks/`, `src/Tool.ts`, `src/memdir/memoryTypes.ts`

---

### 把这些思想用在你的项目里

**文件**: `part5_批判与超越/03_把这些思想用在你的项目里.md`

| 指标 | 值 |
|------|----|
| 行数 | 268 |
| CJK 字数 | 4,226 |
| 代码块数 | 5 |
| 源码引用数 | 3 |
| OS 隐喻 | 14 |
| 日常类比 | 8 |
| 比喻平衡度 | 0.364 |
| 完整性评分 | 5/5 |

完整性: 引言=Y 代码=Y 源码引用=Y 比喻=Y 批判分析=Y

**引用的源文件** (3): `src/main.tsx`, `src/services/claude.ts`, `src/utils/permissions/permissions.ts`

---

### 引用与致谢

**文件**: `references.md`

| 指标 | 值 |
|------|----|
| 行数 | 217 |
| CJK 字数 | 2,618 |
| 代码块数 | 0 |
| 源码引用数 | 0 |
| OS 隐喻 | 9 |
| 日常类比 | 2 |
| 比喻平衡度 | 0.182 |
| 完整性评分 | 2/5 |

完整性: 引言=Y 代码=- 源码引用=- 比喻=Y 批判分析=-

**问题:**
- [WARNING] 没有代码块（``` 标记）
- [WARNING] 没有源文件引用（src/ 路径）
- [INFO] 缺少批判/局限性分析

---
