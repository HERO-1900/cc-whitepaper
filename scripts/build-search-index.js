#!/usr/bin/env node
// build-search-index.js
// 扫描 book/ 下所有 .md 文件，构建全文搜索索引 -> js/search-index.json
// 用法: node scripts/build-search-index.js
//
// ⚠️ BOOK_STRUCTURE 必须从 js/data.js 单一来源读取——曾经历过双写不同步导致 search-index.json
// 默默丢失章节的事故（详见 task #135）。任何对章节列表的修改都必须改 js/data.js，本脚本会自动跟随。

const fs = require('fs');
const path = require('path');

const BOOK_DIR = path.join(__dirname, '..', 'book');
const OUTPUT = path.join(__dirname, '..', 'js', 'search-index.json');
const MAX_SECTION_TEXT = 150; // 每段最多150字

// SoT：从 data.js 动态读取（消除双写源 — 详见 task #135）
const { BOOK_STRUCTURE } = require('../js/data.js');

// 防御断言：data.js 必须正常 export
if (!Array.isArray(BOOK_STRUCTURE) || BOOK_STRUCTURE.length === 0) {
  console.error('[build-search-index] FATAL: data.js 未正确 export BOOK_STRUCTURE');
  process.exit(1);
}


/**
 * 去除 Markdown 格式标记，提取纯文本
 */
function stripMarkdown(text) {
  return text
    // 去掉代码块
    .replace(/```[\s\S]*?```/g, '')
    // 去掉行内代码
    .replace(/`([^`]+)`/g, '$1')
    // 去掉图片
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // 去掉链接，保留文本
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 去掉加粗和斜体
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // 去掉 HTML 标签
    .replace(/<[^>]+>/g, '')
    // 去掉引用前缀
    .replace(/^>\s*/gm, '')
    // 去掉表格分隔行
    .replace(/^\|[-:|\s]+\|$/gm, '')
    // 清理表格格式，保留内容
    .replace(/\|/g, ' ')
    // 去掉 heading 标记（# ## ###）
    .replace(/^#{1,6}\s+/gm, '')
    // 去掉水平线
    .replace(/^---+$/gm, '')
    // 去掉 emoji（保留文字描述即可）
    // 压缩多个空行为一个
    .replace(/\n{3,}/g, '\n\n')
    // 压缩多个空格为一个
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * 按 ## 或 ### 分段
 */
function splitSections(mdContent) {
  const sections = [];
  // 匹配 ## 或 ### 标题行
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let lastIndex = 0;
  let lastHeading = null;
  let match;

  // 先处理标题之前的导言部分
  const firstHeadingMatch = mdContent.match(/^#{2,3}\s+/m);
  if (firstHeadingMatch) {
    const introText = mdContent.slice(0, firstHeadingMatch.index);
    const stripped = stripMarkdown(introText).trim();
    if (stripped.length > 10) {
      sections.push({
        heading: '导言',
        text: stripped.slice(0, MAX_SECTION_TEXT)
      });
    }
    lastIndex = firstHeadingMatch.index;
  }

  // 重置 regex
  headingRegex.lastIndex = lastIndex;

  while ((match = headingRegex.exec(mdContent)) !== null) {
    // 保存上一段
    if (lastHeading !== null) {
      const sectionContent = mdContent.slice(lastIndex, match.index);
      const stripped = stripMarkdown(sectionContent).trim();
      if (stripped.length > 10) {
        sections.push({
          heading: lastHeading,
          text: stripped.slice(0, MAX_SECTION_TEXT)
        });
      }
    }
    lastHeading = match[2].trim();
    lastIndex = match.index + match[0].length;
  }

  // 最后一段
  if (lastHeading !== null) {
    const sectionContent = mdContent.slice(lastIndex);
    const stripped = stripMarkdown(sectionContent).trim();
    if (stripped.length > 10) {
      sections.push({
        heading: lastHeading,
        text: stripped.slice(0, MAX_SECTION_TEXT)
      });
    }
  }

  // 如果没有任何子标题，把整个文件当一段
  if (sections.length === 0) {
    const stripped = stripMarkdown(mdContent).trim();
    if (stripped.length > 10) {
      sections.push({
        heading: '正文',
        text: stripped.slice(0, MAX_SECTION_TEXT)
      });
    }
  }

  return sections;
}

function buildIndex() {
  const index = [];
  let totalChapters = 0;
  let totalSections = 0;

  for (const part of BOOK_STRUCTURE) {
    for (const ch of part.chapters) {
      const filePath = path.join(BOOK_DIR, ch.file);
      if (!fs.existsSync(filePath)) {
        console.warn(`  [SKIP] 文件不存在: ${ch.file}`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const sections = splitSections(content);

      index.push({
        id: ch.id,
        title: ch.title,
        path: 'book/' + ch.file,
        sections: sections
      });

      totalChapters++;
      totalSections += sections.length;
    }
  }

  // 写出 JSON（不格式化，减小体积）
  const json = JSON.stringify(index);
  fs.writeFileSync(OUTPUT, json, 'utf-8');

  const sizeKB = (Buffer.byteLength(json, 'utf-8') / 1024).toFixed(1);
  console.log(`\n[build-search-index] 完成!`);
  console.log(`  章节数: ${totalChapters}`);
  console.log(`  段落数: ${totalSections}`);
  console.log(`  文件大小: ${sizeKB} KB`);
  console.log(`  输出: ${OUTPUT}\n`);
}

buildIndex();
