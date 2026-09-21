// Masri Arabizi→Masri converter (home page) — shared by
// converter.html (EN) and converter_ar.html (AR).
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

  // Modern Egyptian translations for the data-driven rule text (ayin rule +
  // spelling rules) pulled from the fetched Tier 2 rules JSON, since that
  // JSON itself only carries English. Keyed by rule id for spelling rules.
  const AYIN_RULE_AR = {
    title: 'مشكلة حرف العين — أهم قاعدة',
    note: 'في Tier 2، حرف العين (ع) بيتكتب دايمًا Ⲵ (الحرف الكبير زي الصغير عشان شكله يفضل واحد).'
  };
  const SPELLING_RULES_AR = {
    1: { name: 'التشديد (الحروف المضاعفة والحركات الطويلة المضاعفة)', rule: "الحروف المشدّدة بتتكتب مرتين. الحركات الطويلة المتكررة بتتكتب مرتين (a → aa، e → ee، o → oo). والـ ii بتتكتب ee دايمًا، إلا الـ ii اللي في آخر الكلمة فبتفضل ii حسب العُرف اللاتيني." },
    2: { name: 'أل التعريف', rule: "دايمًا بتتكتب 'el' مهما كان الحرف اللي بعدها (شمسي أو قمري) في النطق. الثبات في الكتابة أهم من نقل النطق بالظبط، عشان يبقى أسهل على اللي بيكتب." },
    3: { name: 'الهمزة (وقفة الحنجرة)', rule: "بتتكتب بس في نص الكلمة أو آخرها، باستخدام Ɐ في Tier 2 (أو علامة ' في Tier 1). الهمزة في أول الكلمة — سواء همزة أصلية أو قاف قاهرية — بتفضل ساكنة ومش بتتكتب." },
    4: { name: 'تكامل الحروف المركّبة', rule: 'بتتطبق بس على Tier 1 (sh/kh/gh كوحدة من حرفين مش بتتفصل). لو حرفين جنب بعض شكلهم حرف مركّب لازم يتنطقوا منفصلين، بيتحط شرطة (-) بينهم: مشهور ← Mashhoor (sh + h)، ومسحور ← Mas-h^oor (s + h^). في Tier 2 دول بقوا حرف واحد (ϣ, x, ɣ) فالقاعدة دي مش لازمة.', tier2_note: 'اتلغت بسبب الدمج في حرف واحد: sh→ϣ, kh→x, gh→ɣ' },
    5: { name: 'دمج القاف القاهرية والهمزة', rule: 'حرف Ɐ بيمثّل صوت الهمزة أيًا كان أصله. القاف القاهرية والهمزة بيتعاملوا كصوت واحد (وقفة حنجرية) لأنهم بينطقوا نفس الصوت في اللهجة القاهرية؛ حرف q بيتحفظله للنطق الرسمي/الفصحى.' },
    6: { name: 'حرفي P و V', rule: 'P و V حروف مستقلة وكاملة، مش بديل عن B أو F. حرف p بيستخدم غالبًا في الكلمات المستعارة/الحديثة؛ وحرف v صوت أصلي موجود جنبهم.' },
    7: { name: 'صوتيات لاحقة النفي (فعل + -sh(i))', rule: 'زيادة -sh(i) لفعل منفي بتسبب تغييرات منتظمة في حركات جذر الفعل — بتتكتب بوضوح، زي ما بنكتب دمج θ←s وð←z القاهري بالظبط، مش سايبينها للحدس. تلات قواعد فرعية: (1) تقصير — الحركة الطويلة قبل حرف ساكن أخير واحد بتتقصّر لما تتضاف -sh. (2) حذف — الحركة القصيرة في أول مقطع من جذر الفعل ممكن تتحذف لما تتضاف -sh ويتحرك النبر. (3) زيادة حركة — بتتضاف حركة e غير منبورة لما إضافة -sh هتخلي الفعل بينتهي بتلات حروف ساكنة مع بعض.' },
    8: { name: 'دمج حرف الجر/الأداة مع أل التعريف (li/bi/fi/`a/ma + el)', rule: 'el في الأصل أداة حرة، دايمًا بتتكتب منفصلة عن الكلمة اللي بعدها (قاعدة 2). فيه مجموعة مقفولة من حروف الجر/الأدوات الخفيفة استثناء صريح: li- ("لـ")، bi- ("بـ")، fi- ("في")، `a-/Ⲵa- المختصرة، وما التوكيدية/الرابطة (غير ما النفي) — كل دول بتندمج مع el اللي بعدها في كلمة واحدة: li-+el←lel، bi-+el←bel، fi-+el←fel، `a-/Ⲵa-+el←`al/Ⲵal، ma+el←Mal. الكلمة المندمجة دي بعدين بتتصرف زي el العادية: بتفضل منفصلة عن الاسم اللي بعدها. دي قايمة مقفولة، مش قاعدة عامة لكل حرف جر — `and ("عند") + el بتفضل كلمتين، `and el، مش `andel أبدًا.' },
    9: { name: 'تقصير حركة الاسم قبل الضمير', rule: 'الحركة الطويلة في نص أو آخر الاسم بتتقصّر قبل مجموعة الضمائر "التقيلة" — -ha (لها)، -na (لنا)، -kom (لكو)، -hom (لهم)، وجمع المؤنث السالم -aat — بس بتفضل طويلة قبل المجموعة "الخفيفة" — -i (لي)، -ak/-ek (لك مذكر/مؤنث)، -o (له). دي تعميم لتقصير حركة الفعل في قاعدة رقم 7 على الأسماء.' },
    10: { name: 'فصل أداة النفي (ma مقابل -sh(i))', rule: 'ma بتتكتب كلمة منفصلة، نفس معاملة el كأداة حرة (قاعدة 2) — مش ملزوقة بالفعل. لاحقة -sh/-esh/-sh(i) بتفضل ملزوقة بالفعل (وبأي ضمائر مفعول ملزوقة بالفعل بين الجذر و -sh(i)). ده بيماشي إزاي المصري الحديث فعليًا بيتكتب بحروف عربي، حيث "ما" كلمة لوحدها و"ـش" بتتلزّق بالفعل.' },
    11: { name: 'تقصير حرف الجر (`ala/Ⲵala ← `a/Ⲵa)', rule: 'حرف الجر `ala/Ⲵala ("على، بخصوص") ممكن يتقصّر لـ `a/Ⲵa غالبًا قبل el وelli ("اللي" — نظير المصري الحديث للفصيح "الذي"). الصيغتين الكاملة والمختصرة صح. لما `a/Ⲵa المختصرة تيجي قبل el بالذات، الاتنين بيندمجوا في كلمة واحدة، `al/Ⲵal — شوف قاعدة رقم 8.' },
    12: { name: 'الاحتفاظ بصوت الكلمة الدخيلة مقابل حد التمصير', rule: 'حرفي P وV (قاعدة 6) بيتحافظ بيهم على /p/ و/v/ في صيغة الكلمة الدخيلة الأصلية — مش بيتحولوا لـ B/F بصمت — طول ما الكلمة لسه ما اخدتش صرف مصري أصلي. لما الكلمة تاخد صرف مصري (تأنيث، جمع، اشتقاق فعل)، التمصير الصوتي (p←b، v←f) بيبقى مسموح جنب الصرف مش إجباري: الصيغة الأصلية وصيغها المشتقة بيتعاملوا كمدخلين معجميين منفصلين وممكن يختلفوا (زي بيتزا اللي بتفضل p وبيتزاية اللي بتتمصّر لـ b).' },
    13: { name: 'θ←t وð←d في الكلمات الدخيلة (مختلفة عن الدمج القاهري الأصلي)', rule: 'في الكلمات الدخيلة بالذات، صوت /θ/ الأجنبي و/ð/ بيتحولوا لـ t وd، مش لهدف الدمج القاهري الأصلي (θ←s، ð←z) بتاع حروف ث/ذ العربية. القاعدتين مختلفتين ومينفعش يتلخبطوا مع بعض.' },
    14: { name: '/tʃ/ و/ŋ/ في الكلمات الدخيلة — من غير حروف جديدة؛ /ʒ/ بتستخدم J', rule: 'مصري Tier 2 مبيضيفش حروف مخصوصة لـ/tʃ/ ولا /ŋ/. /tʃ/ بتتكتب t+ϣ لما تتحافظ، وبتتبسّط لـ ϣ لوحدها في الصيغ المتمصّرة خالص. /ŋ/ بتتكتب n عادية قبل حرف حلقي، زي معاملة n في الكلمات الأصلية بالظبط. /ʒ/ استثناء: مصري أصلاً عنده حرف ليه، J (مشترك مع ج الصعيدي/الفصحى الأصلية)، فـ/ʒ/ المحافظ عليه في كلمة دخيلة ممكن يستخدم J مباشرة؛ غير كده بيتكتب ϣ افتراضيًا، أو g في الكلمات الفرنسية القديمة اللي اتمصرت خالص تاريخيًا.' },
    15: { name: 'التجمعات الساكنة والنبر في الكلمات الدخيلة', rule: 'التجمعات الساكنة في أول أو نص الكلمة اللي مش موجودة أصلاً في المصري بتتكتب زي ما بتتنطق افتراضيًا، من غير ما نحط حركة بينهم — عكس قواعد الصوتيات المصرية العادية. صيغة فيها حركة زيادة بتتسجل بس لو فعلاً منطوقة ومنتشرة، مش باختراع قاعدة. النبر مش بيتكتب في الكلمات الدخيلة، زي الكلمات الأصلية بالظبط.' },
    16: { name: 'الإملاء القياسي للكلمة الدخيلة مقابل الصيغة المقبولة والغلط', rule: 'كل كلمة دخيلة بياخدها إملاء قياسي واحد في Tier 2، بيطابق أشيع نطق قاهري ليها. أي نطق تاني منتشر فعلاً بيتسجل كصيغة مقبولة بشرطة مايلة، مش كبديل ساكت. أي إملاء افتراضي محدش بيقوله فعليًا بيتحدد كغلط صراحة، مش يتسكت عنه بس.' }
  };

  function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // -----------------------------------------------------------------
  // Everything below needs the Tier 2 rules JSON, so it's built once
  // fetch() resolves.
  // -----------------------------------------------------------------
  Promise.all([
    fetch('assets/data/tier2-rules.json').then(r => r.json()),
    fetch('assets/data/drs.json').then(r => r.json()).catch(() => null)
  ])
    .then(([RULES, DRS]) => {
      // Every letter pair (Greek, Coptic, Latin-ext, ASCII) where upper/lower
      // differ is included automatically, so word-initial capitalization is
      // guaranteed to cover the full Tier 2 character set.
      function buildUpperMap(rules) {
        const map = {};
        const sources = [...rules.alphabet, ...(rules.extra_letters || [])];
        for (const l of sources) {
          if (l.letter_lower && l.letter_upper && l.letter_lower !== l.letter_upper) {
            map[l.letter_lower] = l.letter_upper;
          }
        }
        return map;
      }
      const UPPER_MAP = buildUpperMap(RULES);

      // DRS (Diaa Romanization System) is Masri Tier 2's own alphabet
      // with a small override applied only to the handful of letters that
      // aren't on a standard keyboard (Coptic/Greek glyphs, plus the
      // turned-A hamza) — see assets/data/drs.json and masri_drs.html.
      // Building the map here (rather than hardcoding it) keeps DRS output
      // permanently in sync with that JSON.
      function buildDrsMap(rules, drs) {
        const map = {};
        if (!drs || !drs.overrides) return map;
        for (const upperKey of Object.keys(drs.overrides)) {
          const ov = drs.overrides[upperKey];
          map[upperKey] = ov.drs_upper;
          const entry = rules.alphabet.find(l => l.letter_upper === upperKey);
          const lowerKey = entry ? entry.letter_lower : null;
          if (lowerKey && lowerKey !== upperKey) map[lowerKey] = ov.drs_lower;
        }
        return map;
      }
      const DRS_MAP = buildDrsMap(RULES, DRS);
      function applyDrs(s) {
        if (!s) return s;
        let out = '';
        for (const ch of s) out += (DRS_MAP[ch] !== undefined) ? DRS_MAP[ch] : ch;
        return out;
      }

      // Dictionary is built live from RULES.standardized_word_list (Tier 2 JSON).
      // A small set of additional everyday Franco spellings is layered on top.
      const EXTRA_INPUT_VARIANTS = {
        "inϣaaⱯallaah": ["insha2allah", "inshallah", "in2shallah", "inshaallah"],
        "miϣ": ["mish"],
        "yaⲴni": ["ya3ni", "ya2ni"],
        "Ⲵaϣan": ["3ashan", "2ashan", "'ashan"],
        "wallaah": ["wallah"],
        "elϨamdolillaah": ["elhamdolillah", "hamdilla", "elhamdilla", "elhamdolilla"],
        "besmellaah": ["bismillah", "besmella", "besmellaa", "besmillah", "besmellah"],
        "maaϣaaⱯallaah": ["mashallah", "masha2allah", "masha'allah"]
      };

      // Medial i is always written e (AV-R09): i survives only at the start or end
      // of a word. Applied to typed input (so "mish", "kitaab" still match the
      // dictionary) and to every converted token.
      const FOLD_LET = "A-Za-z0-9'`^\u2C74\u2C75\u03E8\u03E9\u03E2\u03E3\u2C6F\u0263\u0194\u03B8\u00F0\u00D0\u0398\u1E63\u1E0D\u1E6D\u1E93\u1E62\u1E0C\u1E6C\u1E92\u0127\u015D\u0190\u025B\u00E9\u00E1\u00C9\u00C1";
      const MEDIAL_I = new RegExp("(?<=[" + FOLD_LET + "])i(?=[" + FOLD_LET + "])", "g");
      function foldI(s) { return s.replace(MEDIAL_I, 'e'); }

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
        dict.push({ variants: ["wallah"], out: "wallaah" });
        return dict;
      }

      const DICTIONARY = buildDictionary(RULES);
      for (const entry of DICTIONARY) entry.variants = [...new Set(entry.variants.map(foldI))];
      // Loanword citation forms keep their usual spelling (printer, parking, vidyu, ...):
      // tokens listed in loanword_examples are never folded.
      const LOAN_KEEP = new Set((RULES.loanword_examples || [])
        .flatMap(e => e.tier1.split(/[\/\s~]+/)).map(x => x.trim().toLowerCase()).filter(Boolean));
      const PHRASES = [{ re: /\bya\s*rab\b/gi, out: "yaa rabb" }];

      // Academic (Tier 2) enrichment: long-vowel macrons for a curated set of
      // very common words (vowel length isn't recoverable from Franco alone).
      const FORMAL_OVERRIDES = {
        "3ashan": "Ⲵaϣaan", "ashan": "Ⲵaϣaan", "2ashan": "Ⲵaϣaan",
        "7abibi": "ϩabeebi", "habibi": "ϩabeebi",
        "7abibti": "ϩabeebti", "habibti": "ϩabeebti"
      };

      for (const k of Object.keys(FORMAL_OVERRIDES)) { const fk = foldI(k); if (fk !== k) { FORMAL_OVERRIDES[fk] = FORMAL_OVERRIDES[k]; delete FORMAL_OVERRIDES[k]; } }

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

      // Masri Basic (Tier 1): plain ASCII, and NEVER a digit standing in for
      // a letter. ع = ` (backtick); ث خ ذ ش غ = th kh dh sh gh; an emphatic is
      // the plain letter + ^ (s^ ص, d^ ض, t^ ط, z^ ظ, h^ ح — the emphatic h;
      // plain h stays ه). Franco digits are read
      // as INPUT only — they are never emitted.
      function convertWordEveryday(word, formal) {
        let w = word;
        // A typed Tier 1 h^ (ح) is one unit: shield it from the digraph rules below,
        // otherwise casual th/dh would swallow its h (e.g. th^ -> s^).
        w = w.replace(/h\^/g, '\u0001').replace(/H\^/g, '\u0002');
        w = replaceCasedDigraph(w, /kh/gi, 'kh', 'Kh');
        w = replaceCasedDigraph(w, /gh/gi, 'gh', 'Gh');
        w = replaceCasedDigraph(w, /sh/gi, 'sh', 'Sh');
        w = replaceCasedDigraph(w, /th/gi, formal ? 'th' : 's', formal ? 'Th' : 'S');
        w = replaceCasedDigraph(w, /dh/gi, formal ? 'dh' : 'z', formal ? 'Dh' : 'Z');
        w = w.replace(/3'/g, 'gh').replace(/6'/g, 'z^').replace(/9'/g, 'd^');
        // A digraph letter (s/t/d/k/g) directly before ح is two separate letters, not a digraph: hyphenate (Mas-h^oor).
        w = w.replace(/([sdtkg])7/gi, '$1-h^');
        w = w.replace(/3/g, '`').replace(/4/g, 'sh').replace(/7/g, 'h^').replace(/6/g, 't^').replace(/9/g, 's^').replace(/8/g, 'gh').replace(/5/g, 'kh');
        if (w[0] === '2' || w[0] === "'") w = w.slice(1);
        w = w.replace(/2/g, "'");
        w = w.replace(/\u0001/g, 'h^').replace(/\u0002/g, 'H^');
        if (!LOAN_KEEP.has(word.toLowerCase())) w = foldI(w);
        if (isAllCapsWord(word)) w = w.toUpperCase();
        else if (startsUpper(word) && w.length) w = w[0].toUpperCase() + w.slice(1);
        return w;
      }

      function convertWord(word, formal, academic) {
        if (!academic) return convertWordEveryday(word, formal);
        const normalized = word.toLowerCase();
        if (academic && formal && FORMAL_OVERRIDES[foldI(normalized)]) return applyCasing(word, FORMAL_OVERRIDES[foldI(normalized)]);
        const dictHit = lookupDictionary(foldI(normalized));
        if (dictHit) return applyCasing(word, dictHit);
        let w = word;
        // Tier 1 writes ح as h^ (the emphatic h). Read it as one unit BEFORE the
        // digraph rules run, so s/t/d/k/g + h^ is never mis-split into sh/th/dh/kh/gh + ^.
        w = w.replace(/h\^/gi, 'ϩ');
        w = replaceCasedDigraph(w, /kh/gi, 'x', 'X');
        w = replaceCasedDigraph(w, /gh/gi, 'ɣ', 'Ɣ');
        w = replaceCasedDigraph(w, /sh/gi, 'ϣ', 'Ϣ');
        w = replaceCasedDigraph(w, /th/gi, formal ? 'θ' : 's', formal ? 'Θ' : 'S');
        w = replaceCasedDigraph(w, /dh/gi, formal ? 'ð' : 'z', formal ? 'Ð' : 'Z');
        w = w.replace(/3'/g, 'ɣ').replace(/6'/g, 'ẓ').replace(/9'/g, 'ḍ');
        // Tier 1 emphatic notation (plain letter + ^) is read as input too.
        w = w.replace(/([sdtz])\^/gi, (m, c) => ({ s: 'ṣ', d: 'ḍ', t: 'ṭ', z: 'ẓ' })[c.toLowerCase()]);
        w = w.replace(/3/g, 'Ⲵ').replace(/4/g, 'ϣ').replace(/7/g, 'ϩ').replace(/6/g, 'ṭ').replace(/9/g, 'ṣ').replace(/8/g, 'ɣ').replace(/5/g, 'x');
        w = w.replace(/`/g, 'Ⲵ');
        if (w[0] === '2' || w[0] === "'") w = w.slice(1);
        w = w.replace(/2/g, 'Ɐ').replace(/'/g, 'Ɐ');
        if (!LOAN_KEEP.has(word.toLowerCase())) w = foldI(w);
        if (isAllCapsWord(word)) w = w.split('').map(ch => UPPER_MAP[ch] || ch.toUpperCase()).join('');
        else if (startsUpper(word) && w.length) { const c0 = w[0]; w = (UPPER_MAP[c0] || c0.toUpperCase()) + w.slice(1); }
        return w;
      }

      const CopticSet = new Set(['ϩ', 'Ϩ', 'ϣ', 'Ϣ', 'Ⲵ']);
      const GreekSet = new Set(['θ', 'Θ']);
      const LatinExtSet = new Set(['ð', 'Ð', 'ṣ', 'Ṣ', 'ḍ', 'Ḍ', 'ṭ', 'Ṭ', 'ẓ', 'Ẓ', 'Ɐ', 'ɣ', 'Ɣ']);
      function classify(ch) {
        if (CopticSet.has(ch)) return 'origin-coptic';
        if (GreekSet.has(ch)) return 'origin-greek';
        if (LatinExtSet.has(ch)) return 'origin-latin';
        return null;
      }

      function convertText(text, formal, academic) {
        let pre = text;
        for (const p of PHRASES) pre = pre.replace(p.re, p.out);
        // Tier 1 hyphen rule: a hyphen between a digraph letter and h/h^ means two separate letters
        // (Mas-h^oor), never a digraph. Mark it with a sentinel so it splits the token, then keep it
        // as a hyphen in Tier 1 and drop it in Tier 2 / DRS (where sh/th/... are single letters anyway).
        pre = pre.replace(/([sdtkg])-(h\^?)/gi, '$1\u0003$2');
        const tokenRe = /[A-Za-z0-9'`^]+/g;
        let converted = pre.replace(tokenRe, m => convertWord(m, formal, academic));
        converted = converted.replace(/\u0003/g, academic ? '' : '-');
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
      // Default representation is Masri Standard (Tier 2) — the primary
      // canonical representation — not the ASCII/Tier 1 fallback. See
      // assets/data/representations.json for the canonical/fallback model
      // this terminology follows.
      let academicMode = true;
      let drsMode = false;

      // Renders either plain Tier 2 output, or (in DRS mode) the same
      // Tier 2 output with the keyboard-safe DRS substitutes swapped in —
      // origin highlighting is computed on the underlying Tier 2 text first
      // (since that's what the origin-* classes key off of), then the DRS
      // character swap is applied to the resulting HTML string, which is
      // safe because none of the substituted characters collide with
      // markup or the escaped HTML entities.
      function renderOutput(tier2Text, highlight) {
        const html = renderHighlighted(tier2Text, highlight);
        return drsMode ? applyDrs(html) : html;
      }

      function update() {
        const text = inputBox.value;
        const formal = formalToggle.checked;
        const tier2Text = convertText(text, formal, academicMode);
        lastConverted = drsMode ? applyDrs(tier2Text) : tier2Text;
        outputBox.innerHTML = renderOutput(tier2Text, highlightToggle.checked);
      }

      inputBox.addEventListener('input', update);
      formalToggle.addEventListener('change', update);
      highlightToggle.addEventListener('change', update);

      const presetButtons = document.querySelectorAll('.preset-btn');
      presetButtons.forEach(btn => {
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

      // Default text on load is pulled straight from the "example 1" preset
      // button (single source of truth) instead of a separate hardcoded
      // string, so editing one place can never drift out of sync with the other.
      inputBox.value = (presetButtons[0] && presetButtons[0].getAttribute('data-text')) || '';
      update();

      // ---- Mode switch: Everyday (simple, viral) vs Academic (Tier 2) vs
      // DRS Romanization. DRS reuses the exact same Tier 2 conversion (it's
      // Tier 2's own alphabet with a keyboard-safe substitute for the
      // handful of non-Latin glyphs), so academicMode is true for both
      // 'academic' and 'drs' — drsMode just layers the character swap and
      // chrome on top.
      const tierBadge = document.getElementById('tierBadge');
      const legendCharsEls = document.querySelectorAll('.legend-chars');
      function updateDrsChrome() {
        if (tierBadge) tierBadge.textContent = drsMode ? 'DRS' : 'Tier 2';
        legendCharsEls.forEach(el => {
          const orig = el.getAttribute('data-tier2');
          el.textContent = drsMode ? orig.split(' ').map(ch => DRS_MAP[ch] || ch).join(' ') : orig;
        });
      }
      const modeButtons = document.querySelectorAll('#modeSwitch .mode-btn');
      // Shared by the click handler and the initial-load call below, so
      // the page's actual first-render state always matches whichever
      // mode is really active — previously only clicks applied this.
      function applyMode(mode) {
        academicMode = mode !== 'everyday';
        drsMode = mode === 'drs';
        modeButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-mode') === mode));
        document.getElementById('masri-app').classList.toggle('mode-academic', academicMode);
        document.getElementById('masri-app').classList.toggle('mode-drs', drsMode);
        updateDrsChrome();
        formalToggle.checked = academicMode;
        highlightToggle.checked = academicMode;
        segButtons.forEach(b => b.classList.toggle('active', (b.getAttribute('data-formal') === '1') === academicMode));
      }
      modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          applyMode(btn.getAttribute('data-mode'));
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

      // Apply the default mode now that every element applyMode touches
      // (segButtons included) has been queried above. This makes the
      // page's first real render match its default button/state, instead
      // of only synchronizing on the first click.
      applyMode('academic');
      update();

      // ---- "Try your name" viral hook ----
      const nameInputBox = document.getElementById('nameInputBox');
      const nameOutputBox = document.getElementById('nameOutputBox');
      const nameCopyBtn = document.getElementById('nameCopyBtn');
      const nameCopyLabel = nameCopyBtn.querySelector('[data-i18n="name_copy_btn"]') || nameCopyBtn.querySelector('span:last-child');
      let lastName = '';

      function updateName() {
        const text = nameInputBox.value.trim();
        const tier2Name = text ? convertText(text, formalToggle.checked, academicMode) : 'Ⲵali';
        lastName = drsMode ? applyDrs(tier2Name) : tier2Name;
        nameOutputBox.innerHTML = renderOutput(tier2Name, highlightToggle.checked);
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
          <div class="fw-ex">${ay.examples.map(e => escapeHtml(`${e.tier1} → ${e.tier2} (${e.meaning})`)).join(' · ')}</div>
        </div>`;

        html += `<div class="fw-block"><h3>${FW.spellingRules}</h3>`;
        for (const r of rules.spelling_rules) {
          const tr = LANG === 'ar' ? (SPELLING_RULES_AR[r.id] || {}) : {};
          const name = tr.name || r.name;
          const rule = tr.rule || r.rule;
          const tier2Note = tr.tier2_note || r.tier2_note;
          const text = tier2Note ? `${rule} <em>${tier2Note}</em>` : rule;
          const ex = (r.examples || []).map(e => escapeHtml(e)).join(' · ');
          html += `<div class="fw-rule">
            <div class="fw-name">${r.id}. ${escapeHtml(name)}</div>
            <div class="fw-text">${escapeHtml(text)}</div>
            ${ex ? `<div class="fw-ex">${ex}</div>` : ''}
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
