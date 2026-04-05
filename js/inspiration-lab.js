/**
 * Inspiration Lab — 灵感实验室
 * 火花(Sparks) & 蓝图(Blueprints) 可视化面板
 */
(function() {
  'use strict';

  let sparks = [];
  let blueprints = [];
  let loaded = false;
  let currentFilter = 'all';
  let currentTab = 'sparks';
  let searchQuery = '';

  const CATEGORY_LABELS = {
    pain_point: '痛点',
    unmet_need: '未满足需求',
    wild_idea: '异想天开',
    counter_intuitive: '反直觉',
    cross_domain: '跨界'
  };
  const CATEGORY_COLORS = {
    pain_point: '#ff6b6b',
    unmet_need: '#ffd93d',
    wild_idea: '#6bcb77',
    counter_intuitive: '#4d96ff',
    cross_domain: '#9b59b6'
  };
  const CONFIDENCE_LABELS = {
    wild_guess: '直觉',
    has_signal: '有信号',
    strong_signal: '强信号',
    validated: '已验证',
    speculative: '推测性'
  };
  const SOURCE_LABELS = {
    book_analysis: '书籍分析',
    community_research: '社区调研',
    deep_reading: '深读老炮儿'
  };
  const SOURCE_ICONS = {
    book_analysis: '📖',
    community_research: '🌍',
    deep_reading: '🔥'
  };

  async function loadData(forceRefresh) {
    if (loaded && !forceRefresh) return;
    try {
      const bust = forceRefresh ? `?t=${Date.now()}` : '';
      const [sparksRes, blueprintsRes] = await Promise.all([
        fetch('handoff/brainstorm/sparks-v1.json' + bust),
        fetch('handoff/brainstorm/blueprints-v1.json' + bust)
      ]);
      sparks = await sparksRes.json();
      blueprints = await blueprintsRes.json();
      loaded = true;
    } catch (e) {
      console.warn('Inspiration data not loaded:', e);
    }
  }

  function getStats() {
    const cats = {};
    const confs = {};
    const srcs = {};
    sparks.forEach(s => {
      cats[s.category] = (cats[s.category] || 0) + 1;
      confs[s.confidence] = (confs[s.confidence] || 0) + 1;
      const st = s.source_type || 'book_analysis';
      srcs[st] = (srcs[st] || 0) + 1;
    });
    return { total: sparks.length, blueprintCount: blueprints.length, cats, confs, srcs };
  }

  function render(container) {
    const stats = getStats();
    container.innerHTML = `
      <div class="insp-header">
        <div class="insp-title-row">
          <h1 class="insp-title">灵感实验室</h1>
          <div class="insp-stats">
            <span class="insp-stat"><span class="insp-stat-num">${stats.total}</span> 火花</span>
            <span class="insp-stat"><span class="insp-stat-num">${stats.blueprintCount}</span> 蓝图</span>
          </div>
        </div>
        <p class="insp-desc">从 Claude Code 源码分析 + 全球社区调研 + 深度阅读中提炼的灵感。火花是异想天开的微灵感，蓝图是经过验证的成熟方向。</p>
        <div class="insp-source-bar">
          ${Object.entries(stats.srcs).map(([k, v]) => `<span class="insp-src-chip">${SOURCE_ICONS[k] || ''} ${SOURCE_LABELS[k] || k} <b>${v}</b></span>`).join('')}
        </div>
        <div class="insp-tabs">
          <button class="insp-tab ${currentTab === 'sparks' ? 'active' : ''}" data-tab="sparks">火花 (${stats.total})</button>
          <button class="insp-tab ${currentTab === 'blueprints' ? 'active' : ''}" data-tab="blueprints">蓝图 (${stats.blueprintCount})</button>
        </div>
      </div>
      <div class="insp-body">
        ${currentTab === 'sparks' ? renderSparksView(stats) : renderBlueprintsView()}
      </div>
    `;
    bindEvents(container);
  }

  function renderSparksView(stats) {
    const filters = [
      { key: 'all', label: '全部', count: stats.total },
      ...Object.entries(stats.cats).map(([k, v]) => ({
        key: k, label: CATEGORY_LABELS[k] || k, count: v
      }))
    ];

    let filtered = currentFilter === 'all'
      ? sparks
      : sparks.filter(s => s.category === currentFilter);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.spark.toLowerCase().includes(q) ||
        (s.why_it_matters || '').toLowerCase().includes(q) ||
        (s.cc_anchor || '').toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    return `
      <div class="insp-search-row">
        <input class="insp-search" type="text" placeholder="搜索火花..." value="${searchQuery}">
        <span class="insp-result-count">${filtered.length} / ${stats.total}</span>
      </div>
      <div class="insp-filters">
        ${filters.map(f => `
          <button class="insp-filter ${currentFilter === f.key ? 'active' : ''}" data-filter="${f.key}">
            ${f.label} <span class="insp-filter-count">${f.count}</span>
          </button>
        `).join('')}
      </div>
      <div class="insp-grid">
        ${filtered.length ? filtered.map(renderSparkCard).join('') : '<p class="insp-empty">没有找到匹配的火花</p>'}
      </div>
    `;
  }

  function renderSparkCard(s) {
    const catColor = CATEGORY_COLORS[s.category] || '#888';
    const confLabel = CONFIDENCE_LABELS[s.confidence] || s.confidence;
    const confClass = s.confidence === 'validated' ? 'conf-validated' :
                      s.confidence === 'has_signal' ? 'conf-signal' : 'conf-guess';
    const hasAnchor = s.cc_anchor || s.source;
    const anchorText = s.cc_anchor || '';
    const sourceText = typeof s.source === 'string' ? s.source : '';
    const crossDomain = s.cross_domain || '';
    const firstSketch = s.first_sketch || '';
    const srcType = s.source_type || 'book_analysis';
    const srcIcon = SOURCE_ICONS[srcType] || '📖';
    const srcLabel = SOURCE_LABELS[srcType] || srcType;
    const plainExp = s.plain_explanation || '';
    const nextStep = s.next_step || '';
    const feedback = s.user_feedback || [];
    // Format next_step: convert **bold** to <strong>, newlines to <br>
    const fmtNextStep = nextStep.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    return `
      <div class="spark-card" data-id="${s.id}">
        <div class="spark-top">
          <span class="spark-id">${s.id}</span>
          <span class="spark-cat" style="background:${catColor}">${CATEGORY_LABELS[s.category] || s.category}</span>
          <span class="spark-conf ${confClass}">${confLabel}</span>
          <span class="spark-src" title="${srcLabel}">${srcIcon}</span>
        </div>
        <div class="spark-body">
          <p class="spark-text">${s.spark}</p>
        </div>
        <div class="spark-detail" style="display:none">
          ${plainExp ? `<div class="spark-plain"><strong>💡 通俗理解</strong><p>${plainExp}</p></div>` : ''}
          <div class="spark-why">
            <strong>为什么重要</strong>
            <p>${s.why_it_matters || ''}</p>
          </div>
          ${anchorText ? `<div class="spark-anchor"><strong>🔗 CC源码锚点</strong><p>${anchorText}</p></div>` : ''}
          ${fmtNextStep ? `<div class="spark-nextstep"><strong>🚀 下一步行动</strong><div class="spark-nextstep-content">${fmtNextStep}</div></div>` : ''}
          ${crossDomain ? `<div class="spark-cross"><strong>跨界联想</strong><p>${crossDomain}</p></div>` : ''}
          ${firstSketch ? `<div class="spark-sketch"><strong>初步方案</strong><p>${firstSketch}</p></div>` : ''}
          ${sourceText ? `<div class="spark-source"><strong>来源</strong><p>${sourceText.startsWith('http') ? `<a href="${sourceText}" target="_blank">${sourceText.replace(/https?:\/\//, '').split('/')[0]}</a>` : sourceText}</p></div>` : ''}
          ${feedback.length ? `<div class="spark-feedback"><strong>💬 多角色评审</strong>${feedback.map(f => `<div class="spark-fb-item"><span class="spark-fb-persona">${f.persona}</span><p>${f.comment}</p></div>`).join('')}</div>` : ''}
          <div class="spark-tags">${(s.tags || []).map(t => `<span class="spark-tag">${t}</span>`).join('')}</div>
        </div>
        <button class="spark-expand">展开详情</button>
      </div>
    `;
  }

  function renderBlueprintsView() {
    return `
      <div class="insp-blueprints">
        ${blueprints.map(renderBlueprintCard).join('')}
      </div>
    `;
  }

  function renderBlueprintCard(b) {
    const fVal = b.feasibility === 'high' ? '高' : b.feasibility === 'medium' ? '中' : '低';
    const vVal = b.value === 'high' ? '高' : b.value === 'medium' ? '中' : '低';
    const sparkLinks = (b.from_sparks || []).join(', ');
    const confLabel = CONFIDENCE_LABELS[b.confidence] || b.confidence || '';
    const confClass = b.confidence === 'strong_signal' ? 'conf-validated' :
                      b.confidence === 'has_signal' ? 'conf-signal' : 'conf-guess';
    const plainExp = b.plain_explanation || '';
    const whyMatters = b.why_it_matters || '';
    const feedback = b.user_feedback || [];
    const firstStep = b.first_step || '';
    const ccAnchor = b.cc_anchor || '';

    // Format first_step: convert **bold** to <strong>, newlines to <br>
    const fmtStep = firstStep.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    // Format why_it_matters similarly
    const fmtWhy = whyMatters.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    return `
      <div class="blueprint-card" data-id="${b.id}">
        <div class="bp-header">
          <span class="bp-id">${b.id}</span>
          <div class="bp-badges">
            ${confLabel ? `<span class="spark-conf ${confClass}">${confLabel}</span>` : ''}
            <span class="bp-meta-chip">可行性: ${fVal}</span>
            <span class="bp-meta-chip">价值: ${vVal}</span>
          </div>
        </div>
        <h3 class="bp-title">${b.title}</h3>
        ${plainExp ? `<p class="bp-plain">${plainExp}</p>` : `<p class="bp-desc">${b.description}</p>`}
        <div class="bp-detail" style="display:none">
          ${fmtWhy ? `<div class="bp-why"><strong>为什么值得做</strong><p>${fmtWhy}</p></div>` : ''}
          ${fmtStep ? `<div class="bp-step"><strong>行动方案</strong><div class="bp-step-content">${fmtStep}</div></div>` : ''}
          ${feedback.length ? `<div class="bp-feedback"><strong>多角色评审</strong>${feedback.map(f => `<div class="bp-fb-item"><span class="bp-fb-persona">${f.persona}</span><p>${f.comment}</p></div>`).join('')}</div>` : ''}
          <div class="bp-evidence">
            <strong>证据来源</strong>
            <ul>${(b.evidence || []).map(e => `<li>${e}</li>`).join('')}</ul>
          </div>
          ${sparkLinks ? `<div class="bp-sparks"><strong>来自火花</strong><p>${sparkLinks}</p></div>` : ''}
          ${ccAnchor ? `<div class="bp-anchor"><strong>CC源码锚点</strong><p>${ccAnchor}</p></div>` : ''}
        </div>
        <button class="bp-expand">展开详情</button>
      </div>
    `;
  }

  function bindEvents(container) {
    // Tab switching
    container.querySelectorAll('.insp-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.dataset.tab;
        render(container);
      });
    });

    // Search
    const searchInput = container.querySelector('.insp-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        render(container);
        // Restore focus and cursor position
        const newInput = container.querySelector('.insp-search');
        if (newInput) {
          newInput.focus();
          newInput.selectionStart = newInput.selectionEnd = newInput.value.length;
        }
      });
    }

    // Category filters
    container.querySelectorAll('.insp-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        render(container);
      });
    });

    // Expand/collapse spark cards
    container.querySelectorAll('.spark-expand').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.spark-card');
        const detail = card.querySelector('.spark-detail');
        const isOpen = detail.style.display !== 'none';
        detail.style.display = isOpen ? 'none' : 'block';
        btn.textContent = isOpen ? '展开详情' : '收起';
        card.classList.toggle('expanded', !isOpen);
      });
    });

    // Expand/collapse blueprint cards
    container.querySelectorAll('.bp-expand').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.blueprint-card');
        const detail = card.querySelector('.bp-detail');
        const isOpen = detail.style.display !== 'none';
        detail.style.display = isOpen ? 'none' : 'block';
        btn.textContent = isOpen ? '展开详情' : '收起';
        card.classList.toggle('expanded', !isOpen);
      });
    });
  }

  // Public API
  window.InspirationLab = {
    init: loadData,
    render: render,
    getStats: getStats
  };
})();
