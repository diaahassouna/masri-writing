// DTS (Diaa Transliteration System for Modern Egyptian) page.
//
// DTS is NOT an independently authored letter list — it is Masri Tier 2's
// own alphabet (assets/data/alphabet.json, the same file the Masri
// Alphabet page uses) with a small override applied only to the letters
// that aren't on a standard keyboard (Coptic/Greek glyphs, plus the
// turned-A hamza). Every other letter is rendered exactly as Masri Tier 2
// defines it. This keeps DTS permanently in sync: any future edit to
// Masri Tier 2's alphabet flows through automatically, and only
// assets/data/dts.json's small "overrides" map needs to change if a new
// non-keyboard letter is ever added to Masri.
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  const STRINGS = {
    en: {
      no_match: 'No letters match that search.',
      data_error: 'Could not load the DTS data. Please check your connection and reload.',
      data_error_file: "This page was opened directly as a file (the address bar starts with file://), so the browser blocks it from loading its data files — that's a browser security rule, not a bug in the page. Fix: serve this folder instead of double-clicking the file. Easiest way — open a terminal in this folder and run: python3 -m http.server — then visit http://localhost:8000/ in your browser. Or upload the whole folder to a static host like GitHub Pages.",
      col_symbol: 'Symbol', col_sound: 'Sound', col_dts: 'DTS', all: 'All',
      masri_label: 'Masri Tier 2:'
    },
    ar: {
      no_match: 'مفيش حروف مطابقة للبحث ده.',
      data_error: 'مقدرناش نحمّل بيانات DTS. اتأكد من الاتصال وحدّث الصفحة.',
      data_error_file: "الصفحة دي اتفتحت كملف مباشرة، فالمتصفح بيمنعها من تحميل ملفات البيانات. شغّل الفولدر على سيرفر محلي (python3 -m http.server) أو ارفعه على استضافة زي GitHub Pages.",
      col_symbol: 'الرمز', col_sound: 'الصوت', col_dts: 'DTS', all: 'الكل',
      masri_label: 'مصري Tier 2:'
    }
  };
  function t(key) { return STRINGS[LANG][key]; }
  function dataErrorMsg() { return (location.protocol === 'file:') ? t('data_error_file') : t('data_error'); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // Local AR translations for the Tier 2 spelling rules (tier2-rules.json
  // only carries English text — same pattern viral.js uses for its
  // Framework panel). Keep this in sync with SPELLING_RULES_AR in viral.js.
  const RULES_AR = {
    1: { name: 'التشديد (الحروف المضاعفة والحركات الطويلة المضاعفة)', rule: "الحروف المشدّدة بتتكتب مرتين. الحركات الطويلة المتكررة بتتكتب مرتين أو مرة واحدة مع علامة المد (a → aa، ā)." },
    2: { name: 'أل التعريف', rule: "دايمًا بتتكتب 'el' مهما كان الحرف اللي بعدها (شمسي أو قمري) في النطق. الثبات في الكتابة أهم من نقل النطق بالظبط، عشان يبقى أسهل على اللي بيكتب." },
    3: { name: 'الهمزة (وقفة الحنجرة)', rule: "بتتكتب بس في نص الكلمة أو آخرها، باستخدام Ɐ في Tier 2 (أو علامة ' في Tier 1). الهمزة في أول الكلمة — سواء همزة أصلية أو قاف قاهرية — بتفضل ساكنة ومش بتتكتب." },
    4: { name: 'تكامل الحروف المركّبة', rule: 'بتتطبق بس على Tier 1 (sh/kh/gh كوحدة من حرفين مش بتتفصل). في Tier 2 دول بقوا حرف واحد (ϣ, x, ɣ) فالقاعدة دي مش لازمة.', tier2_note: 'اتلغت بسبب الدمج في حرف واحد: sh→ϣ, kh→x, gh→ɣ' },
    5: { name: 'دمج القاف القاهرية والهمزة', rule: 'حرف Ɐ بيمثّل صوت الهمزة أيًا كان أصله. القاف القاهرية والهمزة بيتعاملوا كصوت واحد (وقفة حنجرية) لأنهم بينطقوا نفس الصوت في اللهجة القاهرية؛ حرف q بيتحفظله للنطق الرسمي/الفصحى.' },
    6: { name: 'حرفي P و V', rule: 'P و V حروف مستقلة وكاملة، مش بديل عن B أو F. حرف p بيستخدم غالبًا في الكلمات المستعارة/الحديثة؛ وحرف v صوت أصلي موجود جنبهم.' }
  };

  const grid = document.getElementById('dtsGrid');
  const chips = document.getElementById('dtsFilterChips');
  const searchBox = document.getElementById('dtsSearch');
  const emptyState = document.getElementById('dtsEmpty');
  let activeCategory = 'all';

  // Build a DTS-rendering record for one Masri Tier 2 letter, applying the
  // override only if this letter isn't keyboard-typable.
  function toDtsLetter(l, overrides) {
    const ov = overrides[l.letter_upper];
    const dtsUpper = ov ? ov.dts_upper : l.letter_upper;
    const dtsLower = ov ? ov.dts_lower : l.letter_lower;

    let category;
    if (ov) category = 'substitute';
    else if (l.origin === 'Borrowed') category = 'borrowed';
    else if (l.origin === 'Vowel/semivowel') category = 'vowel';
    else category = 'core';

    let note;
    if (ov) {
      note = LANG === 'ar' ? ov.note_ar : ov.note_en;
    } else {
      note = LANG === 'ar' ? l.notes_ar : l.notes;
    }

    return {
      dtsUpper, dtsLower, category, note,
      arabic: l.arabic,
      masriUpper: l.letter_upper,
      masriLower: l.letter_lower,
      isSubstitute: !!ov
    };
  }

  function letterCard(d) {
    const noteHtml = d.note ? `<div class="dts-note">${escapeHtml(d.note)}</div>` : '';
    const masriHtml = d.isSubstitute
      ? `<div class="dts-masri-ref">${escapeHtml(t('masri_label'))} <span class="dts-masri-glyph">${escapeHtml(d.masriUpper)}</span></div>`
      : '';
    const searchBlob = [d.dtsLower, d.dtsUpper, d.arabic, d.masriUpper, d.note || ''].join(' ').toLowerCase();
    return `<div class="dts-card" data-category="${d.category}" data-search="${escapeHtml(searchBlob)}">
      <div class="dts-case-row">
        <span class="dts-glyph dts-upper">${escapeHtml(d.dtsUpper)}</span>
        <span class="dts-glyph dts-lower">${escapeHtml(d.dtsLower)}</span>
      </div>
      <div class="dts-arabic">${escapeHtml(d.arabic)}</div>
      ${masriHtml}
      ${noteHtml}
    </div>`;
  }

  function applyFilters() {
    const q = searchBox ? searchBox.value.trim().toLowerCase() : '';
    let anyMatch = false;
    grid.querySelectorAll('.dts-card').forEach(card => {
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesSearch = !q || card.dataset.search.includes(q);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) anyMatch = true;
    });
    if (emptyState) emptyState.hidden = anyMatch;
  }

  Promise.all([
    fetch('assets/data/dts.json', { cache: 'no-store' }).then(r => r.json()),
    fetch('assets/data/alphabet.json', { cache: 'no-store' }).then(r => r.json()),
    fetch('assets/data/tier2-rules.json', { cache: 'no-store' }).then(r => r.json()).catch(() => null)
  ])
    .then(([DTS, ALPHA, RULES]) => {
      const dtsLetters = ALPHA.alphabet.map(l => toDtsLetter(l, DTS.overrides));

      // ---------------------------------------------------------------
      // Category filter chips
      // ---------------------------------------------------------------
      if (chips) {
        const catsHtml = DTS.categories.map(c => {
          const label = LANG === 'ar' ? c.label_ar : c.label_en;
          const count = dtsLetters.filter(d => d.category === c.id).length;
          return `<button class="chip" data-cat="${c.id}"><span>${escapeHtml(label)}</span> <span class="chip-count">${count}</span></button>`;
        }).join('');
        chips.innerHTML = `<button class="chip active" data-cat="all"><span>${escapeHtml(t('all'))}</span> <span class="chip-count">${dtsLetters.length}</span></button>${catsHtml}`;
        chips.querySelectorAll('.chip').forEach(chip => {
          chip.addEventListener('click', () => {
            chips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCategory = chip.dataset.cat;
            applyFilters();
          });
        });
      }

      // ---------------------------------------------------------------
      // Letters grid
      // ---------------------------------------------------------------
      if (grid) grid.innerHTML = dtsLetters.map(letterCard).join('');
      if (searchBox) searchBox.addEventListener('input', applyFilters);

      // ---------------------------------------------------------------
      // Vowels — reused live from alphabet.json's vowel_system (same
      // source the Masri Alphabet page renders from).
      // ---------------------------------------------------------------
      if (ALPHA.vowel_system) {
        const vs = ALPHA.vowel_system;
        const rowsHtml = (rows, cols) => rows.map(v => `<tr>${cols.map(c => `<td>${escapeHtml(v[c])}</td>`).join('')}</tr>`).join('');

        const shortEl = document.getElementById('dtsShortVowelTable');
        if (shortEl) shortEl.innerHTML = `<thead><tr><th>${t('col_symbol')}</th><th>${t('col_sound')}</th><th>${t('col_dts')}</th></tr></thead><tbody>${rowsHtml(vs.short_vowels, ['arabic', LANG === 'ar' ? 'sound_ar' : 'sound', 'tier2'])}</tbody>`;

        const longEl = document.getElementById('dtsLongVowelTable');
        if (longEl) longEl.innerHTML = `<thead><tr><th>${t('col_symbol')}</th><th>${t('col_sound')}</th><th>${t('col_dts')}</th></tr></thead><tbody>${rowsHtml(vs.long_vowels, ['arabic', LANG === 'ar' ? 'sound_ar' : 'sound', 'tier2'])}</tbody>`;

        const diphEl = document.getElementById('dtsDiphthongTable');
        if (diphEl) diphEl.innerHTML = `<thead><tr><th>${t('col_symbol')}</th><th>${t('col_sound')}</th><th>${t('col_dts')}</th></tr></thead><tbody>${rowsHtml(vs.diphthongs, ['arabic', LANG === 'ar' ? 'sound_ar' : 'sound', 'spelling'])}</tbody>`;
      }

      // ---------------------------------------------------------------
      // Tier 2 spelling rules — reused live, in full, from
      // tier2-rules.json's spelling_rules array, since DTS mirrors Masri
      // Tier 2 spelling rules exactly (not just Gemination).
      // ---------------------------------------------------------------
      if (RULES) {
        const el = document.getElementById('dtsRulesList');
        const rules = RULES.spelling_rules || [];
        if (el && rules.length) {
          el.innerHTML = rules.map(rule => {
            const tr = LANG === 'ar' ? (RULES_AR[rule.id] || {}) : {};
            const name = tr.name || rule.name;
            const ruleText = tr.rule || rule.rule;
            const tier2Note = tr.tier2_note || rule.tier2_note;
            const text = tier2Note ? `${escapeHtml(ruleText)} <em>${escapeHtml(tier2Note)}</em>` : escapeHtml(ruleText);
            const ex = (rule.examples || []).map(e => escapeHtml(e)).join(' · ');
            return `<div class="dts-rule-card">
              <div class="dts-rule-name">${rule.id}. ${escapeHtml(name)}</div>
              <div class="dts-rule-text">${text}</div>
              ${ex ? `<div class="dts-rule-ex">${ex}</div>` : ''}
            </div>`;
          }).join('');
        }
      }
    })
    .catch(err => {
      console.error('Failed to load DTS data', err);
      if (grid) grid.innerHTML = `<p class="data-error">${dataErrorMsg()}</p>`;
    });
})();
