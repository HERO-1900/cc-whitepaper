#!/bin/bash
# Batch Chart Revision Pipeline
#
# Reads a feedback JSON file and runs chart-revision.sh for each flagged chart.
# Usage: bash scripts/batch-revision.sh <feedback.json>
#
# The feedback JSON format (from Gallery submit):
# {
#   "batch_id": "batch-xxx",
#   "items": [
#     { "chart_id": "VIS-0-001", "rating": 2, "comment": "...", "flagged": true }
#   ]
# }

set -e

FEEDBACK_FILE="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_DIR="$(dirname "$SCRIPT_DIR")"
REVISIONS_DIR="$WEB_DIR/test-viz/revisions"
LOG_DIR="$REVISIONS_DIR/logs"
PRODUCTION_DIR="$WEB_DIR/test-viz/production/html"

mkdir -p "$LOG_DIR"

if [ -z "$FEEDBACK_FILE" ]; then
  echo "Usage: bash scripts/batch-revision.sh <feedback.json>"
  echo ""
  echo "Or pipe from stdin: echo '{...}' | bash scripts/batch-revision.sh -"
  exit 1
fi

# Read JSON
if [ "$FEEDBACK_FILE" = "-" ]; then
  FEEDBACK_JSON=$(cat)
else
  FEEDBACK_JSON=$(cat "$FEEDBACK_FILE")
fi

# Extract flagged items using python3
FLAGGED_ITEMS=$(python3 -c "
import json, sys
data = json.loads('''$FEEDBACK_JSON''') if len(sys.argv) < 2 else json.load(open(sys.argv[1]))
flagged = [item for item in data.get('items', []) if item.get('flagged')]
for item in flagged:
    vid = item['chart_id']
    comment = item.get('comment', '').replace('\n', ' ')[:500]
    rating = item.get('rating', 0)
    print(f'{vid}|||{rating}|||{comment}')
" 2>/dev/null)

if [ -z "$FLAGGED_ITEMS" ]; then
  echo "[batch-revision] No flagged charts to revise."
  exit 0
fi

BATCH_ID=$(python3 -c "import json; print(json.loads('''$FEEDBACK_JSON''').get('batch_id', 'unknown'))" 2>/dev/null)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BATCH_LOG="$LOG_DIR/batch_${TIMESTAMP}.log"

echo "=== Batch Revision: $BATCH_ID ===" | tee "$BATCH_LOG"
echo "Timestamp: $(date)" | tee -a "$BATCH_LOG"
echo "" | tee -a "$BATCH_LOG"

# Count flagged
TOTAL=$(echo "$FLAGGED_ITEMS" | wc -l | tr -d ' ')
echo "Flagged for revision: $TOTAL charts" | tee -a "$BATCH_LOG"
echo "" | tee -a "$BATCH_LOG"

CURRENT=0
SUCCESS=0
FAILED=0

while IFS='|||' read -r VID RATING COMMENT; do
  CURRENT=$((CURRENT + 1))
  echo "[$CURRENT/$TOTAL] Revising $VID (rating: $RATING)..." | tee -a "$BATCH_LOG"

  # Find the production chart file
  CHART_FILE=$(ls "$PRODUCTION_DIR"/${VID}_*.html 2>/dev/null | head -1)
  if [ -z "$CHART_FILE" ]; then
    echo "  ERROR: No production file found for $VID" | tee -a "$BATCH_LOG"
    FAILED=$((FAILED + 1))
    continue
  fi

  # Create revision brief with user feedback
  BRIEF="请修订图表 $VID。\n用户反馈（评分 $RATING/5）：$COMMENT\n请根据反馈改进图表的可读性、准确性和视觉效果。"

  # Check if chart-revision.sh exists
  if [ -f "$SCRIPT_DIR/chart-revision.sh" ]; then
    # Run revision with timeout
    timeout 120 bash "$SCRIPT_DIR/chart-revision.sh" "$VID" "$COMMENT" >> "$BATCH_LOG" 2>&1
    if [ $? -eq 0 ]; then
      echo "  OK: $VID revised successfully" | tee -a "$BATCH_LOG"
      SUCCESS=$((SUCCESS + 1))
    else
      echo "  WARN: $VID revision had issues (timeout or error)" | tee -a "$BATCH_LOG"
      FAILED=$((FAILED + 1))
    fi
  else
    echo "  SKIP: chart-revision.sh not found, saving feedback only" | tee -a "$BATCH_LOG"
    # Save feedback to the standard feedback location
    FEEDBACK_PATH="$REVISIONS_DIR/feedback/${VID}.txt"
    echo "" >> "$FEEDBACK_PATH"
    echo "--- Batch $BATCH_ID ($(date)) ---" >> "$FEEDBACK_PATH"
    echo "Rating: $RATING/5" >> "$FEEDBACK_PATH"
    echo "Comment: $COMMENT" >> "$FEEDBACK_PATH"
    SUCCESS=$((SUCCESS + 1))
  fi

  echo "" | tee -a "$BATCH_LOG"
done <<< "$FLAGGED_ITEMS"

echo "=== Batch Complete ===" | tee -a "$BATCH_LOG"
echo "Success: $SUCCESS / $TOTAL" | tee -a "$BATCH_LOG"
echo "Failed: $FAILED / $TOTAL" | tee -a "$BATCH_LOG"
echo "Log: $BATCH_LOG" | tee -a "$BATCH_LOG"
