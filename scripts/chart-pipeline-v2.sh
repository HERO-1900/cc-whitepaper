#!/bin/bash
# ============================================================
# 图表自动化管线 v2.1 — 完整闭环
# 流程: 多格式生成 → 有效性检查 → 交叉审查 → 汇总意见 → 双终极重做 → 交付
#
# 用法: ./chart-pipeline-v2.sh <brief_file>
# 示例: ./chart-pipeline-v2.sh briefs/part1/VIS-1-001_Tool调用循环图.txt
# ============================================================

set -euo pipefail
cd /Users/hero/Desktop/CC-Research-byClaude/web

BRIEF_FILE="$1"
BRIEF_NAME=$(basename "$BRIEF_FILE" .txt)
STAMP=$(date +%m%d_%H%M)

# Dirs
OUT="test-viz/pipeline/${BRIEF_NAME}_${STAMP}"
mkdir -p "$OUT"/{gen,review,final}

call_kimi() {
    ANTHROPIC_BASE_URL="https://api.kimi.com/coding/" \
    ANTHROPIC_API_KEY="REDACTED" \
    ENABLE_TOOL_SEARCH=false \
    claude -p "$1" --output-format text < /dev/null 2>/dev/null
}

call_minimax() {
    ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic" \
    ANTHROPIC_API_KEY="REDACTED" \
    ANTHROPIC_MODEL="MiniMax-M2.7" \
    API_TIMEOUT_MS=300000 \
    ENABLE_TOOL_SEARCH=false \
    claude -p "$1" --output-format text < /dev/null 2>/dev/null
}

clean_html() {
    local f="$1"
    [ ! -s "$f" ] && return
    # Remove Warning lines and markdown code fences (with or without language tag)
    sed -i '' '/^Warning: no stdin/d' "$f" 2>/dev/null
    sed -i '' '/^```/d' "$f" 2>/dev/null
    sed -i '' '/^[[:space:]]*```/d' "$f" 2>/dev/null
    # Strip leading non-code text (find first HTML/SVG tag)
    local start=$(grep -n '<!DOCTYPE\|<html\|<svg' "$f" 2>/dev/null | head -1 | cut -d: -f1)
    if [ -n "$start" ] && [ "$start" -gt 1 ]; then
        tail -n +"$start" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
    fi
    # Strip trailing text after </html> or </svg>
    local end=$(grep -n '</html>\|</svg>' "$f" 2>/dev/null | tail -1 | cut -d: -f1)
    if [ -n "$end" ]; then
        head -n "$end" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
    fi
    # Remove any remaining empty lines at start
    sed -i '' '/./,$!d' "$f" 2>/dev/null
}

# 检查文件是否有效（>= MIN_LINES 行）
MIN_LINES=20
is_valid() {
    local f="$1"
    [ -s "$f" ] && [ "$(wc -l < "$f" 2>/dev/null)" -ge $MIN_LINES ]
}

BRIEF=$(cat "$BRIEF_FILE")

QUALITY_BASELINE="
## 质量底线（必须满足，否则不合格）
1. 页面整洁清晰，有充足的留白和间距
2. 所有文字可读，无遮挡、无溢出、无截断
3. 元素之间不得错误堆叠、重叠或交叉
4. 连线/箭头规整（优先水平/垂直，避免随意弯曲）
5. 节点对齐、间距统一，有视觉节奏感
6. 暗色主题背景，配色和谐
7. 中英双语标注（中文主标签，英文副标签）
8. 输出必须是完整的可直接打开的代码文件
9. 只输出代码，不要任何解释文字、不要写入文件、直接打印代码到控制台"

log() { echo "[$(date +%H:%M:%S)] $1"; }

log "====== 管线启动: $BRIEF_NAME ======"

# ═══════════════════════════════════════════
# PHASE 1: 多格式并行生成（4个版本）
# ═══════════════════════════════════════════
log "── Phase 1: 多格式生成 (4版本并行) ──"

GEN_BASE="你是专业可视化工程师。根据以下信息需求生成可视化图表。
$QUALITY_BASELINE

信息需求:
$BRIEF

重要：直接输出完整代码到控制台。不要解释。不要写文件。不要用markdown代码块包裹。"

# Kimi HTML版
call_kimi "${GEN_BASE}
请用HTML+CSS+内嵌SVG实现（独立HTML文件）。从<!DOCTYPE html>开头。" > "$OUT/gen/kimi_html.html" &
P1=$!

# MiniMax HTML版
call_minimax "${GEN_BASE}
请用HTML+CSS+内嵌SVG实现（独立HTML文件）。从<!DOCTYPE html>开头。直接输出HTML代码，不要描述你做了什么。" > "$OUT/gen/minimax_html.html" &
P2=$!

# Kimi SVG版
call_kimi "${GEN_BASE}
请用纯SVG实现。从<svg开头，以</svg>结尾。" > "$OUT/gen/kimi_svg.svg" &
P3=$!

# MiniMax Mermaid版
call_minimax "${GEN_BASE}
请用Mermaid语法实现。输出完整的独立HTML文件，内嵌mermaid.js CDN。从<!DOCTYPE html>开头。直接输出代码。" > "$OUT/gen/minimax_mermaid.html" &
P4=$!

wait $P1 $P2 $P3 $P4

for f in "$OUT"/gen/*; do clean_html "$f"; done

log "生成完成:"
VALID_COUNT=0
for f in "$OUT"/gen/*; do
    lines=$(wc -l < "$f" 2>/dev/null || echo 0)
    if is_valid "$f"; then
        status="✓"
        VALID_COUNT=$((VALID_COUNT + 1))
    else
        status="✗ (跳过审查)"
    fi
    log "  $(basename "$f"): ${lines} lines $status"
done

if [ $VALID_COUNT -eq 0 ]; then
    log "错误: 所有生成版本均无效，管线终止"
    exit 1
fi

# ═══════════════════════════════════════════
# PHASE 2: 交叉审查（设计师互审）
# 只审查有效文件
# ═══════════════════════════════════════════
log ""
log "── Phase 2: 交叉审查 ($VALID_COUNT 个有效版本) ──"

REVIEW_PROMPT='你是资深信息设计师（12年数据可视化经验）。严格审查以下图表代码。

评分（每项1-5分）:
1. 布局规整性 — 对齐、间距、无错位重叠
2. 信息传达 — 核心信息一眼可见、层次清晰
3. 视觉美学 — 配色和谐、精致度
4. 代码完整性 — 能否直接打开运行、无语法错误

输出格式:
总分: X/20
布局: X/5
信息: X/5
美学: X/5
完整: X/5
缺陷: [逐条列出]
修改建议: [逐条列出]

图表代码:
'

REVIEW_PIDS=()

# MiniMax审Kimi-HTML
if is_valid "$OUT/gen/kimi_html.html"; then
    KIMI_HTML=$(cat "$OUT/gen/kimi_html.html")
    call_minimax "${REVIEW_PROMPT}${KIMI_HTML}" > "$OUT/review/kimi_html_review.txt" &
    REVIEW_PIDS+=($!)
fi

# Kimi审MiniMax-HTML
if is_valid "$OUT/gen/minimax_html.html"; then
    MM_HTML=$(cat "$OUT/gen/minimax_html.html")
    call_kimi "${REVIEW_PROMPT}${MM_HTML}" > "$OUT/review/minimax_html_review.txt" &
    REVIEW_PIDS+=($!)
fi

# MiniMax审Kimi-SVG
if is_valid "$OUT/gen/kimi_svg.svg"; then
    KIMI_SVG=$(cat "$OUT/gen/kimi_svg.svg")
    call_minimax "${REVIEW_PROMPT}${KIMI_SVG}" > "$OUT/review/kimi_svg_review.txt" &
    REVIEW_PIDS+=($!)
fi

# Kimi审MiniMax-Mermaid
if is_valid "$OUT/gen/minimax_mermaid.html"; then
    MM_MERM=$(cat "$OUT/gen/minimax_mermaid.html")
    call_kimi "${REVIEW_PROMPT}${MM_MERM}" > "$OUT/review/minimax_mermaid_review.txt" &
    REVIEW_PIDS+=($!)
fi

for pid in "${REVIEW_PIDS[@]}"; do wait "$pid"; done
log "审查完成"

# 提取分数
log "审查分数:"
for f in "$OUT"/review/*_review.txt; do
    [ -f "$f" ] || continue
    name=$(basename "$f" _review.txt)
    score=$(grep -i '总分' "$f" 2>/dev/null | head -1 || echo "N/A")
    log "  $name: $score"
done

# ═══════════════════════════════════════════
# PHASE 3: 汇总意见 + 双终极重做
# MiniMax 和 Kimi 各生成一个终极版本
# ═══════════════════════════════════════════
log ""
log "── Phase 3: 汇总+双终极重做 ──"

ALL_REVIEWS=""
for f in "$OUT"/review/*_review.txt; do
    [ -f "$f" ] || continue
    name=$(basename "$f" _review.txt)
    content=$(cat "$f")
    ALL_REVIEWS="${ALL_REVIEWS}

=== ${name} 的审查意见 ===
${content}
"
done

FINAL_PROMPT="你是终极裁决者。以下是同一张信息图的多个版本的交叉审查意见。

请完成两件事：
1. 综合所有审查意见，选出分数最高/问题最少的版本作为基础
2. 根据所有审查意见中列出的缺陷和建议，生成一个全新的改进版本

关键改进要求：
- 所有元素必须在 viewBox 范围内，不得溢出
- 节点间距均匀，对齐严格
- 连线平直规整，箭头指向正确
- 退出条件/分支条件整齐排列（建议垂直列表）
- 添加完整图例

原始信息需求:
$BRIEF

$QUALITY_BASELINE

所有审查意见:
$ALL_REVIEWS

请直接输出改进后的完整HTML代码。从<!DOCTYPE html>开头到</html>结尾。
不要解释，不要描述，只输出代码。"

# 双保险：MiniMax 和 Kimi 各做一个终极版
log "MiniMax + Kimi 双终极裁决生成中..."
call_minimax "$FINAL_PROMPT" > "$OUT/final/${BRIEF_NAME}_final_mm.html" &
F1=$!
call_kimi "$FINAL_PROMPT" > "$OUT/final/${BRIEF_NAME}_final_kimi.html" &
F2=$!

wait $F1 $F2

clean_html "$OUT/final/${BRIEF_NAME}_final_mm.html"
clean_html "$OUT/final/${BRIEF_NAME}_final_kimi.html"

MM_LINES=$(wc -l < "$OUT/final/${BRIEF_NAME}_final_mm.html" 2>/dev/null || echo 0)
KIMI_LINES=$(wc -l < "$OUT/final/${BRIEF_NAME}_final_kimi.html" 2>/dev/null || echo 0)
log "终极版本 MiniMax: ${MM_LINES} lines"
log "终极版本 Kimi: ${KIMI_LINES} lines"

# ═══════════════════════════════════════════
# 完成
# ═══════════════════════════════════════════
log ""
log "====== 管线完成 ======"
log "输出目录: $OUT"
log ""
log "文件清单:"
find "$OUT" -type f | sort | while read f; do
    lines=$(wc -l < "$f" 2>/dev/null || echo 0)
    printf "  %-50s %4s lines\n" "${f#$OUT/}" "$lines"
done
log ""
log "请打开以下文件查看最终结果:"
log "  MiniMax: $OUT/final/${BRIEF_NAME}_final_mm.html"
log "  Kimi:    $OUT/final/${BRIEF_NAME}_final_kimi.html"
