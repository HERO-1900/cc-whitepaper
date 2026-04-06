# 主题切换迁移计划（沙箱 → 生产）

目标：把 `sandbox/theme-tokens.css` + `theme-switch-poc.html` 的方案搬到生产站点 `web/`，让 `index.html` 支持亮/暗切换，且不破坏现有视觉。

## 改动清单

| # | 文件 | 操作 | 风险 |
|---|---|---|---|
| 1 | `web/css/theme-tokens.css`（新增） | 复制沙箱版本，作为唯一 token 源 | 低 |
| 2 | `web/css/style.css` 第 4–23 行（`:root`） | 删除硬编码变量，改 `@import "theme-tokens.css"` 或 `<link>` 顺序优先 | 中：现有 3300 行 CSS 直接引用了 `--bg-primary` 等旧名，需要在 token 文件里添加旧名→新名的别名块过渡 |
| 3 | `web/index.html` `<head>` 顶部 | 注入 5 行 FOUC 防御脚本 + `<link rel="stylesheet" href="css/theme-tokens.css">` 必须排在 `style.css` 之前 | 低 |
| 4 | `web/index.html` 顶部导航 `#topnav` | 加入三态切换按钮组（system/light/dark） | 低 |
| 5 | `web/js/app.js` | 注入主题控制器（PoC 里的同款 IIFE） | 低 |
| 6 | `test-viz/production/html/*.html`（114 个） | **不动**。由父页面通过 `postMessage` 注入 token，详见 `chart-token-injection.html` | 中：见下方"图表联动" |

## 风险点与缓解

- **变量命名冲突**：生产用 `--bg-primary`，沙箱用 `--color-bg-primary`。解决：在 `theme-tokens.css` 末尾加一个"兼容别名"块（`--bg-primary: var(--color-bg-primary);`），等所有引用迁完再删。
- **亮色下对比度不足**：生产站点原本只为暗色调过色板，部分弱化文字（`--text-muted: #4a5568`）在白底下接近不可读。需要在亮色主题里整体提一档对比度，PoC 已做。
- **图表 iframe 不联动**：iframe 里的 `:root` 是独立作用域，CSS 变量不穿透。两条路：①让 chart-embed.js 在 iframe load 后用 postMessage 推 token；②每个图表自己监听 `parent.document.documentElement` 的 `data-theme`。优先走 ①，详见 spike。
- **第三方组件**：Mermaid、Prism、KaTeX 都有自己的暗色 CSS。需要在主题切换时同步切换它们的 stylesheet `disabled` 属性。

## 回滚方案

主题文件是纯增量改动。回滚只需：① 删 `theme-tokens.css`；② 还原 `style.css` 顶部 `:root`；③ 删导航按钮和 `app.js` 里的控制器 IIFE。整个过程 < 5 分钟，没有数据迁移。Git revert 即可一键回滚。
