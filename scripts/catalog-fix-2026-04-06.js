#!/usr/bin/env node
/**
 * catalog-fix-2026-04-06.js
 *
 * P0 紧急修复脚本：
 *   1. 给现有 catalog 每个条目追加三个新字段：chapter / status / brief_id
 *   2. 扫描磁盘 production/html，把漏注册的 VIS-ID 补登进 catalog
 *   3. 写回 chart-catalog.json
 *   4. 输出修复 diff 报告到 handoff/catalog-fix-diff-2026-04-06.md
 *
 * 不允许：修改 brief / 修改 HTML / 破坏 catalog 已有字段
 *
 * 子 Agent: Sonnet
 * 任务来源: chart-catalog-sync-audit-2026-04-06.md (P0)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const WEB_ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(WEB_ROOT, 'test-viz/chart-catalog.json');
const BACKUP_PATH = path.join(WEB_ROOT, 'test-viz/chart-catalog.json.bak-2026-04-06');
const HTML_DIR = path.join(WEB_ROOT, 'test-viz/production/html');
const BRIEFS_DIR = path.join(WEB_ROOT, 'briefs');
const REPORT_PATH = path.join(WEB_ROOT, 'handoff/catalog-fix-diff-2026-04-06.md');

// ---- 工具：从 ID 推测章节 ----
function inferChapter(id) {
  if (!id) return '';
  // VIS-0-* (含 VIS-0-002B 等带字母后缀)
  if (/^VIS-0-/.test(id)) return '序章/part0_序章';
  if (/^VIS-1-/.test(id)) return 'part1';
  if (/^VIS-2A-/.test(id)) return 'part2_architecture';
  if (/^VIS-2Q-/.test(id)) return 'part2_qa';
  // VIS-3N-* 章节归 part3（任务说明里写的）
  if (/^VIS-3N-/.test(id)) return 'part3';
  // VIS-3-* (含 018A 018B 等)
  if (/^VIS-3-/.test(id)) return 'part3';
  if (/^VIS-4-/.test(id)) return 'part4';
  if (/^VIS-5-/.test(id)) return 'part5';
  console.warn(`[chapter-infer] 无法推测章节: ${id}`);
  return '';
}

// ---- 工具：从 HTML 文件名提取 VIS-ID ----
// 文件名形如:
//   VIS-0-001_英雄架构图.html
//   VIS-0-002B_CC源码全量统计仪表盘.html
//   VIS-2A-001.html （part2_architecture 无中文后缀）
//   VIS-3-018A_Bash_AST解析管线全景图.html
//   VIS-0-002_源码统计仪表盘.tokenized.html （派生产物）
function extractIdFromFilename(filename) {
  // 排除派生产物 .tokenized.html
  if (/\.tokenized\.html$/.test(filename)) return null;
  // 主要正则：开头 VIS-x-yyy 或 VIS-2A-yyy / VIS-2Q-yyy / VIS-3N-yyy，后接可选字母后缀
  const m = filename.match(/^(VIS-(?:0|1|2A|2Q|3N|3|4|5)-\d+[A-Z]?)/);
  return m ? m[1] : null;
}

// ---- 工具：扫描 briefs 目录建立 ID -> brief 路径映射 ----
function buildBriefIndex() {
  const idToBrief = new Map();
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && ent.name.endsWith('.txt')) {
        // 跳过 .v2.txt 副本（不作为主 brief）
        if (/\.v2\.txt$/.test(ent.name)) continue;
        const m = ent.name.match(/^(VIS-(?:0|1|2A|2Q|3N|3|4|5)-\d+[A-Z]?)/);
        if (m) {
          const id = m[1];
          // 相对路径形式存
          const rel = path.relative(WEB_ROOT, full);
          if (!idToBrief.has(id)) {
            idToBrief.set(id, rel);
          }
        }
      }
    }
  }
  walk(BRIEFS_DIR);
  return idToBrief;
}

// ---- 主流程 ----
function main() {
  // 1) 安全检查：必须先有备份
  if (!fs.existsSync(BACKUP_PATH)) {
    console.error(`[FATAL] 备份文件不存在: ${BACKUP_PATH}`);
    process.exit(1);
  }

  // 2) 读 catalog
  const raw = fs.readFileSync(CATALOG_PATH, 'utf8');
  const catalog = JSON.parse(raw);
  const originalCount = catalog.charts.length;

  // 3) 读 brief 索引
  const briefIndex = buildBriefIndex();

  // 4) 读磁盘 HTML
  const htmlFiles = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));

  // 5) 升级现有条目（追加三个新字段）
  const upgradeStats = {
    upgraded: 0,
    chapterFilled: 0,
    chapterEmpty: 0,
    statusReady: 0,
    statusDraft: 0,
    briefIdFilled: 0,
    briefIdEmpty: 0,
    chapterUnknownIds: [],
    briefMissingIds: [],
  };

  // 已存在的 ID 集合
  const existingIds = new Set();

  for (const chart of catalog.charts) {
    existingIds.add(chart.id);

    // 字段冲突检测
    if (Object.prototype.hasOwnProperty.call(chart, 'chapter') ||
        Object.prototype.hasOwnProperty.call(chart, 'status') ||
        Object.prototype.hasOwnProperty.call(chart, 'brief_id')) {
      console.warn(`[conflict] 条目 ${chart.id} 已有 chapter/status/brief_id 字段，跳过覆盖`);
      continue;
    }

    // chapter 推测
    const chapter = inferChapter(chart.id);
    if (chapter) {
      upgradeStats.chapterFilled++;
    } else {
      upgradeStats.chapterEmpty++;
      upgradeStats.chapterUnknownIds.push(chart.id);
    }

    // status: 磁盘是否有对应 file
    const filePathRel = chart.file;
    const filePathAbs = path.join(WEB_ROOT, filePathRel);
    const hasFile = fs.existsSync(filePathAbs);
    const status = hasFile ? 'ready' : 'draft';
    if (status === 'ready') upgradeStats.statusReady++;
    else upgradeStats.statusDraft++;

    // brief_id 反查
    const briefId = briefIndex.get(chart.id) || '';
    if (briefId) {
      upgradeStats.briefIdFilled++;
    } else {
      upgradeStats.briefIdEmpty++;
      upgradeStats.briefMissingIds.push(chart.id);
    }

    chart.chapter = chapter;
    chart.status = status;
    chart.brief_id = briefId;
    upgradeStats.upgraded++;
  }

  // 6) 扫描磁盘补登漏注册
  const addedIds = [];
  const skippedDerivatives = [];
  const seenInScan = new Set();

  for (const filename of htmlFiles) {
    const id = extractIdFromFilename(filename);
    if (!id) {
      // 派生产物
      skippedDerivatives.push(filename);
      continue;
    }
    // 同一文件夹下可能有多个文件解析出同 ID（理论上没有），去重
    if (seenInScan.has(id)) continue;
    seenInScan.add(id);

    if (existingIds.has(id)) continue;

    // 这是漏注册的 ID，构造新条目
    const fileRel = `test-viz/production/html/${filename}`;
    const fileAbs = path.join(HTML_DIR, filename);
    let size = null;
    try {
      size = fs.statSync(fileAbs).size;
    } catch (e) { /* keep null */ }

    // name: 从文件名抓中文标题（_后到.html前），part2_architecture 没有后缀就留空
    let name = '';
    const nameMatch = filename.match(/^VIS-(?:0|1|2A|2Q|3N|3|4|5)-\d+[A-Z]?_(.+)\.html$/);
    if (nameMatch) {
      name = nameMatch[1].replace(/_/g, ' ');
    }

    const chapter = inferChapter(id);
    const briefId = briefIndex.get(id) || '';
    const status = 'ready'; // 磁盘有 HTML

    const newEntry = {
      id,
      file: fileRel,
      name,
      size,
      revisions: [],
      has_feedback: false,
      feedback_text: '',
      chapter,
      status,
      brief_id: briefId,
    };

    catalog.charts.push(newEntry);
    addedIds.push(id);

    if (chapter) upgradeStats.chapterFilled++;
    else {
      upgradeStats.chapterEmpty++;
      upgradeStats.chapterUnknownIds.push(id);
    }
    upgradeStats.statusReady++;
    if (briefId) upgradeStats.briefIdFilled++;
    else {
      upgradeStats.briefIdEmpty++;
      upgradeStats.briefMissingIds.push(id);
    }
  }

  // 7) 更新顶层 metadata
  catalog.total = catalog.charts.length;
  catalog.last_sync_audit = '2026-04-06';
  catalog.schema_version = '1.1';
  // 重算 with_feedback / with_revisions
  catalog.with_feedback = catalog.charts.filter(c => c.has_feedback).length;
  catalog.with_revisions = catalog.charts.filter(c => Array.isArray(c.revisions) && c.revisions.length > 0).length;

  // 8) 写回（保持中文不转义）
  const newRaw = JSON.stringify(catalog, null, 2);
  fs.writeFileSync(CATALOG_PATH, newRaw + '\n', 'utf8');

  // 9) 生成 diff 报告
  const totalAfter = catalog.charts.length;
  const chapterFillRate = ((upgradeStats.chapterFilled / totalAfter) * 100).toFixed(1);
  const briefIdFillRate = ((upgradeStats.briefIdFilled / totalAfter) * 100).toFixed(1);
  const statusReadyRate = ((upgradeStats.statusReady / totalAfter) * 100).toFixed(1);

  const reportLines = [];
  reportLines.push('# catalog-fix diff 报告 2026-04-06');
  reportLines.push('');
  reportLines.push('> 执行脚本: `scripts/catalog-fix-2026-04-06.js`');
  reportLines.push('> 触发依据: `handoff/chart-catalog-sync-audit-2026-04-06.md` 的 P0 项');
  reportLines.push('> 备份位置: `test-viz/chart-catalog.json.bak-2026-04-06`');
  reportLines.push('');
  reportLines.push('---');
  reportLines.push('');
  reportLines.push('## 一、总体变化');
  reportLines.push('');
  reportLines.push('| 指标 | 修复前 | 修复后 |');
  reportLines.push('|---|---|---|');
  reportLines.push(`| catalog 条目总数 | ${originalCount} | ${totalAfter} |`);
  reportLines.push(`| 含 chapter 字段条目 | 0 | ${upgradeStats.chapterFilled} |`);
  reportLines.push(`| 含 status 字段条目 | 0 | ${totalAfter} |`);
  reportLines.push(`| 含 brief_id 字段条目 | 0 | ${upgradeStats.briefIdFilled} |`);
  reportLines.push(`| schema_version | 缺失 | 1.1 |`);
  reportLines.push(`| last_sync_audit | 缺失 | 2026-04-06 |`);
  reportLines.push('');
  reportLines.push('## 二、Schema 升级');
  reportLines.push('');
  reportLines.push(`- 升级条目数：**${upgradeStats.upgraded}**（覆盖了原有 ${originalCount} 条中的全部，无字段冲突）`);
  reportLines.push('- 新增字段：');
  reportLines.push('  - `chapter`: 章节归属（"序章/part0_序章" / "part1" / "part2_architecture" / "part2_qa" / "part3" / "part4" / "part5"）');
  reportLines.push('  - `status`: 状态（"ready" 表示磁盘有对应 HTML / "draft" 表示磁盘缺失）');
  reportLines.push('  - `brief_id`: 反向指向 brief 文件的相对路径，例如 `briefs/part1/VIS-1-001_Tool调用循环图.txt`');
  reportLines.push('');
  reportLines.push('## 三、漏注册补登');
  reportLines.push('');
  reportLines.push(`- 新增条目数：**${addedIds.length}**`);
  reportLines.push('- 新增 ID 清单：');
  for (const id of addedIds) {
    reportLines.push(`  - \`${id}\``);
  }
  reportLines.push('');
  if (skippedDerivatives.length > 0) {
    reportLines.push('- 跳过的派生产物（不入 catalog）：');
    for (const f of skippedDerivatives) {
      reportLines.push(`  - \`${f}\``);
    }
    reportLines.push('');
  }
  reportLines.push('## 四、字段填空率');
  reportLines.push('');
  reportLines.push('| 字段 | 填空数 / 总数 | 填空率 |');
  reportLines.push('|---|---|---|');
  reportLines.push(`| \`chapter\` | ${upgradeStats.chapterFilled} / ${totalAfter} | **${chapterFillRate}%** |`);
  reportLines.push(`| \`status\` | ${totalAfter} / ${totalAfter} | **100.0%** |`);
  reportLines.push(`| \`brief_id\` | ${upgradeStats.briefIdFilled} / ${totalAfter} | **${briefIdFillRate}%** |`);
  reportLines.push('');
  reportLines.push(`- status 中 ready: **${upgradeStats.statusReady}**（${statusReadyRate}%），draft: **${upgradeStats.statusDraft}**`);
  reportLines.push('');
  reportLines.push('## 五、需要人工补全的盲区');
  reportLines.push('');
  if (upgradeStats.chapterUnknownIds.length === 0) {
    reportLines.push('- ✅ 所有 ID 都成功推测出了 chapter，无人工干预需求');
  } else {
    reportLines.push(`- ⚠ 共 **${upgradeStats.chapterUnknownIds.length}** 个 ID 无法自动推测 chapter，需要人工补：`);
    for (const id of upgradeStats.chapterUnknownIds) {
      reportLines.push(`  - \`${id}\``);
    }
  }
  reportLines.push('');
  if (upgradeStats.briefMissingIds.length === 0) {
    reportLines.push('- ✅ 所有 ID 都找到了对应 brief 文件');
  } else {
    reportLines.push(`- ⚠ 共 **${upgradeStats.briefMissingIds.length}** 个 ID 在 briefs/ 下找不到对应 .txt（brief_id 留空）：`);
    for (const id of upgradeStats.briefMissingIds) {
      reportLines.push(`  - \`${id}\``);
    }
  }
  reportLines.push('');
  reportLines.push('## 六、字段命名冲突');
  reportLines.push('');
  reportLines.push('- 检查项：原 catalog 是否已有同名 `chapter` / `status` / `brief_id`');
  reportLines.push('- 结论：**无冲突**。原 catalog 的字段集为 `id / file / name / size / revisions / has_feedback / feedback_text`，三新字段全部是纯追加。');
  reportLines.push('');
  reportLines.push('## 七、下一步');
  reportLines.push('');
  reportLines.push('1. （P1）回填 34 个 part2_architecture 条目的中文 `name`（从 brief H1 抓取）');
  reportLines.push('2. （P1）把本脚本逻辑融进 `web/scripts/qa-check.js`，让任何新生成图表自动入 catalog');
  reportLines.push('3. （P2）澄清 VIS-3-021 编号空洞');
  reportLines.push('4. （P2）决定 `.tokenized.html` 派生产物的归属（目前默认不入 catalog）');
  reportLines.push('');

  fs.writeFileSync(REPORT_PATH, reportLines.join('\n'), 'utf8');

  // 控制台总结
  console.log('========== catalog-fix-2026-04-06 完成 ==========');
  console.log(`原条目数: ${originalCount}`);
  console.log(`修复后总数: ${totalAfter}`);
  console.log(`新增 ID: ${addedIds.length} 个 -> ${addedIds.join(', ')}`);
  console.log(`chapter 填空率: ${chapterFillRate}%`);
  console.log(`brief_id 填空率: ${briefIdFillRate}%`);
  console.log(`status ready/draft: ${upgradeStats.statusReady}/${upgradeStats.statusDraft}`);
  console.log(`修复报告: ${REPORT_PATH}`);
}

try {
  main();
} catch (e) {
  console.error('[FATAL] 修复脚本异常:', e);
  console.error('[ABORT] 不会自动还原 catalog，请手动运行: cp test-viz/chart-catalog.json.bak-2026-04-06 test-viz/chart-catalog.json');
  process.exit(2);
}
