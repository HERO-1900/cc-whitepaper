# Claude Code 源码白皮书 — 项目进度追踪

> 最后更新：2026-04-04 23:45

## 项目概况

| 指标 | 数据 |
|------|------|
| 总章节 | 74 章 |
| 总字数 | 288,218 CJK 字符 |
| QA Issues | 0 |
| 完整度 | 74/74 = 5/5 |
| 图表进度 | 114/114 已产出 ✅ |
| 网站地址 | `http://localhost:8080` (本地开发) |

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

### 待做

- [x] ~~Part 3/4/5 David 评审~~ ✅ 2026-04-04 完成
- [x] 竞品信息更新 ✅ 2026-04-04（Gemini Deep Research 调研 + 全书 Tier 0/1/2 竞品描述更新）
- [x] 深度问答部分（25个Q）的技术准确性抽查 ✅ 2026-04-04（准确率 92%，修复 Q05/Q09/Q12/Q23/Q24）
- [x] 跨章"九步→十步"一致性统一 ✅ 2026-04-04（9文件31处修改，全书统一为"十步"）
- [ ] 图表人工审阅后的质量改进（23个图表修订中，批量管线运行中）
- [ ] 图表嵌入网站系统（映射已建立：83/84占位符已匹配，待图表修订完成后集成）
- [x] 移动端响应式适配 ✅ 2026-04-04（导航栏+全页面深度适配，120+条CSS规则）
- [x] 远程访问方案 ✅ 2026-04-04（蒲公英远程桌面）
- [x] 全文搜索 ✅ 2026-04-04（74章/1515段落索引，正文+标题搜索）

---

## 二、可视化/图表系统

### 状态：✅ 全部完成 — 114/114 (100%)

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

### 图表修订（用户审阅反馈 → v2）

状态：⏳ 批量修订运行中（24个图表，3并行）
- 修订管线: `scripts/chart-revision.sh` (brief + 用户原始反馈 + 现有HTML → Kimi修订 → MiniMax评审/25分)
- 批量脚本: `scripts/chart-revision-batch.sh`
- 产出目录: `test-viz/revisions/VIS-*_MMDD_HHMM/`
- 反馈文件: `test-viz/revisions/feedback/VIS-*.txt`（23个，用户原始评论完整保留）
- 已更新 brief: VIS-0-013(雷达→柱状)、VIS-1-002(增加解释)、VIS-1-009(增加通俗说明)、VIS-1-010(横排标题+案例)
- 用户审阅范围: VIS-0-001 ~ VIS-1-011（剩余 VIS-2A ~ VIS-5 待审）

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

### 待做

- [ ] 图表嵌入系统（映射JSON已生成，83/84占位符匹配，待图表修订完成后集成）
- [x] 移动端响应式适配 ✅ 2026-04-04（导航栏纯图标模式+全页面120+条规则）
- [x] 全文搜索 ✅ 2026-04-04（build-search-index.js → search-index.json，74章1515段）
- [ ] PWA 离线支持（可选）
- [ ] GitHub Pages 部署 ✅ 已上线 https://hero-1900.github.io/cc-whitepaper/

---

## 四、QA 系统

- 自动检查脚本：`scripts/qa-check.js`
- 输出：`qa-report.md` + `qa-report.json`
- 当前状态：74/74 章 5/5 完整度，0 issues

---

## 五、评审体系

### Persona 定义

| Persona | 角色 | 文件 |
|---------|------|------|
| David Chen | AI 基础设施 CTO | `scripts/personas/expert-pm-1.md` |
| 小张 | CS 大三学生 | (之前会话中使用) |

### 评审报告存档

`scripts/reviews/` 目录下：
- Part 2: expert-pm-1_02 ~ _10（10章）
- Part 3: expert-pm-1_p3_01 ~ _17 + 6个子系统（23章）
- Part 4: expert-pm-1_p4_01 ~ _05（5章）
- Part 5: expert-pm-1_p5_01 ~ _03（3章）
- 其他: novice-1_04, novice-2_01, novice-2_04, round2_04

---

## 六、开放问题

1. **子 Agent 方案已落地**：Kimi + MiniMax 双模型管线运行中
2. **竞品信息时效性**：Cursor/Copilot 2025-2026 变化较大，多处描述可能过时
3. **~~图表批量生产~~**：✅ 114/114 全部完成（2026-04-04）
4. **图表质量迭代**：平均 ~13/20，11个低分图表（≤11/20）待重做提升
