# Block 6「OS 建立认知」双跑交叉评审报告

> 评审人：Sonnet 副手
> 评审时间：2026-04-07
> 评审对象：
> - `v2-demos/block6/prologue-block6-final.html`（= Kimi clean，863 行 / ~32 KB，**当前 final**）
> - `v2-demos/block6/prologue-block6-minimax-clean.html`（416 行 / ~26 KB，FM-06 晚到救援）
> 评审依据：`handoff/v2-prologue-brief-block6-OS建立.md` §5（15 项 × 5 = 75 满分 / ≥60 合格）
> 背景：Block 6 首跑 MiniMax FM-06 挂死只跑了 Kimi，本次 MiniMax 晚到补出 HTML，正式 cross-review

---

## 0. 零信任 grep 复核（先查死线）

| grep 项 | Kimi (final) | MiniMax (晚到) |
|---|---|---|
| `40 个 AI 工具` / `40 个工具` / `38 个内置工具` / `38 个工具` | 0 | 0 |
| `1,884` / `1884` / `476,875` / `476875` / `一个为 AI 智能体设计的操作系统` | 0 | 0 |
| `83 章` / `360,583` / `122 图` / `185` / `这不是使用指南` / `这是工程解剖` / `我们不猜测` | 0 | 0 |
| `7 任务类型` / `27 Hook` / `6 权限模式` / `8 MCP 传输` / `9 配置层` / `5 扩展机制` | 0 | 0 |
| `进程调度器 ↔` / `文件系统 ↔` / `安全模型 ↔` / `设备驱动 ↔` / `Shell ↔` / `MCP 服务器` / `Scratchpad` / `main.tsx` / `Hooks 系统` | 0 | 0 |
| `外卖.*骑手` / `小区门禁` / `USB 转接口` / `穿衣层次` / `早上起床` / `快递柜.*短信` | 0 | 0 |
| `iframe` / `Math.random` / `cdn.` / `unpkg` / `jsdelivr` | 0 | 0 |
| `var(--cc-` 出现次数 | **179** | **106** |

**两份七条红线 grep 均 0**，OQ1/OQ2/OQ3 数字纪律 + 10 行禁区 + 6 段通俗禁区 + JS 框架禁区全部合格。token 引用都 ≥80。

---

## 1. Kimi (final) 版 15 项逐项打分

| # | 检查项 | 分 | 证据 |
|---|---|---|---|
| 1 | Q1「这不是为了修辞好看……*真的*像一个操作系统」逐字 + 大字号 | **5** | L614-616 `.q1-rejection-rhetoric` font-size 3xl + `<em>真的</em>` 斜体 + accent 色加重 |
| 2 | 三件事对照面板（OS 3 件 ↔ CC 3 件，左右双列） | **5** | L624-656 `.three-things-panel grid-template-columns:1fr auto 1fr` 真左右双列 + 中间 → arrow + 6 条 thing-item 全齐（管理硬件资源 / 调度应用程序 / 执行安全策略 / 管理 token 预算和 API 配额 / 调度 AI 智能体实例 / 执行权限规则和沙箱限制） |
| 3 | 内核 (Kernel) ↔ QueryEngine mapping row | **5** | L688-700 mapping-row 三列：内核 (Kernel) / QueryEngine + queryLoop / 类比理由逐字 |
| 4 | 系统调用 (Syscall) ↔ 工具调用 mapping row | **5** | L714-726 mapping-row 三列：系统调用 (Syscall) / 工具调用 (Tool invocation) / 类比理由逐字 |
| 5 | 💡 通俗理解 1：快递分拣流水线 | **5** | L703-711 `.insight-block` 含 💡 + 通俗理解 + 收件 + 分拣 + 装车 + 送达 + 签收 + 等下一单逐字 |
| 6 | 💡 通俗理解 2：员工的工作技能证书 / 持证上岗 | **5** | L729-737 `.insight-block` 含 💡 + 工作技能证书 + 读文件证书 + 写代码证书 + 搜索证书 + "持证上岗"逐字 |
| 7 | 📚 课程关联块完整：操作系统 + 软件工程 + 逆向工程 + 架构分析 | **5** | L664-672 `.course-callout` 📚 emoji + 课程关联 label + L97 整段逐字 + 进程调度/内存管理/安全模型/文件系统全 strong + Operating Systems / Software Engineering / Reverse Engineering / Architecture Analysis 4 关键词全在 |
| 8 | 0.3-A 43 工具目录图嵌入（VIS-0-010） | **2** | L746-831 `.vis-embed` 容器在位 + 标题"43 个内置工具完整目录" + 副标"按 6 个类别分组" + 6 个 category-btn (File 12 / Search 6 / Execute 4 / Agent 3 / Web 2 / Other 16) 在位。**致命缺陷**：实际 `tool-grid` 只有 **8 张 tool-card**（Read / Edit / Write / Glob / Grep / Bash / Agent / WebFetch），与"43 个内置工具完整目录"标题严重矛盾。Brief F 类硬约束「43 工具穷举（不抽样）」被 Kimi 公然违反，按"穷举不抽样"红线降 3 分 |
| 9 | 块尾 Block 7a 过渡句（OQ5） | **5** | L834-842 `.block-7a-bridge` 含 "OS 类比表已经把概念坐标系建立起来" + "我们从最关键的'安全'开始" + "安全才是 AI 智能体的第一道门——而它本身就是一个矩阵" 两句逐字 |
| 10 | OQ3 严格 2 行 OS 表（不出现进程调度器/文件系统/安全模型等其它 10 行） | **5** | grep 全 0，mapping table 严格 2 行（仅 Kernel + Syscall） |
| 11 | 6 段后续通俗理解禁区 grep 全 0 | **5** | grep 全 0 |
| 12 | OQ2 工具数仅用 43，禁用 40 / 38 | **5** | grep 全 0；43 出现于 L749、L755 两处（标题数字 + Total count pill） |
| 13 | 严禁混入 Block 4 hero（1,884 / 476,875 / 一个为 AI 智能体设计的操作系统）| **5** | grep 全 0 |
| 14 | 严禁混入 Block 5 元数据（83 章 / 360,583 / 122 / 185 / 这不是使用指南 / 这是工程解剖）| **5** | grep 全 0 |
| 15 | token 纪律：var(--cc-*) ≥ 80 / 字体仅 sans+mono | **5** | var(--cc-* 出现 179 次 + L23-24 仅 sans + mono 两类字体 token |

**Kimi 总分：67 / 75**（合格 ≥60） ✅

---

## 2. MiniMax (晚到救援) 版 15 项逐项打分

| # | 检查项 | 分 | 证据 |
|---|---|---|---|
| 1 | Q1「这不是为了修辞好看……*真的*像一个操作系统」逐字 + 大字号 | **5** | L292-294 `.q1-pullquote` font-size 3xl + `<span class="emphasis">真的</span>` 斜体 + accent-hover 色加重 |
| 2 | 三件事对照面板（OS 3 件 ↔ CC 3 件，左右双列） | **3** | L296-309 `.three-things-panel grid-template-columns:1fr 1fr` 真左右双列 + 6 条 three-things-item 逐字。**但完全删除了 L95 引导句「当你的电脑开机时，操作系统做三件事……」**，也**完全删除了 Q3 收尾「'硬件资源'变成了 token 预算……」**。Brief D 类 Q3 是必出金句，缺失 -2 分 |
| 3 | 内核 (Kernel) ↔ QueryEngine mapping row | **5** | L331-335 table tr：内核 (Kernel) / QueryEngine + queryLoop / 类比理由逐字 |
| 4 | 系统调用 (Syscall) ↔ 工具调用 mapping row | **5** | L336-340 table tr：系统调用 (Syscall) / 工具调用 (Tool invocation) / 类比理由逐字 |
| 5 | 💡 通俗理解 1：快递分拣流水线 | **5** | L344-350 `.insight-block` 含 💡 + 通俗理解 + 收件 + 分拣 + 装车 + 送达 + 签收 + 等下一单逐字 |
| 6 | 💡 通俗理解 2：员工的工作技能证书 / 持证上岗 | **5** | L352-358 `.insight-block` 含 💡 + 工作技能证书 + 读文件证书 + 写代码证书 + 搜索证书 + "持证上岗"逐字 |
| 7 | 📚 课程关联块完整 | **5** | L311-317 `.course-callout` 📚 emoji + 课程关联 header + L97 整段逐字（进程调度 / 内存管理 / 安全模型 / 文件系统 / Operating Systems / Software Engineering / Reverse Engineering / Architecture Analysis 全在）。注：4 关键词未加 strong 标签，仅 OS / SE 两个加粗，视觉权重略低于 Kimi |
| 8 | 0.3-A 43 工具目录图嵌入（VIS-0-010） | **4** | L363-369 `.vis-container` 标题 "43 个内置工具完整目录" + VIS-0-010 / 0.3-A badge。**真正穷举 43 工具**：L384 toolsData JSON 含 6 类 (File / Search / Code Execution / Agent / Web / Other) **共 49 个 name 字段（6 类目 + 43 工具）**，并通过 L386-414 `renderTools()` 在 DOMContentLoaded 时渲染到 `#vis-0-010-content`。**符合 Brief F 类「43 工具穷举不抽样」**。但有两个瑕疵：(a) **Grep 和 Glob 在 File 与 Search 两类中各出现 2 次**（重复计数），实际唯一工具名 41 个，"43" 是名义槽位非真实工具数；(b) Other 类塞了 InvokeMCP / McpToolCall 两个语义重复条目 + EnterWorktree / ExitWorktree 等 Skill 子操作，部分非 CC 真实内置工具。降 1 分 |
| 9 | 块尾 Block 7a 过渡句（OQ5） | **5** | L371-375 `.block-transition` 含 "OS 类比表已经把概念坐标系建立起来" + "我们从最关键的'安全'开始" + "安全才是 AI 智能体的第一道门——而它本身就是一个矩阵" 三句完整 |
| 10 | OQ3 严格 2 行 OS 表 | **5** | grep 全 0，table 严格 2 行 |
| 11 | 6 段后续通俗理解禁区 grep 全 0 | **5** | grep 全 0 |
| 12 | OQ2 工具数仅用 43，禁用 40 / 38 | **5** | grep 全 0；43 仅出现于 L365 标题 |
| 13 | 严禁混入 Block 4 hero | **5** | grep 全 0 |
| 14 | 严禁混入 Block 5 元数据 | **5** | grep 全 0 |
| 15 | token 纪律：var(--cc-*) ≥ 80 / 字体仅 sans+mono | **5** | var(--cc-* 出现 106 次 + L22-23 仅 sans + mono 两类字体 token |

**MiniMax 总分：67 / 75**（合格 ≥60） ✅

---

## 3. OQ 守纪汇总（OQ1-OQ7）

| OQ | 议题 | Kimi | MiniMax |
|---|---|---|---|
| **OQ1** | 0.3-A 在 Block 6 | ✅ vis-embed 在位 | ✅ vis-container 在位 |
| **OQ2** | 守 43 / 禁 40 / 禁 38 | ✅ 仅 43 | ✅ 仅 43 |
| **OQ3** | 严格 2 行 mapping | ✅ 2 行 | ✅ 2 行 |
| **OQ4** | 三件事面板 + 2 行 mapping + 0.3-A | ⚠ 三段式齐全，但 0.3-A 抽样违纪 | ⚠ 0.3-A 数据齐全，但三件事面板缺 L95 引导句 + Q3 |
| **OQ5** | 块尾 7a 预热 | ✅ 两句完整 | ✅ 三句完整 |
| **OQ6** | 📚 课程关联块 | ✅ 完整 + 4 关键词加粗 | ✅ 完整（4 关键词未加粗） |
| **OQ7** | 双跑 | ✅ 已双跑（FM-06 晚到补齐） | ✅ 已双跑 |

---

## 4. 对比与选型

### 4.1 两份并列对比

| 维度 | Kimi (final) | MiniMax (晚到) |
|---|---|---|
| 总分 | **67 / 75** | **67 / 75** |
| 合格 | ✅ | ✅ |
| 数字纪律 grep | 全 0 | 全 0 |
| 文件大小 / 行数 | 32 KB / 863 行 | 26 KB / 416 行 |
| Q1 反修辞宣言 | em 标签 + accent 色 | span.emphasis + accent-hover 色 |
| 三件事面板（左右双列） | ✅ 三列 grid（左 + arrow + 右）+ 描述子句（CPU 时间片、子 Agent 创建等）+ L95 完整引导句 + Q3 收尾 | ⚠ 双列但仅光秃秃 6 bullet，**无 L95 引导句、无 Q3 收尾**（严重内容缺口） |
| 2 行 mapping table | div grid 三列 | 真 `<table>` |
| 💡 通俗理解 ×2 | 完整 | 完整 |
| 📚 课程关联块 | ✅ 4 关键词全 strong | ✅ 4 关键词未 strong |
| 0.3-A 43 工具图 | ❌ **仅 8 卡抽样**（红线违纪） | ✅ JS 渲染 43 槽位（含 2 个重复 + 部分非真实工具） |
| Block 7a 预热 | 2 句（Brief 字面） | 3 句拆分（最后一句独立段） |
| 动效 / JS | 纯 CSS 静态 | DOMContentLoaded 渲染 + nothing else |
| Brief 引导句完整度 | ✅ L95 + Q3 全在 | ❌ 完全删除 |

### 4.2 推荐裁决：**拼装融合**（以 Kimi 为骨架 + 移植 MiniMax 43 工具数据）

两份总分恰好同分，但失分点完全互补：

- **Kimi 是更好的"块叙事骨架"**：
  1. 完整保留 Brief D 类 Q3 金句 + L95 引导句，三件事面板有"为什么"而非裸 bullet
  2. 三件事面板带描述子句（CPU 时间片 / 子 Agent 创建 / 文件系统沙箱）让左右列对照感更强
  3. 4 个课程关联关键词全 strong，视觉权重更符合 Brief E 类教学边栏意图
  4. 块尾 bridge 居中卡片视觉收束更稳

- **MiniMax 唯一压倒 Kimi 的点：43 工具图穷举**：
  1. Kimi 0.3-A 只画了 8 卡抽样，公然违反 Brief F 类「43 工具穷举（不抽样）」红线
  2. MiniMax 的 toolsData JSON + renderTools() 是完整 43 槽位渲染，符合穷举要求
  3. 但 MiniMax 数据有质量瑕疵（Grep / Glob 重复 + Other 类工具掺水）

### 4.3 是否应该升格 MiniMax 替换 Kimi？

**否，但必须从 MiniMax 移植 43 工具数据补齐 Kimi 的抽样违纪。**

- **不能整体替换**：MiniMax 三件事面板缺 L95 + Q3 是 D 类金句缺口（D 类是 Brief 必出 quote），整体替换会造成 Block 6 灵魂失血
- **必须移植 43 数据**：Kimi 8 卡抽样是 F 类红线违纪，留着会让 0.3-A 图表名实严重不符（标题写 43、副标写"6 个类别"、count pill 写 43，实际只有 8 张卡）
- **建议方案**：
  1. 以 Kimi `prologue-block6-final.html` 为骨架不动
  2. 把 MiniMax L383-414 的 toolsData + renderTools() 注入 Kimi 的 `.tool-grid` 容器
  3. **修复 MiniMax 数据**：去重 Grep / Glob（Search 类只保留 CodeSearch / SymbolSearch / WebSearch / ListMcpResources 4 个）+ Other 类去掉非真实内置的 EnterWorktree / ExitWorktree / InvokeMCP / McpToolCall
  4. 修复后让 6 类工具数与 Kimi 现有的 category-btn 12/6/4/3/2/16 对齐，count pill 数值要数据驱动，而不是 hardcode
  5. 需要 Opus 拍板：Kimi 现在的 6 分类 count (12+6+4+3+2+16 = 43) 是 Brief vis-soul 的"约"数，Opus 需要给一份权威工具清单（Source of Truth）让融合版穷举

---

## 5. 隐患清单（融合时必须处理）

1. **Kimi 0.3-A 抽样违纪**（最严重）：8 卡 vs 43 标题，必须补齐到 43 真实卡，不补会让 Block 6 唯一图表沦为"标题党"
2. **MiniMax 三件事面板内容失血**：缺 L95 引导句 + Q3 收尾，整体替换会丢 D 类必出金句
3. **MiniMax 工具数据有质量问题**：Grep / Glob 跨类重复 + Other 类塞了 4 个非真实内置工具，需要清洗
4. **Kimi count pill 是 hardcode**（File 12 / Search 6 / Execute 4 / Agent 3 / Web 2 / Other 16），无 Source of Truth 背书。Opus 应在融合前给一份权威 43 工具清单 + 6 分类映射，避免融合版又是"凑数"
5. **MiniMax `<script>` 包含 JS**：Brief MUST NOT 写的是"不调用任何 JavaScript 框架或 CDN"，**不是禁所有 JS**。MiniMax 用的是 vanilla DOM 操作 + 无外部依赖，技术上合规，但若 Opus 担心"无 JS 也能阅读"原则，可选择把 toolsData 在融合时直接静态展开为 43 个 `<div class="tool-card">`，避免 JS 依赖
6. **MiniMax 课程关联 4 关键词未加粗**：融合采用 Kimi 骨架天然解决
7. **两份块尾过渡句字面差异**：Kimi 用 2 段（Brief OQ5 字面 2 句），MiniMax 拆成 3 段（多了一句独立 highlight）。融合按 Kimi 的 2 段更贴 Brief 字面

---

## 6. 一句话总结

**两份同分 67/75，但失分点完全互补：Kimi 叙事骨架完整（三件事面板带 L95 + Q3 + 4 关键词加粗）但 0.3-A 公然抽样违纪（8 卡 vs 43 标题）；MiniMax 唯一做对了 43 工具穷举（虽有数据瑕疵）但删光了 L95 引导句和 Q3 收尾金句。** 推荐**保持 Kimi 为 final 骨架不替换**，从 MiniMax 移植 43 工具数据并清洗去重，作为 0.3-A 图表的真实穷举来源。

---

## 7. 简短报告（≤200 字）

- **(a) Kimi 总分**：67 / 75 ✅（合格 ≥60）
- **(b) MiniMax 总分**：67 / 75 ✅（合格 ≥60）
- **(c) 是否替换 Kimi**：**否**。保持 Kimi 为 final 骨架，仅从 MiniMax 移植并清洗 43 工具数据补齐 Kimi 的 0.3-A 抽样违纪
- **(d) 隐患**：
  1. Kimi 0.3-A 只画 8 卡 vs 标题"43 个内置工具完整目录"，违反 Brief F 类「穷举不抽样」红线，必须补
  2. MiniMax 三件事面板删除了 L95 引导句 + D 类 Q3 必出金句，不能整体替换
  3. MiniMax 43 工具数据有重复（Grep / Glob 跨类）+ Other 类掺水（EnterWorktree / InvokeMCP 等非真实内置），融合前需要 Opus 给权威 43 清单
  4. Kimi count pill (12/6/4/3/2/16) 是 hardcode 凑数，缺 Source of Truth 背书
  5. OQ1-OQ7 守纪、6 段通俗禁区、10 行 OS 表禁区、Block 4/5/7 元数据隔离 grep 全 0，纪律层无隐患
