// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// https://astro.build/config
export default defineConfig({
  // 用于 GitHub Pages 的 base path（PoC 阶段可以不设，本地开发直接用 /）
  // base: '/cc-whitepaper',

  integrations: [
    mdx(),
  ],

  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
    // 禁用 Astro 内置的 shiki 高亮，改用 highlight.js（与现有站点一致）
    syntaxHighlight: false,
  },
});
