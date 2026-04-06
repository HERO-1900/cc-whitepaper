# V2 序章 Block 7c · 内部组织 · Brief（草稿）

> 状态：**Sonnet 副手起草骨架，等 Opus 下一会话完善后 fire 双跑**
> 任务派发：双跑（Kimi 主跑 + MiniMax 主跑），独立产出后做交叉评审
> 块内职责：**Block 7 信息密度顶点的第 3 拍 / OS 类比"/etc/ 配置"行 + 对照表整体作为模块依赖的隐含背书**。从"扩展是对外延展面"切到"把视角收回来看系统**自己**——配置层是软组织、模块依赖图是骨架"。
> 工时预算：3-4h（含 2 张图 0.3-E 配置地图 + 0.3-H 模块依赖网络图，后者是 15 张图中实现最完整的之一）
> Brief 撰写人：Sonnet (副手骨架) → Opus (完善)
> 创建时间：2026-04-07
> 实例化模板：handoff/v2-prologue-brief-template-2026-04-06.md
> 素材原料包：handoff/v2-prologue-block7-prep-2026-04-06.md（§四 Block 7c 段落）
> 样板：handoff/v2-prologue-brief-block7a-安全防线.md
> Opus 5 OQ 决断：见 §0.2（Sonnet 直接采纳，不要求 Opus 重决）

---

## 0. 给生成 Sub-Agent 的硬约束（最优先读）

**MUST**:
- 输出唯一一份完整 HTML 文件，无外部依赖
- token 引用：仅 `var(--cc-*)`，字体 `var(--cc-font-sans)` + `var(--cc-font-mono)`
- 数字精度：所有数字逐位精确（FM-09）——配置系统 5 层 + 4 子层，模块依赖图约 50 节点 / 6 集群 / Tool.ts 入度最大
- dark 主题为基线 + light 主题覆盖
- 不调用 JS 框架 / CDN（D3 例外：VIS-0.3-H 的力导向需要 D3，但必须内嵌或单一自托管脚本，不得 CDN）
- **L131 OS 类比表行必须保留（/etc/ 配置）**：「**/etc/ 配置** | 设置系统（5 层 + 4 子层） | 从企业策略到用户偏好的九层配置合并，就像 /etc/ 下的系统配置覆盖用户 ~/.config」
- **L133 穿衣服的层次通俗理解必须逐字保留**：「💡 **通俗理解**：配置系统就像**穿衣服的层次**——贴身内衣 = 默认配置 → 衬衫 = 项目配置 → 外套 = 用户配置 → 防弹衣 = 企业策略。外层覆盖内层，但防弹衣（企业策略）最高优先级，谁也脱不掉。」
- **VIS-0.3-E 必出**：左右双栏文件树（左=全局 `~/.claude/`、右=项目 `.claude/`）+ credentials.json 红色警告 + 底部水平优先级链 + .claudeignore 标注
- **双栏颜色编码**：左=蓝（全局），右=绿（项目），credentials.json=红
- **VIS-0.3-H 必出**：D3 力导向图（节点大小映射入度），约 50 节点，**六大集群染色**（工具蓝 / 命令绿 / API 紫 / MCP 橙 / 配置黄 / 工具类灰），hover 时其他节点变暗（dim 效果），被 hover 节点及其直接关联保持高亮；minimap 小地图必须保留
- **VIS-0.3-H Tool.ts 必须是节点入度最大的枢纽**（被 43 个工具依赖，与 Block 6 呼应但不重复讲 43 工具目录）
- **优先级链必须完整**：目录 CLAUDE.md > 项目 CLAUDE.md > 项目 settings > 全局 settings > 默认值
- **块尾过渡到 Block 8** 必须逐字使用 Block 7 prep §五衔接建议：「软组织 + 骨架 = 系统的内部肌理——这也是为什么 Claude Code 在不同环境下会表现出不同行为，但核心结构始终稳定。现在你已经看完了 Claude Code 的全身解剖——是时候规划你的阅读路径了。」

**MUST NOT**:
- 严禁 `iframe` / `Math.random` / 凑数式数据补全
- **VIS-0.3-H 不破例 iframe**（OQ3）：V2 是全页范式，用**静态预布局 + JS 增强**绕过 D3 force simulation 的事件冲突，不回退到 iframe 隔离
- 严禁拿 LLM 自己虚构的配置文件 / 模块名 / 集群分类
- 严禁混入 Block 1-6 / Block 7a / Block 7b / Block 8-9 任何元素
- 严禁混入 Block 4 hero (1,884 / 476,875 / 40 / 98 / 一个为 AI 智能体设计的操作系统)
- 严禁混入 Block 5 (这不是使用指南 / 这是工程解剖)
- 严禁混入 Block 6 全文 (三件事面板 / 内核 / Syscall / 43 工具目录 / 课程关联)
- **严禁展开 Block 7a 内容**（安全矩阵 / 权限对照表 / 6 种权限模式 / 小区门禁 / plan/default/bypass）
- **严禁展开 Block 7b 内容**（MCP 传输方式 / Hook 事件目录 / 扩展生态地图 / USB 转接器 / 快递柜短信通知 / 27 个 Hook / 8 种 MCP）
- 严禁展开 OS 类比表的其它行（只摘 /etc/ 配置一行）
- 严禁混入 Block 8/9 (三类读者 / 5 比喻家族 / 让我们开始) 的其它元素——本块尾句**仅**借用 Block 8 "规划阅读路径"作为衔接钩子，不得展开
- 严禁视觉冲击力压过 Block 4

### 0.1 数字纪律（逐位精确，FM-09）

| 数字 | 值 | 来源 | 允许改写？ |
|---|---|---|---|
| 配置系统层数 | **5 层 + 4 子层 = 9 层** | L131 OS 表行 | 否 |
| 穿衣服层数 | **4 层**（内衣 → 衬衫 → 外套 → 防弹衣） | L133 | 否 |
| 模块依赖图节点数 | 约 **50** 节点 | Block 7 prep §四 VIS-0.3-H | 否（允许 50-60 区间） |
| 模块依赖图集群数 | **6 大集群** | Block 7 prep §四 VIS-0.3-H | 否 |
| 六大集群名 | 工具 / 命令 / API / MCP / 配置 / 工具类 | Block 7 prep §四 | 否 |
| Tool.ts 入度 | 被 **43** 个工具依赖（与 Block 6 的 43 工具数字呼应，但不得重复讲"43 工具目录"本身） | Block 7 prep §四 + L153 | 否 |
| 优先级链层级 | **5 层**：目录 CLAUDE.md > 项目 CLAUDE.md > 项目 settings > 全局 settings > 默认值 | Block 7 prep §四 | 否 |

### 0.2 Opus 5 OQ 决断（Sonnet 副手采纳，不要求 Opus 重决）

| OQ | 议题 | 决断 |
|----|------|---------|
| **OQ1** | OS 类比表如何拆 | **选项 B**（与 7a/7b 一致）：Block 6 出一次整表，Block 7c 开头摘取「/etc/ 配置」行作为"OS 类比锚点"小卡片 |
| **OQ2** | Block 7c 是否合并 7a/7b | **不合并**（保持三拆，7c 是"对内收束" block） |
| **OQ3** | **VIS-0.3-H 是否破例 iframe** | **不破例**：V2 是全页范式，VIS-0.3-H 必须使用**静态预布局 + JS 增强**（预计算力模型位置 → 固定节点坐标 → 运行时只做 hover/dim/zoom 增强），绕过 D3 force simulation 的滚动事件污染。D3 库可自托管内嵌，但不得 iframe 隔离 |
| **OQ4** | VIS-0.3-E 双栏布局 | **左右双栏必出**：左 6 列 = 全局 `~/.claude/`（蓝），右 6 列 = 项目 `.claude/`（绿），credentials.json 红色警告强制标注 |
| **OQ5** | 块尾是否衔接 Block 8 | **衔接**：借用 Block 7 prep §五的"全身解剖完毕 → 是时候规划阅读路径"作为过渡钩子，但不展开 Block 8 的三类读者 / 三条阅读路线等正文内容 |

---

## 1. 块在 11 块叙事弧中的位置

```
块1 → 块2 → 块3 → 块4 → 块5 → 块6 → 块7a → 块7b → [块7c] → 块8 → 块9
hero  反差  生态  数字  使命  OS建立 安全    接口    内部     分流  收尾
```

- **本块**：第 9 拍，三拆中的第 3 拍 / 收束拍
- **节奏角色**：★ **Block 7 信息密度顶点的第 3 拍 / 内部肌理技术收束**
- **上一块（Block 7b 外部接口）交接情绪**：刚被「看完了系统怎么向外延展，让我们把视角收回来——看系统**自己**长什么样。它的内部组织有两个层面：可配置的'软组织'，和模块之间的'骨架'。」推动到"准备深潜内部结构"
- **我要交给下一块（Block 8 阅读分流）的情绪**：把"系统的全身解剖已完"递为"是时候规划你的阅读路径了"

## 2. 内容承载

### 2.1 原文（来自 `book/part0_序章/00_序章.md` 第 131-135 行 + 第 153 行）

```markdown
| **/etc/ 配置** | 设置系统（5 层 + 4 子层） | 从企业策略到用户偏好的九层配置合并，就像 /etc/ 下的系统配置覆盖用户 ~/.config |

> 💡 **通俗理解**：配置系统就像**穿衣服的层次**——贴身内衣 = 默认配置 → 衬衫 = 项目配置 → 外套 = 用户配置 → 防弹衣 = 企业策略。外层覆盖内层，但防弹衣（企业策略）最高优先级，谁也脱不掉。

> **[图表预留 0.3-E]**：配置文件完整地图——`~/.claude/`（全局）→ `.claude/`（项目）→ 工作区 `CLAUDE.md` 的三层配置树、优先级链与每个文件的用途说明。

[……原文中间的进程间通信 / 开机引导 / 内核模块 / 包管理器行被 Block 7b 拿走或跳过，不纳入本块范围……]

> **[图表预留 0.3-H]**：模块依赖网络图——按集群（Tools / Commands / API / MCP / Config / Utils）染色的模块依赖图，标注 Tool.ts（in-degree 43）等枢纽节点与循环依赖。
```

### 2.2 必保留事实清单

**A 类 — OS 类比表行（开头锚点小卡片，OQ1 选项 B）**

| OS 概念 | CC 对应物 | 类比成立理由 |
|---|---|---|
| **/etc/ 配置** | 设置系统（5 层 + 4 子层） | 从企业策略到用户偏好的九层配置合并，就像 /etc/ 下的系统配置覆盖用户 ~/.config |

**B 类 — 必出 1 段「💡 通俗理解」（逐字保留）**

| 类比 | 内容（逐字） |
|---|---|
| **穿衣服的层次** | 贴身内衣 = 默认配置 → 衬衫 = 项目配置 → 外套 = 用户配置 → 防弹衣 = 企业策略。外层覆盖内层，但防弹衣（企业策略）最高优先级，谁也脱不掉。 |

> 注：原文 L153 的模块依赖图预留**没有独立的"💡 通俗理解"段落**（整个"模块依赖"概念是借整张 OS 类比表作为隐含背书），本块不为模块依赖图虚构通俗类比。如需新增类比由 Opus 拍板，不由 Sonnet 生成。

**C 类 — VIS-0.3-E 配置文件完整地图（必出图 1）**

| 字段 | 值 |
|---|---|
| 标题 | 配置文件完整地图 / 全局 · 项目 · 工作区三层配置树 |
| **视觉形式（OQ4）** | 左右双栏文件树：左 6 列 = 全局 `~/.claude/`，右 6 列 = 项目 `.claude/` |
| 全局区颜色 | **蓝** (accent-blue) |
| 项目区颜色 | **绿** (accent-green) |
| 全局区文件清单 | settings.json / keybindings.json / **credentials.json（敏感，红标）** / memory / projects / todos / statsig |
| 项目区文件清单 | settings.json / settings.local.json / commands/*.md / CLAUDE.md |
| 工作区配置 | 各目录 CLAUDE.md / **.claudeignore**（必须标注，影响 Glob/Grep 搜索范围） |
| **credentials.json 强制标注** | 红色 (accent-red) + "请勿提交 git" 警告文字 |
| **底部优先级链（必须完整）** | 目录 CLAUDE.md > 项目 CLAUDE.md > 项目 settings > 全局 settings > 默认值（inline SVG 箭头连接，从高到低） |
| 交互 | 文件树节点 hover 高亮 + 点击展开/折叠 + 与右侧说明卡联动 + 搜索过滤 |
| 发挥空间 | 用真实 JSON/TOML 文件内容片段作为 hover tooltip |

**D 类 — VIS-0.3-H 模块依赖网络图（必出图 2）**

| 字段 | 值 |
|---|---|
| 标题 | 模块依赖网络图 / 六大集群的力导向依赖图 |
| **视觉形式（OQ3）** | **静态预布局 + JS 增强**：预计算节点位置 → 固定坐标 → 运行时 hover/dim/zoom 增强。**严禁 iframe**，严禁依赖 runtime force simulation 污染页面滚动 |
| 节点数 | 约 **50** 节点（允许 50-60） |
| **六大集群染色** | 工具=**蓝** / 命令=**绿** / API=**紫** / MCP=**橙** / 配置=**黄** / 工具类=**灰** |
| 枢纽节点 | **Tool.ts 入度最大**（被 43 个工具依赖），queryLoop.ts / settings.ts / permissions.ts / messages.ts 为次级枢纽 |
| 节点大小映射 | 入度越大节点越大，Tool.ts 最大 |
| 枢纽光晕 | Tool.ts / queryLoop.ts / settings.ts / permissions.ts 必须有光晕标注 |
| 循环依赖警示 | 红色虚线连接 |
| **hover 行为（必出）** | 其他节点 opacity 降为 dim，被 hover 节点及其直接关联保持高亮 |
| **minimap 小地图（必出）** | 右下角缩略导航图 |
| 缩放 | d3.zoom 支持鼠标滚轮 + 拖拽（但滚轮缩放必须与页面滚动事件区隔，推荐 Ctrl+滚轮 或限定 hover 区域内） |
| 详情面板 | 点击节点弹出 detail-panel |
| 发挥空间 | "按集群过滤"切换按钮 / "只看高入度节点"聚焦模式 |

**E 类 — 必出现的金句**

| # | 金句 | 来源 |
|---|------|------|
| Q1 | **「从企业策略到用户偏好的九层配置合并」** | L131（从 OS 表行抽出） |
| Q2 | **「防弹衣（企业策略）最高优先级，谁也脱不掉」** | L133（从穿衣服类比抽出） |
| Q3 | **「配置层是软组织，模块依赖图是骨架——软组织 + 骨架 = 系统的内部肌理」** | Sonnet 草拟（基于 Block 7 prep §四目标读者认知 + §五块尾过渡，待 Opus 审） |
| Q4 | **「Tool.ts 是最大的枢纽——这也是为什么工具系统是 Claude Code 的半条命」** | Sonnet 草拟（基于 Block 7 prep §四子块叙事弧第 4 步 + Tool.ts in-degree 43，待 Opus 审） |

### 2.3 严禁出现的内容

| 内容 | 严禁原因 |
|------|---------|
| 安全矩阵 / 权限对照表 / 6 种权限模式 / plan/default/acceptEdits/autoAccept/bypass/dontAsk / 小区门禁 | Block 7a 弹药 |
| MCP / Hooks / Skills / 扩展机制 / 27 个 Hook 事件 / 8 种 MCP 传输 / USB 转接器 / 快递柜短信通知 / 扩展生态地图 / 设备驱动 / 内核模块 / 包管理器 OS 行 | Block 7b 弹药 |
| 内核 / 系统调用 / 三件事面板 / 43 工具目录（列表形式） / 课程关联 / 快递分拣流水线 | Block 6 弹药（注：Tool.ts 入度"43"作为数字引用不在禁区，但 Block 6 的"43 工具目录"列表形式严禁出现） |
| Block 1-5 / Block 8-9 任何正文元素 | 跨块边界 |
| Block 4 hero 数字 (1,884 / 476,875 / 40 / 98 / "操作系统" pull-quote) | 已用 |
| Block 8 的三类读者 / 三条阅读路线 / CS 学生 / 高级工程师 / AI 创业者 / 五个比喻家族 | Block 8/9 正文弹药（块尾钩子只允许"规划阅读路径"一句） |
| **iframe 包裹 VIS-0.3-H** | OQ3 硬约束：V2 全页范式不破例 |

## 3. 视觉语言

### 3.1 推荐视觉组件

| 组件 | 用途 | 优先级 |
|---|---|---|
| **prologue-marginal-label** + **hero-footer** (块号 07c + 块名 + sub-title) | 全书 spec | **P0** |
| **block-title** "内部组织" | H2 | **P0** |
| **os-table-anchor-card** (摘取的"/etc/ 配置"行) | 开头锚点 | **P0** |
| **insight-block 💡 穿衣服的层次** | 通俗类比 | **P0** |
| **vis-0-3-e-config-pair** (左右双栏文件树 + 底部优先级链) | 第 1 张图 | **P0** |
| **vis-0-3-h-dependency-network** (静态预布局力导向图 + minimap) | 第 2 张图 | **P0** |
| **q3-soft-hard-tissue** "软组织+骨架=内部肌理" | 中段过渡 | **P0** |
| **q4-tool-ts-pivot** "Tool.ts 是最大的枢纽" | 收束 | P1 |
| **block-8-bridge** | 块尾过渡 | **P0** |

### 3.2 节奏建议

1. **顶部 marginal label + hero footer**："序章 · Block 07c · 内部组织"
2. **块标题**："## 内部组织"
3. **OS 表锚点小卡片**：摘取"/etc/ 配置 → 设置系统（5 层 + 4 子层）"行 + 标签"OS 类比锚点"
4. **💡 穿衣服的层次通俗理解**：逐字保留
5. **过渡句**：「配置是系统的'软组织'——让我们看看这件衣服具体长什么样」
6. **VIS-0.3-E 双栏文件树**：左蓝（全局 ~/.claude/）+ 右绿（项目 .claude/）+ credentials.json 红标 + 底部优先级链
7. **过渡句**：「配置决定系统的'脾气'，那决定系统的'骨骼'是什么？答案是模块之间的依赖关系」
8. **VIS-0.3-H 模块依赖网络**（静态预布局 + JS 增强）：六大集群染色 + Tool.ts 最大枢纽 + minimap
9. **Q4 收束**："Tool.ts 是最大的枢纽——这也是为什么工具系统是 Claude Code 的半条命"
10. **Q3 + 块尾 Block 8 过渡**：「配置层（软）+ 依赖层（硬）共同构成系统的内部肌理——这也是为什么 Claude Code 在不同环境下会表现出不同行为，但核心结构始终稳定。现在你已经看完了 Claude Code 的全身解剖——是时候规划你的阅读路径了。」

### 3.3 字体/留白/对比度建议

- 块标题：`var(--cc-font-size-4xl)` ~ `5xl`，bold
- OS 表锚点小卡：背景 surface-secondary，"OS 类比锚点"标签 + 行内容
- VIS-0.3-E 双栏：CSS Grid 12 列（左 6 / 右 6），文件节点用 mono 字体；credentials.json 用 accent-red 边框 + 警告图标
- VIS-0.3-E 底部优先级链：全宽 mapping-row 风格，inline SVG 箭头
- VIS-0.3-H 依赖图：SVG 固定坐标预布局（避免 runtime force 污染滚动），节点用 `var(--cc-*)` token 染色，hover 时 CSS transition 切换 opacity
- Q3 / Q4 pull-quote：`var(--cc-font-size-2xl)` ~ `3xl`
- 块尾过渡：`var(--cc-font-size-xl)`
- block padding：`var(--cc-space-12)` 上下
- **节奏方向**：E 在前（小尺度：具体文件路径）→ H 在后（大尺度：整体模块图）。读者从"我能看见的具体文件"过渡到"我看不见的模块依赖"
- 视觉冲击力：收束节奏不抢 Block 4 情绪顶点，但 VIS-0.3-H 的六大集群染色是序章最后一张 data-heavy 图的视觉聚焦点

## 4. 双源理解（2 张图）

### 4.1 VIS-0.3-E 配置文件完整地图

- **Brief 期望**：左右双栏文件树 + credentials.json 红标 + 底部优先级链 + .claudeignore 标注 + hover 展开/折叠 + 搜索过滤
- **HTML 现状**（Block 7 prep §四，评分 8/10，**1023 行是 15 张图中最长的 HTML**）：
  - 实现：Space Grotesk + JetBrains Mono 字体；蓝/绿双色调对应全局/项目；背景渐变 + noise 纹理
  - 数据：CSS 变量 accent-blue / accent-green / accent-red / accent-amber 与 Brief 双区编码完全一致
  - 动效：文件树节点展开/折叠 + 点击说明卡 + 搜索过滤 + 优先级链底部标注齐全
  - **主要差距**：代码示例语法高亮（Brief 要求 highlight.js/Prism.js）可能未实现；statsig 目录说明可能缺失
- **V2 改造**：双栏文件树直接落地页面级 grid（左 6 / 右 6），不 iframe；优先级链 inline SVG；hover tooltip 用真实 JSON/TOML 片段（V2 发挥空间）
- **必保留**：左右双栏 + 蓝绿色编码 + credentials.json 红警告 + 底部 5 层优先级链 + .claudeignore 标注

### 4.2 VIS-0.3-H 模块依赖网络图

- **Brief 期望**：D3 力导向图，50-60 节点，六大集群染色，Tool.ts 入度最大，hover dim/highlight，minimap，d3.zoom，detail-panel
- **HTML 现状**（Block 7 prep §四，评分 9/10，**是 15 张图中最接近完整实现的之一**）：
  - 实现：D3.js 力导向图（全屏，overflow:hidden），五大集群（工具/命令/API/MCP/配置），节点按入度调整大小，枢纽节点有光晕
  - 数据：约 50 节点完整；Tool.ts / queryLoop.ts / settings.ts / permissions.ts 光晕标注；循环依赖红线
  - 动效：完整的 D3 力模拟（forceCenter / forceManyBody / forceLink / forceCollide）+ 拖拽 + hover dim/highlight + d3.zoom 缩放平移 + 搜索 + detail-panel + minimap
  - **主要差距**：Canvas 降级（节点超 100 时）未实现但不关键；WebWorker 计算力模型未实现；"连线权重"（单次 import 细线 / 多次引用粗线）未区分
- **V2 改造（OQ3 不破例 iframe）**：**不保留 iframe**。策略：
  - 方案 A（推荐）：**预计算 force simulation 的最终节点坐标**（可用 headless D3 跑一次 tick ≈ 300 输出 JSON），runtime 只做 SVG 固定坐标渲染 + hover/dim/zoom 增强，彻底避开 runtime force 与页面滚动的事件冲突
  - 方案 B（备选）：保留 runtime force，但通过 `pointer-events: none` + 区域化事件监听 + `wheel` 事件 preventDefault 条件化处理，让 D3 的滚轮缩放只在图表容器内生效
  - Opus 需在下一会话定稿选 A 还是 B
- **必保留**：D3 力导向布局的"视觉效果"（不得回退为静态树/列表） + 节点大小映射入度 + hover dim/highlight + 六大集群色不变 + minimap + Tool.ts 最大枢纽 + 光晕

## 5. 评审 Checklist（满分 65，≥52 分允许进入下一阶段融合）

| # | 检查项 | 评分依据 | 分值 |
|---|---|---|---|
| 1 | OS 表锚点小卡（/etc/ 配置 → 5 层 + 4 子层） | grep `/etc/` `设置系统` `5 层 + 4 子层` `九层配置合并` | 5 |
| 2 | 穿衣服的层次 💡 通俗理解逐字 | grep `贴身内衣` `衬衫` `外套` `防弹衣` `脱不掉` | 5 |
| 3 | VIS-0.3-E 左右双栏存在 | grep `~/.claude/` + `.claude/` + 左右布局 class/grid | 5 |
| 4 | VIS-0.3-E 全局区文件清单（≥4 项） | grep `settings.json` `keybindings.json` `credentials.json` `memory\|projects\|todos\|statsig` | 5 |
| 5 | VIS-0.3-E 项目区文件清单（≥3 项） | grep `settings.local.json` `commands` `CLAUDE.md` | 5 |
| 6 | **credentials.json 红色警告 + "请勿提交 git"** | grep `credentials.json` + red/warning 样式 + `请勿提交 git\|敏感\|gitignore` | 5 |
| 7 | **底部优先级链 5 层完整** | grep 含 `目录 CLAUDE.md` `项目 CLAUDE.md` `项目 settings` `全局 settings` `默认值` | 5 |
| 8 | .claudeignore 标注 | grep `.claudeignore` | 5 |
| 9 | VIS-0.3-H 六大集群染色 | grep `工具\|Tools` + `命令\|Commands` + `API` + `MCP` + `配置\|Config` + `工具类\|Utils` | 5 |
| 10 | VIS-0.3-H Tool.ts 最大枢纽 + 入度 43 | grep `Tool.ts` + `43` + 光晕/枢纽样式 | 5 |
| 11 | VIS-0.3-H hover dim/highlight + minimap | grep `dim\|highlight\|opacity` + `minimap\|小地图` | 5 |
| 12 | **VIS-0.3-H 不得使用 iframe** | grep `<iframe` = 0（全文档级） | 5 |
| 13 | Q3 "软组织+骨架=内部肌理" 中段 + 块尾 Block 8 过渡 "全身解剖" | grep `软组织` `骨架` `全身解剖` `阅读路径` | 5 |
| 14 | 严禁红线: grep `小区门禁` `权限模式` `plan/default` `MCP 传输` `Hook 事件` `扩展生态` `USB 转接器` `快递柜短信` `三类读者` `1,884` `476,875` `让我们开始` `5 比喻家族` 全 0 | 任 1 命中 = -3 分 | 5 |

**满分 65 分**，**≥52 分**才允许进入下一阶段融合。

## 6. 输出契约

- 文件名：`v2-demos/block7c/prologue-block7c-<kimi|minimax>-<timestamp>.html`
- 文件大小预算：80-150 KB（VIS-0.3-E 单图 HTML 就有 1023 行基准，加 VIS-0.3-H 体量较大）
- 行数预算：1200-2000 行
- 编码：UTF-8
- iframe 严禁（特别是 VIS-0.3-H），外部 CDN 严禁，D3 可内嵌自托管

## 7. 特殊提醒

- **本块灵魂 = 软组织 + 骨架**：VIS-0.3-E 配置地图（软）+ VIS-0.3-H 模块依赖图（硬）。两张图都是"系统内部肌理"的可视化，缺一则块残废。
- **VIS-0.3-H 不破例 iframe 是本块的头号技术挑战（OQ3）**：这是序章中唯一曾被允许考虑 iframe 的图，Opus 决断"不破例"，Sonnet/Kimi/MiniMax 必须用"预计算力模型坐标 → 固定节点坐标 → runtime 仅 hover/zoom 增强"策略绕过。如果生成端仍产出 iframe 版本 → checklist #12 直接判负。
- **Tool.ts 入度 43 数字引用 ≠ 重复 Block 6 "43 工具目录"**：本块可以提"Tool.ts 被 43 个工具依赖"，但严禁重复 Block 6 的 43 工具完整列表形式（File/Search/Execute/Agent/Web/Other 分类）。
- **块尾钩子只借 Block 8 的"规划阅读路径"一句**：严禁展开 Block 8 正文（三类读者 / 三条阅读路线 / CS 学生 / 高级工程师 / AI 创业者）。本块负责"Block 7 技术解剖收尾"+"Block 8 入口钩子"，不负责 Block 8 开场。
- **L153 模块依赖图没有独立通俗理解段落**：不得虚构"穿衣服的层次"以外的通俗类比。Opus 若要新增须由 Opus 亲自拍板。
- **OS 表锚点小卡是跨块组件**：Block 7a 摘一行（安全模型），Block 7b 摘三行（设备驱动 + 内核模块 + 包管理器），Block 7c 摘一行（/etc/ 配置）。保持视觉一致性。
- **不要展开 Block 7a/7b 的内容**：哪怕只是隐晦提及"权限" / "MCP" / "Hook" 也要小心。Block 7c 的视野严格是"系统的内部肌理"。

## 8. 与其他子 Agent 的协作约定

- 双跑模式：Kimi + MiniMax 独立产出
- 评审 sub-agent 用 §5 checklist 各打一份分
- 最终融合由 Opus 决定
- **VIS-0.3-H 的"预计算坐标"策略**：如果 Kimi/MiniMax 无法自行实现 headless D3 预跑，Opus 可考虑让另一个 Sonnet 子 Agent 先跑一次 D3 tick 输出 JSON 坐标文件，再交给生成端作为"静态数据"嵌入

## 9. 本 Brief 草稿的待补空白（交给 Opus 下一会话）

以下项为 Sonnet 副手在没有更多 prep 材料支撑时无法定稿的内容，需 Opus 在下一会话完善后再 fire：

1. **Q3 / Q4 金句终稿**：Sonnet 草拟的两句 pull-quote（"软组织+骨架=内部肌理" / "Tool.ts 是最大的枢纽——这也是为什么工具系统是 Claude Code 的半条命"）需 Opus 定稿/替换/合并
2. **VIS-0.3-H 静态预布局的实现路线拍板**：§4.2 方案 A（预计算 JSON 坐标）vs 方案 B（区域化 runtime force + wheel 条件化）需 Opus 决断。方案 A 更稳但需额外一轮 headless D3；方案 B 更快但事件隔离风险高
3. **六大集群精确节点分配**：Block 7 prep §四说"约 50 节点 / 六大集群"，但每集群的具体节点数量 / 节点名未逐一核对。Opus 或另一轮 Sonnet 需查 `test-viz/production/html/` 下 VIS-0-H 实际 HTML 提取完整节点列表作为"不得虚构"的数据锚
4. **L153 模块依赖图的通俗类比缺口**：原文没有独立通俗类比段落，是否需要 Opus 新增一段（如"城市地铁网络——换乘枢纽 = 高入度节点"）还是保持"穿衣服只给配置用，模块依赖纯技术表达"的克制风格
5. **块尾 Block 8 钩子的具体文案**：Sonnet 使用"现在你已经看完了 Claude Code 的全身解剖——是时候规划你的阅读路径了"（借自 Block 7 prep §五），Opus 可按 Block 8 Brief 的实际开场句微调
6. **OS 表锚点小卡的跨块视觉一致性最终定稿**：7a 一行 / 7b 三行 / 7c 一行，三种 variant 的具体样式由 Opus 统一
7. **VIS-0.3-E 搜索过滤是否为 V2 P0 要求**：HTML 现状有搜索功能，Sonnet 默认保留，Opus 可降为 P1

---

*Brief draft by Sonnet 副手 on 2026-04-07 — 严格基于 Block 7 prep §四 + 序章 L131-135/L153 逐字 + Sonnet 采纳的 Opus 决断，零虚构。Block 7c 是 Block 7 信息密度顶点的第 3 拍，内部肌理技术收束，含序章最复杂的 D3 力导向图（但不破例 iframe）。等 Opus 完善 §9 待补空白后 fire 双跑。*
