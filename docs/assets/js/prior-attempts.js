// Masri "Prior Attempts" (history) page — shared by masri_prior_attempts.html
// (EN) and masri_prior_attempts_ar.html (AR). Which language's data fields
// to use is decided by window.MASRI_LANG, set inline by each page before
// this file loads.
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  // Small set of runtime-only strings used inside JS-rendered markup
  // (table headers, the "Masri's take" label). All other chrome text is
  // baked directly into the page's HTML.
  const STRINGS = {
    en: {
      col_attempt: 'Attempt', col_typable: 'Typable anywhere', col_reads: 'Reads naturally',
      col_cairene: 'Captures Cairene sounds', col_identity: 'Carries identity', col_adopted: 'Actually caught on',
      verdict_label: "Masri's take",
      data_error: 'Could not load the history data. Please check your connection and reload.',
      data_error_file: "This page was opened directly as a file (the address bar starts with file://), so the browser blocks it from loading its data files — that's a browser security rule, not a bug in the page. Fix: serve this folder instead of double-clicking the file. Easiest way — open a terminal in this folder and run: python3 -m http.server — then visit http://localhost:8000/ in your browser. Or upload the whole folder to a static host like GitHub Pages."
    },
    ar: {
      col_attempt: 'المحاولة', col_typable: 'تتكتب بسهولة؟', col_reads: 'تتقرا طبيعي؟',
      col_cairene: 'بتاخد صوت القاهرة؟', col_identity: 'ليها هوية؟', col_adopted: 'اتستخدمت فعلاً؟',
      verdict_label: 'رأي مصري',
      data_error: 'مقدرناش نحمّل بيانات الصفحة دي. اتأكد من الاتصال وحدّث الصفحة.',
      data_error_file: "الصفحة دي اتفتحت كملف مباشرة (الرابط بيبدأ بـ file://)، فالمتصفح بيمنعها من تحميل ملفات البيانات — ده قانون أمان في المتصفح، مش مشكلة في الصفحة نفسها. الحل: شغّل الفولدر ده على سيرفر محلي بدل ما تفتح الملف بدبل كليك. أسهل طريقة — افتح Terminal في الفولدر ده واكتب: python3 -m http.server — بعدين افتح http://localhost:8000/ في المتصفح. أو ارفع الفولدر كله على استضافة زي GitHub Pages."
    }
  };
  function t(key) { return STRINGS[LANG][key]; }
  function dataErrorMsg() { return (location.protocol === 'file:') ? t('data_error_file') : t('data_error'); }

  const SCORE_SYMBOL = {
    yes: '<span class="score-yes">✓</span>',
    no: '<span class="score-no">✗</span>',
    partial: '<span class="score-partial">~</span>'
  };

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

  function renderScoreTable(DATA) {
    let html = `<thead><tr>
      <th>${t('col_attempt')}</th><th>${t('col_typable')}</th><th>${t('col_reads')}</th><th>${t('col_cairene')}</th><th>${t('col_identity')}</th><th>${t('col_adopted')}</th>
    </tr></thead><tbody>`;
    for (const s of DATA.scores) {
      const name = LANG === 'ar' ? s.name_ar : s.name_en;
      html += `<tr class="${s.masri ? 'ha-masri-row' : ''}">
        <td>${name}</td>
        <td>${SCORE_SYMBOL[s.typable]}</td>
        <td>${SCORE_SYMBOL[s.reads]}</td>
        <td>${SCORE_SYMBOL[s.cairene]}</td>
        <td>${SCORE_SYMBOL[s.identity]}</td>
        <td>${SCORE_SYMBOL[s.adopted]}</td>
      </tr>`;
    }
    html += '</tbody>';
    document.getElementById('scoreTable').innerHTML = html;
  }

  function renderSources(DATA) {
    const el = document.getElementById('sourcesList');
    el.innerHTML = DATA.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>`).join('');
  }

  fetch('assets/data/prior-attempts.json')
    .then(r => r.json())
    .then(DATA => {
      renderTimeline(DATA);
      renderScoreTable(DATA);
      renderSources(DATA);
    })
    .catch(err => {
      console.error('Failed to load Masri history data', err);
      const el = document.getElementById('timelineSection');
      if (el) el.innerHTML = `<p class="sub-small">${dataErrorMsg()}</p>`;
    });
})();
