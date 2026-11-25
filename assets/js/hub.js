import { PORTFOLIO_DEMOS } from './demos-data.js';

const wallEl = document.getElementById('demo-wall');
const filterBtns = document.querySelectorAll('[data-filter]');
const overlay = document.getElementById('preview-overlay');
const previewFrame = document.getElementById('preview-frame');
const previewTitle = document.getElementById('preview-title');
const previewOpenNew = document.getElementById('preview-open-new');
const previewClose = document.getElementById('preview-close');
const previewStage = document.getElementById('preview-stage');
const viewportBtns = document.querySelectorAll('[data-viewport-btn]');

let activeFilter = 'all';
let lastFocused = null;

function renderDemos() {
  if (!wallEl) return;
  wallEl.innerHTML = '';

  const filtered = PORTFOLIO_DEMOS.filter(
    (demo) => activeFilter === 'all' || demo.category === activeFilter
  );

  filtered.forEach((demo, idx) => {
    const article = document.createElement('article');
    article.className = 'demo-piece';
    article.dataset.slot = String(idx % 4);

    const swatchesHtml = demo.palette
      .map((hex) => `<span class="swatch" style="background:${hex}" title="${hex}"></span>`)
      .join('');

    article.innerHTML = `
      <div class="demo-media shutter" data-reveal style="aspect-ratio: ${demo.aspect}" data-open-id="${demo.id}" role="button" tabindex="0" aria-label="Xem bản demo ${demo.title}">
        <img src="${demo.image}" alt="${demo.alt}" width="1600" height="1000" loading="lazy" class="cover" />
      </div>
      <div class="demo-meta">
        <h3 class="demo-title">${demo.title}</h3>
        <span class="demo-style">${demo.category} · ${demo.style}</span>
      </div>
      <p class="demo-summary">${demo.summary}</p>
      <div class="demo-actions">
        <button type="button" class="button" data-open-id="${demo.id}">Xem trực tiếp</button>
        <a href="${demo.url}" class="link small" target="_blank" rel="noopener">Mở toàn trang</a>
        <div class="demo-swatches" aria-label="Bảng màu mẫu">${swatchesHtml}</div>
      </div>
    `;

    wallEl.appendChild(article);
  });

  // Re-observe newly rendered elements
  document.querySelectorAll('.demo-wall [data-reveal]').forEach((el) => {
    requestAnimationFrame(() => el.classList.add('is-in'));
  });
}

function openPreview(demoId) {
  const demo = PORTFOLIO_DEMOS.find((d) => d.id === demoId);
  if (!demo || !overlay || !previewFrame) return;

  lastFocused = document.activeElement;
  previewTitle.textContent = `${demo.title} — ${demo.style}`;
  previewOpenNew.href = demo.url;
  previewFrame.src = demo.url;
  setViewport('desktop');

  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  previewClose.focus();
}

function closePreview() {
  if (!overlay || !previewFrame) return;
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  previewFrame.src = 'about:blank';
  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
}

function setViewport(mode) {
  if (!previewStage) return;
  previewStage.dataset.viewport = mode;
  previewStage.classList.toggle('is-framed', mode !== 'desktop');
  viewportBtns.forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.dataset.viewportBtn === mode ? 'true' : 'false');
  });
}

// Event listeners
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    filterBtns.forEach((b) =>
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false')
    );
    renderDemos();
  });
});

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-open-id]');
  if (trigger) {
    openPreview(trigger.dataset.openId);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay?.getAttribute('aria-hidden') === 'false') {
    closePreview();
  }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.demo-media[data-open-id]')) {
    e.preventDefault();
    openPreview(e.target.dataset.openId);
  }
});

previewClose?.addEventListener('click', closePreview);

viewportBtns.forEach((btn) => {
  btn.addEventListener('click', () => setViewport(btn.dataset.viewportBtn));
});

// Hero slow crossfade between demo prints
function initHeroCrossfade() {
  const slides = document.querySelectorAll('.hero-print-large img');
  if (slides.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let index = 0;
  setInterval(() => {
    if (document.hidden) return;
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, 5500);
}

renderDemos();
initHeroCrossfade();
