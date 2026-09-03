// Masri site-wide "list of pages" nav component — used by every page.
// Renders a dropdown of all site pages (in the current page's language,
// current page excluded) from a single shared data file, so adding a new
// page to the site only ever means editing assets/data/pages.json once.
// Which language's fields to use is decided by window.MASRI_LANG, set
// inline by each page before this file loads (same convention as the
// page-specific data-driven scripts).
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  const STRINGS = {
    en: { toggle: 'All pages', data_error: 'Could not load the page list.' },
    ar: { toggle: 'كل الصفحات', data_error: 'مقدرناش نحمّل قائمة الصفحات.' }
  };

  function currentFile() {
    const parts = location.pathname.split('/');
    return parts[parts.length - 1] || 'arabizi_to_masri_viral.html';
  }

  function renderMenu(pages) {
    const menu = document.getElementById('siteNavMenu');
    if (!menu) return;
    const file = currentFile();
    let html = '';
    for (const p of pages) {
      const entry = p[LANG];
      if (!entry) continue;
      const isCurrent = entry.url === file;
      html += `<a class="site-nav-item${isCurrent ? ' current' : ''}" href="${entry.url}" role="menuitem"${isCurrent ? ' aria-current="page"' : ''}>${entry.title}</a>`;
    }
    menu.innerHTML = html;
  }

  function setupToggle() {
    const btn = document.getElementById('siteNavToggle');
    const wrap = document.getElementById('siteNav');
    if (!btn || !wrap) return;
    const label = btn.querySelector('span');
    if (label) label.textContent = STRINGS[LANG].toggle;

    function close() {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function init() {
    setupToggle();
    fetch('assets/data/pages.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(DATA => renderMenu(DATA.pages))
      .catch(err => {
        console.error('Failed to load Masri page list', err);
        const menu = document.getElementById('siteNavMenu');
        if (menu) menu.innerHTML = `<p class="site-nav-error">${STRINGS[LANG].data_error}</p>`;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
