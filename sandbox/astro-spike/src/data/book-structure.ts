// src/data/book-structure.ts
// 从 web/js/data.js 提取的 BOOK_STRUCTURE，TypeScript 版本
// PoC 阶段仅收录 3 章，完整迁移时可扩展

export interface Chapter {
  id: string;
  /** 相对于 book/ 目录的文件路径（不含 book/ 前缀） */
  file: string;
  title: string;
  /** Astro 路由 slug（由文件路径生成，中文路径转为 URL-safe 格式） */
  slug: string;
}

export interface BookPart {
  id: string;
  title: string;
  chapters: Chapter[];
}

// slug 生成规则：把 "part0_序章/00_序章" 转成 "part0/00" 这样的 URL
// 完整迁移时可以考虑用 front-matter 里的 slug 字段覆盖
function makeSlug(file: string): string {
  // 去掉 .md 扩展名
  const noExt = file.replace(/\.md$/, '');
  // 取文件名（无目录前缀的部分）用于最终 URL 段
  const parts = noExt.split('/');
  // part 目录去掉中文描述部分（partX_xxx → partX）
  const partSeg = parts[0].replace(/_[^_]+$/, '');
  // 章节文件名（00_序章 → 00-序章，用于 URL）
  const chapterSeg = parts[1]
    .replace(/_/g, '-')
    .toLowerCase();
  return `${partSeg}/${chapterSeg}`;
}

export const BOOK_STRUCTURE: BookPart[] = [
  {
    id: 'part0',
    title: 'Part 0 · 序章',
    chapters: [
      {
        id: 'p0-00',
        file: 'part0_序章/00_序章.md',
        title: '序章：当你打开一个"聊天助手"的引擎盖',
        slug: makeSlug('part0_序章/00_序章.md'),
      },
    ],
  },
  {
    id: 'part1',
    title: 'Part 1 · 认识这个系统',
    chapters: [
      {
        id: 'p1-01',
        file: 'part1_认识这个系统/01_这不是聊天机器人.md',
        title: '01 这不是聊天机器人',
        slug: makeSlug('part1_认识这个系统/01_这不是聊天机器人.md'),
      },
      {
        id: 'p1-02',
        file: 'part1_认识这个系统/02_五分钟看懂系统架构.md',
        title: '02 五分钟看懂系统架构',
        slug: makeSlug('part1_认识这个系统/02_五分钟看懂系统架构.md'),
      },
      {
        id: 'p1-03',
        file: 'part1_认识这个系统/03_读懂本书需要的全部概念.md',
        title: '03 读懂本书需要的全部概念',
        slug: makeSlug('part1_认识这个系统/03_读懂本书需要的全部概念.md'),
      },
      {
        id: 'p1-04',
        file: 'part1_认识这个系统/04_八个子系统的全景地图.md',
        title: '04 八个子系统的全景地图',
        slug: makeSlug('part1_认识这个系统/04_八个子系统的全景地图.md'),
      },
    ],
  },
  {
    id: 'part2',
    title: 'Part 2 · 代码架构完全解构',
    chapters: [
      {
        id: 'p2-01',
        file: 'part2_代码架构完全解构/01_代码地图.md',
        title: '01 代码地图',
        slug: makeSlug('part2_代码架构完全解构/01_代码地图.md'),
      },
      {
        id: 'p2-02',
        file: 'part2_代码架构完全解构/02_启动序列.md',
        title: '02 启动序列',
        slug: makeSlug('part2_代码架构完全解构/02_启动序列.md'),
      },
      {
        id: 'p2-03',
        file: 'part2_代码架构完全解构/03_提示词工厂.md',
        title: '03 提示词工厂',
        slug: makeSlug('part2_代码架构完全解构/03_提示词工厂.md'),
      },
      {
        id: 'p2-04',
        file: 'part2_代码架构完全解构/04_查询循环.md',
        title: '04 查询循环',
        slug: makeSlug('part2_代码架构完全解构/04_查询循环.md'),
      },
      {
        id: 'p2-05',
        file: 'part2_代码架构完全解构/05_工具运行时.md',
        title: '05 工具运行时',
        slug: makeSlug('part2_代码架构完全解构/05_工具运行时.md'),
      },
      {
        id: 'p2-06',
        file: 'part2_代码架构完全解构/06_Agent编排.md',
        title: '06 Agent 编排',
        slug: makeSlug('part2_代码架构完全解构/06_Agent编排.md'),
      },
      {
        id: 'p2-07',
        file: 'part2_代码架构完全解构/07_安全架构.md',
        title: '07 安全架构',
        slug: makeSlug('part2_代码架构完全解构/07_安全架构.md'),
      },
    ],
  },
];

// 打平所有章节，方便做"上一章/下一章"导航
export const ALL_CHAPTERS: Chapter[] = BOOK_STRUCTURE.flatMap(p => p.chapters);
