#!/bin/bash
# ============================================================
# 图表自动化管线 — 生产→审查→修正 闭环
# 用法: ./chart-pipeline.sh <brief_file> [max_rounds]
# 示例: ./chart-pipeline.sh briefs/part1/VIS-1-001_Tool调用循环图.txt 3
# ============================================================

set -e
cd /Users/hero/Desktop/CC-Research-byClaude/web

BRIEF_FILE="$1"
MAX_ROUNDS="${2:-3}"  # 默认最多3轮修正
BRIEF_NAME=$(basename "$BRIEF_FILE" .txt)

# Output dirs
KIMI_DIR="test-viz/pipeline/kimi"
MM_DIR="test-viz/pipeline/minimax"
REVIEW_DIR="test-viz/pipeline/reviews"
mkdir -p "$KIMI_DIR" "$MM_DIR" "$REVIEW_DIR"

# API configs
KIMI_ENV='ANTHROPIC_BASE_URL=https://api.kimi.com/coding/ ANTHROPIC_API_KEY=REDACTED ENABLE_TOOL_SEARCH=false'
MM_ENV='ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic ANTHROPIC_API_KEY=REDACTED ANTHROPIC_MODEL=MiniMax-M2.7 API_TIMEOUT_MS=300000 ENABLE_TOOL_SEARCH=false'

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

clean_output() {
    local f="$1"
    [ ! -s "$f" ] && return
    sed -i '' '/^Warning: no stdin/d' "$f" 2>/dev/null
    sed -i '' '/^```html$/d; /^```svg$/d; /^```$/d' "$f" 2>/dev/null
    if [[ "$f" == *.html ]]; then
        local start=$(grep -n '<!DOCTYPE\|<html' "$f" 2>/dev/null | head -1 | cut -d: -f1)
        if [ -n "$start" ] && [ "$start" -gt 1 ]; then
            tail -n +"$start" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
        fi
        local end=$(grep -n '</html>' "$f" 2>/dev/null | tail -1 | cut -d: -f1)
        if [ -n "$end" ]; then
            head -n "$end" "$f" > "${f}.tmp" && mv "${f}.tmp" "$f"
        fi
    fi
}

BRIEF_CONTENT=$(cat "$BRIEF_FILE")

echo "======================================================"
echo "  图表管线: $BRIEF_NAME"
echo "  最大轮次: $MAX_ROUNDS"
echo "======================================================"

# ── STEP 1: 并行生成 ──
echo ""
echo "── Step 1: 生成 (Kimi + MiniMax 并行) ──"

GEN_PROMPT="你是一个专业的可视化工程师。请根据以下信息需求，生成一个独立的可视化文件（HTML或SVG，你自己选择最合适的格式）。

要求：
- 暗色主题背景
- 中英双语标注
- 布局规整，无错位、无重叠
- 信息传达清晰，核心内容一眼可见
- 你可以自由选择技术方案和设计风格，只要效果好

信息需求：
$BRIEF_CONTENT

输出要求：只输出完整代码，不要任何解释文字。"

KIMI_OUT="$KIMI_DIR/${BRIEF_NAME}_r1.html"
MM_OUT="$MM_DIR/${BRIEF_NAME}_r1.html"

echo "[$(date +%H:%M:%S)] Kimi 生成中..."
call_kimi "$GEN_PROMPT" > "$KIMI_OUT" &
KIMI_PID=$!

echo "[$(date +%H:%M:%S)] MiniMax 生成中..."
call_minimax "$GEN_PROMPT" > "$MM_OUT" &
MM_PID=$!

wait $KIMI_PID $MM_PID
clean_output "$KIMI_OUT"
clean_output "$MM_OUT"

echo "[$(date +%H:%M:%S)] Kimi: $(wc -l < "$KIMI_OUT") lines"
echo "[$(date +%H:%M:%S)] MiniMax: $(wc -l < "$MM_OUT") lines"

# ── STEP 2: 交叉审查 ──
echo ""
echo "── Step 2: 交叉审查 (设计师Persona) ──"

REVIEW_PROMPT_TEMPLATE='你现在扮演"设计总监Leo"——一位有12年数据可视化经验的资深信息设计师。

请审查以下可视化图表代码，从视觉设计角度给出严格评价。

审查维度（每项1-5分）：
1. 布局规整性 — 节点对齐、间距统一、无错位、无重叠
2. 信息传达 — 核心信息是否一眼看到、信息层次是否清晰
3. 视觉美学 — 配色和谐、字号合理、整体精致度

请输出格式：
分数: X/15
布局: X/5 — [理由]
信息: X/5 — [理由]
美学: X/5 — [理由]
缺陷清单:
- [问题1: 位置+描述]
- [问题2: 位置+描述]
修改建议:
- [建议1]
- [建议2]

== 图表代码 =='

# MiniMax的Leo审查Kimi的作品
KIMI_CODE=$(cat "$KIMI_OUT")
REVIEW_K="$REVIEW_PROMPT_TEMPLATE
$KIMI_CODE"

# Kimi的阿雅审查MiniMax的作品
MM_CODE=$(cat "$MM_OUT")
REVIEW_M='你现在扮演"艺术总监阿雅"——一位有10年UI/UX设计经验的视觉设计师。

请审查以下可视化图表代码，从视觉设计角度给出严格评价。

审查维度（每项1-5分）：
1. 布局规整性 — 节点对齐、间距统一、无错位、无重叠
2. 信息传达 — 核心信息是否一眼看到、信息层次是否清晰
3. 视觉美学 — 配色和谐、字号合理、整体精致度

请输出格式：
分数: X/15
布局: X/5 — [理由]
信息: X/5 — [理由]
美学: X/5 — [理由]
缺陷清单:
- [问题1: 位置+描述]
- [问题2: 位置+描述]
修改建议:
- [建议1]
- [建议2]

== 图表代码 ==
'"$MM_CODE"

echo "[$(date +%H:%M:%S)] MiniMax-Leo 审查 Kimi 作品..."
call_minimax "$REVIEW_K" > "$REVIEW_DIR/${BRIEF_NAME}_kimi_review_r1.txt" &
R1_PID=$!

echo "[$(date +%H:%M:%S)] Kimi-阿雅 审查 MiniMax 作品..."
call_kimi "$REVIEW_M" > "$REVIEW_DIR/${BRIEF_NAME}_minimax_review_r1.txt" &
R2_PID=$!

wait $R1_PID $R2_PID

echo "[$(date +%H:%M:%S)] 审查完成"
echo ""
echo "── 第1轮结果 ──"
echo "Kimi 作品审查:"
head -6 "$REVIEW_DIR/${BRIEF_NAME}_kimi_review_r1.txt"
echo "..."
echo ""
echo "MiniMax 作品审查:"
head -6 "$REVIEW_DIR/${BRIEF_NAME}_minimax_review_r1.txt"
echo "..."

echo ""
echo "======================================================"
echo "  管线完成！输出文件："
echo "  Kimi:    $KIMI_OUT"
echo "  MiniMax: $MM_OUT"
echo "  审查:    $REVIEW_DIR/${BRIEF_NAME}_*_review_r1.txt"
echo "======================================================"
