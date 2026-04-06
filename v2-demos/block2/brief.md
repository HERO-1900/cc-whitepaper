# V2 序章 Block 2 · 反差引入（群雄并起 2026） · Brief

> 任务派发：双跑（Kimi 主跑 + MiniMax 主跑），独立产出后做交叉评审
> 块内职责：从 Block 1「打开引擎盖」的悬念，切到"为什么值得打开"的行业坐标系。**冷静呼吸位 / 宏观扫描**。建立"套控工程 / Harness Engineering"全书学术框架词。
> 工时预算：4-5h（无图表 / 0 张 VIS / 时间轴 + 8 竞品全量铺陈 + 三层架构示意 + 通俗解释卡）
> Brief 撰写人：Opus
> 创建时间：2026-04-07 03:25
> 实例化模板：handoff/v2-prologue-brief-template-2026-04-06.md
> 素材原料包：handoff/v2-prologue-block2-prep-2026-04-07.md（含 8 OQ + 4 处口径冲突）
> Opus 8 OQ 决断：见 §0.2

---

## 0. 给生成 Sub-Agent 的硬约束（最优先读）

**MUST**:
- 输出唯一一份完整 HTML 文件，无外部依赖
- token 引用：仅 `var(--cc-*)`
- 字体：`var(--cc-font-sans)` 正文 + `var(--cc-font-mono)` 代码/年份/技术名
- 数字精度：本 Brief §2.2 的所有数字必须**逐位精确**，禁止约等于（FM-09）
- 配色：dark 主题为基线 + `[data-theme="light"]` 浅色覆盖
- 不调用任何 JavaScript 框架或 CDN
- **三阶段年份必须严守原文**：提示工程 **2023-24** / 上下文工程 **2025** / 套控工程 **2026**——**严禁抄 MiniMax demo 的 2022-2023 / 2023-2025 / 2025- 错口径**
- **8 个竞品必须全量铺陈**（GitHub Copilot Agent Mode / Cursor Background Agents / Kimi Code / OpenAI CodeX / OpenCode / Devin / Z Code (GLM) / Google Antigravity），**严禁 `<details><summary>` 折叠**
- **「套控」必须配 💡 通俗理解 微卡片**——xiaolin 评审强制要求"即时解释"
- **块尾 Q1「本书解剖的 Claude Code，正是一个 harness 设计的完整案例。」必须逐字保留**作为定锚句

**MUST NOT**:
- 严禁使用 `iframe`
- 严禁 `<details><summary>` 折叠表（拆块方案 L93）
- 严禁拿 LLM 自己虚构的产品 / 公司 / 数字
- 严禁混入 Block 1 的"引擎盖"主比喻 / 计算器 / "不是。差远了。" 炸点
- 严禁混入 Block 3 的 9,000+ stars / claw-code / harness-books / ccunpacked / byterover / 6 项目开源生态
- 严禁混入 Block 4 的 hero 数字 (1,884 / 476,875 / 40 / 98) / "一个为 AI 智能体设计的操作系统" / 7 AI 实例 / 进程调度器六件套
- 严禁混入 Block 5 的"这不是使用指南 / 这是工程解剖" / "我们不猜测" / 5 bullet / 83 章 / 360,583 字 / 122 图 / 185 Prompt
- 严禁混入 Block 6/7 的 OS 类比展开 / 内核 / 系统调用 / 配置地图 / 27 Hook 事件
- 严禁混入 Block 9 的 5 比喻家族 / 源码入口路径 / 2.1.88 版本号 / 4,684 行 main.tsx / 让我们开始
- 严禁出现"83 章 / 36 万字 / 122 图表 / 34 Harness 模块" 等白皮书元数据
- 严禁出现 OpenClaw / Manus（OQ3 决断已删除）
- 严禁修改 8 个竞品任何一行的"产品名 / 公司 / 特色" 三栏内容
- 严禁出现 IDE / 远程 / 终端 三维矩阵（OQ4 决断弃方案 C，避免编造数据）
- 严禁视觉冲击力超过 Block 1 hero（Block 2 是冷静呼吸位）
- 严禁出现"操作系统"一词（保留给 Block 4）

### 0.1 数字纪律红线

| 数字 | Block 2 是否可用 | 必须用 | 严禁用 |
|------|----------------|-------|-------|
| 2026（行业时间锚点） | ✅ 主场 | **2026** | 2025 / 2027 / 大约 |
| 三阶段年份 | ✅ 主场 | **2023-24 / 2025 / 2026** | MiniMax 错口径 2022-2023/2023-2025/2025- |
| Kimi Code 并发 | ✅（表格内） | **100 个** | "近百" |
| OpenCode GitHub Star | ✅（表格内） | **11 万+**（保留"万+"软单位） | 110K / 110000 |
| OpenCode 模型提供商 | ✅（表格内） | **75+** | 75 / 80 |
| Z Code (GLM) 参数量 | ✅（表格内） | **7440 亿** | 744B |
| 三阶段数 | ✅ | **3**（提示/上下文/套控） | 4 / 5 |
| Model+Runtime+Harness 三层 | ✅ | **3 层** | 4 层 |
| 内置 Subagent 数（OQ5 升级钩子） | ✅ 末尾镜像位 | **12** | 6 / 8 / 14 |
| Block 4 hero 数字 (1,884 / 476,875 / 40 / 98) | ❌ 严禁 | — | — |
| Block 3 社区数字 | ❌ 严禁 | — | — |

### 0.2 Opus 8 OQ 决断（必须严格执行）

| OQ | 议题 | Opus 决断 | 违反后果 |
|----|------|---------|---------|
| **OQ1** | L15 散文 6 竞品 vs L21-30 表格 8 竞品 | **选项 C 零改原文**：表格保持 8 行（产品/公司/特色），L15 散文保持原文 6 个 + 省略号，**Brief 在叙事中加一句过渡"完整名单见下表"** | 删表格 OpenCode/Z Code = -3 分；动原文 = -5 分 |
| **OQ2** | 三阶段年份口径 | **严守原文** 2023-24 / 2025 / 2026。**严禁抄 MiniMax demo 错口径** 2022-2023 / 2023-2025 / 2025- | 任 1 年份错 = 0 分 |
| **OQ3** | OpenClaw / Manus 处理 | **选项 A 删除**。三层架构示例只保留 Claude Code，避免引入未解释术语 | 出现 OpenClaw / Manus = -2 分 |
| **OQ4** | 三视觉方案选择 | **方案 A 时间轴 + 8 竞品紧凑型对照表为骨架** + **融合方案 B 的 hover 反转卡技术**（每张竞品卡片 hover 显示 1 句话定位）。**弃方案 C 二维矩阵**（IDE/远程/终端数据未核验，不能编造） | 选方案 C 单独使用 = -3 分 |
| **OQ5** | G1 "12 个内置 Subagent" 镜像钩子 | **采纳**。作为 Block 2 块尾**最后一段**："'群雄并起'不只在公司之间发生——它已经发生在 Claude Code 内部。一个 CLI 工具里就有 **12 个内置 Subagent**。"（**只用 12 数字，不用 G2 G3 的 8000/6500 Prompt 字数**——那些留给 Block 4/6） | 用 G2/G3 = -2 分 |
| **OQ6** | Q8 "disprove it" Verification Agent 金句 | **不采纳**。措辞未经核实，避免引入引语错漂 | 出现 "disprove" = -3 分 |
| **OQ7** | "套控 / Harness Engineering" 通俗解释 | **必出 💡 通俗理解 微卡片**。文案 Opus 已写定（见 §2.2 H 类）：「**'套控'就是给 AI 戴上'马具'——既要让它能拉车干活（工具能力），又要套上缰绳保证它不会乱跑（安全边界）。**」 | 缺 💡 卡片 = -3 分 |
| **OQ8** | "界面渲染 / 文件管理 / 进程隔离" 三伏笔标注 | **不显式标注**为伏笔（避免干扰呼吸位节奏）。文字保留在 Q4 段落里自然出现 | 显式标注"伏笔指向 Block 7" = -1 分 |

---

## 1. 块在 11 块叙事弧中的位置

```
块1 → [块2] → 块3 → 块4 → 块5 → 块6 → 块7a → 块7b → 块7c → 块8 → 块9
hero    反差    生态  数字  使命  OS建立 安全  接口  内部  分流  收尾
```

- **本块**：第 2 拍
- **节奏角色**：**☆ 第一次推进的第一拍 / 呼吸位 / 宏观扫描 / 信息密集但情绪冷静**。Pentagram 式"安静开场 → 慢慢推进"的"慢慢"步。
- **上一块（Block 1 引擎盖）交接情绪**：刚被"计算器悖论 + 不是。差远了。"击中，处于"好奇 + 惊讶"高能状态。Block 1 没有给"为什么"——只制造了悬念。
- **我要交给下一块（Block 3 生态爆发）的情绪**：把"好奇/惊讶"递为"判断 + 定位"，再递为"原来 Claude Code 是 harness 案例"——这样 Block 3 的"6 个开源项目围绕 CC 架构"才能被读者理解为"围绕这个案例的生态"。
- **本块的节奏任务**：**建立坐标系**。不抢 Block 1 的悬念、不抢 Block 4 的震撼，只负责给读者一张"2026 年 CC 在行业版图里站在哪里"的地图。

## 2. 内容承载

### 2.1 原文（来自 `book/part0_序章/00_序章.md` 第 15-34 行，4 个段落）

```markdown
> 🌍 **行业背景**：2026 年，AI 编程助手已完成从"帮你补全一行代码"向"自己动手完成整个任务"的根本转变。这个领域有多热闹？简单列几个名字你就能感受到：GitHub Copilot、Cursor、Kimi Code、OpenAI CodeX、Devin、Google Antigravity……每家都在做自己的 AI 编程助手，竞争激烈程度堪比智能手机大战。

> 在这个群雄并起的格局中，Claude Code 选择了一条独特的道路——不做 IDE 插件（IDE 是程序员写代码的专用编辑器，类似于设计师的 Photoshop），不做 Web 应用，而是在**终端**（那个黑底白字的命令行窗口）里构建一个完整的 AI 智能体运行时。这个选择让它成为唯一一个可以在纯远程服务器上工作、可以完全通过键盘操作、可以与任何编辑器无缝集成的 AI 编程助手。代价是：它必须自己解决界面渲染、文件管理、进程隔离等一系列在 IDE 环境中本来"免费"的问题。这本书要解剖的，正是这个雄心勃勃的工程选择背后的全部技术细节。

> | 产品 | 公司 | 特色 |
> |------|------|------|
> | GitHub Copilot Agent Mode | 微软/GitHub | 全面正式发布（GA），内置多个专职AI智能体 |
> | Cursor Background Agents | Anysphere | 在云端虚拟机中并行执行代码重构 |
> | Kimi Code | 月之暗面 | 基于万亿参数模型，最多100个并发子智能体 |
> | OpenAI CodeX | OpenAI | Rust重写底层，引入并行Agent工作流 |
> | OpenCode | 开源社区 | 11万+ GitHub Star，支持75+模型提供商 |
> | Devin | Cognition | 从"全自主"转向人机协作管控模式 |
> | Z Code (GLM) | 智谱AI | 7440亿参数，专注国产芯片和私有化部署 |
> | Google Antigravity | Google | Mission Control架构，重新定义工程协作 |

> 行业对这类系统的认知经历了三个阶段的演进：**提示工程**（Prompt Engineering, 2023-24）→ **上下文工程**（Context Engineering, 2025）→ **套控工程**（Harness Engineering, 2026）。LangChain 创始人 Harrison Chase 将其归纳为 Model + Runtime + Harness 三层架构——所有 Agent（Claude Code、OpenClaw、Manus）底层使用相同的三层结构，而 harness（套控层）的设计差异决定了产品表现的差异。本书解剖的 Claude Code，正是一个 harness 设计的完整案例。
```

**注**：原文 OpenClaw / Manus 已按 OQ3 决断**删除**，改写为「LangChain 创始人 Harrison Chase 将其归纳为 Model + Runtime + Harness 三层架构——其中 harness（套控层）的设计差异决定了产品表现的差异」。

### 2.2 必保留事实清单

**A 类 — 8 个竞品全量铺陈（不得删任何一行，不得改顺序）**

| # | 产品 | 公司 | 特色（逐字） |
|---|------|------|------|
| 1 | **GitHub Copilot Agent Mode** | 微软/GitHub | 全面正式发布（GA），内置多个专职AI智能体 |
| 2 | **Cursor Background Agents** | Anysphere | 在云端虚拟机中并行执行代码重构 |
| 3 | **Kimi Code** | 月之暗面 | 基于万亿参数模型，最多100个并发子智能体 |
| 4 | **OpenAI CodeX** | OpenAI | Rust重写底层，引入并行Agent工作流 |
| 5 | **OpenCode** | 开源社区 | 11万+ GitHub Star，支持75+模型提供商 |
| 6 | **Devin** | Cognition | 从"全自主"转向人机协作管控模式 |
| 7 | **Z Code (GLM)** | 智谱AI | 7440亿参数，专注国产芯片和私有化部署 |
| 8 | **Google Antigravity** | Google | Mission Control架构，重新定义工程协作 |

**B 类 — 三阶段时间轴（年份必须严守原文）**

| 阶段 | 英文 | 年份 | 视觉处理 |
|------|------|------|---------|
| **提示工程** | Prompt Engineering | **2023-24** | 时间轴第一拍，正常色 |
| **上下文工程** | Context Engineering | **2025** | 时间轴第二拍，正常色 |
| **套控工程** | Harness Engineering | **2026** | **时间轴第三拍 active 高亮位**（电击色 / 主色 brand） |

**C 类 — Harrison Chase + 三层架构（必出现）**

| 元素 | 文字（逐字） |
|------|------|
| 学术背书 | LangChain 创始人 Harrison Chase |
| 三层架构 | Model + Runtime + Harness |
| 学术命题 | harness（套控层）的设计差异决定了产品表现的差异 |

**D 类 — 必出现的金句（pull-quote）**

| # | 金句 | 来源 | 视觉处理 |
|---|------|------|---------|
| Q1 | **「本书解剖的 Claude Code，正是一个 harness 设计的完整案例。」** | L34 段尾 | **Block 2 块尾定锚句**，字号 ≥ `--cc-font-size-3xl`，独立成段 |
| Q2 | **「2026 年，AI 编程助手已完成从"帮你补全一行代码"向"自己动手完成整个任务"的根本转变。」** | L15 | **Block 2 块首时间锚句**，字号 ≥ `--cc-font-size-2xl` |
| Q3 | **「竞争激烈程度堪比智能手机大战。」** | L15 | 通俗比喻锚点，可作 Q2 副标 |
| Q4 | **「不做 IDE 插件，不做 Web 应用，而是在终端里构建一个完整的 AI 智能体运行时。」**（精简版） | L17 | "不做/不做/而是" 三拍反差宣言，独立强调位 |
| Q5 | **「唯一一个可以在纯远程服务器上工作、可以完全通过键盘操作、可以与任何编辑器无缝集成的 AI 编程助手。」** | L17 | 三条独特属性，"唯一一个"语气 |
| Q6 | **「harness（套控层）的设计差异决定了产品表现的差异。」** | L34 | 学术框架核心命题，必须配 💡 通俗理解卡（OQ7） |

**E 类 — IDE 是什么的 inline 解释（必保留，xiaolin 类非技术读者依赖）**

| # | 文字 | 来源 | 用途 |
|---|------|------|------|
| Inline-1 | 「IDE 是程序员写代码的专用编辑器，类似于设计师的 Photoshop」 | L17 | inline 小字解释，必保留 |
| Inline-2 | 「（那个黑底白字的命令行窗口）」 | L17 | "终端"的物理质感描述，必保留 |

**F 类 — 块尾镜像钩子（OQ5 升级）**

| # | 文字 | 来源 |
|---|------|------|
| Mirror-1 | 「'群雄并起'不只在公司之间发生——它已经发生在 Claude Code 内部。一个 CLI 工具里就有 **12 个内置 Subagent**。」 | Opus 拟稿（基于黄金资产 F2.1 / golden-assets-prologue-mining-2026-04-06.md:21 N5） |

**12 个内置 Subagent 必须能 grep 到，但不要展开 12 个 Subagent 的具体名字（那些是 Block 6 内容）**。

**G 类 — 标志性比喻（散落，可视化但不主菜）**

| # | 比喻 | 来源 | 用途 |
|---|------|------|------|
| M1 | "智能手机大战" | L15 | Q3 副标 |
| M2 | "Photoshop"（IDE 类比） | L17 | Inline-1 |
| M3 | "黑底白字的命令行窗口" | L17 | Inline-2 |

**H 类 — 套控通俗解释卡（OQ7 必出，Opus 写定文案）**

```
💡 通俗理解
"套控"就是给 AI 戴上"马具"——既要让它能拉车干活（工具能力），
又要套上缰绳保证它不会乱跑（安全边界）。
```

视觉处理建议：
- 浅色背景 surface-secondary
- 💡 emoji + 加粗"通俗理解"四字
- 字号 `--cc-font-size-base` ~ `lg`
- 紧邻 Q6「harness（套控层）的设计差异决定了产品表现的差异」之下

### 2.3 严禁出现的内容（13 类禁区）

| 禁区 | 归属块 |
|------|--------|
| 引擎盖 / 计算器 / "不是。差远了。" / 浮点精度 / 5 项 reveal | Block 1 |
| 9,000+ 星标 / claw-code / harness-books / ccunpacked / byterover / 6 开源项目 | Block 3 |
| 1,884 / 476,875 / 40 / 98 / 一个为 AI 智能体设计的操作系统 / 进程调度器六件套 / 7 AI 实例 / 185 Prompt | Block 4 |
| 这不是使用指南 / 这是工程解剖 / 我们不猜测 / 数十个步骤 / 三道关卡 / 九层配置 | Block 5 |
| OS 类比 / 内核 / 系统调用 / 文件系统 / 进程调度 | Block 4/6 |
| 43 工具 / 27 Hook 事件 / 配置地图 / MCP 详细介绍 | Block 6/7 |
| 三条阅读路径 / 工程师 / 创业者 / CS 学生（作为分流） | Block 8 |
| 5 比喻家族 / 源码入口路径 / 2.1.88 / 4,684 行 / 让我们开始 / Part 1 第一章 | Block 9 |
| 83 章 / 36 万字 / 122 图表 / 34 Harness 模块 / 246 Design Tokens | Block 5 / 附录 |
| OpenClaw / Manus | OQ3 删除 |
| `<details><summary>` 折叠表 | 拆块方案 L93 |
| 8000 字 Coordinator / 6500 字 Verification / "disprove it" 引语 | 黄金资产 G2/G3/Q8（OQ5/OQ6 不采纳） |
| IDE / 远程 / 终端 三维矩阵 | OQ4 弃方案 C |

## 3. 视觉语言

### 3.1 推荐视觉组件（≥4 类，但全部克制）

| 组件 | 用途 | 优先级 |
|---|---|---|
| **prologue-marginal-label** | 顶部"序章 · Block 02 · 反差引入" 小字 chip + hero footer 组件 | **P0 必出** |
| **block-title** | 块标题"群雄并起 · 2026 年 AI 编程助手版图" | **P0 必出** |
| **timeline-3-stages** | 三阶段水平时间轴（提示工程 2023-24 → 上下文工程 2025 → **套控工程 2026 active**），第三拍 brand 色高亮 | **P0 必出** |
| **competitor-grid-8** | 8 竞品紧凑型对照表 / 卡片网格，每个色码区分（pastel coding），可 hover 反转卡（OQ4 方案 A+B） | **P0 必出** |
| **trio-architecture** | Model + Runtime + Harness 三层水平/垂直堆叠示意，Harrison Chase 署名 | **P0 必出** |
| **harness-tooltip** | 💡 通俗理解 微卡片（OQ7 套控解释，必出） | **P0 必出** |
| **q4-contrast-strip** | "不做 IDE / 不做 Web / 而是终端" 三拍反差对比条 | P0 |
| **mirror-stinger** | F 类块尾镜像钩子「12 个内置 Subagent」（OQ5） | P0 |
| **q1-anchor-quote** | Q1 「本书解剖的 Claude Code，正是一个 harness 设计的完整案例」 | **P0 必出** |

### 3.2 节奏建议（必须严格按这个顺序铺陈）

1. **顶部 marginal label + hero footer**：「序章 · Block 02 · 反差引入」+ 块名 + sub-title「全书第 2 拍 · 宏观坐标系」
2. **过渡 ornament**：原文 L15 自带 `🌍 **行业背景**` marginal label，保留 emoji + 加粗作为过渡钩子
3. **块首时间锚 Q2**：「2026 年，AI 编程助手已完成从"帮你补全一行代码"向"自己动手完成整个任务"的根本转变。」+ Q3 副标「竞争激烈程度堪比智能手机大战。」
4. **L15 段落补全 + 过渡句**：原文 L15 散文 6 个竞品（GitHub Copilot / Cursor / Kimi Code / OpenAI CodeX / Devin / Google Antigravity），后接**过渡句**「**完整名单见下表**」（OQ1）
5. **8 竞品紧凑对照表 / 网格**（**必须 8 行全量铺陈，禁止折叠**）：
   - 每个竞品一个色码（pastel coding，方案 A）
   - 可 hover 反转卡（方案 B 融合）
   - **Claude Code 不在此 8 列中**——这 8 个是"邻居"，不是 Claude Code 自己
6. **Claude Code 的反差宣言（Q4）**：
   - 「在这个群雄并起的格局中，Claude Code 选择了一条独特的道路」
   - **q4-contrast-strip**：不做 IDE / 不做 Web / **而是终端**（三拍反差结构）
   - inline 解释「IDE 是程序员写代码的专用编辑器，类似于设计师的 Photoshop」（Inline-1，小字）
   - 「（那个黑底白字的命令行窗口）」（Inline-2，小字）
   - Q5「**唯一一个**可以在纯远程服务器上工作、可以完全通过键盘操作、可以与任何编辑器无缝集成的 AI 编程助手」
   - 代价段落：「代价是：它必须自己解决界面渲染、文件管理、进程隔离等一系列在 IDE 环境中本来'免费'的问题。」（**不要标注伏笔**，OQ8）
   - 段尾：「这本书要解剖的，正是这个雄心勃勃的工程选择背后的全部技术细节。」
7. **三阶段演进时间轴**：
   - **timeline-3-stages**：提示工程（2023-24） → 上下文工程（2025） → **套控工程（2026 active 高亮）**
   - 学术背书：「LangChain 创始人 Harrison Chase」
8. **三层架构示意 (trio-architecture)**：
   - Model + Runtime + Harness 三层堆叠
   - 副标"Harrison Chase 提出"
   - **不出现 OpenClaw / Manus**（OQ3 删除）
9. **学术命题 Q6 + 通俗解释卡（OQ7 必出）**：
   - Q6「**harness（套控层）的设计差异决定了产品表现的差异。**」
   - 紧邻 **harness-tooltip 💡 通俗理解卡**：「'套控'就是给 AI 戴上'马具'——既要让它能拉车干活（工具能力），又要套上缰绳保证它不会乱跑（安全边界）。」
10. **块尾定锚 Q1**：
    - 「**本书解剖的 Claude Code，正是一个 harness 设计的完整案例。**」
    - 字号 ≥ 3xl，独立成段
11. **块尾镜像钩子 (Mirror-1)（OQ5）**：
    - 「'群雄并起'不只在公司之间发生——它已经发生在 Claude Code 内部。一个 CLI 工具里就有 **12 个内置 Subagent**。」
    - 这是 Block 2 → Block 3 的过渡前最后一步

### 3.3 字体/留白/对比度建议

- 块标题：`var(--cc-font-size-4xl)` ~ `5xl`，bold（**比 Block 1 hero 小，呼吸位降一档**）
- Q2 块首时间锚：`var(--cc-font-size-2xl)` ~ `3xl`
- Q4 反差对比条：`var(--cc-font-size-xl)` ~ `2xl`，"不做 IDE / 不做 Web / 而是终端" 三拍可用 strikethrough + 主色对比
- Q6 学术命题：`var(--cc-font-size-2xl)`
- Q1 块尾定锚：`var(--cc-font-size-3xl)` ~ `4xl`，独立成段
- timeline-3-stages：第三拍字号比 1/2 拍略大 + brand 色高亮
- 8 竞品对照表：表头 `var(--cc-font-size-base)`，单元格 `var(--cc-font-size-sm)` ~ `base`
- harness-tooltip 💡 卡：`var(--cc-font-size-base)`，背景 surface-secondary
- 段落字号：`var(--cc-font-size-lg)`
- 段落最大宽度：`var(--cc-measure-prose)` 或 65-72ch
- block padding：`var(--cc-space-12)` 上下，`var(--cc-space-6)` 左右
- 整体留白：**比 Block 1 略小但显著大于 Block 4** ——呼吸位的"呼吸感"靠留白堆出来

## 4. 双源理解（本块 0 张图表）

**0 张 VIS-X-XXX 图表**——拆块方案 L84 明确"含图表：无（这部分原文本身没有图表预留，是纯文字密集段）"。

视觉冲击完全靠**两个非图表的视觉组件**：
- **三阶段时间轴**（structural visualization）
- **8 竞品对照表 / 卡片网格**（structural visualization）

**严禁**做成 VIS-X-XXX 图表容器（带 chart-title / chart-legend / chart-tooltip），它们是**排版组件**而非"图表"。

## 5. 评审 Checklist（评审 Sub-Agent 用，满分 75）

| # | 检查项 | 评分依据 | 分值 |
|---|---|---|---|
| 1 | 8 个竞品全量铺陈（不折叠），grep 8 个产品名 | 任 1 缺 = -3 分 | 5 |
| 2 | 8 个竞品的"产品/公司/特色"三栏内容逐字 | 任 1 漂移 = -3 分 | 5 |
| 3 | 三阶段年份严守原文：grep `2023-24` `2025` `2026` | 任 1 错 = 0 分 | 5 |
| 4 | 套控工程第三拍 active 高亮 | 缺 = -3 分 | 5 |
| 5 | Harrison Chase + LangChain 署名 | 缺 = -2 分 | 5 |
| 6 | Model + Runtime + Harness 三层架构示意 | 缺 = -3 分 | 5 |
| 7 | Q6「harness（套控层）的设计差异决定了产品表现的差异」逐字 | 缺 = 0 分 | 5 |
| 8 | 💡 通俗理解 卡片（OQ7）grep `马具` `缰绳` `工具能力` `安全边界` | 缺 = -3 分 | 5 |
| 9 | Q1「本书解剖的 Claude Code，正是一个 harness 设计的完整案例。」逐字 + 块尾位置 + 字号 ≥ 3xl | 缺 = 0 分 | 5 |
| 10 | Q2 块首时间锚 + Q3 副标"智能手机大战" 全在位 | 1 缺 = -2 分 | 5 |
| 11 | Q4 反差三拍"不做 IDE / 不做 Web / 而是终端" | 缺 = -3 分 | 5 |
| 12 | Q5 "唯一一个" 三独特属性 + 代价段落"界面渲染/文件管理/进程隔离" | 缺 = -2 分 | 5 |
| 13 | Inline-1 "Photoshop" + Inline-2 "黑底白字" 必保留 | 1 缺 = -2 分 | 5 |
| 14 | 块尾镜像钩子 "12 个内置 Subagent" 在位（OQ5）| 缺 = -3 分 | 5 |
| 15 | 严禁红线 grep 全 0：`OpenClaw` `Manus` `disprove` `8000 字` `6500 字` `IDE.*远程.*终端` 三维矩阵 / Block 1/3/4/5/6/9 任何禁区数字 / 白皮书元数据 | 任 1 命中 = -3 分 | 5 |

**满分 75 分**，**≥60 分**才允许进入下一阶段融合。

## 6. 输出契约

- 文件名：`v2-demos/block2/prologue-block2-<kimi|minimax>-<timestamp>.html`
- 同时输出：稳定别名 `prologue-block2-<kimi|minimax>-latest.html`
- 同时输出：`prologue-block2-<kimi|minimax>-report.md`（生成 sub-agent 的自评报告）
- 文件大小预算：40-80 KB（含 8 竞品表 + 时间轴 + 三层示意）
- 行数预算：600-1,200 行
- 所有数字 / 金句 / 8 竞品名 / 三阶段年份必须能 grep 到

## 7. 特殊提醒

- **本块灵魂 = 套控通俗解释卡（OQ7）**。如果不解释"套控"就是 xiaolin 评审的红线翻车——chinese 读者读到"套控"会一脸懵。
- **三阶段年份是数字纪律**。MiniMax demo 历史上抄错过年份（2022-2023/2023-2025），任何 sub-agent **不要参考 demo 的年份字段**，直接用本 Brief §2.2 B 类的原文年份。
- **Q1 块尾定锚 + 镜像钩子 Mirror-1 是 Block 2 → Block 3 的两步告别**。Q1 是"案例研究"宣言，Mirror-1 是"内部群雄并起"的钩子。两步要分开放，不要塞成一段。
- **竞品对照表 8 行是硬性**。L15 散文虽然只列 6 个，但 V2 不折叠，必须 8 行全量。过渡句"完整名单见下表"是关键的一句。
- **不要做"折叠"**：原文 `<details><summary>` 已废，V2 必须全量铺陈。但表格视觉上要"不挤"——pastel coding + hover 反转能避免拥挤。
- **学术风格 ≠ 论文风格**。Block 2 借鉴了"学术论文引言"的结构（背书 + 三阶段 + 框架 + 命题 + 案例宣言），但视觉上不要做成 Distill.pub 那种 serif 单栏教科书风（那是 Block 6 方案 C）。Block 2 仍然是 sans-serif + dark theme + 现代 UI 调性。
- **不要预支 Block 4 的"操作系统"金句**：哪怕只是隐晦提及"system" 也不行。
- **OQ5 的 12 数字只能是 12**：不是 11 不是 13 不是 14。这是金矿 N5 的精确数字（C 类内置 Agent 提示数）。

## 8. 与其他子 Agent 的协作约定

- 本 Brief 同时分发给 Kimi 主跑 + MiniMax 主跑（双跑模式）
- 两个 sub-agent **不得相互参照对方的产出**，独立设计
- 评审 sub-agent 用 §5 checklist 各打一份分
- 最终融合由 Opus 决定

---

*Brief by Opus on 2026-04-07 03:25 — 严格基于 Block 2 prep + Sonnet 抽取 8 OQ + Opus 决断 + 序章 L15-34 逐字，零虚构。Block 2 是冷静呼吸位，建立 2026 行业坐标系 + 抛出"套控工程"全书学术框架。*
