# Block 2 「反差引入 / 群雄并起」双跑交叉评审报告

> 评审人：Sonnet（Opus 副手）
> 评审时间：2026-04-07
> 评审对象：
> - A. `prologue-block2-kimi-clean.html` (Kimi 主跑，~28.5 KB / 796 行)
> - B. `prologue-block2-minimax-clean.html` (MiniMax 主跑，~22.3 KB / 724 行)
> 评审依据：`handoff/v2-prologue-brief-block2-群雄并起.md` §5（15 项 / 75 满分 / ≥60 合格）

---

## 0. 零信任 grep 守纪体检（OQ1-OQ8 红线）

| OQ | 检查项 | grep 命令 / 期望 | Kimi | MiniMax |
|----|--------|-----------------|------|---------|
| OQ1 | 8 竞品全量铺陈，禁折叠 | `<details>` 必须 0 | ✅ 0 | ✅ 0 |
| OQ2 | 三阶段年份严守原文 | `2023-24` `2025` `2026` 必出；`2022-2023/2023-2025/2025-` 必 0 | ✅ 三年份齐 + 0 错口径 | ✅ 三年份齐 + 0 错口径 |
| OQ3 | 删 OpenClaw / Manus | `OpenClaw` `Manus` 必 0 | ✅ 0 | ✅ 0 |
| OQ4 | 方案 A 时间轴 + 8 竞品 + 方案 B hover；禁方案 C 三维矩阵 | `IDE.*远程.*终端` 必 0 | ✅ 0 + 含 hover-reveal | ✅ 0（无 hover，但未违规） |
| OQ5 | "12 个内置 Subagent" 必出 | grep 命中 | ✅ L790 (`<strong>` 包裹) | ✅ L713 (`<strong>` 包裹) |
| OQ6 | 不出 "disprove" | `disprove` 必 0 | ✅ 0 | ✅ 0 |
| OQ7 | 💡 通俗理解 卡片 + 马具/缰绳/工具能力/安全边界 全字 | 4 词必出 | ✅ L773 全 4 词 | ✅ L701 全 4 词 |
| OQ8 | 不显式标注"伏笔" | `伏笔` 必 0 | ✅ 0 | ✅ 0 |

**Block 1/3/4/5/6/9 禁区数字额外扫描**：`1,884 / 476,875 / 9,000+ / claw-code / harness-books / 引擎盖 / 计算器 / 操作系统 / 83 章 / 36 万字 / 122 图 / 185 Prompt / 34 Harness / 2.1.88 / 4,684 / 让我们开始 / 8000 字 / 6500 字 / 不是。差远了` —— **两份均 0 命中**。

**结论**：两份硬性红线全过，无 0 分项。

---

## 1. Kimi 逐项打分（§5 15 项）

| # | 检查项 | 评分 | 判据 |
|---|--------|------|------|
| 1 | 8 竞品全量铺陈，无折叠 | **5** | grid 8 卡片全列，competitor-card 1-8 类齐全 |
| 2 | 8 竞品产品/公司/特色三栏逐字 | **5** | 与 brief §2.2 A 类逐字一致，无漂移 |
| 3 | 三阶段年份严守 2023-24/2025/2026 | **5** | L731 / L737 / L743 三年份精确 |
| 4 | 套控工程第三拍 active 高亮 | **5** | L742 `timeline-stage active` + L379 brand 渐变 + scale(1.05) + box-shadow，高亮强 |
| 5 | Harrison Chase + LangChain 署名 | **5** | L752 "LangChain 创始人 Harrison Chase 提出的三层架构" |
| 6 | Model + Runtime + Harness 三层架构示意 | **5** | L754-758 trio-architecture 三层堆叠 + ↓ 流向 + harness brand 高亮 |
| 7 | Q6 逐字 | **5** | L764 "harness（套控层）的设计差异决定了产品表现的差异" 完整 |
| 8 | 💡 通俗理解卡 + 马具/缰绳/工具能力/安全边界 | **5** | L767-775，4 词齐全，紧邻 Q6 之下，配 💡 emoji + accent-yellow 左边框 |
| 9 | Q1 逐字 + 块尾 + ≥3xl | **5** | L781 逐字 + block-anchor 上下分隔线 + brand 色 3xl 居中独立成段 |
| 10 | Q2 块首时间锚 + Q3 副标"智能手机大战" | **5** | L617-622，Q2 anchor-quote 2xl + Q3 sub italic |
| 11 | Q4 反差三拍"不做 IDE / 不做 Web / 而是终端" | **5** | L699-703，三拍齐 + brand 箭头连接 + 第三拍完整保留"在终端里构建一个完整的 AI 智能体运行时" |
| 12 | Q5 "唯一一个" + 代价段"界面渲染/文件管理/进程隔离" | **5** | L713 唯一一个三独特属性 + L717 代价段三关键词齐 |
| 13 | Inline-1 Photoshop + Inline-2 黑底白字 | **5** | L708-709 两者皆在，inline-note 小字 |
| 14 | 块尾镜像钩子 "12 个内置 Subagent" | **5** | L789-790 mirror-hook 居中 + 12 数字 `<strong>` 包裹 |
| 15 | 严禁红线全 0 | **5** | OpenClaw/Manus/disprove/8000/6500/三维矩阵/Block 1-9 数字全 0 |

**Kimi 总分：75 / 75（满分）**

---

## 2. MiniMax 逐项打分（§5 15 项）

| # | 检查项 | 评分 | 判据 |
|---|--------|------|------|
| 1 | 8 竞品全量铺陈，无折叠 | **5** | competitor-card 1-8 nth-child 齐 8 张 |
| 2 | 8 竞品三栏逐字 | **5** | 逐字一致 |
| 3 | 三阶段年份 2023-24/2025/2026 | **5** | L652/L658/L664 三年份精确 |
| 4 | 套控工程第三拍 active 高亮 | **4** | L661 `timeline-stage active` + brand 色 dot + glow box-shadow，但 dot 仅 16-20px，高亮强度比 Kimi 弱（无背景填充、无 scale），呼吸位下视觉够，但 active 强度略偏内敛 |
| 5 | Harrison Chase + LangChain 署名 | **5** | L667 "LangChain 创始人 Harrison Chase 将其归纳为 Model + Runtime + Harness 三层架构" + L686 "Harrison Chase 提出 · 三层架构" 双署名 |
| 6 | Model + Runtime + Harness 三层示意 | **5** | L672-685 trio-container 三层堆叠 + 渐变色 |
| 7 | Q6 逐字 | **5** | L692 完整 |
| 8 | 💡 通俗理解卡 + 4 词 | **5** | L696-703 全词齐 |
| 9 | Q1 块尾 + ≥3xl | **5** | L707-709，q1-anchor 3xl 渐变背景圆角独立成段 |
| 10 | Q2 + Q3 副标 | **5** | L548-553 Q2 anchor 2xl + Q3 italic |
| 11 | Q4 反差三拍 | **4** | L623-625 三拍齐，但第三拍精简为"而是终端"，缺"在终端里构建一个完整的 AI 智能体运行时"语势——较 Kimi 弱半分。Brief §2.2 D 类 Q4 给出的精简版即"不做 IDE 插件，不做 Web 应用，而是在终端里构建一个完整的 AI 智能体运行时"，MiniMax 进一步精简了 |
| 12 | Q5 唯一一个 + 代价段 | **5** | L636 + L641 齐全 |
| 13 | Inline-1 + Inline-2 | **5** | L628 / L631 齐 |
| 14 | 镜像钩子 12 个内置 Subagent | **5** | L713 mirror-hook 文末 |
| 15 | 严禁红线全 0 | **4** | 红线 grep 全 0，但 trio-architecture L675 / L679 自加注释"基础大模型 · Claude / GPT-4 / Gemini" / "运行时编排 · LangChain / AutoGPT" —— 这些 LLM 名字不在 brief 必保留事实清单，属于轻度自我虚构（违反 §0 "严禁拿 LLM 自己虚构的产品 / 公司"）。GPT-4 在 2026 已是过时型号也是事实漂移。**-1 分** |

**MiniMax 总分：72 / 75**

---

## 3. 主观评估三项

### (a) 冷静呼吸位 / 视觉冲击力是否显著低于 Block 1 hero？

| 项 | Kimi | MiniMax |
|----|------|---------|
| block-title 字号 | 4xl（与 Brief 建议 4xl-5xl 一致） | 4xl |
| 整体配色 | dark + brand orange 节制点缀，活跃面积有限 | dark + indigo brand + 浅 pastel 8 色块卡片 |
| 呼吸感 | content-section 居中 70ch，section 间留 space-20，呼吸位足 | body max-width 900px，space-12 间距，略紧 |
| 视觉冲击峰值 | active timeline 大色块 + scale + glow（中等强度） | 8 色 pastel 卡片网格（这是全篇最亮的视觉，反而比 active timeline 抢眼） |
| 是否压过 Block 1 hero | ✅ 不压（无大字 hero/无炸点） | ⚠️ pastel 8 色拼图视觉密度偏高，整体明度比 Kimi 高 |

**主观分**：Kimi **8 / 10**（呼吸感更克制，与 Block 1 hero 形成情绪降档）；MiniMax **7 / 10**（pastel 8 色卡片虽然好看，但 8 张高饱和浅色拼贴视觉密度偏高，呼吸位的"冷静"略打折扣，且 pastel 浅色块在 dark 主题下与整体氛围不太协调）。

### (b) 套控通俗解释是否真的"立刻明白"？

两份都用了 OQ7 钦定文案"马具 / 缰绳 / 工具能力 / 安全边界"，逐字到位。
- **Kimi**：harness-tooltip 用 accent-yellow 左边框 + bg-tertiary 背景，💡 + "通俗理解" 加粗 yellow，整体识别度高，紧邻 Q6 之下，物理距离合理。**8.5 / 10**
- **MiniMax**：harness-card 用 surface-secondary 背景，💡 + 通俗理解 brand-bright 色，"工具能力" / "安全边界" 用 accent pink 高亮——这两个高亮反而让"工具能力 / 安全边界"成为视觉中心，强化了概念落点。**8.5 / 10**

两份都解释清楚了，xiaolin 类读者读到此处都能立即建立"马具 = harness"的具象化映射。打平。

### (c) 三阶段时间轴第三拍 active 高亮是否到位？

- **Kimi**：active 用 brand 渐变背景填充 + scale(1.05) + box-shadow + 文字反白 + stage-year 字号升级，**5 重强化**，高亮非常醒目。**9 / 10**
- **MiniMax**：active 仅 dot 从 16px 升 20px + brand 色 + glow box-shadow，label 文字 brand-bright + 字号升半级。强化层次较少（dot 只是个小圆点，整体仍是水平线 + 文字），**3 重强化**。在呼吸位语境下"克制"是优点，但作为 V2 的"第三拍 active 高亮位"略偏内敛。**7 / 10**

### (d) 8 竞品对照表是否真的"全量铺陈不折叠"？

两份都 8 张全列、grid 自适应、`<details>` 0 命中。
- **Kimi**：280px minmax，三栏左对齐，competitor-card 上方 3px brand-accent 条 + hover translateY(-2px) + hover-reveal 反转层（融合方案 B）。**符合 OQ4 方案 A + B 融合**。**9 / 10**
- **MiniMax**：380px minmax（更宽），8 张 pastel 浅色块底色（每张配深色文字以保对比度），左 4px 色条 + hover translateY(-2px)，**未实现 hover 反转卡**。仅完成方案 A 的 pastel coding，**漏掉 OQ4 钦定的方案 B hover 融合技术**。但漏融合未明确扣分项（OQ4 没规定漏 hover -1 分），不影响 §5 计分。**7 / 10**

---

## 4. 选谁 / 拼装

### 总分对比

| 维度 | Kimi | MiniMax |
|------|------|---------|
| §5 15 项硬分 | **75 / 75** | **72 / 75** |
| 冷静呼吸位（主观 0-10） | 8 | 7 |
| 套控解释清晰度（主观 0-10） | 8.5 | 8.5 |
| 时间轴 active 高亮（主观 0-10） | 9 | 7 |
| 8 竞品全量铺陈（主观 0-10） | 9 | 7 |

### Opus 决断建议：**主选 Kimi，无需大拼装**

**理由**：
1. Kimi 满分通过 §5 15 项，MiniMax 因 trio-layer 自加 LLM 注释扣 1 分，因 Q4 第三拍精简扣 1 分。
2. Kimi 在三个主观维度（呼吸位 / 时间轴 active / 8 竞品 hover 反转）都更好。
3. Kimi 完整融合了 OQ4 方案 A + B（pastel coding + hover 反转），MiniMax 只做了方案 A。
4. Kimi 保留了"在终端里构建一个完整的 AI 智能体运行时"完整 Q4 句势，更符合 brief D 类 Q4 精简版逐字。
5. Kimi 的 active timeline 高亮强度配得上"第三拍 active 高亮位"的 brief 期望。

### 可选拼装点（小幅借鉴 MiniMax）

如果时间允许，可以从 MiniMax 借鉴：
- **harness-card 的 accent pink 高亮"工具能力 / 安全边界"** —— MiniMax 把这两个关键词做了二次着色，落点更清晰
- **block-footer 三栏小字脚注**（block-name | 全书第 2 拍 | 2026）—— Kimi 没做底部 footer 收尾
- **trio-layer 渐变色 layer-model/runtime/harness 三色区分** —— Kimi 用纯色（purple/blue/brand），MiniMax 用渐变更现代

**严禁借鉴**：MiniMax trio-layer 的 LLM 注释 (Claude / GPT-4 / Gemini / LangChain / AutoGPT) —— 那是 LLM 自加虚构内容，违反 §0 红线。

---

## 5. 隐患与建议

| # | 隐患 | 严重度 | 建议 |
|---|------|--------|------|
| 1 | MiniMax trio-layer 自加"Claude / GPT-4 / Gemini / LangChain / AutoGPT" 注释 | **中** | 拼装时直接删掉这两行 trio-label，或替换为 brief 已批准的 H 类"工具能力 + 安全边界"那种摘要词 |
| 2 | MiniMax q4-contrast 第三拍精简为"而是终端"，缺"在终端里构建一个完整的 AI 智能体运行时" | 低 | 若选 MiniMax 主体则需补完整句 |
| 3 | Kimi 整体无 footer 收尾元素 | 极低 | 可借鉴 MiniMax footer 三栏，但非必须 |
| 4 | 两份的 mirror-hook"12 个内置 Subagent" 紧贴 Q1 块尾定锚（Kimi 仅 space-12 间距） | 低 | Brief §7 提示"两步要分开放，不要塞成一段"。Kimi 用 mirror-hook 卡片包裹独立成段，MiniMax 用文末居中 + border-top 分隔，**两份都做到了"分开"**。但 Kimi 的 mirror-hook 卡片背景偏重，可考虑改为更轻量的 border-top 处理（借鉴 MiniMax） |
| 5 | MiniMax 的 8 pastel 卡片在 dark 主题下视觉密度偏高 | 中 | 已选 Kimi，本隐患不影响最终方案 |
| 6 | 两份均无 OQ4 钦定的"hover 反转卡"中的"1 句话定位"完整文案——Kimi 的 hover-reveal 只有简短两行（如"IDE 原生集成 / Agent Mode 领跑"） | 低 | 这是次要增强，brief §5 没单独打分。可在最终融合时为每张卡补一句更完整的定位 |

---

## 6. 简短报告（≤200 字）

(a) **Kimi 总分**：75/75（§5 满分，硬性 0 漂移）
(b) **MiniMax 总分**：72/75（trio-layer 自加 LLM 注释 -1，Q4 第三拍精简 -1，时间轴 active 高亮强度略弱 -1）
(c) **冷静呼吸位主观**：Kimi 8/10（克制，与 Block 1 形成情绪降档）；MiniMax 7/10（pastel 8 色拼图视觉密度偏高）
(d) **选谁/拼装**：**主选 Kimi**，可小幅借鉴 MiniMax 的 harness-card 二次着色 + block-footer 收尾，**严禁**借鉴 MiniMax trio-layer LLM 注释
(e) **隐患**：MiniMax trio-layer 自加 "Claude / GPT-4 / Gemini / LangChain / AutoGPT" 是 LLM 虚构 - 拼装时必须剥离

---

*Review by Sonnet on 2026-04-07 — 零信任 grep 守纪 + §5 15 项逐项打分 + 4 主观维度交叉评估 + 拼装建议。*
