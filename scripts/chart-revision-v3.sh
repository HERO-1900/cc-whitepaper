#!/bin/bash
# ============================================================
# 图表修订管线 v3 — 基于 v2 HTML + MiniMax 审查反馈 + 用户原始反馈
#
# 输入: brief + v2 HTML + v2 MiniMax 评审 + 用户反馈 → Kimi 修订 → MiniMax 评审
# 用法: ./chart-revision-v3.sh <VIS-ID>
# ============================================================

set -euo pipefail
cd "$(dirname "$0")/.."

# Load env vars from .env if present
[ -f .env ] && set -a && . ./.env && set +a

: "${KIMI_API_KEY:?KIMI_API_KEY not set — see .env.example}"
: "${MINIMAX_API_KEY:?MINIMAX_API_KEY not set — see .env.example}"

VIS_ID="$1"

# 定位文件
FEEDBACK_FILE="test-viz/revisions/feedback/${VIS_ID}.txt"
if [ ! -f "$FEEDBACK_FILE" ]; then
    echo "错误: 找不到反馈文件 $FEEDBACK_FILE"
    exit 1
fi

# 查找 brief 文件
BRIEF_FILE=$(find briefs/ -name "${VIS_ID}*.txt" 2>/dev/null | head -1)
if [ -z "$BRIEF_FILE" ]; then
    echo "错误: 找不到 brief 文件 ${VIS_ID}"
    exit 1
fi

# 查找 v2 HTML（最新的修订版本）
V2_DIR=$(ls -d test-viz/revisions/${VIS_ID}_* 2>/dev/null | sort | tail -1)
if [ -z "$V2_DIR" ]; then
    echo "错误: 找不到 v2 修订目录 ${VIS_ID}"
    exit 1
fi

V2_HTML="${V2_DIR}/${VIS_ID}_v2.html"
V2_REVIEW="${V2_DIR}/${VIS_ID}_v2_review.txt"

if [ ! -f "$V2_HTML" ]; then
    echo "错误: 找不到 v2 HTML: $V2_HTML"
    exit 1
fi

STAMP=$(date +%m%d_%H%M)
OUT="test-viz/revisions/${VIS_ID}_${STAMP}"
mkdir -p "$OUT"

log() { echo "[$(date +%H:%M:%S)] [$VIS_ID] $1"; }

call_kimi() {
    ANTHROPIC_BASE_URL="https://api.kimi.com/coding/" \
    ANTHROPIC_API_KEY="${KIMI_API_KEY}" \
    ENABLE_TOOL_SEARCH=false \
    claude -p "$1" --output-format text < /dev/null 2>/dev/null
}

call_minimax() {
    ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic" \
    ANTHROPIC_API_KEY="${MINIMAX_API_KEY}" \
    ANTHROPIC_MODEL="MiniMax-M2.7" \
    API_TIMEOUT_MS=300000 \
    ENABLE_TOOL_SEARCH=false \
    claude -p "$1" --output-format text < /dev/null 2>/dev/null
}

clean_html() {
    local f="$1"
    [ ! -s "$f" ] && return
    sed -i '' '/^Warning: no stdin/d' "$f" 2>/dev/null
    sed -i '' '/^[[:space:]]*```/d' "$f" 2>/dev/null
    local start=$(grep -n '<!DOCTYPE\|<html\|<svg' "$f" 2>/dev/null | head -1 | cut -d: -f1)
    if [ -n "$start" ] && [ "$start" -gt 1 ]; then
        tail -n +"$start" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
    fi
    local end=$(grep -n '</html>\|</svg>' "$f" 2>/dev/null | tail -1 | cut -d: -f1)
    if [ -n "$end" ]; then
        head -n "$end" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
    fi
}

BRIEF=$(cat "$BRIEF_FILE")
FEEDBACK=$(cat "$FEEDBACK_FILE")
V2_CODE=$(cat "$V2_HTML")
V2_REVIEW_TEXT=""
if [ -f "$V2_REVIEW" ]; then
    V2_REVIEW_TEXT=$(cat "$V2_REVIEW")
fi

# Frontend Design Skill
FRONTEND_DESIGN_SKILL='
## Frontend Design Skill — 设计指导原则

你必须遵循以下设计原则来创建独特的、生产级的前端界面，避免千篇一律的 AI 生成美学。

### 设计思维（编码前必须思考）
- **目的**: 这个界面要解决什么问题？谁在使用它？
- **基调**: 选择一个明确的美学方向：精致极简、科技未来感、数据可视化专业风、编辑杂志风等
- **差异化**: 什么让这个设计令人难忘？

### 美学指南
- **字体**: 中文必须使用非衬线体（如 -apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif），绝对不要使用中文衬线体。
- **配色**: 用 CSS 变量保持一致性。主色+锐利强调色 > 平均分配的色板。
- **动效**: 用动画增强体验。优先 CSS-only 方案。
- **空间构图**: 紧凑但不拥挤。高效利用屏幕空间。
- **背景与细节**: 暗色主题背景，渐变网格、几何图案、分层透明。

### 绝对禁止
- 中文衬线体（宋体、仿宋等）— 必须用非衬线体
- 布局错位：元素重叠、文字被遮挡、线条交叉混乱
- 空数据：所有图表必须填充真实或合理的模拟数据
- 交互失效：所有按钮、排序、筛选功能必须正常工作

### 核心原则
匹配实现复杂度与美学愿景。关键是意图性，不是强度。
'

# Quality Baseline
QUALITY_BASELINE='
## 质量底线（必须满足）
1. 页面整洁清晰，有充足的留白和间距
2. 所有文字可读，无遮挡、无溢出、无截断、无重叠
3. 元素之间不得错误堆叠、重叠或交叉
4. 连线/箭头规整（优先水平/垂直，避免随意弯曲）
5. 节点对齐、间距统一，有视觉节奏感
6. 暗色主题背景，配色和谐
7. 中英双语标注（中文主标签，英文副标签）
8. 所有交互功能必须正常工作
9. 标题下方必须有一段通俗易懂的说明
10. 输出完整独立的 HTML 文件
11. 只输出代码，不要任何解释文字
'

log "====== v3 修订管线: $VIS_ID ======"
log "v2 目录: $V2_DIR"

# ═══════════════════════════════════════════
# Step 1: Kimi v3 修订生成
# ═══════════════════════════════════════════
log "── Step 1: Kimi v3 修订 ──"

GEN_PROMPT="你是世界级的前端可视化工程师。这是图表的第三次修订（v3）。

背景：
- v1 是原始版本，用户审阅后非常不满意
- v2 是第一次修订，但专业评审员仍给出了很低的分数
- 现在你需要做 v3，彻底解决所有遗留问题

$FRONTEND_DESIGN_SKILL

$QUALITY_BASELINE

## 原始需求 Brief:
$BRIEF

## 用户的原始审阅反馈（最高优先级，必须逐条落实）:
$FEEDBACK

## 专业评审员对 v2 的详细审查报告（包含具体的坐标、行号、缺陷）:
$V2_REVIEW_TEXT

## v2 版本的完整代码（评审员审查的就是这个版本）:
$V2_CODE

## v3 修订策略:
1. 用户反馈中的每条意见是最高优先级，必须100%落实
2. 评审员报告中的「缺陷清单」必须逐条修复，特别是：
   - 布局错位/对齐问题（含具体坐标）
   - 连线/箭头混乱
   - 文字重叠/遮挡
   - 反馈落实度不足的条目
3. 如果 v2 的基础架构有根本性问题，请完全重新设计而非在错误基础上修补
4. 优先保证：清晰 > 美观 > 丰富。宁可简单干净也不要复杂混乱
5. 连线使用直角折线（水平+垂直），不要斜线或曲线
6. 节点间保持充足间距，宁可图表大一点也不要挤在一起

技术要求:
- 输出完整独立的 HTML 文件（HTML + CSS + 内嵌 SVG 或 JS）
- 从 <!DOCTYPE html> 开头
- 直接输出代码到控制台，不要解释，不要写文件，不要用 markdown 代码块"

call_kimi "$GEN_PROMPT" > "$OUT/${VIS_ID}_v3.html"
clean_html "$OUT/${VIS_ID}_v3.html"

GEN_LINES=$(wc -l < "$OUT/${VIS_ID}_v3.html" 2>/dev/null || echo 0)
log "生成完成: ${GEN_LINES} lines"

if [ "$GEN_LINES" -lt 20 ]; then
    log "错误: 生成失败（<20行），终止"
    exit 1
fi

# ═══════════════════════════════════════════
# Step 2: MiniMax 评审
# ═══════════════════════════════════════════
log "── Step 2: MiniMax 评审 ──"

CODE=$(cat "$OUT/${VIS_ID}_v3.html")

REVIEW_PROMPT="你是资深信息设计师。这张图表是第三次修订版本（v3），基于用户反馈和上一轮评审的缺陷报告进行了修改。请严格审查。

## 用户的原始反馈（修订必须满足这些要求）:
$FEEDBACK

## 上一轮（v2）的评审报告（看看这次修订是否解决了之前的问题）:
$V2_REVIEW_TEXT

评分（每项1-5分）:
1. 布局规整性 — 对齐、间距、无错位重叠
2. 信息传达 — 核心信息一眼可见、层次清晰、有通俗解释
3. 视觉美学 — 配色和谐、字体选择（中文非衬线体）、精致度
4. 代码完整性 — 能否直接打开运行、无语法错误、交互正常
5. 反馈落实度 — 用户反馈中的每条意见是否都被落实

输出格式:
总分: X/25
布局: X/5 — [一句话说明]
信息: X/5 — [一句话说明]
美学: X/5 — [一句话说明]
完整: X/5 — [一句话说明]
反馈落实: X/5 — [逐条检查用户反馈是否被落实]
缺陷: [逐条列出，含具体坐标/行号]
修改建议: [逐条列出]
与v2对比: [是否有实质性改进？哪些问题解决了？哪些还没解决？]

图表代码:
${CODE}"

call_minimax "$REVIEW_PROMPT" > "$OUT/${VIS_ID}_v3_review.txt"

SCORE=$(grep -i '总分' "$OUT/${VIS_ID}_v3_review.txt" 2>/dev/null | head -1 || echo "N/A")
log "评审分数: $SCORE"

# ═══════════════════════════════════════════
# 完成
# ═══════════════════════════════════════════
log ""
log "====== v3 修订完成 ======"
log "图表: $OUT/${VIS_ID}_v3.html ($GEN_LINES lines)"
log "评审: $OUT/${VIS_ID}_v3_review.txt"
log "分数: $SCORE"
