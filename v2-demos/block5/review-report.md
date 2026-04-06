# Block 5「使命陈述」双跑交叉评审报告

> 评审人：Sonnet 副手
> 评审时间：2026-04-07
> 评审对象：
> - `v2-demos/block5/prologue-block5-kimi-clean.html`（35 KB，917 行）
> - `v2-demos/block5/prologue-block5-minimax-clean.html`（27 KB，809 行）
> 评审依据：`handoff/v2-prologue-brief-block5-使命陈述.md` §5（14 项 × 5 = 70 满分 / ≥56 合格）

---

## 0. 零信任 grep 复核（先查死线）

| grep 项 | Kimi | MiniMax |
|---|---|---|
| `1,884` / `1884` / `476,875` / `476875` | 0 | 0 |
| `40 个 AI 工具` / `98 个斜杠` | 0 | 0 |
| `9,000` / `121K` / `1.1k` / `claw-code` / `harness-books` / `ccunpacked` / `byterover` | 0 | 0 |
| `74 章` / `351,121` / `近 30 万` / `35 万字` / `9 层技术栈` | 0 | 0 |
| `内核` / `系统调用` / `进程调度`（OS 展开） | 0 | 0 |

**双方六条红线 grep 均 0**，数字纪律合格。

---

## 1. Kimi 版 14 项逐项打分

| # | 检查项 | 分 | 证据 |
|---|---|---|---|
| 1 | 方法论 badge 三件套（2.1.88 / 2026 年 4 月 / 逆向解剖） | **5** | L625-629 `.methodology-badges` 三 chip 横排齐全 |
| 2 | Q1 pull-quote「我们不猜测，不臆断」 | **5** | L632 `.pull-quote` 原文逐字 |
| 3 | 5 条 bullet 全在位且视觉化 | **5** | L640-683 `.bullet-grid` 5 张 `.bullet-item` 卡，每张含圆角数字徽章 + 图标 + 粗体数字，非纯 ul |
| 4 | Bul-4 💡 通俗理解卡（Token / 货币 / 汇率） | **5** | L667-673 `.insight-card` 含 💡、通俗理解、Token、货币、汇率、高汇率/低汇率解释 |
| 5 | Q2 对照卡（反向降权 + 正向高亮） | **4** | L740-753 双卡在位，反向 `position-negative` opacity:0.7 + muted 色、正向 `position-positive` 主色边框。但**结构是单列堆叠**（`.dual-card { display:grid; gap }` 无 columns），视觉对比不够强，降 1 分 |
| 6 | 三类读者画像（工程师 / 创业者 / 学生） | **4** | L851/857/863 三卡齐全。**但 Reader-A 文案 L852 被改成「一个 36 万字系统」**——这是白皮书的字数，不是 Claude Code 源码规模，语义错乱，降 1 分 |
| 7 | 白皮书定位 badge「中文第一部 AI Agent 架构白皮书」+ 评审建议语标注 | **5** | L844-845 badge + `.position-badge-note` 斜体「读者评审建议语」 |
| 8 | 白皮书规模 4 微数字（83 / 360,583 / 122 / 185） | **5** | L871-888 四个 `.scale-item` 全齐 |
| 9 | VIS-0-004 数据流图 + 10 阶段 + sticky 能力 | **4** | L687-737 三泳道 **10 个 stage-node（Client 3 + Network 3 + Server 4）** + Agent Loop 虚线框，"10 个阶段"文案在位。sticky 仅在 `@media (min-width:1024px)` 的 `.sticky-wrapper > .sticky-content` CSS 里，**但 HTML 里根本没有 `.sticky-wrapper` 容器包裹图表**，sticky 形同虚设，降 1 分 |
| 10 | VIS-0-003 技术栈 8 层（严禁 9 层） | **4** | L764-836 真实渲染 **8 个 `.stack-layer` 盒子（L1-L8）**。文案 L761「L2 → L8 的 8 层」。**但 L1 = Node.js/esbuild/tsup 与 L8 = Seatbelt 划分和 Brief §0.1「L2→L8」文本口径有一层差异**（Brief 自身矛盾：写 "8 层" 又说 "L2→L8"），Kimi 选择补 L1 使 8 个盒子与"8 层"标题实际吻合，算合理裁决。但与 Brief 字面"L2→L8"有出入，降 1 分 |
| 11 | 严禁混入 Block 4 hero 数字 | **5** | grep 全 0 |
| 12 | 严禁混入 Block 3 社区数字 | **5** | grep 全 0 |
| 13 | 严禁旧口径 | **5** | grep 全 0 |
| 14 | OS 比喻不展开 | **5** | 仅 L864「完美的现代 OS 案例」和结尾 "操作系统" 一句话点名，无内核/系统调用/进程调度 |

**Kimi 总分：66 / 70**（合格 ≥56）

---

## 2. MiniMax 版 14 项逐项打分

| # | 检查项 | 分 | 证据 |
|---|---|---|---|
| 1 | 方法论 badge 三件套 | **5** | L534-538 `.badge-trio` 三 chip + 版本 / 截止日期 / 逆向解剖 |
| 2 | Q1 pull-quote | **5** | L541-543 `.pull-quote` 原文逐字 |
| 3 | 5 条 bullet 视觉化 | **5** | L550-585 `.bullet-grid repeat(auto-fit,minmax(280px,1fr))` 5 张 `.bullet-card` 含彩色图标方块 + 编号 + 粗体数字，非纯 list |
| 4 | Bul-4 💡 通俗理解卡 | **5** | L152-177 `.tooltip-card::before content:"💡 通俗理解"` badge chip，L575-577 含 Token 零钱 / 汇率 解释，CSS 级渲染稳健 |
| 5 | Q2 对照卡（反向降权 + 正向高亮） | **5** | L645-657 `.dual-cards grid-template-columns:1fr 1fr` **真正左右双列**，反向 opacity:0.7 灰，正向主色渐变 + 2px 边框 + 白字，视觉反差显著，最强锚点到位 |
| 6 | 三类读者画像 | **5** | L740-757 三 reader-card 齐全，Reader-A L743 沿用 Brief 原文「50 万行系统」 |
| 7 | 白皮书定位 badge + 评审建议语 | **5** | L762-768 `.wp-badge` 渐变 pill + L767「* 读者评审建议语」 |
| 8 | 白皮书规模 4 微数字 | **5** | L773-790 `.microbar` 四个 micro-stat（83 / 360,583 / 122 / 185） |
| 9 | VIS-0-004 数据流图 + 10 阶段 + sticky | **3** | L593-628 `.dataflow-sticky` **真正 `position:sticky;top:space-4`** + 📌 固定按钮 + JS 切换 `.pinned` 类，sticky 能力是两份里最强的。**但 flow-node 只渲染 3+2+2 = 7 个节点**，对应"一次交互如何穿越 10 个阶段"的 chart-title（L591）**数字严重不符**，降 2 分 |
| 10 | VIS-0-003 技术栈 8 层 | **3** | L663 chart-title「8 层技术栈」。**但实际 HTML 只渲染 7 个 `.tech-layer` 盒子（L2 / L3 / L4 / L5 / L6 / L7 / L8）**——完全按 Brief 字面「L2→L8」，但 L2→L8 数学上等于 7 层。标题声称 8 层，渲染 7 层，**内部一致性断裂**，降 2 分 |
| 11 | 严禁 Block 4 hero 数字 | **5** | grep 全 0 |
| 12 | 严禁 Block 3 数字 | **5** | grep 全 0 |
| 13 | 严禁旧口径 | **5** | grep 全 0 |
| 14 | OS 比喻不展开 | **5** | 仅 L755「完美的现代 OS 案例」和 L796 结尾句「操作系统」点名，无展开 |

**MiniMax 总分：66 / 70**（合格 ≥56）

---

## 3. 特别评分（不计 70 分，但是关键节奏裁决）

### 3.1 呼吸位 / 主动降温（视觉冲击力是否显著低于 Block 4）（0-10）

| 维度 | Kimi | MiniMax |
|---|---|---|
| 最大字号 | `4xl`（block-title） / `3xl`（position-title） | `4xl`（h2） / `3xl`（pos-title） |
| 动画密度 | fadeIn + IntersectionObserver 观察入场 + hover transform translateX | 纯静态 + 主题切换 + 1 个 pin 按钮 toggle |
| 数字密度 | 5 bullet 内嵌 + 4 微条 + 两张图 = 中 | 5 bullet + 4 微条 + 两张图 = 中 |
| 留白感 | `space-20`/`space-24` 大间距，section 之间空气充足 | `space-16` 间距 + `max-width:1200px + margin:0 auto + padding:space-12`，大方 |
| 对比度 | 橙绿双主色 + 渐变稍多 | 紫蓝单主色 + 克制 |
| **呼吸主观分** | **7 / 10**（动画观察器 fadeIn 有轻微"复活"感，橙绿双色稍亮） | **8 / 10**（更克制、更静态、单色系更冷静，符合"主动降温"） |

### 3.2 使命感激发（读完是否准备好接受 OS 类比）（0-10）

- **Kimi**：**7 / 10**。Q2 对照卡是上下堆叠（非左右对比），视觉锚点弱。5 bullet 为一整列垂直，节奏舒缓但"使命感"冲击被稀释。末尾 personas-grid 的"完美的现代 OS 案例"直接预告 Block 6。
- **MiniMax**：**8 / 10**。Q2 对照卡真正左右双卡 + 明亮对比，"这是工程解剖"作为最强锚点成立。结尾 `.transition` 段有明确交接句「让我们打开引擎盖……从一个你已经熟悉的框架开始：操作系统」逐字命中 Brief §3.2 第 7 段要求，OS 认知准备最到位。

### 3.3 Q2 对照卡是否本块最强视觉锚点

- **Kimi**：❌ 不是。`.dual-card` 是 `display:grid; gap` 无 column，实际是上下堆叠两卡，视觉反差被稀释。
- **MiniMax**：✅ 是。`.dual-cards grid-template-columns:1fr 1fr` 左右双列 + 正向渐变主色 2px 边框 vs 反向 opacity:0.7，对比显著，是全页最抓眼的组件。

### 3.4 Bul-4 💡 通俗理解卡是否真的解释了 Token / 货币 / 汇率

- **Kimi**：✅ 解释到位。旅行买外币类比 + "高汇率/划算" vs "低汇率/ expensive"（英文 expensive 漏翻译，小瑕疵）。
- **MiniMax**：✅ 解释到位。「Token 就是你兜里的零钱」+「汇率就像之前问过类似问题，直接从记忆里提取」。两者质量相当，MiniMax 用 `::before content: "💡 通俗理解"` chip 视觉化更稳。

### 3.5 三类读者画像是否让 3 类人都觉得"为自己写的"

- **Kimi**：❌ Reader-A 文案被改成「36 万字系统」，把白皮书的字数错接到 Claude Code 源码规模，工程师读到会困惑。
- **MiniMax**：✅ 三卡文案全部沿用 Brief G 类原文，召唤力到位。

---

## 4. 对比与选型

### 4.1 两份并列对比

| 维度 | Kimi | MiniMax |
|---|---|---|
| 总分 | **66 / 70** | **66 / 70** |
| 合格 | ✅ | ✅ |
| 数字纪律 grep | 全 0 | 全 0 |
| Q2 对照卡（本块灵魂） | 上下堆叠 **弱** | 真双列 **强** |
| 数据流图节点数 | **10 个**准确匹配标题 | **7 个**与"10 阶段"不符 |
| 技术栈层数 | **8 盒**匹配标题 | **7 盒**与"8 层"不符 |
| sticky / pinned 能力 | CSS 有 wrapper 无挂载 ❌ | `position:sticky` + 📌 按钮 + JS toggle ✅ |
| Reader-A 文案 | 改成「36 万字」语义错 ❌ | 原文「50 万行」✅ |
| 呼吸位主观 | 7 / 10 | 8 / 10 |
| 使命感主观 | 7 / 10 | 8 / 10 |
| 动画密度 | fadeIn IntersectionObserver | 基本静态 |

### 4.2 推荐裁决：**拼装（以 MiniMax 为骨架 + Kimi 补两处数据）**

两份总分恰好同分，但分布差异互补：

- **骨架选 MiniMax**：
  1. Q2 对照卡是 Block 5 灵魂，MiniMax 的左右双列反差是唯一做对的
  2. Q4 whitepaper-position-badge 用渐变 pill + 居中布局更有"宣言感"
  3. sticky / pinned 能力是 Brief 硬约束，只有 MiniMax 真正挂载了
  4. 呼吸位更克制，动画更少，符合"主动降温"纪律
  5. Reader-A 文案未被污染

- **从 Kimi 移植两处**：
  1. **VIS-0-004 数据流图的 10 节点布局**（Kimi 的 Client 3 + Network 3 + Server 4 真有 10 个 stage-node，匹配标题）—— 替换进 MiniMax 的 `.dataflow-sticky` 容器，保留 MiniMax 的 sticky + pin 能力
  2. **VIS-0-003 技术栈的第 8 层**（Kimi 的 L1 基础层 Node.js/esbuild/tsup 这个盒子）—— 补进 MiniMax 只有 7 层的技术栈图，让"8 层"标题与渲染一致

### 4.3 Opus 需要拍板的遗留问题

1. **Brief §0.1 自相矛盾**：表格写「8 层（L2 → L8）」，但 L2-L8 数学是 7 层。Kimi 选择补 L1=8 盒，MiniMax 选择守 L2-L8=7 盒但标题写"8 层"。**建议 Opus 裁决：要么改 Brief 为"7 层（L2→L8）"，要么补 L1 真凑 8 层**。融合方案默认按 Kimi 补 L1 = 8 盒
2. **VIS-0-004 的 sticky 策略**：MiniMax 的 sticky 是单图 sticky（随滚动吸顶），Brief 原文是"左 5 bullet sticky 配右图，或独立全宽"——两份都没做成"左 bullet 右 sticky 图"的双栏版式。如需此版式需要新一轮定制，或接受 MiniMax 的"单图吸顶"简化

---

## 5. 隐患清单（融合时必须处理）

1. **Kimi Reader-A 文案污染**：「36 万字系统」绝不能进融合版，必须改回 Brief G 原文「50 万行系统」
2. **MiniMax 数据流 7 节点 vs 10 阶段标题矛盾**：融合时要么补 3 节点到 10，要么改标题为 7 阶段（建议前者）
3. **MiniMax 技术栈 7 层 vs 8 层标题矛盾**：同上，融合时补 L1 盒子
4. **Kimi 的 sticky CSS 是 dead code**：HTML 里缺 `.sticky-wrapper` 容器挂载，视觉无效（融合采用 MiniMax 方案即可绕过）
5. **Kimi 通俗理解卡有"expensive"未翻译**：融合时中文化为"昂贵 / 不划算"
6. **双方都未做"左 bullet + 右 sticky 图"双栏版式**：Brief §3.2 第 3 段暗示该版式，融合版如果时间允许应补上
7. **Brief 内部 8 层 vs L2→L8 矛盾**：不是产出问题，是 Brief 本身问题，Opus 需要在融合前定义最终口径

---

## 6. 一句话总结

**Kimi 内部一致性更好（10 节点 = 10 阶段、8 盒 = 8 层），MiniMax 对 Brief 灵魂抓得更准（Q2 双列、sticky 真挂载、呼吸位更冷静、Reader-A 文案无污染）**。两份同分但互补，推荐以 MiniMax 为骨架拼装，从 Kimi 移植 VIS-0-004 的 10 节点和 VIS-0-003 的 L1 盒子两处。
