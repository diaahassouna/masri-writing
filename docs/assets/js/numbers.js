// Masri Numbers page — shared by masri_numbers.html (EN) and
// masri_numbers_ar.html (AR). Which language's data fields to use is
// decided by window.MASRI_LANG, set inline by each page before this file
// loads. Static chrome text is baked into each page's HTML directly; this
// file only handles the data-driven parts (key symbols legend, section
// tables, search).
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  const STRINGS = {
    en: {
      col_number: '#', col_masri: 'Masri (Tier 2)', col_arabic: 'Arabic',
      no_match: 'No numbers match that search.',
      data_error: 'Could not load the numbers data. Please check your connection and reload.',
      data_error_file: "This page was opened directly as a file (the address bar starts with file://), so the browser blocks it from loading its data files — that's a browser security rule, not a bug in the page. Fix: serve this folder instead of double-clicking the file. Easiest way — open a terminal in this folder and run: python3 -m http.server — then visit http://localhost:8000/ in your browser. Or upload the whole folder to a static host like GitHub Pages."
    },
    ar: {
      col_number: '#', col_masri: 'مصري (Tier 2)', col_arabic: 'عربي',
      no_match: 'مفيش أرقام مطابقة للبحث ده.',
      data_error: 'مقدرناش نحمّل بيانات الأرقام. اتأكد من الاتصال وحدّث الصفحة.',
      data_error_file: "الصفحة دي اتفتحت كملف مباشرة (الرابط بيبدأ بـ file://)، فالمتصفح بيمنعها من تحميل ملفات البيانات — ده قانون أمان في المتصفح، مش مشكلة في الصفحة نفسها. الحل: شغّل الفولدر ده على سيرفر محلي بدل ما تفتح الملف بدبل كليك. أسهل طريقة — افتح Terminal في الفولدر ده واكتب: python3 -m http.server — بعدين افتح http://localhost:8000/ في المتصفح. أو ارفع الفولدر كله على استضافة زي GitHub Pages."
    }
  };
  function t(key) { return STRINGS[LANG][key]; }
  function dataErrorMsg() { return (location.protocol === 'file:') ? t('data_error_file') : t('data_error'); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  fetch('assets/data/numbers.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(DATA => {
      // ---------------------------------------------------------------
      // Key symbols legend
      // ---------------------------------------------------------------
      const keyEl = document.getElementById('numKeyLegend');
      if (keyEl) {
        keyEl.innerHTML = DATA.key_symbols.map(k => {
          const note = LANG === 'ar' ? k.note_ar : k.note_en;
          return `<span class="num-key-item"><span class="glyph">${escapeHtml(k.symbol)}</span> = <span class="arabic">${escapeHtml(k.arabic)}</span>${note ? ' <span>(' + escapeHtml(note) + ')</span>' : ''}</span>`;
        }).join('');
      }

      // ---------------------------------------------------------------
      // Sections
      // ---------------------------------------------------------------
      const container = document.getElementById('numSections');
      const emptyState = document.getElementById('numEmpty');

      function sectionHtml(sec, openByDefault) {
        const title = LANG === 'ar' ? sec.title_ar : sec.title_en;
        const rowsHtml = sec.rows.map(r => `
          <tr class="num-row" data-search="${escapeHtml((r.n_display + ' ' + r.masri + ' ' + r.arabic).toLowerCase())}">
            <td>${escapeHtml(r.n_display)}</td>
            <td class="num-masri">${escapeHtml(r.masri)}</td>
            <td class="num-arabic">${escapeHtml(r.arabic)}</td>
          </tr>`).join('');
        return `<details class="num-section" data-section-id="${sec.id}"${openByDefault ? ' open' : ''}>
          <summary><span>${escapeHtml(title)}</span><span class="num-section-count">${sec.rows.length}</span></summary>
          <div class="num-table-wrap">
            <table class="num-table">
              <thead><tr><th>${t('col_number')}</th><th>${t('col_masri')}</th><th>${t('col_arabic')}</th></tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </details>`;
      }

      // Open the first two ranges (0–10, 11–20) by default; everything
      // else starts collapsed since there are 139 rows total.
      container.innerHTML = DATA.sections.map((sec, i) => sectionHtml(sec, i < 2)).join('');

      // ---------------------------------------------------------------
      // Search — filters rows across all sections, auto-expanding any
      // section with a match and collapsing back to the default view
      // when the search box is cleared.
      // ---------------------------------------------------------------
      const searchBox = document.getElementById('numSearch');
      const allSections = () => container.querySelectorAll('.num-section');
      const allRows = () => container.querySelectorAll('.num-row');

      function applySearch() {
        const q = searchBox.value.trim().toLowerCase();
        let anyMatch = false;
        if (!q) {
          allRows().forEach(row => { row.hidden = false; });
          allSections().forEach((sec, i) => { sec.open = i < 2; sec.hidden = false; });
          emptyState.hidden = true;
          return;
        }
        allSections().forEach(sec => {
          let sectionHasMatch = false;
          sec.querySelectorAll('.num-row').forEach(row => {
            const match = row.dataset.search.includes(q);
            row.hidden = !match;
            if (match) sectionHasMatch = true;
          });
          sec.hidden = !sectionHasMatch;
          sec.open = sectionHasMatch;
          if (sectionHasMatch) anyMatch = true;
        });
        emptyState.hidden = anyMatch;
      }
      if (searchBox) searchBox.addEventListener('input', applySearch);
    })
    .catch(err => {
      console.error('Failed to load Masri numbers data', err);
      const el = document.getElementById('numSections');
      if (el) el.innerHTML = `<p class="data-error">${dataErrorMsg()}</p>`;
    });
})();
