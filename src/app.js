const state = { filter: 'all', query: '' };

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const linkFor = (digest) => 'digest.html?id=' + encodeURIComponent(digest.id);
const pair = (en, zh) => '<span data-en>' + esc(en) + '</span><span data-zh>' + esc(zh || en) + '</span>';
const editorialMeta = (digest) => '<div class="editorial-meta"><span>By ' + esc(digest.author || 'AI Research Digest editorial demo') + '</span><span>Evidence: ' + esc(digest.evidenceLevel || 'PUBLIC SAMPLE') + '</span><span>Next: ' + esc(digest.nextAction || 'Human review required') + '</span></div>';

function digestCard(digest) {
  const tags = (digest.tags || []).map((tag) => '<span class="tag">' + esc(tag) + '</span>').join('');
  return '<article class="digest-card"><div class="card-meta"><span>' + esc(digest.topic) + '</span><time datetime="' + esc(digest.date) + '">' + esc(digest.date) + '</time></div><p class="card-series">' + esc(digest.series || 'Research brief') + ' · ' + esc(digest.readTime || '5 min') + '</p><h3><a href="' + linkFor(digest) + '">' + pair(digest.title, digest.titleZh) + '</a></h3><p>' + pair(digest.finding, digest.findingZh) + '</p>' + editorialMeta(digest) + '<div class="card-footer">' + tags + '<a class="arrow-link" href="' + linkFor(digest) + '" aria-label="Open digest">-></a></div></article>';
}

function matches(digest) {
  const haystack = [digest.title, digest.titleZh, digest.topic, digest.series, digest.question, digest.finding, ...(digest.tags || [])].join(' ').toLowerCase();
  return (state.filter === 'all' || digest.topic === state.filter) && (!state.query || haystack.includes(state.query));
}

function renderLibrary(digests) {
  const filtered = digests.filter(matches);
  const grid = document.querySelector('[data-digest-grid]');
  const list = document.querySelector('[data-digest-list]');
  const empty = '<p class="empty-state">No matching briefs yet. Try another topic.</p>';
  if (grid) grid.innerHTML = filtered.length ? filtered.map(digestCard).join('') : empty;
  if (list) list.innerHTML = filtered.length ? filtered.map((digest) => '<div class="digest-row"><div class="row-date">' + esc(digest.date) + '<span>' + esc(digest.readTime || '5 min') + '</span></div><div><p class="eyebrow">' + esc(digest.topic) + '</p><p class="card-series">' + esc(digest.series || 'Research brief') + '</p><h2><a href="' + linkFor(digest) + '">' + pair(digest.title, digest.titleZh) + '</a></h2><p>' + pair(digest.finding, digest.findingZh) + '</p><div class="card-footer">' + (digest.tags || []).map((tag) => '<span class="tag">' + esc(tag) + '</span>').join('') + '</div></div><a class="arrow-link" href="' + linkFor(digest) + '" aria-label="Open digest">-></a></div>').join('') : empty;
}

function renderDetail(digests) {
  const target = document.querySelector('[data-detail]');
  const id = new URLSearchParams(window.location.search).get('id');
  const digest = digests.find((item) => item.id === id);
  if (!target || !digest) return;
  const related = (digest.related || []).map((relatedId) => digests.find((item) => item.id === relatedId)).filter(Boolean);
  target.hidden = false;
  document.querySelector('.page-intro')?.setAttribute('hidden', '');
  document.querySelector('.library-controls')?.setAttribute('hidden', '');
  document.querySelector('[data-digest-list]')?.setAttribute('hidden', '');
  target.innerHTML = '<div class="detail-kicker"><span>' + esc(digest.topic) + '</span><time datetime="' + esc(digest.date) + '">' + esc(digest.date) + '</time><span class="demo-label">' + esc(digest.sourceStatus || 'PUBLIC SAMPLE') + '</span></div><p class="detail-series">' + esc(digest.series || 'Research brief') + ' · ' + esc(digest.readTime || '5 min') + ' · ' + esc(digest.audience || 'Researchers') + '</p><h1>' + pair(digest.title, digest.titleZh) + '</h1><p class="detail-dek">' + pair(digest.question, digest.questionZh) + '</p><div class="detail-source"><span>Source</span><a href="' + esc(digest.source) + '" target="_blank" rel="noreferrer">' + esc(digest.sourceLabel) + ' -></a></div>' + editorialMeta(digest) + '<div class="detail-grid"><section><p class="eyebrow">RESEARCH QUESTION</p><h2>' + pair(digest.question, digest.questionZh) + '</h2></section><section><p class="eyebrow">METHOD</p><p>' + pair(digest.method, digest.methodZh) + '</p></section><section class="detail-wide"><p class="eyebrow">KEY FINDING</p><p class="finding-text">' + pair(digest.finding, digest.findingZh) + '</p></section><section class="detail-wide limitation"><p class="eyebrow">LIMITATION</p><p>' + pair(digest.limitation, digest.limitationZh) + '</p></section></div><section class="takeaways"><p class="eyebrow">TAKEAWAYS</p><ul>' + (digest.takeaways || []).map((item) => '<li>' + esc(item) + '</li>').join('') + '</ul></section><div class="bilingual-block"><div><p class="eyebrow">BILINGUAL REVIEW</p><h2>' + esc(digest.titleZh) + '</h2></div><div><p class="eyebrow">中文摘要</p><p>' + esc(digest.findingZh) + '</p></div><div><p class="eyebrow">边界</p><p>' + esc(digest.limitationZh) + '</p></div></div>' + (related.length ? '<section class="related-section"><p class="eyebrow">READ NEXT</p><div class="related-grid">' + related.map((item) => '<a class="related-link" href="' + linkFor(item) + '"><span>' + esc(item.topic) + '</span><strong>' + esc(item.title) + '</strong><small>' + esc(item.readTime || '5 min') + '</small></a>').join('') + '</div></section>' : '');
  document.title = digest.title + ' | AI Research Digest';
}

function taskFor(digest) {
  const text = [digest.topic, digest.series, ...(digest.tags || [])].join(' ').toLowerCase();
  const tasks = [];
  if (text.includes('literature') || text.includes('tool') || text.includes('research')) tasks.push('literature');
  if (text.includes('governance') || text.includes('politics') || text.includes('platform') || text.includes('international')) tasks.push('governance', 'policy');
  if (text.includes('workflow') || text.includes('automation') || text.includes('human')) tasks.push('workflow');
  if (text.includes('quality') || text.includes('evaluation') || text.includes('bilingual') || text.includes('integrity')) tasks.push('quality');
  return [...new Set(tasks)];
}

function explorerMatches(digest, controls) {
  const task = controls.task?.value || 'all';
  const audience = controls.audience?.value || 'all';
  const maxTime = controls.time?.value || 'all';
  const audienceText = (digest.audience || '').toLowerCase();
  const readMinutes = Number.parseInt(digest.readTime || '0', 10);
  return (task === 'all' || taskFor(digest).includes(task)) && (audience === 'all' || audienceText.includes(audience) || (audience === 'policy' && audienceText.includes('policy')) || (audience === 'builders' && (audienceText.includes('builder') || audienceText.includes('assistant')))) && (maxTime === 'all' || readMinutes <= Number(maxTime));
}

function renderExplorer(digests, controls) {
  const matches = digests.filter((digest) => explorerMatches(digest, controls));
  const target = document.querySelector('[data-explorer-grid]');
  const summary = document.querySelector('[data-explorer-summary]');
  if (summary) summary.textContent = `${matches.length} local sample brief${matches.length === 1 ? '' : 's'} match this research path. Each record remains source-linked and review-required.`;
  if (target) target.innerHTML = matches.length ? matches.map((digest) => `<article class="explorer-card"><div class="card-meta"><span>${esc(digest.topic)}</span><time>${esc(digest.readTime || '5 min')}</time></div><p class="card-series">${esc(digest.series || 'Research brief')} · ${esc(digest.audience || 'Researchers')}</p><h2><a href="${linkFor(digest)}">${pair(digest.title, digest.titleZh)}</a></h2><p>${pair(digest.question, digest.questionZh)}</p><div class="explorer-card-footer"><span class="demo-label">${esc(digest.sourceStatus || 'PUBLIC SAMPLE')}</span><a class="text-link" href="${linkFor(digest)}">Open brief -></a></div></article>`).join('') : '<p class="empty-state">No local sample matches this combination. Try a broader task or reading time.</p>';
}

function compareMarkup(left, right) {
  const rows = [['Topic', left.topic, right.topic], ['Research question', left.question, right.question], ['Method', left.method, right.method], ['Key finding', left.finding, right.finding], ['Limitation', left.limitation, right.limitation], ['Audience', left.audience, right.audience], ['Evidence status', left.sourceStatus, right.sourceStatus]];
  return `<div class="compare-heading"><div><p class="eyebrow">BRIEF A</p><h2>${pair(left.title, left.titleZh)}</h2><a href="${linkFor(left)}">Open full brief -></a></div><div><p class="eyebrow">BRIEF B</p><h2>${pair(right.title, right.titleZh)}</h2><a href="${linkFor(right)}">Open full brief -></a></div></div><div class="compare-table"><div class="compare-table-head"><span>Field</span><span>Brief A</span><span>Brief B</span></div>${rows.map(([label, a, b]) => `<div class="compare-row"><strong>${esc(label)}</strong><div>${pair(a, a)}</div><div>${pair(b, b)}</div></div>`).join('')}</div><div class="compare-decision"><p class="eyebrow">DECISION PROMPT</p><p>Which brief deserves deeper reading for your task? Record the source you would verify first and the limitation that could change your decision.</p></div>`;
}

function setupExplorer(digests) {
  const controls = { task: document.querySelector('[data-explorer-task]'), audience: document.querySelector('[data-explorer-audience]'), time: document.querySelector('[data-explorer-time]') };
  if (!controls.task) return;
  const params = new URLSearchParams(window.location.search);
  Object.entries(controls).forEach(([key, control]) => {
    const requested = params.get(key);
    if (requested && [...control.options].some((option) => option.value === requested)) control.value = requested;
  });
  Object.values(controls).forEach((control) => control.addEventListener('change', () => renderExplorer(digests, controls)));
  renderExplorer(digests, controls);
}

function setupCompare(digests) {
  const left = document.querySelector('[data-compare-a]');
  const right = document.querySelector('[data-compare-b]');
  const output = document.querySelector('[data-compare-output]');
  if (!left || !right || !output) return;
  const options = digests.map((digest) => `<option value="${esc(digest.id)}">${esc(digest.title)}</option>`).join('');
  left.innerHTML = options;
  right.innerHTML = options;
  right.selectedIndex = Math.min(1, digests.length - 1);
  const render = () => {
    const first = digests.find((digest) => digest.id === left.value) || digests[0];
    const second = digests.find((digest) => digest.id === right.value) || digests[1] || digests[0];
    output.innerHTML = first && second ? compareMarkup(first, second) : '<p class="empty-state">Two local briefs are required for comparison.</p>';
  };
  left.addEventListener('change', render); right.addEventListener('change', render); render();
  document.querySelector('[data-compare-export]')?.addEventListener('click', () => {
    const first = digests.find((digest) => digest.id === left.value) || digests[0];
    const second = digests.find((digest) => digest.id === right.value) || digests[1] || digests[0];
    const text = ['AI Research Digest comparison', '', `A: ${first.title}`, `B: ${second.title}`, '', `A finding: ${first.finding}`, `B finding: ${second.finding}`, '', `A limitation: ${first.limitation}`, `B limitation: ${second.limitation}`, '', 'Status: PUBLIC SAMPLE / HUMAN REVIEW REQUIRED'].join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'digest-comparison.txt'; link.click(); URL.revokeObjectURL(url);
  });
}

function setupControls(digests) {
  const requestedTopic = new URLSearchParams(window.location.search).get('topic');
  if (requestedTopic) state.filter = requestedTopic;
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item.dataset.filter === state.filter));
    renderLibrary(digests);
  }));
  document.querySelectorAll('[data-search]').forEach((input) => input.addEventListener('input', () => {
    state.query = input.value.trim().toLowerCase();
    renderLibrary(digests);
  }));
  document.querySelectorAll('[data-filter]').forEach((button) => button.classList.toggle('active', button.dataset.filter === state.filter));
  renderLibrary(digests);
}

function setupLanguage() {
  const saved = localStorage.getItem('ard-lang') || 'en';
  document.documentElement.dataset.lang = saved;
  document.querySelectorAll('[data-lang-toggle]').forEach((button) => button.addEventListener('click', () => {
    const next = document.documentElement.dataset.lang === 'en' ? 'zh' : 'en';
    document.documentElement.dataset.lang = next;
    localStorage.setItem('ard-lang', next);
  }));
}

function setupAgentDemo() {
  const buttons = document.querySelectorAll('[data-stage]');
  const panels = document.querySelectorAll('[data-stage-panel]');
  if (!buttons.length) return;
  const activate = (stage) => {
    buttons.forEach((button) => button.classList.toggle('active', button.dataset.stage === stage));
    panels.forEach((panel) => panel.toggleAttribute('hidden', panel.dataset.stagePanel !== stage));
  };
  buttons.forEach((button) => button.addEventListener('click', () => activate(button.dataset.stage)));
  activate(buttons[0].dataset.stage);
}

fetch('data/digests.json').then((response) => response.json()).then((digests) => {
  renderLibrary(digests);
  renderDetail(digests);
  setupControls(digests);
  setupExplorer(digests);
  setupCompare(digests);
}).catch(() => {
  const target = document.querySelector('[data-digest-grid], [data-digest-list], [data-detail]');
  if (target) target.innerHTML = '<p class="empty-state">The local sample data could not be loaded. Run the preview command from the repository root.</p>';
});
setupLanguage();
setupAgentDemo();
