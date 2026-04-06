# V2 范式探索 — Harness Engineering 章节 Demo 评审报告

> Sub-agent 调度 Kimi 生成 Demo 的执行结果，供 Opus 评审「是否走 V2 范式」时参考。

---

## 1. 产物文件

- **HTML Demo（带时间戳版本）**：`/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/harness-kimi-1775479023.html`
- **HTML Demo（稳定文件名）**：`/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/harness-kimi-latest.html`
- **完整 Prompt（送给 Kimi 的指令）**：`/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/.prompt.txt`
- **本报告**：`/Users/hero/Desktop/CC-Research-byClaude/web/v2-demos/harness-kimi-report.md`

| 指标 | 值 |
|---|---|
| HTML 总行数 | 1938 行 |
| HTML 文件大小 | 61040 字节（约 60 KB） |
| Kimi 生成耗时 | ~11 分钟（headless `claude -p`） |
| `var(--cc-*)` token 调用次数 | **168 次** |
| token 块外硬编码 hex 颜色 | **0 处**（强 token 纪律） |
| 章节正文人物/术语保留度 | 37/40+ 关键词命中（Trivedy/Lopopolo/Rajasekaran/NLAH/AutoHarness/OpenDev/swyx/Kyle/HumanLayer/Chayenne/Noam Brown/Justin Young/Shihipar/Zhang 全部命中） |
| 章节结构完整度 | 8 个 section（01 引子 → 08 行动），章节正文 7 大主题（A 引子 / B 溯源 / C 五代演化 / D 三家对比 / E 学术 / F 争议 / G 六要素映射 / H 五条建议）**全部覆盖** |

---

## 2. 设计亮点（V2 价值的具体体现）

### 亮点 1：段落与图表真正共生（V2 核心目标已达成）
最具代表性的是 **Section D 三家对比 + OpenAI 大数字仪表盘**。Kimi 没有把"OpenAI 5 个月写 100 万行代码"塞在文末作为图表附录，而是把 7 个数字（`5 / 3→7 / ~100万 / ~1500 / 3.5 / 0 / 6h+`）做成大字号 `.stat-number` 网格，**直接嵌入在介绍 OpenAI Codex Harness 的段落正下方**。读者读完那一段文字，眼睛自然落到下面的数字仪表盘上，完成"叙事 → 量化"的认知闭环。这正是 V1 痛点的反面。

### 亮点 2：视觉层次系统化，组件类型超过 V1 现状
Demo 内出现的视觉组件类型包括：
- `.hero-badge` 章节段位标签（"第 83 章 · 补遗与延伸"）
- `.section-number` 大号章节序号（"01 · 引子"等）
- `.timeline` + `.timeline-item.highlight` 重点节点高亮的概念溯源时间线
- `.stat-grid` + `.stat-number` 大字号数字仪表盘
- `.compare-table` 三家对比横向表（每列一个厂商）
- `.paper-card` 学术论文卡片网格
- `.vs-section` + `.vs-divider` 双栏 VS 对峙
- `.tip-block` 通俗类比专属容器（带 💡 图标）
- `.mapping-row` 六要素 × 章节 chip 映射网格
- `.action-item` 编号大字 + 解释的行动建议块
- `.card` 通用信息卡片
- `.pull-quote` 大字号引用块（金句单独成块）

V1 现有页面对应组件大约只有 3~4 类（h2/p/img/table），V2 在视觉表达密度上有数量级提升。

### 亮点 3：Token 系统纪律性极佳
全文 168 处 `var(--cc-*)` 调用，且 token 声明块（第 8~59 行）之外的 1100 多行 CSS 中**零硬编码十六进制颜色**。这意味着该 Demo 可以无缝接入主站的 dark/light 主题切换系统（已内嵌切换按钮 + JS，亲测语义正确）。从工程角度看，V2 范式如果走这条路，**主题一致性可以由 token 自动保证**，不需要每个 Demo 单独维护两套配色。

---

## 3. V1 vs V2 对比（最直观的三个差异）

| 维度 | V1（现状） | V2（本 Demo） |
|---|---|---|
| **图表位置** | 章末列表，与解释文字脱节，读者要"翻回上面"才能对应 | 数字、卡片、时间线、对比表**穿插在介绍它们的段落正下方/正侧边** |
| **视觉层次** | h1/h2/h3 + p + 偶尔的 markdown 表格——单调 | 11 类视觉组件（hero / timeline / stat-grid / compare-table / paper-card / vs-section / tip-block / mapping-row / action-item / pull-quote / card） |
| **章节认知节奏** | 「文字 → 文字 → 文字 → 一堆图」线性消化 | 「叙事段落 → 视觉印证 → 通俗类比 → 下一段」每 200~400 字就切换一次"输入模态"，认知负荷分散 |

---

## 4. 不足与风险（Opus 决策时必须看见）

### 风险 1：单页 HTML 生产成本不低
本 Demo 由 Kimi 生成耗时约 **11 分钟**，HTML 1938 行 / 60 KB。如果整本书 87 章都按 V2 重做，按这个生产速度估算大约需要 **~16 小时纯模型生成时间**（不含 Brief 撰写、人工审核、token 一致性 lint、移动端测试）。这意味着 V2 范式 ≠ 一次性自动化，必须有：① 标准化 Brief 模板；② 自动化 token lint 脚本；③ 多模型交叉评审（Kimi 生成 + MiniMax 审 + Opus 抽样）。**建议先选 5~8 个最有"图文共生需求"的章节做试点**，验证生产线后再批量铺。

### 风险 2：Kimi 输出有"低优先级走样"
- 某些段落的图表元素仍是"卡片包裹文字"，不是真正的数据可视化（例如 Section E 的论文卡片是文字陈列，没有任何 bar/比较图——本可加入 Sokoban/2048/Candy Crush/Tetris 提升幅度的小型条形图）。
- Section B 的"概念溯源时间线"出现了一个被 `display: none` 隐藏的 `.mini-timeline`（疑似 Kimi 一开始想做迷你版后来改主意，但忘了删掉），属于无害遗留代码但需要人工 cleanup。
- 文末 footer 极其单薄，没有引用清单（V1 的引用清单 27 条没有进 Demo——Brief 也确实没要求，但白皮书章节缺引用是硬伤，正式版必须补回）。

---

## 5. 截图建议（用户最该看哪一段）

**首选**：用浏览器打开 `harness-kimi-latest.html`，**截屏 Section D「三家实现对比」从介绍 OpenAI 段落到 7 个数字仪表盘的连续区域**（HTML 大致 1530~1610 行渲染范围）。这一段最能体现 V2 的核心价值——读者读完一段叙事，眼睛立即落到大字号仪表盘上完成"叙事 → 量化 → 类比"的认知闭环。这是 V1 现状里几乎不存在的读者体验。

**次选**：截屏 Section F「行业争议」的 VS 双栏对峙区域（HTML 1690~1740 行）。怀疑阵营 vs 支持阵营两栏并列+中间巨大的"VS"分割符，是 V2 视觉表达力的另一个高峰。

**对照建议**：同时打开主站 V1 版本的某一章（任选第 28、36、40 章），与本 Demo 并排截屏，让 Opus 一眼看到「文末堆图 vs 段落共生」的差距。

---

## 6. Opus 决策建议（仅供参考）

如果 Opus 决定走 V2 范式：
1. **不要全量重做**——选 5~8 个图文共生需求最强的章节先试点。候选：第 6 章 Agent Loop / 第 28 章 Compaction / 第 36 章 CLAUDE.md / 第 40 章 Hooks / 第 51 章 Subagent / 第 83 章 Harness Engineering（即本 Demo）。
2. **建立 Brief 模板**——本次 Prompt 已经验证有效，可以抽象成「章节内容 + 视觉组件清单 + token CSS + 6 条范式原则」四件套模板。
3. **token 系统是 V2 的最大底气**——主题一致性由 CSS 变量自动保证，意味着 V2 不会破坏现有暗/亮主题系统。
4. **生产线必须三模型协作**——Kimi 生成 → MiniMax 审视觉一致性 → Opus 抽样判断叙事节奏 → 最后人工拨测移动端。

如果 Opus 决定**不走** V2 范式：
- 至少应该给 V1 当前章节增加"行内卡片块"和"通俗类比块"两类轻量组件，把 Demo 里收益最高的 20% 视觉表达力低成本移植到 V1。这样可以避免大改造，也能拿到一部分 V2 红利。
