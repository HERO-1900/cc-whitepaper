# V2 序章 Block 3 · 泄露催化的生态爆发 · Brief

> 任务派发：双跑（Kimi 主跑 + MiniMax 主跑），独立产出后做交叉评审
> 块内职责：在读完"群雄并起 2026"宏观坐标系后，把读者注意力从"行业玩家有谁"切换到"为什么这个特定产品能引爆生态"。这是一个用社区数据替代作者陈述的"以数据自证"块。
> 工时预算：3h（无图表生产，纯视觉组件）
> Brief 撰写人：Opus
> 创建时间：2026-04-07 01:15
> 实例化模板：handoff/v2-prologue-brief-template-2026-04-06.md

---

## 0. 给生成 Sub-Agent 的硬约束（最优先读）

**MUST**:
- 输出唯一一份完整 HTML 文件（含 `<!DOCTYPE html>`、`<head>`、`<style>`、`<body>`），无外部依赖
- token 引用：仅使用 `var(--cc-*)`，不得在本块内重新定义任何 `--cc-*` 变量
- 字体：`var(--cc-font-sans)` 正文 + `var(--cc-font-mono)` 数字/代码，不得出现任何系统字体名（违反 SOP FM-12）
- 数字精度：本 Brief 第 2.2 节列出的所有"硬数字"必须**逐位精确**，严禁约等于（不得出现 `~|约|大约|approx` 字样，违反 SOP FM-09）
- 配色：dark 主题为基线，浅色由 `[data-theme="light"]` 覆盖，两套都要可用
- 不得调用任何 JavaScript 框架或 CDN，纯 CSS + 极少量必要 vanilla JS（仅主题切换）
- 引用来源完整保留：所有项目名、社区视角、@ 用户名都不可省略

**MUST NOT**:
- 严禁使用 `iframe`
- 严禁 `Math.random` / `while(...length<N)` 这类"凑数式数据补全"（违反 SOP FM-11）
- 严禁拿 LLM 自己虚构的项目数据；6 个开源项目的星标数必须与本 Brief 一致
- 严禁删减原文中的 9,000+ 星标这一总数事实
- 严禁出现"生成式占位文本"（lorem ipsum / `// TODO` / `// 此处应有...`）
- 严禁加人物头像、Logo 等需要外部资源的元素

---

## 1. 块在 11 块叙事弧中的位置

```
块1 → 块2 → [块3] → 块4 → 块5 → 块6 → 块7a → 块7b → 块7c → 块8 → 块9
hero  反差  生态   数字  使命  OS建立 安全  接口  内部  分流  收尾
```

- **本块**：第 3 拍
- **节奏角色**：把"行业宏观叙事"切换到"社区微观证据"，让读者从"分析师视角"瞬间进入"路人开发者视角"
- **上一块给我交接的"读者情绪"**：刚看完 2026 年行业坐标系（OpenAI/Anthropic/Cursor/Windsurf 等谁是谁），开始好奇"为什么 Claude Code 这一家会引爆讨论"
- **我要交给下一块的"读者情绪"**：被社区数据震撼（一周内 9000+ 星 / 6/10 趋势榜 / claw-code 2 小时 50K stars），自然想问"那这家产品的源码到底有多少？规模多大？"——这个钩子直接喂给块 4「数字震撼」

## 2. 内容承载

### 2.1 原文（来自 `book/part0_序章/00_序章.md` 第 36-55 行）

```markdown
### 泄露催化的生态爆发

源码泄露不仅引发了技术讨论，更催生了一场开源生态的集中爆发。泄露后一周内，GitHub Agent Skills 趋势榜前 10 中有 6 个是 CC 相关项目，累计获得 9,000+ 星标：

| 项目 | 星标 | 定位 |
|---|---|---|
| byterover-cli | 3,638 | Agent 记忆层 |
| open-agent-sdk-typescript | 1,822 | SDK 替代方案 |
| taches-cc-resources | 1,731 | 配置合集 |
| claude-reviews-claude | 988 | 自我审查工具 |
| how-claude-code-works | 808 | 机制剖析 |
| claude-code-from-scratch | 472 | 从零教学 |

加上 claw-code（121K+ stars，2 小时内 50K）和 open-agent-sdk 等项目，泄露事件催生了一个围绕 CC 架构的开源生态系统。社区衍生项目不仅限于代码工具——**ccunpacked.dev** 构建了一个英文可视化导览站，将 Agent Loop 的 11 步流程做成交互动画，成为非中文社区理解 CC 架构的首选入口；**harness-books**（1.1k stars）则从中文视角出发，尝试建立系统性的套控工程框架书，与本书形成互补。这些项目共同表明：一次源码泄露，意外地为整个行业提供了一份"AI Agent 架构参考实现"。

> 🌍 社区视角 | @idoubicc — "Claude Code家后院起火，我让CC把桌椅搬出来盖了新房，大家免费住。"

> 🌍 社区视角 | @IceBearMiner — "越花时间vibe coding，越觉得软件工程的重要性"
>
> 💡 **通俗理解**：Vibe coding 是指让 AI 根据"氛围感"直接生成代码，自己不太深入理解细节。这位开发者的感悟是：越是让 AI 写代码，越发现**人类的工程设计能力**才是决定最终产品质量的关键——AI 能写代码，但架构设计、安全边界、性能权衡这些"软件工程"的活，还得人来把关。
```

### 2.2 必保留事实清单（不得删，不得简化）

| # | 事实/数字 | 来源 | 强度 |
|---|---|---|---|
| 1 | 一周内 9,000+ 星标累计 | L38 | 硬数字 |
| 2 | GitHub Agent Skills 趋势榜前 10 中 6 个是 CC 相关 | L38 | 硬数字 |
| 3 | byterover-cli 3,638 ⭐ | L42 | 硬数字 |
| 4 | open-agent-sdk-typescript 1,822 ⭐ | L43 | 硬数字 |
| 5 | taches-cc-resources 1,731 ⭐ | L44 | 硬数字 |
| 6 | claude-reviews-claude 988 ⭐ | L45 | 硬数字 |
| 7 | how-claude-code-works 808 ⭐ | L46 | 硬数字 |
| 8 | claude-code-from-scratch 472 ⭐ | L47 | 硬数字 |
| 9 | claw-code 121K+ ⭐，2 小时内 50K | L49 | 硬数字 |
| 10 | harness-books 1.1k ⭐ | L49 | 硬数字 |
| 11 | "ccunpacked.dev" 项目名 + 11 步 Agent Loop 交互动画 + "首选入口"定位 | L49 | 硬事实 |
| 12 | "harness-books" 项目名 + 中文视角 + "系统性套控工程框架书"定位 | L49 | 硬事实 |
| 13 | @idoubicc 金句："Claude Code家后院起火，我让CC把桌椅搬出来盖了新房，大家免费住。" | L51 | 必保留 |
| 14 | @IceBearMiner 金句 + "Vibe coding"通俗理解 | L53-55 | 必保留 |

### 2.3 可灵活叙事的部分

- 6 个项目的展示顺序可以重排（例如按星标排序，或按"工具/教学/资源"分类）
- 可以增加微小过渡句但不能删原文事实
- 可以把"项目-星标-定位"三栏表格改成卡片网格 / 横向条形图 / 跑马灯，但必须保留三个字段

## 3. 视觉语言

### 3.1 推荐视觉组件（≥3 类）

| 组件 | 用途 | 优先级 |
|---|---|---|
| **stat-grid 大数字** | 9,000+ 总星标 + 6/10 趋势榜占比 + claw-code 121K + 2hrs 50K | P0 |
| **horizontal bar chart 或 card-grid** | 6 个项目的星标对比（CSS-only 横条柱即可）| P0 |
| **pull-quote** | @idoubicc 金句"后院起火盖新房" | P0 |
| **tip-block 💡 通俗理解** | Vibe coding 解释段（必须显式 💡 + "通俗理解"四字） | P0 |
| **highlight-card** | ccunpacked.dev + harness-books 双姊妹项目特写 | P1 |
| **timeline-mini** | "源码泄露 → 一周内 → 9000⭐"时间线（可选） | P2 |

### 3.2 节奏建议

- **块开头**：一行 stat-grid，把"9,000+ ⭐ / 6 of 10 / 121K"三个炸数字一次喂到读者眼里，用最大号字
- **块中段 1**：6 个项目的星标条形图或卡片网格（P0），数据冲击之后做"数据消化"
- **块中段 2**：ccunpacked.dev + harness-books 双姊妹项目 highlight-card（互文：英文站 vs 中文书 vs 本书）
- **块中段 3**：@idoubicc 金句单独成 pull-quote，破文字密度
- **块结尾**：@IceBearMiner 金句 + 💡 通俗理解 tip-block（带 💡 图标和"通俗理解"四字标签），把读者从"震撼"拉回"反思"，再喂给下一块"打开引擎盖看看里面"

### 3.3 字体/留白/对比度建议（仅 token 引用层面）

- H2「泄露催化的生态爆发」：`var(--cc-font-size-4xl)` 起跳，`var(--cc-font-weight-bold)`
- 数字（stat-grid 大字号）：`var(--cc-font-size-6xl)` 起跳，`var(--cc-font-mono)`，颜色 `var(--cc-color-brand)`
- 段落字号：`var(--cc-font-size-lg)`
- 段落行高：`var(--cc-leading-relaxed)`（1.7-1.8 区间）
- 段落最大宽度：`var(--cc-measure-prose)` 或 65-72ch
- pull-quote 字号：`var(--cc-font-size-2xl)`，`var(--cc-leading-snug)`
- 卡片网格 gap：`var(--cc-space-6)` 起步
- block padding：`var(--cc-space-12)` 上下，`var(--cc-space-6)` 左右

## 4. 双源理解（本块无图表）

本块原文只有 markdown 表格 + 引言 + 通俗理解段，**无任何 VIS-* 图表占位符**。
所有视觉表达由生成 Sub-Agent 用纯 CSS + HTML 完成，不调用任何 chart HTML。

## 5. 评审 Checklist（评审 Sub-Agent 用）

生成完成后，由另一个 Sub-Agent 用以下 checklist 打分（每项 1-5 分）：

| # | 检查项 | 评分依据 |
|---|---|---|
| 1 | 14 项必保留事实是否全部在位（grep `byterover-cli` `open-agent-sdk` 等 14 个关键词） | 1 漏 = -3 分 |
| 2 | 6 个项目的星标数是否逐位精确（grep `3,638` `1,822` 等） | 出现 1 个数字漂移 = 0 分 |
| 3 | 全文 grep `~|约|大约|approx` 必须为 0 | 命中 1 次 = 0 分（FM-09） |
| 4 | token 纪律：`var(--cc-*)` 出现次数 ≥80 | 不达标 = 减半 |
| 5 | 字体：仅用 `var(--cc-font-sans)` + `var(--cc-font-mono)` | 出现其他字体名 = 0 分（FM-12） |
| 6 | 视觉组件是否≥3 类 | <3 类 = 减半 |
| 7 | 💡 通俗理解块是否显式带 💡 emoji + "通俗理解"四字 | 缺失 = 0 分 |
| 8 | @idoubicc 金句、@IceBearMiner 金句、ccunpacked.dev、harness-books 4 个具名引用是否全在 | 1 漏 = -2 分 |
| 9 | 块开头是否有 stat-grid 大数字钩子 | 无 = 减半 |
| 10 | 块结尾是否有指向下一块"数字震撼"的钩子（任何形式的"那这家产品到底多大"暗示） | 主观打分 |
| 11 | 移动端 375px 截图无溢出 | playwright 验证 |
| 12 | dark + light 双主题切换无破图 | 视觉抽测 |

满分 60 分，**≥48 分**才允许进入下一阶段融合。

## 6. 输出契约

- 文件名：`v2-demos/prologue-block3-<kimi|minimax>-<timestamp>.html`
- 同时输出：稳定别名 `v2-demos/prologue-block3-<kimi|minimax>-latest.html`
- 同时输出：`v2-demos/prologue-block3-<kimi|minimax>-report.md`（生成 sub-agent 的自评报告）
- 文件大小预算：30-60 KB（HTML + inline CSS）
- 行数预算：500-900 行
- 所有数字必须能 grep 到（不得 SVG 嵌入数字图片化）

## 7. 特殊提醒

- **本块是 V2 序章试水块之一**（另一是块 9）。Opus 会拿两个 sub-agent（Kimi + MiniMax）的产出做交叉评审，再决定 meta-template 和评审 checklist 是否需要修订
- **本块是叙事弧的"情感切换点"**：从"宏观行业坐标系"切到"社区路人证据"，节奏感和情感切换比单块的视觉炫技更重要
- **6 个项目的呈现"既要差异化又要可比"**：星标差距很大（3638 vs 472），如果用横条柱要避免短条变成"看不见"——可以用对数刻度或"星标差距越大、卡片对比越鲜明"的设计
- **"通俗理解"块的格式不能 paraphrase**：必须显式带 💡 emoji + 加粗的"通俗理解"四字，这是项目级写作风格红线
- **claw-code 121K+ 这一行可以单独突出**：是"两小时内冲到 50K"这种事件级数据，建议用单独的 highlight-card 而不是混进 6 项目网格

## 8. 与其他子 Agent 的协作约定

- 本 Brief 同时分发给 Kimi 主跑 + MiniMax 主跑 sub-agent
- 两个 sub-agent **不得相互参照对方的产出**，独立设计
- 评审 sub-agent（第三个独立 sub-agent）拿到两个产出 + 本 Brief 后用 Section 5 的 checklist 各打一份分
- 最终融合由 Opus 决定（可能选其中一个、可能拼装两者）

请严格按上述 Brief 生成完整的、可直接打开的 HTML 文件。
直接输出 HTML 源代码（从 <!DOCTYPE html> 开始到 </html> 结束），
不要任何 markdown 围栏，不要任何前后说明文字，不要任何调用工具，
单次输出一个完整文件即可。
