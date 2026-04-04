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

  // ===== SHARED RESIZE STATE (single document-level handler) =====
  let activeResize = null; // { iframe, startY, startHeight }

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
    container.className = 'chart-embed-container';
    container.dataset.chartId = placeholderId;

    const displayName = getChartDisplayName(mapping);

    // Header (toggle)
    const header = document.createElement('div');
    header.className = 'chart-embed-header';
    header.innerHTML = `
      <span class="chart-embed-icon">📊</span>
      <span class="chart-embed-title">点击查看图表: ${displayName}</span>
      <span class="chart-embed-badge">${mapping.chart_id}</span>
      <span class="chart-embed-arrow">▶</span>
    `;

    // Body (collapsible)
    const body = document.createElement('div');
    body.className = 'chart-embed-body';
    body.style.display = 'none';

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'chart-embed-toolbar';
    toolbar.innerHTML = `
      <a class="chart-embed-fullscreen" href="${mapping.chart_file}" target="_blank" rel="noopener" title="在新标签页全屏查看">
        ⛶ 全屏查看
      </a>
    `;

    // Iframe wrapper (for loading state and resize)
    const iframeWrap = document.createElement('div');
    iframeWrap.className = 'chart-embed-iframe-wrap';

    // Loading indicator
    const loader = document.createElement('div');
    loader.className = 'chart-embed-loader';
    loader.innerHTML = `
      <div class="chart-embed-spinner"></div>
      <span>图表加载中...</span>
    `;
    iframeWrap.appendChild(loader);

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

    // ===== TOGGLE LOGIC =====
    let iframeLoaded = false;
    let iframe = null;

    header.addEventListener('click', () => {
      const isExpanded = body.style.display !== 'none';
      if (isExpanded) {
        // Collapse
        body.style.display = 'none';
        container.classList.remove('expanded');
        header.querySelector('.chart-embed-arrow').textContent = '▶';
      } else {
        // Expand
        body.style.display = '';
        container.classList.add('expanded');
        header.querySelector('.chart-embed-arrow').textContent = '▼';

        // Lazy-load iframe on first expand
        if (!iframeLoaded) {
          iframeLoaded = true;
          iframe = document.createElement('iframe');
          iframe.className = 'chart-embed-iframe';
          iframe.style.height = getDefaultHeight() + 'px';
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
          iframe.setAttribute('title', displayName);

          // Handle load success
          iframe.addEventListener('load', () => {
            loader.style.display = 'none';
            iframe.style.display = 'block';
          });

          // Handle load error via a check after timeout
          iframe.addEventListener('error', () => {
            showFallback(loader, iframeWrap);
          });

          // Set src - also do a HEAD check for 404
          checkChartExists(mapping.chart_file).then(exists => {
            if (exists) {
              iframe.src = mapping.chart_file;
              iframeWrap.appendChild(iframe);
            } else {
              showFallback(loader, iframeWrap);
            }
          });
        }
      }
    });

    // ===== RESIZE LOGIC (uses shared document-level handler) =====
    resizeHandle.addEventListener('mousedown', (e) => {
      if (!iframe) return;
      activeResize = { iframe, startY: e.clientY, startHeight: iframe.offsetHeight };
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    resizeHandle.addEventListener('touchstart', (e) => {
      if (!iframe) return;
      activeResize = { iframe, startY: e.touches[0].clientY, startHeight: iframe.offsetHeight };
      e.preventDefault();
    }, { passive: false });

    return container;
  }

  // ===== FALLBACK DISPLAY =====
  function showFallback(loader, iframeWrap) {
    loader.innerHTML = `
      <div class="chart-embed-fallback">
        <span class="chart-embed-fallback-icon">🔧</span>
        <span>图表加载中，敬请期待</span>
      </div>
    `;
    loader.style.display = '';
    // Remove any iframe that might be in the wrap
    const existingIframe = iframeWrap.querySelector('iframe');
    if (existingIframe) existingIframe.remove();
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
