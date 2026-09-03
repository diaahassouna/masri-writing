// Masri Arabizi→Masri converter (home page) — shared by
// arabizi_to_masri_viral.html (EN) and arabizi_to_masri_viral_ar.html (AR).
// Which language's data fields to use is decided by window.MASRI_LANG, set
// inline by each page before this file loads. Static chrome text is baked
// into each page's HTML directly; the Franco→Masri conversion itself is
// language-agnostic and never changes with the interface language.
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  // Small set of runtime-only strings used inside JS (button states, share
  // text, and the Framework reference panel, which is rendered live from
  // the fetched Tier 2 rules JSON).
  const STRINGS = {
    en: {
      copy_btn: 'Copy', copied_label: 'Copied',
      copied_bang: '✅ Copied!', copied_share: '✅ Copied to share!',
      share_tagline: '✨ turned into Masri at masri.app',
      framework_teaser: n => `This system is built on a full ${n}-letter framework — click to explore.`,
      data_error: 'Could not load the Tier 2 rules data. Please check your connection and reload.',
      data_error_file: "This page was opened directly as a file (the address bar starts with file://), so the browser blocks it from loading its data files — that's a browser security rule, not a bug in the page. Fix: serve this folder instead of double-clicking the file. Easiest way — open a terminal in this folder and run: python3 -m http.server — then visit http://localhost:8000/ in your browser. Or upload the whole folder to a static host like GitHub Pages."
    },
    ar: {
      copy_btn: 'نسخ', copied_label: 'اتنسخ',
      copied_bang: '✅ اتنسخ!', copied_share: '✅ اتنسخ عشان تبعته!',
      share_tagline: '✨ اتحول لمصري على masri.app',
      framework_teaser: n => `النظام ده مبني على أبجدية كاملة من ${n} حرف — دوس تستكشفها.`,
      data_error: 'مقدرناش نحمّل بيانات القواعد. اتأكد من الاتصال وحدّث الصفحة.',
      data_error_file: "الصفحة دي اتفتحت كملف مباشرة (الرابط بيبدأ بـ file://)، فالمتصفح بيمنعها من تحميل ملفات البيانات — ده قانون أمان في المتصفح، مش مشكلة في الصفحة نفسها. الحل: شغّل الفولدر ده على سيرفر محلي بدل ما تفتح الملف بدبل كليك. أسهل طريقة — افتح Terminal في الفولدر ده واكتب: python3 -m http.server — بعدين افتح http://localhost:8000/ في المتصفح. أو ارفع الفولدر كله على استضافة زي GitHub Pages."
    }
  };
  function t(key) { return STRINGS[LANG][key]; }
  function dataErrorMsg() { return (location.protocol === 'file:') ? t('data_error_file') : t('data_error'); }

  // Labels for the Framework reference panel (renderFramework)
  const FW_LABELS = {
    en: {
      tier1Uses: 'Tier 1 uses', tier2Uses: 'Tier 2 uses',
      spellingRules: 'Spelling rules',
      fullAlphabet: n => `Full Tier 2 alphabet (${n} letters)`,
      showHide: 'show / hide table',
      colNo: '#', colTier2: 'Tier 2', colArabic: 'Arabic', colName: 'Name', colIpa: 'IPA', colOrigin: 'Origin', colTier1: 'Tier 1',
      standardizedWords: 'Standardised words (drives the dictionary lookup)',
      author: 'Author', license: 'License', refDialect: 'Reference dialect'
    },
    ar: {
      tier1Uses: 'Tier 1 بيستخدم', tier2Uses: 'Tier 2 بيستخدم',
      spellingRules: 'قواعد الإملاء',
      fullAlphabet: n => `الأبجدية الكاملة لـ Tier 2 (${n} حرف)`,
      showHide: 'وريني / اخفي الجدول',
      colNo: '#', colTier2: 'Tier 2', colArabic: 'عربي', colName: 'الاسم', colIpa: 'النطق (IPA)', colOrigin: 'الأصل', colTier1: 'Tier 1',
      standardizedWords: 'الكلمات الموحّدة (اللي بتبني عليها القاموس)',
      author: 'المؤلف', license: 'الرخصة', refDialect: 'اللهجة المرجعية'
    }
  };

  // Egyptian Arabic translations for the data-driven rule text (ayin rule +
  // spelling rules) pulled from the fetched Tier 2 rules JSON, since that
  // JSON itself only carries English. Keyed by rule id for spelling rules.
  const AYIN_RULE_AR = {
    title: 'مشكلة حرف العين — أهم قاعدة',
    note: 'في Tier 2، حرف العين (ع) بيتكتب دايمًا Ⲵ (الحرف الكبير زي الصغير عشان شكله يفضل واحد).'
  };
  const SPELLING_RULES_AR = {
    1: { name: 'التشديد (الحروف المضاعفة)', rule: 'الحروف المشدّدة بتتكتب مرتين.' },
    2: { name: 'أل التعريف', rule: "دايمًا بتتكتب 'el' مهما كان الحرف اللي بعدها (شمسي أو قمري) في النطق. الثبات في الكتابة أهم من نقل النطق بالظبط، عشان يبقى أسهل على اللي بيكتب." },
    3: { name: 'الهمزة (وقفة الحنجرة)', rule: "بتتكتب بس في نص الكلمة أو آخرها، باستخدام Ɐ في Tier 2 (أو علامة ' في Tier 1). الهمزة في أول الكلمة — سواء همزة أصلية أو قاف قاهرية — بتفضل ساكنة ومش بتتكتب." },
    4: { name: 'تكامل الحروف المركّبة', rule: 'بتتطبق بس على Tier 1 (sh/kh/gh كوحدة من حرفين مش بتتفصل). في Tier 2 دول بقوا حرف واحد (ϣ, x, ɣ) فالقاعدة دي مش لازمة.', tier2_note: 'اتلغت بسبب الدمج في حرف واحد: sh→ϣ, kh→x, gh→ɣ' },
    5: { name: 'دمج القاف القاهرية والهمزة', rule: 'حرف Ɐ بيمثّل صوت الهمزة أيًا كان أصله. القاف القاهرية والهمزة بيتعاملوا كصوت واحد (وقفة حنجرية) لأنهم بينطقوا نفس الصوت في اللهجة القاهرية؛ حرف q بيتحفظله للنطق الرسمي/الفصحى.' },
    6: { name: 'حرفي P و V', rule: 'P و V حروف مستقلة وكاملة، مش بديل عن B أو F. حرف p بيستخدم غالبًا في الكلمات المستعارة/الحديثة؛ وحرف v صوت أصلي موجود جنبهم.' }
  };

  function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // -----------------------------------------------------------------
  // Everything below needs the Tier 2 rules JSON, so it's built once
  // fetch() resolves.
  // -----------------------------------------------------------------
  fetch('assets/data/tier2-rules.json')
    .then(r => r.json())
    .then(RULES => {
      // Every letter pair (Greek, Coptic, Latin-ext, ASCII) where upper/lower
      // differ is included automatically, so word-initial capitalization is
      // guaranteed to cover the full Tier 2 character set.
      function buildUpperMap(rules) {
        const map = {};
        const sources = [...rules.alphabet, ...(rules.borrowed_orthography || [])];
        for (const l of sources) {
          if (l.letter_lower && l.letter_upper && l.letter_lower !== l.letter_upper) {
            map[l.letter_lower] = l.letter_upper;
          }
        }
        return map;
      }
      const UPPER_MAP = buildUpperMap(RULES);

      // Dictionary is built live from RULES.standardized_word_list (Tier 2 JSON).
      // A small set of additional everyday Franco spellings is layered on top.
      const EXTRA_INPUT_VARIANTS = {
        "inϣāⱯallāh": ["insha2allah", "inshallah", "in2shallah", "inshaallah"],
        "miϣ": ["mish"],
        "yaⲴni": ["ya3ni", "ya2ni"],
        "Ⲵaϣan": ["3ashan", "2ashan", "'ashan"],
        "wallāh": ["wallah"],
        "elϨamdolillāh": ["elhamdolillah", "hamdilla", "elhamdilla", "elhamdolilla"],
        "besmellāh": ["bismillah", "besmella", "besmellaa", "besmillah", "besmellah"],
        "māϣāⱯallāh": ["mashallah", "masha2allah", "masha'allah"]
      };

      function splitSlash(s) { return s.split('/').map(x => x.trim()); }
      function cleanVariant(s) { return s.replace(/`/g, '').replace(/\(.*?\)/g, '').trim().toLowerCase(); }

      function buildDictionary(rules) {
        const dict = [];
        for (const entry of rules.standardized_word_list) {
          const normTier1 = entry.tier1.replace(/\s*\/\s*/g, '/');
          if (normTier1.includes(' ')) continue;
          const t1parts = splitSlash(entry.tier1).map(cleanVariant).filter(Boolean);
          const t2parts = splitSlash(entry.tier2);
          if (t1parts.length === t2parts.length && t1parts.length > 1) {
            t1parts.forEach((v, i) => dict.push({ variants: [v], out: t2parts[i] }));
          } else {
            const out = t2parts[0];
            const extra = EXTRA_INPUT_VARIANTS[out] || [];
            dict.push({ variants: [...new Set([...t1parts, ...extra])], out });
          }
        }
        dict.push({ variants: ["wallah"], out: "wallāh" });
        return dict;
      }

      const DICTIONARY = buildDictionary(RULES);
      const PHRASES = [{ re: /\bya\s*rab\b/gi, out: "yā rabb" }];

      // Academic (Tier 2) enrichment: long-vowel macrons for a curated set of
      // very common words (vowel length isn't recoverable from Franco alone).
      const FORMAL_OVERRIDES = {
        "3ashan": "Ⲵaϣān", "ashan": "Ⲵaϣān", "2ashan": "Ⲵaϣān",
        "7abibi": "ϩabībī", "habibi": "ϩabībī",
        "7abibti": "ϩabībtī", "habibti": "ϩabībtī"
      };

      function isAllCapsWord(s) { const letters = s.replace(/[^A-Za-z]/g, ''); return letters.length > 0 && letters === letters.toUpperCase() && letters !== letters.toLowerCase(); }
      function startsUpper(s) { return /^[A-Z]/.test(s); }
      function replaceCasedDigraph(word, re, lower, upper) { return word.replace(re, m => (m === m.toUpperCase() ? upper : lower)); }
      function lookupDictionary(normalized) {
        for (const entry of DICTIONARY) if (entry.variants.includes(normalized)) return entry.out;
        return null;
      }
      function applyCasing(word, out) {
        if (isAllCapsWord(word)) return out.toUpperCase();
        if (startsUpper(word)) {
          const c0 = out[0];
          return (UPPER_MAP[c0] || c0.toUpperCase()) + out.slice(1);
        }
        return out;
      }

      // Everyday (Tier 1): plain-Latin numeral & digraph scheme, never
      // introduces Coptic/Greek/Latin-extended characters.
      function convertWordEveryday(word, formal) {
        let w = word;
        w = replaceCasedDigraph(w, /kh/gi, 'kh', 'Kh');
        w = replaceCasedDigraph(w, /gh/gi, 'gh', 'Gh');
        w = replaceCasedDigraph(w, /sh/gi, 'sh', 'Sh');
        w = replaceCasedDigraph(w, /th/gi, formal ? 'th' : 's', formal ? 'Th' : 'S');
        w = replaceCasedDigraph(w, /dh/gi, formal ? 'dh' : 'z', formal ? 'Dh' : 'Z');
        w = w.replace(/3'/g, 'gh').replace(/6'/g, 'z').replace(/9'/g, 'd');
        w = w.replace(/3/g, '`').replace(/4/g, 'sh').replace(/7/g, 'h').replace(/6/g, 't').replace(/9/g, 's').replace(/8/g, 'gh').replace(/5/g, 'kh');
        if (w[0] === '2' || w[0] === "'") w = w.slice(1);
        w = w.replace(/2/g, "'");
        if (isAllCapsWord(word)) w = w.toUpperCase();
        else if (startsUpper(word) && w.length) w = w[0].toUpperCase() + w.slice(1);
        return w;
      }

      function convertWord(word, formal, academic) {
        if (!academic) return convertWordEveryday(word, formal);
        const normalized = word.toLowerCase();
        if (academic && formal && FORMAL_OVERRIDES[normalized]) return applyCasing(word, FORMAL_OVERRIDES[normalized]);
        const dictHit = lookupDictionary(normalized);
        if (dictHit) return applyCasing(word, dictHit);
        let w = word;
        w = replaceCasedDigraph(w, /kh/gi, 'x', 'X');
        w = replaceCasedDigraph(w, /gh/gi, 'ɣ', 'Ɣ');
        w = replaceCasedDigraph(w, /sh/gi, 'ϣ', 'Ϣ');
        w = replaceCasedDigraph(w, /th/gi, formal ? 'θ' : 's', formal ? 'Θ' : 'S');
        w = replaceCasedDigraph(w, /dh/gi, formal ? 'ð' : 'z', formal ? 'Ð' : 'Z');
        w = w.replace(/3'/g, 'ɣ').replace(/6'/g, 'ẓ').replace(/9'/g, 'ḍ');
        w = w.replace(/3/g, 'Ⲵ').replace(/4/g, 'ϣ').replace(/7/g, 'ϩ').replace(/6/g, 'ṭ').replace(/9/g, 'ṣ').replace(/8/g, 'ɣ').replace(/5/g, 'x');
        if (w[0] === '2' || w[0] === "'") w = w.slice(1);
        w = w.replace(/2/g, 'Ɐ').replace(/'/g, 'Ɐ');
        if (isAllCapsWord(word)) w = w.split('').map(ch => UPPER_MAP[ch] || ch.toUpperCase()).join('');
        else if (startsUpper(word) && w.length) { const c0 = w[0]; w = (UPPER_MAP[c0] || c0.toUpperCase()) + w.slice(1); }
        return w;
      }

      const CopticSet = new Set(['ϩ', 'Ϩ', 'ϣ', 'Ϣ', 'Ⲵ']);
      const GreekSet = new Set(['θ', 'Θ', 'ɣ', 'Ɣ']);
      const LatinExtSet = new Set(['ð', 'Ð', 'ṣ', 'Ṣ', 'ḍ', 'Ḍ', 'ṭ', 'Ṭ', 'ẓ', 'Ẓ', 'Ɐ']);
      function classify(ch) {
        if (CopticSet.has(ch)) return 'origin-coptic';
        if (GreekSet.has(ch)) return 'origin-greek';
        if (LatinExtSet.has(ch)) return 'origin-latin';
        return null;
      }

      function convertText(text, formal, academic) {
        let pre = text;
        for (const p of PHRASES) pre = pre.replace(p.re, p.out);
        const tokenRe = /[A-Za-z0-9']+/g;
        const converted = pre.replace(tokenRe, m => convertWord(m, formal, academic));
        return capitalizeSentences(converted);
      }
      function upperChar(ch) { return UPPER_MAP[ch] || ch.toUpperCase(); }
      function capitalizeSentences(text) {
        const chars = [...text];
        let capNext = true;
        for (let i = 0; i < chars.length; i++) {
          const ch = chars[i];
          if (ch === '.' || ch === '!' || ch === '?') { capNext = true; continue; }
          if (capNext) {
            if (/[\s"'“”‘’(\[]/.test(ch)) continue;
            chars[i] = upperChar(ch);
            capNext = false;
          }
        }
        return chars.join('');
      }
      function renderHighlighted(text, highlight) {
        if (!highlight) return escapeHtml(text);
        let html = '';
        for (const ch of text) {
          const cls = classify(ch);
          html += cls ? `<span class="${cls}">${escapeHtml(ch)}</span>` : escapeHtml(ch);
        }
        return html;
      }

      const inputBox = document.getElementById('inputBox');
      const outputBox = document.getElementById('outputBox');
      const formalToggle = document.getElementById('formalToggle');
      const highlightToggle = document.getElementById('highlightToggle');
      const copyBtn = document.getElementById('copyBtn');

      let lastConverted = '';
      let academicMode = false;

      function update() {
        const text = inputBox.value;
        const formal = formalToggle.checked;
        lastConverted = convertText(text, formal, academicMode);
        outputBox.innerHTML = renderHighlighted(lastConverted, highlightToggle.checked);
      }

      inputBox.addEventListener('input', update);
      formalToggle.addEventListener('change', update);
      highlightToggle.addEventListener('change', update);

      document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          inputBox.value = btn.getAttribute('data-text');
          update();
        });
      });

      function bloomLotus(btn) {
        const icon = btn.querySelector('.lotus-icon');
        if (!icon) return;
        icon.classList.remove('bloom');
        void icon.offsetWidth;
        icon.classList.add('bloom');
        setTimeout(() => icon.classList.remove('bloom'), 650);
      }

      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(lastConverted).then(() => {
          copyBtn.textContent = t('copied_label');
          copyBtn.classList.add('copied');
          setTimeout(() => { copyBtn.textContent = t('copy_btn'); copyBtn.classList.remove('copied'); }, 1200);
        });
      });

      inputBox.value = "3ashan keda ana 7abeit el mashroo3 da, bass el 5otta t2eela sha2wa.";
      update();

      // ---- Mode switch: Everyday (simple, viral) vs Academic — Tier 2 ----
      const modeButtons = document.querySelectorAll('#modeSwitch .mode-btn');
      modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-mode');
          academicMode = mode === 'academic';
          modeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('masri-app').classList.toggle('mode-academic', academicMode);
          formalToggle.checked = academicMode;
          highlightToggle.checked = academicMode;
          segButtons.forEach(b => b.classList.toggle('active', (b.getAttribute('data-formal') === '1') === academicMode));
          update();
          updateName();
        });
      });

      // ---- Segmented "Casual Egyptian / More formal" control ----
      const segButtons = document.querySelectorAll('#formalSegmented .seg-btn');
      segButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          segButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          formalToggle.checked = btn.getAttribute('data-formal') === '1';
          update();
          updateName();
        });
      });

      // ---- "Try your name" viral hook ----
      const nameInputBox = document.getElementById('nameInputBox');
      const nameOutputBox = document.getElementById('nameOutputBox');
      const nameCopyBtn = document.getElementById('nameCopyBtn');
      const nameCopyLabel = nameCopyBtn.querySelector('[data-i18n="name_copy_btn"]') || nameCopyBtn.querySelector('span:last-child');
      let lastName = '';

      function updateName() {
        const text = nameInputBox.value.trim();
        lastName = text ? convertText(text, formalToggle.checked, academicMode) : 'Ⲵali';
        nameOutputBox.innerHTML = renderHighlighted(lastName, highlightToggle.checked);
      }
      nameInputBox.addEventListener('input', updateName);
      updateName();

      nameCopyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(lastName).then(() => {
          bloomLotus(nameCopyBtn);
          const original = nameCopyLabel.textContent;
          nameCopyLabel.textContent = t('copied_bang');
          setTimeout(() => { nameCopyLabel.textContent = original; }, 1200);
        });
      });

      document.getElementById('tryNameBtn').addEventListener('click', () => {
        document.getElementById('nameSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameInputBox.focus();
      });

      // ---- Copy & Send / Share buttons for the main converter ----
      const shareText = () => `${lastConverted}\n\n${t('share_tagline')}`;
      const copySendBtn = document.getElementById('copySendBtn');
      const copySendLabel = copySendBtn.querySelector('[data-i18n="copy_send_btn"]') || copySendBtn.querySelector('span:last-child');

      copySendBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(lastConverted).then(() => {
          bloomLotus(copySendBtn);
          const original = copySendLabel.textContent;
          copySendLabel.textContent = t('copied_bang');
          setTimeout(() => { copySendLabel.textContent = original; }, 1200);
        });
      });

      document.getElementById('shareBtn').addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({ text: shareText() }).catch(() => {});
        } else {
          navigator.clipboard.writeText(shareText()).then(() => {
            const btn = document.getElementById('shareBtn');
            const original = btn.innerHTML;
            btn.textContent = t('copied_share');
            setTimeout(() => { btn.innerHTML = original; }, 1400);
          });
        }
      });

      // ---------------------------------------------------------------
      // Render the Framework reference panel from the fetched rules JSON
      // ---------------------------------------------------------------
      function renderFramework(rules) {
        const el = document.getElementById('frameworkRules');
        if (!el) return;
        const FW = FW_LABELS[LANG] || FW_LABELS.en;
        let html = '';

        const ay = rules.ayin_rule;
        const ayText = LANG === 'ar' ? AYIN_RULE_AR : { title: ay.title, note: ay.note };
        html += `<div class="fw-ayin">
          <div class="fw-name">${escapeHtml(ayText.title)}</div>
          <div class="fw-text">${escapeHtml(ayText.note)} ${FW.tier1Uses} <code>${escapeHtml(ay.tier1_symbol)}</code>, ${FW.tier2Uses} <code>${escapeHtml(ay.tier2_symbol)}</code>.</div>
          <div class="fw-ex">${ay.examples.map(e => `${e.tier1} → ${e.tier2} (${e.meaning})`).join(' &nbsp;·&nbsp; ')}</div>
        </div>`;

        html += `<div class="fw-block"><h3>${FW.spellingRules}</h3>`;
        for (const r of rules.spelling_rules) {
          const tr = LANG === 'ar' ? (SPELLING_RULES_AR[r.id] || {}) : {};
          const name = tr.name || r.name;
          const rule = tr.rule || r.rule;
          const tier2Note = tr.tier2_note || r.tier2_note;
          const text = tier2Note ? `${rule} <em>${tier2Note}</em>` : rule;
          const ex = (r.examples || []).join(' &nbsp;·&nbsp; ');
          html += `<div class="fw-rule">
            <div class="fw-name">${r.id}. ${escapeHtml(name)}</div>
            <div class="fw-text">${escapeHtml(text)}</div>
            ${ex ? `<div class="fw-ex">${escapeHtml(ex)}</div>` : ''}
          </div>`;
        }
        html += '</div>';

        html += `<div class="fw-block"><h3>${FW.fullAlphabet(rules.alphabet.length)}</h3>
          <details><summary style="cursor:pointer;color:var(--ink-dim);font-size:12px;">${FW.showHide}</summary>
          <table class="fw-alpha-table"><thead><tr>
            <th>${FW.colNo}</th><th>${FW.colTier2}</th><th>${FW.colArabic}</th><th>${FW.colName}</th><th>${FW.colIpa}</th><th>${FW.colOrigin}</th>
          </tr></thead><tbody>`;
        for (const l of rules.alphabet) {
          html += `<tr>
            <td>${l.no}</td>
            <td>${escapeHtml(l.letter_upper)} / ${escapeHtml(l.letter_lower)}</td>
            <td>${escapeHtml(l.arabic)}</td>
            <td>${escapeHtml(l.name)}</td>
            <td>${escapeHtml(l.ipa)}</td>
            <td>${escapeHtml(l.origin)}</td>
          </tr>`;
        }
        html += '</tbody></table></details></div>';

        html += `<div class="fw-block"><h3>${FW.standardizedWords}</h3><table class="fw-alpha-table"><thead><tr><th>${FW.colArabic}</th><th>${FW.colTier1}</th><th>${FW.colTier2}</th></tr></thead><tbody>`;
        for (const w of rules.standardized_word_list) {
          html += `<tr><td>${escapeHtml(w.arabic)}</td><td>${escapeHtml(w.tier1)}</td><td>${escapeHtml(w.tier2)}</td></tr>`;
        }
        html += '</tbody></table></div>';

        const m = rules.meta;
        html += `<div class="fw-credit">${escapeHtml(m.system)} — ${escapeHtml(m.tier)}. ${FW.author}: ${escapeHtml(m.author)}, ${m.year}. ${FW.license}: ${escapeHtml(m.license)}. ${FW.refDialect}: ${escapeHtml(m.reference_dialect)}.</div>`;

        el.innerHTML = html;
      }

      renderFramework(RULES);

      const letterCount = RULES.alphabet.length;
      const teaserEl = document.getElementById('frameworkTeaser');
      if (teaserEl) teaserEl.innerHTML = t('framework_teaser')(letterCount);
    })
    .catch(err => {
      console.error('Failed to load Masri Tier 2 rules data', err);
      const el = document.getElementById('outputBox');
      if (el) el.textContent = dataErrorMsg();
    });
})();
