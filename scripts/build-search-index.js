#!/usr/bin/env node
// build-search-index.js
// 扫描 book/ 下所有 .md 文件，构建全文搜索索引 -> js/search-index.json
// 用法: node scripts/build-search-index.js

const fs = require('fs');
const path = require('path');

const BOOK_DIR = path.join(__dirname, '..', 'book');
const OUTPUT = path.join(__dirname, '..', 'js', 'search-index.json');
const MAX_SECTION_TEXT = 150; // 每段最多150字

/**
 * BOOK_STRUCTURE 与 data.js 中保持一致，用来获取 id 和 title
 */
const BOOK_STRUCTURE = [
  {
    id: 'part0',
    title: 'Part 0 · 序章',
    chapters: [
      { id: 'p0-00', file: 'part0_序章/00_序章.md', title: '序章：当你打开一个"聊天助手"的引擎盖' },
    ],
  },
  {
    id: 'part1',
    title: 'Part 1 · 认识这个系统',
    chapters: [
      { id: 'p1-01', file: 'part1_认识这个系统/01_这不是聊天机器人.md', title: '01 这不是聊天机器人' },
      { id: 'p1-02', file: 'part1_认识这个系统/02_五分钟看懂系统架构.md', title: '02 五分钟看懂系统架构' },
      { id: 'p1-03', file: 'part1_认识这个系统/03_读懂本书需要的全部概念.md', title: '03 读懂本书需要的全部概念' },
      { id: 'p1-04', file: 'part1_认识这个系统/04_八个子系统的全景地图.md', title: '04 八个子系统的全景地图' },
    ],
  },
  {
    id: 'part2',
    title: 'Part 2 · 代码架构完全解构',
    chapters: [
      { id: 'p2-01', file: 'part2_代码架构完全解构/01_代码地图.md', title: '01 代码地图' },
      { id: 'p2-02', file: 'part2_代码架构完全解构/02_启动序列.md', title: '02 启动序列' },
      { id: 'p2-03', file: 'part2_代码架构完全解构/03_提示词工厂.md', title: '03 提示词工厂' },
      { id: 'p2-04', file: 'part2_代码架构完全解构/04_查询循环.md', title: '04 查询循环' },
      { id: 'p2-05', file: 'part2_代码架构完全解构/05_工具运行时.md', title: '05 工具运行时' },
      { id: 'p2-06', file: 'part2_代码架构完全解构/06_Agent编排.md', title: '06 Agent 编排' },
      { id: 'p2-07', file: 'part2_代码架构完全解构/07_安全架构.md', title: '07 安全架构' },
      { id: 'p2-08', file: 'part2_代码架构完全解构/08_状态与持久化.md', title: '08 状态与持久化' },
      { id: 'p2-09', file: 'part2_代码架构完全解构/09_扩展生态.md', title: '09 扩展生态' },
      { id: 'p2-10', file: 'part2_代码架构完全解构/10_Token经济学.md', title: '10 Token 经济学' },
      { id: 'p2-11', file: 'part2_代码架构完全解构/11_配置治理.md', title: '11 配置治理' },
      { id: 'p2-12', file: 'part2_代码架构完全解构/12_终端UI.md', title: '12 终端 UI' },
      { id: 'p2-13', file: 'part2_代码架构完全解构/13_横切关注点.md', title: '13 横切关注点' },
    ],
  },
  {
    id: 'part3',
    title: 'Part 3 · 好奇心驱动的深度问答',
    chapters: [
      { id: 'p3-Q01', file: 'part2_好奇心驱动的深度问答/Q01_那三行在import之前的代码是什么把戏.md', title: 'Q01 那三行在 import 之前的代码是什么把戏' },
      { id: 'p3-Q02', file: 'part2_好奇心驱动的深度问答/Q02_上下文压缩为什么需要六套机制.md', title: 'Q02 上下文压缩为什么需要六套机制' },
      { id: 'p3-Q03', file: 'part2_好奇心驱动的深度问答/Q03_子Agent是怎么被创建和管理的.md', title: 'Q03 子 Agent 是怎么被创建和管理的' },
      { id: 'p3-Q04', file: 'part2_好奇心驱动的深度问答/Q04_工具为什么能在模型还没停止说话时就开始执行.md', title: 'Q04 工具为什么能在模型还没停止说话时就开始执行' },
      { id: 'p3-Q05', file: 'part2_好奇心驱动的深度问答/Q05_权限系统是怎么在灵活性和安全性之间走钢丝的.md', title: 'Q05 权限系统是怎么在灵活性和安全性之间走钢丝的' },
      { id: 'p3-Q06', file: 'part2_好奇心驱动的深度问答/Q06_Claude在你打字的时候偷偷在做什么.md', title: 'Q06 Claude 在你打字的时候偷偷在做什么' },
      { id: 'p3-Q07', file: 'part2_好奇心驱动的深度问答/Q07_CLAUDE_md是怎么被找到和组装的.md', title: 'Q07 CLAUDE.md 是怎么被找到和组装的' },
      { id: 'p3-Q08', file: 'part2_好奇心驱动的深度问答/Q08_设置系统为什么需要五层优先级.md', title: 'Q08 设置系统为什么需要五层优先级' },
      { id: 'p3-Q09', file: 'part2_好奇心驱动的深度问答/Q09_Session里那个默默记笔记的AI是谁.md', title: 'Q09 Session 里那个默默记笔记的 AI 是谁' },
      { id: 'p3-Q10', file: 'part2_好奇心驱动的深度问答/Q10_用户能在Claude的生命周期里插多少个钩子.md', title: 'Q10 用户能在 Claude 的生命周期里插多少个钩子' },
      { id: 'p3-Q11', file: 'part2_好奇心驱动的深度问答/Q11_对话也可以像代码一样分支和回滚吗.md', title: 'Q11 对话也可以像代码一样分支和回滚吗' },
      { id: 'p3-Q12', file: 'part2_好奇心驱动的深度问答/Q12_插件系统是怎么防止你被恶意扩展攻击的.md', title: 'Q12 插件系统是怎么防止你被恶意扩展攻击的' },
      { id: 'p3-Q13', file: 'part2_好奇心驱动的深度问答/Q13_Skills和斜杠命令有什么本质区别.md', title: 'Q13 Skills 和斜杠命令有什么本质区别' },
      { id: 'p3-Q14', file: 'part2_好奇心驱动的深度问答/Q14_多个Claude实例是怎么协同工作的.md', title: 'Q14 多个 Claude 实例是怎么协同工作的' },
      { id: 'p3-Q15', file: 'part2_好奇心驱动的深度问答/Q15_终端里那只小动物是怎么活起来的.md', title: 'Q15 终端里那只小动物是怎么活起来的' },
      { id: 'p3-Q16', file: 'part2_好奇心驱动的深度问答/Q16_如何从浏览器远程驾驶你的终端AI.md', title: 'Q16 如何从浏览器远程驾驶你的终端 AI' },
      { id: 'p3-Q17', file: 'part2_好奇心驱动的深度问答/Q17_你的声音是怎么变成代码指令的.md', title: 'Q17 你的声音是怎么变成代码指令的' },
      { id: 'p3-Q18', file: 'part2_好奇心驱动的深度问答/Q18_AI的记忆是怎么跨越对话存活的.md', title: 'Q18 AI 的记忆是怎么跨越对话存活的' },
      { id: 'p3-Q19', file: 'part2_好奇心驱动的深度问答/Q19_Claude是怎么决定该想多深的.md', title: 'Q19 Claude 是怎么决定该想多深的' },
      { id: 'p3-Q20', file: 'part2_好奇心驱动的深度问答/Q20_这个工具到底藏了多少命令.md', title: 'Q20 这个工具到底藏了多少命令' },
      { id: 'p3-Q21', file: 'part2_好奇心驱动的深度问答/Q21_MagicDocs是怎么自动维护文档的.md', title: 'Q21 MagicDocs 是怎么自动维护文档的' },
      { id: 'p3-Q22', file: 'part2_好奇心驱动的深度问答/Q22_Computer_Use是怎么让AI操控你的屏幕的.md', title: 'Q22 Computer Use 是怎么让 AI 操控屏幕的' },
      { id: 'p3-Q23', file: 'part2_好奇心驱动的深度问答/Q23_Deep_Link和Teleport是怎么跨设备连接的.md', title: 'Q23 Deep Link 和 Teleport 跨设备连接' },
      { id: 'p3-Q24', file: 'part2_好奇心驱动的深度问答/Q24_用户输入是怎么一步步变成AI请求的.md', title: 'Q24 用户输入到 AI 请求的完整链路' },
      { id: 'p3-Q25', file: 'part2_好奇心驱动的深度问答/Q25_BashTool的安全防线是怎么工作的.md', title: 'Q25 BashTool 的安全防线' },
    ],
  },
  {
    id: 'part4',
    title: 'Part 4 · 子系统完全解析',
    chapters: [
      { id: 'p4-01', file: 'part3_子系统完全解析/01_权限系统完全解析.md', title: '01 权限系统完全解析' },
      { id: 'p4-02', file: 'part3_子系统完全解析/02_投机执行子系统完全解析.md', title: '02 投机执行子系统完全解析' },
      { id: 'p4-03', file: 'part3_子系统完全解析/03_MCP平台完全解析.md', title: '03 MCP 平台完全解析' },
      { id: 'p4-04', file: 'part3_子系统完全解析/04_Hooks子系统完全解析.md', title: '04 Hooks 子系统完全解析' },
      { id: 'p4-05', file: 'part3_子系统完全解析/05_插件系统完全解析.md', title: '05 插件系统完全解析' },
      { id: 'p4-06', file: 'part3_子系统完全解析/06_CLAUDE_md加载系统完全解析.md', title: '06 CLAUDE.md 加载系统完全解析' },
      { id: 'p4-07', file: 'part3_子系统完全解析/07_Sandbox沙箱系统完全解析.md', title: '07 Sandbox 沙箱系统完全解析' },
      { id: 'p4-08', file: 'part3_子系统完全解析/08_遥测与可观测性完全解析.md', title: '08 遥测与可观测性完全解析' },
      { id: 'p4-09', file: 'part3_子系统完全解析/09_设置系统完全解析.md', title: '09 设置系统完全解析' },
      { id: 'p4-10', file: 'part3_子系统完全解析/10_Agent与任务系统完全解析.md', title: '10 Agent 与任务系统完全解析' },
      { id: 'p4-11', file: 'part3_子系统完全解析/11_文件历史系统完全解析.md', title: '11 文件历史系统完全解析' },
      { id: 'p4-12', file: 'part3_子系统完全解析/Vim模式完全解析.md', title: '12 Vim 模式完全解析' },
      { id: 'p4-13', file: 'part3_子系统完全解析/键绑定系统完全解析.md', title: '13 键绑定系统完全解析' },
      { id: 'p4-14', file: 'part3_子系统完全解析/任务执行管道完全解析.md', title: '14 任务执行管道完全解析' },
      { id: 'p4-15', file: 'part3_子系统完全解析/协调器模式完全解析.md', title: '15 协调器模式完全解析' },
      { id: 'p4-16', file: 'part3_子系统完全解析/远程Agent管理完全解析.md', title: '16 远程 Agent 管理完全解析' },
      { id: 'p4-17', file: 'part3_子系统完全解析/记忆系统完全解析.md', title: '17 记忆系统完全解析' },
      { id: 'p4-18', file: 'part3_子系统完全解析/12_Bridge远程架构完全解析.md', title: '18 Bridge 远程架构完全解析' },
      { id: 'p4-19', file: 'part3_子系统完全解析/13_Buddy伴侣系统完全解析.md', title: '19 Buddy 伴侣系统完全解析' },
      { id: 'p4-20', file: 'part3_子系统完全解析/14_语音系统完全解析.md', title: '20 语音系统完全解析' },
      { id: 'p4-21', file: 'part3_子系统完全解析/15_Skill加载基础设施完全解析.md', title: '21 Skill 加载基础设施完全解析' },
      { id: 'p4-22', file: 'part3_子系统完全解析/16_输出样式系统完全解析.md', title: '22 输出样式系统完全解析' },
      { id: 'p4-23', file: 'part3_子系统完全解析/17_遥测与分析系统完全解析.md', title: '23 遥测与分析系统完全解析' },
      { id: 'p4-24', file: 'part3_子系统完全解析/18_Bash_AST解析器完全解析.md', title: '24 Bash AST 解析器完全解析' },
      { id: 'p4-25', file: 'part3_子系统完全解析/19_Cron调度系统完全解析.md', title: '25 Cron 调度系统完全解析' },
      { id: 'p4-26', file: 'part3_子系统完全解析/20_团队记忆同步完全解析.md', title: '26 团队记忆同步完全解析' },
      { id: 'p4-27', file: 'part3_子系统完全解析/21_FastMode与UltraPlan完全解析.md', title: '27 Fast Mode 与 UltraPlan 完全解析' },
      { id: 'p4-28', file: 'part3_子系统完全解析/22_PromptCache可观测性完全解析.md', title: '28 Prompt Cache 可观测性完全解析' },
    ],
  },
  {
    id: 'part5',
    title: 'Part 5 · 工程哲学',
    chapters: [
      { id: 'p5-01', file: 'part4_工程哲学/01_在等待时间里藏工作.md', title: '01 在等待时间里藏工作' },
      { id: 'p5-02', file: 'part4_工程哲学/02_token是一等公民.md', title: '02 Token 是一等公民' },
      { id: 'p5-03', file: 'part4_工程哲学/03_把AI当乐高积木.md', title: '03 把 AI 当乐高积木' },
      { id: 'p5-04', file: 'part4_工程哲学/04_多层防线不是偏执是必要.md', title: '04 多层防线不是偏执是必要' },
      { id: 'p5-05', file: 'part4_工程哲学/05_可观测性是产品功能不是运维工具.md', title: '05 可观测性是产品功能不是运维工具' },
      { id: 'p5-06', file: 'part4_工程哲学/06_Prompt的八大设计智慧.md', title: '06 Prompt 的八大设计智慧' },
    ],
  },
  {
    id: 'part6',
    title: 'Part 6 · 批判与超越',
    chapters: [
      { id: 'p6-01', file: 'part5_批判与超越/01_这个系统的代价.md', title: '01 这个系统的代价' },
      { id: 'p6-02', file: 'part5_批判与超越/02_如果我来重新设计.md', title: '02 如果我来重新设计' },
      { id: 'p6-03', file: 'part5_批判与超越/03_把这些思想用在你的项目里.md', title: '03 把这些思想用在你的项目里' },
    ],
  },
];

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
