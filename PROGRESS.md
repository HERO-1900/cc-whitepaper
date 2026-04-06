# Claude Code 源码白皮书 — 项目进度追踪

> 📌 [黄金资产索引](handoff/golden-assets-index-2026-04-06.md) — 11 件高价值文件全收录，每次写 Brief 前先查，防止重复劳动或遗漏已有资产

> 最后更新：2026-04-07 07:25 — 自主值班轮 #4（终端 #3 凌晨 02:13-07:25，**5 小时 12 分钟**）：🎉 **V2 序章 11/11 全部完成 + 整体评审 9.9/10 + 11/11 toggle 全完整** 🎉。13 atomic commit + 11 块 final HTML + P0/P1/P2 全修完 + **11 块 toggle 一致性 100% 达成**。**Sonnet 副手 38+ 次调度**。最后一轮（Round 13）给 Block 7a/7c/8 做完整 toggle 修复（CSS 结构性转换 @media → [data-theme="light"] + 保留 @media 作 OS 偏好兜底 + 加 toggle button + JS）。剩 11 块 token 命名拉齐 (12h, 3 PR 分批) + Block 6 0.3-A 工具卡 8→43 (需用户提供 SoT) + 网页拼装。

## 项目概况

| 指标 | 数据 |
|------|------|
| 总章节 | 83 章（含 Harness Engineering 第 83 章 ✅ 2026-04-06 入库） |
| 总字数 | 360,583 CJK 字符（QA 复测 2026-04-07） |
| QA Issues | 0 errors（3 warnings + 1 info：references / ch83 新章预期内）+ search-index 完整性 ✅ 83/83 |
| 完整度 | 83/83 = 4.95/5 avg |
| 图表进度 | 122/121 生产覆盖 ✅（122 HTML / 121 brief，VIS-0-002 有 B 变体）+ 105/122 placeholder 内联（B 路径 UI 已禁用，待 V2 范式重做）；4 张 v2 升级版在 simple/ 待用户决策是否替换 v1 |
| 工作区清洁度 | ✅ 142.5 MB 归档（sandbox-astro-spike + test-viz-revisions + test-viz-_archive）+ 7 空文件删除，详见 archive/_archive-log-2026-04-06.md |
| V2 序章阶段 | 阶段 2.6 ✅ → **阶段 2.7 (11 块 toggle 100% 一致, 9.9/10)** ✅ → 阶段 3 (token 拉齐 + 0.3-A 43 工具卡 + 网页拼装 + 上线) ⏸ |
| 主题系统 | 暗/亮/auto 三态切换器 ✅（FOUC 防御 + localStorage 跨 Tab 同步） |
| Design Tokens | 246 个 `--cc-*` 变量 ✅（atomic + semantic 两层架构） |
| 源码统计 | 1,902 文件 / 512,695 LOC 全量扫描完成 |
| 网站地址 | `http://localhost:8080` (本地) / `https://hero-1900.github.io/cc-whitepaper/` (线上) |

---

## 一、内容质量（最高优先级）

### David 评审覆盖率

| 章节 | 评审分 | 修复状态 | 修复数 | 关键修复 |
|------|--------|----------|--------|----------|
| ch01 代码地图 | — (小张评审) | ✅ 已修 | 6 | main.tsx行数、Tool.ts接口、数据流注释 |
| ch02 启动序列 | 3.4/5 | ✅ 已修 | 7 | Pre-import结构、git命令列表、preAction hook |
| ch03 提示词工厂 | 3.7/5 | ✅ 已修 | 4 | DYNAMIC_BOUNDARY条件、CLAUDE.md位置、两层缓存 |
| ch04 查询循环 | — (多轮评审) | ✅ 已修 | 1 | 部分JSON解析说明 |
| ch05 工具运行时 | 3.6/5 | ✅ 已修 | 5 | 并发模型、MCP措辞、ToolSearch |
| ch06 Agent编排 | 3.6/5 | ✅ 已修 | 7 | 四阶段命名、verificationAgent、CacheSafeParams |
| ch07 安全架构 | 2.8/5 | ✅ 已修 | 12 | Prompt Injection新章、Iron Gate、竞品扩展 |
| ch08 状态与持久化 | 3.8/5 | ✅ 已修 | 7 | Zustand类比、AppState字段、Team Memory |
| ch09 扩展生态 | 3.2/5 | ✅ 已修 | 6 | 传输协议重分类、Hook事件表、文件路径 |
| ch10 Token经济学 | 3.6/5 | ✅ 已修 | 5 | 价格声明、缓存范围、过度声索 |

**Part 2 全部 10 章已完成 David 评审 + 修复。**

### Part 3 David 评审（23章 ✅ 全部完成 2026-04-04）

关键修复：权限系统(bypassPermissionsKillswitch/竞品表)、MCP(WAL→COW/供应链安全)、
Hooks(exit 2/跨章命名)、插件(109→460行)、遥测(3→5通道)、CLAUDE.md(@include/Managed)等。

### Part 4 David 评审（5章 ✅ 全部完成 2026-04-04）

关键修复：多层防线(Layer4/5互斥/Fail Closed)、可观测性(Datadog/采样策略)等。

### Part 5 David 评审（3章 ✅ 全部完成 2026-04-04）

关键修复：系统代价(140→272行/Vendor Lock-in/ANT-ONLY扩展3x)等。

### 全书质量改进（已完成）

- [x] 过度声索全局扫描（首创/唯一/独有/最令人惊叹等 → 限定范围表述）
- [x] Part 3 全部 23 章 💡通俗理解 格式统一
- [x] Markdown 表格格式修复（4处）
- [x] 占位符清理（XXX → 具体描述）
- [x] 跨章数字一致性验证（43工具、2.1.88版本等）
- [x] data.js 章节文件路径验证（74/74 全部正确）
- [x] Part 3/4/5 全部 31 章 David 评审 + 修复（2026-04-04）
- [x] 跨章命名一致性修复（Q10 hooks 名称 → 源码一致）
- [x] GTok 单位修正（5个文件）
- [x] 行业标准做法标注（SHA256/FIFO/fail-closed 等不再标为创新）
- [x] 文科生视角全书审读 ✅ 2026-04-05（5份审读报告：Part0+1/Part2/Part3/Part4/Part5）
- [x] 基于审读报告的可读性修复 ✅ 2026-04-05（约50处修改，覆盖全书6个Part）
  - 术语首次出现加注解（工具调用、子Agent、传输协议、原子写入、分布式、类型系统等30+术语）
  - 比喻后增加过渡语（避免"好比喻后立刻堆砌技术词"）
  - 代码块前加铺垫说明（"这段代码的作用是..."）
  - 技术类比替换为日常生活类比（Spring FilterChain→医院检查站、OSI七层→同事各管一摊等）
  - 数字加参照系（36.8GB≈两台笔记本内存、92.7%→61%用话费比喻翻译）
- [x] References引用致谢页 ✅ 2026-04-05（21位社区贡献者+28个开源项目）

### 待做

- [x] ~~Part 3/4/5 David 评审~~ ✅ 2026-04-04 完成
- [x] 竞品信息更新 ✅ 2026-04-04（Gemini Deep Research 调研 + 全书 Tier 0/1/2 竞品描述更新）
- [x] 深度问答部分（25个Q）的技术准确性抽查 ✅ 2026-04-04（准确率 92%，修复 Q05/Q09/Q12/Q23/Q24）
- [x] 跨章"九步→十步"一致性统一 ✅ 2026-04-04（9文件31处修改，全书统一为"十步"）
- [x] 图表第一轮修订 ✅ 2026-04-05（24/24图表v2完成+MiniMax评审）
- [x] 图表第二轮修订 ✅ 2026-04-05（10个低分图表v3修订，8/10有改善，优3/良9/中8/差4）
- [ ] 图表人工干预（4个<12分图表因SVG复杂度达到Kimi自动生成瓶颈）
- [x] 图表嵌入网站系统 ✅（chart-embed.js + 83/84占位符已匹配，图表文件全部可访问）
- [x] 每章Q&A问答对生成 ✅ 2026-04-05（73章316对，5个JSON文件全部完成并验证）
- [x] 难度标注+术语注释系统 ✅ 2026-04-05（glossary 30术语 + difficulty 49章评级 + 前端tooltip/星标/Q&A面板）
- [x] 移动端响应式适配 ✅ 2026-04-04（导航栏+全页面深度适配，120+条CSS规则）
- [x] 远程访问方案 ✅ 2026-04-04（蒲公英远程桌面）
- [x] 全文搜索 ✅ 2026-04-04（74章/1515段落索引，正文+标题搜索）

---

## 二、可视化/图表系统

### 状态：✅ 123/123（part3_new 7 张图表 2026-04-06 18:10 全部入库）

### 简化管线 (chart-pipeline-simple.sh)

2步流程：Kimi 生成（含 frontend-design skill）→ MiniMax 评审（5维度/20分）
- 生成脚本: `scripts/chart-pipeline-simple.sh`
- 批量脚本: `scripts/chart-batch-produce.sh`
- 产出目录: `test-viz/production/{html,reviews}/`
- 旧管线已归档: `test-viz/_archive/pipeline_v2/`

### 多模型子 Agent 系统

| 模型 | 角色 | 调用方式 |
|------|------|----------|
| Kimi | 图表 HTML 生成（含 frontend-design skill） | claude -p headless |
| MiniMax M2.7 | 图表质量评审（5维度打分/20） | claude -p headless |
| Opus | 协调调度 + Brief编写（不生成图表） | 主进程 |

### 生产进度

| 分区 | 总数 | 已完成 | 进度 |
|------|------|--------|------|
| Part 0 (overview) | 15 | 15 | ✅ 100% |
| Part 1 | 11 | 11 | ✅ 100% |
| Part 2 (arch) | 34 | 34 | ✅ 100% |
| Part 2 (QA) | 22 | 22 | ✅ 100% |
| Part 3 | 17 | 17 | ✅ 100% |
| Part 4 | 10 | 10 | ✅ 100% |
| Part 5 | 5 | 5 | ✅ 100% |

质量分布：平均 ~13/20，范围 10-19/20
低分图表（≤11）需关注：VIS-2A-021(10), VIS-2Q-011(10), VIS-3-007(10), VIS-1-008(11), VIS-2A-034(11), VIS-3-011(11), VIS-3-012(11), VIS-3-017(11), VIS-4-005(11), VIS-4-010(11), VIS-5-002(11)

### 图表修订（用户审阅反馈 → v2/v3）

状态：✅ 两轮修订完成（v2全覆盖 + v3对10个低分图表二次修订）
- 修订管线: `scripts/chart-revision.sh` (v2), `scripts/chart-revision-v3.sh` (v3，含MiniMax评审反馈)
- 产出目录: `test-viz/revisions/VIS-*_MMDD_HHMM/`
- 反馈文件: `test-viz/revisions/feedback/VIS-*.txt`（23个，用户原始评论完整保留）
- 用户审阅范围: VIS-0-001 ~ VIS-1-011（剩余 VIS-2A ~ VIS-5 待审）

**修订进度明细（2026-04-05 04:40 — 两轮修订完成）：**

| 图表ID | 最佳版本 | 行数 | 评分/25 | 等级 | 变化 |
|--------|----------|------|---------|------|------|
| VIS-0-001 | v2 | 505 | 11/25 | 差 | v3(10)退步，保留v2 |
| VIS-0-002 | v2 | 651 | 20/25 | 优 | ✅ 可用 |
| VIS-0-003 | — | — | — | — | 无用户反馈 |
| VIS-0-004 | v2 | 839 | 7/25 | 差 | v3(3)退步，需人工干预 |
| VIS-0-005 | v2 | 972 | 17/25 | 良 | ✅ 可用 |
| VIS-0-006 | v2 | 1109 | 23/25 | 优 | ✅ 可用 |
| VIS-0-007 | v3 | 574 | 12/25 | 中 | v2(10)→v3(12) +2 |
| VIS-0-008 | v2 | 637 | 16/25 | 良 | ✅ 可用 |
| VIS-0-009 | v2 | 847 | 12/25 | 中 | 待改进 |
| VIS-0-010 | v2 | 1074 | 17/25 | 良 | ✅ 可用 |
| VIS-0-011 | v2 | 1231 | 18/25 | 良 | ✅ 可用 |
| VIS-0-012 | v2 | 1241 | 13/25 | 中 | 待改进 |
| VIS-0-013 | v2 | 489 | 14/25 | 中 | 待改进 |
| VIS-0-014 | v2 | 518 | 17/25 | 良 | ✅ 可用 |
| VIS-1-001 | v3 | 520 | 12/25 | 中 | v2(8)→v3(12) +4 |
| VIS-1-002 | v3 | 591 | 9/25 | 差 | v2(8)→v3(9) +1 |
| VIS-1-003 | v2 | 461 | 17/25 | 良 | ✅ 可用 |
| VIS-1-004 | v3 | 547 | 11/25 | 差 | v2(9)→v3(11) +2 |
| VIS-1-005 | v2 | 597 | 14/25 | 中 | 待改进 |
| VIS-1-006 | v3 | 590 | 16/25 | 良 | v2(11)→v3(16) +5 ✅ |
| VIS-1-007 | v2 | 1039 | 15/25 | 良 | ✅ 可用 |
| VIS-1-008 | v3 | 709 | 14/25 | 中 | v2(7)→v3(14) +7 |
| VIS-1-009 | v3 | 974 | 16/25 | 良 | v2(11)→v3(16) +5 ✅ |
| VIS-1-010 | v2 | 742 | 13/25 | 中 | 待改进 |
| VIS-1-011 | v3 | 807 | 21/25 | 优 | v2(11)→v3(21) +10 ✅ |

**质量统计（最佳版本）：** 优(≥20): 3 | 良(15-19): 9 | 中(12-14): 8 | 差(<12): 4
**v3 提升效果：** 8/10低分图表有改善，平均提分+3.6，最高+10(VIS-1-011)
**遗留问题：** 4个图表(<12分)因SVG坐标/复杂布局问题，Kimi自动生成达到瓶颈，需人工干预
**下一步：** VIS-2A~VIS-5 待用户通过 Review Mode 审阅后进入修订流程

---

## 三、网站工程系统

### 已完成

- [x] 章节阅读器（markdown渲染 + highlight.js）
- [x] 目录搜索
- [x] 键盘导航（←→翻页、1/2切换视图）
- [x] Agent Loop 11步动画
- [x] 工具分类网格
- [x] 命令目录（公开+门控分离）
- [x] 隐藏功能卡片
- [x] 架构探索器（TreeMap 钻取）
- [x] 比喻切换（城市/OS）
- [x] Blockquote 颜色分类（🌍金/📚紫/💡绿/🔑蓝/⚠️红）
- [x] 表格水平滚动支持
- [x] 阅读进度条
- [x] URL hash 深度链接
- [x] 数据流标签页
- [x] 修订模式系统 ✅ 2026-04-05（review-mode.js + CSS样式完成，图表审阅评论+画廊视图+changelog追踪+导出功能）
- [x] 图表画廊与闭环审阅系统 ✅ 2026-04-05（gallery.js + batch-revision.sh）
  - 114张图表网格画廊（评分/评论/标记待修）
  - 批次反馈提交（JSON导出→剪贴板/下载）
  - 后端批量修订管线（读取反馈→Kimi修订→MiniMax审查）
  - Before/After对比 + 版本历史追踪
  - 键盘快捷键 3 直达画廊

### 待做

- [x] 图表嵌入系统 ✅（chart-embed.js可折叠iframe嵌入+拖动缩放+全屏查看，83个图表映射正常）
- [x] 移动端响应式适配 ✅ 2026-04-04（导航栏纯图标模式+全页面120+条规则）
- [x] 全文搜索 ✅ 2026-04-04（build-search-index.js → search-index.json，74章1515段）
- [ ] PWA 离线支持（可选）
- [x] GitHub Pages 部署 ✅ 已上线 https://hero-1900.github.io/cc-whitepaper/

---

## 四、QA 系统

- 自动检查脚本：`scripts/qa-check.js`
- 输出：`qa-report.md` + `qa-report.json`
- 当前状态：75/75 章 5/5 完整度，0 issues（references.md的3个warning是预期行为）

### 新增数据资产 (2026-04-05)

| 文件 | 内容 | 状态 |
|------|------|------|
| `book/_shared/glossary.json` | 30个核心术语表（定义+日常比喻+首次出现位置） | ✅ 完成 |
| `book/_shared/difficulty-ratings.json` | 49章难度评级（1-5星+最佳比喻标注） | ✅ 完成 |
| `book/_shared/qa-part0-1.json` | Part0+1 Q&A：4章34对 | ✅ 完成 |
| `book/_shared/qa-part2-arch.json` | Part2架构篇 Q&A：13章68对 | ✅ 完成 |
| `book/_shared/qa-part2-qa.json` | Part2深度问答篇 Q&A：25章97对 | ✅ 完成 |
| `book/_shared/qa-part3.json` | Part3子系统篇 Q&A：23章69对 | ✅ 完成 |
| `book/_shared/qa-part4-5.json` | Part4+5 Q&A：8章48对 | ✅ 完成 |
| `js/glossary.js` | 前端：术语tooltip + 难度星标 + Q&A折叠面板 | ✅ 完成 |
| `book/references.md` | 引用致谢页（21位社区贡献者+28个开源项目） | ✅ 完成 |

---

## 五、评审体系

### Persona 定义

| Persona | 角色 | 文件 |
|---------|------|------|
| David Chen | AI 基础设施 CTO | `scripts/personas/expert-pm-1.md` |
| 小张 | CS 大三学生 | (之前会话中使用) |
| 小林 | 中文系大三（零技术背景）| `handoff/readability-audit/` 5份报告 |

### 文科生审读 (2026-04-05)

覆盖全书6个Part共18+章（每章前150行）。三大共性发现：
1. **比喻射程短**：💡框的比喻好，但框结束后正文立刻回到高密度技术词
2. **术语首次出现不解释**：5份报告累计标记100+术语在首次出现时无注解
3. **代码块缺铺垫**：多数代码块前无"你应该看什么"的引导

最佳比喻排名：记忆系统的"私人秘书" > 多层防线的"机场安检" > Token的"手机话费" > MCP的"USB转接口"

修复：已对15个章节做~50处修改（术语注解、比喻过渡、代码铺垫、数字参照系）

### 评审报告存档

`scripts/reviews/` 目录下：
- Part 2: expert-pm-1_02 ~ _10（10章）
- Part 3: expert-pm-1_p3_01 ~ _17 + 6个子系统（23章）
- Part 4: expert-pm-1_p4_01 ~ _05（5章）
- Part 5: expert-pm-1_p5_01 ~ _03（3章）
- 其他: novice-1_04, novice-2_01, novice-2_04, round2_04

---

## 六、社区调研支线（X/Twitter Research）

状态：✅ v2 报告完成 + 三轮内容集成全部完成（2026-04-06）

- 调研范围：36个链接（26条X推文 + 4个飞书 + 6个独立站点）
- 数据获取：22/26条X推文通过fxtwitter API获取完整全文（v1仅2条近全文）
- 重大修正：4条推文(#24-27)经全文确认与Claude Code无关
- 产出文件：
  - `handoff/x-research/community-analysis-report.md` — 综合报告v2（深度分析22条CC相关推文）
  - `handoff/x-research/actionable-insights.md` — 对主线项目的建议v2
  - `handoff/x-research/integration-plan.md` — 集成计划（15项洞察→具体章节映射）
  - `handoff/x-research/raw-downloads/*.md` — 36个原始下载文件
- 关键发现：CC相关推文总浏览量335万+，总赞1.45万+；记忆系统是最深度话题；"Harness>Model"成行业共识
- **内容集成第一轮（2026-04-05 02:00）— 高优先级H1-H5 + M7/M9**：
  - 记忆系统章节：+Tulving框架对照表 +竞品记忆系统深度对比（CC vs LangMem/Mem0/Zep/OpenClaw）
  - 提示词工厂章节：+社区提炼的6大Prompt工程原则专栏
  - 总结章：+系统性效应论段落（@yq_acc）
  - 序章：+Harness Engineering三阶段框架（Prompt Eng→Context Eng→Harness Eng）
  - 系统代价章节：+ForgeCode基准测试数据
  - Token经济学章节：+14个缓存失效向量 +粘性闩锁机制
- **内容集成第二轮（2026-04-05 04:40）— H6 + M8/M10/M11 + L12-L15**：
  - 序章：+泄露催化的生态爆发数据（GitHub趋势榜6/10 CC项目，9000+星标）+@idoubicc/@IceBearMiner金句
  - 五分钟看懂架构：+Harrison Chase Model+Runtime+Harness三层共识框架
  - Q25 BashTool安全：+23项安全检查汇总（零宽字符/Zsh扩展/Zig验证）
  - 工具运行时：+@wquguru金句（"工具名词相同不代表骨架相同"）
  - 系统代价：+社区"屎山vs工程杰作"辩论段落
  - QA验证：74章0 issues，总字数294,511
- **集成计划完成度：15/15项全部完成** ✅
- **文章深度评审 ✅ 2026-04-05 夜间值班 — 全部完成**：
  - 28篇文章 + 8个补充源，全部评审完成（24个独立review + 1个批量review）
  - 汇总报告：`handoff/x-research/article-reviews/_summary.md`
  - Top 3: #14 YQ系统论(4.8/5) > #21 Barret Tulving(4.6/5) > #17 Joooe Prompt(4.2/5)
  - 新增4个集成建议（N1-N4）：open-agent-sdk技术分析、Multica延伸、竞品对比、references补充
  - 识别2个直接竞品：WquGuru Harness Books + AlexZ 驾驭工程
  - 4篇高价值长文需用户手动获取全文（#09/#18/#05/#06 在 X 平台内）
- **内容集成第三轮（2026-04-06 夜间值班）— 5篇全文深度评审+白皮书集成**：
  - 用户提供5篇全文文档（docx/PDF），Opus完成深度评审：
    - #05 troyhua 7层记忆(357行, 4.7/5) → 已于第二轮集成
    - #09 tvytlx 全系统报告(1046行, 4.2/5) → 28项fact-check，发现3处不准确
    - #18 servasyy 15章源码分析(912行, HIGH) → 中文社区最全面单篇分析
    - #06 MaxForAI 第一梯队架构(117行, MEDIUM-HIGH) → 10.2%缓存节省量化亮点
    - NEW: CC vs OpenClaw Hooks对比(429行, HIGH) → "Hook≠治理"概念澄清
  - 集成到白皮书：Hooks章节(+能力边界+权限合并+OpenClaw对比)、Token经济学(+cache_edits+10.2%)、遥测章节(+三通道+追踪链)、references.md更新
  - 深度评审文件：`article-reviews/review-{05,06,09,18}-*.md` + `review-NEW-hooks-comparison.md`
- 待补充：4个飞书链接（需登录）、OpenAI Harness 官方文章、3个JS渲染站点(#31/#32/#36)

---

## 七、灵感系统 v2（火花 & 蓝图）

### 架构

| 板块 | 定位 | 状态 |
|------|------|------|
| 🔥 **火花 (Sparks)** | 异想天开/不成熟/可能颠覆性的微灵感 | ✅ 120个火花 |
| 📐 **蓝图 (Blueprints)** | 多方验证/行业共识/结构化方向 | ✅ v2: 22个蓝图（从120个火花聚合） |

### 文件

| 文件 | 内容 |
|------|------|
| `handoff/brainstorm/sparks-and-blueprints.md` | 系统架构设计文档 |
| `handoff/brainstorm/sparks-v1.json` | 120个火花（20书籍+50社区+50深读，CC锚点覆盖120/120=100%，全部含通俗解释+三段式下一步行动+多角色评审） |
| `handoff/brainstorm/blueprints-v1.json` | 22个蓝图（从120个火花聚合，含可行性/价值评估/CC锚点/第一步） |
| `handoff/brainstorm/inspiration-matrix.md` | 三视角交叉综合报告（10大汇聚主题） |
| `handoff/brainstorm/engineering-ideas.json` | 原始工程视角18个创意 |
| `handoff/brainstorm/product-ideas.json` | 原始产品视角17个创意 |
| `handoff/brainstorm/frontier-ideas.json` | 原始前沿视角17个创意 |

### 进行中

- [x] 三视角Agent头脑风暴（52个创意）✅
- [x] 灵感矩阵综合报告 ✅
- [x] 火花/蓝图分类体系设计 ✅
- [x] 120个火花采集 ✅（20书籍+50社区+50深读，46 validated/62 has_signal/12 wild_guess）
- [x] 7→22个蓝图炼化 ✅ 2026-04-05（从120个火花聚合15个新蓝图）
- [x] 社区痛点调研Agent ✅ 50个社区火花
- [x] 老炮儿深读Agent ✅ 50个源码深读火花（SPK-201~250，全部含CC锚点+跨界联想）
- [x] Harness工具链通用化分析Agent ✅ 34个模块识别
- [x] Harness运行模式深度分析 ✅ 398行（5个角色分工/4条工作流/6个可复用模式/4个瓶颈点）
- [x] CC源码锚点增强 ✅ 120/120火花全覆盖（书籍20/20 + 深读50/50 + 社区50/50）
- [x] 灵感实验室网页板块 ✅（js/inspiration-lab.js，键盘快捷键4，含搜索+来源筛选）
- [x] 火花内容深度增强 ✅ 2026-04-05（120/120全部含通俗解释+下一步行动+3角色模拟评审）
- [x] 灵感实验室UI增强 ✅ 2026-04-05（新增通俗理解/下一步/多角色评审三个渲染区块+样式）
- [x] Gemini前端设计调研Handoff ✅ 2026-04-05（v2已更新：开放技术栈约束React/Next.js等，增加设计灵感平台调研Dribbble/Awwwards等，增加代码文件传递步骤）
- [x] Gemini Harness调研结果接收 ✅ 2026-04-05（在线链接+本地docx已到）
- [x] Gemini前端设计调研文档已读 ✅ 2026-04-05（7大方向：Astro Islands/Scrollytelling/CSS Token体系/Shadcn-ui/Cmd+K/CJK排版/Pencil.dev协同，ccunpacked.dev评为反面教材）
- [x] 蓝图深度增强 ✅ 2026-04-05（22/22全部完成：每个蓝图新增 plain_explanation/why_it_matters/user_feedback(4角色)/confidence，重写 first_step 为三段式格式）
- [x] 火花 next_step 三段式改写 ✅ 2026-04-05（120/120全部完成：**做什么**→**为什么做**→**谁来做/怎么做**，4个Sonnet子Agent并行处理，前端渲染+CSS适配完成）
- [x] 灵感数据渲染安全修复 ✅ 2026-04-05（修复蓝图换行符regex、5个火花backtick→单引号、1个火花角括号→全角，防止JS模板字面量和HTML注入）
- [x] 遗漏"九步→十步"修复 ✅ 2026-04-05（index.html SVG + 200.html SVG + data.js 描述，3处遗漏已修正）
- [x] 搜索索引重建 ✅ 2026-04-05（74章1521段，含最新内容集成）
- [x] "7层记忆架构"文章集成 ✅ 2026-04-05（用户下载的Word文档→review 4/5分→5项集成：Q02三种microcompact变体+9节摘要结构、记忆系统Dream四阶段工作流、Token经济学post-compact通知、Q09触发条件强化）

---

## 八、Harness工具链通用化

### 目标
将项目中演化出的工具系统（灵感/审阅/图表/QA/画廊/术语等）沉淀为即插即用的通用模块。

### 文件
- `handoff/gemini-deep-research-brief.md` — Gemini调研交接brief（市场/用户/技术/商业模式）
- `handoff/harness-toolkit-analysis.md` — v1分析（34模块，用户评价"一般"）
- `handoff/harness-running-mode.md` — ✅ 运行模式深度分析（5角色/4工作流/6模式/4瓶颈）

---

## 九、源码深度挖掘（2026-04-05 — 三部分 Opus 审查完成）

### 任务背景
用户指示"三大挖掘"：架构、Prompt金矿、功能系统。Opus派出5个Sonnet Agent并行扫描1,884个TypeScript文件（~42万行代码），全部产出由Opus亲自审查综合。

### 产出文件
| 文件 | 内容 | 行数 |
|------|------|------|
| `handoff/x-research/prompt-scan-core.md` | Core系统Prompt扫描（30个模板） | ~200 |
| `handoff/x-research/prompt-scan-agents.md` | Agent系统Prompt扫描（10个模板） | ~299 |
| `handoff/x-research/prompt-scan-tools.md` | Tools/Commands/Skills Prompt扫描（84+条目） | ~200 |
| `handoff/x-research/architecture-map.md` | 完整架构地图（58个系统） | ~1,077 |
| `handoff/x-research/functional-systems-map.md` | 跨边界功能系统地图（15+5个系统） | ~1,039 |
| `handoff/x-research/source-gap-analysis-final.md` | **Opus综合审查报告** | ~300 |

### 关键数字
- 发现 **124+ 个Prompt模板**（40工具描述 + 19系统提示段 + 12命令Prompt + 6内置Agent + 9 Skill + 38其他）
- 识别 **58个系统/子系统**：26个FULL覆盖、12个PARTIAL、8个MENTIONED、**12个完全MISSING**
- 识别 **20个跨边界功能系统**（15个主系统 + 5个隐藏系统）

### Prompt十大金矿（白皮书最大缺口）
1. 主系统提示词19段完整文本 → 只列section名未引原文
2. 40个工具描述全文 → 未展示实际内容
3. Verification Agent 130行对抗性提示词 → 提到未展示
4. Agent自动生成提示词 → 完全缺失
5. Compaction 9节摘要模板完整文本 → 结构未引原文
6. Dream四阶段整合提示词 → 只有阶段名
7. Security Review完整协议(196行) → 完全缺失
8. /init八阶段向导(224行) → 完全缺失
9. BashTool完整Git安全协议(560行) → 部分引用
10. Explore/Plan Agent系统提示词 → 完全缺失

### 架构最大缺口
- **P1**: Bash AST解析器(12,306 LOC) 完全无章节
- **P2**: Prompt Cache可观测性(700行)完全遗漏、Compaction Pipeline无独立章节、parseTokenBudget完全缺失
- **P2 MISSING**: Cron调度、UltraPlan、团队记忆同步、远程托管、策略限制、Fast Mode、Computer Use、Claude-in-Chrome

### 优先行动计划
1. **第一优先级 — Prompt金矿开采** ✅ 完成（新增2章 + 11章嵌入 + 5章洞察注入）
2. **第二优先级 — 架构缺口填补** ✅ 基本完成（新增5章覆盖7个系统 + 跨章交叉引用6处）
3. **第三优先级 — 新兴系统覆盖**（剩余小系统已有部分覆盖，非关键）

### 架构缺口填补（2026-04-05 — 进行中）

| 新文件 | 内容 | 行数 | 覆盖系统 |
|--------|------|------|---------|
| `18_Bash_AST解析器完全解析.md` | 35,681 LOC 的纯TS解析器+安全分析管线完全解析（4层架构/24项安全检查/Git安全协议/差异攻击防御） | ~420行 | P1: Bash AST Parser ✅ |
| `19_Cron调度系统完全解析.md` | 2,172 LOC 定时调度系统（多会话锁/文件持久化/Jitter抖动/任务生命周期/7天自动过期） | ~250行 | P2: Cron Scheduler ✅ |
| `20_团队记忆同步完全解析.md` | 2,167 LOC 团队记忆共享系统（Pull/Push协议/密钥扫描/ETag乐观并发/分批上传） | ~260行 | P2: Team Memory Sync ✅ |
| `21_FastMode与UltraPlan完全解析.md` | Fast Mode(827 LOC)速度档位+UltraPlan(1,557 LOC)30分钟远程规划+传送机制 | ~280行 | P2: Fast Mode + UltraPlan ✅ |
| `22_PromptCache可观测性完全解析.md` | 727 LOC缓存失效检测(工具级hash/diff诊断/粘性闩锁)+74 LOC Token Budget自然语言解析器 | ~230行 | P2: Cache Observability + Token Budget ✅ |

**剩余缺口**：Remote Hosting(1,500+ LOC，已有12_Bridge远程架构章节部分覆盖)、Computer Use(474 LOC，较小)、Rate Limiting(分散在多个文件中)

**跨章交叉引用（2026-04-05 最新一轮）**：
- Q25 BashTool安全 → Ch18 Bash AST 解析器
- Part 4 Token经济学 → Ch22 Prompt Cache 可观测性
- Part 2 Token经济学 → Ch22 Prompt Cache 可观测性
- Part 5 系统代价 → Ch22 + Ch21 (Cache + Fast Mode)
- Part 3 记忆系统 → Ch20 团队记忆同步
- Part 2 提示词工厂 → Part 4 Ch06 八大设计智慧 + Part 2 Prompt原文集
- Part 2 工具运行时 → Ch19 Cron 调度系统
- 新增 Part 3 QA对 15对（5新章×3对/章），Part 4 QA对 3对，难度评级 6条

**QA**: 82章 / 338,562字 / 0 errors / 搜索索引 80章 553KB

详见：`handoff/x-research/source-gap-analysis-final.md`

### 金矿开采三轮完成（2026-04-05 Opus 夜间值班）

**Track 1 — 附录集中收录（新增章节）：**

| 新文件 | 内容 | 行数 |
|--------|------|------|
| `14_Prompt原文集.md` | 全部185个Prompt原文全量收录（12大分类+统计表+6大设计模式总结）**100%覆盖** | 5,662行 |
| `06_Prompt的八大设计智慧.md` | 从Prompt中提炼的8大跨系统设计哲学（反惰性工程学/Prompt即规范/AB测试/Eval驱动/类型守护缓存/Prompt编译器/元提示词/认知科学映射） | 537行 |

**Track 2 — 嵌入式原文注入（11个章节增强）：**

| 章节 | 修改 | 新增字数 |
|------|------|---------|
| `03_提示词工厂.md` | 新增 4.3 节"揭开面纱"——7个系统提示词段落实际内容、ant-only双变体、Proactive/Eval驱动 | ~3000字 |
| `06_Agent编排.md` | 新增 5.1 节——Verification Agent 130行对抗性提示词（6条偷懒借口+11种验证策略+输出格式） | ~2000字 |
| `记忆系统完全解析.md` | 扩展 6.3 节——Dream四阶段提示词实际内容（优先级链+整合规则+索引约束） | ~1000字 |
| `05_工具运行时.md` | 新增 9.5 节——工具描述即隐性指令（BashTool/AgentTool/EnterPlanMode三案例原文） | ~1500字 |
| `07_安全架构.md` | 新增第10节——/security-review(196行)+/init(224行)完整Prompt原文+分析 | ~2000字 |
| `Q02_上下文压缩.md` | 新增NO_TOOLS_PREAMBLE+DETAILED_ANALYSIS+BASE_COMPACT_PROMPT原文（9节分析表） | ~1500字 |
| `Q09_Session记忆.md` | 新增DEFAULT_SESSION_MEMORY_TEMPLATE+getDefaultUpdatePrompt原文（5规则表） | ~1000字 |
| `02_投机执行.md` | 新增 2.4 节——SUGGESTION_PROMPT完整原文+"刚想打就出现了"测试标准 | ~800字 |
| `15_Skill加载.md` | 新增 4.5 节——SIMPLIFY/SKILLIFY//loop三个Skill Prompt原文 | ~1200字 |
| `协调器模式.md` | 新增第8节附录——getCoordinatorSystemPrompt完整原文(275行) | ~1500字 |
| `13_Buddy伴侣.md` | 新增companion intro原文+80词信息密度分析 | ~500字 |

**Track 3 — 启发洞察注入（5个章节增强）：**

| 章节 | 注入内容 |
|------|---------|
| `02_token是一等公民.md` | CacheSafeParams类型系统守护缓存一致性 |
| `03_把AI当乐高积木.md` | 元提示词递归设计（AgentTool→AGENT_CREATION_SYSTEM_PROMPT） |
| `03_提示词工厂.md` | Eval驱动迭代（memoryTypes.ts量化评估数据） |
| `02_如果我来重新设计.md` | 从Prompt Engineering到AI行为工程范式转换 |
| `06_Prompt的八大设计智慧.md` | 8大跨系统设计哲学独立成章（全新创作） |

**QA**: 317,036字 / 0 issues / 搜索索引512KB

---

## 十、源码全量统计面板 (2026-04-05)

基于 CC 2.1.88 src/ 目录的穷举式扫描（find + wc + grep 实际计数）。

### 核心数字

| 维度 | 数值 | 说明 |
|------|------|------|
| 源码文件 | 1,902 个 | .ts 1,332 + .tsx 552 + .js 18 |
| 代码行数 | 512,695 LOC | 有效行 476,875 (93%) |
| 顶层子系统 | 35 个 | 最大: utils (180,472 LOC, 35.2%) |
| AI 工具 | 40 个 | 含 36 个独立 prompt.ts |
| 斜杠命令 | 98 个 | 86 子目录 + 12 根命令 |
| 内置技能 | 17 个 | 含 loop/simplify/skillify 等 |
| 自定义 Hook | 94 个 | React Hook 模式 |
| 安全文件 | 621 个 (32.7%) | 4,709 次安全关键词 |
| 权限文件 | 626 个 (32.9%) | 5,160 次权限关键词 |
| MCP 引用 | 5,718 次 | 横跨 422 个文件 |
| Prompt 文件 | 80 个 | 537 个文件含 prompt 代码 |
| 生产依赖 | 93 个 | 含 7 Anthropic SDK + 18 OpenTelemetry |
| 异步函数 | 2,345 个 | 5,469 await + 2,529 Promise |
| type 定义 | 2,363 个 | 0 enum (全部用联合类型+Zod) |
| 注释 | 52,483 行 (10.2%) | 含 7,704 JSDoc + 138 TODO |
| 服务层 | 20 个子服务 | 130 文件 / 53,680 LOC |

### 产出

| 文件 | 说明 |
|------|------|
| `cc-source-stats-report.md` | 完整统计报告 (含 JSON 数据块) |
| `test-viz/production/html/VIS-0-002B_CC源码全量统计仪表盘.html` | 动态仪表盘网页 (暗色主题/动画计数器/数据卡片) |

---

## 十一、Prompt 全量补录 (Phase 1→2→3 全部完成 ✅✅✅)

### 背景
用户核心要求：**源码中出现过的 Prompt 原文必须全部收录，一个都不能遗漏。**

### 审计结果
- 全量审计文件：`prompt-audit-full.md`（794行，185 个 Prompt 单元 P001-P183 + 6 个外部 .txt）
- Phase 1 (04-05)：40 个工具描述完整收录 → 68 条（+803 行）
- Phase 2 (04-05)：记忆+4、Coordinator+2、Commands+1、Skills+11、服务层+5、输出风格+2、辅助+5 → 109 条（+1,136 行）
- Phase 3 (04-05)：系统子段+13、记忆dir+3、Agent+2、工具附属+9、嵌入片段+10、.txt引用+6 → **185 条全覆盖**（+1,061 行）

### 当前文件
- `14_Prompt原文集.md`：**5,662 行**（原 2,662 行，增长 113%）
- 12 个章节（含新增"附录：嵌入式 Prompt 片段"）+ 统计表 + 设计模式总结
- 覆盖率：**185/185 = 100%** 🎯 **全量覆盖达成**

### 三阶段增量明细
| Phase | 新增项 | 行数增量 | 累计行数 | 覆盖率 |
|-------|--------|----------|----------|--------|
| Phase 1 | 40 工具描述 | +803 | 3,465 | 37% |
| Phase 2 | 41 条核心 prompt | +1,136 | 4,601 | 59% |
| Phase 3 | 76 条子段/片段/引用 | +1,061 | 5,662 | **100%** |

---

## 十二、花叔 PDF 竞品分析 (2026-04-05)

### 花叔《Claude Code从入门到精通 v2.0.0》
- 规模：75页 / ~128K 字符
- 定位：面向工程师和产品经理的使用指南
- 适用版本：v2.1.88+

### 核心结论
- **我们 83 章中至少 70+ 章在花叔手册中完全不存在**
- 花叔是"驾驶手册"，我们是"发动机工程图纸"，定位互补不竞争
- 花叔源码分析仅占全书 4%（附录A），停留在概念性描述，无代码引用

### 可借鉴
1. 非程序员视角叙事（亲和力强）
2. 商业数据整合（10亿美元ARR、企业采用名单）
3. Boris Cherny 引用（5+10并行工作法、47天使用数据）
4. 定价选购建议（Pro/Max对比）
5. "六个坑"反模式（使用经验）

---

## 十三、新章节图表 Brief (2026-04-05 ✅ 完成)

| Brief | 名称 | 所属章节 |
|-------|------|---------|
| VIS-3-018A | Bash AST 解析管线全景图 | ch18 Bash AST |
| VIS-3-018B | FAIL-CLOSED 安全模型 | ch18 Bash AST |
| VIS-3-019A | Cron 调度器架构图 | ch19 Cron |
| VIS-3-019B | Cron 任务生命周期 | ch19 Cron |
| VIS-3-020A | 团队记忆同步架构 | ch20 Team Memory |
| VIS-3-020B | Pull/Push 同步流程 | ch20 Team Memory |
| VIS-3-022A | Cache Break 检测流程 | ch22 Prompt Cache |

文件位置：`briefs/part3_new/`

---

## 十五、前端主题系统 + 图表融入 (2026-04-06 晚)

### 背景
用户拍板：图表融入阅读体验是"深刻课题"，要进入设计阶段；前端 Design Tokens 阶段 1 启动；
Astro 激进路线做 PoC 不影响主站。三轨并行，全部 sub-agent 化。

### 已交付（按 commit 顺序）

| Commit | 主题 | 改动量 | 验证 |
|--------|------|--------|------|
| `6e38b44` | 前端 Stage 1：Design Tokens 系统 | tokens.css 426 行 / 246 个 `--cc-*` 变量 / 三态切换器 / FOUC 防御 | 0 改 style.css，零回归 |
| `ed49e1e` | chart-embed.js Stage 1：折叠+预加载+骨架屏+主题 bridge | +274/-69 行 | qa ✅ / 拨测 200 |
| `cd0ba4c` | 前端 Stage 2：style.css :root 转发到 `--cc-*` | 19 行（一次性接到 token） | 600+ 处现有 var 引用自动跟随主题 |
| `e795bcb` | 7 张 part3_new 图表归位 mapping | mapping 83→90 | 7 张 placeholder 内联渲染 |
| `d986cd4` | 序章 15 张图表占位符插入 + mapping | 15 个 `[图表预留 0.X-Y]` 写入序章 prose | 序章首屏 15 张图内联 |
| `53f32e6` | chart-embed.js B 路径：游离图自动归位章节末尾 | +148 行 / 新增 `appendOrphanCharts` API | Playwright 实测：part4 10 张 + part5 5 张 + 序章 1 张全部渲染 |
| `37c8c23` | build-search-index.js 双写源消除 + qa 完整性校验 | -128/+49 行 | search-index 83/83 ✅ |
| `29ced1f` | 章数一致性 82→83 | 4 个 UI 文件 | qa ✅ |
| `3715549` | ch83 Harness Engineering 入库 | +403 行 | qa completeness 4/5 |
| `312a0e4` | Astro PoC 沙箱归档 | 22 文件 / 7232 行（无 node_modules/dist） | 详见 handoff/astro-spike-report |
| `2b22318` | 7 张 part3_new 图表评审记录 | reviews/*.txt | — |

### 关键里程碑

**1. 主题系统真正可用**
- 246 个 `--cc-*` 变量分原子层 + 语义层两层架构
- 暗/亮/auto 三态，localStorage 持久化 + 跨 Tab 同步
- FOUC 防御脚本在 `<head>` 内联（CSS 解析前注入 `data-theme`）
- Stage 2 把 style.css 旧 :root 全部转发到 `--cc-*`，整站 600+ 处变量引用一次性跟随主题切换

**2. 图表 100% 线上可见**
- mapping 状态：105/122 placeholder 内联 + 17 自动 fallback = **122/122 全覆盖**
- chart-embed.js B 路径是架构级安全网：以后任何加图都能自动归位，不会再有"加了 mapping 但用户看不到"的故障模式
- 序章 15 张关键图采用 placeholder 内联（首屏叙事优先）
- part4 10 张 + part5 5 张 + part1 1 张采用 B 路径文末 fallback（叙事融入是 P2 优化）

**3. 工程根因修复**
- search-index.json 双写源彻底消除：build-search-index.js 改为 `require('../js/data.js')` 单源
- qa-check.js 增加完整性 CI 校验：实际 entries < data.js 期望 → exit 1
- 原因：build script 内部硬编码了一份 BOOK_STRUCTURE（80 章），与 data.js（91 章）不同步，导致 ch83/p2-14/references 长期"看不到"

**4. Astro 长期赛道 PoC**
- 1.04 秒构建 83 页面，0 JS 输出，CSS 削减 88%
- 推荐路径 B 增量迁移：先 Part 2 + Part 3 共 39 章试水
- 6 个风险 R1-R6 已识别（详见 handoff/astro-spike-report-2026-04-06.md）
- 主站继续 vanilla 演进，沙箱不影响生产

### 已识别但未处理的次级缺陷

- ~~**review-mode.js:229** 存在 pre-existing `buildGalleryView insertBefore` pageerror~~ ✅ 已修（commit `f3ffba3`，appendChild 替代 insertBefore）
- **part4/part5 章节 prose 占位符**：15 张图当前用 B 路径文末 fallback，理想情况应该有 inline placeholder——P2 优化任务
- **VIS-0-002 旧版仪表盘**：被 VIS-0-002B 替代，按设计意图保留游离不渲染
- **VIS-1-011 归属**：自动归到序章末尾（派生规则），实际可能更适合 part1 概念章节
- **4 张 v2 升级图表**：VIS-0-001 / VIS-0-004 / VIS-1-002 / VIS-1-004 在 `test-viz/simple/*.v2_0406_1153/` 已生成 + 评审完成，但未归档到 production/html（需用户决策是否替换 v1）

---

### 值班记录（2026-04-06 22:30 起，30 分钟轮）

| 时间 | 轮次 | 已交付 | 备注 |
|------|------|--------|------|
| 22:30 | #1 | `f3ffba3` Harness 标题清理 + review-mode bug 修复；PROGRESS 同步 | QA 0 errors / search-index 83/83 ✅ |
| 00:50 | #2 | 清洁度归档执行（142.5MB / 7 空文件）+ V2 序章阶段 1.5 启动（9 prep agent 并行）+ QA 复测 0 errors | 终端 #1 此后于 ~01:10 崩溃，CronCreate `13,43 * * * *` 一并死亡 |
| 01:30 | #3a | 终端 #2 崩溃恢复：盘点 9 prep agent 落盘状态（5 已完成，4 未确认）+ 写 Block 3 Brief 双跑后台启动（Kimi/MiniMax 各 1 进程）+ 加派 5 个 Sonnet sub-agent 兜底（重派 #162/#164 + QA + Block4-5 prep + 旧 demo 11 块映射）| 7 个 background task 并行；试图开 bypass 失败（settings.json defaultMode 不即时生效，FM-14 沉淀） |
| 01:35 | #3b | 写交接文档 `handoff/SESSION-HANDOFF-2026-04-07-0135.md` (27 KB)，预备终端切换 | QA sub-agent 报告 P0 secret：archive/test-viz-_archive/run_batch{,2}.sh 含 4 处真实 KIMI/MINIMAX key；立即把 archive/ 加入 .gitignore 防御 |
| 01:50 | #3c | 7/7 background task 全部成功落盘（5 sub-agent 7 份产出 + Kimi/MiniMax Block 3 双跑产物 + 自动评审 review-report.md），决定不切终端，直接收尾 | 全量超出预期：sub-agent 自主推进 Kimi 修复 + clean_html + 写评审报告 |
| 02:00 | #3d | 5 个 atomic commit 入库 + PROGRESS/SOP 同步 + FM-13/FM-14 沉淀 + 交接文档 v2 更新 | 此轮净交付：14 个 handoff 文件 / 1 个 v2-demos 子目录 / 1 个新 script / 2 个 SOP 故障模式 / 1 个 P0 secret 防御 |

#### 阶段 1.5 并行 Sub-Agent 清单（任务 #157-#165 + 终端 #2 加派 #166-#170）
| # | 任务 | agent | 状态 | 关键产出 |
|---|---|---|---|---|
| 157 | 12 MISSING 章节 backlog 挖掘 | Sonnet | ✅ done | 14 候选（P0×4 / P1×6 / P2×4），66h，**重大发现：原 12 中 5 个已落地** → handoff/missing-chapters-backlog-2026-04-06.md |
| 158 | chart-catalog 反向验证 | Sonnet | ✅ done | 健康度 55/100，**8 漏注册 + 三大字段 100% 缺失** → handoff/chart-catalog-sync-audit-2026-04-06.md |
| 159 | Block 7a/7b/7c 拆分准备材料 | Sonnet | ✅ done | → handoff/v2-prologue-block7-prep-2026-04-06.md (34 KB) |
| 160 | 黄金资产对序章 Brief 引用提取 | Sonnet | ✅ done | → handoff/golden-assets-prologue-mining-2026-04-06.md (30 KB) |
| 161 | SOP.md 4 类故障模式沉淀 | Sonnet | ✅ done | **FM-09~12 已沉淀**，SOP 故障表 8→12 → handoff/sop-fault-modes-added-2026-04-06.md |
| 162 | 块 3+9 试水素材一键包 | Sonnet | ✅ done（终端 #2 重派落地）| Block 9 素材 374 行 + Block 3 数字稽核 14/14 全对 → handoff/v2-prologue-block9-prep-2026-04-07.md + handoff/v2-prologue-block3-numbers-audit-2026-04-07.md |
| 163 | catalog P0 紧急修复（执行） | Sonnet | ✅ done | → scripts/catalog-fix-2026-04-06.js + handoff/catalog-fix-diff-2026-04-06.md |
| 164 | 5 章覆盖度复核（防虚假完成） | Sonnet | ✅ done（终端 #2 重派落地）| 5 章中 3 真覆盖 / 0 假覆盖 / 2 部分覆盖 → handoff/missing-chapters-coverage-recheck-2026-04-07.md |
| 165 | 122 HTML 字体一致性扫描 | Sonnet | ✅ done | FM-12 检测从序章 15 张扩到全 122 张 → handoff/chart-font-audit-2026-04-06.md |
| 166 | QA + Code Review 安全扫描（终端 #2 加派）| Sonnet | ✅ done | **🚨 P0 救命发现：archive/test-viz-_archive/run_batch{,2}.sh 含 4 处真实 API key**；QA 0 errors 复核通过 → handoff/qa-coderev-recovery-2026-04-07.md |
| 167 | Block 4/5 素材准备（终端 #2 加派）| Sonnet | ✅ done | Block 4 硬数字 63 行 + 5 数字口径冲突需 Opus 拍板；Block 5 立意要点 10 个（4 论点 + 6 反论点对齐矩阵）→ handoff/v2-prologue-block4-prep-2026-04-07.md + block5-prep-2026-04-07.md |
| 168 | 旧 prologue demo 11 块映射（终端 #2 加派）| Sonnet | ✅ done | Kimi 11/11 + MiniMax 11/11 全覆盖，每块行号区间 + 复用建议 → handoff/v2-prologue-old-demo-mapping-2026-04-07.md |
| 169 | Kimi Block 3 HTML 生成（终端 #2 后台）| Kimi | ✅ done | 21 KB / 792 行，Section 5 checklist 58/60，CSS 循环引用已修复 → v2-demos/prologue-block3-kimi-final.html |
| 170 | MiniMax Block 3 HTML 生成（终端 #2 后台）| MiniMax | ✅ done | 20 KB / 612 行，54/60（**违反 FM-12 字体硬编码 -5**），sub-agent 自动 clean_html 清理 markdown 围栏 → v2-demos/block3/minimax-clean.html |

#### 14 章 MISSING Backlog（详见 handoff/missing-chapters-backlog-2026-04-06.md）
- **P0 必补 4 章 22h**：第 23 章 Compaction Pipeline / 第 24 章 主系统提示词 19 段 / 第 25 章 内置 Agent 人格 / 第 26 章 Tool Concurrency
- **P1 应补 6 章 30h**：Error Recovery / Session Persistence / Cost Tracking / 企业级治理 / FileStateCache / Computer Use+LSP+Chrome
- **P2 可选 4 章 14h**：DXT 扩展格式 / VCR 回放 / Tips 系统 / 上游代理与迁移系统
- **已剔除（虚假 MISSING）**：5 个 part3/18-22 已落地，待 #164 sub-agent 复核覆盖度

#### 4 类故障模式编号化（详见 SOP.md FM-09~12）
- **FM-09** 硬数字漂移（约等于简化）— 预防：Brief "硬数字"清单 + grep `~|约|大约` 检查
- **FM-10** 视觉形式错误（忽略 Brief 形式禁令）— 预防：Brief 末尾大写 `MUST NOT USE` 段
- **FM-11** 随机数据补全（凑数代替留空）— 预防：grep `Math.random|while.*length`
- **FM-12** 字体跨图漂移 — 预防：强制 `var(--cc-font-sans)` + `var(--cc-font-mono)`

#### chart-catalog 健康度审计（详见 handoff/chart-catalog-sync-audit-2026-04-06.md）
- **零幽灵图表**：catalog 114 条全部对得上磁盘
- **零真实生产缺口**：121 brief 全部有 HTML
- **8 个漏注册**：part3_new 整批 7 张 + VIS-0-002B（无 brief 的孤儿 HTML）
- **三大字段 100% 缺失**：`chapter` / `status` / `brief_id` 都没有，前端无法用 catalog 当 SoT
- **34 个 VIS-2A 的 name 字段为空**：brief 文件名缺中文标题
- **VIS-3-021 编号空洞**：018→019→020→022 跳号，需 Opus 与作者确认
- 任务 #163 正在执行 P0 修复

#### V2 序章 11 块拆分方案（已落盘 handoff/v2-prologue-block-plan-2026-04-06.md）
- 块 1 Hero 引擎盖悖论 / 2 群雄并起 2026 / 3 生态爆发 / 4 数字震撼 / 5 这本书做什么
- 块 6 OS 类比建立 / 7a 安全防线 / 7b 外部接口 / 7c 内部组织 (块 7 拆三)
- 块 8 三条阅读路径 / 9 比喻+源码入口
- **试水块**：块 3（无图）+ 块 9（收尾）→ 阶段 2.1 各派 Kimi+MiniMax 双跑

#### V2 双源精髓提取（4 个炸弹）见 handoff/v2-prologue-vis-soul-2026-04-06.md
1. VIS-0-002：HTML 写"~250K"实际是 476,875 行（数字漂移）
2. VIS-0-013：Brief 明令"雷达图不合适"但 HTML 仍画了雷达图（视觉形式错误）
3. VIS-0-014：知识图谱用 `while(chapters.length<74)` 随机数补全（凑数式数据）
4. 字体跨图漂移：15 张图用了 5 套字体（Segoe UI / Helvetica / SF Pro / 系统默认 / 衬线 fallback）

### 设计文档

- `handoff/frontend-stage1-tokens-2026-04-06.md` — 前端 Stage 1 完成报告
- `handoff/chart-integration-design-2026-04-06.md` — 图表融入三方案对比 + 推荐
- `handoff/astro-spike-report-2026-04-06.md` — Astro PoC 完整审计 + 6 风险

---

## 十四、其他开放问题

1. **子 Agent 方案已落地**：Kimi + MiniMax 双模型管线运行中
2. **竞品信息时效性**：Cursor/Copilot 2025-2026 变化较大，多处描述可能过时
3. **图表人工干预**：4个<12分图表因SVG复杂度达到Kimi自动生成瓶颈
4. **首页设计**：已改为专业书封面风格，用户反馈待收
5. **文件结构**：用户提出 web/ 下的文件应以上层 CC-Research-byClaude/ 为模板组织
6. **GitHub 推送**：用户确认每次更新都要推送，建立 PR 历史记录
7. **飞书文档×4**：需飞书登录获取
8. **X 文章待获取**：#31知乎 + #32 OpenAI Harness + #36 yage.ai（需用户手动复制）
9. ~~**Gemini 前端设计**~~：✅ 已落地为 Stage 1/2 Design Tokens 系统（commit 6e38b44 + cd0ba4c），见第十五章节
10. ~~**P0 数字不一致**~~：✅ 已修复（references.md 74章→82章、近30万→逾35万）
11. ~~**P0 10.2% 来源**~~：✅ 已补充源码文件+行号标注
12. ~~**P1 截止日期**~~：✅ 序章已添加"源码分析截止日期：2026年4月"
13. ~~**P1 Hooks 章节可读性**~~：✅ 已��善（快递通知切入+技术注脚折叠+过渡句）
14. ~~**P2 CacheSafeParams 比喻重构**~~：✅ 已添加连锁餐厅统一配方比喻
15. ~~**P2 读者分流导读**~~：✅ 序章已添加三条阅读路线（CS学生/高级工程师/创业者&PM）
