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
- **工作目录**：`~/Desktop/CC-Research-byClaude/web/`

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
- **Kimi**：图表 HTML 生成（主） + 交叉评审（辅）。
- **MiniMax M2.7**：图表评审（主） + 内容评审（辅）。
- **评审职责非专属**：Sonnet/Kimi/MiniMax 都可以做评审员，按场景挑模型。

## 必读文件（按优先级）

| 文件 | 作用 | 何时读 |
|------|------|--------|
| `SOP.md` | 全部工作流、故障模式、子 Agent 调用规范 | 不确定怎么做时第一个读 |
| `PROGRESS.md` | 单一事实来源（SoT），项目当前状态 | 每次开始工作前 |
| `.env.example` | 环境变量模板（真实 key 在 `.env`，已 gitignore） | 跑脚本前 |
| `handoff/SECURITY-INCIDENT-RUNBOOK-2026-04-06.md` | API key 泄露事故的处置闭环（已 closed） | 涉及 secret 时 |
| `handoff/x-research/harness-research/` | Harness Engineering 深度调研产出 | 写第五板块时 |

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

## 工具调用习惯

- 文件搜：用 Glob/Grep，**不要** `find`/`grep`/`rg` 走 Bash。
- 文件读：用 Read，**不要** `cat`/`head`/`tail`。
- 文件改：用 Edit，**不要** `sed`/`awk`。
- 多个独立操作：**并行**调用，不要串行。
- 长任务：**后台跑**，不要前台阻塞。
