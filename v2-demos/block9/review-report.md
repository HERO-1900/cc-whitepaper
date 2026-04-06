# Block 9 评审报告（Sonnet 交叉评审）

> 任务：对 Block 9 双跑两份 HTML 产出做交叉评审打分
> 评审人：Sonnet（副手）
> 评审时间：2026-04-07
> Brief：`handoff/v2-prologue-brief-block9-收尾合一.md`（§5 13 项 / 65 满分 / ≥52 合格）
> 产出 A：`v2-demos/block9/prologue-block9-kimi-clean.html`（510 行 / ~16 KB）
> 产出 B：`v2-demos/block9/prologue-block9-minimax-clean.html`（710 行 / ~22 KB）

---

## 一、Kimi 逐项打分（§5 13 项）

| # | 检查项 | 证据 | 得分 |
|---|---|---|---|
| 1 | 5 比喻家族全在位 | L384/391/398/405/412 metaphor-name 五张卡全齐 | 5 |
| 2 | 5 领域标签全在位 | L385/392/399/406/413 metaphor-domain 带括号逐字 | 5 |
| 3 | Q1「好的比喻不是降低精度，是提供另一个入口。」逐字 | L367 pull-quote 内带「」逐字 | 5 |
| 4 | Q2「比喻先行，精确随后。」逐字 | L373 principle-title 带「」逐字 | 5 |
| 5 | 7 硬数字精确（5 / 25 / 2.1.88 / 4,684 / 38 / 约 1,400） | L472 带千分位 4,684；L455 2.1.88；L474 38；L475 约 1,400；5/25 均在 group-subtitle | 5 |
| 6 | 5 源码入口路径全在位 | L472-476 pre 内 5 条路径逐字 | 5 |
| 7 | "让我们开始。" 逐字 | L459 let-us-begin class 独立一行 | 5 |
| 8 | CTA `Part 1` + `这不是聊天机器人` | L487-488 cta-guide + cta-title | 5 |
| 9 | 5 分组标签全在位 | L425-441 group-name 五项逐字 | 5 |
| 10 | OQ2 守纪（不补 25 概念名） | grep queryLoop/Tool.ts/permissions.ts 全 0，仅展示 5 个分组 | 5 |
| 11 | OQ4/OQ5 守纪 | grep 12,000 / NEW_INIT_PROMPT / 11 类 / A-K / 协调者 / 输出风格 全 0 | 5 |
| 12 | 禁 Block 4 数字 | grep 1,884 / 476,875 / 185 / 9,000 / 121K 全 0 | 5 |
| 13 | "约"字唯一 = 约 1,400 | grep 约 仅 L475 一次紧邻 1,400 | 5 |

**Kimi 总分：65 / 65** ✅ 合格

---

## 二、MiniMax 逐项打分（§5 13 项）

| # | 检查项 | 证据 | 得分 |
|---|---|---|---|
| 1 | 5 比喻家族全在位 | L586/594/602/610/618 metaphor-name 五张卡全齐 | 5 |
| 2 | 5 领域标签全在位 | L587/595/603/611/619 metaphor-domain 带括号逐字 | 5 |
| 3 | Q1 逐字 | L569 pull-quote-q1 内文 + CSS ::before/::after 注入「」 | 5 |
| 4 | Q2 逐字 | L573 principle-slogan 内文 + CSS ::before/::after 注入「」 | 5 |
| 5 | 7 硬数字精确 | L671 带千分位 4,684；L651 2.1.88；L673 38；L674 约 1,400；5/25 均在 group-tags-title | 5 |
| 6 | 5 源码入口路径全在位 | L671-675 pre.source-pre-block 5 条路径逐字 | 5 |
| 7 | "让我们开始。" 逐字 | L656 let-us-begin class 独立一行 | 5 |
| 8 | CTA `Part 1` + `这不是聊天机器人` | L686-687 cta-lead + cta-title，且 href 指向实际 md 路径 | 5 |
| 9 | 5 分组标签全在位 | L630-634 group-tag 五项逐字 | 5 |
| 10 | OQ2 守纪 | grep queryLoop/Tool.ts/permissions.ts 全 0，仅 5 个分组 + 副标题"25 个核心概念分 5 组"单次出现 | 5 |
| 11 | OQ4/OQ5 守纪 | grep 12,000 / NEW_INIT_PROMPT / 11 类 / A-K / 协调者 / 输出风格 全 0 | 5 |
| 12 | 禁 Block 4 数字 | grep 1,884 / 476,875 / 185 / 9,000 / 121K 全 0 | 5 |
| 13 | "约"字唯一 = 约 1,400 | grep 约 仅 L674 一次紧邻 1,400 | 5 |

**MiniMax 总分：65 / 65** ✅ 合格

---

## 三、不计分的额外报告（Brief §5 要求）

| 项目 | Kimi | MiniMax |
|---|---|---|
| "让我们开始。" 字号大于正文 | ✅ `--cc-font-size-3xl` (2rem) vs 正文 lg (1.125rem) | ✅ `--cc-font-size-3xl` (1.875rem) vs 正文 lg (1.125rem) |
| 源码入口块用 `<pre>` mono 而非 grid | ✅ `.source-entry pre` font-family var(--cc-font-mono) + white-space: pre | ✅ `pre.source-pre-block` font-family var(--cc-font-mono) + white-space: pre |
| 38 工具脚注真解释 43 口径冲突 | ✅ L479 "与 0.3-A 的 43 个对外可调用工具在口径上不同" 完整 | ✅ L677 完整同句 |
| 5 比喻家族卡片无虚构章节号 | ✅ 仅 icon+名称+领域+子概念省略号，无 Part X | ✅ 同上 |
| `<hr>` 水平分隔线保留 | ✅ 3 处 `<hr class="divider">`（L448/463/482） | ✅ 3 处 `<hr class="horizontal-divider">`（L641/661/684） |

### 主观告别感评分（0-10）

- **Kimi：7.5/10**。结构清晰、节奏稳定，"让我们开始。" 居中金色品牌色（#d4a574 暖琥珀）收束感温柔，但 CTA 是 `<a href="#">` 空锚，"翻到 Part 1 第一章"的"翻开"欲被削弱。5 分组卡每张重复副标题"25 个核心概念分 5 组"显得啰嗦（一个分组说 5 次 25 的卡片会让读者困惑）。告别感：稳但不够"推一把"。
- **MiniMax：8.5/10**。CTA `<a href="../part1_认识这个系统/01_这不是聊天机器人.md">` 直指真实 md 路径，立刻能翻页；acknowledgement-card 用 linear-gradient 背景 + sincerity-highlight 三处强调（真诚敬意 / 批评同样真诚 / 生命力远比具体代码长），声明段真诚感更足；5 分组标签用 flex-wrap 小徽章而非大卡，避免了"概念速查表=大入口"的误读，副标题"25 个核心概念分 5 组"只出现 1 次（群组标题位）；5 比喻家族桌面 5 列 + 平板 3 列 + 移动 1 列的响应式更细。告别感：更接近"推一把就想翻页"。

---

## 四、对比结论

### 谁更好

**MiniMax 更好**，但差距不大（约 1 分主观告别感）。两份满分同分，守纪完美，但 MiniMax 在三处关键细节更胜一筹：

1. **CTA 实锚 vs 空锚**：MiniMax 的 `href="../part1_认识这个系统/01_这不是聊天机器人.md"` 是可点击的真实链接；Kimi 的 `href="#"` 是装饰性空锚，与"翻到 Part 1 第一章"的语义承诺不符。
2. **0.5-A 速查表语义清晰度**：Kimi 在 5 张分组卡里每张都挂"25 个核心概念分 5 组"副标题共 5 次，读者会误以为每个分组各有 25 个；MiniMax 把"25 个核心概念分 5 组"放在 group-tags-title 单次出现，5 个分组标签做成小徽章（符合 Brief §7"不要做成目录"的告诫）。
3. **声明段真诚感**：MiniMax 的 `sincerity-highlight` 三处内文强调 + linear-gradient 卡片底，更像"一位工程同行的平和叙事"；Kimi 是平铺黑卡，稍显冷感。

### 是否拼装

**建议直接选 MiniMax 作为 Block 9 基线，不拼装**。理由：

- 两份在守纪 / 必保留 / OQ 决断四个维度完全一致，拼装收益低
- MiniMax 的三处优势都是结构性的（CTA 语义、速查表副标题位置、声明段情绪层），难以"摘一段搬过去"
- Kimi 的唯一特色是暖琥珀品牌色（#d4a574）vs MiniMax 的 GitHub 蓝（#58a6ff），但这是跨 Block 11 块的 token 统一性决策，应由 Opus 在全局层拍板，不应在 Block 9 单块内混色

**次选**：如果 Opus 后续决定全篇用暖琥珀品牌色，可以把 MiniMax 的 HTML 骨架 + Kimi 的 `--cc-color-brand` 色值做 token 置换，而非结构性拼装。

---

## 五、隐患与备忘

1. **Kimi 的 5 分组副标题冗余**：`<div class="group-subtitle">25 个核心概念分 5 组</div>` 在 5 张卡里各出现一次 = 5 次"25 个核心概念分 5 组"。虽未违纪（OQ2 只禁虚构具体概念名），但读者体验上会误以为每个分组有 25 个。若选 Kimi，应把副标题上移到 group-section 标题位。
2. **Kimi CTA 空锚**：`href="#"` 上线前必须改成真实相对路径（参考 MiniMax 的 `../part1_认识这个系统/01_这不是聊天机器人.md`）。
3. **两份都用 `[data-theme="light"]` 做浅色覆盖**，dark 为基线。符合 Brief §0 MUST。
4. **MiniMax CSS ::before/::after 注入「」** 用于 Q1/Q2：grep 金句正文是纯净的"好的比喻..."和"比喻先行..."而 `「」`由 CSS content 拼接。好处是 grep 干净，坏处是若未来 reset CSS 某一项会导致「」丢失。Kimi 则是硬编码「」在 DOM 里，更稳健。属设计权衡，不影响评分。
5. **Kimi 主题切换按钮文案**：`🌓 切换主题` 用到 emoji，与 CLAUDE.md "除非明确请求，避免 emoji"的写作风格红线有潜在冲突——但这里是 UI 交互元素，算灰色地带。MiniMax 用 `☾ 浅色` / `☀ 深色` 的 Unicode 符号更温和。
6. **文件大小**：Kimi 16 KB / 510 行；MiniMax 22 KB / 710 行。均在 Brief §6 的"30-70 KB / 500-1000 行"预算内，MiniMax 略胖是因为更多 CSS token + 响应式断点 + 独立 section wrapper class。

---

## 六、最终裁决（一句话）

两份产出都守纪合格，Kimi 65/65 + 告别感 7.5，MiniMax 65/65 + 告别感 8.5，**建议直接选 MiniMax 作为 Block 9 基线**，Kimi 留作 fallback；是否拼装 = 否，CTA 实锚 + 速查表副标题位置 + 声明段情绪层三处优势不适合摘段搬移。

— Sonnet 评审完成于 2026-04-07
