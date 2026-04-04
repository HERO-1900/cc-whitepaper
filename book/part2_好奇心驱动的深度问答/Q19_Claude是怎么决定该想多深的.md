# Claude 是怎么决定该"想多深"的？

改个变量名和重构复杂模块，需要的思考深度显然不同。Claude Code 没有把这个决定完全交给模型——它设计了三层独立的思考深度控制机制：持久化的 Effort 档位、临时的 Ultrathink 魔法关键词、以及调用更强模型审查的 Advisor。本章拆解这三层机制的实现细节、成本代价和经济逻辑。

> 💡 **通俗理解**：就像写论文——简单问题随便写几句，复杂问题要查资料、列提纲、反复推敲。

> 🌍 **行业背景**：思考深度控制是 2024-2025 年 LLM 应用的热门话题，但各家实现差异巨大。**OpenAI** 的 o1/o3 系列引入了"reasoning tokens"的概念，用户可以通过 `reasoning_effort`（low/medium/high）参数控制推理深度——这与 Claude Code 的 Effort 机制在 API 层面非常相似。**Cursor** 允许用户在设置中选择"Fast"或"Normal"模式来控制响应速度和质量。**GitHub Copilot** 在 2025 年推出多模型选择（GPT-4o、Claude、Gemini），通过模型切换间接控制思考深度，但没有同模型内的档位调节。**Aider** 通过切换不同模型（如 GPT-4 vs GPT-3.5）来控制质量/速度权衡，没有单模型多档位机制。Claude Code 的三层机制（Effort 持久档位 + Ultrathink 临时关键词 + Advisor 外部审查）在粒度和灵活性上属于业界前列，特别是 Advisor 的"调用更强模型审查当前模型"机制在主流编程工具中尚属少见。但 Effort 本身的 low/medium/high 分级并非 Claude Code 的原创——它映射到 Anthropic API 的标准参数，与 OpenAI 的 reasoning_effort 是同代产物。

---

## 问题

你让 Claude 帮忙改个变量名，它想了 0.3 秒就给出答案。你让它重构一个复杂模块，它思考了十几秒才动手。你在消息里加了一句 `ultrathink`，它花了更长时间但给出了更缜密的方案。甚至有时候，你会看到它"请教"了一个更强的模型。Claude Code 是怎么在"快速回答"和"深度思考"之间切换的？这背后有几套机制？

---

> **[图表预留 2.19-A]**：层级图 — 从 Effort 到 Ultrathink 到 Advisor 的三层思考深度控制（持久化默认 → 临时加力 → 外部审查）

## 你可能以为……

"大概就是模型自己决定的吧？简单问题少想点，复杂问题多想点。"你可能这么理解。就像人一样，问你 1+1 你脱口而出，问你微分方程你会慢慢算。

---

## 实际上是这样的

"想多深"这个问题在 Claude Code 里被拆解成了**三层独立的机制**，各自有不同的控制粒度、不同的触发方式、不同的成本特征：

1. **Effort**——持久化的"默认档位"，像汽车的驾驶模式（经济/标准/运动/赛道）
2. **Ultrathink**——临时的"涡轮增压"，在单次消息中加一个关键词就触发
3. **Advisor**——"找第二个大脑审查"，调用一个更强的模型来复核当前模型的工作

### 小节 1：Effort——四挡变速箱

> 📚 **课程关联**：Effort 机制的本质是**操作系统**课程中"资源调度"的应用——就像 Linux 的 CPU 调度器有 nice 值控制进程优先级，或者移动端 OS 有"省电模式/性能模式"控制 CPU 频率。用户通过 Effort 档位告诉系统"我愿意为这个任务投入多少计算资源"，系统据此调整 thinking token 预算。这也是**计算机体系结构**中 DVFS（动态电压频率调节）思想在 AI 推理层的映射。

```typescript
// src/utils/effort.ts，第 13-18 行
export const EFFORT_LEVELS = ['low', 'medium', 'high', 'max'] as const
```

| 级别 | 行为 | 谁能用 |
|------|------|--------|
| **low** | 快速直接，最少开销 | 所有 Claude 4.6 模型 |
| **medium** | 平衡速度和质量 | 所有 Claude 4.6 模型 |
| **high** | 全面深入（API 默认值） | 所有 Claude 4.6 模型 |
| **max** | 最深推理，最长思考 | **仅 Opus 4.6** |

注意最后一行——`max` 级别是 Opus 4.6 独占的。如果你在 Sonnet 4.6 上设了 `max`，系统会自动降级为 `high`（`effort.ts:163`）。这不是软件限制，而是 API 约束——其他模型在收到 `max` 时会返回错误。

Effort 的**优先级链**是（`effort.ts:152-167`）：

```
环境变量 CLAUDE_CODE_EFFORT_LEVEL → 用户设置 (appState) → 模型默认值
```

环境变量还支持一个特殊值 `unset`——表示"完全不发送 effort 参数，让 API 用自己的默认值"。

最有趣的是默认值策略：

```typescript
// src/utils/effort.ts，第 307-319 行
// Default effort on Opus 4.6 to medium for Pro.
if (model.toLowerCase().includes('opus-4-6')) {
  if (isProSubscriber()) {
    return 'medium'
  }
  if (getOpusDefaultEffortConfig().enabled &&
      (isMaxSubscriber() || isTeamSubscriber())) {
    return 'medium'
  }
}
```

**Opus 4.6 的默认 effort 是 `medium`，不是 `high`。** 代码注释解释了原因：

> "We recommend medium effort for most tasks to balance speed and intelligence and **maximize rate limits**."

这是一个深思熟虑的经济决策（OpenAI 的 o1 系列也做了类似的默认 effort 选择）。Pro 用户有 rate limit（每分钟/每天的 API 调用上限）。`high` effort 消耗更多 token，意味着相同的 rate limit 下能做更少的事。默认 `medium` 让用户在大多数场景下有流畅的体验，只在真正需要时才手动升级到 `high` 或 `max`。

### 小节 2：Ultrathink——魔法关键词

如果你不想永久改变 effort 设置，只是**这一次**需要 Claude 想深一点，只需要在消息里写上 `ultrathink`：

```typescript
// src/utils/thinking.ts，第 29-31 行
export function hasUltrathinkKeyword(text: string): boolean {
  return /\bultrathink\b/i.test(text)
}
```

系统会在你的输入框中检测这个词（不区分大小写，`\b` 确保是完整单词而非子串），然后：

1. **UI 反馈**：`ultrathink` 在输入框中以**彩虹色**渲染（7 色循环 + shimmer 变体，`thinking.ts:60-78`），让你知道它被识别了
2. **临时提升**：这一次请求的 thinking effort 被提升到 `high`（从默认的 `medium`）
3. **不持久化**：下一次请求恢复到默认 effort

Ultrathink 需要通过两道门：编译时的 `feature('ULTRATHINK')` 和运行时的 GrowthBook gate `tengu_turtle_carbon`（代号：乌龟碳——乌龟暗示"慢思考"？）。

### 小节 3：Thinking 的三种模式

更底层，Claude 的"思考"能力有三种配置模式（`thinking.ts:10-13`）：

```typescript
export type ThinkingConfig =
  | { type: 'adaptive' }                          // 模型自行决定
  | { type: 'enabled'; budgetTokens: number }      // 强制开启 + token 预算
  | { type: 'disabled' }                           // 关闭
```

**Adaptive thinking** 是 Claude 4.6 模型的新能力——模型根据问题复杂度自行决定是否启动思考、思考多久。这就是你观察到的"简单问题秒答、复杂问题深思"的原因。

代码注释中有一条极为强烈的警告（`thinking.ts:135-138`）：

> "Newer models (4.6+) are all trained on adaptive thinking and MUST have it enabled for model testing. **DO NOT** default to false for first party, otherwise we may silently degrade model quality."

这说明 adaptive thinking 不是可选优化，而是模型训练时的核心假设。关闭它相当于让一个被训练成"先想后说"的人被迫"脱口而出"——质量会显著下降。

### 小节 4：Advisor——让 Opus 审查 Sonnet

> 📚 **课程关联**：Advisor 模式是**软件工程**课程中"代码审查"（Code Review）流程的 AI 化实现——就像团队中资深工程师审查初级工程师的 PR 一样，更强的模型审查较弱模型的输出。这也映射到**分布式系统**中的"仲裁者"（arbiter）模式：当单节点决策不够可靠时，引入外部权威节点做最终裁决。

这是三层机制中最复杂的一个。Advisor 不是调整同一个模型的思考深度，而是**调用另一个模型来审查当前模型的工作**。

```typescript
// src/utils/advisor.ts，第 9-14 行
export type AdvisorServerToolUseBlock = {
  type: 'server_tool_use'
  id: string
  name: 'advisor'
  input: { [key: string]: unknown }
}
```

Advisor 是一个 **server-side tool**——当主模型（比如 Sonnet 4.6）认为需要审查时，它"调用" advisor 工具。这个调用不是本地执行的，而是由 API 服务端把整个对话历史转发给一个更强的模型（比如 Opus 4.6），让它审查后返回建议。

调用策略被硬编码在一段长长的 prompt instructions 中（`advisor.ts:130-145`），核心规则：

1. **在写代码之前调用**——不是写完再检查，而是在"决策点"之前就请教
2. **在认为任务完成时调用**——但先把结果写入文件！因为 advisor 调用需要时间，万一会话中断，至少代码还在
3. **发现矛盾时不要默默切换**——如果你的观察和 advisor 的建议矛盾，再调一次，明确提出"我发现了 X，你建议 Y，哪个对？"

Advisor 结果有一个令人好奇的变体（`advisor.ts:22-25`）：

```typescript
| { type: 'advisor_redacted_result'; encrypted_content: string }
```

**加密结果**。这意味着 advisor 的部分回答可能包含不应暴露给客户端的内容——也许是模型安全层的内部推理，也许是经过不同 RLHF 训练的原始输出。我们只能看到加密后的密文。

### 小节 5：三层机制的成本代价

Cost Tracker 系统（`cost-tracker.ts`）完整追踪了每一层机制的成本：

Opus 4.6 的定价结构（`modelCost.ts`）：

| 模式 | Input (per Mtok) | Output (per Mtok) | 倍率 |
|------|-----------------|-------------------|------|
| 标准 | $5 | $25 | 1x |
| Fast mode | $30 | $150 | **6x** |

这意味着：
- `medium` effort + 标准模式 = 最经济
- `high` effort + 标准模式 = 中等成本
- `max` effort + 标准模式 = 最深思考
- 任何 effort + fast mode = 6 倍价格但更快输出

而 Advisor 的成本是**额外的**——它不是替代主模型的一次调用，而是在主模型之上叠加一次 advisor 模型的调用。`cost-tracker.ts:304-321` 显示 advisor 的 token 用量从主请求的 `usage.iterations` 中提取，单独计算成本。

一个意外的发现：旧版 Opus 4/4.1 的定价是 $15/$75——比新版 Opus 4.6 的标准模式（$5/$25）**贵 3 倍**。这暗示 Anthropic 的推理效率在 4.6 版本有了巨大提升，或者是有意降价推动迁移。

### 小节 6：OpenTelemetry 四维计量

每次 API 调用后，成本通过 OTel counter 上报（`cost-tracker.ts:286-301`），维度包括：

```typescript
getCostCounter()?.add(cost, { model, speed? })       // 成本 counter
getTokenCounter()?.add(tokens, { model, speed?, type })  // token counter
// type: 'input' | 'output' | 'cacheRead' | 'cacheCreation'
```

fast mode 的调用会带上 `speed: 'fast'` 属性，让后端可以独立追踪标准和 fast mode 的使用量。这不只是"记账"——这些数据驱动着 rate limit 策略、定价调整、以及"Opus 默认 medium"这样的经济决策。

---

## 这背后的哲学

三层思考控制机制的设计哲学是**"让用户为自己需要的思考量付费"**：

1. **Effort 是基线**。就像手机的性能模式，你设一次就行。默认 `medium` 是一个精心计算的经济最优点——在"够用"和"省钱"之间平衡。
2. **Ultrathink 是例外**。不值得改设置，就输入一个魔法关键词——下次自动恢复。零摩擦、零持久化。
3. **Advisor 是保险**。当一次错误决策的代价很高时，花双倍 token 请一个更强的模型审查，是值得的。

更深层看，这三层机制反映了 Anthropic 对 AI 工具定价的理解：**思考是有成本的资源，不是免费的特性**。用户不是在买"一个 AI 助手"，而是在买"X 量的思考"。Effort、ultrathink、advisor 分别是"调小/调大/请帮手"三种控制方式。

`tengu_grey_step2` 这个 GrowthBook gate 名字暗示这是一个"分步骤灰度发布"——先对 Pro 用户默认 medium（step 1），再逐步扩展到 Max/Team（step 2）。这种谨慎的节奏反映了默认值对用户体验影响的敏感度——一个"wrong default"可能让大量用户感觉"Claude 变笨了"。

---

## 局限性与批判

- **默认 medium 的体验降级风险**：Opus 4.6 默认 effort 为 `medium` 而非 `high`，虽然节省 rate limit，但用户可能感觉"Claude 变笨了"而不知道可以手动提升——这是一个经济最优但用户感知不友好的默认值
- **Advisor 加密结果不透明**：`encrypted_content` 意味着用户无法审查 advisor 给出的完整建议，这在需要可解释性的场景中是一个信任问题
- **Ultrathink 的发现性差**：魔法关键词没有文档指引，用户只能通过口碑或偶然发现才知道可以输入 `ultrathink` 来临时提升思考深度

---

## 代码落点

- `src/utils/thinkingBudget.ts` — thinking token 预算管理
- `src/services/api/` — API 调用层（effort/thinking 参数注入）
- `src/utils/effort.ts`，第 13-18 行：`EFFORT_LEVELS = ['low','medium','high','max']`
- `src/utils/effort.ts`，第 52-65 行：`modelSupportsMaxEffort` Opus 4.6 限制
- `src/utils/effort.ts`，第 152-167 行：`resolveAppliedEffort` 优先级链
- `src/utils/effort.ts`，第 260-265 行：`OPUS_DEFAULT_EFFORT_CONFIG_DEFAULT`
- `src/utils/effort.ts`，第 307-319 行：Opus 4.6 Pro 默认 medium
- `src/utils/effort.ts`，第 209-215 行：数值 effort ant-only 映射
- `src/utils/thinking.ts`，第 10-13 行：`ThinkingConfig` 三模式
- `src/utils/thinking.ts`，第 19-24 行：`isUltrathinkEnabled()` 双门
- `src/utils/thinking.ts`，第 29-31 行：`hasUltrathinkKeyword()` 正则
- `src/utils/thinking.ts`，第 60-78 行：彩虹色 + shimmer 变体
- `src/utils/thinking.ts`，第 113-144 行：adaptive thinking Claude 4.6 限制
- `src/utils/advisor.ts`，第 9-32 行：`AdvisorServerToolUseBlock` + `AdvisorToolResultBlock`
- `src/utils/advisor.ts`，第 53-58 行：`tengu_sage_compass` GrowthBook gate
- `src/utils/advisor.ts`，第 89-96 行：Opus 4.6 + Sonnet 4.6 限制
- `src/utils/advisor.ts`，第 130-145 行：`ADVISOR_TOOL_INSTRUCTIONS`
- `src/utils/modelCost.ts`，第 54-69 行：Opus 4.6 标准 $5/$25 + fast $30/$150
- `src/utils/modelCost.ts`，第 94-99 行：`getOpus46CostTier()` fast mode 检测
- `src/cost-tracker.ts`，第 286-301 行：OTel counter 四维计量
- `src/cost-tracker.ts`，第 304-321 行：Advisor token 提取 + 成本累加

---

## 还可以追问的方向

1. **Numeric effort 的具体 API 行为**：ant-only 的数值 effort（如 75）发给 API 后发生了什么？模型内部如何解读？
2. **Advisor 加密结果的用途**：`encrypted_content` 的解密方在哪里？是在 claude.ai 前端还是后端？
3. **Ultrathink 和 Effort 的交互**：如果用户设了 `max` effort 又输入 `ultrathink`，会发生什么？叠加还是忽略？
4. **Fast mode 的技术实现**：6 倍价格买到了什么？是更大的 GPU 集群、更多的并行还是更短的队列等待？
5. **Thinking budget token 的精确控制**：`ThinkingConfig.enabled.budgetTokens` 是怎么在 API 侧强制执行的？

---

*质量自检：*
- [x] 覆盖：effort.ts、thinking.ts、advisor.ts、modelCost.ts、cost-tracker.ts 五个核心文件深读
- [x] 忠实：所有常量、定价、行号均来自源代码
- [x] 可读：汽车变速箱/涡轮增压/第二大脑类比建立直觉
- [x] 一致：遵循 Q&A 章节标准结构
- [x] 批判：指出 encrypted_content 的不透明性、Pro vs Max 体验差异
- [x] 可复用：三层思考控制模式和 OTel 四维计量可应用于任何付费 AI 服务
