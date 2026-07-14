// Masri "Language History" page — shared by masri_language_history.html (EN)
// and masri_language_history_ar.html (AR). Which language's data fields to
// use is decided by window.MASRI_LANG, set inline by each page before this
// file loads. Mirrors the pattern used by prior-attempts.js.
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  const STRINGS = {
    en: {
      col_era: 'Era', col_popular: 'Popular / vernacular', col_official: 'Official / administrative',
      col_prestige: 'Prestige / literary', col_script: 'Script(s)',
      verdict_label: "Masri's take",
      data_error: 'Could not load the history data. Please check your connection and reload.',
      data_error_file: "This page was opened directly as a file (the address bar starts with file://), so the browser blocks it from loading its data files — that's a browser security rule, not a bug in the page. Fix: serve this folder instead of double-clicking the file. Easiest way — open a terminal in this folder and run: python3 -m http.server — then visit http://localhost:8000/ in your browser. Or upload the whole folder to a static host like GitHub Pages."
    },
    ar: {
      col_era: 'العصر', col_popular: 'شعبي / عامي', col_official: 'رسمي / إداري',
      col_prestige: 'مكانة / أدبي', col_script: 'الخط (الخطوط)',
      verdict_label: 'رأي مصري',
      data_error: 'مقدرناش نحمّل بيانات الصفحة دي. اتأكد من الاتصال وحدّث الصفحة.',
      data_error_file: "الصفحة دي اتفتحت كملف مباشرة (الرابط بيبدأ بـ file://)، فالمتصفح بيمنعها من تحميل ملفات البيانات — ده قانون أمان في المتصفح، مش مشكلة في الصفحة نفسها. الحل: شغّل الفولدر ده على سيرفر محلي بدل ما تفتح الملف بدبل كليك. أسهل طريقة — افتح Terminal في الفولدر ده واكتب: python3 -m http.server — بعدين افتح http://localhost:8000/ في المتصفح. أو ارفع الفولدر كله على استضافة زي GitHub Pages."
    }
  };
  function t(key) { return STRINGS[LANG][key]; }
  function dataErrorMsg() { return (location.protocol === 'file:') ? t('data_error_file') : t('data_error'); }

  function renderTimeline(DATA) {
    const el = document.getElementById('timelineSection');
    let html = '';
    for (const a of DATA.attempts) {
      const eraLabel = LANG === 'ar' ? a.era_label_ar : a.era_label_en;
      const title = LANG === 'ar' ? a.title_ar : a.title_en;
      const body = LANG === 'ar' ? a.body_ar : a.body_en;
      const verdict = LANG === 'ar' ? a.verdict_ar : a.verdict_en;
      const color = DATA.era_colors[a.era];
      html += `<div class="ha-card">
        <div class="ha-card-head">
          <span class="ha-era-tag" style="color:${color};border-color:${color};">${eraLabel}</span>
          <span class="ha-year">${a.year}</span>
        </div>
        <h3>${title}</h3>
        <p>${body}</p>
        <div class="ha-verdict"><span class="ha-verdict-label">${t('verdict_label')}</span>${verdict}</div>
      </div>`;
    }
    el.innerHTML = html;
  }

  function renderSummaryTable(DATA) {
    let html = `<thead><tr>
      <th>${t('col_era')}</th><th>${t('col_popular')}</th><th>${t('col_official')}</th><th>${t('col_prestige')}</th><th>${t('col_script')}</th>
    </tr></thead><tbody>`;
    for (const r of DATA.rows) {
      const era = LANG === 'ar' ? r.era_ar : r.era_en;
      const popular = LANG === 'ar' ? r.popular_ar : r.popular_en;
      const official = LANG === 'ar' ? r.official_ar : r.official_en;
      const prestige = LANG === 'ar' ? r.prestige_ar : r.prestige_en;
      const script = LANG === 'ar' ? r.script_ar : r.script_en;
      const isModern = /Contemporary|المعاصرة/.test(era);
      html += `<tr class="${isModern ? 'ha-masri-row' : ''}">
        <td>${era}</td><td>${popular}</td><td>${official}</td><td>${prestige}</td><td>${script}</td>
      </tr>`;
    }
    html += '</tbody>';
    document.getElementById('summaryTable').innerHTML = html;
  }

  function renderSources(DATA) {
    const el = document.getElementById('sourcesList');
    el.innerHTML = DATA.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>`).join('');
  }

  fetch('assets/data/language-history.json')
    .then(r => r.json())
    .then(DATA => {
      renderTimeline(DATA);
      renderSummaryTable(DATA);
      renderSources(DATA);
    })
    .catch(err => {
      console.error('Failed to load Masri language history data', err);
      const el = document.getElementById('timelineSection');
      if (el) el.innerHTML = `<p class="sub-small">${dataErrorMsg()}</p>`;
    });
})();
