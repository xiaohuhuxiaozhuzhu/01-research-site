const state = { filter: 'all', query: '' };

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const linkFor = (digest) => `digest.html?id=${encodeURIComponent(digest.id)}`;

function digestCard(digest, compact = false) {
  const tags = (digest.tags || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join('');
  return `<article class="digest-card ${compact ? 'compact' : ''}"><div class="card-meta"><span>${esc(digest.topic)}</span><time datetime="${esc(digest.date)}">${esc(digest.date)}</time></div><h3><a href="${linkFor(digest)}">${esc(digest.title)}</a></h3><p>${esc(digest.finding)}</p><div class="card-footer">${tags}<a class="arrow-link" href="${linkFor(digest)}" aria-label="Open digest">-></a></div></article>`;
}

function matches(digest) {
  const haystack = [digest.title, digest.titleZh, digest.topic, digest.question, digest.finding, ...(digest.tags || [])].join(' ').toLowerCase();
  return (state.filter === 'all' || digest.topic === state.filter) && (!state.query || haystack.includes(state.query));
}

function renderLibrary(digests) {
  const filtered = digests.filter(matches);
  const grid = document.querySelector('[data-digest-grid]');
  const list = document.querySelector('[data-digest-list]');
  const empty = '<p class="empty-state">No matching briefs yet. Try another topic.</p>';
  if (grid) grid.innerHTML = filtered.length ? filtered.map((digest) => digestCard(digest, true)).join('') : empty;
  if (list) list.innerHTML = filtered.length ? filtered.map((digest) => `<div class="digest-row"><div class="row-date">${esc(digest.date)}</div><div><p class="eyebrow">${esc(digest.topic)}</p><h2><a href="${linkFor(digest)}">${esc(digest.title)}</a></h2><p>${esc(digest.finding)}</p><div class="card-footer">${(digest.tags || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join('')}</div></div><a class="arrow-link" href="${linkFor(digest)}" aria-label="Open digest">-></a></div>`).join('') : empty;
}

function renderDetail(digests) {
  const target = document.querySelector('[data-detail]');
  const id = new URLSearchParams(window.location.search).get('id');
  const digest = digests.find((item) => item.id === id);
  if (!target || !digest) return;
  target.hidden = false;
  document.querySelector('.page-intro')?.setAttribute('hidden', '');
  document.querySelector('.library-controls')?.setAttribute('hidden', '');
  document.querySelector('[data-digest-list]')?.setAttribute('hidden', '');
  target.innerHTML = `<div class="detail-kicker"><span>${esc(digest.topic)}</span><time datetime="${esc(digest.date)}">${esc(digest.date)}</time><span class="demo-label">PUBLIC SAMPLE</span></div><h1><span data-en>${esc(digest.title)}</span><span data-zh>${esc(digest.titleZh)}</span></h1><p class="detail-dek"><span data-en>${esc(digest.question)}</span><span data-zh>${esc(digest.questionZh)}</span></p><div class="detail-source"><span>Source</span><a href="${esc(digest.source)}" target="_blank" rel="noreferrer">${esc(digest.sourceLabel)} -></a></div><div class="detail-grid"><section><p class="eyebrow">RESEARCH QUESTION</p><h2><span data-en>${esc(digest.question)}</span><span data-zh>${esc(digest.questionZh)}</span></h2></section><section><p class="eyebrow">METHOD</p><p><span data-en>${esc(digest.method)}</span><span data-zh>${esc(digest.methodZh)}</span></p></section><section class="detail-wide"><p class="eyebrow">KEY FINDING</p><p class="finding-text"><span data-en>${esc(digest.finding)}</span><span data-zh>${esc(digest.findingZh)}</span></p></section><section class="detail-wide limitation"><p class="eyebrow">LIMITATION</p><p><span data-en>${esc(digest.limitation)}</span><span data-zh>${esc(digest.limitationZh)}</span></p></section></div><div class="bilingual-block"><div><p class="eyebrow">BILINGUAL REVIEW</p><h2>${esc(digest.titleZh)}</h2></div><div><p class="eyebrow">中文摘要</p><p>${esc(digest.findingZh)}</p></div><div><p class="eyebrow">边界</p><p>${esc(digest.limitationZh)}</p></div></div>`;
  document.title = `${digest.title} | AI Research Digest`;
}

function setupControls(digests) {
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item.dataset.filter === state.filter));
    renderLibrary(digests);
  }));
  document.querySelectorAll('[data-search]').forEach((input) => input.addEventListener('input', () => {
    state.query = input.value.trim().toLowerCase();
    renderLibrary(digests);
  }));
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

fetch('data/digests.json').then((response) => response.json()).then((digests) => {
  renderLibrary(digests);
  renderDetail(digests);
  setupControls(digests);
}).catch(() => {
  const target = document.querySelector('[data-digest-grid], [data-digest-list], [data-detail]');
  if (target) target.innerHTML = '<p class="empty-state">The local sample data could not be loaded. Run the preview command from the repository root.</p>';
});
setupLanguage();
