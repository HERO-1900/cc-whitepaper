/**
 * Chart Embedding System
 *
 * Scans rendered markdown for placeholder patterns like [图表预留 X.X-X]
 * and replaces them with collapsible iframe containers that load the
 * corresponding interactive chart HTML files.
 *
 * Configuration is loaded from test-viz/chart-embedding-map.json.
 */
(function () {
  'use strict';

  // ===== STATE =====
  let chartMappings = null;   // placeholder_id -> mapping object
  let mapLoaded = false;
  let mapLoadPromise = null;

  // ===== CONSTANTS =====
  const IFRAME_HEIGHT_DEFAULT = 500;
  const IFRAME_HEIGHT_MOBILE = 350;
  const MOBILE_BREAKPOINT = 768;
  // Regex to extract placeholder_id from text containing [图表预留 X.X-X] or [图表预留 X.X-X：...]
  const PLACEHOLDER_REGEX = /\[图表预留\s+(\d+\.\d+-[A-Z])[^\]]*\]/g;
  const PLACEHOLDER_REGEX_SINGLE = /\[图表预留\s+(\d+\.\d+-[A-Z])[^\]]*\]/;

  // ===== STAGE 1 改造常量 =====
  const COLLAPSE_STORAGE_KEY = 'cc-chart-collapsed';
  const VIEWPORT_ROOT_MARGIN = '200px';
  // 已加载 iframe 的弱引用列表（用于主题切换时 broadcast）
  const loadedIframes = new Set();

  // ===== SHARED RESIZE STATE (single document-level handler) =====
  let activeResize = null; // { iframe, startY, startHeight }

  // ===== STAGE 1 - 注入骨架屏样式 + 折叠样式 =====
  function injectStyles() {
    if (document.getElementById('chart-embed-stage1-styles')) return;
    const style = document.createElement('style');
    style.id = 'chart-embed-stage1-styles';
    style.textContent = `
      /* 骨架屏：扫光动画 */
      .chart-embed-skeleton {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          var(--cc-bg-secondary, #1a1a1a) 0%,
          var(--cc-bg-tertiary, #242424) 50%,
          var(--cc-bg-secondary, #1a1a1a) 100%
        );
        background-size: 200% 100%;
        animation: chart-embed-skeleton-shimmer 1.6s ease-in-out infinite;
        opacity: 1;
        transition: opacity 200ms ease-out;
        pointer-events: none;
        z-index: 1;
      }
      .chart-embed-skeleton.is-fading {
        opacity: 0;
      }
      @keyframes chart-embed-skeleton-shimmer {
        0%   { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }
      /* iframe wrap 必须能容纳绝对定位的骨架屏 */
      .chart-embed-iframe-wrap {
        position: relative;
        min-height: 200px;
      }
      /* iframe 加载前隐藏（避免白闪），加载完成后淡入。
         覆盖 style.css 中的 display:none，改用 opacity 过渡。 */
      .chart-embed-iframe-wrap > iframe.chart-embed-iframe {
        display: block !important;
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 200ms ease-out;
        z-index: 2;
      }
      .chart-embed-iframe-wrap > iframe.chart-embed-iframe.is-loaded {
        opacity: 1;
      }
      /* 折叠按钮 */
      .chart-embed-collapse-btn {
        margin-left: auto;
        background: transparent;
        border: 1px solid var(--cc-border-default, #444);
        color: var(--cc-text-secondary, #aaa);
        cursor: pointer;
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 4px;
        line-height: 1;
        transition: all 150ms ease;
      }
      .chart-embed-collapse-btn:hover {
        background: var(--cc-bg-tertiary, #2a2a2a);
        color: var(--cc-text-primary, #fff);
      }
      /* 折叠态：body 高度收缩 */
      .chart-embed-container .chart-embed-body {
        overflow: hidden;
        transition: max-height 300ms ease, opacity 200ms ease;
        max-height: 2000px;
        opacity: 1;
      }
      .chart-embed-container.is-collapsed .chart-embed-body {
        max-height: 0;
        opacity: 0;
        padding-top: 0;
        padding-bottom: 0;
      }
      .chart-embed-container.is-collapsed .chart-embed-arrow {
        transform: rotate(-90deg);
      }
      .chart-embed-arrow {
        transition: transform 200ms ease;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }
  injectStyles();

  // ===== STAGE 1 - 折叠状态持久化 =====
  function readCollapsedSet() {
    try {
      const raw = localStorage.getItem(COLLAPSE_STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }
  function writeCollapsedSet(set) {
    try {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify([...set]));
    } catch (e) { /* quota / privacy mode, 静默失败 */ }
  }
  function isCollapsed(chartId) {
    return readCollapsedSet().has(chartId);
  }
  function setCollapsed(chartId, collapsed) {
    const set = readCollapsedSet();
    if (collapsed) set.add(chartId); else set.delete(chartId);
    writeCollapsedSet(set);
  }

  // ===== STAGE 1 - 当前主题 + 主题广播 =====
  function getCurrentTheme() {
    return document.documentElement.dataset.theme || 'dark';
  }
  function postThemeToIframe(iframe) {
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(
        { type: 'cc-theme', theme: getCurrentTheme() },
        '*'
      );
    } catch (e) { /* cross-origin or detached, 静默失败 */ }
  }
  function broadcastThemeToAllIframes() {
    loadedIframes.forEach(postThemeToIframe);
  }
  // 监听 <html data-theme> 变化
  if (typeof MutationObserver !== 'undefined') {
    const themeObserver = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          broadcastThemeToAllIframes();
          break;
        }
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  // ===== STAGE 1 - 视口预加载（IntersectionObserver） =====
  // 退化方案：不支持时直接立即加载
  const supportsIO = typeof IntersectionObserver !== 'undefined';
  const viewportObserver = supportsIO
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            observer.unobserve(el);
            if (typeof el.__ccLoadIframe === 'function') {
              el.__ccLoadIframe();
            }
          }
        });
      }, { rootMargin: VIEWPORT_ROOT_MARGIN })
    : null;

  document.addEventListener('mousemove', (e) => {
    if (!activeResize) return;
    const delta = e.clientY - activeResize.startY;
    const newHeight = Math.max(200, Math.min(1200, activeResize.startHeight + delta));
    activeResize.iframe.style.height = newHeight + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (!activeResize) return;
    activeResize = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
  document.addEventListener('touchmove', (e) => {
    if (!activeResize) return;
    const delta = e.touches[0].clientY - activeResize.startY;
    const newHeight = Math.max(200, Math.min(1200, activeResize.startHeight + delta));
    activeResize.iframe.style.height = newHeight + 'px';
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (!activeResize) return;
    activeResize = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  // ===== LOAD MAPPING DATA =====
  function loadChartMap() {
    if (mapLoadPromise) return mapLoadPromise;
    mapLoadPromise = fetch('test-viz/chart-embedding-map.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        chartMappings = {};
        if (data.mappings && Array.isArray(data.mappings)) {
          data.mappings.forEach(m => {
            if (m.placeholder_id && m.chart_file) {
              // For duplicate IDs, store first occurrence (or overwrite - last wins)
              // Since the same placeholder_id can appear in different book files,
              // we store by placeholder_id. The chart is the same for duplicates.
              chartMappings[m.placeholder_id] = m;
            }
          });
        }
        mapLoaded = true;
        console.log(`[chart-embed] Loaded ${Object.keys(chartMappings).length} chart mappings`);
      })
      .catch(err => {
        console.warn('[chart-embed] Failed to load chart mapping:', err);
        chartMappings = {};
        mapLoaded = true;
      });
    return mapLoadPromise;
  }

  // Start loading immediately
  loadChartMap();

  // ===== CHART NAME EXTRACTION =====
  function getChartDisplayName(mapping) {
    // Try to extract a human-readable name from chart_file
    // e.g. "test-viz/production/html/VIS-1-001_Tool调用循环图.html" -> "Tool调用循环图"
    const filename = mapping.chart_file.split('/').pop().replace('.html', '');
    const parts = filename.split('_');
    parts.shift(); // Remove VIS-X-XXX prefix
    return parts.join('_') || mapping.chart_id;
  }

  // ===== GET IFRAME HEIGHT =====
  function getDefaultHeight() {
    return window.innerWidth <= MOBILE_BREAKPOINT ? IFRAME_HEIGHT_MOBILE : IFRAME_HEIGHT_DEFAULT;
  }

  // ===== CREATE CHART CONTAINER =====
  function createChartContainer(placeholderId, mapping) {
    const container = document.createElement('div');
    container.className = 'chart-embed-container expanded';
    container.dataset.chartId = placeholderId;

    const displayName = getChartDisplayName(mapping);
    const collapsedInitially = isCollapsed(placeholderId);

    // Header
    const header = document.createElement('div');
    header.className = 'chart-embed-header';
    header.innerHTML = `
      <span class="chart-embed-icon">📊</span>
      <span class="chart-embed-title">${displayName}</span>
      <span class="chart-embed-badge">${mapping.chart_id}</span>
      <button type="button" class="chart-embed-collapse-btn" aria-label="折叠/展开图表">
        <span class="chart-embed-arrow">▼</span>
      </button>
    `;

    // Body (默认展开)
    const body = document.createElement('div');
    body.className = 'chart-embed-body';

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'chart-embed-toolbar';
    toolbar.innerHTML = `
      <a class="chart-embed-fullscreen" href="${mapping.chart_file}" target="_blank" rel="noopener" title="在新标签页全屏查看">
        ⛶ 全屏查看
      </a>
    `;

    // Iframe wrapper (for skeleton + iframe + resize)
    const iframeWrap = document.createElement('div');
    iframeWrap.className = 'chart-embed-iframe-wrap';
    iframeWrap.style.height = getDefaultHeight() + 'px';

    // 骨架屏（替代旋转 spinner）
    const skeleton = document.createElement('div');
    skeleton.className = 'chart-embed-skeleton';
    iframeWrap.appendChild(skeleton);

    // Resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'chart-embed-resize-handle';
    resizeHandle.title = '拖拽调整高度';
    resizeHandle.innerHTML = '⋯';

    body.appendChild(toolbar);
    body.appendChild(iframeWrap);
    body.appendChild(resizeHandle);

    container.appendChild(header);
    container.appendChild(body);

    // ===== 应用初始折叠态 =====
    if (collapsedInitially) {
      container.classList.add('is-collapsed');
      container.classList.remove('expanded');
    }

    // ===== iframe 加载逻辑（懒加载，IntersectionObserver 触发） =====
    let iframeLoaded = false;
    let iframe = null;

    function loadIframe() {
      if (iframeLoaded) return;
      iframeLoaded = true;

      checkChartExists(mapping.chart_file).then((exists) => {
        if (!exists) {
          // 用骨架屏区域显示降级提示
          skeleton.classList.add('is-fading');
          const fallback = document.createElement('div');
          fallback.className = 'chart-embed-loader';
          fallback.innerHTML = `
            <div class="chart-embed-fallback">
              <span class="chart-embed-fallback-icon">🔧</span>
              <span>图表加载中，敬请期待</span>
            </div>
          `;
          iframeWrap.appendChild(fallback);
          return;
        }

        iframe = document.createElement('iframe');
        iframe.className = 'chart-embed-iframe';
        iframe.style.height = '100%';
        iframe.style.width = '100%';
        iframe.style.border = '0';
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
        iframe.setAttribute('title', displayName);

        iframe.addEventListener('load', () => {
          iframe.classList.add('is-loaded');
          // 200ms 淡出骨架屏
          skeleton.classList.add('is-fading');
          setTimeout(() => { skeleton.style.display = 'none'; }, 220);
          // 主题 bridge：推送当前主题到 iframe
          loadedIframes.add(iframe);
          postThemeToIframe(iframe);
        });

        iframe.addEventListener('error', () => {
          showFallback(skeleton, iframeWrap);
        });

        iframe.src = mapping.chart_file;
        iframeWrap.appendChild(iframe);
      });
    }

    // 暴露给 IntersectionObserver 回调
    container.__ccLoadIframe = loadIframe;

    if (viewportObserver) {
      viewportObserver.observe(container);
    } else {
      // 退化：立即加载
      loadIframe();
    }

    // ===== 折叠按钮 =====
    const collapseBtn = header.querySelector('.chart-embed-collapse-btn');
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willCollapse = !container.classList.contains('is-collapsed');
      container.classList.toggle('is-collapsed', willCollapse);
      container.classList.toggle('expanded', !willCollapse);
      setCollapsed(placeholderId, willCollapse);
    });

    // ===== RESIZE LOGIC (uses shared document-level handler) =====
    resizeHandle.addEventListener('mousedown', (e) => {
      if (!iframe) return;
      activeResize = { iframe: iframeWrap, startY: e.clientY, startHeight: iframeWrap.offsetHeight };
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    resizeHandle.addEventListener('touchstart', (e) => {
      if (!iframe) return;
      activeResize = { iframe: iframeWrap, startY: e.touches[0].clientY, startHeight: iframeWrap.offsetHeight };
      e.preventDefault();
    }, { passive: false });

    return container;
  }

  // ===== FALLBACK DISPLAY =====
  function showFallback(skeleton, iframeWrap) {
    if (skeleton && skeleton.classList) {
      skeleton.classList.add('is-fading');
    }
    // Remove any iframe that might be in the wrap
    const existingIframe = iframeWrap.querySelector('iframe');
    if (existingIframe) existingIframe.remove();
    // 注入降级提示
    if (!iframeWrap.querySelector('.chart-embed-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'chart-embed-loader';
      fallback.innerHTML = `
        <div class="chart-embed-fallback">
          <span class="chart-embed-fallback-icon">🔧</span>
          <span>图表加载中，敬请期待</span>
        </div>
      `;
      iframeWrap.appendChild(fallback);
    }
  }

  // ===== CHECK IF CHART FILE EXISTS =====
  function checkChartExists(url) {
    return fetch(url, { method: 'HEAD' })
      .then(r => r.ok)
      .catch(() => false);
  }

  // ===== CREATE UNMATCHED PLACEHOLDER =====
  function createUnmatchedContainer(placeholderId, originalText) {
    const container = document.createElement('div');
    container.className = 'chart-embed-container chart-embed-unmatched';
    container.dataset.chartId = placeholderId;
    container.innerHTML = `
      <div class="chart-embed-header chart-embed-header-disabled">
        <span class="chart-embed-icon">📊</span>
        <span class="chart-embed-title">图表 ${placeholderId} — 制作中，敬请期待</span>
      </div>
    `;
    return container;
  }

  // ===== MAIN: EMBED CHARTS INTO RENDERED DOM =====
  function embedCharts(containerEl) {
    if (!mapLoaded || !chartMappings) {
      console.warn('[chart-embed] Map not loaded yet, deferring embedCharts');
      return;
    }

    // Strategy: walk the DOM tree and find text nodes or elements containing placeholder text.
    // Placeholders can appear in:
    // 1. Standalone paragraphs: <p>[图表预留 1.4-A：...]</p>
    // 2. Inside blockquotes: <blockquote><p><strong>[图表预留 2.7-A]</strong>：描述</p></blockquote>
    // 3. Inside <p> tags with bold: <p><strong>[图表预留 2.20-A]</strong>：描述</p>

    // Find all elements that contain placeholder text
    const walker = document.createTreeWalker(
      containerEl,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (PLACEHOLDER_REGEX_SINGLE.test(node.textContent)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    // Process found text nodes - we need to find the highest-level container to replace
    const processedElements = new Set();
    let embeddedCount = 0;

    textNodes.forEach(textNode => {
      // Find the best ancestor to replace:
      // If inside a <blockquote>, replace the entire blockquote
      // If inside a <p>, replace the <p>
      let targetEl = textNode.parentElement;

      // Walk up to find blockquote or stay at p level
      let current = targetEl;
      let bestTarget = null;
      while (current && current !== containerEl) {
        if (current.tagName === 'BLOCKQUOTE') {
          bestTarget = current;
          break;
        }
        if (current.tagName === 'P') {
          bestTarget = current;
          // Don't break - keep looking for blockquote parent
        }
        current = current.parentElement;
      }

      if (!bestTarget) bestTarget = targetEl;
      if (processedElements.has(bestTarget)) return;

      // Extract all placeholder IDs from this element's text
      const fullText = bestTarget.textContent;
      const matches = [...fullText.matchAll(PLACEHOLDER_REGEX)];
      if (matches.length === 0) return;

      processedElements.add(bestTarget);

      // Create a document fragment with chart containers for each placeholder
      const fragment = document.createDocumentFragment();

      matches.forEach(match => {
        const placeholderId = match[1];
        const mapping = chartMappings[placeholderId];

        if (mapping) {
          fragment.appendChild(createChartContainer(placeholderId, mapping));
          embeddedCount++;
        } else {
          fragment.appendChild(createUnmatchedContainer(placeholderId, match[0]));
        }
      });

      // Replace the target element with our chart containers
      bestTarget.parentNode.replaceChild(fragment, bestTarget);
    });

    if (embeddedCount > 0) {
      console.log(`[chart-embed] Embedded ${embeddedCount} charts in this chapter`);
    }
  }

  // ===== PUBLIC API =====
  window.ChartEmbed = {
    /**
     * Call after markdown is rendered into DOM.
     * Ensures mapping is loaded first, then scans and replaces placeholders.
     * @param {HTMLElement} containerEl - The DOM element containing rendered markdown
     */
    embed: function (containerEl) {
      if (mapLoaded) {
        embedCharts(containerEl);
      } else {
        loadChartMap().then(() => embedCharts(containerEl));
      }
    },

    /**
     * Force reload the chart mapping (e.g., after updating JSON)
     */
    reloadMap: function () {
      mapLoadPromise = null;
      mapLoaded = false;
      chartMappings = null;
      return loadChartMap();
    },

    /**
     * Get current mapping data (for debugging)
     */
    getMappings: function () {
      return chartMappings;
    }
  };

})();
