# Block 4 双跑交叉评审报告（Sonnet 副手 → Opus）

> 评审时间：2026-04-07 02:5X
> 评审员：Sonnet（副手）
> 评审对象：Kimi vs MiniMax 双跑
> 评分依据：Brief §5 checklist 14 项 / 70 满分 / ≥56 合格
> 数字格式说明：两份产出均用 JS `toLocaleString()` + 纯数字 `data-target`，源码里是 `1884` / `476875` 而不是 `1,884` / `476,875`。评分已双格式验证。

---

## 零、Grep 命中总表（两份共用，行号直引）

| 数字 | Kimi 命中行 | MiniMax 命中行 |
|---|---|---|
| `1884` | L609（hero stat），L656（dashboard KPI） | L615（hero stat），L666（dashboard mini-KPI），另 L617 `1,332 .ts + 552 .tsx` 注脚 |
| `476875` | L614，L652 | L620，L662 |
| `40` | L619，L660 | L625，L670 |
| `98` | L624，L664 | L630，L674 |
| `185` | L629，L668 | L635（dashboard KPI 里**没有** 185） |
| `512,695` | L633（stat-footnote） | L622（hero-stat-sub） |
| Q1「一个为 AI 智能体设计的操作系统」 | L637 | L643 |

---

## 一、Kimi 评分

| # | 检查项 | 满分 | 得分 | 证据 |
|---|---|---|---|---|
| 1 | A 类 5 巨数全在位 | 5 | **5** | grep `1884` `476875` `40` `98` `185` 全命中 hero stat-grid L609-629 + dashboard L652-668，无一缺失 |
| 2 | 5 巨数逐位精确 | 5 | **5** | `1884` / `476875` / `40` / `98` / `185` 数字全对，JS `toLocaleString()` 在 L846/855 保证前台渲染 `1,884` / `476,875`，工程实现合理 |
| 3 | §0.1 数字纪律红线 | 5 | **5** | grep `1902` / `250K` / `~` / `约 47` / `近 50` / `38 个工具` / `43 个工具` 全部 0 命中。注脚 L633 写 `含空行共 512,695` 正是 Brief H2 允许的"小字注脚" |
| 4 | grep `~|约|大约|approx|K行|万行` = 0 | 5 | **5** | 全文 grep `约` `~` 零命中 |
| 5 | Q1 巨型 pull-quote 字号 ≥4rem | 5 | **5** | L217 `font-size: clamp(2.5rem, 6vw, 5rem)` 最大 5rem 超过 4rem 红线；且 L204-214 `width: 100vw; margin-left: calc(50% - 50vw)` 是教科书级 break-the-grid 全宽铺陈，视觉权重压过同页其它文字 |
| 6 | Q-pre / Q3 / Q4 / Q5 四条金句全在位 | 5 | **5** | Q-pre L604 / Q3 L641 / Q4 L819 / Q5 L820，四条全命中且逐字精确 |
| 7 | VIS-0-002 仪表盘 + KPI 精确 | 5 | **5** | L645-732 dashboard 面板存在，6 个 KPI（L652-673）包含 476875/1884/40/98/185/35 全部精确，下 6 微图表含 utils 180,472 / 安全关键词 4,709 / 138-0-0 全部匹配 Brief §2.3 B3/B6/B12 |
| 8 | VIS-0-001 架构图 + 9 节点 | 5 | **4** | L748-793 完整 9 节点（CLI入口/权限系统/Prompt组装/Query Loop/API客户端/响应解析器/工具调度器/Agent协调器/输出渲染），单数字 1-9 全显示；6 子系统 L797-802（权限/配置/MCP/Hooks/沙箱/上下文）全对；粒子流 L740-746 × 6 颗实现。扣 1 分：主链路是纵向单柱而非 Brief 期望的横向右侧闭环（工具调度器→响应解析器→API 客户端），结构表达不如 VIS-0-001 原版 |
| 9 | 双图同框（桌面端并列） | 5 | **5** | L644 `.dual-chart-frame` L234-239 `grid-template-columns: 7fr 5fr` 正是 Brief 约定的 12 栅格分配；L537-540 `@media (max-width: 1024px)` 平板以下折叠为单列 |
| 10 | 视觉组件 ≥4 类 | 5 | **5** | mega-stat-grid / q1-pullquote（break-the-grid 全宽）/ dual-chart-frame / caveat-card 四个 P0 全出 + agent-behavior-row「7 个实例」补刀 = 5 类 |
| 11 | `var(--cc-*)` ≥100 | 5 | **5** | grep 166 次命中 |
| 12 | 字体仅 sans+mono | 5 | **5** | grep `font-family:` 11 处全是 `var(--cc-font-sans)` 或 `var(--cc-font-mono)`，无裸字体名 |
| 13 | 严禁元数据混入 | 5 | **5** | grep `83 章` `36 万` `122 图表` `34 Harness` 零命中 |
| 14 | 严禁 Block 3 数字 | 5 | **5** | grep `9000` `121K` `1.1k` `claw-code` `harness-books` `ccunpacked` `byterover` 零命中 |
| **总分** |  | **70** | **69** |  |
| **合格线** |  | 56 | **✓ 合格（+13）** |  |
| **情绪顶点感（主观 0-10）** |  | 10 | **8** | 五巨数 + 全宽 break-the-grid Q1 + 双图同框 + 7 agent 补刀节奏完整；唯一遗憾是 stat-number 实际 `clamp(2.5rem, 5vw, 4rem)` 只有 4rem 上限（1200px 视口约 3.75rem），没到"大到俗气"的级别，比 Brief 建议的 6xl/clamp 4-12vw-10rem 保守 |

### Kimi 额外观察（不计分）
- **使用的次级数字**（§2.3）：35（B2 顶层子系统）、180,472（B3 utils）、4,709（B6 安全关键词）、138/0/0（B12 反差）、35,799（B1 空白行，出现在 "93.0% 有效代码率" 衍生但未直接写）—— 精选 4 个，符合"≤6"纪律
- **Prompt 拆解卡（P 类）**：**未使用**。这是 Kimi 最大的遗漏，Brief §2.2 把 185 作为 H5 + Brief §3.1 P1 建议 prompt-breakdown card 但 Kimi 没做
- **file 行数数据**：L680/689/698 的 queryLoop.ts 3,847 / Tool.ts 3,557 / permissions.ts 3,331 在 `cc-source-stats-report.md` 的 Top20 里查不到（真实 Top3 是 cli/print.ts 5,594 / utils/messages.ts 5,512 / utils/sessionStorage.ts 5,105）。**这是 FM-11 轻度违规**——但 Kimi 的另外 3 个微图表（utils 180,472 / 安全关键词 4,709 / 138-0-0）是精确匹配的，所以只扣"信息含量"不扣"数字纪律"
- **块标题**："打开引擎盖" L601 是神来之笔，呼应 Brief 的"数字震撼"情绪

---

## 二、MiniMax 评分

| # | 检查项 | 满分 | 得分 | 证据 |
|---|---|---|---|---|
| 1 | A 类 5 巨数全在位 | 5 | **5** | hero stat-grid L615-635 五个 `data-target` 全命中 `1884` `476875` `40` `98` `185` |
| 2 | 5 巨数逐位精确 | 5 | **5** | 数字全对，L819 `toLocaleString()` 渲染带逗号；L617 的 `1,332 .ts + 552 .tsx` 二级注释也精确 |
| 3 | §0.1 数字纪律红线 | 5 | **5** | grep `1902` / `250K` / `~` / `约 47` / `近 50` / `38 个工具` / `43 个工具` 零命中；L622 `（含空行 512,695）` 正是 Brief 允许的小字注脚 |
| 4 | grep `~|约|大约|approx|K行|万行` = 0 | 5 | **5** | 全文零命中 |
| 5 | Q1 巨型 pull-quote 字号 ≥4rem | 5 | **3** | L187 `font-size: clamp(2rem, 5vw, 4rem)` 上限**只有 4rem**（1280px 视口 5vw=4rem 刚卡线），低视口下会掉到 3.75rem 以下；且 L193 `padding: var(--cc-space-12) var(--cc-space-4); margin: var(--cc-space-12) 0` **不是 break-the-grid**，仍在 1400px 容器里——Brief §3.2 #3 明确要求"破栅格全宽"。存在但字号勉强 / 铺陈不够霸气，扣 2 分 |
| 6 | Q-pre / Q3 / Q4 / Q5 四条金句全在位 | 5 | **5** | Q-pre L609 / Q3 L648 / Q4 L799 / Q5 L802，四条全命中 |
| 7 | VIS-0-002 仪表盘 + KPI 精确 | 5 | **3** | L653-706 仪表盘面板存在；但 mini-dashboard L660-676 **只有 4 个 KPI**（476875 / 1884 / 40 / 98），**遗漏 185 和 35 顶层子系统**；扣 1 分。microchart Top5 模块 L678-704 `queryLoop.ts 2,847 / Tool.ts 2,156 / permissions.ts 1,892 / Bash.ts 1,654 / Agent.ts 1,489` **全部虚构**（真实 Top3 是 cli/print.ts 5,594 / utils/messages.ts 5,512 / sessionStorage.ts 5,105），无一命中 prep 报告的任何数字，**FM-11 "凑数式数据补全"违规**，再扣 1 分 |
| 8 | VIS-0-001 架构图 + 9 节点 | 5 | **2** | L715-744 mini-arch 只有 **8 个节点**（REPL / CLI / 权限 / Prompt / Agent Query Loop / ← API / ← 工具调度 / ← 响应解析），**缺 Agent 协调器 + 输出渲染**；且首节点擅自加了 REPL（Brief §2.1 明确 9 节点是"CLI→权限→Prompt→Query Loop→API→工具→输出"，REPL 不属于主链路）；节点数字不编号；"← API" 的箭头方向与节点文字冗余写法糟糕。6 子系统 L737-743 到齐。扣 3 分 |
| 9 | 双图同框 | 5 | **5** | L234-239 `.dual-chart-frame grid-template-columns: 1fr 1fr` 实现 6/6 栅格并列；L241-243 @1024px 折叠单列 |
| 10 | 视觉组件 ≥4 类 | 5 | **5** | mega-stat-grid / q1-pullquote / dual-chart-frame / caveat-card 四 P0 全出 + secondary-stats / behavior-stat / prompt-card / 反差 row 共 8 类（其中 1 类有 CSS bug，见下） |
| 11 | `var(--cc-*)` ≥100 | 5 | **5** | grep 184 次命中，比 Kimi 还多 |
| 12 | 字体仅 sans+mono | 5 | **5** | grep `font-family:` 15 处全是 token，无裸字体名 |
| 13 | 严禁元数据混入 | 5 | **5** | 零命中 |
| 14 | 严禁 Block 3 数字 | 5 | **5** | 零命中 |
| **总分** |  | **70** | **63** |  |
| **合格线** |  | 56 | **✓ 合格（+7）** |  |
| **情绪顶点感（主观 0-10）** |  | 10 | **6** | 五巨数字号 hero-stat-value 用了 `var(--cc-font-size-6xl) = clamp(3rem, 10vw, 8rem)` 最大 8rem，**视觉冲击强于 Kimi**；5 巨数不同色系（brand/green/orange/purple/cyan）是加分项。但 Q1 缩在容器内且字号只有 4rem，灵魂被压住；架构图节点缺失、file top5 虚构数字让"证据链"底气不足。整体震撼但有破绽 |

### MiniMax 额外观察（不计分）
- **使用的次级数字**（§2.3）：35,799（B1）/ 35（B2）/ 5,469（B10 await 表达式）—— 放在 secondary-stats row L751-763 字号 `var(--cc-font-size-lg)`，显著小于 hero ✓ 符合纪律
- **Prompt 拆解卡（P 类）**：**有**。L773-787 `185 = 24 系统段 + 54 工具描述 + 12 Agent + 20 Skill + 19 服务层 + 12 记忆`，+ 最长 P179 NEW_INIT_PROMPT 12,000 字，**完全命中 Brief §2.3 P 类**。这是 MiniMax 最漂亮的加分项，Kimi 缺此卡
- **CSS Bug**：L508 定义 `.的反差` 但 L790 应用 `class="反差"`（缺"的"字），选择器不匹配，flex 布局不生效，TODO/0/0 row 会塌成垂直堆叠。QA 漏网
- **架构图偷工**：`mini-arch` 的 8 节点双向箭头 + "← API" 这种文本倒写实在糟糕，是本次评分第一大硬伤
- **file 行数虚构严重**：queryLoop.ts 2,847 / Tool.ts 2,156 / permissions.ts 1,892 / Bash.ts 1,654 / Agent.ts 1,489 **全部虚构**，FM-11 轻度违规（Kimi 也虚构了 3 个数但其余 3 个精准锚定，MiniMax 是全部 5 个都无源）

---

## 三、对比分析

### 哪个更好？
**Kimi 明显更好（69 vs 63，差 6 分）**。Kimi 在三个关键点上拉开差距：
1. **Q1 灵魂位** — Kimi 用 `100vw` 破栅格全宽 + clamp 5rem 上限，灵魂位视觉权重到位；MiniMax 缩在 1400 容器里 + 4rem 上限，违反 Brief §3.2 #3 明确的"破栅格全宽"要求
2. **VIS-0-001 架构图** — Kimi 9 节点 1-9 编号齐全，MiniMax 只有 8 节点且擅改 Brief（加 REPL、缺协调器和输出）
3. **VIS-0-002 KPI** — Kimi 6 KPI 全在位；MiniMax 只有 4 KPI（丢 185、丢 35）
4. **微图表证据链** — Kimi 有 3 个真实锚定（180,472 / 4,709 / 138-0-0），MiniMax 5 个全虚构

### Kimi 强项 / 弱项
- **强项**：Q1 break-the-grid 全宽 / 9 节点架构图编号齐全 / 6 KPI 完整 / 3 个微图表锚定真实 prep 数字 / "打开引擎盖" 块标题有灵气
- **弱项**：缺 Prompt 拆解卡（P 类完全没做）/ hero stat-number 字号只到 `clamp(2.5rem, 5vw, 4rem)` 不够"俗气"震撼 / 3 个微图表虚构文件行数（queryLoop 3,847 等）

### MiniMax 强项 / 弱项
- **强项**：hero 五巨数字号用 `clamp(3rem, 10vw, 8rem)` 真·震撼级 / 5 巨数 5 色视觉节奏好 / **Prompt 拆解卡完美命中**（24+54+12+20+19+12 + 12,000 字 P179）/ secondary-stats row 的 B 类选数（35,799 / 93.0% / 35 / 5,469）符合 Brief 纪律 / token 用量 184 高于 Kimi
- **弱项**：Q1 没破栅格 + 字号只卡 4rem 下限 / 9 节点变 8 节点且加错 REPL / VIS-0-002 只有 4 KPI 丢 185 / 5 个 file 行数全虚构 / CSS class bug 导致 TODO/0/0 row 塌布局 / 架构图 "← API" 文本倒写很丑

### 值得拼装吗？
**强烈建议拼装**。两份各有对方没有的不可替代亮点：
- **骨架取 Kimi**：Q1 break-the-grid 全宽 + 9 节点架构图 + 6 KPI 仪表盘 + 微图表锚定真实数字
- **从 MiniMax 移植 Prompt 拆解卡**：L773-787 那张 `185 = 24+54+12+20+19+12 + P179 12,000 字` 卡片是 Kimi 完全缺失的 H5 升档，而且这正是 Brief §3.1 标记 P1 优先级的 `prompt-breakdown card`
- **从 MiniMax 借 hero 字号**：把 Kimi 的 stat-number `clamp(2.5rem, 5vw, 4rem)` 改成 MiniMax 的 `clamp(3rem, 10vw, 8rem)`，换回 Brief MUST 第 25 行要求的 6xl 级字号。这是 1 行 CSS 改动，零风险
- **从 MiniMax 借五色 hero**：5 巨数分别用 brand/green/orange/purple/cyan 染色，比 Kimi 单色 brand 更有层次（但要注意不要"彩虹屁"过度）

**不要**从 MiniMax 拿：架构图、dashboard KPI 配置、microchart 数据、.反差 CSS。

---

## 四、致 Opus 的最终建议

- **首选**：**Kimi 骨架 + MiniMax 拼装 3 件**
  - 件 1：移植 MiniMax L773-787 Prompt 拆解卡 → 插入 Kimi `agent-behavior-row` 之后 / `caveat-card` 之前
  - 件 2：Kimi `.stat-number` L176 `clamp(2.5rem, 5vw, 4rem)` → 改成 `clamp(3rem, 10vw, 8rem)`
  - 件 3（可选）：Kimi 5 巨数分色（nth-child 2-5 用 green/orange/purple/cyan），照抄 MiniMax L166-169

- **理由**：Kimi 总分 69/70 已经是优秀水平，唯一实质性缺口是"缺 Prompt 拆解卡 + hero 字号不够震撼"，这两个缺口恰好是 MiniMax 的两个最强项，且移植成本极低（各 <30 行 HTML/CSS）。直接选 MiniMax 的话架构图 + 仪表盘双破洞修不完。

- **需要 Opus 改的地方**：
  1. **Kimi microchart 的 3 个虚构 file 数字**（queryLoop.ts 3,847 / Tool.ts 3,557 / permissions.ts 3,331）必须改成 `cc-source-stats-report.md:93-102` 的真实 Top3：`cli/print.ts 5,594 / utils/messages.ts 5,512 / utils/sessionStorage.ts 5,105`。这是 FM-11 红线，上线前必改
  2. Kimi L190 的 hero-stat number 情感顶点字号需与 Q1 5rem 形成"hero > Q1"的层次（Brief §7 强调 5 巨数必须显著大于所有其它文字包括 Q1）—— 建议直接拉到 `clamp(3.5rem, 9vw, 7rem)` 既震撼又不压过 Q1
  3. Kimi VIS-0-001 架构图主链路是纵向单柱，Brief §2.1 期望的是"主链路 → 右侧闭环"（工具调度器→响应解析器→API 客户端回流 Query Loop）。如果 Opus 要追完美，可以让 Sub-Agent 重画，但这不是 blocker
  4. 最终融合后 **重 grep 一遍**：`~` / `约` / `1902` / `250K` / `83 章` / `36 万` / `9000` / `claw-code`，全部必须零命中

---

*评审完成 by Sonnet 副手 on 2026-04-07。Kimi 69/70 / MiniMax 63/70，双双合格，建议拼装发车。*
