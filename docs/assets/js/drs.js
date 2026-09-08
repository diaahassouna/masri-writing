// DRS (Diaa Romanization System for Modern Egyptian) page.
//
// DRS is NOT an independently authored letter list — it is Masri Tier 2's
// own alphabet (assets/data/alphabet.json, the same file the Masri
// Alphabet page uses) with a small override applied only to the letters
// that aren't on a standard keyboard (Coptic/Greek glyphs, plus the
// turned-A hamza). Every other letter is rendered exactly as Masri Tier 2
// defines it. This keeps DRS permanently in sync: any future edit to
// Masri Tier 2's alphabet flows through automatically, and only
// assets/data/drs.json's small "overrides" map needs to change if a new
// non-keyboard letter is ever added to Masri.
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  const STRINGS = {
    en: {
      no_match: 'No letters match that search.',
      data_error: 'Could not load the DRS data. Please check your connection and reload.',
      data_error_file: "This page was opened directly as a file (the address bar starts with file://), so the browser blocks it from loading its data files — that's a browser security rule, not a bug in the page. Fix: serve this folder instead of double-clicking the file. Easiest way — open a terminal in this folder and run: python3 -m http.server — then visit http://localhost:8000/ in your browser. Or upload the whole folder to a static host like GitHub Pages.",
      col_symbol: 'Symbol', col_sound: 'Sound', col_drs: 'DRS', all: 'All',
      masri_label: 'Masri Tier 2:'
    },
    ar: {
      no_match: 'مفيش حروف مطابقة للبحث ده.',
      data_error: 'مقدرناش نحمّل بيانات DRS. اتأكد من الاتصال وحدّث الصفحة.',
      data_error_file: "الصفحة دي اتفتحت كملف مباشرة، فالمتصفح بيمنعها من تحميل ملفات البيانات. شغّل الفولدر على سيرفر محلي (python3 -m http.server) أو ارفعه على استضافة زي GitHub Pages.",
      col_symbol: 'الرمز', col_sound: 'الصوت', col_drs: 'DRS', all: 'الكل',
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
    6: { name: 'حرفي P و V', rule: 'P و V حروف مستقلة وكاملة، مش بديل عن B أو F. حرف p بيستخدم غالبًا في الكلمات المستعارة/الحديثة؛ وحرف v صوت أصلي موجود جنبهم.' },
    7: { name: 'صوتيات لاحقة النفي (فعل + -sh(i))', rule: 'زيادة -sh(i) لفعل منفي بتسبب تغييرات منتظمة في حركات جذر الفعل — بتتكتب بوضوح، زي ما بنكتب دمج θ←s وð←z القاهري بالظبط، مش سايبينها للحدس. تلات قواعد فرعية: (1) تقصير — الحركة الطويلة قبل حرف ساكن أخير واحد بتتقصّر لما تتضاف -sh. (2) حذف — الحركة القصيرة في أول مقطع من جذر الفعل ممكن تتحذف لما تتضاف -sh ويتحرك النبر. (3) زيادة حركة — بتتضاف حركة i غير منبورة لما إضافة -sh هتخلي الفعل بينتهي بتلات حروف ساكنة مع بعض.' },
    8: { name: 'دمج حرف الجر/الأداة مع أل التعريف (li/bi/fi/`a/ma + el)', rule: 'el في الأصل أداة حرة، دايمًا بتتكتب منفصلة عن الكلمة اللي بعدها (قاعدة 2). فيه مجموعة مقفولة من حروف الجر/الأدوات الخفيفة استثناء صريح: li- ("لـ")، bi- ("بـ")، fi- ("في")، `a-/Ⲵa- المختصرة، وما التوكيدية/الرابطة (غير ما النفي) — كل دول بتندمج مع el اللي بعدها في كلمة واحدة: li-+el←lel (أو lil)، bi-+el←bel، fi-+el←fel، `a-/Ⲵa-+el←`al/Ⲵal، ma+el←Mal. الكلمة المندمجة دي بعدين بتتصرف زي el العادية: بتفضل منفصلة عن الاسم اللي بعدها. دي قايمة مقفولة، مش قاعدة عامة لكل حرف جر — `and ("عند") + el بتفضل كلمتين، `and el، مش `andel أبدًا.' },
    9: { name: 'تقصير حركة الاسم قبل الضمير', rule: 'الحركة الطويلة في نص أو آخر الاسم بتتقصّر قبل مجموعة الضمائر "التقيلة" — -ha (لها)، -na (لنا)، -kom (لكو)، -hom (لهم)، وجمع المؤنث السالم -aat — بس بتفضل طويلة قبل المجموعة "الخفيفة" — -i (لي)،-ak/-ik (لك مذكر/مؤنث)، -o (له). دي تعميم لتقصير حركة الفعل في قاعدة رقم 7 على الأسماء.' },
    10: { name: 'فصل أداة النفي (ma مقابل -sh(i))', rule: 'ma بتتكتب كلمة منفصلة، نفس معاملة el كأداة حرة (قاعدة 2) — مش ملزوقة بالفعل. لاحقة -sh/-esh/-sh(i) بتفضل ملزوقة بالفعل (وبأي ضمائر مفعول ملزوقة بالفعل بين الجذر و -sh(i)). ده بيماشي إزاي العربي المصري فعليًا بيتكتب بحروف عربي، حيث "ما" كلمة لوحدها و"ـش" بتتلزّق بالفعل.' },
    11: { name: 'تقصير حرف الجر (`ala/Ⲵala ← `a/Ⲵa)', rule: 'حرف الجر `ala/Ⲵala ("على، بخصوص") ممكن يتقصّر لـ `a/Ⲵa غالبًا قبل el وelli ("اللي" — نظير العامية المصرية للفصيح "الذي"). الصيغتين الكاملة والمختصرة صح. لما `a/Ⲵa المختصرة تيجي قبل el بالذات، الاتنين بيندمجوا في كلمة واحدة، `al/Ⲵal — شوف قاعدة رقم 8.' }
  };

  const grid = document.getElementById('drsGrid');
  const chips = document.getElementById('drsFilterChips');
  const searchBox = document.getElementById('drsSearch');
  const emptyState = document.getElementById('drsEmpty');
  let activeCategory = 'all';

  // Build a DRS-rendering record for one Masri Tier 2 letter, applying the
  // override only if this letter isn't keyboard-typable.
  function toDrsLetter(l, overrides) {
    const ov = overrides[l.letter_upper];
    const drsUpper = ov ? ov.drs_upper : l.letter_upper;
    const drsLower = ov ? ov.drs_lower : l.letter_lower;

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
      drsUpper, drsLower, category, note,
      arabic: l.arabic,
      masriUpper: l.letter_upper,
      masriLower: l.letter_lower,
      isSubstitute: !!ov
    };
  }

  function letterCard(d) {
    const noteHtml = d.note ? `<div class="drs-note">${escapeHtml(d.note)}</div>` : '';
    const masriHtml = d.isSubstitute
      ? `<div class="drs-masri-ref">${escapeHtml(t('masri_label'))} <span class="drs-masri-glyph">${escapeHtml(d.masriUpper)}</span></div>`
      : '';
    const searchBlob = [d.drsLower, d.drsUpper, d.arabic, d.masriUpper, d.note || ''].join(' ').toLowerCase();
    return `<div class="drs-card" data-category="${d.category}" data-search="${escapeHtml(searchBlob)}">
      <div class="drs-case-row">
        <span class="drs-glyph drs-upper">${escapeHtml(d.drsUpper)}</span>
        <span class="drs-glyph drs-lower">${escapeHtml(d.drsLower)}</span>
      </div>
      <div class="drs-arabic">${escapeHtml(d.arabic)}</div>
      ${masriHtml}
      ${noteHtml}
    </div>`;
  }

  function applyFilters() {
    const q = searchBox ? searchBox.value.trim().toLowerCase() : '';
    let anyMatch = false;
    grid.querySelectorAll('.drs-card').forEach(card => {
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesSearch = !q || card.dataset.search.includes(q);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) anyMatch = true;
    });
    if (emptyState) emptyState.hidden = anyMatch;
  }

  Promise.all([
    fetch('assets/data/drs.json', { cache: 'no-store' }).then(r => r.json()),
    fetch('assets/data/alphabet.json', { cache: 'no-store' }).then(r => r.json()),
    fetch('assets/data/tier2-rules.json', { cache: 'no-store' }).then(r => r.json()).catch(() => null)
  ])
    .then(([DRS, ALPHA, RULES]) => {
      const drsLetters = ALPHA.alphabet.map(l => toDrsLetter(l, DRS.overrides));

      // ---------------------------------------------------------------
      // Category filter chips
      // ---------------------------------------------------------------
      if (chips) {
        const catsHtml = DRS.categories.map(c => {
          const label = LANG === 'ar' ? c.label_ar : c.label_en;
          const count = drsLetters.filter(d => d.category === c.id).length;
          return `<button class="chip" data-cat="${c.id}"><span>${escapeHtml(label)}</span> <span class="chip-count">${count}</span></button>`;
        }).join('');
        chips.innerHTML = `<button class="chip active" data-cat="all"><span>${escapeHtml(t('all'))}</span> <span class="chip-count">${drsLetters.length}</span></button>${catsHtml}`;
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
      if (grid) grid.innerHTML = drsLetters.map(letterCard).join('');
      if (searchBox) searchBox.addEventListener('input', applyFilters);

      // ---------------------------------------------------------------
      // Vowels — reused live from alphabet.json's vowel_system (same
      // source the Masri Alphabet page renders from).
      // ---------------------------------------------------------------
      if (ALPHA.vowel_system) {
        const vs = ALPHA.vowel_system;
        const rowsHtml = (rows, cols) => rows.map(v => `<tr>${cols.map(c => `<td>${escapeHtml(v[c])}</td>`).join('')}</tr>`).join('');

        const shortEl = document.getElementById('drsShortVowelTable');
        if (shortEl) shortEl.innerHTML = `<thead><tr><th>${t('col_symbol')}</th><th>${t('col_sound')}</th><th>${t('col_drs')}</th></tr></thead><tbody>${rowsHtml(vs.short_vowels, ['arabic', LANG === 'ar' ? 'sound_ar' : 'sound', 'tier2'])}</tbody>`;

        const longEl = document.getElementById('drsLongVowelTable');
        if (longEl) longEl.innerHTML = `<thead><tr><th>${t('col_symbol')}</th><th>${t('col_sound')}</th><th>${t('col_drs')}</th></tr></thead><tbody>${rowsHtml(vs.long_vowels, ['arabic', LANG === 'ar' ? 'sound_ar' : 'sound', 'tier2'])}</tbody>`;

        const diphEl = document.getElementById('drsDiphthongTable');
        if (diphEl) diphEl.innerHTML = `<thead><tr><th>${t('col_symbol')}</th><th>${t('col_sound')}</th><th>${t('col_drs')}</th></tr></thead><tbody>${rowsHtml(vs.diphthongs, ['arabic', LANG === 'ar' ? 'sound_ar' : 'sound', 'spelling'])}</tbody>`;
      }

      // ---------------------------------------------------------------
      // Tier 2 spelling rules — reused live, in full, from
      // tier2-rules.json's spelling_rules array, since DRS mirrors Masri
      // Tier 2 spelling rules exactly (not just Gemination).
      // ---------------------------------------------------------------
      if (RULES) {
        const el = document.getElementById('drsRulesList');
        const rules = RULES.spelling_rules || [];
        if (el && rules.length) {
          el.innerHTML = rules.map(rule => {
            const tr = LANG === 'ar' ? (RULES_AR[rule.id] || {}) : {};
            const name = tr.name || rule.name;
            const ruleText = tr.rule || rule.rule;
            const tier2Note = tr.tier2_note || rule.tier2_note;
            const text = tier2Note ? `${escapeHtml(ruleText)} <em>${escapeHtml(tier2Note)}</em>` : escapeHtml(ruleText);
            const ex = (rule.examples || []).map(e => escapeHtml(e)).join(' · ');
            return `<div class="drs-rule-card">
              <div class="drs-rule-name">${rule.id}. ${escapeHtml(name)}</div>
              <div class="drs-rule-text">${text}</div>
              ${ex ? `<div class="drs-rule-ex">${ex}</div>` : ''}
            </div>`;
          }).join('');
        }
      }
    })
    .catch(err => {
      console.error('Failed to load DRS data', err);
      if (grid) grid.innerHTML = `<p class="data-error">${dataErrorMsg()}</p>`;
    });
})();
