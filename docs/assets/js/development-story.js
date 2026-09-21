// Masri "Development Story" page — shared by masri_development_story.html (EN)
// and masri_development_story_ar.html (AR). Which language's data fields to
// use is decided by window.MASRI_LANG, set inline by each page before this
// file loads. Mirrors the pattern used by prior-attempts.js / language-history.js.
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  const STRINGS = {
    en: {
      data_error: 'Could not load the story data. Please check your connection and reload.',
      data_error_file: "This page was opened directly as a file (the address bar starts with file://), so the browser blocks it from loading its data files — that's a browser security rule, not a bug in the page. Fix: serve this folder instead of double-clicking the file. Easiest way — open a terminal in this folder and run: python3 -m http.server — then visit http://localhost:8000/ in your browser. Or upload the whole folder to a static host like GitHub Pages."
    },
    ar: {
      data_error: 'مقدرناش نحمّل بيانات الصفحة دي. اتأكد من الاتصال وحدّث الصفحة.',
      data_error_file: "الصفحة دي اتفتحت كملف مباشرة (الرابط بيبدأ بـ file://)، فالمتصفح بيمنعها من تحميل ملفات البيانات — ده قانون أمان في المتصفح، مش مشكلة في الصفحة نفسها. الحل: شغّل الفولدر ده على سيرفر محلي بدل ما تفتح الملف بدبل كليك. أسهل طريقة — افتح Terminal في الفولدر ده واكتب: python3 -m http.server — بعدين افتح http://localhost:8000/ في المتصفح. أو ارفع الفولدر كله على استضافة زي GitHub Pages."
    }
  };
  function dataErrorMsg() { return (location.protocol === 'file:') ? STRINGS[LANG].data_error_file : STRINGS[LANG].data_error; }

  function renderImage(img) {
    if (!img) return '';
    const alt = LANG === 'ar' ? img.alt_ar : img.alt_en;
    const caption = LANG === 'ar' ? img.caption_ar : img.caption_en;
    return `<figure class="ha-card-figure wide">
      <a href="${img.src}" target="_blank" rel="noopener">
        <img src="${img.src}" alt="${alt.replace(/"/g, '&quot;')}" loading="lazy">
      </a>
      <figcaption>${caption}</figcaption>
    </figure>`;
  }

  function renderSample(sc) {
    if (!sc) return '';
    const note = LANG === 'ar' ? sc.note_ar : sc.note_en;
    const masriLabel = LANG === 'ar' ? sc.masri_label_ar : sc.masri_label_en;
    const arabicLabel = LANG === 'ar' ? sc.arabic_label_ar : sc.arabic_label_en;
    return `<div class="ha-sample-compare">
      <p class="sub-small ha-sample-note">${note}</p>
      <div class="ha-sample-row">
        <span class="ha-sample-tag ha-sample-tag-masri">${masriLabel}</span>
        <span class="ha-sample-text">${sc.masri_line}</span>
      </div>
      <div class="ha-sample-row">
        <span class="ha-sample-tag">${arabicLabel}</span>
        <span class="ha-sample-text">${sc.arabic_line}</span>
      </div>
    </div>`;
  }

  function renderMilestones(DATA) {
    const el = document.getElementById('storyTimeline');
    if (!el) return;
    let html = '';
    for (const m of DATA.milestones) {
      const dateLabel = LANG === 'ar' ? m.date_label_ar : m.date_label_en;
      const title = LANG === 'ar' ? m.title_ar : m.title_en;
      const body = LANG === 'ar' ? m.body_ar : m.body_en;
      html += `<div class="ha-card">
        <div class="ha-card-head">
          <span class="ha-year">${dateLabel}</span>
        </div>
        <h3>${title}</h3>
        <p>${body}</p>
        ${renderSample(m.sample)}
        ${renderImage(m.image)}
      </div>`;
    }
    el.innerHTML = html;
  }

  fetch('assets/data/development-story.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(DATA => renderMilestones(DATA))
    .catch(err => {
      console.error('Failed to load Masri development-story data', err);
      const el = document.getElementById('storyTimeline');
      if (el) el.innerHTML = `<p class="sub-small">${dataErrorMsg()}</p>`;
    });
})();
