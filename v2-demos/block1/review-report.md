# Block 1 双跑交叉评审报告（Sonnet 副手 → Opus）

> 评审时间：2026-04-07
> 评审员：Sonnet（副手）
> 评审对象：`prologue-block1-kimi-clean.html` vs `prologue-block1-minimax-clean.html`
> 评分依据：Brief §5 checklist 13 项 / 65 满分 / ≥52 合格
> 关键基线：本块是「全篇 5 秒钩子 / hero 一击」，灵魂 = 留白 + 字号 + Q1 + 引擎盖撞色

---

## 零、Grep 命中总表

| 关键文本 | Kimi 命中 | MiniMax 命中 |
|---|---|---|
| Q1 「当你打开一个"聊天助手"的引擎盖」 | L473 | L463 |
| 「引擎盖」`engine-hood` 撞色 span | L473 | L463 |
| L5 「想象你在手机上打开计算器」 | L476 | L475 |
| L5 尾「屏幕显示 `2`」 | **❌ 缺失**（"2" 仅以 calculator pill `key=2` 出现） | L475 ✓ |
| L7 5 项 reveal 顺序 | L492-496（顺序对） | L487-499（顺序对） |
| L7 收尾「——远比"做加法"复杂得多」 | L499 | L504 |
| Q3 「Claude Code 也是这样。」 | L504 | L510 |
| L11 「当你在终端输入 claude」 + cursor blink | L509 | L517 |
| L11 「你说一句话…改改代码」 | L510 | L517 |
| Q6 「不就是个终端里的 ChatGPT 吗？」 | L516 | L520 |
| Q2 「不是。差远了。」 | L522（连写） | L527-528（拆双行 span） |
| 「序章 · Prologue」marginal label | L461 | L451 |
| hero footer chip+块名+sub-title | L465-467 | L455-457 |
| `var(--cc-*)` 总数 | **109** | **123** |
| 13 类禁区（OS/Cursor/Devin/MCP/Hooks/2.1.88/...） | 全 0 | 全 0 |
| `chart-title|chart-legend|chart-wrapper|chart-container` 违纪类 | 0 | 0 |

---

## 一、Kimi 评分

| # | 检查项 | 满分 | 得分 | 证据 |
|---|---|---|---|---|
| 1 | 6 行原文全在位 | 5 | **2** | 6 行 grep：L1 ✓ / L7 ✓ / L9 ✓ / L11 ✓ / L13 ✓，但 **L5 漏字**——只有「想象你在手机上打开计算器，按下 [1+1=2 pill]」，**「，屏幕显示 `2`。」整句尾被删**，由 calculator-inline 视觉道具替代了文本。Brief §0「6 行原文必须逐字保留」明文红线。-3 |
| 2 | Q1 字号 ≥ 4rem 且达 6xl/clamp 上限 ≥ 11rem | 5 | **5** | L202 `font-size: clamp(4rem, 12vw, 11rem)` 完全照 Brief §3.4 抄，达标 |
| 3 | 「引擎盖」break-the-grid 撞色 | 5 | **5** | L209-220：`color: var(--cc-color-bg)` 反色字 + `background: var(--cc-color-brand)` 实心背景块 + `transform: skew(-3deg)` 倾斜 + `outline + outline-offset`。**填充式撞色**，视觉权重最重的方案，光暗主题都覆盖（L222-226）|
| 4 | Q2「不是。差远了。」独立段 + ≥4xl + 双句号 | 5 | **5** | L519-523 `.finale` 独立 div，`font-size: clamp(2.5rem, 8vw, 5rem)` ≈ 5xl-6xl，两个句号俱在，居中黑体 900 |
| 5 | Q3「Claude Code 也是这样。」独立呼吸位 | 5 | **5** | L502-505 `.bridge` 独立 div，`margin: var(--cc-space-20) 0` 上下 5rem 留白，居中独立行 |
| 6 | 5 项 reveal 顺序 | 5 | **5** | L491-497 顺序：浮点精度→本地化→无障碍→撤销栈→单元测试，等宽 mono，stagger animation-delay 0.1-0.5s，左边框 brand 色 |
| 7 | Q6 对话气泡 + 与 Q2 视觉相邻 | 5 | **5** | L513-518 chat-bubble 在 finale 上方（中间无其他段落），含 `::before` 大引号装饰；位置紧贴 Q2 |
| 8 | inline `1 + 1 = 2` 装饰且非图表容器 | 5 | **5** | L477-484 calculator-inline 用 5 个 span（key/+/key/=/key），无 chart-title/legend/wrapper class，是排版级 inline 道具 ✓ |
| 9 | 顶部 marginal label「序章 · Prologue」 | 5 | **5** | L461 居中等宽小字 + uppercase + letter-spacing 0.2em，规格漂亮 |
| 10 | hero footer 组件（块号 chip + 块名 + sub-title） | 5 | **5** | L463-468 三件套齐：chip「0 / 序章 · 01」+ 块名「Hero 一击 · 引擎盖悖论」+ sub「全书第 0 拍 · 5 秒钩子」，竖直堆叠居中 |
| 11 | `claude` 后闪烁光标 inline 装饰 | 5 | **5** | L509 `<code>claude</code><span class="claude-cursor"></span>`，纯 CSS @keyframes blink，inline 块状光标，不是全屏 scroll-driven ✓ OQ7 守纪 |
| 12 | token 纪律 `var(--cc-*)` ≥ 50 | 5 | **5** | grep 109 命中，远超 50 红线 |
| 13 | 13 类禁区 grep 全 0 | 5 | **5** | OS/内核/进程调度/Cursor/Devin/MCP/Hooks/2.1.88/83 章/工程解剖 全部零命中 |
| **总分** |  | **65** | **62** |  |
| **合格线** |  | 52 | **✓ 合格（+10）** |  |

### Kimi 主观评分

- **5 秒钩子主观（0-10）**：**8**。Q1 11rem 上限 + 「引擎盖」实心反色块的视觉冲击最强，第一眼直接被钉住，第二眼想看「为什么是引擎盖」。块大留白节奏到位（hero-title margin-bottom 6rem，bridge 上下 5rem，finale 上下 4-5rem），灵魂气质足。
- **Q1 是否全块最大字号**：**是**。Q1 上限 11rem，finale 上限 5rem，chat-bubble::before 引号 3rem，hero-footer__title 1.5rem，无任何元素抢风头。
- **留白节奏奢侈度**：**够奢侈**。block padding `--cc-space-20` 5rem 上下，section 之间 4-6rem 间距，bridge `margin: 5rem 0` 上下双 5rem，body `font-size: lg` + `leading-relaxed`，全块只用了不到 60% 的视觉密度。
- **「引擎盖」撞色具体手法**：**填充反色块 + 倾斜 + 描边三合一**——`color: bg`（字反色为黑）、`background: brand`（橙色实心块）、`transform: skew(-3deg)`（左倾 3 度）、`outline: 0.02em solid accent`（外层细描边 + offset）。光暗主题分别处理（暗色填充实心，浅色降为 brand-subtle 半透明）。是双跑里更"重锤"的方案。

### Kimi 隐患

1. **L5 漏「屏幕显示 `2`。」整句尾**——这是硬伤。Kimi 把 L5 拆成「hero subtitle 副标的一行」+「inline calculator pill」，结果文本上只剩前半句，「屏幕显示 2」整句被视觉化吃掉了。Brief §0 第 6 条明确要求"6 行原文必须逐字保留"。-3 是不可避免的。
2. hero-title__subtitle 把 L5 当成一行 inline，没有独立段落语义，节奏上和 Q1 太近——可被批评为"L5 失去铺垫节拍"。
3. Q2 finale 字号 5rem 上限，**比 Q1 11rem 显著小**（这是对的，符合 Q1 风头不被抢的硬约束），但读者最终炸点的力量主要靠"两个句号 + 黑体 900 + 上下 4-5rem 留白"撑住，比 MiniMax 双行拆分弱一点。

---

## 二、MiniMax 评分

| # | 检查项 | 满分 | 得分 | 证据 |
|---|---|---|---|---|
| 1 | 6 行原文全在位 | 5 | **5** | 6 行全 grep 命中：L1 ✓（L463 hero-title） / L5 ✓（L475 完整一句含「屏幕显示 2」） / L7 ✓（L482-505 含 5 项 reveal + 收尾） / L9 ✓（L510）/ L11 ✓（L517）/ L13 ✓（L527-528 拆 span 但 DOM 渲染是「不是。差远了。」）。**逐字守规** |
| 2 | Q1 字号 ≥ 4rem 且 clamp 上限 ≥ 11rem | 5 | **3** | L11 `--cc-font-size-6xl: clamp(3.5rem, 10vw, 9rem)`——**floor 3.5rem 低于 4rem** + **ceiling 9rem 低于 brief §3.4 建议的 11rem**。OQ6 binary 闸口名义上还是 6xl token 没破，所以不归零；但 Brief §5 #2 明文「字号不达 = -2 分」。-2 |
| 3 | 「引擎盖」break-the-grid 撞色 | 5 | **4** | L175-186：`color: brand`（橙色字）+ `outline: 0.08em solid brand`（描边）+ `transform: skew(-6deg)`（倾斜 6 度）+ `position: relative; left: -0.04em`（错位）+ `text-shadow` 双向 bg 描白。**轮廓+错位+倾斜+text-shadow 四件套**，但**没有反色填充背景**——视觉权重比 Kimi 实心方案弱半档，更像"被框住的橙字"而非"被钉上去的反色块"。Brief 列了 4 种手法允许任一，技术上达标，气场略弱。-1 |
| 4 | Q2「不是。差远了。」独立段 + ≥4xl + 双句号 | 5 | **5** | L525-530 `.finale-section` 独立 div，`font-size: var(--cc-font-size-5xl) = clamp(2.5rem, 6vw, 5rem)` ≥4xl，两个句号俱在；**亮点：拆成 `rejection-line-1`「不是。」+ `rejection-line-2`「差远了。」上下两行 + 两行不同色（line1 主色 / line2 brand 色 + text-shadow）**。Brief 没禁止视觉拆分，渲染仍是「不是。差远了。」，是合理视觉强化，**反而在节奏上比 Kimi 单行更狠** |
| 5 | Q3「Claude Code 也是这样。」独立呼吸位 | 5 | **5** | L509-511 `.transition-hinge` 独立段，居中 3xl 黑体，`::before/::after` 两条上下渐变细线包夹，padding 2rem 上下 + 上下 section-gap 4rem，呼吸位非常清晰 |
| 6 | 5 项 reveal 顺序 | 5 | **5** | L485-501 顺序：浮点精度→本地化→无障碍→撤销栈→单元测试，**带 01-05 序号** + 等宽 mono + 左边框 brand + `→` 前缀 + reveal-bg 卡片化背景 + stagger animation-delay 0.1/0.25/0.4/0.55/0.7s。装饰比 Kimi 更重 |
| 7 | Q6 对话气泡 + 与 Q2 视觉相邻 | 5 | **4** | L519-522 chat-bubble inline-block 在 scene-section 内，气泡形态完整（border-radius `16px 16px 16px 4px` 左下尖角的 IM 气泡 + `::before` 大引号装饰）；但 Q2 在 `.finale-section` 里，**finale-section L408-410 加了 `border-top: 1px solid border` 上分隔线**，把气泡和 Q2 物理切开了——Brief 要求「视觉上必须与 Q2 相邻」是要紧贴气泡作为反话被拒绝的对话回合，分隔线削弱了这种相邻感。-1 |
| 8 | inline `1 + 1 = 2` 装饰非图表容器 | 5 | **5** | L463-468 `.inline-calc` 嵌在 hero-title 内 vertical-align middle，背景 surface + border 圆角 pill，class 命名 `sym/result`，**无 chart-title / legend / wrapper**，是排版级装饰 ✓ OQ2 守纪 |
| 9 | 顶部 marginal label「序章 · Prologue」 | 5 | **5** | L451 + L104-123 marginal-label 类带 `::before` 2em 横线装饰 + uppercase + letter-spacing，左对齐编辑级 marginalia 风格 |
| 10 | hero footer 组件（块号 chip + 块名 + sub-title） | 5 | **4** | L454-458 三件套齐（chip「序章 · 01」+ 块名「Hero 一击 · 引擎盖悖论」+ sub「全书第 0 拍 · 5 秒钩子」），但**整个 hero-footer 用 surface 背景 + border + border-radius 12px 包成卡片**，flex 横向布局而非 Brief §3.3 spec 的「居中堆叠 + 紧邻 marginal 之下」的轻盈版式。**spec 未照搬**——Brief OQ4 是 Block 1 单独立 spec 且 8 块复制，未来块若以 MiniMax 为基准会偏离 Opus 的轻盈意图。-1 |
| 11 | `claude` 后闪烁光标 inline 装饰 | 5 | **5** | L517 `<span class="cli-cmd">claude</span><span class="cursor-blink"></span>`，L360-373 `width: 0.6em; height: 1.1em; background: accent; @keyframes blink`，inline 微装饰，不是全屏 scroll-driven ✓ OQ7 守纪 |
| 12 | token 纪律 `var(--cc-*)` ≥ 50 | 5 | **5** | grep 123 命中，比 Kimi 多 14 |
| 13 | 13 类禁区 grep 全 0 | 5 | **5** | 全部零命中 |
| **总分** |  | **65** | **55** |  |
| **合格线** |  | 52 | **✓ 合格（+3）** |  |

### MiniMax 主观评分

- **5 秒钩子主观（0-10）**：**6**。L5 完整保留 + Q1 inline calc 嵌在标题尾巴是有想法的紧凑布局，5 项 reveal 序号 + 卡片化更"工程感"；但 Q1 ceiling 9rem 比 Kimi 11rem 小一档，且引擎盖是橙字带框而非实心反色块，**第一眼锐度略输 Kimi**。Q2 拆双行 + 双色是这份的最大亮点，块尾炸点比 Kimi 更狠。综合钩子 6 分。
- **Q1 是否全块最大字号**：**是，但勉强**。Q1 上限 9rem，finale 上限 5rem，chat-bubble::before 引号 3em（相对气泡 xl 字号约 3.75rem），block-name 2xl ≈ 2rem，无元素抢风头。但 Q1 floor 3.5rem 在窄屏可能掉到 finale clamp 上限附近。
- **留白节奏奢侈度**：**中等偏紧**。`page-wrapper max-width: 65ch` 把整页限死在窄栏，hero-section 与 marginal/footer 都挤在同一 65ch 列宽里，**不如 Kimi 的 `block__inner: max-width: calc(65ch * 1.5)` 宽敞**。section-gap 4rem 是常规节奏，不算奢侈。L408 finale-section 上沿那条 border-top 分隔线尤其反 hero——hero 留白本该是无形的，分隔线把节奏切割得太有形。
- **「引擎盖」撞色具体手法**：**轮廓 + 倾斜 + 错位 + text-shadow 描白**——`color: brand` 橙字 + `outline: 0.08em solid brand` 实线轮廓 + `transform: skew(-6deg)` 倾斜 6 度 + `position: relative; left: -0.04em` 微错位 + `text-shadow: 0.04em 0.04em 0 bg, -0.02em -0.02em 0 bg` 双向背景色描白。是 4 种手法叠加，比 Kimi 的"实心填充 + 倾斜 + 描边"多 1 种但**没有实心反色块这种最强的撞色形态**。

### MiniMax 隐患

1. **Q1 字号 floor 3.5rem 低于 Brief 红线 4rem**——Brief OQ6 最严的解读是「< 6xl = 0 分」，MiniMax 用了 6xl token 名义所以不归零，但 Brief §5 #2 还是要扣 -2。
2. **hero-footer 包成卡片（surface + border + radius）违 Brief §3.3 spec**——Block 1 是全书 hero footer 的 spec 起点，OQ4 明文「后续 8 块复制此 spec，不得改 spec」。MiniMax 这版若被 Opus 钦定为 spec 基线，未来 8 块会失去 Opus 设计的「轻盈编辑级」气质。
3. **finale-section 上沿 border-top 横线**把 Q6→Q2 的对话回合切断，弱化了 Brief §3.2 #8 的"Q6 与 Q2 视觉相邻"。
4. **light 主题 brand 色定为 `#cf222e` 红色**——和 Kimi 的橙色 `#d97706` 撞色风格不一致，但 Block 1 是单文件 demo，无统一约束；只是注意未来全书并轨需要 normalize。
5. token 表里 `--cc-color-text-muted` 是新 token 名（不是 Brief / Block 4-5 用的 `--cc-color-text-tertiary`）——会跟全书 token 表打架。
6. 全文用 `<p>` 包 chat-bubble inline-block 是糟糕语义；原本应是块级 div。

---

## 三、对比 + 选谁/拼装

### 三句话结论

**Kimi 总分 62 / 65（合格 +10），MiniMax 总分 55 / 65（合格 +3）。Kimi 明显更强。**

但 Kimi 有一处不可忽视的硬伤——**L5「屏幕显示 `2`。」整句尾被吞了**，违反 Brief §0「6 行原文逐字保留」红线。MiniMax 在 L5 完整度、Q2 双行拆分炸点、5 项 reveal 序号化三处优于 Kimi。

### 推荐方案：**以 Kimi 为底盘 + 5 处 MiniMax 补丁**

| 拼装项 | 来源 | 理由 |
|---|---|---|
| 整体骨架 / hero-title 11rem / 引擎盖实心反色块 / 大留白节奏 / hero-footer 轻盈版式 / marginal label 居中 / claude-cursor / 5 项 reveal 等宽简洁 | **Kimi** | hero 灵魂三件（字号、撞色、留白）Kimi 全胜 |
| **L5 段落「想象你在手机上打开计算器，按下 `1 + 1 =`，屏幕显示 `2`。」逐字补回**（独立 `<p>` 段落，非 hero subtitle inline） | MiniMax 文本 + 独立段位 | 修复 Kimi 硬伤，节奏上 hero 之后给 L5 一拍铺垫位 |
| **Q2 finale 双行拆分**（`不是。` 独立行 / `差远了。` 独立行 + 两行可选不同色权重） | MiniMax | 收尾炸点节奏比 Kimi 单行更狠 |
| 5 项 reveal 加 01-05 序号前缀（可选） | MiniMax | 等宽编号节奏 + 视觉锚点，但不要加 reveal-bg 卡片背景（卡片化会破坏 Kimi 的留白纯净） |
| 「引擎盖」撞色再加 1° text-shadow 双向背景色描白 | MiniMax | 防止反色字在浅色主题下边缘吃光 |
| **不要采纳**：MiniMax 的 hero-footer 卡片化、page-wrapper 65ch 窄栏、finale-section border-top 分隔线、Q1 9rem ceiling、light 主题红 brand | — | 这些都偏离 Brief 的 hero 调性 |

### 隐患汇总（Opus 决策时务必看）

1. **Kimi L5 漏字必须补**——这是融合时第一优先修复项。原句「想象你在手机上打开计算器，按下 `1 + 1 =`，屏幕显示 `2`。」必须在 hero-title 之后独立 `<p>` 段保留，calculator-inline 视觉道具可作为副标装饰但不能替代文本。
2. **OQ4 hero-footer spec 是 Block 1 立的基准**——融合后这一组件 spec 会被 8 块复制。建议**钦定 Kimi 版**作为全书基准（轻盈居中堆叠 / 无背景卡片 / 紧邻 marginal 之下），未来块严禁加 surface 包卡。
3. **OQ7 claude-cursor 两份都守纪**——纯 inline @keyframes blink，无 scroll-driven 滥用。
4. **OQ2 inline 1+1=2 两份都守纪**——无 chart-title / legend / wrapper class，是排版道具不是图表容器。
5. **OQ3 Q2 收尾两份都守纪**——「不是。差远了。」都在 Block 1 块尾，未被移到 Block 2。
6. **OQ5 marginal label「序章 · Prologue」两份都守纪**——分别在 L461（Kimi）/ L451（MiniMax）。
7. **OQ6 字号闸口**：Kimi 11rem ceiling 完美，MiniMax 9rem ceiling 略缩，融合时锁 Kimi 数值。
8. **token 表分歧**：MiniMax 用 `text-muted` 而非 `text-tertiary`，融合时统一为 `text-tertiary`（与 Block 4/5 对齐）。
9. **light 主题 brand 色**：Kimi 橙 `#d97706` 与 Block 4/5 一致，MiniMax 红 `#cf222e` 偏离全书基线，统一选 Kimi。
10. **Block 1 全块约 175 字 + 9 个组件**，融合后 HTML 行数预计 280-340，文件体积 18-22 KB，符合 Brief §6 预算。

---

## 四、给 Opus 的最终建议

**采用 Kimi 为底（62 分）+ 4 处 MiniMax 移植（L5 完整段 / Q2 双行拆分 / 5 项序号 / 引擎盖 text-shadow 描白）**。融合后预期总分 65/65。

最大风险点是 hero-footer spec——Block 1 是全书 spec 起点，钦定 Kimi 版后 8 块都要照搬，建议 Opus 在融合稿里专门把 hero-footer 三件套居中堆叠版式签为 §3.3 全书规范，写进未来 8 块的 brief 模板。

---

*Review by Sonnet（副手）on 2026-04-07，基于 Brief §5 13 项 + Opus 7 OQ 决断 + 双跑 grep 实证，零信任拍马屁。*
