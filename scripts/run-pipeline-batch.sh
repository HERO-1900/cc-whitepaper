#!/bin/bash
# ============================================================
# 批量运行 chart-pipeline-v2.sh
# 20个代表性brief，串行执行（避免API并发限制）
# ============================================================

set -euo pipefail
cd /Users/hero/Desktop/CC-Research-byClaude/web

PIPELINE="scripts/chart-pipeline-v2.sh"
LOG="test-viz/pipeline/batch_$(date +%m%d_%H%M).log"
mkdir -p test-viz/pipeline

BRIEFS=(
    # Part 1 - 核心概念 (4个)
    "briefs/part1/VIS-1-001_Tool调用循环图.txt"
    "briefs/part1/VIS-1-002_Agent层级树状图.txt"
    "briefs/part1/VIS-1-004_系统全景架构图.txt"
    "briefs/part1/VIS-1-006_权限九步状态机流程图.txt"

    # Part 2A - 架构深度 (4个)
    "briefs/part2_architecture/VIS-2A-001.txt"
    "briefs/part2_architecture/VIS-2A-007.txt"
    "briefs/part2_architecture/VIS-2A-009.txt"
    "briefs/part2_architecture/VIS-2A-010.txt"

    # Part 2Q - QA补充 (4个)
    "briefs/part2_qa/VIS-2Q-001_串行vs并行对比时序图.txt"
    "briefs/part2_qa/VIS-2Q-003_六种权限模式金字塔图.txt"
    "briefs/part2_qa/VIS-2Q-007_Swarm拓扑图.txt"
    "briefs/part2_qa/VIS-2Q-014_命令四象限分类图.txt"

    # Part 3 - 安全与配置 (3个)
    "briefs/part3/VIS-3-002_CopyOnWrite_overlay架构图.txt"
    "briefs/part3/VIS-3-009_沙箱三层架构图.txt"
    "briefs/part3/VIS-3-013_设置合并优先级全景图.txt"

    # Part 4 - 最佳实践 (3个)
    "briefs/part4/VIS-4-002_Token成本金字塔.txt"
    "briefs/part4/VIS-4-003_Agent组合模式图.txt"
    "briefs/part4/VIS-4-006_错误恢复策略矩阵.txt"

    # Part 5 + Overview (2个)
    "briefs/part5/VIS-5-001_代码复杂度热力图.txt"
    "briefs/overview/VIS-0-003_技术栈全景.txt"
)

TOTAL=${#BRIEFS[@]}
SUCCESS=0
FAIL=0

echo "====== 批量管线启动: ${TOTAL}个brief ======" | tee "$LOG"
echo "开始时间: $(date)" | tee -a "$LOG"
echo "" | tee -a "$LOG"

for i in "${!BRIEFS[@]}"; do
    IDX=$((i + 1))
    BRIEF="${BRIEFS[$i]}"
    NAME=$(basename "$BRIEF" .txt)

    echo "[$IDX/$TOTAL] 处理: $NAME" | tee -a "$LOG"
    echo "  开始: $(date +%H:%M:%S)" | tee -a "$LOG"

    if bash "$PIPELINE" "$BRIEF" >> "$LOG" 2>&1; then
        echo "  完成: $(date +%H:%M:%S) ✓" | tee -a "$LOG"
        SUCCESS=$((SUCCESS + 1))
    else
        echo "  失败: $(date +%H:%M:%S) ✗" | tee -a "$LOG"
        FAIL=$((FAIL + 1))
    fi
    echo "" | tee -a "$LOG"
done

echo "====== 批量管线完成 ======" | tee -a "$LOG"
echo "总计: $TOTAL | 成功: $SUCCESS | 失败: $FAIL" | tee -a "$LOG"
echo "结束时间: $(date)" | tee -a "$LOG"
echo "日志: $LOG"
echo ""
echo "输出目录:"
ls -d test-viz/pipeline/*_* 2>/dev/null | tail -20
