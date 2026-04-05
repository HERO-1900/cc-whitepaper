#!/bin/bash
# ============================================================
# 图表批量生产脚本 — 简化管线批量执行
# 使用 chart-pipeline-simple.sh 逐个生成
# 成功的 HTML 和评审自动归档到 production/ 目录
#
# 用法: ./chart-batch-produce.sh [batch_number]
# 示例: ./chart-batch-produce.sh 1    # 运行第1批(20个)
#        ./chart-batch-produce.sh 2    # 运行第2批(20个)
#        ./chart-batch-produce.sh all  # 运行全部
# ============================================================

set -euo pipefail
cd /Users/hero/Desktop/CC-Research-byClaude/web

PROD_DIR="test-viz/production"
mkdir -p "$PROD_DIR"/{html,reviews}

PIPELINE="scripts/chart-pipeline-simple.sh"

log() { echo "[$(date +%H:%M:%S)] $1"; }

# 收集所有 brief 文件
ALL_BRIEFS=()
for dir in briefs/overview briefs/part1 briefs/part2_architecture briefs/part2_qa briefs/part3 briefs/part4 briefs/part5; do
    for f in "$dir"/*.txt; do
        [ -f "$f" ] && ALL_BRIEFS+=("$f")
    done
done

TOTAL=${#ALL_BRIEFS[@]}
log "总计 $TOTAL 个 brief"

# 批次选择
BATCH="${1:-1}"
BATCH_SIZE=20

if [ "$BATCH" = "all" ]; then
    START=0
    END=$TOTAL
else
    START=$(( (BATCH - 1) * BATCH_SIZE ))
    END=$(( START + BATCH_SIZE ))
    [ $END -gt $TOTAL ] && END=$TOTAL
fi

log "执行批次: $BATCH (第 $((START+1)) - $END 个)"
log ""

SUCCESS=0
FAIL=0

for i in $(seq $START $((END - 1))); do
    BRIEF="${ALL_BRIEFS[$i]}"
    BRIEF_NAME=$(basename "$BRIEF" .txt)
    log "── [$((i+1))/$TOTAL] $BRIEF_NAME ──"

    # 跳过已存在的产出
    if [ -f "$PROD_DIR/html/${BRIEF_NAME}.html" ]; then
        log "  已存在，跳过"
        SUCCESS=$((SUCCESS + 1))
        continue
    fi

    # 运行管线
    STAMP=$(date +%m%d_%H%M)
    TEMP_OUT="test-viz/production/_temp_${BRIEF_NAME}_${STAMP}"
    mkdir -p "$TEMP_OUT"

    if bash "$PIPELINE" "$BRIEF" 2>&1 | tail -5; then
        # 找到最新的简化管线输出
        LATEST=$(ls -td test-viz/simple/${BRIEF_NAME}_* 2>/dev/null | head -1)
        if [ -n "$LATEST" ] && [ -f "$LATEST/${BRIEF_NAME}.html" ]; then
            LINES=$(wc -l < "$LATEST/${BRIEF_NAME}.html" 2>/dev/null || echo 0)
            if [ "$LINES" -ge 20 ]; then
                cp "$LATEST/${BRIEF_NAME}.html" "$PROD_DIR/html/${BRIEF_NAME}.html"
                [ -f "$LATEST/${BRIEF_NAME}_review.txt" ] && cp "$LATEST/${BRIEF_NAME}_review.txt" "$PROD_DIR/reviews/${BRIEF_NAME}_review.txt"
                log "  ✓ 成功 (${LINES}行) → production/"
                SUCCESS=$((SUCCESS + 1))
            else
                log "  ✗ 生成太短 (${LINES}行)"
                FAIL=$((FAIL + 1))
            fi
        else
            log "  ✗ 输出文件未找到"
            FAIL=$((FAIL + 1))
        fi
    else
        log "  ✗ 管线执行失败"
        FAIL=$((FAIL + 1))
    fi

    # 清理临时目录
    rm -rf "$TEMP_OUT"
    log ""
done

log "====== 批量生产完成 ======"
log "成功: $SUCCESS / $((END - START))"
log "失败: $FAIL"
log "产出目录: $PROD_DIR/"
log ""
log "HTML 图表:"
ls "$PROD_DIR/html/" 2>/dev/null | head -30
log ""
log "评审报告:"
ls "$PROD_DIR/reviews/" 2>/dev/null | head -30
