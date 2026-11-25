import { initReveal } from './reveal.js';

initReveal();

// Case Study Modal controller
export function initCaseModal(casesMap) {
  let modal = document.getElementById('case-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'case-modal';
    modal.className = 'case-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', 'case-modal-title');
    modal.innerHTML = `
      <div class="case-dialog">
        <div class="case-dialog-head">
          <div>
            <span id="case-modal-meta" class="small muted"></span>
            <h3 id="case-modal-title"></h3>
          </div>
          <button type="button" class="case-close" id="case-modal-close">Đóng</button>
        </div>
        <img id="case-modal-img" class="case-dialog-img" src="" alt="" />
        <div class="case-sections">
          <div class="case-block">
            <h4>Bối cảnh &amp; Thách thức</h4>
            <p id="case-modal-problem"></p>
          </div>
          <div class="case-block">
            <h4>Giải pháp triển khai</h4>
            <p id="case-modal-solution"></p>
          </div>
          <div class="case-block">
            <h4>Kết quả đạt được</h4>
            <p id="case-modal-result"></p>
          </div>
          <div class="case-block">
            <h4>Hạng mục bàn giao</h4>
            <div id="case-modal-tags" class="case-deliverables"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeBtn = document.getElementById('case-modal-close');
  let lastTrigger = null;

  function open(id) {
    const item = casesMap[id];
    if (!item) return;
    lastTrigger = document.activeElement;
    document.getElementById('case-modal-meta').textContent = item.meta;
    document.getElementById('case-modal-title').textContent = item.title;
    const imgEl = document.getElementById('case-modal-img');
    imgEl.src = item.image;
    imgEl.alt = item.title;
    document.getElementById('case-modal-problem').textContent = item.problem;
    document.getElementById('case-modal-solution').textContent = item.solution;
    document.getElementById('case-modal-result').textContent = item.result;
    document.getElementById('case-modal-tags').innerHTML = (item.tags || [])
      .map((t) => `<span class="case-tag">${t}</span>`)
      .join('');

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-case-id]');
    if (trigger) {
      open(trigger.dataset.caseId);
    } else if (e.target === modal || e.target === closeBtn) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      close();
    }
  });
}

// Contact form demo handler
export function initDemoForms() {
  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    const statusEl = form.querySelector('.form-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (statusEl) {
        statusEl.textContent = 'Đã ghi nhận yêu cầu mẫu. Trong bản triển khai thật, thông tin sẽ gửi về email hoặc CRM của bạn.';
      }
      form.reset();
    });
  });
}

initDemoForms();
