#!/usr/bin/env node
/**
 * QA Check Script for Claude Code 源码白皮书
 *
 * Checks:
 *   1. Readability — line count, CJK word count, code blocks, src references
 *   2. Metaphor Audit — OS vs non-technical metaphors, balance score
 *   3. Cross-Reference Check — validate src/ paths against known structure
 *   4. Completeness Score — 0-5 per chapter
 *   5. Output — qa-report.json + qa-report.md
 *
 * Usage: node scripts/qa-check.js
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ─────────────────────────────────────────────────────────

const BOOK_DIR = path.resolve(__dirname, '..', 'book');
const OUTPUT_JSON = path.resolve(__dirname, 'qa-report.json');
const OUTPUT_MD = path.resolve(__dirname, 'qa-report.md');

// Known top-level directories/files under src/ in the Claude Code codebase
const KNOWN_SRC_ENTRIES = new Set([
  'app.ts', 'auth', 'foo.ts',  // used in illustrative examples
  'assistant', 'bootstrap', 'bridge', 'buddy', 'cli', 'commands',
  'commands.ts', 'components', 'constants', 'context', 'context.ts',
  'coordinator', 'cost-tracker.ts', 'costHook.ts', 'dialogLaunchers.tsx',
  'entrypoints', 'history.ts', 'hooks', 'ink', 'ink.ts',
  'interactiveHelpers.tsx', 'keybindings', 'main.tsx', 'memdir',
  'migrations', 'moreright', 'native-ts', 'outputStyles', 'plugins',
  'projectOnboardingState.ts', 'query', 'query.ts', 'QueryEngine.ts',
  'remote', 'replLauncher.tsx', 'schemas', 'screens', 'server',
  'services', 'setup.ts', 'skills', 'state', 'Task.ts', 'tasks',
  'tasks.ts', 'Tool.ts', 'tools', 'tools.ts', 'types', 'upstreamproxy',
  'utils', 'vim', 'voice',
]);

// OS / technical metaphor keywords
const OS_METAPHOR_PATTERNS = [
  /操作系统/g, /内核/g, /进程/g, /系统调用/g, /调度器/g,
  /文件描述符/g, /中断/g, /线程/g, /信号量/g, /内存管理/g,
  /页表/g, /虚拟内存/g, /用户态/g, /内核态/g, /syscall/gi,
  /管道/g, /文件系统/g, /驱动程序/g, /上下文切换/g,
  /守护进程/g, /daemon/gi, /IPC/g, /互斥锁/g, /mutex/gi,
  /调度/g, /CPU/g, /寄存器/g, /缓冲区/g, /缓存/g,
  /流水线/g, /总线/g,
];

// Non-technical / everyday-life metaphor keywords
const NONTECH_METAPHOR_PATTERNS = [
  /好比/g, /就像/g, /类比/g, /想象一下/g, /打个比方/g,
  /相当于/g, /好像/g, /可以理解为/g, /如同/g, /比喻/g,
  /日常生活/g, /现实世界/g, /超市/g, /餐厅/g, /厨房/g,
  /快递/g, /图书馆/g, /银行/g, /公交/g, /地铁/g,
  /交通/g, /门卫/g, /保安/g, /管家/g, /秘书/g,
  /厨师/g, /菜单/g, /食谱/g, /配方/g,
  /乐高/g, /积木/g, /拼图/g, /瑞士军刀/g,
  /护城河/g, /城墙/g, /城市/g, /道路/g, /桥梁/g,
  /医生/g, /病人/g, /药方/g, /手术/g,
  /水龙头/g, /水管/g, /电路/g,
];

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Recursively find all .md files under a directory, skipping _shared
 */
function findMarkdownFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_shared') continue;
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

/**
 * Count CJK characters (rough word count for Chinese text)
 */
function countCJK(text) {
  const cjkChars = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
  return cjkChars ? cjkChars.length : 0;
}

/**
 * Count pattern matches in text
 */
function countPatterns(text, patterns) {
  let total = 0;
  for (const pat of patterns) {
    const matches = text.match(pat);
    if (matches) total += matches.length;
  }
  return total;
}

/**
 * Strip fenced code blocks from text (to avoid false positives from code examples)
 */
function stripCodeBlocks(text) {
  return text.replace(/```[\s\S]*?```/g, '');
}

/**
 * Extract all src/ path references from text (full text for counting, prose-only for validation)
 */
function extractSrcPaths(text) {
  // Match patterns like src/xxx, `src/xxx`, "src/xxx"
  const regex = /(?:^|[\s`"'(（])src\/([\w./-]+)/g;
  const paths = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    paths.push('src/' + m[1].replace(/[)）`"',;。，]+$/, ''));
  }
  return [...new Set(paths)];
}

/**
 * Extract src/ paths only from prose (outside code blocks) — for validation
 */
function extractProseSrcPaths(text) {
  const stripped = stripCodeBlocks(text);
  const regex = /(?:^|[\s`"'(（])src\/([\w./-]+)/g;
  const paths = [];
  let m;
  while ((m = regex.exec(stripped)) !== null) {
    paths.push('src/' + m[1].replace(/[)）`"',;。，]+$/, ''));
  }
  return [...new Set(paths)];
}

/**
 * Check if a src/ reference is plausible
 */
function validateSrcPath(srcPath) {
  // Extract the first path component after src/
  const parts = srcPath.replace(/^src\//, '').split('/');
  const topLevel = parts[0];
  // Also check if it's a file directly under src/
  if (KNOWN_SRC_ENTRIES.has(topLevel)) {
    return { valid: true };
  }
  // Sometimes references use different casing or partial names — be lenient
  for (const known of KNOWN_SRC_ENTRIES) {
    if (known.toLowerCase() === topLevel.toLowerCase()) {
      return { valid: true, note: 'case mismatch' };
    }
  }
  return { valid: false, reason: `unknown top-level: ${topLevel}` };
}

/**
 * Check if chapter has an introduction paragraph (non-heading text before first ##)
 */
function hasIntro(text) {
  const lines = text.split('\n');
  let pastFirstHeading = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#\s/.test(trimmed)) {
      pastFirstHeading = true;
      continue;
    }
    if (pastFirstHeading && trimmed.length > 0 && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
      return true;
    }
    // Also: content between title and first ##
    if (/^##\s/.test(trimmed)) break;
    if (pastFirstHeading && trimmed.length > 20) return true;
  }
  return false;
}

/**
 * Check for critical analysis / limitations section
 */
function hasCriticalAnalysis(text) {
  const patterns = [
    /代价/g, /局限/g, /不足/g, /权衡/g, /trade-?off/gi,
    /缺点/g, /问题/g, /风险/g, /批判/g, /反思/g,
    /注意/g, /但是/g, /然而/g, /需要警惕/g, /复杂性/g,
    /如果.*失败/g, /如果.*错误/g, /边界情况/g, /极端情况/g,
  ];
  let score = 0;
  for (const pat of patterns) {
    if (pat.test(text)) score++;
    pat.lastIndex = 0;
  }
  return score >= 3;  // At least 3 different critical patterns
}

// ─── Main Analysis ─────────────────────────────────────────────────────────

function analyzeChapter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const lineCount = lines.length;
  const cjkCount = countCJK(content);

  // Relative path for display
  const relPath = path.relative(BOOK_DIR, filePath);

  // Extract chapter title (first # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');

  // Code blocks
  const codeBlockCount = (content.match(/^```/gm) || []).length / 2;  // opening/closing pairs
  const hasCodeBlocks = codeBlockCount >= 1;

  // Source references
  const srcPaths = extractSrcPaths(content);
  const hasSrcRefs = srcPaths.length > 0;

  // Cross-reference validation (only validate paths outside code blocks)
  const prosePaths = extractProseSrcPaths(content);
  const srcValidation = prosePaths.map(p => ({
    path: p,
    ...validateSrcPath(p),
  }));
  const brokenRefs = srcValidation.filter(v => !v.valid);

  // Metaphor analysis
  const osMetaphorCount = countPatterns(content, OS_METAPHOR_PATTERNS);
  const nonTechMetaphorCount = countPatterns(content, NONTECH_METAPHOR_PATTERNS);
  const totalMetaphors = osMetaphorCount + nonTechMetaphorCount;
  const metaphorBalance = totalMetaphors > 0
    ? +(nonTechMetaphorCount / totalMetaphors).toFixed(3)
    : 0;
  const metaphorImbalance = osMetaphorCount > 3 && nonTechMetaphorCount === 0;

  // Completeness sub-scores
  const hasIntroduction = hasIntro(content);
  const hasAnalogies = (osMetaphorCount + nonTechMetaphorCount) >= 2;
  const hasCritical = hasCriticalAnalysis(content);

  const completenessDetails = {
    hasIntroduction,
    hasCodeBlocks,
    hasSrcRefs,
    hasAnalogies,
    hasCritical,
  };
  const completenessScore = Object.values(completenessDetails).filter(Boolean).length;

  // Issues
  const issues = [];
  if (lineCount < 100) {
    issues.push({ severity: 'warning', type: 'thin_chapter', message: `仅 ${lineCount} 行，可能内容不够充实` });
  }
  if (!hasCodeBlocks) {
    issues.push({ severity: 'warning', type: 'no_code', message: '没有代码块（``` 标记）' });
  }
  if (!hasSrcRefs) {
    issues.push({ severity: 'warning', type: 'no_src_ref', message: '没有源文件引用（src/ 路径）' });
  }
  if (metaphorImbalance) {
    issues.push({ severity: 'info', type: 'metaphor_imbalance', message: `OS 隐喻 ${osMetaphorCount} 处但无日常类比，比喻体系单一` });
  }
  if (brokenRefs.length > 0) {
    for (const br of brokenRefs) {
      issues.push({ severity: 'error', type: 'broken_ref', message: `可疑路径引用: ${br.path} (${br.reason})` });
    }
  }
  if (!hasIntroduction) {
    issues.push({ severity: 'info', type: 'no_intro', message: '标题后缺少引导段落' });
  }
  if (!hasCritical) {
    issues.push({ severity: 'info', type: 'no_critical', message: '缺少批判/局限性分析' });
  }

  return {
    file: relPath,
    title,
    stats: {
      lineCount,
      cjkCount,
      codeBlocks: Math.floor(codeBlockCount),
      srcPathCount: srcPaths.length,
    },
    metaphors: {
      osCount: osMetaphorCount,
      nonTechCount: nonTechMetaphorCount,
      total: totalMetaphors,
      balanceScore: metaphorBalance,
      imbalanced: metaphorImbalance,
    },
    crossRefs: {
      paths: srcPaths,
      brokenCount: brokenRefs.length,
      broken: brokenRefs,
    },
    completeness: {
      score: completenessScore,
      details: completenessDetails,
    },
    issues,
  };
}

// ─── Report Generation ─────────────────────────────────────────────────────

function generateReport(chapters) {
  const totalChapters = chapters.length;
  const totalLines = chapters.reduce((s, c) => s + c.stats.lineCount, 0);
  const totalCJK = chapters.reduce((s, c) => s + c.stats.cjkCount, 0);
  const avgCompleteness = +(chapters.reduce((s, c) => s + c.completeness.score, 0) / totalChapters).toFixed(2);
  const avgMetaphorBalance = +(chapters.reduce((s, c) => s + c.metaphors.balanceScore, 0) / totalChapters).toFixed(3);

  // All issues flattened with chapter context
  const allIssues = [];
  for (const ch of chapters) {
    for (const issue of ch.issues) {
      allIssues.push({ ...issue, chapter: ch.file, title: ch.title });
    }
  }

  // Sort by severity: error > warning > info
  const severityOrder = { error: 0, warning: 1, info: 2 };
  allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Chapters needing most work (lowest completeness + most issues)
  const needsWork = [...chapters]
    .sort((a, b) => {
      const scoreA = a.completeness.score - a.issues.length * 0.5;
      const scoreB = b.completeness.score - b.issues.length * 0.5;
      return scoreA - scoreB;
    })
    .slice(0, 10);

  return {
    summary: {
      totalChapters,
      totalLines,
      totalCJKCharacters: totalCJK,
      avgCompletenessScore: avgCompleteness,
      avgMetaphorBalance,
      totalIssues: allIssues.length,
      issuesByType: {
        error: allIssues.filter(i => i.severity === 'error').length,
        warning: allIssues.filter(i => i.severity === 'warning').length,
        info: allIssues.filter(i => i.severity === 'info').length,
      },
    },
    chapters,
    allIssues,
    needsWork: needsWork.map(c => ({
      file: c.file,
      title: c.title,
      completeness: c.completeness.score,
      issueCount: c.issues.length,
    })),
  };
}

function renderMarkdown(report) {
  const lines = [];
  const ln = (s = '') => lines.push(s);

  ln('# QA 质量报告 — Claude Code 源码白皮书');
  ln();
  ln(`> 生成时间: ${new Date().toISOString()}`);
  ln();

  // ── Overall Stats ──
  ln('## 总体统计');
  ln();
  ln(`| 指标 | 值 |`);
  ln(`|------|----|`);
  ln(`| 章节总数 | ${report.summary.totalChapters} |`);
  ln(`| 总行数 | ${report.summary.totalLines.toLocaleString()} |`);
  ln(`| 总中文字数（CJK 字符） | ${report.summary.totalCJKCharacters.toLocaleString()} |`);
  ln(`| 平均完整性评分 | ${report.summary.avgCompletenessScore} / 5 |`);
  ln(`| 平均比喻平衡度 | ${report.summary.avgMetaphorBalance} |`);
  ln(`| 总问题数 | ${report.summary.totalIssues}（${report.summary.issuesByType.error} 错误 / ${report.summary.issuesByType.warning} 警告 / ${report.summary.issuesByType.info} 提示） |`);
  ln();

  // ── Top Issues ──
  ln('## 重要问题（按严重度排序）');
  ln();
  if (report.allIssues.length === 0) {
    ln('*没有发现问题。*');
  } else {
    const severityEmoji = { error: 'ERROR', warning: 'WARN', info: 'INFO' };
    ln('| 严重度 | 章节 | 类型 | 说明 |');
    ln('|--------|------|------|------|');
    for (const issue of report.allIssues) {
      ln(`| ${severityEmoji[issue.severity]} | ${issue.title} | ${issue.type} | ${issue.message} |`);
    }
  }
  ln();

  // ── Chapters Needing Most Work ──
  ln('## 最需要完善的章节 (Top 10)');
  ln();
  ln('| 章节 | 完整性 | 问题数 | 文件 |');
  ln('|------|--------|--------|------|');
  for (const ch of report.needsWork) {
    ln(`| ${ch.title} | ${ch.completeness}/5 | ${ch.issueCount} | \`${ch.file}\` |`);
  }
  ln();

  // ── Per-Chapter Detail ──
  ln('## 各章节详情');
  ln();
  for (const ch of report.chapters) {
    ln(`### ${ch.title}`);
    ln();
    ln(`**文件**: \`${ch.file}\``);
    ln();
    ln(`| 指标 | 值 |`);
    ln(`|------|----|`);
    ln(`| 行数 | ${ch.stats.lineCount} |`);
    ln(`| CJK 字数 | ${ch.stats.cjkCount.toLocaleString()} |`);
    ln(`| 代码块数 | ${ch.stats.codeBlocks} |`);
    ln(`| 源码引用数 | ${ch.stats.srcPathCount} |`);
    ln(`| OS 隐喻 | ${ch.metaphors.osCount} |`);
    ln(`| 日常类比 | ${ch.metaphors.nonTechCount} |`);
    ln(`| 比喻平衡度 | ${ch.metaphors.balanceScore} |`);
    ln(`| 完整性评分 | ${ch.completeness.score}/5 |`);
    ln();

    // Completeness breakdown
    const d = ch.completeness.details;
    const check = v => v ? 'Y' : '-';
    ln(`完整性: 引言=${check(d.hasIntroduction)} 代码=${check(d.hasCodeBlocks)} 源码引用=${check(d.hasSrcRefs)} 比喻=${check(d.hasAnalogies)} 批判分析=${check(d.hasCritical)}`);
    ln();

    if (ch.issues.length > 0) {
      ln('**问题:**');
      for (const issue of ch.issues) {
        ln(`- [${issue.severity.toUpperCase()}] ${issue.message}`);
      }
      ln();
    }

    if (ch.crossRefs.paths.length > 0) {
      ln(`**引用的源文件** (${ch.crossRefs.paths.length}): ${ch.crossRefs.paths.slice(0, 10).map(p => '`' + p + '`').join(', ')}${ch.crossRefs.paths.length > 10 ? ' ...' : ''}`);
      ln();
    }

    ln('---');
    ln();
  }

  return lines.join('\n');
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main() {
  console.log('=== QA Check: Claude Code 源码白皮书 ===\n');

  const mdFiles = findMarkdownFiles(BOOK_DIR);
  console.log(`Found ${mdFiles.length} chapter files.\n`);

  const chapters = mdFiles.map(f => analyzeChapter(f));
  const report = generateReport(chapters);

  // Write JSON
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`JSON report written to: ${OUTPUT_JSON}`);

  // Write Markdown
  const md = renderMarkdown(report);
  fs.writeFileSync(OUTPUT_MD, md, 'utf-8');
  console.log(`Markdown report written to: ${OUTPUT_MD}`);

  // Console summary
  console.log('\n── Summary ──');
  console.log(`  Chapters: ${report.summary.totalChapters}`);
  console.log(`  Total lines: ${report.summary.totalLines}`);
  console.log(`  Total CJK chars: ${report.summary.totalCJKCharacters}`);
  console.log(`  Avg completeness: ${report.summary.avgCompletenessScore}/5`);
  console.log(`  Avg metaphor balance: ${report.summary.avgMetaphorBalance}`);
  console.log(`  Issues: ${report.summary.totalIssues} (${report.summary.issuesByType.error} errors, ${report.summary.issuesByType.warning} warnings, ${report.summary.issuesByType.info} info)`);

  if (report.summary.issuesByType.error > 0) {
    console.log('\n── Errors ──');
    for (const issue of report.allIssues.filter(i => i.severity === 'error')) {
      console.log(`  [ERROR] ${issue.title}: ${issue.message}`);
    }
  }

  console.log('\n── Top 5 chapters needing work ──');
  for (const ch of report.needsWork.slice(0, 5)) {
    console.log(`  ${ch.title} — completeness: ${ch.completeness}/5, issues: ${ch.issueCount}`);
  }

  // ── search-index.json 完整性校验（防御 #135 双写源事故） ──
  // 历史问题：build-search-index.js 曾硬编码 BOOK_STRUCTURE 与 data.js 不同步，
  // 导致 search-index.json 默默丢失章节。现 build 脚本已从 data.js 单一源读取，
  // 这里再加一道 CI 校验，确保 search-index.json entries 数 >= data.js BOOK_STRUCTURE 章节数。
  console.log('\n── search-index 完整性校验 ──');
  try {
    const { BOOK_STRUCTURE } = require('../js/data.js');
    const expectedChapters = BOOK_STRUCTURE.reduce((sum, p) => sum + p.chapters.length, 0);
    const searchIndexPath = path.resolve(__dirname, '..', 'js', 'search-index.json');
    const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8'));
    const actualEntries = Array.isArray(searchIndex) ? searchIndex.length : 0;
    if (actualEntries < expectedChapters) {
      console.log(`  ❌ FAIL: search-index.json 有 ${actualEntries} entries，data.js 期望 ${expectedChapters}`);
      console.log(`     修复：node scripts/build-search-index.js`);
      process.exitCode = 1;
    } else {
      console.log(`  ✅ OK: ${actualEntries}/${expectedChapters} entries 完整`);
    }
  } catch (e) {
    console.log(`  ⚠️  跳过校验：${e.message}`);
  }

  console.log('\nDone.');
}

main();
