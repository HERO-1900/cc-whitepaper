# Claude Code 项目级指令 — Claude Code 源码白皮书

> 本文件每次新会话启动时自动加载到 system prompt，命中 prompt cache，**不消耗用户每轮 token**。
> 修改本文件 = 永久改变 Claude 在本项目里的默认行为。
> 完整工作流见同级 `SOP.md`。

---

## 项目身份

- **项目名**：Claude Code 2.1.88 源码白皮书（中文）
- **仓库**：https://github.com/HERO-1900/cc-whitepaper
- **线上**：GitHub Pages — https://hero-1900.github.io/cc-whitepaper/
- **规模**：82 章 / 约 35.4 万 CJK 字符 / 114 张图表 / 185 个 Prompt 全收录
- **SoT 源代码**：`~/Desktop/Claude Code源代码合集 copy/Claude Code源代码1号/cc-recovered-main/`
- **母工作区（项目根）**：`~/Desktop/CC-Research-byClaude/` ← **所有相关文件、子项目、调研、笔记的总目录**
- **当前 git repo（白皮书 web 版）**：`~/Desktop/CC-Research-byClaude/web/` ← 仅是母工作区下的一个子目录
- **重要纪律**：不要把"web/"误认为母工作区。母工作区里还有其他姐妹目录（笔记、素材、未发布资料等），引用任何文件路径时先确认它在 `web/` 还是在 `web/` 之外。代码整洁是开源前提，文件位置错放会导致后续连带 bug。

### 已知陷阱：双版本 book/

母工作区根目录有一份**过时**的 `~/Desktop/CC-Research-byClaude/book/`（79 个 .md），是早期工作的历史副本。**权威版本是 `~/Desktop/CC-Research-byClaude/web/book/`（87 个 .md）**——多 8 个新章节，且 34 个文件已发生内容分歧。

- ✅ **新写章节、修正章节**：只动 `web/book/`
- ❌ **绝不**往根目录 `book/` 写新内容
- ❌ **绝不**从根目录 `book/` 复制内容覆盖 `web/book/`（会引入旧版本回归）
- 根目录 `book/` 应当视为只读历史归档

## 协作风格（用户约定，必须遵守）

1. **中文交流**。代码注释、commit message、UI 文案全用中文。
2. **自主执行优先**。小改动、常规操作直接执行到底，不要每一步停下来问。**只有不可逆 / 影响线上 / 涉及决策时才停**。
3. **子 Agent 优先**。能让子 Agent 干的事不要 Opus 自己干。子 Agent 默认用 **Sonnet**，专项任务用 Kimi/MiniMax，**不要默认开 Opus 子 Agent**。
4. **质量问责制**。不允许草草标记"完成"。每次 commit 前必须自审：linter / qa-check / 线上 URL 拨测三件事都过。
5. **自下而上穷举式覆盖**。不允许"抽样"代替"穷举"，任何"重要的看了就行"都属于失职。
6. **失败 → 蒸馏 → 防御**。每次出错必须沉淀进 `SOP.md` 的"故障模式速查"或"自我进化"章节，不允许只在对话里讲完就忘。
7. **数字必须有源**。任何引用的数字（行号、版本号、字数）必须能追溯到文件路径 + 行号，不允许"大约""估计"。

## 三模型分工速记

- **Opus**：调度 + 顶级评审 + 全局战略拍板。**绝不写图表 HTML / 单章正文 / 跑批量自动化**。
- **Sonnet**：内容执行 + 全局战略辅助。可以收集证据列方案，但不单方面替 Opus 拍板架构级决策。
- **Kimi**：图表 HTML 生成（主） + 评审（备）+ **通用执行（备）**。
- **MiniMax M2.7**：图表评审（主） + 内容评审 + **图表生成（备）+ 通用执行（备）**。
- **关键灵活性**：Kimi 和 MiniMax **不只能干图表**。它们都是 Claude Code 兼容模型，凡是 Sonnet 子 Agent 能干的事（写脚本、做调研、跑批量、做评审），Kimi 和 MiniMax 都能干。Opus 在派活时按"成本/能力/已调教程度"动态分配，**不要默认只把它们当图表工人**。
- **评审职责非专属**：Sonnet / Kimi / MiniMax 都可以做评审员。多模型交叉评审是核心防御机制——同一对象至少两个模型独立评一次。
- **Opus 子 Agent 不许默认开**：除非任务明确需要 Opus 级判断（架构决策、最终拍板），否则一律走 Sonnet/Kimi/MiniMax。

## 必读文件（按优先级）

只列**长期生效**的核心文件。一次性产物（任务相关的报告、调研、runbook）不进这张表，由 Opus 在执行任务时按需打开。

| 文件 | 作用 | 何时读 |
|------|------|--------|
| `SOP.md` | 全部工作流、故障模式、子 Agent 调用规范 | 不确定怎么做时第一个读 |
| `PROGRESS.md` | 单一事实来源（SoT），项目当前状态 | 每次开始工作前 + 每次重大里程碑后必须更新 |
| `.env.example` | 环境变量模板（真实 key 在 `.env`，已 gitignore） | 跑脚本前 |

## 安全红线（违反会出生产事故）

- **绝不**把真实 API key 写进任何 git 跟踪的文件。脚本必须用 `${KIMI_API_KEY}` / `${MINIMAX_API_KEY}` 引用 `.env`。
- **绝不**用 `git push --force` 到 main 除非明确是清 secret 的 filter-repo 流程。
- **绝不**让 Playwright headless Chrome 用默认 user-data-dir，必须 `--user-data-dir=$(mktemp -d)`，跑完 trap EXIT 清理。
- **绝不**把数据文件放进 `.gitignore` 目录后忘记加 `!` 例外。上线后必须跑 URL 拨测。

## 写作风格红线（用户反复纠正过的）

- **不要 OS 比喻独大**。每个技术概念必须配一个日常生活比喻（厨房、快递、城市），用 `💡 通俗理解` 格式标记。
- **不要在标题里挂作者名**。除非是有影响力的名人。小博主只能出现在引用列表或正文局部引用。
- **不要 AI 生成图像**做技术图表。Dreamina 类工具生成的图质量太差。统一用 SVG / Mermaid / D3 / HTML 代码方案。
- **不要"完成"两个字**。说"完成"前必须先做全盘审计。

## 工具调用习惯（巧思说明）

这部分是工具调度优化，用人话解释为什么这样规定：

- **文件搜：用 Glob/Grep，不要 `find`/`grep`/`rg` 走 Bash**。Glob/Grep 是 Claude Code 内置的专用工具，权限控制更精细、输出格式更适合 Claude 解析；走 Bash 跑 `find` 会输出大量噪声字段（mtime、权限、owner），浪费 token 还容易超出输出限制。
- **文件读：用 Read，不要 `cat`/`head`/`tail`**。Read 自动加行号、支持图片/PDF/Notebook、能读大文件的指定 offset，`cat` 这些都做不到；并且 Read 的结果会被 Claude Code 缓存，下一次小修改不需要重读整个文件。
- **文件改：用 Edit，不要 `sed`/`awk`**。Edit 强制要求 old_string 唯一匹配，杜绝"我以为改的是 A 但其实改了 B"的事故；`sed -i` 一旦正则写错就整文件爆炸且无法回滚。
- **多个独立操作：并行调用**。Claude 一次响应可以发出多个工具调用，独立任务并行能把 5 步串行压缩成 1 步——既快又省 token。
- **长任务：后台跑**。跑 30 秒以上的命令（如等 GitHub Pages 重新发布、跑批量子 Agent）必须用 `run_in_background`，主线程继续干别的事，结果出来再回收。

**不变的原则**：Bash 工具是兜底，不是首选。能用专用工具就不要走 Bash。
