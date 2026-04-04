# Vim 模式完全解析

本章解析 Claude Code 在终端输入框中实现的完整 Vim 模式——一个基于状态机的键盘操作系统，忠实再现了 Vim 的模式切换、动作组合和文本对象语法。

## 概述

Claude Code 在终端输入框中实现了一个精简但功能完备的 Vim 模式。这不是简单的快捷键映射，而是一个完整的**状态机**——从模式切换、动作组合到文本对象，忠实再现了 Vim 编辑器的核心操作语法。

**技术比喻（OS 视角）**：Vim 模式就像操作系统的**输入法引擎**——同一个键盘硬件（终端输入），通过不同的输入法状态（Normal/Insert 模式），同一个按键产生完全不同的行为。Normal 模式是"命令输入法"，Insert 模式是"直接输入法"。

> 💡 **通俗理解**：Vim 模式像方向盘上的多功能按键——同一个方向盘（终端），按不同按钮组合（操作符+动作）执行不同驾驶功能。`d` 是"删除"功能键，`w` 是"到下一个词"方向键，组合 `dw` 就是"向前删除一个词"——如同方向盘上按住巡航键再按加速，组合出"巡航加速"功能。

### 🌍 行业背景

在 AI 编程工具中内嵌 Vim 模式并不常见，但在终端工具的用户群体中需求强烈：

- **Cursor / Windsurf**：作为 VS Code fork，直接使用 VS Code 内置的 Vim 扩展（vscodevim），这是一个功能接近完整的 Vim 模拟器，支持可视模式、宏录制、多寄存器、搜索替换等。但这是因为它们运行在 GUI 编辑器中，有完整的文本编辑框架支撑。
- **Aider**：使用 Python 的 `prompt_toolkit` 库，内置支持 Vi 模式编辑（`--vim` 标志）。`prompt_toolkit` 的 Vi 模式是一个相对成熟的实现，覆盖了大部分常用功能。
- **CodeX（OpenAI）**：不支持 Vim 模式。底层 Rust 重写后使用自有终端输入处理。**OpenCode** 作为 Go+Zig 的 TUI 工具，提供了更丰富的终端交互层，但同样不支持 Vim 模式。
- **Zsh / Fish / Bash**：终端 shell 本身通过 readline（或等效库）提供 Vi 模式，但这些实现通常只覆盖单行编辑场景。

Claude Code 选择从零实现 Vim 模式（而非依赖 readline 的 vi mode）是因为它的输入框是基于 Ink（React 终端框架）构建的，无法直接使用 readline。这个自研实现覆盖了操作符+动作组合语法、文本对象、dot-repeat 等核心功能，但省略了可视模式、宏录制和搜索动作——这是一个经过权衡的"80/20 实现"。

---

## 1. 状态机架构

### 1.1 双层状态模型

Vim 模式采用双层状态设计。顶层是 `VimState`，区分 INSERT 和 NORMAL 两大模式；底层是 `CommandState`，在 NORMAL 模式下管理命令解析的多个子状态。

```typescript
// 源码: src/vim/types.ts (第49-75行)
export type VimState =
  | { mode: 'INSERT'; insertedText: string }
  | { mode: 'NORMAL'; command: CommandState }

export type CommandState =
  | { type: 'idle' }
  | { type: 'count'; digits: string }
  | { type: 'operator'; op: Operator; count: number }
  | { type: 'operatorCount'; op: Operator; count: number; digits: string }
  | { type: 'operatorFind'; op: Operator; count: number; find: FindType }
  | { type: 'operatorTextObj'; op: Operator; count: number; scope: TextObjScope }
  | { type: 'find'; find: FindType; count: number }
  | { type: 'g'; count: number }
  | { type: 'operatorG'; op: Operator; count: number }
  | { type: 'replace'; count: number }
  | { type: 'indent'; dir: '>' | '<'; count: number }
```

11 种命令子状态，每种状态精确知道自己在等待什么输入。TypeScript 的联合类型在编译期保证了 switch 的穷举性——遗漏任何一个状态分支都会报错。

### 1.2 状态转换图

源码中用 ASCII 图清晰描绘了状态转换拓扑：

```
idle ──┬─[d/c/y]──► operator
       ├─[1-9]────► count
       ├─[fFtT]───► find
       ├─[g]──────► g
       ├─[r]──────► replace
       └─[><]─────► indent

operator ─┬─[motion]──► execute
          ├─[0-9]────► operatorCount
          ├─[ia]─────► operatorTextObj
          └─[fFtT]───► operatorFind
```

关键设计决策：**所有状态转换都是确定性的**。每个状态对每个输入只有唯一的后继状态或执行动作。没有回溯、没有歧义。

> 📚 **课程关联**：Vim 模式的状态机在形式上接近《编译原理》中的有限状态机——11 种命令子状态对应状态集合，键盘输入是字母表，`transition()` 函数是转移函数。但它并非纯粹的 DFA（确定性有限自动机）：DFA 没有辅助存储，而 Vim 状态机依赖 `PersistentState` 保持跨命令的寄存器内容、上次查找方向和 dot-repeat 记录。准确地说，这是一个**带持久辅助状态的有限状态转换器（finite-state transducer with auxiliary state）**——状态转换本身是确定性的（每个状态对每个输入只有唯一后继），但转换过程中会读写辅助存储来影响执行效果。对读者而言，理解为"确定性状态转换 + 外挂记忆"即可。

### 1.3 持久状态

跨命令生存的记忆信息独立存储：

```typescript
// 源码: src/vim/types.ts (第81-86行)
export type PersistentState = {
  lastChange: RecordedChange | null    // dot-repeat 用
  lastFind: { type: FindType; char: string } | null  // ;/, 重复查找用
  register: string                      // 剪贴板
  registerIsLinewise: boolean           // 剪贴板内容是否按行
}
```

这里的 `register` 是 Vim 的寄存器概念（只实现了默认寄存器），`lastChange` 记录了最后一次修改操作的完整参数，使 `.`（dot-repeat）能忠实重放任意命令组合。

---

## 2. 动作系统（Motions）

### 2.1 纯函数设计

动作的核心函数 `resolveMotion` 是纯函数——不修改任何状态，只计算目标光标位置：

```typescript
// 源码: src/vim/motions.ts (第13-25行)
export function resolveMotion(
  key: string,
  cursor: Cursor,
  count: number,
): Cursor {
  let result = cursor
  for (let i = 0; i < count; i++) {
    const next = applySingleMotion(key, result)
    if (next.equals(result)) break  // 到达边界则提前终止
    result = next
  }
  return result
}
```

count 参数实现了 Vim 的数字前缀机制：`5w` 意味着执行 5 次 `w` 动作。当动作到达文本边界（`next.equals(result)`），循环提前终止而不是报错——这是 Vim 的经典行为。

### 2.2 动作分类

支持的 15 种动作分为四类：

| 类别 | 动作 | 说明 |
|------|------|------|
| 基础移动 | `h` `l` `j` `k` | 左/右/下/上 |
| 词级移动 | `w` `b` `e` `W` `B` `E` | 词首/词尾/大词 |
| 行级移动 | `0` `^` `$` | 行首/非空行首/行尾 |
| 特殊移动 | `G` `gj` `gk` | 末行/视觉行下/视觉行上 |

### 2.3 动作的包含性与行级性

动作有两个关键属性影响操作符如何使用它们：

```typescript
// 源码: src/vim/motions.ts (第72-82行)
export function isInclusiveMotion(key: string): boolean {
  return 'eE$'.includes(key)  // 包含目标字符的动作
}

export function isLinewiseMotion(key: string): boolean {
  return 'jkG'.includes(key) || key === 'gg'  // 按行操作的动作
}
```

这个区分至关重要：`de`（删除到词尾）包含词尾字符，而 `dw`（删除到下个词首）不包含目标位置的字符。源码注释特别指出：`gj/gk` 是 characterwise exclusive，而非 linewise——这是忠实遵循 `:help gj` 的文档行为。

---

## 3. 操作符系统（Operators）

### 3.1 三大操作符

系统支持三种基础操作符：

```typescript
// 源码: src/vim/types.ts (第33行)
export type Operator = 'delete' | 'change' | 'yank'

export const OPERATORS = {
  d: 'delete',
  c: 'change',
  y: 'yank',
} as const satisfies Record<string, Operator>
```

### 3.2 操作符执行上下文

每次操作符执行都需要一个完整的上下文对象：

```typescript
// 源码: src/vim/operators.ts (第26-37行)
export type OperatorContext = {
  cursor: Cursor
  text: string
  setText: (text: string) => void
  setOffset: (offset: number) => void
  enterInsert: (offset: number) => void
  getRegister: () => string
  setRegister: (content: string, linewise: boolean) => void
  getLastFind: () => { type: FindType; char: string } | null
  setLastFind: (type: FindType, char: string) => void
  recordChange: (change: RecordedChange) => void
}
```

这是一个**依赖注入模式**——操作符不直接访问全局状态，而是通过上下文对象与外部交互。这使得操作符逻辑可以独立测试。

> 📚 **课程关联**：操作符+动作的组合语法是《编译原理》中**运算符优先文法**的一个简化实例——`d`（操作符）和 `w`（动作）构成一个二元表达式，`count` 是前缀修饰符。整个 Vim 命令的 BNF 文法大致为：`command := [count] operator [count] motion | [count] operator textobj`。这种"动词+名词"的组合爆炸特性（3 个操作符 x 15 个动作 = 45 种组合）是 Vim 高效的根本原因，也是《软件工程》中**正交设计原则（Orthogonality）**的体现。

### 3.3 操作符+动作组合

操作符与动作的组合是 Vim 语法的精髓：

```typescript
// 源码: src/vim/operators.ts (第42-54行)
export function executeOperatorMotion(
  op: Operator,
  motion: string,
  count: number,
  ctx: OperatorContext,
): void {
  const target = resolveMotion(motion, ctx.cursor, count)
  if (target.equals(ctx.cursor)) return  // 无效移动则不操作

  const range = getOperatorRange(ctx.cursor, target, motion, op, count)
  applyOperator(op, range.from, range.to, ctx, range.linewise)
  ctx.recordChange({ type: 'operator', op, motion, count })
}
```

计算流程：先解析动作得到目标位置 → 计算操作范围（考虑包含性和行级性）→ 执行操作 → 记录变更（用于 dot-repeat）。

### 3.4 cw 的特殊处理

Vim 中有一个经典的特殊行为：`cw` 不等于 `ce` 但效果相近。源码忠实实现了这个例外：

```typescript
// 源码: src/vim/operators.ts (第441-450行)
// Special case: cw/cW changes to end of word, not start of next word
if (op === 'change' && (motion === 'w' || motion === 'W')) {
  let wordCursor = cursor
  for (let i = 0; i < count - 1; i++) {
    wordCursor = motion === 'w' ? wordCursor.nextVimWord() : wordCursor.nextWORD()
  }
  const wordEnd = motion === 'w' ? wordCursor.endOfVimWord() : wordCursor.endOfWORD()
  to = cursor.measuredText.nextOffset(wordEnd.offset)
}
```

`dw` 删除到下个词首（包括中间的空格），但 `cw` 只改变到当前词尾——这是 Vim 的历史遗留行为，几乎所有 Vim 用户都习惯了这个"不一致"。

### 3.5 行操作（dd/cc/yy）

双按操作符键触发整行操作：

```typescript
// 源码: src/vim/operators.ts (第102-166行)
export function executeLineOp(op: Operator, count: number, ctx: OperatorContext): void {
  const text = ctx.text
  const lines = text.split('\n')
  const currentLine = countCharInString(text.slice(0, ctx.cursor.offset), '\n')
  const linesToAffect = Math.min(count, lines.length - currentLine)
  // ...
  ctx.setRegister(content, true)  // true = linewise，影响粘贴行为
}
```

注意 `ctx.setRegister(content, true)` 中的 `true` 标记内容为"行级"——这决定了后续粘贴（`p`）时是插入新行还是内联插入。

### 3.6 图像占位符的原子单元吸附

操作范围计算中包含图像引用的"吸附"逻辑，这是 Claude Code 在经典 Vim 语义上最有原创性的扩展之一：

```typescript
// 源码: src/vim/operators.ts (第471-472行)
from = cursor.snapOutOfImageRef(from, 'start')
to = cursor.snapOutOfImageRef(to, 'end')
```

Claude Code 的输入框支持图像附件，显示为 `[Image #N]` 占位符。`dw` 如果只删除了占位符的一部分会导致显示错误，所以操作范围会自动扩展到覆盖完整的图像引用。

**这打破了 Vim 的一个基本假设——文本由可独立操作的字符组成**。传统 Vim 中，操作符的范围完全由动作决定，每个字符都可以被独立删除、修改或复制。`snapOutOfImageRef` 引入了"原子单元"概念：某些字符序列必须作为整体被操作，不允许部分修改。这本质上是在 Vim 的字符级文本模型中嵌入了富文本语义。

**泛化潜力**。这种模式不仅适用于图像占位符。随着 AI 工具的输入框日趋富文本化（工具调用标记、Markdown 链接、代码块引用等），"在经典编辑器命令中容纳不可分割的语义单元"将成为一类常见的设计挑战。`snapOutOfImageRef` 展示了一种最小侵入的解决路径：不修改动作和操作符的核心逻辑，而是在操作符执行前对范围做后处理调整。

类似的处理在 GUI 编辑器的 Vim 模式中有先例（如 VS Code 的 vscodevim 处理折叠代码块、Obsidian 的 Vim 模式处理嵌入块），但在纯终端环境中对图像占位符做此处理是 Claude Code 的特定适配。

---

## 4. 文本对象（Text Objects）

### 4.1 对象类型

文本对象支持两种范围（inner/around）和多种类型：

```typescript
// 源码: src/vim/types.ts (第164-180行)
export const TEXT_OBJ_TYPES = new Set([
  'w', 'W',           // 词/大词
  '"', "'", '`',       // 引号
  '(', ')', 'b',       // 圆括号
  '[', ']',            // 方括号
  '{', '}', 'B',       // 花括号
  '<', '>',            // 尖括号
])
```

### 4.2 配对定界符

括号和引号使用查找表映射：

```typescript
// 源码: src/vim/textObjects.ts (第19-33行)
const PAIRS: Record<string, [string, string]> = {
  '(': ['(', ')'], ')': ['(', ')'], b: ['(', ')'],
  '[': ['[', ']'], ']': ['[', ']'],
  '{': ['{', '}'], '}': ['{', '}'], B: ['{', '}'],
  '<': ['<', '>'], '>': ['<', '>'],
  '"': ['"', '"'], "'": ["'", "'"], '`': ['`', '`'],
}
```

`b` 是 `()` 的别名，`B` 是 `{}` 的别名——这是 Vim 的传统快捷方式。

### 4.3 词对象的 Grapheme 安全

词对象的查找特别注意了 Unicode grapheme 边界：

```typescript
// 源码: src/vim/textObjects.ts (第66-69行)
const graphemes: Array<{ segment: string; index: number }> = []
for (const { segment, index } of getGraphemeSegmenter().segment(text)) {
  graphemes.push({ segment, index })
}
```

使用 `Intl.Segmenter` 进行 grapheme 分割，确保 emoji 组合字符（如 👨‍👩‍👧）被视为单个单元而非多个 code point。这对于现代终端中的 Unicode 文本编辑至关重要。

### 4.4 引号对象的行内配对

引号文本对象采用行内配对策略：

```typescript
// 源码: src/vim/textObjects.ts (第118-147行)
function findQuoteObject(text, offset, quote, isInner): TextObjectRange {
  const lineStart = text.lastIndexOf('\n', offset - 1) + 1
  const lineEnd = text.indexOf('\n', offset)
  // ...
  // Pair quotes correctly: 0-1, 2-3, 4-5, etc.
  for (let i = 0; i < positions.length - 1; i += 2) {
    const qs = positions[i]!
    const qe = positions[i + 1]!
    if (qs <= posInLine && posInLine <= qe) {
      return isInner
        ? { start: lineStart + qs + 1, end: lineStart + qe }
        : { start: lineStart + qs, end: lineStart + qe + 1 }
    }
  }
}
```

引号配对只在当前行内进行，且采用顺序配对（第1个和第2个配对，第3个和第4个配对），这与 Vim 的行为一致。`inner` 范围不包含引号本身，`around` 范围包含引号。

---

## 5. 状态转换引擎

### 5.1 主转换函数

所有键输入通过一个统一的入口函数分发：

```typescript
// 源码: src/vim/transitions.ts (第59-88行)
export function transition(
  state: CommandState,
  input: string,
  ctx: TransitionContext,
): TransitionResult {
  switch (state.type) {
    case 'idle':          return fromIdle(input, ctx)
    case 'count':         return fromCount(state, input, ctx)
    case 'operator':      return fromOperator(state, input, ctx)
    case 'operatorCount': return fromOperatorCount(state, input, ctx)
    // ... 所有11种状态
  }
}
```

返回值 `TransitionResult` 是一个选择类型：要么是新状态（`next`），要么是要执行的操作（`execute`），要么两者都没有（命令取消回到 idle）。

### 5.2 共享输入处理

idle 和 count 状态共享大量输入处理逻辑：

```typescript
// 源码: src/vim/transitions.ts (第98-200行)
function handleNormalInput(input, count, ctx): TransitionResult | null {
  if (isOperatorKey(input)) {
    return { next: { type: 'operator', op: OPERATORS[input], count } }
  }
  if (SIMPLE_MOTIONS.has(input)) {
    return { execute: () => { /* 移动光标 */ } }
  }
  if (input === 'D') {
    return { execute: () => executeOperatorMotion('delete', '$', 1, ctx) }
  }
  if (input === 'C') {
    return { execute: () => executeOperatorMotion('change', '$', 1, ctx) }
  }
  // D = d$, C = c$, Y = yy —— 内置的快捷组合
}
```

`D`、`C`、`Y` 被实现为预组合的操作符+动作，而不是作为独立命令——这保持了概念上的一致性。

### 5.3 数字前缀的乘法效果

操作符状态下的数字前缀与之前的计数相乘：

```typescript
// 源码: src/vim/transitions.ts (第310-332行)
function fromOperatorCount(state, input, ctx): TransitionResult {
  if (/[0-9]/.test(input)) {
    const newDigits = state.digits + input
    const parsedDigits = Math.min(parseInt(newDigits, 10), MAX_VIM_COUNT)
    return { next: { ...state, digits: String(parsedDigits) } }
  }
  const motionCount = parseInt(state.digits, 10)
  const effectiveCount = state.count * motionCount  // 乘法！
  const result = handleOperatorInput(state.op, effectiveCount, input, ctx)
}
```

所以 `2d3w` = 删除 6 个词。`MAX_VIM_COUNT`（10000）防止了极端数字前缀导致的性能问题。

### 5.4 查找重复

`;` 和 `,` 重复/反向重复最近的查找操作：

```typescript
// 源码: src/vim/transitions.ts (第465-490行)
function executeRepeatFind(reverse, count, ctx): void {
  const lastFind = ctx.getLastFind()
  if (!lastFind) return
  let findType = lastFind.type
  if (reverse) {
    const flipMap: Record<FindType, FindType> = { f: 'F', F: 'f', t: 'T', T: 't' }
    findType = flipMap[findType]
  }
  const result = ctx.cursor.findCharacter(lastFind.char, findType, count)
  if (result !== null) ctx.setOffset(result)
}
```

`,` 反转查找方向：`f` 变 `F`，`t` 变 `T`。查找字符和方向类型存储在 PersistentState 中，跨命令保持。

---

## 6. 其他编辑命令

### 6.1 大小写切换（~）

```typescript
// 源码: src/vim/operators.ts (第222-253行)
export function executeToggleCase(count: number, ctx: OperatorContext): void {
  let newText = ctx.text
  let offset = startOffset
  while (offset < newText.length && toggled < count) {
    const grapheme = firstGrapheme(newText.slice(offset))
    const toggledGrapheme = grapheme === grapheme.toUpperCase()
      ? grapheme.toLowerCase()
      : grapheme.toUpperCase()
    newText = newText.slice(0, offset) + toggledGrapheme + newText.slice(offset + graphemeLen)
    offset += toggledGrapheme.length
    toggled++
  }
}
```

逐 grapheme 切换大小写，而非逐 code point——对于 Unicode 文本是正确的处理方式。

### 6.2 行合并（J）

```typescript
// 源码: src/vim/operators.ts (第258-289行)
export function executeJoin(count: number, ctx: OperatorContext): void {
  for (let i = 1; i <= linesToJoin; i++) {
    const nextLine = (lines[currentLine + i] ?? '').trimStart()
    if (nextLine.length > 0) {
      if (!joinedLine.endsWith(' ') && joinedLine.length > 0) {
        joinedLine += ' '  // 合并时添加空格分隔
      }
      joinedLine += nextLine
    }
  }
}
```

`J` 命令合并行时自动移除下一行的前导空白并添加空格——标准的 Vim 行为。

### 6.3 粘贴（p/P）

粘贴操作根据寄存器内容是否为 linewise 决定行为：

```typescript
// 源码: src/vim/operators.ts (第294-343行)
export function executePaste(after, count, ctx): void {
  const register = ctx.getRegister()
  const isLinewise = register.endsWith('\n')  // 通过尾部换行符判断

  if (isLinewise) {
    // 在上方/下方插入整行
    const insertLine = after ? currentLine + 1 : currentLine
    // ...
  } else {
    // 在光标前/后内联插入
    const insertPoint = after && ctx.cursor.offset < ctx.text.length
      ? ctx.cursor.measuredText.nextOffset(ctx.cursor.offset)
      : ctx.cursor.offset
    // ...
  }
}
```

linewise 判断依赖寄存器内容尾部是否有换行符——`dd` 存入时会确保添加 `\n`，而 `dw` 不会。这个约定贯穿整个操作符系统。

---

## 7. Dot-Repeat 机制

每次修改操作都通过 `ctx.recordChange()` 记录完整的命令参数：

```typescript
// 源码: src/vim/types.ts (第92-119行)
export type RecordedChange =
  | { type: 'insert'; text: string }
  | { type: 'operator'; op: Operator; motion: string; count: number }
  | { type: 'operatorTextObj'; op: Operator; objType: string; scope: TextObjScope; count: number }
  | { type: 'operatorFind'; op: Operator; find: FindType; char: string; count: number }
  | { type: 'replace'; char: string; count: number }
  | { type: 'x'; count: number }
  | { type: 'toggleCase'; count: number }
  | { type: 'indent'; dir: '>' | '<'; count: number }
  | { type: 'openLine'; direction: 'above' | 'below' }
  | { type: 'join'; count: number }
```

按 `.` 时，从 PersistentState 中取出 `lastChange`，根据其类型和参数重新执行相同的操作。10 种变更类型覆盖了所有可重复的修改命令。

---

## 8. 初始状态：INSERT 优先的产品决策

```typescript
// 源码: src/vim/types.ts (第188-189行)
export function createInitialVimState(): VimState {
  return { mode: 'INSERT', insertedText: '' }
}
```

初始状态是 INSERT 模式而非 NORMAL 模式——这是全章最值得深入理解的产品决策。

**对 Vim 哲学的有意识"叛逆"**。传统 Vim 启动进入 NORMAL 模式，体现的是"浏览优先、编辑是例外"的设计哲学——在编辑代码文件时，开发者确实花更多时间在导航和阅读上。但 Claude Code 的输入框不是代码文件，而是对话输入框。用户打开终端的第一件事几乎总是输入提示词（prompt），而不是在已有文本上导航。如果默认进入 NORMAL 模式，用户每次启动后都要先按 `i` 才能开始打字——这对一个"输入为主"的界面来说是不必要的摩擦。

**用户行为模型的根本差异**。在传统 Vim 的使用场景中，用户可能 70% 的时间在 NORMAL 模式（导航、搜索、重构），30% 的时间在 INSERT 模式。但在 AI 对话工具中，这个比例几乎翻转：用户 80%+ 的时间在输入新的提示词（INSERT），只有偶尔需要用 Vim 动作编辑已输入的文本（NORMAL）。INSERT 优先精确反映了这个使用模式。

**对状态机的影响**。这个决策意味着 Vim 模式的"开启"和"激活"是两个不同的事件：用户在设置中开启 Vim 模式后，状态机从 INSERT 开始运行——此时键盘行为与未开启 Vim 模式完全相同（直接输入字符）。只有按下 Escape 切换到 NORMAL 模式后，Vim 的命令语法才真正"激活"。这种渐进式激活降低了 Vim 新手意外进入 NORMAL 模式后的困惑风险。

---

## 批判性分析

### 局限性

1. **单寄存器**：只实现了默认寄存器（`""`），没有具名寄存器（`"a`-`"z`）、系统剪贴板寄存器（`"+`）或黑洞寄存器（`"_`）。对于终端输入框的使用场景这是合理的简化，但从 Vim 用户的肌肉记忆角度，可能导致意外行为。

2. **无可视模式（Visual Mode）**：缺少 `v`/`V`/`Ctrl-V` 可视选择模式。这意味着无法做"选中后操作"这样的工作流，只能使用操作符+动作或文本对象。

3. **无搜索动作**：不支持 `/pattern` 和 `?pattern` 搜索动作，也没有 `n`/`N` 搜索重复。这在终端单行输入中影响不大，但限制了多行编辑的能力。

4. **无宏录制**：不支持 `q` 宏录制和 `@` 宏回放。Dot-repeat（`.`）部分弥补了这个缺失。

### 设计权衡

1. **纯函数 vs. 可变状态**：动作和操作符都设计为纯函数，通过 `OperatorContext` 注入副作用。这提高了可测试性，但增加了上下文传递的复杂度——每个操作需要 10 个回调函数。

2. **Grapheme 安全 vs. 性能**：使用 `Intl.Segmenter` 处理 Unicode 是正确的，但对每次词对象查找都要重新分割整个文本的 grapheme 数组。对于长文本可能有性能影响。

3. **图像引用吸附**：`snapOutOfImageRef` 是对 Vim 语义的实用扩展，但打破了"操作符范围完全由动作决定"的纯粹性。这是工程实用主义的体现。

4. **状态机的平坦化**：11 种命令子状态全部放在一个联合类型中，没有层次结构。这使得状态转换表（transition.ts）可以用一个简单的 switch 处理，但也意味着新增复杂功能（如可视模式）会显著增加状态数量。

### 整体评价

Claude Code 的 Vim 实现是一个"**20% 代码覆盖 80% 使用场景**"的实用主义选择——精确选择了终端编辑最常用的 Vim 功能子集，用严谨的类型系统和纯函数架构实现，并在 Unicode 安全和图像引用处理上做出了适当的适应性扩展。这种"功能子集"策略并非 Claude Code 独创——Aider 的 `prompt_toolkit` Vi 模式、很多 shell 的 readline vi mode 都做了类似的功能裁剪。Claude Code 的实现特点在于状态机的类型安全程度较高（TypeScript 联合类型保证穷举），以及对 grapheme 边界和图像占位符的特殊处理。
