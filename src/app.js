const state = { filter: 'all', query: '' };

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const linkFor = (digest) => 'digest.html?id=' + encodeURIComponent(digest.id);
const pair = (en, zh) => '<span data-en>' + esc(en) + '</span><span data-zh>' + esc(zh || en) + '</span>';

function digestCard(digest) {
  const tags = (digest.tags || []).map((tag) => '<span class="tag">' + esc(tag) + '</span>').join('');
  return '<article class="digest-card"><div class="card-meta"><span>' + esc(digest.topic) + '</span><time datetime="' + esc(digest.date) + '">' + esc(digest.date) + '</time></div><p class="card-series">' + esc(digest.series || 'Research brief') + ' · ' + esc(digest.readTime || '5 min') + '</p><h3><a href="' + linkFor(digest) + '">' + pair(digest.title, digest.titleZh) + '</a></h3><p>' + pair(digest.finding, digest.findingZh) + '</p><div class="card-footer">' + tags + '<a class="arrow-link" href="' + linkFor(digest) + '" aria-label="Open digest">-></a></div></article>';
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
  target.innerHTML = '<div class="detail-kicker"><span>' + esc(digest.topic) + '</span><time datetime="' + esc(digest.date) + '">' + esc(digest.date) + '</time><span class="demo-label">' + esc(digest.sourceStatus || 'PUBLIC SAMPLE') + '</span></div><p class="detail-series">' + esc(digest.series || 'Research brief') + ' · ' + esc(digest.readTime || '5 min') + ' · ' + esc(digest.audience || 'Researchers') + '</p><h1>' + pair(digest.title, digest.titleZh) + '</h1><p class="detail-dek">' + pair(digest.question, digest.questionZh) + '</p><div class="detail-source"><span>Source</span><a href="' + esc(digest.source) + '" target="_blank" rel="noreferrer">' + esc(digest.sourceLabel) + ' -></a></div><div class="detail-grid"><section><p class="eyebrow">RESEARCH QUESTION</p><h2>' + pair(digest.question, digest.questionZh) + '</h2></section><section><p class="eyebrow">METHOD</p><p>' + pair(digest.method, digest.methodZh) + '</p></section><section class="detail-wide"><p class="eyebrow">KEY FINDING</p><p class="finding-text">' + pair(digest.finding, digest.findingZh) + '</p></section><section class="detail-wide limitation"><p class="eyebrow">LIMITATION</p><p>' + pair(digest.limitation, digest.limitationZh) + '</p></section></div><section class="takeaways"><p class="eyebrow">TAKEAWAYS</p><ul>' + (digest.takeaways || []).map((item) => '<li>' + esc(item) + '</li>').join('') + '</ul></section><div class="bilingual-block"><div><p class="eyebrow">BILINGUAL REVIEW</p><h2>' + esc(digest.titleZh) + '</h2></div><div><p class="eyebrow">中文摘要</p><p>' + esc(digest.findingZh) + '</p></div><div><p class="eyebrow">边界</p><p>' + esc(digest.limitationZh) + '</p></div></div>' + (related.length ? '<section class="related-section"><p class="eyebrow">READ NEXT</p><div class="related-grid">' + related.map((item) => '<a class="related-link" href="' + linkFor(item) + '"><span>' + esc(item.topic) + '</span><strong>' + esc(item.title) + '</strong><small>' + esc(item.readTime || '5 min') + '</small></a>').join('') + '</div></section>' : '');
  document.title = digest.title + ' | AI Research Digest';
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
}).catch(() => {
  const target = document.querySelector('[data-digest-grid], [data-digest-list], [data-detail]');
  if (target) target.innerHTML = '<p class="empty-state">The local sample data could not be loaded. Run the preview command from the repository root.</p>';
});
setupLanguage();
setupAgentDemo();
