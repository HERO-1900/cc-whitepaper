#!/bin/bash
# ============================================================
# 图表简化管线 — Kimi 生产 + MiniMax 评审
# 流程: Kimi生成 → MiniMax评审 → 交付
#
# 用法: ./chart-pipeline-simple.sh <brief_file>
# ============================================================

set -euo pipefail
cd "$(dirname "$0")/.."

# Load env vars from .env if present
[ -f .env ] && set -a && . ./.env && set +a

: "${KIMI_API_KEY:?KIMI_API_KEY not set — see .env.example}"
: "${MINIMAX_API_KEY:?MINIMAX_API_KEY not set — see .env.example}"

BRIEF_FILE="$1"
BRIEF_NAME=$(basename "$BRIEF_FILE" .txt)
STAMP=$(date +%m%d_%H%M)

OUT="test-viz/simple/${BRIEF_NAME}_${STAMP}"
mkdir -p "$OUT"

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
log() { echo "[$(date +%H:%M:%S)] $1"; }

# ═══════════════════════════════════════════
# Frontend Design Skill (from Anthropic official plugin)
# ═══════════════════════════════════════════
FRONTEND_DESIGN_SKILL='
## Frontend Design Skill — 设计指导原则

你必须遵循以下设计原则来创建独特的、生产级的前端界面，避免千篇一律的 AI 生成美学。

### 设计思维（编码前必须思考）
- **目的**: 这个界面要解决什么问题？谁在使用它？
- **基调**: 选择一个明确的美学方向：精致极简、科技未来感、数据可视化专业风、编辑杂志风等
- **差异化**: 什么让这个设计令人难忘？

### 美学指南
- **字体**: 选择美观、独特的字体。绝对不要用 Arial、Inter 等泛用字体。用有特色的展示字体搭配精致的正文字体。
- **配色**: 承诺一个统一的美学体系。用 CSS 变量保持一致性。主色+锐利强调色 > 平均分配的色板。
- **动效**: 用动画增强体验。优先 CSS-only 方案。一个精心编排的加载动画比分散的微交互更有冲击力。
- **空间构图**: 意想不到的布局。不对称。重叠。对角线流。打破网格的元素。慷慨的留白或有控制的密度。
- **背景与细节**: 创造氛围和深度，不要默认纯色背景。添加渐变网格、噪声纹理、几何图案、分层透明、戏剧性阴影。

### 绝对禁止
- 泛用的 AI 生成美学（紫色渐变+白色背景、千篇一律的卡片布局）
- 过度使用的字体（Inter, Roboto, Arial, 系统字体）
- 缺乏上下文特色的模板化设计
- 每次设计必须不同：变换明暗主题、不同字体、不同美学风格

### 核心原则
匹配实现复杂度与美学愿景。极简设计需要克制、精确和对间距/字体/微妙细节的细心。大胆设计需要丰富的代码和效果。关键是意图性，不是强度。
'

# ═══════════════════════════════════════════
# 质量底线
# ═══════════════════════════════════════════
QUALITY_BASELINE='
## 质量底线（必须满足）
1. 页面整洁清晰，有充足的留白和间距
2. 所有文字可读，无遮挡、无溢出、无截断
3. 元素之间不得错误堆叠、重叠或交叉
4. 连线/箭头规整（优先水平/垂直，避免随意弯曲）
5. 节点对齐、间距统一，有视觉节奏感
6. 暗色主题背景，配色和谐
7. 中英双语标注（中文主标签，英文副标签）
8. 输出必须是完整的可直接打开的 HTML 文件
9. 只输出代码，不要任何解释文字
'

log "====== 简化管线: $BRIEF_NAME ======"

# ═══════════════════════════════════════════
# Step 1: Kimi 生成
# ═══════════════════════════════════════════
log "── Step 1: Kimi 生成 ──"

GEN_PROMPT="你是世界级的前端可视化工程师。根据以下信息需求，生成一张独特的、高品质的信息可视化图表。

$FRONTEND_DESIGN_SKILL

$QUALITY_BASELINE

信息需求:
$BRIEF

技术要求:
- 输出完整独立的 HTML 文件（HTML + CSS + 内嵌 SVG 或 JS）
- 从 <!DOCTYPE html> 开头
- 直接输出代码到控制台，不要解释，不要写文件，不要用 markdown 代码块"

call_kimi "$GEN_PROMPT" > "$OUT/${BRIEF_NAME}.html"
clean_html "$OUT/${BRIEF_NAME}.html"

GEN_LINES=$(wc -l < "$OUT/${BRIEF_NAME}.html" 2>/dev/null || echo 0)
log "生成完成: ${GEN_LINES} lines"

if [ "$GEN_LINES" -lt 20 ]; then
    log "错误: 生成失败（<20行），终止"
    exit 1
fi

# ═══════════════════════════════════════════
# Step 2: MiniMax 评审
# ═══════════════════════════════════════════
log "── Step 2: MiniMax 评审 ──"

CODE=$(cat "$OUT/${BRIEF_NAME}.html")

REVIEW_PROMPT="你是资深信息设计师。严格审查以下图表代码。

评分（每项1-5分）:
1. 布局规整性 — 对齐、间距、无错位重叠
2. 信息传达 — 核心信息一眼可见、层次清晰
3. 视觉美学 — 配色和谐、字体选择、精致度
4. 代码完整性 — 能否直接打开运行、无语法错误

输出格式:
总分: X/20
布局: X/5 — [一句话说明]
信息: X/5 — [一句话说明]
美学: X/5 — [一句话说明]
完整: X/5 — [一句话说明]
缺陷: [逐条列出，含具体坐标/行号]
修改建议: [逐条列出]

图表代码:
${CODE}"

call_minimax "$REVIEW_PROMPT" > "$OUT/${BRIEF_NAME}_review.txt"

# 提取分数
SCORE=$(grep -i '总分' "$OUT/${BRIEF_NAME}_review.txt" 2>/dev/null | head -1 || echo "N/A")
log "评审分数: $SCORE"

# ═══════════════════════════════════════════
# 完成
# ═══════════════════════════════════════════
log ""
log "====== 完成 ======"
log "图表: $OUT/${BRIEF_NAME}.html ($GEN_LINES lines)"
log "评审: $OUT/${BRIEF_NAME}_review.txt"
log "分数: $SCORE"
