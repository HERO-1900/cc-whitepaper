# 图表嵌入系统 — 架构设计笔记

## 1. 系统架构

```
chart-embedding-map.json  (数据源: 83 个占位符 <-> 图表映射)
        │
        ▼
  js/chart-embed.js      (核心模块: 加载映射, 扫描DOM, 替换占位符)
        │
        ▼
  js/app.js              (集成点: renderMarkdown() 结束后调用 ChartEmbed.embed())
        │
        ▼
  css/style.css          (样式: .chart-embed-* 系列)
```

### 文件清单

| 文件 | 作用 |
|------|------|
| `js/chart-embed.js` | 图表嵌入核心模块（独立 IIFE，暴露 `window.ChartEmbed`） |
| `css/style.css` | 新增 `/* ===== CHART EMBEDDING SYSTEM ===== */` 区块 |
| `js/app.js` | 在 `renderMarkdown()` 末尾增加一行 `ChartEmbed.embed(chapterBody)` |
| `index.html` | 在 `app.js` 前加载 `chart-embed.js` |
| `test-viz/chart-embedding-map.json` | 数据源（不修改） |

### 工作流程

1. **页面加载时**: `chart-embed.js` 立即 fetch `chart-embedding-map.json`，构建 `placeholder_id -> mapping` 的查找表
2. **章节加载时**: `app.js` 的 `renderMarkdown()` 先用 marked.js 将 markdown 渲染为 HTML，再做后处理（语法高亮、blockquote 分类、表格包裹），最后调用 `ChartEmbed.embed(chapterBody)`
3. **占位符扫描**: `embedCharts()` 使用 TreeWalker 遍历所有文本节点，用正则 `/\[图表预留\s+(\d+\.\d+-[A-Z])[^\]]*\]/` 提取 placeholder_id
4. **DOM 替换**: 找到占位符所在的最高级容器（blockquote > p），整体替换为折叠式图表容器
5. **懒加载**: iframe 只在用户首次点击展开时才创建和加载，避免一个章节同时加载多个重型 HTML

## 2. 占位符格式覆盖

书中占位符有多种格式变体：

| 格式 | 示例 | 处理方式 |
|------|------|---------|
| 裸占位符 | `[图表预留 1.3-A]` | 直接在 `<p>` 中匹配 |
| 带描述 | `[图表预留 1.4-A：系统全景架构图（...）]` | 正则忽略冒号后内容 |
| blockquote + bold | `> **[图表预留 2.7-A]**：描述` | 向上查找到 `<blockquote>` 替换整个块 |
| 多占位符连续 | 同一 blockquote 内 4 个占位符 | 逐个生成容器，一次替换 |

关键正则: `/\[图表预留\s+(\d+\.\d+-[A-Z])[^\]]*\]/g`
- 捕获组 `(\d+\.\d+-[A-Z])` 提取 placeholder_id（如 "1.3-A"、"2.10-C"）
- `[^\]]*` 匹配冒号后的任意描述文字

## 3. 尺寸适配策略

| 场景 | iframe 高度 | 说明 |
|------|------------|------|
| 桌面端（>768px） | 500px | 默认值，足以展示大多数图表 |
| 移动端（<=768px） | 350px | 减小高度避免长滚动 |
| 用户拖拽 | 200px ~ 1200px | 通过底部 resize handle 调整 |
| 全屏查看 | 新标签页 | 点击工具栏"全屏查看"链接 |

宽度始终为 100% 容器宽度（`width: 100%`），由 CSS `max-width` 和父容器约束。

## 4. 无缝更新机制

### 更新图表版本的步骤

1. 将新版图表文件放入 `test-viz/revisions/` 或 `test-viz/production/html/`
2. 编辑 `test-viz/chart-embedding-map.json`，修改对应 mapping 的 `chart_file` 字段
3. 刷新页面即可生效 — 无需修改任何 JS/CSS/HTML 代码

### 示例：升级 VIS-1-001 到 v2

```json
// 修改前
{
  "placeholder_id": "1.3-A",
  "chart_file": "test-viz/production/html/VIS-1-001_Tool调用循环图.html"
}

// 修改后
{
  "placeholder_id": "1.3-A",
  "chart_file": "test-viz/revisions/VIS-1-001_v2.html"
}
```

### 为什么这样设计

- **单一数据源**: 所有映射关系集中在一个 JSON 文件中
- **零代码改动**: 更新图表只需编辑 JSON
- **自动 fallback**: 如果 chart_file 路径返回 404，界面显示"图表加载中，敬请期待"而非报错

## 5. 加载状态

| 状态 | 用户看到的 |
|------|-----------|
| 折叠（默认） | "📊 点击查看图表: [图表名称]" + 图表 ID 徽章 |
| 加载中 | 旋转动画 + "图表加载中..." |
| 加载成功 | iframe 显示完整图表 |
| 加载失败 / 404 | "🔧 图表加载中，敬请期待" |
| 无映射（书中有占位符但没做图表） | 半透明虚线框 "图表 X.X-X — 制作中，敬请期待" |

## 6. 已知限制和预期问题

### iframe 相关
- **同源策略**: 本地开发时（file:// 协议），iframe 可能因跨域限制无法加载。必须通过 HTTP 服务器运行（如 `python3 -m http.server`）
- **iframe 高度**: 无法自动适配内部内容高度（跨文档限制），因此提供手动拖拽调整
- **iframe 内部滚动**: 图表 HTML 内部可能有自己的滚动条，与外部页面滚动可能冲突

### 性能相关
- **懒加载**: iframe 只在首次展开时加载，折叠不销毁（保持用户状态）
- **移动端**: 多个展开的 iframe 可能导致内存压力。建议用户一次只展开一个
- **大型图表**: 部分 D3/SVG 图表可能较重（1MB+），首次加载可能需要几秒

### 匹配相关
- **重复 ID**: 8 个 placeholder_id 出现在两个不同的 .md 文件中（如 2.5-A 同时出现在代码架构和深度问答章节）。当前策略是映射到同一个图表文件，两处都能正常显示
- **未匹配占位符**: 1 个占位符（2.5-D）没有对应图表，显示为灰色虚线框
- **未匹配图表**: 31 个图表没有对应占位符（overview、part4、part5 的新增可视化），这些不会在阅读器中自动嵌入

### 样式相关
- **暗色主题**: 图表 HTML 可能是白底设计，与网站暗色主题对比度高。iframe 背景设为白色以保证图表可读性
- **打印**: iframe 内容在打印时可能不会正确渲染

## 7. API 参考

`window.ChartEmbed` 暴露以下方法:

```javascript
// 扫描 DOM 并嵌入图表（主要入口）
ChartEmbed.embed(containerElement);

// 强制重新加载映射 JSON（调试/热更新用）
ChartEmbed.reloadMap();

// 获取当前映射数据（调试用）
ChartEmbed.getMappings();
```
