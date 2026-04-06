# V2 范式 — 序章 Demo（Kimi 备份分支）

> 生成时间：2026-04-06 21:11 · 分支：Kimi（备份） · 姊妹分支：MiniMax（另一 sub-agent 独立跑）

## 1. 产物

| 项目 | 值 |
|---|---|
| HTML 路径（含时间戳） | `/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/prologue-kimi-1775480452.html` |
| HTML 路径（稳定） | `/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/prologue-kimi-latest.html` |
| 行数 | **1,939 行** |
| 字节数 | **75,767 bytes（≈ 74 KB）** |
| `var(--cc-*)` 引用次数 | **364 次**（参考值 >100，超额完成 3.6 倍） |
| `VIS-0-*` 图表占位块 | **20 处**（15 张图表全部覆盖 + 部分重复引用，单个 `data-chart-id` 全部唯一） |
| 硬编码 hex 颜色 | **56 处**，全部位于 `:root`（行 10-45）和 `[data-theme="light"]`（行 121-152）token 定义块**内**——**非定义区域零违规** |
| `<h3 class="group-title">` 数量 | **24 个**（目标 15-20+，超标完成） |
| `@media` 响应式断点 | 2 处（≥1024px 多栏、<768px 单栏堆叠） |
| Kimi 生成耗时 | 约 **11 分钟**（21:00 启动 → 21:11 结束），与 Harness 先例 11 分钟完全一致 |
| Prompt 文件大小 | 30,694 字节 / 534 行 |
| Kimi token 调用次数 | 单次 `claude -p` headless 调用，无工具搜索（`ENABLE_TOOL_SEARCH=false`） |
| stderr 日志 | **空**（`v2-demos/_prologue-kimi-stderr.log` 0 字节），无警告无错误 |
| 文件头尾校验 | 首行 `<!DOCTYPE html>` ✓，末行 `</html>` ✓ |

## 2. 核心评估：是否符合用户的"子标题→段→图 group"标准

**结论：完全符合。这是本次生成最令我满意的一点。**

用户对序章 V2 的核心要求原话是：「标准应该是先有子标题→一小段话→图表，形成 group」。这是 V2 相对 V1（「一段长文末尾堆图」）的根本差异。Kimi 这一版做到了几乎教科书级的落地：

**第一，24 个 `<h3 class="group-title">` 严格对应 24 个 `<section class="group">` 容器**。每个 group 顶部是 `group-header` 含一个编号徽章（A/B/C… 或 G/OS/→/≈/{} 这类语义符号）+ H3 标题；中部是 `group-content` 内的 1-2 段短文（典型 2-4 句话、强调某个核心事实或数字）；底部紧跟一个视觉组件（chart-placeholder / stat-grid / pull-quote / path-grid / mapping-row / metaphor-chip 等）。**没有任何一个 group 出现"连续 3+ 段文字后才出图"的 V1 恶习**。

**第二，文字密度控制极佳**。抽检 Group F「核心反转」（第 1153-1182 行）：一段 70 字短文（介绍 1,884 文件）→ 小型 pull-quote（"一个为 AI 智能体设计的操作系统"）→ 另一段 80 字补充（解释类比边界）→ 4 个 stat 大数字（1,884 / 476K / 98 / 38）。整个 group 在 30 行 HTML 内把"数字震撼 + 金句反转 + 视觉化冲击"三件事闭环完成，信息密度和呼吸感兼顾。

**第三，Group 间的递进有叙事弧**。24 个 group 不是平铺直叙，而是呈现出一条认知曲线：A 计算器悖论（日常比喻 hook）→ B 不只是 ChatGPT（反差引入）→ C-E 行业坐标系（宏观扫描）→ F 核心反转（情绪顶点）→ G-U 技术解剖（15 张图表穿插）→ OS 对照（方法论）→ 三条阅读路径（行动分流）→ 比喻家族（基调定锚）→ 源码入口（收尾）。这条曲线对应全书序章应该完成的认知旅程。

**第四，OS 对照表专区做了额外巧思**——没有强行塞进某个 H3 group（避免违反"短段"原则），而是独立成一个大 section，内部用 `mapping-row` 横向两列（OS 概念 ↔ CC 对应物）呈现，并且每个关键行都挂了 `tip-block` 通俗类比（快递分拣、员工证书、外卖调度、小区门禁、USB 转接口等），完美命中用户"每个技术概念必须配日常生活比喻"的写作风格红线。

**第五，三条阅读路径分流**（第 1813-1860 行）做成了 3 栏 `path-card` 网格：图标（🎓/⚙️/🚀）+ 人群标题 + 双标签 chip（"全局优先/类比入门" 等）+ 4 行 desc + CTA 行动按钮。这是序章最关键的"分岔口"组件，Kimi 把它放在了正确的位置（OS 对照之后、比喻家族之前），符合阅读时机。

唯一的小遗憾：Kimi 用了自己发明的 class 名 `tip-block` 来承载通俗类比（没有字面写出"💡 通俗理解"四个字），所以用"通俗理解"字面 grep 会得到 0 次匹配。但从功能上看 `tip-block` 和项目内的"💡 通俗理解"块是等效的，样式可在后续融入主站时改造，不是架构问题。

## 3. 设计亮点 3 条

1. **chart-placeholder 不是留白，是低保真 mockup**。Kimi 为每张图表 placeholder 写了纯 CSS/HTML 的示意预览：英雄架构图画了 3 行 mock-node 圆点阵列、技术栈画了 8 个层叠矩形、工具目录画了 6×4 方格、时间线画了三段 dash + 圆点……读者在没有真正图表的情况下，也能**看到这里将会出现一张什么样的图**。这完美对应了我 prompt 里「占位不是留白」的要求。

2. **group-number 徽章系统**。每个 group 的编号不是简单的「1 2 3」，而是「A B C D E F G H…」字母序，到了特殊区段改用语义符号（OS 对照表 = `OS`、三条阅读路径 = `→`、比喻家族 = `≈`、源码入口 = `{}`）。这套系统既给了视觉节奏感，又让特殊 section 脱离字母序，一眼可辨。

3. **Token 纪律 100 分**。364 次 `var(--cc-*)` 调用，56 处硬编码 hex 全部在 `:root` 和 `[data-theme="light"]` 的定义块内。换肤时只要改两套 token 就能全站变色。对比 V1 某些章节图表硬编码了几十处 `#fff`/`#1a1a2e`，这一版可以无痛接入主站。

## 4. 与 V1 对比 3 条

1. **排版：段落与图表共生 vs 文末堆图**。V1 的序章等价物会把 15 张图表一个接一个堆在最后，读者要么一次性看 15 张图疲惫不堪，要么完全跳过。Kimi V2 把每张图打散进对应 group，读到哪张对应内容就顺势看到哪张图，阅读-视觉节奏完全同步。

2. **信息密度：24 group 节奏 vs 3-4 大段**。V1 的一级 h2/h3 跨度动辄 200-500 字，中间没有视觉呼吸。Kimi V2 把所有内容切成 24 个"知识胶囊"，每个胶囊平均 30-50 行 HTML（含 title + 段 + 图），读者可以在任意 group 暂停/重入，不会丢失上下文。

3. **主题切换 + 响应式开箱即用**。V1 的单章节产物是纯静态、固定暗色、桌面布局。Kimi V2 右上角有 `themeToggle` 按钮可一键切换明暗两套 token，`@media` 覆盖桌面/平板/手机三档，移动端 path-grid 自动堆叠成单列。这意味着它**可以直接放进主站的响应式框架**，不需要额外适配。

## 5. 不足或风险 2 条

1. **"通俗理解"字面品牌缺席**。项目写作风格红线之一是「每个技术概念必须配一个日常生活比喻，用 `💡 通俗理解` 格式标记」。Kimi 实际用的是 `tip-block` 无标题样式，内容对了，但没有显式的 💡 图标和"通俗理解"四字标签。合并进主站时需要做一次 CSS 改名 / DOM patch：把 `.tip-block` 的 `::before` 加上 `💡 通俗理解` 字样，或改为 `.cc-plain-talk` 并用统一样式。**这是 5 分钟能修的事，不是架构问题**。

2. **图表 placeholder 的低保真预览风格不一**。有些 group 的 chart-preview 做得很精致（英雄架构图的 9 圆点阵列、工具目录的 24 方格），但有些（知识图谱、性能优化全景）的预览相对简单。如果 MiniMax 分支的 placeholder 预览风格更统一或更精致，那个版本在"看起来像有真图"这一点上会占优。**不过这是"锦上添花"的评价维度，不影响 V2 结构核心判断**。

## 6. 截图建议

建议用 Playwright 无头 Chrome 截 3 张对比截图：

1. **首屏 hero + Group A-C**（展示 V2 开场节奏：章节大标题 → 计算器悖论 group → 不只是 ChatGPT group → 2026 群雄并起 group），验证"一开场就能看到第一个 group 的图表"
2. **Group F 核心反转**（第 1153-1182 行），单个 group 特写，展示「短段 + pull-quote + 第二段 + stat-grid」的 4 拍节奏
3. **三条阅读路径 + OS 对照表**（第 1657-1860 行），展示序章两大核心交互组件的视觉强度
4. **移动端 375px 宽度全屏截图**，验证 path-grid 单列堆叠、mapping-row 响应式降级是否符合预期

截图命令参考（已在项目 `scripts/` 中有类似脚本）：
```bash
node scripts/screenshot-chart.js v2-demos/prologue-kimi-latest.html --out v2-demos/_shots/prologue-kimi --widths 1440,768,375
```

## 7. Opus 决策建议（仅参考）

**我倾向推荐 Kimi 这一版作为 V2 范式的基线候选**，理由：

- **group 结构 100% 命中**用户的核心要求，这是 V2 存在的全部意义
- **token 纪律零违规**，可无缝接入主站
- **24 group 的叙事弧完整**，从 hero 到三条阅读路径到结尾都有呼应
- **stderr 干净、耗时可预测**（11 分钟，与 Harness 先例一致），说明 Kimi 对我设计的 prompt 收敛性好，后续做其他章节可以复用同款 prompt 模板

最终决策需要等 MiniMax 分支产物出来后做 A/B 对比：
- 如果 MiniMax 在 group 结构上有**同样命中**，那就比"图表 placeholder 的低保真预览质量"和"视觉层次丰富度"
- 如果 MiniMax 放弃了 group 结构或做成了 V1 模式，那 Kimi 这一版直接作为基线
- 如果两版都合格，可以考虑做"功能融合"：拿 Kimi 的 group 架构 + 拿 MiniMax 的某些更好的视觉组件拼装

不管选哪版，建议后续都把 `tip-block` 改名为 `cc-plain-talk` 并加 `💡 通俗理解` 前缀，以符合全站写作风格红线。

---

*文件路径汇总：*
- Prompt: `/tmp/prologue-prompt.txt`（30,694 字节 / 534 行）
- HTML（含时间戳）: `v2-demos/prologue-kimi-1775480452.html`（75,767 字节 / 1,939 行）
- HTML（稳定别名）: `v2-demos/prologue-kimi-latest.html`（同上）
- stderr 日志: `v2-demos/_prologue-kimi-stderr.log`（0 字节，无错误）
- 本报告: `v2-demos/prologue-kimi-report.md`
