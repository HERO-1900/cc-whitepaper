#!/bin/bash
# 续跑剩余图表修订 — 顺序执行，每个加超时
set -uo pipefail
cd /Users/hero/Desktop/CC-Research-byClaude/web

REMAINING=(
    VIS-0-006 VIS-0-009 VIS-0-010 VIS-0-011 VIS-0-012 VIS-0-013
    VIS-0-014 VIS-1-001 VIS-1-002 VIS-1-003 VIS-1-004 VIS-1-005
    VIS-1-006 VIS-1-007 VIS-1-008 VIS-1-009 VIS-1-010 VIS-1-011
)

TOTAL=${#REMAINING[@]}
DONE=0
FAILED=0
TIMEOUT=420  # 7 minutes per chart

echo "====== 续跑修订: $TOTAL 个图表（顺序执行，${TIMEOUT}s超时）======"
echo "开始: $(date)"

for id in "${REMAINING[@]}"; do
    DONE=$((DONE + 1))
    echo ""
    echo "[$DONE/$TOTAL] [$(date +%H:%M:%S)] 启动: $id"

    # Run with timeout using bash background + sleep
    bash scripts/chart-revision.sh "$id" 2>&1 &
    PID=$!

    # Watchdog
    ( sleep $TIMEOUT; kill $PID 2>/dev/null ) &
    WDOG=$!

    if wait $PID 2>/dev/null; then
        kill $WDOG 2>/dev/null; wait $WDOG 2>/dev/null
        echo "[$DONE/$TOTAL] [$(date +%H:%M:%S)] 完成: $id ✅"
    else
        kill $WDOG 2>/dev/null; wait $WDOG 2>/dev/null
        echo "[$DONE/$TOTAL] [$(date +%H:%M:%S)] 失败/超时: $id ❌"
        FAILED=$((FAILED + 1))
    fi
done

echo ""
echo "====== 全部完成 ======"
echo "结束: $(date)"
echo "总计: $TOTAL | 成功: $((TOTAL - FAILED)) | 失败: $FAILED"

# Final scores
echo ""
echo "=== 评分汇总 ==="
for d in test-viz/revisions/VIS-*/; do
    id=$(basename "$d" | sed 's/_[0-9].*//');
    html=$(find "$d" -name "*_v2.html" 2>/dev/null | head -1)
    review=$(find "$d" -name "*_review.txt" 2>/dev/null | head -1)
    if [ -n "$html" ] && [ -s "$html" ]; then
        lines=$(wc -l < "$html")
        score="无评审"
        [ -n "$review" ] && score=$(grep -oE '总分[：:]\s*\*?\*?[0-9]+/[0-9]+' "$review" 2>/dev/null | head -1)
        echo "$id | ${lines} lines | $score"
    fi
done | sort
