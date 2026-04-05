#!/bin/bash
# ============================================================
# 图表批量修订 — 并行4个，共23个图表
# 用法: ./scripts/chart-revision-batch.sh
# ============================================================

set -euo pipefail
cd /Users/hero/Desktop/CC-Research-byClaude/web

chmod +x scripts/chart-revision.sh

# 所有需要修订的图表ID
CHARTS=(
    VIS-0-001
    VIS-0-002
    VIS-0-004
    VIS-0-005
    VIS-0-006
    VIS-0-007
    VIS-0-008
    VIS-0-009
    VIS-0-010
    VIS-0-011
    VIS-0-012
    VIS-0-013
    VIS-0-014
    VIS-1-001
    VIS-1-002
    VIS-1-003
    VIS-1-004
    VIS-1-005
    VIS-1-006
    VIS-1-007
    VIS-1-008
    VIS-1-009
    VIS-1-010
    VIS-1-011
)

TOTAL=${#CHARTS[@]}
PARALLEL=3
DONE=0
FAILED=0

LOG_DIR="test-viz/revisions/logs"
mkdir -p "$LOG_DIR"

echo "====== 批量修订启动: $TOTAL 个图表, 并行度 $PARALLEL ======"
echo "开始时间: $(date)"
echo ""

run_one() {
    local id="$1"
    local logfile="$LOG_DIR/${id}.log"
    echo "[$(date +%H:%M:%S)] 启动: $id"
    if bash scripts/chart-revision.sh "$id" > "$logfile" 2>&1; then
        echo "[$(date +%H:%M:%S)] 完成: $id ✅"
        return 0
    else
        echo "[$(date +%H:%M:%S)] 失败: $id ❌ (查看 $logfile)"
        return 1
    fi
}

# 并行执行，最多同时 $PARALLEL 个
i=0
while [ $i -lt $TOTAL ]; do
    pids=()
    batch_ids=()
    for j in $(seq 0 $((PARALLEL - 1))); do
        idx=$((i + j))
        if [ $idx -lt $TOTAL ]; then
            run_one "${CHARTS[$idx]}" &
            pids+=($!)
            batch_ids+=("${CHARTS[$idx]}")
        fi
    done

    # 等待这批完成
    for pid in "${pids[@]}"; do
        if wait "$pid"; then
            DONE=$((DONE + 1))
        else
            FAILED=$((FAILED + 1))
            DONE=$((DONE + 1))
        fi
    done

    i=$((i + PARALLEL))
    echo "── 进度: $DONE/$TOTAL (失败: $FAILED) ──"
    echo ""
done

echo ""
echo "====== 批量修订完成 ======"
echo "结束时间: $(date)"
echo "总计: $TOTAL | 成功: $((TOTAL - FAILED)) | 失败: $FAILED"
echo "输出目录: test-viz/revisions/"
echo ""

# 列出所有生成的文件
echo "── 生成的修订版本 ──"
find test-viz/revisions/ -name "*_v2.html" -newer scripts/chart-revision-batch.sh 2>/dev/null | sort
