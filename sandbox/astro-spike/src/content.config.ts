// src/content.config.ts
// Content Collections 配置：把 web/book/ 目录挂载到 Astro 的内容层
// 注意：这是 PoC，我们用符号链接（在 astro-spike/book/ 处）指向真实的 book/ 目录

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const book = defineCollection({
  // 从项目根目录的 book/ 读取（相对于 astro-spike/）
  // PoC 阶段只取 3 章来验证，通过 pattern 精确匹配
  loader: glob({
    pattern: '**/*.md',
    base: './book',
  }),
  schema: z.object({
    title: z.string().optional(),
    part: z.string().optional(),
    order: z.number().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { book };
