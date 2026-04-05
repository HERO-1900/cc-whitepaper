# 审阅 Harness 系统使用说明

## 概述
Persona-based review harness：用不同用户人格审阅章节内容，获取多视角反馈。

## 人格列表
| ID | 名称 | 文件 | 视角 |
|----|------|------|------|
| novice-1 | 小白用户一号·产品经理小李 | `personas/novice-1.md` | 非技术PM，关注可读性/记忆点/转发欲 |
| novice-2 | 小白用户二号·大学生小张 | `personas/novice-2.md` | CS学生，关注概念清晰/深度/课程衔接 |
| expert-pm-1 | 专业用户一号·AI总监David | `personas/expert-pm-1.md` | 行业专家，关注准确性/创新识别/竞品对比 |

## 运行方式
使用 Claude Code Agent 执行审阅：

```
# 审阅单个章节
1. 读取 persona 文件获取人设和评分标准
2. 读取目标章节 markdown
3. 以该 persona 的身份进行审阅
4. 按指定格式输出审阅报告
5. 保存到 web/scripts/reviews/{persona-id}_{chapter-filename}.md
```

## Agent 启动 Prompt 模板
```
你现在要扮演一个特定的审阅人格来审阅一篇技术文章章节。

步骤：
1. 先读取人格定义文件：[persona file path]
2. 然后读取要审阅的章节：[chapter file path]
3. 完全进入该人格的角色，以他/她的知识水平、关注点和目标来阅读
4. 按照人格定义中的评分维度和输出格式，写出完整的审阅报告
5. 将报告保存到：web/scripts/reviews/[persona-id]_[chapter-name].md

重要：
- 不要跳出角色。你就是那个人，不是在"模拟"那个人
- 给低分要诚实 — 看不懂就是看不懂，不要为了好看给高分
- 引用原文时用 > 引用格式
- 如果是专业人格，要挑毛病、找错误，不要客气
```

## 批量执行
可以并行启动多个 agent，每个负责一个 persona × chapter 组合。
建议先选 2-3 个代表性章节做试点：
- `01_代码地图.md` — 开篇章节，设定理解基调
- `04_查询循环.md` — 核心技术章节，深度最高
- `07_安全架构.md` — 安全专题，trade-off 分析多

## 结果汇总
审阅完成后，运行汇总脚本生成横向对比矩阵。
