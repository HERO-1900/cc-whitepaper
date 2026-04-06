# Claude Code 源码白皮书 — 标准操作程序（SOP）

> 版本：v1.0（2026-04-06）
> 状态：基于项目实际产物提炼，覆盖内容创作/社区调研/图表生产/多轮评审/代码检查等全部核心工作流。
> 所有流程均已被实践验证，非理论假设。

---

## 目录

1. [核心理念](#一核心理念)
2. [内容创作工作流](#二内容创作工作流)
3. [社区文献调研工作流](#三社区文献调研工作流)
4. [图表生产工作流](#四图表生产工作流)
5. [测试用户评审工作流](#五测试用户评审工作流)
6. [Code Review 工作流](#六code-review-工作流)
7. [子 Agent 调用规范](#七子-agent-调用规范)
8. [安全与隐私](#八安全与隐私)
9. [自我进化机制](#九自我进化机制)
10. [工具速查表](#十工具速查表)

---

## 一、核心理念

### 三模型分工

本项目演化出一套"主脑-执行-专化"的三层模型分工：

| 模型 | 角色 | 典型任务 | 绝对不做 |
|------|------|---------|---------|
| Opus | 调度 + 顶级评审 + 全局战略判断（主） | 写 Brief、综合多份报告、定夺架构决策、最终拍板 | 生成图表 HTML、单章写作、跑批量自动化 |
| Sonnet | 内容执行 + 全局战略判断（辅） | 写章节草稿、跑测试用户评审、代码修复、为 Opus 准备战略备选方案 | 单方面替 Opus 拍板架构级决策 |
| Kimi | 图表 HTML 生成（主）+ 评审（备）+ 通用执行（备） | 按 Brief 生成可视化；做交叉评审；也可承担 Sonnet 类任务（写脚本、做调研） | 替 Opus 拍板架构级决策 |
| MiniMax M2.7 | 图表评审（主）+ 评审（多角色）+ 图表生成（备） | 25 分制图表打分、指出缺陷、提修改建议；做内容评审；也可生成图表 HTML（与 Kimi 形成竞品对照） | 替 Opus 拍板架构级决策 |

**评审职责说明**：评审不是某个模型的专属。Sonnet / Kimi / MiniMax **都可以做评审员**，只是各有偏向——MiniMax 主要负责图表评审、Sonnet 主要负责内容/章节评审、Kimi 主要做交叉验证。**多模型交叉评审**是本项目的核心防御机制（同一对象至少两个模型独立评一次）。

**全局战略判断说明**：架构级、方向级、跨章节的判断由 **Opus 为主**，但 Sonnet 可以**为辅**——Sonnet 可以收集证据、列选项、给出推荐方案，最终由 Opus 拍板。Sonnet **不应单方面替 Opus 做不可逆的架构决策**。

**核心原则**：Opus 只做"只有 Opus 才能做"的事。Brief 写清楚之后，Opus 就退出任务链，由下游模型接手。图表 HTML 全部交给 Kimi 生成 + MiniMax 评审，Opus **永远不写图表代码**。

### 子 Agent 优先

能让子 Agent 处理的任务，绝对不消耗 Opus 的上下文窗口。实践中，以下任务全部通过子 Agent（`claude -p` headless 模式）完成：

- 社区文章逐篇评审（36 篇文章，25 个独立 review）
- 测试用户视角模拟（David Chen / 小林 / Alex Wang）
- 深度主题调研（Harness Engineering 百科全书级调研，抓取 37 个 URL）
- 图表生成与评审（114 张图表，Kimi 生成 + MiniMax 评审）
- QA 自动化检查（`qa-check.js` 覆盖 82 章）

### 自下而上的穷举式覆盖

不允许"抽样"替代"穷举"。项目的几个里程碑节点都体现这一原则：

- 社区调研：36 个链接全覆盖，成功抓取 37 个 URL（部分靠多源拼接），不接受"重要的看了就行"
- Prompt 审计：源码 1,902 个文件扫描出 185 个 Prompt 模板，全部收录
- 评审：82 章中 41 章完成 David Chen 技术评审，剩余章节做文科生视角全量审读，不留死角
- 数字引用：所有精确数字必须注明文件路径和行号，"大约""估计"需要显式标注

### 多视角交叉评审

单一视角的评审是危险的。同一批章节需要同时经过：技术专家视角（David Chen）发现准确性问题、零背景读者视角（小林）发现可读性断层、媒体分析师视角（Alex Wang）发现定位和市场逻辑问题。

**实践案例**：2026-04-06 夜间值班中，同一个 Token 经济学章节，David Chen 发现"10.2%数字缺来源（红线）"，Alex Wang 发现"版本数字全书不一致（红线）"，小林发现"CacheSafeParams 比喻前提知识缺口太大"。三类问题一个视角根本发现不了。

### 失败 → 蒸馏 → 防御

每次重大失败或教训，必须在任务完成后提炼成明确的"反模式"，写进 PROGRESS.md 或专项文件。此后的 Brief 必须引用这些反模式作为约束条件。

**实践案例**：API key 硬编码推送 GitHub 事故（commit `89ba7e2`）发生后，立即产出了 `handoff/SECURITY-INCIDENT-RUNBOOK-2026-04-06.md`，记录了完整的处置流程和 6 步善后清单，并将"脚本必须用 `.env` + env var"写成了第八章安全规则。

---

## 二、内容创作工作流

### 5 个阶段总览

```
Brief（Opus）
  → 草稿（Sonnet）
    → 自审（Sonnet）
      → 多视角评审（多个 Sonnet Agent）
        → 集成修复（Sonnet / Opus）
          → QA 检查（qa-check.js 自动）
```

### 阶段 1：Brief 编写（Opus 负责）

Brief 是内容的"规格书"，决定章节质量上限。一份合格的 Brief 包含：

- 章节在全书中的定位（所属 Part、依赖关系）
- 必须覆盖的源码文件和关键函数（精确到路径和行号）
- 必须避免的声索类型（"首创""独有"等过度用词）
- 比喻要求：每个核心概念必须有日常生活通俗比喻，OS 类比必须配通俗版
- 字数目标和完整度标准

**不在 Brief 里写的东西**：HOW（怎么写）。Brief 只写 WHAT（写什么），执行模型自己决定结构。

### 阶段 2：草稿写作（Sonnet 负责）

Sonnet 按 Brief 生成章节。关键约束：

- 所有精确数字引用源码位置（文件名 + 行号）
- 术语首次出现必须带注解（括号说明 + 日常比喻）
- 代码块前必须有铺垫句（"这段代码的作用是..."）
- 💡通俗理解 格式必须在每个核心概念后跟随

### 阶段 3：自审（Sonnet 负责）

草稿完成后，同一个 Sonnet 实例做一轮快速自审，检查：

- 是否有未解释就出现的技术术语
- 是否有精确数字但无来源
- 是否有"首创/唯一/最令人惊叹"等过度声索
- 比喻是否在框结束后就突然消失，正文回到高密度技术词

### 阶段 4：多视角评审（多个 Sonnet Agent 并行）

每批章节同时投给三类测试用户 Agent（各自独立上下文），汇总评审发现后按 P0/P1/P2 分级：

| 级别 | 定义 | 处理时限 |
|------|------|---------|
| P0 | 事实错误、数字来源缺失、全书数字不一致 | 必须在下次推送前修复 |
| P1 | 可读性重大断层、重要术语无解释、定位混乱 | 下一轮内容循环修复 |
| P2 | 比喻优化、过渡句补充、个别术语注解 | 积压队列，有空处理 |

**实践案例**：2026-04-05 文科生审读（小林视角，覆盖 18+章每章前 150 行），产出 5 份报告，累计标记 100+ 处术语首次出现无注解。随后针对这些报告做了 ~50 处修改，覆盖全书 6 个 Part。

### 阶段 5：QA 检查（自动）

每次内容修改后运行：

```bash
node scripts/qa-check.js
```

输出 `qa-report.md` + `qa-report.json`，检查：
- CJK 字符数（字数统计）
- OS 类比 vs 通俗比喻的平衡度
- 章节内部的 src/ 路径是否指向已知源码文件
- 完整度评分（0-5 分）

目标：0 errors（2 warnings + 1 info 属于 references 页预期行为，可接受）。

### 中间产物存放规范

| 产物类型 | 存放位置 | 是否入库 |
|---------|---------|---------|
| 评审报告（David/小林/Alex） | `handoff/test-user-reviews/` | 否（.gitignore） |
| 可读性审读报告 | `handoff/readability-audit/` | 否 |
| 社区调研原始下载 | `handoff/x-research/raw-downloads/` | 否 |
| QA 报告 | `scripts/qa-report.md` + `.json` | 是 |
| 正式章节 | `book/partX_*/` | 是 |
| 夜间值班报告 | `handoff/morning-report-YYYY-MM-DD.md` | 否 |

---

## 三、社区文献调研工作流

### 单篇评审（review-NN-xxx.md）标准模板

每篇文章评审产物必须包含：

```markdown
# 文章标题 — 评审

**来源**：URL / 平台
**作者**：作者名
**日期**：发表日期
**字数/规模**：行数或大致字数
**评分**：X/5

## 核心价值（3-10条）
## 关键发现（有可引用的具体内容）
## 与白皮书的关联（直接引用 / 可集成的洞察）
## 集成建议（目标章节 + 优先级 H/M/L）
## 局限性（不准确的地方 / 已被我们的分析超越的部分）
```

**实践案例**：`handoff/x-research/article-reviews/` 目录下 24 个独立 review 文件 + 1 个批量 review，覆盖 28 篇下载文章 + 8 个补充源。评分最高：YQ 系统论(4.8/5)、Barret Tulving(4.6/5)。

### 多轮深度评审的触发条件

以下情形触发"深度集成"而非仅做评审：

1. 评分 ≥ 4.0/5 且有具体可引用数据（精确数字、源码验证结论）
2. 文章提出了白皮书当前版本没有覆盖的重要概念
3. 用户提供了完整全文（docx/PDF），超越了公开抓取的片段

**实践案例**：servasyy_ai 分析文章（912行，中文社区最全面单篇分析），经用户提供 docx 全文后，触发第三轮深度评审，产出了 cache_edits 三步机制（书架比喻）、三通道遥测架构等多处白皮书集成内容。

### _summary.md 维护规范

`handoff/x-research/article-reviews/_summary.md` 是调研支线的单一事实来源（SoT），每轮评审完成后必须更新：

- 顶部统计数字（已评审数 / 总数 / 成功率）
- 质量排名 Top 10（每轮更新排名，不删旧条目）
- 已完成的集成条目（注明章节 + 日期）
- 新发现的集成机会（N1/N2/N3... 编号）
- 需用户手动操作的项目（列出状态）

### 反爬失败时的备选方案

遇到 403/付费墙/证书错误时，采用多源拼接而非放弃：

1. **镜像站**：engineering.fyi 拼接 OpenAI 官方被拦截的文章
2. **社区转述**：InfoQ / TheNeuron / Ignorance.ai 等二手聚合站
3. **作者个人主页**：Vivek Trivedy 个人主页 timeline 替代 X.com 付费墙
4. **学术版本**：arxiv HTML 版本代替 PDF（避免二进制乱码）
5. **搜索结果**：hn.algolia.com 替代直接访问 Hacker News
6. **用户手动提供**：将"需用户手动获取"列在 _summary.md 的 TODO 表格里

**实践案例**：Harness Engineering 深度调研中，37 个 URL 成功率约 71%（成功 37 / 失败 15），所有失败 URL 均标注了"抓取失败"和"二次源补充方案"，报告诚实披露不完整性。

### 来源管理

调研过程中下载的原始文件（HTML/Markdown）存入 `handoff/x-research/raw-downloads/`，文件命名格式：`review-NN-author-keyword.md`，编号与 _summary.md 中的 # 编号一一对应。4 个飞书链接（需登录）、X 平台内付费内容，在 _summary.md 中明确标注"需用户手动操作"，不假装已完成。

---

## 四、图表生产工作流

### 流程总览

```
Brief（Opus 写）
  → Kimi 生成（chart-pipeline-simple.sh Step 1）
    → MiniMax 评审（Step 2，自动打分）
      → 判断分数
        ├── ≥ 15/20：交付
        ├── 10-14/20：进入修订循环
        │     → 用户反馈写入 feedback/*.txt
        │     → Kimi 修订（chart-revision.sh）
        │     → MiniMax 再次评审
        │     → 选取最高分版本
        └── < 10/20：升级 Brief + 重新生成
```

注意：2026-04-05 起评分体系升级为 **25分制（5维度，各5分）**，修订轮图表使用 25 分制，首轮生产图表用旧版 20 分制，两套分制并存，对比时需注意换算。

### 评分体系（25 分制 / 5 维度）

| 维度 | 满分 | 关注点 |
|------|------|-------|
| 布局规整性 | 5 | 对齐、间距、无错位重叠 |
| 信息传达 | 5 | 核心信息一眼可见、层次清晰 |
| 视觉美学 | 5 | 配色和谐、字体选择、精致度 |
| 代码完整性 | 5 | 能否直接打开运行、无语法错误 |
| 交互功能 | 5 | 按钮/排序/筛选/悬停点击是否正常 |

等级划分（25分制）：优 ≥ 20 / 良 15-19 / 中 12-14 / 差 < 12

### Brief 写作要点

图表 Brief 必须包含以下要素，缺一不可：

```
图表ID: VIS-X-XXX
图表标题: （中英双语）
所属章节: 
核心信息: 这张图要让读者一眼看懂什么？（1-2句话）
数据内容: （精确数字、类别、层级关系）
图表类型建议: （流程图/时序图/树图/热力图等）
交互要求: （有/无，若有列举具体交互）
布局约束: （宽高比、分组方式）
反模式规避: （从已知反模式清单中选择适用的）
参考风格: （暗色主题/数据可视化专业风/等）
```

### 已知反模式清单

以下是经过真实失败教训积累的反模式，每次生成新图表前必须在 Brief 中声明需要规避哪些：

1. **SVG 坐标硬编码**：图表元素用绝对 pixel 坐标定位，导致调整一处需重算整体，几乎无法修订
2. **斜线蜘蛛网**：弯曲连接线随机走向，视觉混乱；约束：所有连线优先水平/垂直
3. **六边形端点错位**：SVG 六边形顶点计算精度不够，导致连线末端悬空
4. **泳道斜向排列**：泳道图应严格水平或垂直分割，不能有倾斜
5. **同名变量值漂移**：不同图表中 `--accent-orange` 指向不同 hex 值，嵌入同页面时变量冲突
6. **文字被图形遮挡**：标签压在节点上或超出图表边界
7. **空数据图表**：交互式图表里的数据未填充，看起来是模板
8. **科幻紫调脱轨**：VIS-1-001 曾使用完全不同的紫黑色调，破坏品牌视觉一致性
9. **中文衬线体**：宋体/仿宋绝对不能用于信息图表标签

**实践案例**：DESIGN-SYSTEM-SPEC.md 发现 `--accent-orange` 在三个文件里分别是 `#f0883e` / `#d29922` / `#f85149`，即同一变量三种值。这个发现直接促成了 `cc-design-tokens.css` 的统一 token 规范。

### 修订循环标准

修订的触发文件在 `test-viz/revisions/feedback/VIS-*.txt`，每个文件是用户对该图表的原始评论（完整保留，不做删改）。修订脚本读取这个文件后，连同原始 Brief 和现有 HTML 一起喂给 Kimi。

v2 修订：仅根据用户反馈修订（`chart-revision.sh`）
v3 修订：在用户反馈基础上，额外加入 MiniMax 的缺陷分析（`chart-revision-v3.sh`）

**实践数据**：两轮修订（v2 + v3）中，8/10 低分图表有改善，平均提分 +3.6，最高 +10（VIS-1-011：v2 得 11 → v3 得 21）。4 个图表因 SVG 坐标复杂度达到 Kimi 自动生成瓶颈，需人工干预。

### 自动化 80% + 人工 20% 原则

自动化负责可重复的、规则明确的部分（生成/评审/修订）；人工负责不可自动化的部分（判断"达到瓶颈的 4 个图表怎么处理"、"25 分还是 20 分制"等决策）。

不要试图让自动化覆盖 100%，SVG 复杂布局的边界情况只能靠人工干预，这是已经被验证的事实。

---

## 五、测试用户评审工作流

### 三类身份模板

本项目使用三个固定 Persona，每次召唤时用对应的身份设定 prompt 启动独立 Sonnet 实例。

#### Persona 1：David Chen（技术专家 CTO）

**背景**：AI 基础设施 CTO，10 年以上系统架构经验，读过 Claude Code 源码。
**评审视角**：技术准确性、数字可追溯性、安全含义、架构判断的边界条件。
**典型发现**：
- 精确数字缺来源（"10.2% 缓存节省"无源码引用）
- 安全声索需要代码锚点（"Hook 只能收紧权限不能放松"需要给出函数位置）
- 技术注释混进正文（Agent Hook 的 `dontAsk` 权限说明位置不对）

**盲点**：不关注文字流畅度，不会发现比喻是否通俗。

**评分维度**：技术准确性 / 可引用性 / 深度洞察 / 批判性
**报告文件**：`handoff/test-user-reviews/review-david-chen.md`

#### Persona 2：小林（文科生新手）

**背景**：中文系大三，零编程经验，第一次接触 AI 源码分析。
**评审视角**：比喻是否讲得通、术语首次出现有没有解释、章节节奏是否有跳跃感。
**典型发现**：
- 比喻和正文脱节（红绿灯比喻说完立刻跳到 POSIX 标准）
- 技术注脚混进正文段落（dontAsk 权限说明）
- Fail-Open 策略章节无过渡，突然切换话题
- 表格打断阅读节奏（比喻 tip 框插在表格行之间）

**盲点**：不能判断技术内容是否准确。

**评分维度**：可读性（1-5分）/ 能否用一句话复述 / 迷路点（最多3处）/ 最好/最差比喻
**报告文件**：`handoff/test-user-reviews/review-xiaolin.md`

#### Persona 3：Alex Wang（科技媒体分析师）

**背景**：科技媒体分析师，写过多篇 AI 工具深度评测，了解市场竞争格局。
**评审视角**：差异化优势、市场定位、全书数字一致性（影响可信度的红线问题）、目标读者是否分流清晰。
**典型发现**：
- 版本数字内部不一致（"74 章"vs"82 章"、"29 万字"vs"35 万字"）
- 缺少"分析截止日期"标注（AI 赛道一季度可以让分析过时）
- 目标读者召唤词不明确（CS 学生、高级工程师、创业者应从哪章开始？）
- 推荐定位：打"中文第一部 AI Agent 架构白皮书"标签而非"源码分析"

**盲点**：不深究技术细节的正确性。

**报告文件**：`handoff/test-user-reviews/review-alex-wang.md`

### 评审产物的结构

每份测试用户评审报告结构：

```markdown
# [Persona 名] 评审报告 — [日期]

## 覆盖章节
（列出本次评审了哪些章节）

## 章节一：[章节名]
评分：X/5
优点（3条）
需要改进的问题（3条，含文件路径+行号）
整体一句话评价

## 章节二：...

## 综合建议
（跨章节共性问题）
```

### 将评审反馈转化为修复任务

评审报告汇总后，Opus 负责提取和分级，输出到夜间值班报告的"需修复问题"表格：

```markdown
| 优先级 | 问题描述 | 来源 Persona | 修复状态 |
|--------|----------|-------------|---------|
| P0 | 全书数字不一致(82章写成74章) | Alex Wang | ✅ 已修复：references.md |
| P0 | 精确数字缺来源(10.2%) | David Chen | ✅ 已修复：Token 经济学章节 |
| P1 | Hooks 章节可读性 2/5 | 小林 | ✅ 已改善：比喻过渡/注脚移位 |
| P2 | CacheSafeParams 比喻需重做 | 小林 | 待修 |
```

P0 必须在本次推送前修复，P1 在下一轮内容循环处理，P2 进入积压队列。

---

## 六、Code Review 工作流

### 触发条件

- 每次 git push 前，特别是包含脚本改动的 commit
- 引入新 JS 文件或大幅修改现有 JS 文件后
- 修改 CSS 超过 50 行后
- 新增 shell 脚本后（必须 API key 安全检查）

### 检查维度

Code Review 子 Agent（独立 Sonnet 实例）按以下维度逐一审查：

**内容侧**：
- Markdown 文件有无语法错误、编码问题
- 数字是否与 PROGRESS.md 一致
- 是否有未清理的占位符（XXX / [待补充]）

**工程侧**：
- CSS 是否有重复定义（不同时期的同名 selector 并存）
- JS 是否有内存泄漏风险（addEventListener 无对应 removeEventListener）
- 硬编码绝对路径（`/Users/hero/Desktop/...`）
- 硬编码 API key（`sk-` 前缀、`Bearer ` 开头）
- `.gitignore` 覆盖范围是否正确（`handoff/` / `test-viz/` / `.env` 是否在其中）

**安全侧**（P0 级，必须通过才能 push）：
- `grep -r "sk-"` 未命中任何非 `.env` 文件
- `grep -r "Bearer "` 未命中任何脚本
- `grep -r "/Users/"` 未命中任何脚本（路径改为相对路径）

**实践案例**：2026-04-06 Code Review 发现 6 个 shell 脚本内含硬编码 API key，且已经在 commit `89ba7e2` 中推送到 GitHub 公开仓库。这是本项目最严重的安全事故，发现时点是推送之后而非之前，说明"推送前做 Code Review"的规则尚未落实到位。

### P0/P1/P2 分级标准

| 级别 | 定义 | 处理方式 |
|------|------|---------|
| P0 | 安全风险 / 阻塞功能 / 数据丢失 | 必须修复后才能 push |
| P1 | 功能缺陷 / 内容数字不一致 / UX 问题 | 下一次 commit 处理 |
| P2 | 代码质量 / 性能优化 / 技术债 | 积压，专项 refactor 时处理 |

**P0 案例（本项目实际发生）**：
- 6 个脚本硬编码 API key 推送 GitHub（已发生事故）
- CSS 重复定义（两套 `.review-mode-btn` selector 共存，靠特异性"幸运"救场）
- 首页"74 章 / 288,000+ 字"与实际"82 章 / 353,586 字"不一致（信任危机）

**P1 案例**：
- `js/inspiration-lab.js` 从 `handoff/brainstorm/sparks-v1.json` 拉数据，而 `handoff/` 在 `.gitignore` 里，线上 404
- `js/chart-embed.js` 依赖 `test-viz/chart-embedding-map.json`，同理 `test-viz/` 在 `.gitignore`，线上所有图表占位符无法替换

### 自动修复 vs 用户决策的边界

Code Review 子 Agent 默认**不自动修复**，只输出报告，除非：

- 修复是纯机械性改动（拼写错误、多余空行、明确错误的文件路径）
- 修复不涉及任何业务决策（不需要判断"保留旧版 CSS 还是新版"）
- 修复影响范围可以精确圈定（单文件，且修复前后行为完全相同）

用户必须决策的类型：
- 删旧版 CSS 还是新版 CSS（两套并存时）
- API key revoke + git 历史清理（需要用户登录控制台操作）
- `handoff/` 数据是否 force-add 进仓库（架构决策）

---

## 七、子 Agent 调用规范

### 模型选择矩阵

| 任务类型 | 推荐模型 | 调用方式 | 理由 |
|---------|---------|---------|------|
| 全局战略决策 / Brief 写作 / 综合评审 | Opus | 主进程（当前会话） | 需要全局视角和最强推理 |
| 章节写作 / 单篇评审 / 代码修复 | Sonnet | `claude -p` headless | 性价比最高，上下文独立 |
| 图表 HTML 生成 | Kimi | `claude -p` with `ANTHROPIC_BASE_URL` | frontend-design skill 专化 |
| 图表质量评审 | MiniMax M2.7 | `claude -p` with `ANTHROPIC_BASE_URL` | 多模态视觉理解能力 |
| 网络调研 / 深度搜索 | Sonnet（claude-code-guide 配置） | `claude -p` | WebFetch + WebSearch 工具集 |

### 调用 Kimi 的 shell 模板

```bash
call_kimi() {
    ANTHROPIC_BASE_URL="https://api.kimi.com/coding/" \
    ANTHROPIC_API_KEY="${KIMI_API_KEY}" \
    ENABLE_TOOL_SEARCH=false \
    claude -p "$1" --output-format text < /dev/null 2>/dev/null
}
```

注意：`KIMI_API_KEY` 必须来自环境变量，不能硬编码。

### 调用 MiniMax 的 shell 模板

```bash
call_minimax() {
    ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic" \
    ANTHROPIC_API_KEY="${MINIMAX_API_KEY}" \
    ANTHROPIC_MODEL="MiniMax-M2.7" \
    API_TIMEOUT_MS=300000 \
    ENABLE_TOOL_SEARCH=false \
    claude -p "$1" --output-format text < /dev/null 2>/dev/null
}
```

### 子 Agent Prompt 写作要点

一个有效的子 Agent prompt 必须包含四个部分：

**1. 背景（Context）**：告诉 Agent 它在一个什么样的项目里、当前的任务是什么阶段的产物。
```
你是《Claude Code 源码白皮书》项目的技术评审 Agent。
本书目前已完成82章/35万字，正在进行多视角测试用户评审。
```

**2. 任务（Task）**：精确、可验证的任务描述。不写"帮我评审一下"，写"按以下五个维度，对以下三章内容做独立评审，每章每个维度输出一段评语和一个1-5分的评分"。

**3. 限制（Constraints）**：什么不能做、什么必须做。
```
- 评分必须有对应的具体文本证据（文件名+行号）
- 不能给出无依据的"感觉上"判断
- 精确数字如果不知道来源，必须标注"来源不明"而非假装知道
```

**4. 输出格式（Output Format）**：精确定义产物的结构，避免 Agent 自由发挥导致后续处理困难。
```
输出格式：
## 章节名
评分：X/5
优点（3条）：
问题（3条，含文件:行号）：
整体评价（一句话）：
```

### 后台运行 vs 前台运行

| 情形 | 建议 | 理由 |
|------|------|------|
| 批量图表生成（每张 2-5 分钟，共 20+ 张） | 后台脚本循环 | 不占用主会话，用户可以去睡觉 |
| 社区文章批量评审（30+ 篇） | 多个子 Agent 并行 | 各 Agent 上下文独立，不相互污染 |
| 单章深度修复（需要 Opus 盯着） | 前台主进程 | 需要随时决策和调整 |
| 夜间值班任务 | 后台（写成 morning-report 交接） | 不阻塞用户，次日晨读报告 |

**实践案例**：120 个火花的"next_step 三段式改写"任务，使用 4 个 Sonnet 子 Agent 并行处理（每个负责 30 个火花），比串行处理快约 4 倍。

### 子 Agent 之间的并行 vs 串行依赖

**可以并行**（无数据依赖）：
- David Chen 评审 + 小林评审 + Alex Wang 评审（各自独立）
- 不同章节的 QA 检查
- 不同 VIS-ID 的图表生成

**必须串行**（有数据依赖）：
- Kimi 生成图表 → MiniMax 评审（必须先有 HTML 才能评审）
- Brief 写作（Opus）→ 草稿写作（Sonnet）
- 多轮评审汇总 → 修复任务提取 → 修复执行

---

## 八、安全与隐私

### 硬性规则（没有例外）

**规则 1：绝对不硬编码 API key**

任何脚本中的 API key 必须通过环境变量引用：

```bash
# 正确
ANTHROPIC_API_KEY="${KIMI_API_KEY}"

# 错误（绝对禁止）
ANTHROPIC_API_KEY="sk-kimi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

`.env` 文件必须在 `.gitignore` 里。仓库里只提交 `.env.example`（所有 value 用 `xxxx` 占位）。

**规则 2：绝对不硬编码绝对路径**

```bash
# 正确
cd "$(dirname "$0")/.."

# 错误（绝对禁止）
cd /Users/hero/Desktop/CC-Research-byClaude/web
```

硬编码用户名路径既暴露用户身份，又让脚本无法在任何其他机器上运行。

**规则 3：push 前必须 grep 过敏感字符串**

```bash
# 每次 push 前手动运行
git diff HEAD --name-only | xargs grep -l "sk-" 2>/dev/null
git diff HEAD --name-only | xargs grep -l "Bearer " 2>/dev/null
git diff HEAD --name-only | xargs grep -l "/Users/" 2>/dev/null
```

如果有命中，必须修复后才能 push。

### handoff/ 目录的隐私保护

`handoff/` 目录在 `.gitignore` 里，原因：

1. 包含用户的工作中间产物（评审报告、夜间值班报告）
2. 包含下载的外部文章内容（版权风险）
3. 包含安全事故相关文件（secrets-to-purge.txt）

`.gitignore` 中的 `handoff/` 是全局排除，不能 `git add -f` 其中的任何文件，除非有明确的业务原因（如 `brainstorm/sparks-v1.json` 需要线上访问时，应迁移到 `js/` 或 `book/_shared/` 目录而非 force-add）。

### 安全事故处置流程

一旦发现 API key 已经推送到公开 GitHub 仓库：

1. **立即**到对应控制台 revoke 旧 key（5 分钟内）
2. 生成新 key，写入本地 `.env`（不提交）
3. 更新所有脚本，用 `${ENV_VAR}` 引用
4. 视情况运行 `git filter-repo` 清理历史（注意：会改写所有 commit hash）
5. 检查 GitHub Secret Scanner 告警并标记为 "Revoked"
6. 检查控制台账单记录，确认没有异常调用

参考文件：`handoff/SECURITY-INCIDENT-RUNBOOK-2026-04-06.md`（2026-04-06 事故完整处置记录）

---

## 九、自我进化机制

### 任务蒸馏原则

每完成一个有教训的任务（无论成功还是失败），必须在任务结束时产出一段"蒸馏"：

- 任务类型是什么
- 出乎意料的发现是什么
- 下次同类任务应该注意什么
- 如果这个发现是"反模式"，写进对应的 SOP 章节（图表反模式 → 第四章 / 安全反模式 → 第八章）

**不允许的做法**：任务完成，直接关闭，什么也不写。"我下次会记得"不是可靠机制，跨会话之后上下文会消失。

### PROGRESS.md 的维护规范

PROGRESS.md 是项目的单一事实来源（SoT），每次重大里程碑后必须更新：

- 顶部概况数据（章节数/字数/QA issues/图表进度）
- 对应章节的 `[x]` 状态（不要只更新标题行，要更新具体的子条目）
- 新发现的 anti-pattern 写入相应章节，而不是只写在 handoff/ 里

### 用户反馈优先原则

当用户反馈与 Agent 自身判断产生冲突时，默认接受用户反馈，并主动追问"为什么"。不能辩解"我的判断在技术上是对的"。

**实践案例**：图表管线从复杂的 v1（4 步：Gemini 设计 → Kimi 生成 → MiniMax 评审 → 竞赛排名）简化到 v2（2 步：Kimi 生成 → MiniMax 评审），是用户提出"流程太复杂"后主动简化的。旧管线已归档到 `test-viz/_archive/pipeline_v2/`。

### 跨任务复用 Anti-Pattern

当一个任务发现了新的 anti-pattern，必须检查是否有已完成的产物也犯了同样的错误，并纳入修复计划。

**实践案例**：Alex Wang 评审时发现"全书数字不一致"，随后不只是修复序章，而是触发了全书的数字一致性核查（`index.html` / `200.html` / `data.js` / `references.md` 多文件联动修复）。

### 故障模式速查（出过事的）

> **编号约定**：FM-01 起递增，新故障一律追加到表尾，不许复用编号。引用时用 `FM-XX` 短码。

| 编号 | 故障 | 表象 | 根因 | 永久修复 |
|------|------|------|------|---------|
| FM-01 | API key 推上 GitHub | secret scanner 报警 / 公网可搜 | 脚本里硬编码 | 必须 `.env` + env var；脚本前置 `set -a; . .env; set +a`；CI 加 secret-scan |
| FM-02 | 线上 404（数据文件） | 浏览器 Network 404，前端功能空白 | 数据文件在 `.gitignore` 里没入库 | `.gitignore` 用 `!path/to/file.json` 显式例外 + `git add -f`；上线后跑 URL 拨测 |
| FM-03 | Chrome `-1712` not responding | `open -a "Google Chrome"` 失败，CodeX/双击都打不开 | Playwright headless Chrome 异常退出留下了带 `--no-startup-window` 的残留进程，LaunchServices 把整个 Chrome.app 标记为"不响应" | `pkill -9 -f playwright_chromiumdev_profile`；脚本里跑 Playwright 必须 trap EXIT 清理；headless Chrome 必须用 `--user-data-dir=$(mktemp -d)` |
| FM-04 | filter-repo 后 origin 丢失 | `git push` 报无远端 | filter-repo 默认会 strip remotes 防误推 | 跑完 filter-repo 立即 `git remote add origin <url>` |
| FM-05 | 子 Agent token 命名冲突 | 两个子 Agent 各自定义 `--cc-*` vs `--color-*` | 没有共享的命名 spec | 主 Agent 在派发前先固定 token 命名规范，写进每个子 Agent 的 brief |
| FM-06 | MiniMax M2.7 headless 长 HTML 生成挂死 (**复发率 4/N**) | `claude -p ... --output-format text` 调用 MiniMax 生成 ~60KB HTML，命令挂起 7-15 分钟无任何输出，最终需手动 kill。表面看像 API 不响应。**2026-04-07 凌晨值班轮 #4 复发 3 次**：Block 6 (12 分钟 kill PID 83455) / Block 8 (7 分钟 kill PID 83947) / Block 7a 之前一次。复发率统计：4 次故障 / 9 次 MiniMax 调用 = ~44% | MiniMax M2.7 在生成长输出时**实际调用了 Write 工具**（用 empty input），陷入"Write 失败 → thinking → 再次 Write empty"死循环；`text` 模式吞没工具调用事件，看不到任何反馈。**新观察 (2026-04-07)**：即使 Brief 明确说"不要调用工具"也无效——MiniMax 把"不调用工具"当软提示，仍然 Write 文件 + stdout 改为 chat 报告 (FM-16)。此外有时被 kill 的 process 会在几分钟后**晚到救援**写出完整 HTML（Block 6 案例），说明 process 实际还活着只是 stdout 被堵 | ① 必须加 `--disallowedTools "Write Edit Read Bash Glob Grep NotebookEdit MultiEdit"` 关掉所有文件类工具；② prompt 末尾大写警告"严禁调用任何工具，只能输出纯文本响应"；③ **永远用** `--output-format stream-json --verbose` 而非 `text`，30 秒内能看到 thinking trace 是否前进；④ Kimi 没这个问题，是 MiniMax 专属故障；⑤ **(新增 2026-04-07)** 复杂 Brief (>20KB) 直接 Kimi-only 跳过 MiniMax，节省 7-15 分钟等待时间；⑥ **(新增)** kill 后保留 Block 文件夹观察 5 分钟，可能 MiniMax 晚到救援写出有效 HTML 可作为 backup |
| FM-07 | 子 Agent "伪合规" Token 引用 | Demo HTML head 引用了 `cc-design-tokens.css`，但在自身 `<style>` 块里又重声明了同名 `--cc-*` 变量，实际渲染走自定义颜色而不是项目 token——肉眼看是合规的，行为上完全失效 | 模型理解"使用 token"为"声明同名变量"而不是"消费已暴露的变量"，比明显违规更危险因为难发现 | Brief 必须显式写："禁止在 `:root` 或任何 selector 里重声明任何 `--cc-*` 变量，必须直接消费 `cc-design-tokens.css` 已暴露的 246 个变量"；交付后用 grep 验证 `:root` 块内是否有 `--cc-` 重声明 |
| FM-08 | MiniMax 内容幻觉（凭空时间点 / 概念升级） | MiniMax 在生成 V2 Demo 时凭空写"2023 年秋发布"，把章节里只是"演进第三阶段"的概念宣告为"理解 X 的核心" | 长上下文生成时模型会主动"补全"叙事钩子，技术白皮书场景下这是事实污染 | ① Brief 末尾加"严禁添加原 markdown 没有的任何时间点、人物、产品事实"；② 交付后必须 Sonnet 子 Agent 跑一轮"原文 vs Demo 文字"diff 清洗；③ Kimi 同任务幻觉率显著低于 MiniMax，长 HTML 优先用 Kimi |
| FM-09 | 硬数字漂移（约等于简化） | Brief 期望 "476,875 行"，HTML 实现里渲染成 "~250K"，差近一半。出处：VIS-0-002 源码统计仪表盘，详见 `handoff/v2-prologue-vis-soul-2026-04-06.md` | 图表生成时模型对原始数字做了不必要的"约等于简化"，把硬数据当成"装饰性大数"处理，导致事实失真 | ① Brief 必须把所有"硬数字"列在显眼位置（开头 `## 硬数字清单` 段），并写明"严禁约等于简化，必须逐位还原"；② 子 Agent 评审 prompt 增加"硬数字逐位核对"项；③ 交付后用 grep 自动扫描 HTML 是否含 `~\|约\|大约\|approx\|K$\|M$` 等近似符号，命中即打回 |
| FM-10 | 视觉形式错误（忽略 Brief 形式禁令） | Brief 明确写"雷达图不合适，改用组合柱状图"，HTML 实现里仍然画了雷达图。出处：VIS-0-013 MCP 传输方式对比 | 子 Agent 跳过 Brief 末尾的"形式约束"段落，只看了"内容"而没看"形式禁令"，把 Brief 当成纯需求清单读 | ① Brief 末尾必须加 `## 视觉形式硬约束` 段落，使用大写关键词如 `MUST NOT USE` / `必须使用` 强调；② 评审 prompt 增加一项"形式合规检查"——比对 Brief 形式约束段与最终图表类型；③ 形式禁令应同时出现在 Brief 开头和结尾，避免长文档中段被忽略 |
| FM-11 | 随机数据补全（凑数代替留空） | 知识图谱用 `while(chapters.length<74)` 把不足 74 章的数据用随机数补满。出处：VIS-0-014 本书知识图谱 | 模型在没有真实数据时用随机值"凑数"，而不是返回空数据或主动报错；在视觉上看起来"完整"但全是噪声 | ① Brief 强调"真实数据优先，宁可空也不要凑数；缺数据必须显式空状态或报错"；② 评审 prompt 增加 grep 检查 `Math.random\|while.*length\s*<\|fill.*random`；③ 交付后人工抽样校验数据点对应真实章节而非随机 |
| FM-12 | 字体跨图漂移 | 序章 15 张图用了 5 种不同字体（系统默认 / Segoe UI / Helvetica / SF Pro / 衬线 fallback），全书视觉一致性崩坏 | 每张图独立生成，没有统一字体 token；子 Agent 各自挑选"看起来像技术白皮书"的字体 | ① 项目级字体 token 加到 `cc-design-tokens.css`（`--cc-font-sans` / `--cc-font-mono`）；② Brief 明确要求"必须 `var(--cc-font-sans)` 和 `var(--cc-font-mono)`，禁止任何 `font-family` 硬编码"；③ 评审 grep 扫描 `font-family\s*:` 后是否仅出现 `var(--cc-font-` |
| FM-13 | 终端崩溃后台 sub-agent 全死 | Claude Code 主进程意外退出 / 用户切换终端 / 网络断 → 该会话内 launched 的 Agent sub-agent 全部死亡，CronCreate 也死，TaskList 清空，本次对话上下文全丢。出处：2026-04-07 01:10 终端 #1 崩溃，14h 55m 工作半数未 commit | 会话级生命周期：所有 Agent 工具 launched 的 sub-agent 是 Claude Code 主进程的 child，会话死它们死。Bash background 在 nohup 包装下**有时**能脱钩存活（实测 2026-04-07 01:25 launched 的 7 个 background tasks 在终端 #2 内全部跑完），但**不能依赖**。CronCreate 的定时任务 100% 会话级，会话死立刻死 | ① 每个 30 分钟值班轮结束**必须** atomic commit，不允许任何工作"裸奔"超过 30 分钟；② 任何高风险动作（开多个 sub-agent / 切终端 / 改 settings / 大改 .gitignore）**前**先写 `handoff/SESSION-HANDOFF-YYYY-MM-DD-HHMM.md` 交接文件，包含 (a) 上下文回顾 (b) background tasks 清单 + 期望产出路径 (c) 下一会话立刻要做的事 + 启动咒语；③ 派 sub-agent 时**必须**要求它把产物落盘到 `handoff/*.md`，而不是只在 result 字段返回——文件即"可恢复状态" |
| FM-14 | settings.json bypass 模式不被即时尊重 | 在已运行的会话里改 `~/.claude/settings.json` 加 `defaultMode: bypassPermissions`，期望立即生效——**实测不生效**，工具仍弹确认。出处：2026-04-07 01:17 终端 #2 创建 `web/.claude/settings.local.json` 含 `defaultMode: bypassPermissions` + 16 条 allow，bash 测试通过但实际操作仍弹窗 | Claude Code 在 session start 时读一次 settings；运行时改 settings.json 不会即时 reload。`permissions.allow` 白名单**每个工具调用都重读**所以可以即时生效，但 `permissions.defaultMode` 是启动时解析的，必须新会话才生效。可能还有 managed/policy settings 优先级更高 | ① bypass 模式**必须**在启动时用 `claude --dangerously-skip-permissions` CLI flag，不要靠 settings.json；② 可以用 `permissions.allow` 加白名单作为补救（命中白名单的工具不弹），但 fallback ≠ 真 bypass；③ **绝不**在用户睡前指望"改 settings.json 开 bypass"这条路；④ 如果 `--dangerously-skip-permissions` 也不行，启动后立刻 `/permissions` 检查实际加载的规则（可能被管理设置覆盖） |
| FM-15 | `disown` ≠ `nohup`（后台子进程被 SIGHUP 杀死） | `scripts/block-doublerun.sh` 修复 FM-14 衍生 stdin redirect 问题时改成 `( exec </dev/null; claude -p ... ) & disown` 模式。`bash -n` 通过、ps 短暂可见，但 0.5 秒后子进程死亡，0 字节 HTML + 0 字节 log。出处：2026-04-07 02:32 终端 #3 Block 4 双跑首次失败 | `disown` 仅从 job table 移除，**不**屏蔽父 shell 退出时发送的 SIGHUP；当 Bash 工具的短期 subshell 退出，孤儿子进程被 init/launchd 接管前还是会收到 SIGHUP 而死。`nohup` 才会真正屏蔽 SIGHUP（创建 PID 1 reparent + 重定向 stdin/out/err） | ① **不要用 `disown` 替代 `nohup`**：要么 `nohup ... &`（自带 SIGHUP 屏蔽），要么 `setsid bash -c '...' &`（创建新 session），要么 `disown -h`（明确标记不发 SIGHUP）；② **更可靠的做法**：直接通过 Claude Code Bash 工具的 `run_in_background=true` 跑 `claude -p ...`，跳过脚本包装层，bash 工具有自己的进程管理生命周期能横跨 tool calls 存活；③ stdin redirect 仍要保留（`exec </dev/null` 或 `< /dev/null`）防 FM-14 的 stdin warning |
| FM-16 | sub-agent 不遵守"零工具调用 / 零 markdown 围栏"指令 | (a) Brief 末尾 prompt 写"不要任何调用工具，单次输出一个完整文件"，**MiniMax 仍用 Write 工具**保存到 disk 并把 stdout 改成 chat 报告（919 / 1137 字节），需要重命名 + 跨 stdout 抓取真实文件；(b) **Kimi 仍把 HTML 包在 ` ```html ... ``` ` 里**，需要 sed 剥围栏。两者都违反 Brief §0 的明确禁令但产物可用 | 子 Agent 把"不调工具 / 不加围栏"当成软提示，在生成 HTML 时按"我对话风格的默认行为"行事——MiniMax 偏好把代码保存到文件 + 给个总结消息；Kimi 偏好用 markdown fence 包代码块。Headless `claude -p text` 模式无法关闭这种"风格性副作用" | ① **下游清洗 pipeline 必出**：sed `-n '/<!DOCTYPE/,/<\/html>/p'` 是 Kimi 围栏剥离的标准动作；MiniMax 输出后必须 `mv prologue-block-X-kimi-*.html prologue-block-X-minimax-clean.html` 修文件名（MiniMax 偏好抄 Brief §6 占位 `<kimi\|minimax>` 选 kimi）；② **Brief 显式宣告"主程序会自动清洗围栏"**让模型放心输出 fenced HTML 避免再额外加 escape；③ MiniMax 的 Write 文件路径要求 Brief §6 改成 minimax-suffix 版而不是 `<kimi\|minimax>` 占位 |

**沉淀规则**：每次出现 `_LSOpenURLsWithCompletionHandler` / `secret scanner` / `404 on prod` / 跨子 Agent 冲突 / MiniMax 挂死 / 伪合规 / 内容幻觉 / 硬数字漂移 / 形式禁令被忽略 / 随机数据凑数 / 字体漂移 / 终端崩溃丢工作 / settings.json 不即时生效 / disown ≠ nohup / sub-agent 风格性副作用 这几类问题，必须更新本表，不允许只在某次对话里讲完就忘。新条目编号继续递增（下一条 FM-17），不允许复用历史编号。

---

## 十、工具速查表

### 核心脚本

| 脚本 | 位置 | 功能 | 典型用法 |
|------|------|------|---------|
| `qa-check.js` | `scripts/qa-check.js` | 全书 QA 检查（CJK 字数/比喻平衡/src 路径/完整度） | `node scripts/qa-check.js` |
| `chart-pipeline-simple.sh` | `scripts/chart-pipeline-simple.sh` | 单张图表：Kimi 生成 + MiniMax 评审 | `./scripts/chart-pipeline-simple.sh briefs/VIS-X-XXX.txt` |
| `chart-batch-produce.sh` | `scripts/chart-batch-produce.sh` | 批量图表生产 | `./scripts/chart-batch-produce.sh` |
| `chart-revision.sh` | `scripts/chart-revision.sh` | 单张图表修订（基于用户反馈 + 原 HTML） | `./scripts/chart-revision.sh VIS-0-001` |
| `chart-revision-v3.sh` | `scripts/chart-revision-v3.sh` | 增强修订（含 MiniMax 评审反馈） | `./scripts/chart-revision-v3.sh VIS-0-001` |
| `batch-revision.sh` | `scripts/batch-revision.sh` | 批量修订（读取 review mode 导出的 feedback JSON） | `./scripts/batch-revision.sh feedback.json` |
| `build-search-index.js` | `scripts/build-search-index.js` | 重建全文搜索索引 | `node scripts/build-search-index.js` |

### handoff/ 子目录用途

| 目录 / 文件 | 用途 | 是否入库 |
|------------|------|---------|
| `handoff/morning-report-YYYY-MM-DD.md` | 夜间值班报告（每次夜间任务后产出） | 否 |
| `handoff/code-review-YYYY-MM-DD.md` | Code Review 报告 | 否 |
| `handoff/test-user-reviews/` | 三类 Persona 测试用户评审报告 | 否 |
| `handoff/readability-audit/` | 文科生视角全书审读报告 | 否 |
| `handoff/x-research/` | 社区文献调研全部产物 | 否 |
| `handoff/x-research/article-reviews/` | 逐篇文章评审报告 | 否 |
| `handoff/x-research/article-reviews/_summary.md` | 调研支线 SoT（汇总报告） | 否 |
| `handoff/x-research/raw-downloads/` | 36 篇文章原始下载内容 | 否 |
| `handoff/brainstorm/` | 灵感系统（火花/蓝图 JSON） | 否（但线上功能需要迁移到可访问路径） |
| `handoff/SECURITY-INCIDENT-RUNBOOK-2026-04-06.md` | API key 泄露事故处置 Runbook | 否 |
| `handoff/secrets-to-purge.txt` | git-filter-repo 清理列表 | 否 |

### test-viz/ 目录结构

| 目录 | 用途 |
|------|------|
| `test-viz/production/html/` | 所有 114 张图表的最终版 HTML |
| `test-viz/production/reviews/` | 每张图表的 MiniMax 评审文本 |
| `test-viz/revisions/VIS-*_MMDD_HHMM/` | 每次修订的时间戳版本 |
| `test-viz/revisions/feedback/` | 用户对每张图表的原始反馈文本 |
| `test-viz/_archive/` | 旧版管线产物（已废弃但保留参考） |
| `test-viz/DESIGN-SYSTEM-SPEC.md` | 设计系统规范（v0.1 草案） |

### 常用 One-Liner

```bash
# 运行 QA 检查
node scripts/qa-check.js

# 生成单张图表
./scripts/chart-pipeline-simple.sh test-viz/briefs/VIS-0-001.txt

# 修订单张图表
./scripts/chart-revision.sh VIS-0-001

# 重建搜索索引
node scripts/build-search-index.js

# push 前安全检查
git diff HEAD --name-only | xargs grep -l "sk-\|Bearer \|/Users/" 2>/dev/null

# 查看 QA 报告
cat scripts/qa-report.md
```

---

*本文档由 Claude Sonnet 4.6 根据项目实际产物提炼，于 2026-04-06 首次发布。*
*修订此文档的条件：项目演化出新的已验证工作流，或现有流程经实践发现需要调整。*
*不要在此文档中记录"计划中的流程"——只记录"已经跑通的流程"。*
