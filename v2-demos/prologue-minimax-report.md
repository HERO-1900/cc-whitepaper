# V2 范式探索 · 序章 Demo · MiniMax 版本评审报告

> 任务：用 MiniMax M2.7 试制一个"章节即网页"的 V2 序章 Demo，供 Opus 判断是否走 V2 范式。
> 完成时间：2026-04-06

---

## 1. 产出文件

| 文件 | 路径 | 大小 |
|---|---|---|
| Demo HTML | `/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/prologue-minimax-1775480716.html` | 41 KB / 1374 行 |
| 原始 stream JSONL（含 thinking） | `/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/prologue-minimax-1775480716.jsonl` | 119 KB |
| MiniMax prompt | `/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/_minimax-prompt.txt` | 6.7 KB |
| 本报告 | `/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/prologue-minimax-report.md` | — |

**结构核对**：1 个 `<!DOCTYPE>`，10 个 `<h2>`（10 个 §），15 个 `<iframe>`（覆盖 0.1-A 到 0.5-A 全部 15 个图表占位符），1 个 sticky `<nav>`，1 个 `data-theme` toggle 按钮，2 个 responsive 断点（768/480）。

**调用成本**：MiniMax M2.7 单次 Headless 调用，输出 21,457 tokens，$0.407。

---

## 2. 设计亮点（3 条）

1. **§4「数字震撼」做出了 Hero 级冲击力**：四个 KPI 卡片（1,884 / 476,875 / 40 / 98）用 `var(--cc-font-size-6xl)` 巨号铺开，配合一句"不是聊天机器人，是一个为 AI 智能体设计的操作系统"的紧随论断 → 自然衔接 0.1-A 源码统计仪表盘 + 0.1-B 英雄架构图。这是全页面"hook 最强"的 group。

2. **§8「三条阅读路径」是真正的视觉模块**：三张并排 large card（CS 学生 / 高级工程师 / 创业者&PM），每张配 SVG icon、目标读者、推荐路径链、CTA 按钮。这是用户原话强调的"hero 级模块"，MiniMax 准确理解并落地了。

3. **§2 三阶段时间轴 + §9 五大比喻家族列表**：把"Prompt Engineering → Context Engineering → Harness Engineering"做成横向时间轴并高亮当前阶段；把五大比喻家族做成 SVG icon + 标题 + 一句话的纵向列表。两者都是 V1 不会有的"内容即视觉"的实例。

---

## 3. 与 V1 的对比（3 条）

1. **章节内"分组推进"已实现**：V1 是"4000 字正文 → 文末 15 张图表"；V2 Demo 是 10 个 §section，每个 section 自带 h2 + 段落 + 图表卡（如有）。读者不需要"读完才看图"——读到 §4 立即看到源码统计图，读到 §6 立即看到 OS 类比相关的 8 张图。**这一条达到了用户的核心要求**。

2. **视觉层次比 V1 丰富一个数量级**：V1 只有 h1/h2/p/table/img；V2 Demo 引入了 KPI grid、引言块（quote-block）、时间轴、part 卡片网格、reading-path 卡片、metaphor 列表、chart-card（带 chart-id chip + title + caption）。视觉信息密度明显提升。

3. **导航和主题切换是 V1 没有的**：sticky top nav 含 7 个章节锚点 + 暗/亮主题切换按钮（带太阳/月亮图标 toggle），整页 scroll-behavior: smooth。V1 完全没有章节内导航和单页内主题切换。

---

## 4. 是否符合用户「子标题 → 段 → 图」group 标准？（关键评估）

**答案：部分符合。** 详细审计如下：

**符合的部分（达成）**：
- §1 误解、§2 坐标系、§3 生态、§4 数字、§5 内容、§7 路线、§8 路径、§9 比喻、§10 声明 都遵循 "h2 → 段落 → （如有图表） chart-card"。
- §4、§5、§7 都是先 1-2 段文字铺垫再嵌入 1-2 个图表，符合"小段话引出图表"的节奏。

**不符合的部分（regression）**：
- **§6「OS 类比」：8 张图表连续堆叠**，没有任何穿插段落。MiniMax 把所有 0.3-* 图表（工具目录 / 安全模型 / 权限对照 / MCP / 配置 / Hook / 扩展 / 模块依赖）一口气放在同一段过渡句之后。这部分仍然是"先一段话再堆图"的 V1 旧模式，只是规模缩小到一个 section 内。

**根因诊断**：原始序章 markdown 在 §6 这部分本身就是连续 6 个图表占位符夹在 OS 表格行之间，MiniMax 把 markdown 表格压缩成了 6 个 OS 概念卡片（PROCESS / FILESYSTEM / NETWORK_IO / SECURITY_SANDBOX / PACKAGE_MGR / EVENT_LOOP），但没有把每张图表"翻译"成对应概念旁边的解释段落。要真正达到"每张图都有自己的子标题和小段话"，需要在 prompt 中显式要求 §6 拆成 8 个 sub-group。

**结论**：V2 范式的可行性已被 demo 证明（其他 9 个 section 都做对了），但 prompt 还需要一条强约束："如果一个 section 有多张图表，必须给每张图都配一个 sub-h3 + 一段≤80 字的解释，禁止图表连续叠放"。

---

## 5. 不足或风险（2 条）

1. **Token 系统使用是"伪合规"**：HTML 在 head 引用了 `../test-viz/cc-design-tokens.css`，但在 `<style>` 块里又自己重新定义了同名变量（`--cc-bg-primary` / `--cc-text-primary` / `--cc-brand` 等），实际渲染走的是它自定义的颜色（紫色 #5B5FE8），而不是项目 token 的蓝色 #58a6ff。**这意味着如果项目 token 改了，Demo 不会跟着改**——失去了 token 化的意义。修复方案：要求 MiniMax"禁止在 :root 里重声明任何 --cc-* 变量，必须直接消费 cc-design-tokens.css 已暴露的 246 个变量"。

2. **少量内容漂移 / 幻觉**：
   - MiniMax 在 §1 里把"Harness Engineering"宣布为"理解 Claude Code 的核心"，但原始序章只是把它列为行业演进的第三阶段，没有这种宣言。
   - §1 凭空写了"2023 年秋，Claude Code 刚发布时"——原 markdown 没有这个时间点。
   - §4 KPI 文字里把"40 个工具"写成与原文一致，但下面解释又说"40 个核心工具函数" + "98 个斜杠命令的设计逻辑"，把原文的"内置工具"说成"工具函数"，术语精度有微小折损。
   - 这类幻觉量不大但确实存在。如果直接当线上稿，需要 Sonnet 做一遍"原文 vs Demo 文字"比对清洗。

---

## 6. 技术坑位记录（供 SOP 沉淀）

调用 MiniMax M2.7 headless 生成长 HTML 时遇到一个**之前 SOP 没有记录的故障模式**：

- **现象**：用 `claude -p ... --output-format text` 调用 MiniMax 生成 ~60KB HTML，命令挂起 12+ 分钟无任何输出，最终需要手动 kill。
- **根因**：MiniMax M2.7 在 stream-json 模式下被发现实际上**调用了 Write 工具**（用 empty input），并陷入"Write 失败 → thinking → 再次 Write empty"的死循环。`--output-format text` 模式下这些事件被吞没，看不到任何反馈。
- **修复**：必须同时做两件事：
  1. 加 `--disallowedTools "Write Edit Read Bash Glob Grep NotebookEdit MultiEdit"` 把所有文件类工具关掉，强制模型走纯文本输出。
  2. 在 prompt 末尾用大写警告"严禁调用任何工具，只能输出纯文本响应"。
  3. 优先用 `--output-format stream-json --verbose`，可以在 30 秒内看到 thinking trace 是否在前进，避免盲等。
- **建议沉淀到** `web/SOP.md` 的"故障模式速查"。

---

## 7. 给 Opus 的结论

V2 范式**值得继续做**。Demo 已经证明：
- 文图融合的 group 结构在工程上完全可行；
- "三条阅读路径"这种过去做不了的 hero 模块可以靠 V2 范式实现；
- KPI 大数字 + 引言块 + 时间轴这些视觉元素能显著提升序章吸引力。

但**直接采用此 Demo 上线还不够**，至少需要：
1. 修复 §6 的"8 张图连续堆叠"，强制拆成 sub-group。
2. 修复 token 体系的"伪合规"问题。
3. 让 Sonnet 跑一轮原文-Demo 内容比对，清掉幻觉/术语漂移。
4. 与 Kimi 平行版本（`prologue-kimi-1775480452.html`，75 KB）做交叉评审，挑出更优结构。

建议 Opus 以"两个候选 + Sonnet 做内容清洗 + Sonnet 做 token 修正"的方式推进，不要直接采用任何一个原版。
