# V2 序章 Block 7b · 外部接口 · Brief（草稿）

> 状态：**Sonnet 副手起草骨架，等 Opus 下一会话完善后 fire 双跑**
> 任务派发：双跑（Kimi 主跑 + MiniMax 主跑），独立产出后做交叉评审
> 块内职责：**Block 7 信息密度顶点的第 2 拍 / OS 类比"设备驱动 + 内核模块 + 包管理器"三行的全面展开**。从"安全是内置工具的矩阵"切到"扩展是对外的三种延展面——连外部（MCP）/ 插内部（Hooks）/ 装第三方（Skills+插件）"。
> 工时预算：4-5h（含 3 张图 0.3-D MCP 传输对比 + 0.3-F Hook 事件目录 + 0.3-G 扩展生态地图，复杂度最高）
> Brief 撰写人：Sonnet (副手骨架) → Opus (完善)
> 创建时间：2026-04-07
> 实例化模板：handoff/v2-prologue-brief-template-2026-04-06.md
> 素材原料包：handoff/v2-prologue-block7-prep-2026-04-06.md（§三 Block 7b 段落）
> 样板：handoff/v2-prologue-brief-block7a-安全防线.md
> Opus 5 OQ 决断：见 §0.2（Sonnet 直接采纳，不要求 Opus 重决）

---

## 0. 给生成 Sub-Agent 的硬约束（最优先读）

**MUST**:
- 输出唯一一份完整 HTML 文件，无外部依赖
- token 引用：仅 `var(--cc-*)`，字体 `var(--cc-font-sans)` + `var(--cc-font-mono)`
- 数字精度：所有数字逐位精确（FM-09）——27 个 Hook 事件（4+8+10+5），8 种 MCP 传输，五大扩展机制
- dark 主题为基线 + light 主题覆盖
- 不调用 JS 框架 / CDN
- **L124 OS 类比表行必须保留（设备驱动）**：「**设备驱动 (Drivers)** | MCP 服务器 | 标准化协议（JSON-RPC）接入外部能力，就像驱动让 OS 操控不同厂商的硬件」
- **L143 OS 类比表行必须保留（内核模块）**：「**内核模块 (Modules)** | Hooks 系统 | 在系统运行的 27 个关键节点注入自定义逻辑，就像 Linux 的可加载内核模块」
- **L149 OS 类比表行必须保留（包管理器）**：「**包管理器 (apt/npm)** | 插件系统 + Skills | 第三方扩展的安装、验证、沙箱化执行——和 OS 的包管理器做同样的事」
- **L126 USB 转接器通俗理解必须逐字保留**：「💡 **通俗理解**：MCP 就像 **MacBook 的 USB 转接口**——MacBook 只有 Type-C 口，想接鼠标键盘投影仪都需要转接器。MCP 就是 Claude 的万能转接器，让它能连接各种外部工具和服务。」
- **L145 快递柜短信通知通俗理解必须逐字保留**：「💡 **通俗理解**：Hooks 就像**快递柜的短信通知**——快递到了自动通知你 = 事件钩子。你可以设置"到了通知我"或"直接放门口" = 自定义 Hook 行为。系统在关键时刻自动触发你预设的动作。」
- **VIS-0.3-D 必出**：**必须是组合柱状图**（总分排名默认视图 + 可切换五维度分组视图），**严禁雷达图**；8 种传输方式（stdio / SSE / Streamable HTTP / WebSocket / HTTP+JSON-RPC / gRPC / Unix Domain Socket / Named Pipe）；5 维度（延迟 / 吞吐 / 安全 / 复杂度 / 可靠性）；stdio + SSE 必须推荐标注（★）；每种传输必须有一段通俗说明文字
- **VIS-0.3-F 必出**：27 个 Hook 事件按 4 个生命周期阶段穷举：**Session 4 / Query 8 / Tool 10 / Agent 5**；四阶段色（Session 蓝 / Query 紫 / Tool 橙 / Agent 绿）不变；垂直时间轴结构；成对事件（onToolCall ↔ onToolResult）必须有视觉关联（弧线或标注）
- **VIS-0.3-G 必出**：**五大扩展机制**（MCP / Hooks / CLAUDE.md / Skills / 自定义命令）一个都不能省；颜色分配不变（MCP 紫 / Hooks 橙 / CLAUDE.md 蓝 / Skills 绿 / 命令黄）；必须体现"复杂度"维度；必须标注至少 2 个组合场景（MCP+Hooks / CLAUDE.md+Skills）
- **块尾过渡到 Block 7c** 必须逐字使用 Block 7 prep §五衔接建议：「看完了系统怎么向外延展，让我们把视角收回来——看系统**自己**长什么样。它的内部组织有两个层面：可配置的'软组织'，和模块之间的'骨架'。」

**MUST NOT**:
- 严禁 `iframe` / `Math.random` / 凑数式数据补全
- 严禁拿 LLM 自己虚构的 MCP 传输方式 / Hook 事件 / 扩展机制
- **严禁使用雷达图绘制 VIS-0.3-D**（这是 Block 7 prep §三 / OQ4 明确的视觉纠错硬约束——雷达图 8 条线重叠太严重）
- 严禁混入 Block 1-6 / Block 7a / Block 7c / Block 8-9 任何元素
- 严禁混入 Block 4 hero (1,884 / 476,875 / 40 / 98 / 一个为 AI 智能体设计的操作系统)
- 严禁混入 Block 5 (这不是使用指南 / 这是工程解剖)
- 严禁混入 Block 6 全文 (三件事面板 / 内核 / Syscall / 43 工具目录 / 课程关联)
- **严禁展开 Block 7a 内容**（安全矩阵 / 权限对照表 / 6 种权限模式 / plan/default/acceptEdits 等）
- **严禁展开 Block 7c 内容**（配置地图 / 模块依赖网络 / 穿衣服的层次 / Tool.ts 入度 / 双栏文件树）
- 严禁展开 OS 类比表的其它行（只摘设备驱动 / 内核模块 / 包管理器三行）
- 严禁混入 Block 8/9 (三类读者 / 5 比喻家族 / 让我们开始)
- 严禁视觉冲击力压过 Block 4

### 0.1 数字纪律（逐位精确，FM-09）

| 数字 | 值 | 来源 | 允许改写？ |
|---|---|---|---|
| MCP 传输方式数量 | **8 种** | Block 7 prep §三 VIS-0.3-D | 否 |
| MCP 传输 5 维度 | 延迟 / 吞吐 / 安全 / 复杂度 / 可靠性 | Block 7 prep §三 | 否 |
| Hook 事件总数 | **27 个** | L143 + L147 + Block 7 prep §三 VIS-0.3-F | 否 |
| Hook 生命周期阶段数 | **4 个**（Session / Query / Tool / Agent） | L147 + Block 7 prep §三 | 否 |
| Session 阶段事件数 | **4** | Block 7 prep §三 | 否 |
| Query 阶段事件数 | **8** | Block 7 prep §三 | 否 |
| Tool 阶段事件数 | **10** | Block 7 prep §三 | 否 |
| Agent 阶段事件数 | **5** | Block 7 prep §三 | 否 |
| 验算 | 4+8+10+5 = **27** ✓ | | 否 |
| 扩展机制数量 | **5 种**（MCP / Hooks / CLAUDE.md / Skills / 自定义命令） | L151 + Block 7 prep §三 VIS-0.3-G | 否 |

### 0.2 Opus 5 OQ 决断（Sonnet 副手采纳，不要求 Opus 重决）

| OQ | 议题 | 决断 |
|----|------|---------|
| **OQ1** | OS 类比表如何拆 | **选项 B**（与 7a 一致）：Block 6 出一次整表，Block 7b 开头摘取三行作为"OS 类比锚点"小卡片（设备驱动 + 内核模块 + 包管理器） |
| **OQ2** | Block 7b 是否进一步分流 | **不分流**（保持 3 张图一体，4.5h 工时按 prep §七拍板） |
| **OQ3** | VIS-0.3-D 视觉纠错 | **本块核心 OQ**：**强制使用组合柱状图**（总分排名 + 切换五维度分组）；**彻底放弃雷达图**——Block 7 prep §三明确 HTML 现状是雷达图，Brief 期望也是柱状图，V2 是最大纠错机会 |
| **OQ4** | Hook 时间轴是否保留垂直中线 | **保留**：垂直中线 + 左右交替卡片，配合 IntersectionObserver 触发滑入 |
| **OQ5** | 扩展生态地图的视觉隐喻 | **不强制有机地图**（SVG bezier 实现成本高），允许使用 **card-network 节点+连线** 或 **散点图（X=复杂度 / Y=能力范围）** 两种形式，但必须体现"范围 × 复杂度"两个维度，并至少标注 2 个组合场景 |

---

## 1. 块在 11 块叙事弧中的位置

```
块1 → 块2 → 块3 → 块4 → 块5 → 块6 → 块7a → [块7b] → 块7c → 块8 → 块9
hero  反差  生态  数字  使命  OS建立 安全    接口     内部   分流  收尾
```

- **本块**：第 8 拍，三拆中的第 2 拍
- **节奏角色**：★ **Block 7 信息密度顶点的第 2 拍 / 对外延展面技术深潜**
- **上一块（Block 7a 安全防线）交接情绪**：刚被「但 Claude 不只有内置工具。它还能接入外部工具、被外部钩子拦截、被第三方扩展加新能力——这些'对外的延展面'是另一组完全不同的设计。」推动到"准备深潜三种外部接口"
- **我要交给下一块（Block 7c 内部组织）的情绪**：把"扩展是向外的延展面"递为"现在把视角收回来看系统自己"

## 2. 内容承载

### 2.1 原文（来自 `book/part0_序章/00_序章.md` 第 124-128 行 + 143-151 行）

```markdown
| **设备驱动 (Drivers)** | MCP 服务器 | 标准化协议（JSON-RPC）接入外部能力，就像驱动让 OS 操控不同厂商的硬件 |

> 💡 **通俗理解**：MCP 就像**MacBook 的 USB 转接口**——MacBook 只有 Type-C 口，想接鼠标键盘投影仪都需要转接器。MCP 就是 Claude 的万能转接器，让它能连接各种外部工具和服务。

> **[图表预留 0.3-D]**：MCP 传输方式对比矩阵——在延迟 / 吞吐 / 安全 / 复杂度 / 可靠性五个维度上对比 8 种 MCP 传输方式，给出每种方式的适用场景。

[……原文中间的 Shell / /etc/ 配置 / IPC / Boot 行被 Block 7c + 跳过，不纳入本块范围……]

| **内核模块 (Modules)** | Hooks 系统 | 在系统运行的 27 个关键节点注入自定义逻辑，就像 Linux 的可加载内核模块 |

> 💡 **通俗理解**：Hooks 就像**快递柜的短信通知**——快递到了自动通知你 = 事件钩子。你可以设置"到了通知我"或"直接放门口" = 自定义 Hook 行为。系统在关键时刻自动触发你预设的动作。

> **[图表预留 0.3-F]**：Hook 事件完整目录——27 个事件 × 4 个生命周期阶段（Session / Query / Tool / Agent）的完整挂载点清单，每个事件标注参数与典型用途。

| **包管理器 (apt/npm)** | 插件系统 + Skills | 第三方扩展的安装、验证、沙箱化执行——和 OS 的包管理器做同样的事 |

> **[图表预留 0.3-G]**：扩展生态地图——CLAUDE.md / Custom Commands / Skills / Hooks / MCP 五种扩展机制按"范围×复杂度"二维铺开，并标注它们之间的交汇点（MCP+Hooks、CLAUDE.md+Skills 等）。
```

### 2.2 必保留事实清单

**A 类 — OS 类比表三行（开头锚点小卡片，OQ1 选项 B）**

| OS 概念 | CC 对应物 | 类比成立理由 |
|---|---|---|
| **设备驱动 (Drivers)** | MCP 服务器 | 标准化协议（JSON-RPC）接入外部能力，就像驱动让 OS 操控不同厂商的硬件 |
| **内核模块 (Modules)** | Hooks 系统 | 在系统运行的 27 个关键节点注入自定义逻辑，就像 Linux 的可加载内核模块 |
| **包管理器 (apt/npm)** | 插件系统 + Skills | 第三方扩展的安装、验证、沙箱化执行——和 OS 的包管理器做同样的事 |

**B 类 — 必出 2 段「💡 通俗理解」（逐字保留）**

| 类比 | 内容（逐字） |
|---|---|
| **MacBook 的 USB 转接口** | MacBook 只有 Type-C 口，想接鼠标键盘投影仪都需要转接器。MCP 就是 Claude 的万能转接器，让它能连接各种外部工具和服务。 |
| **快递柜的短信通知** | 快递到了自动通知你 = 事件钩子。你可以设置"到了通知我"或"直接放门口" = 自定义 Hook 行为。系统在关键时刻自动触发你预设的动作。 |

> 注：L149 包管理器没有独立的"💡 通俗理解"段落（原文只有 OS 表行 + 图表预留 0.3-G），本块不虚构通俗类比。"穿衣服的层次"（L133）是 L131 /etc/ 配置的通俗理解，属于 Block 7c，不得挪用。

**C 类 — VIS-0.3-D MCP 传输方式对比（必出图 1）**

| 字段 | 值 |
|---|---|
| 标题 | MCP 传输方式对比 / 8 种 MCP 传输方式的五维评估 |
| **视觉形式（OQ3）** | **组合柱状图**（总分排名默认视图 + 切换按钮 → 五维度分组视图）。**严禁雷达图** |
| 8 种传输方式 | stdio / SSE / Streamable HTTP / WebSocket / HTTP+JSON-RPC / gRPC / Unix Domain Socket / Named Pipe |
| 5 维度 | 延迟 / 吞吐 / 安全 / 复杂度 / 可靠性 |
| 推荐标注 | stdio + SSE 必须有 ★ 符号或特殊边框 |
| 数据样例 | stdio: [98,85,60,95,80] / SSE: [70,75,85,80,75]（Block 7 prep §三已核对） |
| 通俗说明 | 每种传输必须有一段 1-2 句通俗解释 |
| 详细数据表 | 柱状图下方配 compare-table 显示完整五维数据 + 适用场景标签 + 可排序 |

**D 类 — VIS-0.3-F Hook 事件完整目录（必出图 2）**

| 字段 | 值 |
|---|---|
| 标题 | Hook 事件完整目录 / 27 个 Hook 事件 × 4 阶段时间轴 |
| 视觉形式 | 垂直时间轴居中线 + 四阶段从上到下 + 事件卡片左右交替 |
| 四阶段颜色 | **Session 蓝 / Query 紫 / Tool 橙 / Agent 绿** |
| 阶段事件拆分 | **Session 4 + Query 8 + Tool 10 + Agent 5 = 27** |
| Session 4 事件（示例） | onSessionStart / onSessionEnd / onAuth / onConfigLoad |
| Query 8 事件（示例） | onQueryStart / onQueryEnd / onPromptBuild / onApiRequest / onApiResponse / onStreamChunk / onError / onContextTruncate |
| Tool 10 事件（示例） | onToolCall / onToolResult / onBashCommand / onBashResult / onFileRead / onFileWrite / onFileEdit / onGrepSearch / onWebFetch / onToolPermission |
| Agent 5 事件（示例） | onAgentSpawn / onAgentComplete / onAgentError / onMaxDepthReach / onTaskDistribute |
| 每事件必备字段 | 名称 + 触发时机 + 传入参数（至少两项）+ 典型用途（不得只有事件名） |
| 成对事件视觉关联 | onToolCall ↔ onToolResult 等必须有弧线或标注连接 |
| 阶段筛选 | 顶部筛选按钮（4 阶段切换） |

**E 类 — VIS-0.3-G 扩展生态地图（必出图 3）**

| 字段 | 值 |
|---|---|
| 标题 | 扩展生态地图 / 五大扩展机制的范围 × 复杂度地图 |
| **五大机制** | **MCP / Hooks / CLAUDE.md / Skills / 自定义命令**（一个都不能省） |
| 五色 | **MCP 紫 / Hooks 橙 / CLAUDE.md 蓝 / Skills 绿 / 自定义命令黄** |
| 两轴 | X 轴"内部→外部" + Y 轴"简单→复杂" |
| 复杂度维度 | 越复杂的机制视觉上越突出/越大（体现 MCP 复杂度高、Skills 复杂度低） |
| 组合场景标注 | **至少 2 个**：MCP+Hooks 组合 / CLAUDE.md+Skills 组合 |
| 可选视觉形式（OQ5） | card-network 节点+连线 / 散点图 / 有机地图 三选一，但两轴与组合场景必须落地 |
| Legend | 小图例标注两轴含义 + 五色与机制对应 |

**F 类 — 必出现的金句**

| # | 金句 | 来源 |
|---|------|------|
| Q1 | **「标准化协议（JSON-RPC）接入外部能力，就像驱动让 OS 操控不同厂商的硬件」** | L124（从 OS 表行抽出） |
| Q2 | **「在系统运行的 27 个关键节点注入自定义逻辑」** | L143（从 OS 表行抽出） |
| Q3 | **「扩展不是一个机制，而是三种不同尺度的接口——一种连外部（MCP）、一种插内部（Hooks）、一种装第三方（Skills+插件）」** | Sonnet 草拟（基于 Block 7 prep §三目标读者认知，待 Opus 审） |
| Q4 | **「D 是放大镜（看一种），F 是清单（看一种的所有挂点），G 是俯视图（看全部五种）」** | Sonnet 草拟（基于 Block 7 prep §三子块叙事弧 §收尾，待 Opus 审） |

### 2.3 严禁出现的内容

| 内容 | 严禁原因 |
|------|---------|
| 安全矩阵 / 权限对照表 / 6 种权限模式 / plan/default/acceptEdits/autoAccept/bypass/dontAsk / 小区门禁 | Block 7a 弹药 |
| 配置地图 / ~/.claude/ / .claude/ / credentials.json / 穿衣服的层次 / 优先级链 / .claudeignore | Block 7c 弹药 |
| 模块依赖网络 / Tool.ts 入度 43 / 六大集群 / 力导向 | Block 7c 弹药 |
| 内核 / 系统调用 / 三件事面板 / 43 工具目录 / 课程关联 / 快递分拣流水线 | Block 6 弹药 |
| Block 1-5 / Block 8-9 任何元素 | 跨块边界 |
| Block 4 hero 数字 (1,884 / 476,875 / 40 / 98 / "操作系统" pull-quote) | 已用 |
| **雷达图** | **OQ3 明令禁止**——Block 7 prep §三 HTML 现状就是雷达图的失败案例 |

## 3. 视觉语言

### 3.1 推荐视觉组件

| 组件 | 用途 | 优先级 |
|---|---|---|
| **prologue-marginal-label** + **hero-footer** (块号 07b + 块名 + sub-title) | 全书 spec | **P0** |
| **block-title** "外部接口" | H2 | **P0** |
| **os-table-anchor-card** × 3（设备驱动 / 内核模块 / 包管理器三行合一卡片，或三张小卡） | 开头锚点 | **P0** |
| **insight-block 💡 USB 转接器** | MCP 通俗类比 | **P0** |
| **vis-0-3-d-mcp-bar-chart**（组合柱状图 + 切换按钮 + compare-table） | 第 1 张图 | **P0** |
| **insight-block 💡 快递柜短信通知** | Hooks 通俗类比 | **P0** |
| **vis-0-3-f-hook-timeline**（垂直时间轴中线 + 左右交替 27 事件卡） | 第 2 张图 | **P0** |
| **vis-0-3-g-extension-map**（card-network / 散点图 / 有机地图三选一） | 第 3 张图 | **P0** |
| **q3-three-scales** "三种不同尺度的接口" | 中段综合 | P1 |
| **q4-three-views** "放大镜 / 清单 / 俯视图" | 收束 | **P0** |
| **block-7c-bridge** | 块尾过渡 | **P0** |

### 3.2 节奏建议

1. **顶部 marginal label + hero footer**："序章 · Block 07b · 外部接口"
2. **块标题**："## 外部接口"
3. **OS 表锚点卡片** × 3：摘取设备驱动 / 内核模块 / 包管理器三行，标"OS 类比锚点（三行）"
4. **开场段**：用"Claude Code 不是孤岛——它有三种对外延展面"引入三图
5. **💡 USB 转接器通俗理解**：逐字保留
6. **过渡句**：「转接器有 8 种规格，每种适合不同场景——读者从'我该选哪种'角度切入」
7. **VIS-0.3-D 组合柱状图**（重视觉）：总分柱状图默认视图 + 切换五维度分组视图 + 下方 compare-table
8. **过渡句**：「MCP 让 Claude 连接**外部**工具，但有时候你想在 Claude **内部**的某个时刻插一段自定义逻辑——这就是 Hooks」
9. **💡 快递柜短信通知通俗理解**：逐字保留
10. **VIS-0.3-F 垂直时间轴**（节奏感）：27 事件 × 4 阶段左右交替 + 成对弧线
11. **过渡句 + Q3 pull-quote**：「MCP 是"连别人"，Hooks 是"插自己"，那么"装第三方扩展"呢？答案是 Skills + 插件。扩展不是一个机制，而是三种不同尺度的接口——一种连外部、一种插内部、一种装第三方。」
12. **VIS-0.3-G 扩展生态地图**（俯视收束）：五大机制 + 两轴 + 组合场景
13. **Q4 收束**：「D 是放大镜（看一种），F 是清单（看一种的所有挂点），G 是俯视图（看全部五种）」
14. **块尾 Block 7c 过渡**：「看完了系统怎么向外延展，让我们把视角收回来——看系统**自己**长什么样。它的内部组织有两个层面：可配置的'软组织'，和模块之间的'骨架'。」

### 3.3 字体/留白/对比度建议

- 块标题：`var(--cc-font-size-4xl)` ~ `5xl`，bold
- OS 表锚点三行小卡：背景 surface-secondary，"OS 类比锚点（三行）"标签 + 三行内容（可合一卡 / 可三张并列）
- VIS-0.3-D 组合柱状图：上方 chart-card（SVG/Canvas 柱状图 + toggle 总分↔五维度），下方 compare-table（含排序）
- VIS-0.3-F 垂直时间轴：CSS Grid 实现中线 + 左右交替卡片，弧线用 inline SVG 绝对定位覆盖，IntersectionObserver 触发
- VIS-0.3-G 扩展生态地图：SVG path / card-network / 散点图皆可，但两轴必须清晰
- Q3 / Q4 pull-quote：`var(--cc-font-size-2xl)` ~ `3xl`
- 块尾过渡：`var(--cc-font-size-xl)`
- block padding：`var(--cc-space-12)` 上下
- **视觉密度节奏**：D（柱状图视觉重）→ F（时间轴节奏感）→ G（俯视图收束），从重到轻到聚焦，避免读者在三连发下疲劳
- 视觉冲击力：三张图是信息密度顶点，但不抢 Block 4 的情绪顶点

## 4. 双源理解（3 张图）

### 4.1 VIS-0.3-D MCP 传输方式对比

- **Brief 期望**：组合柱状图（总分 + 切换五维度分组）+ compare-table，8 种传输 × 5 维度，stdio + SSE 推荐标注，每种有通俗说明
- **HTML 现状**（Block 7 prep §三，评分 7/10，**存在视觉形式根本性偏差**）：
  - 实现：雷达图 SVG + 详细对比表格双区布局
  - 数据：8 种传输全部实现，5 维度完整，数值精确（stdio [98,85,60,95,80] / SSE [70,75,85,80,75]），推荐标注 + 适用场景标签 + 表格排序齐全
  - **主要差距**：**视觉形式选错**——雷达图 8 条线重叠严重；切换按钮（总分 ↔ 五维度）缺失；图表区顶部缺通俗说明文段
- **V2 改造（最大纠错机会）**：**彻底替换为组合柱状图**，上方 chart-card（含切换按钮），下方 compare-table，柱状图上方加 lead-paragraph 解释"什么是 MCP 传输方式"
- **必保留**：8 种传输 + 5 维度 + 精确数值 + stdio/SSE 推荐 + 每种通俗说明 + 可排序表格

### 4.2 VIS-0.3-F Hook 事件完整目录

- **Brief 期望**：垂直时间轴中线 + 4 阶段从上到下 + 事件卡片左右交替 + 四阶段色 + 成对事件弧线
- **HTML 现状**（Block 7 prep §三，评分 7/10）：
  - 实现：Space Mono + Noto Serif SC 字体组合，四阶段颜色变量（session 蓝 / query 紫 / tool 橙 / agent 绿）与 Brief 完全一致，866 行
  - 动效：卡片滑入（IntersectionObserver）+ 阶段筛选按钮
  - **主要差距**：成对事件弧线（onToolCall ↔ onToolResult）的 SVG 跨卡片绘制难度高，可能未实现；27 事件的详细参数/返回值覆盖度待逐一核验
- **V2 改造**：CSS Grid 页面级中线 + 左右交替卡片（比 iframe 更原生），弧线用 inline SVG 绝对定位覆盖，可增加"一键复制事件监听代码"功能（V2 发挥空间）
- **必保留**：27 事件穷举（4+8+10+5）+ 四阶段色不变 + 垂直时间轴结构 + 每事件有时机+参数 + 成对事件弧线

### 4.3 VIS-0.3-G 扩展生态地图

- **Brief 期望**：有机地图隐喻（五块不规则区域）/ card-network / 散点图三选一，体现范围 × 复杂度两轴 + 组合场景
- **HTML 现状**（Block 7 prep §三，评分 6/10）：
  - 实现：radial-gradient 背景 + Space Grotesk 字体 + .map-wrapper 容器，540 行
  - 数据：CSS 变量包含 5 种机制颜色（与 Brief 完全一致）
  - **主要差距**：有机形状（贝塞尔曲线 SVG path）很可能降级为圆角矩形；重叠区域颜色混合组合场景难以实现；两轴标注可能缺失
- **V2 改造（OQ5 放开视觉形式）**：允许 card-network 节点+连线 / 散点图（X=复杂度、Y=能力范围）/ 真 SVG path 有机地图三种选项，但两轴标注 + 至少 2 组合场景必须落地
- **必保留**：五大机制全展示 + 五色不变 + 复杂度维度可辨（大小或位置）+ ≥2 组合场景标注

## 5. 评审 Checklist（满分 75，≥60 分允许进入下一阶段融合）

| # | 检查项 | 评分依据 | 分值 |
|---|---|---|---|
| 1 | OS 表锚点三行小卡（设备驱动 + 内核模块 + 包管理器） | grep `设备驱动\|Drivers` + `内核模块\|Modules` + `包管理器\|apt/npm` 全命中 | 5 |
| 2 | USB 转接器 💡 通俗理解逐字 | grep `MacBook` `Type-C` `万能转接器` `外部工具和服务` | 5 |
| 3 | 快递柜短信通知 💡 通俗理解逐字 | grep `快递柜的短信通知` `事件钩子` `放门口` `预设的动作` | 5 |
| 4 | VIS-0.3-D 8 种传输方式全在 | grep `stdio` `SSE` `Streamable HTTP` `WebSocket` `HTTP+JSON-RPC` `gRPC` `Unix Domain Socket` `Named Pipe` | 5 |
| 5 | VIS-0.3-D 5 维度全在 | grep `延迟` `吞吐` `安全` `复杂度` `可靠性` | 5 |
| 6 | **VIS-0.3-D 必须是柱状图，不得出现雷达图** | grep `bar\|柱状图` 存在 AND grep `radar\|雷达` **不存在** | 10 |
| 7 | VIS-0.3-D stdio + SSE 推荐标注 | grep `recommended\|推荐\|★` + stdio/SSE 关联 | 5 |
| 8 | VIS-0.3-F 27 个事件按 4 阶段穷举 | grep 阶段数 4+8+10+5=27，事件名覆盖度核查 | 5 |
| 9 | VIS-0.3-F 四阶段颜色不变（Session 蓝 / Query 紫 / Tool 橙 / Agent 绿） | grep session/query/tool/agent 对应色值或 token | 5 |
| 10 | VIS-0.3-F 成对事件弧线或标注（onToolCall ↔ onToolResult） | grep `onToolCall` `onToolResult` + 视觉关联标记 | 5 |
| 11 | VIS-0.3-G 五大机制全展示 | grep `MCP` `Hooks` `CLAUDE.md` `Skills` `自定义命令\|Custom Commands` | 5 |
| 12 | VIS-0.3-G 五色分配不变 | grep 五种机制对应色值或 token | 5 |
| 13 | VIS-0.3-G 至少 2 个组合场景 | grep `MCP+Hooks` 或 `CLAUDE.md+Skills` 等组合标注 ≥ 2 | 5 |
| 14 | Q3 "三种不同尺度的接口" / Q4 "放大镜+清单+俯视图" 中段与收束 | grep 至少其中一个逐字或近似 | 5 |
| 15 | 块尾 Block 7c 过渡逐字 | grep `对外延展` `视角收回来` `软组织` `骨架` | 5 |
| 16 | 严禁红线: grep `小区门禁` `权限模式` `plan/default/acceptEdits` `配置地图` `~/.claude/` `Tool.ts` `穿衣服的层次` `credentials.json` `1,884` `476,875` `内核` `Syscall` `43 个内置工具` `让我们开始` 全 0 | 任 1 命中 = -3 分 | 5 |

**满分 75 分**，**≥60 分**才允许进入下一阶段融合。

## 6. 输出契约

- 文件名：`v2-demos/block7b/prologue-block7b-<kimi|minimax>-<timestamp>.html`
- 文件大小预算：80-150 KB（含 3 张图，体量比 7a 大 50%）
- 行数预算：1200-2000 行
- 编码：UTF-8
- 路径一致性：iframe 严禁，外部依赖严禁

## 7. 特殊提醒

- **本块灵魂 = 三种尺度的对外接口**：MCP（连外部）/ Hooks（插内部）/ Skills+插件（装第三方）。三者缺一则块残废。
- **VIS-0.3-D 视觉形式纠错是本块的头号任务**：HTML 现状是雷达图的失败实现，V2 必须彻底换成组合柱状图。Kimi / MiniMax 任一方交稿仍是雷达图的直接判负（checklist #6 占 10 分）。
- **L149 包管理器没有独立通俗理解**：不得虚构。"穿衣服的层次"属于 L133 /etc/ 配置，归 Block 7c，严禁挪用。
- **27 个 Hook 事件必须穷举到具体事件名**：不能只写"Session 4 / Query 8 / Tool 10 / Agent 5"的数字抽象，必须落地到 onSessionStart / onToolCall 等具体名字。必保留事实清单 D 类已列示例事件名。
- **OS 表锚点小卡是跨块组件**：Block 7a 已用同组件摘一行（安全模型），Block 7b 摘三行（设备驱动 + 内核模块 + 包管理器），Block 7c 将摘一行（/etc/ 配置）。保持视觉一致性。
- **不要展开 Block 7a/7c 的内容**：哪怕只是隐晦提及"安全权限" / "配置" 也要小心。Block 7b 的视野严格是"对外延展面"。

## 8. 与其他子 Agent 的协作约定

- 双跑模式：Kimi + MiniMax 独立产出
- 评审 sub-agent 用 §5 checklist 各打一份分
- 最终融合由 Opus 决定

## 9. 本 Brief 草稿的待补空白（交给 Opus 下一会话）

以下项为 Sonnet 副手在没有更多 prep 材料支撑时无法定稿的内容，需 Opus 在下一会话完善后再 fire：

1. **Q3 / Q4 金句终稿**：Sonnet 草拟的两句 pull-quote（"三种不同尺度的接口" / "放大镜+清单+俯视图"）需 Opus 定稿/替换/合并
2. **Hook 事件名逐一核验**：必保留清单 D 类中 27 个事件名是基于 Block 7 prep 的示例列表，与 2.1.88 源码的实际 Hook 定义是否 100% 对齐需 Opus 或另一轮 Sonnet 子查核验（当前列出的事件名用于让生成端"不能只写数字"，但源码真实事件名如有出入需 Opus 拍板以哪个版本为准）
3. **OS 表锚点卡片的视觉形式**：三行合一卡 / 三张并列小卡 / 其它 —— Sonnet 允许两种实现，Opus 需拍一种以保持与 7a (一行锚点) 和 7c (一行锚点) 的视觉一致性
4. **VIS-0.3-G 的三种视觉形式选择**：Sonnet 按 OQ5 放开（card-network / 散点图 / 有机地图），Opus 可收紧为二选一或指定其一
5. **块尾过渡句**：Sonnet 已逐字采用 Block 7 prep §五的"看完了系统怎么向外延展……"句，Opus 可按整体节奏微调
6. **评审 checklist #6 的权重（柱状图纠错占 10 分）**：是否需要再升权（如 15 分）以对应本块的头号任务地位，留 Opus 判断

---

*Brief draft by Sonnet 副手 on 2026-04-07 — 严格基于 Block 7 prep §三 + 序章 L124-128/143-151 逐字 + Sonnet 采纳的 Opus 决断，零虚构。Block 7b 是 Block 7 信息密度顶点的第 2 拍，对外延展面技术深潜，最大复杂度 block（3 张图 + 4.5h）。等 Opus 完善 §9 待补空白后 fire 双跑。*
