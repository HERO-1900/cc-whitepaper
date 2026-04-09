/**
 * Main application logic — routing, panel, chapter reader.
 */
(function () {
  'use strict';

  // ===== DOM REFS =====
  const views = {
    welcome: document.getElementById('welcome'),
    landing: document.getElementById('landing'),
    reader: document.getElementById('reader'),
    gallery: document.getElementById('gallery'),
    inspiration: document.getElementById('inspiration'),
  };
  const navBtns = {
    guide: document.getElementById('nav-guide'),
    home: document.getElementById('nav-home'),
    reader: document.getElementById('nav-reader'),
    gallery: document.getElementById('nav-gallery'),
    inspiration: document.getElementById('nav-inspiration'),
  };
  const breadcrumb = document.getElementById('breadcrumb');
  const panel = document.getElementById('detail-panel');
  const panelContent = document.getElementById('panel-content');
  const panelCloseBtn = document.getElementById('panel-close');
  const toc = document.getElementById('toc');
  const chapterBody = document.getElementById('chapter-body');
  const backToMap = document.getElementById('back-to-map');

  const BOOK_BASE = 'book/';

  let currentView = 'welcome';
  let currentChapter = null;
  let currentMetaphor = 'city'; // 'city' or 'os'

  // ===== METAPHOR SYSTEM =====
  const metaphorToggle = document.getElementById('metaphor-toggle');
  const metaphorIcon = document.getElementById('metaphor-icon');
  const metaphorLabel = document.getElementById('metaphor-label');
  const subtitleText = document.getElementById('subtitle-text');

  function setMetaphor(type) {
    currentMetaphor = type;
    if (type === 'city') {
      metaphorIcon.textContent = '🏙';
      metaphorLabel.textContent = '城市';
      if (subtitleText) subtitleText.textContent = '智慧城市 — 架构全景';
    } else {
      metaphorIcon.textContent = '🖥';
      metaphorLabel.textContent = 'OS';
      if (subtitleText) subtitleText.textContent = 'Agent Operating System — 架构全景';
    }
    // Update welcome buttons (supports both old .metaphor-btn and new .metaphor-btn-inline)
    document.querySelectorAll('.metaphor-btn, .metaphor-btn-inline').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.metaphor === type);
    });
  }

  if (metaphorToggle) {
    metaphorToggle.addEventListener('click', () => {
      setMetaphor(currentMetaphor === 'city' ? 'os' : 'city');
    });
  }
  // Welcome page metaphor buttons (supports both class names)
  document.querySelectorAll('.metaphor-btn, .metaphor-btn-inline').forEach(btn => {
    btn.addEventListener('click', () => setMetaphor(btn.dataset.metaphor));
  });
  // Enter map / start reading button → goes to reader view
  const enterBtn = document.getElementById('enter-map');
  if (enterBtn) enterBtn.addEventListener('click', () => showView('reader'));
  // Panorama button → goes to landing (architecture overview)
  const panoramaBtn = document.getElementById('enter-panorama');
  if (panoramaBtn) panoramaBtn.addEventListener('click', () => showView('landing'));

  setMetaphor('city'); // default

  // ===== VIEW ROUTING =====
  function showView(name) {
    Object.entries(views).forEach(([k, el]) => {
      if (el) el.classList.toggle('active', k === name);
    });
    Object.entries(navBtns).forEach(([k, btn]) => {
      if (btn) btn.classList.toggle('active', k === name);
    });
    currentView = name;
    closePanel();

    if (name === 'landing') {
      breadcrumb.textContent = 'Claude Code 2.1.88 · 架构全景';
    } else if (name === 'welcome') {
      breadcrumb.textContent = 'Claude Code 2.1.88 · 欢迎';
    } else if (name === 'gallery') {
      breadcrumb.textContent = 'Claude Code 2.1.88 · 图表画廊';
    } else if (name === 'inspiration') {
      breadcrumb.textContent = 'Claude Code 2.1.88 · 灵感实验室';
    }
  }

  if (navBtns.guide) navBtns.guide.addEventListener('click', () => showView('welcome'));
  navBtns.home.addEventListener('click', () => showView('landing'));
  navBtns.reader.addEventListener('click', () => {
    showView('reader');
    if (!currentChapter) {
      chapterBody.innerHTML = `
        <div class="empty-state">
          <h2>选择一个章节开始阅读</h2>
          <p>从左侧目录中选择任意章节</p>
        </div>`;
    }
  });
  // Gallery view
  if (navBtns.gallery) {
    let galleryInited = false;
    navBtns.gallery.addEventListener('click', () => {
      showView('gallery');
      if (!galleryInited && window.Gallery) {
        Gallery.init().then(() => {
          Gallery.render(document.getElementById('gallery-container'));
          galleryInited = true;
        });
      } else if (window.Gallery) {
        Gallery.render(document.getElementById('gallery-container'));
      }
    });
  }

  // Inspiration Lab view
  if (navBtns.inspiration) {
    let inspInited = false;
    navBtns.inspiration.addEventListener('click', () => {
      showView('inspiration');
      if (!inspInited && window.InspirationLab) {
        InspirationLab.init().then(() => {
          InspirationLab.render(document.getElementById('inspiration-container'));
          inspInited = true;
        });
      } else if (window.InspirationLab) {
        InspirationLab.render(document.getElementById('inspiration-container'));
      }
    });
  }

  backToMap.addEventListener('click', () => showView('landing'));

  // ===== DETAIL PANEL =====
  function openPanel(componentId) {
    const data = COMPONENTS[componentId];
    if (!data) return;

    panelContent.innerHTML = renderPanelHTML(data);
    panel.classList.remove('hidden');
    requestAnimationFrame(() => panel.classList.add('visible'));

    // Wire up chapter links inside panel
    panelContent.querySelectorAll('.panel-link[data-chapter]').forEach(link => {
      link.addEventListener('click', () => {
        const chId = link.dataset.chapter;
        closePanel();
        showView('reader');
        loadChapterById(chId);
      });
    });
  }

  function closePanel() {
    panel.classList.remove('visible');
    setTimeout(() => panel.classList.add('hidden'), 350);
  }

  panelCloseBtn.addEventListener('click', closePanel);

  // Click outside panel to close
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('visible') &&
        !panel.contains(e.target) &&
        !e.target.closest('.node')) {
      closePanel();
    }
  });

  function renderPanelHTML(data) {
    // Stats with explanations
    const statsHTML = data.stats.map(s => {
      const explanation = s.explain || '';
      return `<div class="panel-stat-card">
        <div class="val" style="color:${data.color}">${s.val}</div>
        <div class="lbl">${s.lbl}</div>
        ${explanation ? `<div class="stat-explain">${explanation}</div>` : ''}
      </div>`;
    }).join('');

    // Concepts with detailed explanations
    const conceptsHTML = data.concepts.map(c => {
      if (typeof c === 'object' && c.name) {
        return `<li>
          <div class="concept-name">${c.name}</div>
          <div class="concept-explain">${c.explain}</div>
        </li>`;
      }
      return `<li>${c}</li>`;
    }).join('');

    const chaptersHTML = data.chapters.map(ch => {
      const chId = findChapterId(ch.part, ch.num);
      return `<div class="panel-link" data-chapter="${chId || ''}">
        <span>${ch.part} / ${ch.title}</span>
        <span class="arrow">→</span>
      </div>`;
    }).join('');

    // Pick metaphor based on current setting
    const metaphorText = currentMetaphor === 'city'
      ? (data.cityMetaphor || data.metaphor)
      : data.metaphor;
    const analogyText = currentMetaphor === 'city'
      ? (data.cityAnalogy || data.osAnalogy)
      : data.osAnalogy;
    const analogyLabel = currentMetaphor === 'city' ? '🏙 城市类比' : '🔑 OS 类比';

    // One-sentence "why this matters"
    const whyMatters = data.whyMatters || '';

    return `
      <div class="panel-header">
        <div class="panel-icon" style="background:${data.color}20;color:${data.color};border:1px solid ${data.color}40">${data.icon}</div>
        <div>
          <div class="panel-title" style="color:${data.color}">${data.title}</div>
          <div class="panel-subtitle">${metaphorText}</div>
        </div>
      </div>

      <div class="os-analogy">${analogyLabel}: ${analogyText}</div>

      ${whyMatters ? `<div class="panel-why-matters"><strong>为什么重要：</strong>${whyMatters}</div>` : ''}

      <div class="panel-section">
        <h3>关键数据</h3>
        <div class="panel-stat-grid">${statsHTML}</div>
      </div>

      <div class="panel-section">
        <h3>概述</h3>
        <div class="panel-description">${data.description}</div>
      </div>

      <div class="panel-section">
        <h3>核心概念</h3>
        <ul class="concept-list">${conceptsHTML}</ul>
      </div>

      <div class="panel-section">
        <h3>相关章节</h3>
        <div class="panel-links">${chaptersHTML}</div>
      </div>
    `;
  }

  function findChapterId(partLabel, num) {
    // partLabel like "Part 2", num like "04" or "Q02"
    const partNum = partLabel.replace('Part ', '');
    for (const part of BOOK_STRUCTURE) {
      if (part.id === `part${partNum}`) {
        for (const ch of part.chapters) {
          if (ch.id.endsWith(num) || ch.id.endsWith(`-${num}`)) return ch.id;
        }
      }
    }
    return null;
  }

  // ===== SVG NODE CLICK → PANEL =====
  document.querySelectorAll('.node').forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      openPanel(node.dataset.component);
    });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel(node.dataset.component);
      }
    });
  });

  // ===== TABLE OF CONTENTS =====
  function buildTOC() {
    toc.innerHTML = '';
    BOOK_STRUCTURE.forEach(part => {
      const partDiv = document.createElement('div');
      partDiv.className = 'toc-part';

      const title = document.createElement('div');
      title.className = 'toc-part-title';
      title.textContent = part.title;
      title.addEventListener('click', () => partDiv.classList.toggle('expanded'));
      partDiv.appendChild(title);

      const chaptersDiv = document.createElement('div');
      chaptersDiv.className = 'toc-chapters';

      part.chapters.forEach(ch => {
        const item = document.createElement('div');
        item.className = 'toc-chapter';
        item.textContent = ch.title;
        item.dataset.chapterId = ch.id;
        item.addEventListener('click', () => loadChapter(ch));
        chaptersDiv.appendChild(item);
      });

      partDiv.appendChild(chaptersDiv);
      toc.appendChild(partDiv);
    });

    // Auto-expand Part 2
    const part2 = toc.querySelector('.toc-part:nth-child(3)');
    if (part2) part2.classList.add('expanded');
  }

  // ===== CHAPTER LOADING =====
  async function loadChapter(ch) {
    currentChapter = ch;

    // Update TOC active state
    toc.querySelectorAll('.toc-chapter').forEach(el => {
      el.classList.toggle('active', el.dataset.chapterId === ch.id);
    });

    // Expand parent part
    const parentPart = toc.querySelector(`[data-chapter-id="${ch.id}"]`)?.closest('.toc-part');
    if (parentPart) parentPart.classList.add('expanded');

    // Update breadcrumb, nav, and URL
    breadcrumb.textContent = ch.title;
    updateChapterNav();
    history.replaceState(null, '', `#chapter-${ch.id}`);

    // Show loading
    chapterBody.innerHTML = '<div class="empty-state"><p>加载中...</p></div>';

    try {
      const resp = await fetch(BOOK_BASE + ch.file);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const md = await resp.text();
      renderMarkdown(md);
    } catch (err) {
      chapterBody.innerHTML = `
        <div class="empty-state">
          <h2>无法加载章节</h2>
          <p>文件: ${ch.file}</p>
          <p style="color:#ff6b6b;margin-top:10px">${err.message}</p>
          <p style="margin-top:16px;font-size:13px;color:#4a5568">
            提示：请确保从 <code>web/</code> 目录启动本地服务器<br>
            例如: <code>cd web && python3 -m http.server 8000</code>
          </p>
        </div>`;
    }
  }

  function loadChapterById(chId) {
    if (!chId) return;
    for (const part of BOOK_STRUCTURE) {
      for (const ch of part.chapters) {
        if (ch.id === chId) { loadChapter(ch); return; }
      }
    }
  }

  function renderMarkdown(md) {
    if (window.marked) {
      // Use marked.parse (works across v4-v14+)
      try {
        chapterBody.innerHTML = marked.parse(md);
      } catch (e) {
        // Fallback for very old/new API changes
        chapterBody.innerHTML = marked(md);
      }
      // Post-render syntax highlighting
      if (window.hljs) {
        chapterBody.querySelectorAll('pre code').forEach(block => {
          hljs.highlightElement(block);
        });
      }
    } else {
      chapterBody.innerHTML = '<pre style="white-space:pre-wrap">' + escapeHTML(md) + '</pre>';
    }
    // Classify blockquotes by their content prefix (emoji)
    chapterBody.querySelectorAll('blockquote').forEach(bq => {
      const text = bq.textContent.trim();
      if (text.startsWith('🌍')) bq.classList.add('bq-industry');
      else if (text.startsWith('📚') || text.startsWith('🎓')) bq.classList.add('bq-course');
      else if (text.startsWith('💡')) bq.classList.add('bq-layperson');
      else if (text.startsWith('🔑')) bq.classList.add('bq-os');
      else if (text.startsWith('⚠️')) bq.classList.add('bq-warning');
    });
    // Wrap wide tables for horizontal scroll
    chapterBody.querySelectorAll('table').forEach(table => {
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
    // Embed interactive charts (replaces [图表预留 X.X-X] placeholders)
    // 传入 bookFile 启用 B 路径：游离图表会在章节末尾"本章配图"附录里自动归位
    if (window.ChartEmbed) {
      ChartEmbed.embed(chapterBody, {
        bookFile: currentChapter ? currentChapter.file : null
      });
    }
    // Annotate glossary terms, difficulty badge, and Q&A panel
    if (window.GlossarySystem && currentChapter) {
      GlossarySystem.annotate(chapterBody, currentChapter.file);
    }
    // 章节内 H2/H3 锚点导航（侧边栏第三级）
    buildChapterSectionNav();
    // Scroll to top
    document.getElementById('chapter-content').scrollTop = 0;
  }

  // ===== 章节内标题锚点导航 =====
  let sectionObserver = null;

  function buildChapterSectionNav() {
    // 清除旧导航
    const existing = document.getElementById('chapter-section-nav');
    if (existing) existing.remove();
    if (sectionObserver) { sectionObserver.disconnect(); sectionObserver = null; }

    const headings = [...chapterBody.querySelectorAll('h2, h3')];
    if (headings.length < 2) return;

    const nav = document.createElement('div');
    nav.id = 'chapter-section-nav';

    const title = document.createElement('div');
    title.className = 'chapter-section-nav-title';
    title.textContent = '本章目录';
    nav.appendChild(title);

    const chapterContent = document.getElementById('chapter-content');

    headings.forEach((h, i) => {
      // 为标题分配锚点 ID
      if (!h.id) h.id = 'sec-' + i;

      const item = document.createElement('div');
      item.className = 'chapter-section-item' + (h.tagName === 'H3' ? ' section-h3' : ' section-h2');
      item.dataset.targetId = h.id;
      item.textContent = h.textContent.replace(/^#+\s*/, '');
      item.title = item.textContent;

      item.addEventListener('click', () => {
        const containerTop = chapterContent.getBoundingClientRect().top;
        const headingTop = h.getBoundingClientRect().top;
        const scrollOffset = chapterContent.scrollTop + (headingTop - containerTop) - 24;
        chapterContent.scrollTo({ top: scrollOffset, behavior: 'smooth' });
      });

      nav.appendChild(item);
    });

    toc.appendChild(nav);

    // 滚动监听：高亮当前可见标题
    const navItems = [...nav.querySelectorAll('.chapter-section-item')];
    if (typeof IntersectionObserver !== 'undefined') {
      sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navItems.forEach(item => {
              item.classList.toggle('section-active', item.dataset.targetId === entry.target.id);
            });
          }
        });
      }, {
        root: chapterContent,
        rootMargin: '-60px 0px -65% 0px',
        threshold: 0
      });
      headings.forEach(h => sectionObserver.observe(h));
    }
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ===== FLAT CHAPTER LIST (for navigation) =====
  const allChapters = BOOK_STRUCTURE.flatMap(p => p.chapters);

  function getChapterIndex(ch) {
    return allChapters.findIndex(c => c.id === ch.id);
  }

  function updateChapterNav() {
    if (!currentChapter) return;
    const idx = getChapterIndex(currentChapter);
    const total = allChapters.length;
    const hasPrev = idx > 0;
    const hasNext = idx < total - 1;

    ['prev-chapter', 'prev-chapter-bottom'].forEach(id => {
      const btn = document.getElementById(id);
      btn.disabled = !hasPrev;
      if (hasPrev) btn.onclick = () => loadChapter(allChapters[idx - 1]);
    });
    ['next-chapter', 'next-chapter-bottom'].forEach(id => {
      const btn = document.getElementById(id);
      btn.disabled = !hasNext;
      if (hasNext) btn.onclick = () => loadChapter(allChapters[idx + 1]);
    });
    const posText = `${idx + 1} / ${total}`;
    const posEl = document.getElementById('chapter-position');
    const posElB = document.getElementById('chapter-position-bottom');
    if (posEl) posEl.textContent = posText;
    if (posElB) posElB.textContent = posText;
  }

  // ===== FULL-TEXT SEARCH =====
  const tocSearch = document.getElementById('toc-search');
  const searchResultsEl = document.getElementById('search-results');
  let searchIndex = null;
  let searchDebounceTimer = null;

  // 加载搜索索引
  fetch('js/search-index.json')
    .then(r => r.ok ? r.json() : Promise.reject('索引加载失败'))
    .then(data => { searchIndex = data; })
    .catch(() => { console.warn('[Search] 搜索索引加载失败，仅支持标题搜索'); });

  /**
   * 在文本中高亮关键词，返回 HTML
   */
  function highlightKeyword(text, keyword) {
    if (!keyword) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const kw = escapeHtml(keyword);
    // 用正则全局替换（忽略大小写）
    const regex = new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /**
   * 从匹配文本中提取关键词附近的片段（前后各留一些上下文）
   */
  function extractSnippet(text, keyword, maxLen) {
    maxLen = maxLen || 80;
    const lower = text.toLowerCase();
    const kwLower = keyword.toLowerCase();
    const idx = lower.indexOf(kwLower);
    if (idx < 0) return text.slice(0, maxLen);
    const start = Math.max(0, idx - 30);
    const end = Math.min(text.length, idx + keyword.length + 50);
    let snippet = text.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    return snippet;
  }

  /**
   * 执行全文搜索
   */
  function performSearch(query) {
    const q = query.trim().toLowerCase();

    // 如果搜索为空，恢复正常目录显示
    if (!q) {
      if (searchResultsEl) {
        searchResultsEl.classList.add('hidden');
        searchResultsEl.innerHTML = '';
      }
      toc.style.display = '';
      // 恢复所有 TOC 条目的显示
      toc.querySelectorAll('.toc-part').forEach(p => p.classList.remove('hidden-by-search'));
      toc.querySelectorAll('.toc-chapter').forEach(c => c.classList.remove('hidden-by-search'));
      return;
    }

    // 先进行标题搜索（TOC 过滤）
    const titleMatches = new Set();
    toc.querySelectorAll('.toc-part').forEach(partDiv => {
      const chapters = partDiv.querySelectorAll('.toc-chapter');
      let anyVisible = false;
      chapters.forEach(ch => {
        const match = ch.textContent.toLowerCase().includes(q);
        ch.classList.toggle('hidden-by-search', !match);
        if (match) {
          anyVisible = true;
          titleMatches.add(ch.dataset.chapterId);
        }
      });
      partDiv.classList.toggle('hidden-by-search', !anyVisible);
      if (q && anyVisible) partDiv.classList.add('expanded');
    });

    // 全文搜索（从索引中查找）
    if (!searchIndex || !searchResultsEl) return;

    const results = [];
    const MAX_RESULTS = 30;

    for (const entry of searchIndex) {
      if (results.length >= MAX_RESULTS) break;

      // 标题匹配（已在 TOC 中显示，但也加入全文结果以显示片段）
      const titleMatch = entry.title.toLowerCase().includes(q);

      // 搜索每个段落
      for (const section of entry.sections) {
        if (results.length >= MAX_RESULTS) break;
        const headingMatch = section.heading.toLowerCase().includes(q);
        const textMatch = section.text.toLowerCase().includes(q);

        if (headingMatch || textMatch) {
          results.push({
            chapterId: entry.id,
            chapterTitle: entry.title,
            sectionHeading: section.heading,
            text: section.text,
            isTitleOnly: titleMatch && !textMatch && !headingMatch,
          });
        }
      }

      // 如果标题匹配但没有正文匹配，也至少添加一条
      if (titleMatch && !results.some(r => r.chapterId === entry.id)) {
        const firstSection = entry.sections[0];
        results.push({
          chapterId: entry.id,
          chapterTitle: entry.title,
          sectionHeading: firstSection ? firstSection.heading : '',
          text: firstSection ? firstSection.text : '',
          isTitleOnly: true,
        });
      }
    }

    // 渲染搜索结果
    if (results.length === 0) {
      toc.style.display = '';
      searchResultsEl.classList.add('hidden');
      searchResultsEl.innerHTML = '';
      return;
    }

    // 隐藏 TOC，显示搜索结果
    toc.style.display = 'none';
    searchResultsEl.classList.remove('hidden');

    let html = `<div class="search-results-header">找到 ${results.length} 条结果${results.length >= MAX_RESULTS ? '（仅显示前 ' + MAX_RESULTS + ' 条）' : ''}</div>`;

    results.forEach(r => {
      const snippet = extractSnippet(r.text, q);
      const highlightedSnippet = highlightKeyword(snippet, q);
      const highlightedHeading = highlightKeyword(r.sectionHeading, q);
      const highlightedTitle = highlightKeyword(r.chapterTitle, q);

      html += `<div class="search-result-item" data-chapter-id="${r.chapterId}">
        <div class="search-result-title">${highlightedTitle}</div>
        <div class="search-result-section">${highlightedHeading}</div>
        <div class="search-result-snippet">${highlightedSnippet}</div>
      </div>`;
    });

    searchResultsEl.innerHTML = html;

    // 绑定点击事件
    searchResultsEl.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const chId = item.dataset.chapterId;
        loadChapterById(chId);
      });
    });
  }

  if (tocSearch) {
    tocSearch.addEventListener('input', () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        performSearch(tocSearch.value);
      }, 250); // 250ms 防抖
    });

    // Escape 清空搜索
    tocSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        tocSearch.value = '';
        performSearch('');
        tocSearch.blur();
      }
    });
  }

  // ===== KEYBOARD SHORTCUTS =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (panel.classList.contains('visible')) closePanel();
      else if (currentView === 'reader') showView('landing');
    }
    // 1 = landing, 2 = reader
    if (e.key === '1' && !e.ctrlKey && !e.metaKey && !isInputFocused()) showView('landing');
    if (e.key === '2' && !e.ctrlKey && !e.metaKey && !isInputFocused()) showView('reader');
    if (e.key === '3' && !e.ctrlKey && !e.metaKey && !isInputFocused()) {
      showView('gallery');
      if (window.Gallery) { Gallery.init().then(() => Gallery.render(document.getElementById('gallery-container'))); }
    }
    if (e.key === '4' && !e.ctrlKey && !e.metaKey && !isInputFocused()) {
      showView('inspiration');
      if (window.InspirationLab) { InspirationLab.init().then(() => InspirationLab.render(document.getElementById('inspiration-container'))); }
    }
    // ? = shortcuts modal
    if (e.key === '?' && !isInputFocused() && shortcutsModal) {
      shortcutsModal.classList.toggle('hidden');
    }
    // Left/Right arrow for chapter navigation in reader view
    if (currentView === 'reader' && currentChapter && !isInputFocused()) {
      const idx = getChapterIndex(currentChapter);
      if (e.key === 'ArrowLeft' && idx > 0) loadChapter(allChapters[idx - 1]);
      if (e.key === 'ArrowRight' && idx < allChapters.length - 1) loadChapter(allChapters[idx + 1]);
    }
  });

  function isInputFocused() {
    const tag = document.activeElement?.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA';
  }

  // ===== LANDING → READER QUICK LINKS =====
  // Double-click a node to jump directly to its primary chapter
  document.querySelectorAll('.node').forEach(node => {
    node.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const comp = COMPONENTS[node.dataset.component];
      if (comp && comp.chapters.length) {
        const primary = comp.chapters[0];
        const chId = findChapterId(primary.part, primary.num);
        if (chId) {
          showView('reader');
          loadChapterById(chId);
        }
      }
    });
  });

  // ===== SHORTCUTS MODAL =====
  const shortcutsBtn = document.getElementById('shortcuts-hint');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  if (shortcutsBtn && shortcutsModal) {
    shortcutsBtn.addEventListener('click', () => shortcutsModal.classList.toggle('hidden'));
    shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shortcutsModal || e.target.classList.contains('shortcuts-close')) {
        shortcutsModal.classList.add('hidden');
      }
    });
  }

  // ===== READING PROGRESS =====
  const chapterContent = document.getElementById('chapter-content');
  const progressBar = document.getElementById('reading-progress');
  if (chapterContent && progressBar) {
    chapterContent.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = chapterContent;
      const pct = scrollHeight <= clientHeight ? 100 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      progressBar.style.width = Math.min(100, pct) + '%';
    });
  }

  // ===== AGENT LOOP VISUALIZATION =====
  const loopSteps = document.querySelectorAll('.loop-step');
  const loopDetails = document.querySelectorAll('.loop-detail');
  const loopProgressFill = document.querySelector('.loop-progress-fill');
  const loopCurrentEl = document.getElementById('loop-current');
  let currentLoopStep = 1;
  let loopAutoInterval = null;
  let loopSpeed = 2500; // ms per step

  function setLoopStep(n) {
    currentLoopStep = n;
    loopSteps.forEach(s => {
      const sn = parseInt(s.dataset.step);
      s.classList.toggle('active', sn === n);
      s.classList.toggle('visited', sn < n);
    });
    loopDetails.forEach(d => {
      d.classList.toggle('hidden', parseInt(d.dataset.step) !== n);
    });
    if (loopProgressFill) {
      loopProgressFill.style.width = ((n - 1) / 10 * 100) + '%';
    }
    if (loopCurrentEl) loopCurrentEl.textContent = n;
    const prevBtn = document.getElementById('loop-prev');
    const nextBtn = document.getElementById('loop-next');
    if (prevBtn) prevBtn.disabled = n <= 1;
    if (nextBtn) nextBtn.disabled = n >= 11;

    // Re-trigger SSE animation on step 5
    if (n === 5) {
      const sseLines = document.querySelectorAll('.sse-line');
      sseLines.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // force reflow
        el.style.animation = '';
      });
    }
  }

  loopSteps.forEach(s => {
    s.addEventListener('click', () => {
      stopLoopAuto();
      setLoopStep(parseInt(s.dataset.step));
    });
  });

  const loopPrevBtn = document.getElementById('loop-prev');
  const loopNextBtn = document.getElementById('loop-next');
  const loopAutoBtn = document.getElementById('loop-auto');

  if (loopPrevBtn) loopPrevBtn.addEventListener('click', () => {
    stopLoopAuto();
    if (currentLoopStep > 1) setLoopStep(currentLoopStep - 1);
  });
  if (loopNextBtn) loopNextBtn.addEventListener('click', () => {
    stopLoopAuto();
    if (currentLoopStep < 11) setLoopStep(currentLoopStep + 1);
  });

  function stopLoopAuto() {
    if (loopAutoInterval) {
      clearInterval(loopAutoInterval);
      loopAutoInterval = null;
      if (loopAutoBtn) loopAutoBtn.textContent = '▶';
    }
  }

  function startLoopAuto() {
    if (loopAutoBtn) loopAutoBtn.textContent = '⏸';
    loopAutoInterval = setInterval(() => {
      if (currentLoopStep >= 11) {
        setLoopStep(1); // loop back to start
        return;
      }
      setLoopStep(currentLoopStep + 1);
    }, loopSpeed);
  }

  if (loopAutoBtn) loopAutoBtn.addEventListener('click', () => {
    if (loopAutoInterval) {
      stopLoopAuto();
    } else {
      startLoopAuto();
    }
  });

  // Speed controls
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loopSpeed = parseInt(btn.dataset.speed);
      // If auto-playing, restart with new speed
      if (loopAutoInterval) {
        clearInterval(loopAutoInterval);
        startLoopAuto();
      }
    });
  });

  // ===== ANIMATED STAT COUNTERS =====
  function animateCounters() {
    document.querySelectorAll('.counter').forEach(el => {
      const target = parseInt(el.dataset.target);
      if (!target || el.dataset.animated) return;
      el.dataset.animated = 'true';
      const duration = 1500;
      const start = performance.now();
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // ===== SCROLL FADE-IN =====
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger counter animation when stats strip becomes visible
        if (entry.target.closest('#landing')) animateCounters();
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in-section').forEach(el => fadeObserver.observe(el));

  // Also observe stats strip for counter animation
  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) animateCounters();
    }, { threshold: 0.5 });
    statsObserver.observe(statsStrip);
  }

  // ===== ARCHITECTURE EXPLORER =====
  function renderArchTreemap() {
    const container = document.getElementById('arch-treemap');
    const breadcrumb = document.getElementById('arch-breadcrumb');
    const infoPanel = document.getElementById('arch-info');
    const legend = document.getElementById('arch-legend');
    if (!container || typeof ARCHITECTURE === 'undefined') return;

    let navStack = [ARCHITECTURE]; // navigation history

    function currentNode() { return navStack[navStack.length - 1]; }

    function renderBlocks(node) {
      container.innerHTML = '';
      const items = (node.children || []).slice().sort((a, b) => b.lines - a.lines);
      const totalLines = items.reduce((s, c) => s + c.lines, 0);
      const parentColor = node.color || null;

      // Calculate block sizes as flex-basis percentages
      items.forEach((item, i) => {
        const pct = (item.lines / totalLines) * 100;
        const block = document.createElement('div');
        block.className = 'arch-block';
        const color = item.color || parentColor || '#48bb78';
        block.style.background = `linear-gradient(135deg, ${color}cc, ${color}88)`;
        // Size: use flex-grow proportional to lines
        block.style.flexGrow = Math.max(item.lines / 1000, 1);
        block.style.flexBasis = Math.max(pct * 2.5, 80) + 'px';
        block.style.minWidth = pct > 8 ? '120px' : '80px';

        block.innerHTML = `
          <div class="arch-block-name">${item.name}</div>
          <div class="arch-block-stats">${item.files} files · ${(item.lines/1000).toFixed(1)}K lines</div>
          <div class="arch-block-bar"></div>
        `;

        // Hover: show info
        block.addEventListener('mouseenter', () => {
          const nameEl = infoPanel.querySelector('.arch-info-name');
          const statsEl = infoPanel.querySelector('.arch-info-stats');
          if (nameEl) nameEl.textContent = item.desc || item.name;
          if (statsEl) statsEl.textContent = `${item.files} files · ${item.lines.toLocaleString()} lines · ${pct.toFixed(1)}%`;
        });

        // Click: drill down if has children
        block.addEventListener('click', () => {
          if (item.children && item.children.length > 0) {
            navStack.push(item);
            renderBlocks(item);
            renderBreadcrumb();
            container.classList.add('zooming');
            setTimeout(() => container.classList.remove('zooming'), 350);
          }
        });

        // Visual indicator for drillable blocks
        if (item.children && item.children.length > 0) {
          block.style.cursor = 'pointer';
          block.title = '点击进入子目录';
        } else {
          block.style.cursor = 'default';
        }

        container.appendChild(block);
      });

      // Reset info panel
      const nameEl = infoPanel.querySelector('.arch-info-name');
      const statsEl = infoPanel.querySelector('.arch-info-stats');
      if (nameEl) nameEl.textContent = `${node.name} — ${items.length} 个子模块`;
      if (statsEl) statsEl.textContent = `${node.files} files · ${node.lines.toLocaleString()} lines`;
    }

    function renderBreadcrumb() {
      breadcrumb.innerHTML = '';
      navStack.forEach((node, i) => {
        const crumb = document.createElement('span');
        crumb.className = 'arch-crumb';
        crumb.textContent = node.name;
        if (i < navStack.length - 1) {
          crumb.addEventListener('click', () => {
            navStack = navStack.slice(0, i + 1);
            renderBlocks(currentNode());
            renderBreadcrumb();
          });
        }
        breadcrumb.appendChild(crumb);
      });
    }

    function renderLegend() {
      legend.innerHTML = '';
      const topModules = (ARCHITECTURE.children || []).slice(0, 10);
      topModules.forEach(m => {
        const item = document.createElement('div');
        item.className = 'arch-legend-item';
        item.innerHTML = `<span class="arch-legend-dot" style="background:${m.color || '#48bb78'}"></span>${m.name}`;
        legend.appendChild(item);
      });
    }

    renderBlocks(ARCHITECTURE);
    renderBreadcrumb();
    renderLegend();
  }

  renderArchTreemap();

  // ===== DATA FLOW TABS =====
  document.querySelectorAll('.df-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.df-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.df-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panelId = 'df-' + tab.dataset.df;
      const panel = document.getElementById(panelId);
      if (panel) panel.classList.add('active');
    });
  });

  // ===== TOOL GRID RENDERING =====
  function renderToolGrid() {
    const grid = document.getElementById('tool-grid');
    if (!grid || typeof TOOL_CATALOG === 'undefined') return;
    grid.innerHTML = '';
    let totalTools = 0;
    TOOL_CATALOG.forEach(cat => {
      totalTools += cat.tools.length;
      const card = document.createElement('div');
      card.className = 'tool-category';
      const linesInfo = cat.tools.reduce((s, t) => s + (t.lines || 0), 0);
      card.innerHTML = `
        <div class="tool-category-header">
          <span class="tool-category-name" style="color:${cat.color}">${cat.category}</span>
          <span class="tool-category-count" style="color:${cat.color}">${cat.tools.length} 个${linesInfo ? ' · ' + linesInfo.toLocaleString() + ' 行' : ''}</span>
        </div>
        <div class="tool-items">
          ${cat.tools.map(t => {
            const title = t.desc + (t.lines ? ' (' + t.lines + ' 行)' : '') + (t.note ? ' — ' + t.note : '');
            return `<span class="tool-item${t.gated ? ' gated' : ''}" title="${title}">${t.name}</span>`;
          }).join('')}
        </div>
      `;
      grid.appendChild(card);
    });
    // Update the section title with accurate count
    const titleEl = document.querySelector('#tool-grid-section .section-title');
    if (titleEl) titleEl.textContent = `Tool System — ${totalTools} 个内置工具`;
  }

  // ===== COMMAND CATALOG RENDERING =====
  function renderCommandCatalog() {
    const grid = document.getElementById('command-grid');
    if (!grid || typeof COMMAND_CATALOG === 'undefined') return;
    grid.innerHTML = '';

    // Separate public and internal/gated categories
    const publicCats = [];
    const internalCats = [];
    let totalPublic = 0;
    let totalInternal = 0;

    COMMAND_CATALOG.forEach(cat => {
      const publicCmds = cat.commands.filter(c => !c.gated);
      const gatedCmds = cat.commands.filter(c => c.gated);

      if (publicCmds.length > 0) {
        publicCats.push({ ...cat, commands: publicCmds });
        totalPublic += publicCmds.length;
      }
      if (gatedCmds.length > 0) {
        internalCats.push({ ...cat, commands: gatedCmds });
        totalInternal += gatedCmds.length;
      }
    });

    // Render public commands
    publicCats.forEach(cat => {
      const color = cat.color || '#a0aec0';
      const card = document.createElement('div');
      card.className = 'cmd-category';
      card.innerHTML = `
        <div class="cmd-category-header">
          <span class="cmd-category-name" style="color:${color}">${cat.category}</span>
          <span class="cmd-category-count" style="color:${color}">${cat.commands.length}</span>
        </div>
        <div class="cmd-items">
          ${cat.commands.map(c =>
            `<div class="cmd-item" data-cmd="${c.name.toLowerCase()}">
              <span class="cmd-name">${c.name}</span>
              <span class="cmd-desc">${c.desc}</span>
            </div>`
          ).join('')}
        </div>
      `;
      grid.appendChild(card);
    });

    // Update counts
    const pubCount = document.querySelector('.cmd-count-public');
    const intCount = document.querySelector('.cmd-count-internal');
    if (pubCount) pubCount.textContent = totalPublic;
    if (intCount) intCount.textContent = totalInternal;

    // Internal commands
    const intList = document.getElementById('internal-commands');
    if (intList && internalCats.length > 0) {
      intList.innerHTML = internalCats.map(cat =>
        cat.commands.map(c =>
          `<span class="cmd-internal-item" title="${c.desc}${c.gate ? ' [' + c.gate + ']' : ''}">${c.name}</span>`
        ).join('')
      ).join('');
    }

    // Toggle internal
    const toggleBtn = document.getElementById('show-internal');
    const intSection = document.getElementById('internal-command-list');
    if (toggleBtn && intSection) {
      toggleBtn.addEventListener('click', () => {
        intSection.classList.toggle('hidden');
        toggleBtn.textContent = intSection.classList.contains('hidden')
          ? '显示门控/内部命令 →'
          : '← 隐藏门控/内部命令';
      });
    }

    // Search
    const cmdSearch = document.getElementById('cmd-search');
    if (cmdSearch) {
      cmdSearch.addEventListener('input', () => {
        const q = cmdSearch.value.trim().toLowerCase();
        grid.querySelectorAll('.cmd-item').forEach(item => {
          const match = !q || item.dataset.cmd.includes(q) || item.textContent.toLowerCase().includes(q);
          item.style.display = match ? '' : 'none';
        });
        grid.querySelectorAll('.cmd-category').forEach(cat => {
          const anyVisible = Array.from(cat.querySelectorAll('.cmd-item')).some(i => i.style.display !== 'none');
          cat.style.display = anyVisible ? '' : 'none';
        });
      });
    }
  }

  // ===== HIDDEN FEATURES RENDERING =====
  function renderHiddenFeatures() {
    const grid = document.getElementById('hidden-features-grid');
    if (!grid || typeof HIDDEN_FEATURES === 'undefined') return;
    grid.innerHTML = '';
    HIDDEN_FEATURES.forEach(f => {
      const card = document.createElement('div');
      card.className = 'hidden-feature-card';
      card.innerHTML = `
        <div class="hf-header">
          <span class="hf-icon">${f.icon}</span>
          <div class="hf-title-block">
            <span class="hf-name" style="color:${f.color}">${f.name}</span>
            <span class="hf-flag">${f.status === 'gated' ? '🔒 ' + f.flag : '✓ 内置'}</span>
          </div>
        </div>
        <p class="hf-desc">${f.desc}</p>
        <div class="hf-meta">
          <span class="hf-source" title="${f.source}">📂 ${f.source.split('/').slice(-1)[0] || f.source}</span>
        </div>
        <div class="hf-detail">${f.detail}</div>
      `;
      // Click to expand detail
      card.addEventListener('click', () => card.classList.toggle('expanded'));
      grid.appendChild(card);
    });
  }

  // ===== CTA BUTTONS =====
  const ctaRead = document.getElementById('cta-read');
  const ctaMap = document.getElementById('cta-map');
  if (ctaRead) ctaRead.addEventListener('click', () => showView('reader'));
  if (ctaMap) {
    ctaMap.addEventListener('click', () => {
      const landing = document.getElementById('landing');
      if (landing) landing.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== SECTION NAV TRACKING =====
  const sectionNav = document.getElementById('section-nav');
  if (sectionNav) {
    const navDots = sectionNav.querySelectorAll('.section-nav-dot');
    const sectionIds = ['engine-container', 'agent-loop-section', 'tool-grid-section', 'command-catalog-section', 'hidden-features-section'];

    // Update active dot on scroll
    const landing = document.getElementById('landing');
    if (landing) {
      landing.addEventListener('scroll', () => {
        let activeIdx = 0;
        sectionIds.forEach((id, i) => {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2) activeIdx = i;
          }
        });
        navDots.forEach((dot, i) => dot.classList.toggle('active', i === activeIdx));
      });
    }

    // Show section nav only on landing view — use MutationObserver on view active class
    const landingView = document.getElementById('landing');
    function updateSectionNavVisibility() {
      if (sectionNav) sectionNav.style.display = (landingView && landingView.classList.contains('active')) ? '' : 'none';
    }
    updateSectionNavVisibility();
    if (landingView) {
      new MutationObserver(updateSectionNavVisibility).observe(landingView, { attributes: true, attributeFilter: ['class'] });
    }
    // Smooth scroll on dot click
    navDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(dot.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ===== INIT =====
  buildTOC();
  renderToolGrid();
  renderCommandCatalog();
  renderHiddenFeatures();

  // Check URL hash for direct chapter link
  if (window.location.hash) {
    const hash = window.location.hash.slice(1);
    const match = hash.match(/^chapter-(.+)$/);
    if (match) {
      showView('reader');
      loadChapterById(match[1]);
    }
  }
})();
