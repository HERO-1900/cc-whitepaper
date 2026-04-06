#!/bin/bash
# 序章 Block 双跑脚本：Kimi + MiniMax 各自独立生成 HTML
# 用法: ./scripts/block-doublerun.sh <brief_file> <out_dir>
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env ] && set -a && . ./.env && set +a
: "${KIMI_API_KEY:?KIMI_API_KEY not set}"
: "${MINIMAX_API_KEY:?MINIMAX_API_KEY not set}"

BRIEF_FILE="$1"
OUT_DIR="$2"
mkdir -p "$OUT_DIR"
STAMP=$(date +%H%M)

PROMPT_TAIL='

请严格按上述 Brief 生成完整的、可直接打开的 HTML 文件。
直接输出 HTML 源代码（从 <!DOCTYPE html> 开始到 </html> 结束），
不要任何 markdown 围栏，不要任何前后说明文字，不要任何调用工具，
单次输出一个完整文件即可。'

BRIEF_CONTENT=$(cat "$BRIEF_FILE")
FULL_PROMPT="${BRIEF_CONTENT}${PROMPT_TAIL}"

MODEL="${1:-kimi}"
case "${WHICH:-both}" in
  kimi)
    echo "[$(date +%H:%M:%S)] Kimi 启动"
    (
      exec </dev/null
      ANTHROPIC_BASE_URL="https://api.kimi.com/coding/" \
      ANTHROPIC_API_KEY="${KIMI_API_KEY}" \
      ENABLE_TOOL_SEARCH=false \
      claude -p "$FULL_PROMPT" --output-format text \
        > "${OUT_DIR}/kimi-${STAMP}.html" 2>"${OUT_DIR}/kimi-${STAMP}.log"
    ) & disown
    echo "[$(date +%H:%M:%S)] Kimi 完成 → ${OUT_DIR}/kimi-${STAMP}.html"
    ;;
  minimax)
    echo "[$(date +%H:%M:%S)] MiniMax 启动"
    (
      exec </dev/null
      ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic" \
      ANTHROPIC_API_KEY="${MINIMAX_API_KEY}" \
      ANTHROPIC_MODEL="MiniMax-M2.7" \
      API_TIMEOUT_MS=600000 \
      ENABLE_TOOL_SEARCH=false \
      claude -p "$FULL_PROMPT" --output-format text \
        > "${OUT_DIR}/minimax-${STAMP}.html" 2>"${OUT_DIR}/minimax-${STAMP}.log"
    ) & disown
    echo "[$(date +%H:%M:%S)] MiniMax 完成 → ${OUT_DIR}/minimax-${STAMP}.html"
    ;;
esac
