# Astro 迁移可行性调研

> 范围：评估把 CC 白皮书 Web 站点（87 个 Markdown 章节 + 114 个独立 HTML 图表 + 纯静态部署）迁移到 Astro 的收益、成本、风险。仅文档调研，不动代码。
> 调研日期：2026-04-06
> 数据源：[Astro Why](https://docs.astro.build/en/concepts/why-astro/)、[Content Collections](https://docs.astro.build/en/guides/content-collections/)、[From Eleventy](https://docs.astro.build/en/guides/migrate-to-astro/from-eleventy/)

---

## 一、Astro 是否适合本项目？

**适合度：高（4/5）**。

Astro 的官方定位是"内容驱动型站点"——博客、文档、营销站、Portfolio。CC 白皮书的形态（长文 + 图表 + 工具目录 + 术语表）正好踩在 Astro 的甜区中央，与 Astro Docs、Tailwind Blog、Cloudflare Workers Docs 这些成功案例结构一致。

匹配点：
- **静态优先**：CC 站点本质是"写好的内容"，没有用户登录、没有实时数据、没有数据库。Astro "Zero JS by default" + 全站 SSG 输出，正好能把当前 5000+ 行的运行时 JS 砍掉一大半。
- **岛屿架构**：少数交互组件（搜索面板、图表、画廊筛选）作为"岛"按需 hydrate，长文阅读区域完全零 JS，首屏体积可以从当前 ~150KB 砍到 ~30KB。
- **Markdown 一等公民**：Astro 内建 remark/rehype 管线，front-matter、目录提取、代码高亮全部内置。
- **不锁定 UI 框架**：Vue/React/Svelte/Solid 都可以混用，未来如果引入 Shadcn-ui，只需开 React integration。

不完全匹配的地方：
- 当前站点是 SPA-ish 单页（`#topnav` + 多 view 切换），Astro 默认是 MPA（每页是独立 HTML）。导航交互需要重新设计或加 ViewTransitions API。
- 87 章 Markdown 当前用自研的 `engine.js` 渲染，Astro 会用自己的 remark 管线接管。需要重对一下渲染差异（脚注、callout、表格扩展语法）。

---

## 二、Content Collections 怎么吃我们现有的 `book/*.md`？

**结论：可以直接吃，几乎无痛**。

Content Collections 用 `glob()` loader 从指定目录抓 Markdown，自动解析 front-matter，按 Zod schema 校验类型。我们当前的目录结构：

```
book/
├── part0_序章/
│   ├── 00.0_前言.md
│   └── ...
├── part1_认识这个系统/
├── part2_好奇心驱动的深度问答/
├── part2_代码架构完全解构/
├── part3_子系统完全解析/
├── part4_工程哲学/
└── part5_批判与超越/
```

可以直接配成：

```js
// src/content.config.ts （示意，不要执行）
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const book = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './book' }),
  schema: z.object({
    title: z.string(),
    part: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { book };
```

约束：
- 中文路径名（`part0_序章`）Astro 支持，但 URL slug 默认会用文件名，需要在 front-matter 里显式声明 `slug` 来避免 URL 编码混乱。
- 当前 `book/*.md` 的 front-matter 不一定齐全。需要先扫一遍，给缺失字段写一个迁移脚本批量补齐。
- 章节顺序当前是文件名前缀（`00.0_`、`01.1_`）排序，Astro 集合默认按 id 排序，行为兼容。

---

## 三、114 个图表 HTML 能不能作为 Astro 组件直接嵌入？

**结论：能，但有三种姿势可选，各有取舍**。

**姿势 A：保持 iframe 嵌入（最低成本）**
- 把 `test-viz/production/html/*.html` 整体放进 `public/test-viz/`，Astro 不处理它们，原样输出到构建产物。
- Astro 组件里仍用 `<iframe src="/test-viz/...">`，和现状完全一致。
- 优点：零迁移成本，每个图表独立沙箱，CSS/JS 不会泄漏。
- 缺点：iframe 不能继承父页主题（除非走 token 注入 spike），首屏加载多一次 HTML 请求。

**姿势 B：用 `set:html` 内联（中等成本）**
- 写一个 Astro 组件 `<ChartEmbed id="VIS-0-001" />`，构建时 `fs.readFile` 把图表 HTML 字符串读出来，用 `<Fragment set:html={raw} />` 内联到当前页。
- 优点：单次请求，无 iframe 边框，主题变量天然继承。
- 缺点：图表自带的 `:root { --bg: #0d1117 }` 会污染父页（CSS 选择器作用域问题），需要在构建时用脚本把每个图表的 `<style>` 加上 scope 前缀（如 `[data-chart="VIS-0-001"] { ... }`）。这是个一次性的 codemod 工程。

**姿势 C：拆成 Astro/Vue 组件重写（最高成本）**
- 把 D3/Mermaid 图表逐个改写成 Astro 组件 + framework integration。
- 优点：彻底享受 Astro 的 hydration 控制，按需加载。
- 缺点：114 个图表全部重写 = 工作量爆炸。**不推荐**。

**推荐组合**：先走 **姿势 A**（保留 iframe），用主题 token 注入解决联动问题；等迁移稳定后，对最热的 10–20 个图表做 **姿势 B** 升级。

---

## 四、迁移成本估算（不做时间预估，只评估"工作量级"）

| 模块 | 工作量级 | 必须改 / 可保留 | 备注 |
|---|---|---|---|
| `book/*.md` 内容文件 | **小** | 保留，加 schema | 可能需要补 front-matter |
| 87 章渲染管线（`engine.js`） | **大** | 必须改 | Astro 用自己的 remark 接管，自研引擎下线；需对齐 callout、脚注、目录提取等扩展语法 |
| 114 个图表 HTML | **小** | 保留（姿势 A） | 放 `public/`，零改动 |
| 顶部导航 `#topnav` + view 切换 | **中** | 必须改 | SPA 拆 MPA；可上 ViewTransitions 平滑过渡 |
| Cmd+K 搜索（`search-index.json`） | **小** | 保留 | 只是把客户端 JS 拆成一个 island 组件 |
| 工具目录、术语表、画廊 | **中** | 必须改 | 当前是 `tools-data.js` 大对象 + `gallery.js`，迁到 collection + 组件 |
| QA 脚本（`scripts/qa-check.js`） | **小** | 保留 | 跑在构建产物上，与框架无关 |
| 主题切换（沙箱方案） | **小** | 直接复用 | token CSS + IIFE 两个文件搬过去就行 |
| GitHub Pages 部署 | **小** | 改 workflow | Astro 输出到 `dist/`，调一下 GH Actions 的 publish 路径 |

**总体量级：中**。预计大头在 ① 内容渲染管线对齐 ② 顶导航 SPA→MPA 改造。

---

## 五、替代方案对比

### Astro
内容站的当代默认选择。岛屿架构 + Zero JS + 多框架 + 一流 Markdown 支持，与 CC 白皮书形态高度匹配。代价是要接受 Astro 的目录约定、改造现有 SPA 导航、对齐 Markdown 渲染管线。**适合"想要长期演进 + 愿意一次性付迁移成本"的场景**。

### Eleventy (11ty)
更轻、更接近原始静态，没有 Astro 的"组件化"包袱。如果只想要 Markdown→HTML 的纯净管线，Eleventy 是更小的依赖。但是没有岛屿架构、没有现成的客户端组件水合、社区生态明显小于 Astro，且我们后续如果想做交互组件（Cmd+K、动态图表筛选），还得自己拼。**适合"不想引入框架心智 + 接受手动管理 JS"的场景**。

### 继续纯静态（现状）
零迁移成本，当前 `engine.js` + `app.js` + `chart-embed.js` 已经能跑。代价是：① 没有构建时优化，所有 JS 都跑在客户端；② 内容增长后维护成本指数上升（已经 5000+ 行 JS）；③ Markdown 渲染、front-matter 管理、SEO meta、sitemap 都得自己写。**适合"内容已冻结、不再大改"的场景**。CC 白皮书显然不是这种状态。

---

## 六、推荐路径

1. **短期**：先把主题切换 PoC（沙箱方案）搬到当前生产站点，享受 80% 的视觉收益。
2. **中期**：在 sandbox 里跑一个最小 Astro starter，把 5 章 Markdown + 5 个图表搬进去验证渲染管线对齐情况。**这一步是 go/no-go 决策点**。
3. **长期**：如果中期验证通过，再做整站迁移；否则继续在纯静态上加岛（按需引入 Petite Vue / Alpine.js 做局部交互）。

不建议跳过中期直接整站迁。87 章内容 + 114 图表，渲染差异可能藏着十几个边界情况，没经过 5 章对齐就直接迁，回滚成本巨大。
