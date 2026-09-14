// How Masri Works — central architecture guide.
// The few parts of this page that duplicate facts already stored in
// assets/data/tier2-rules.json (design principles, the ع rule, and the
// glottal-stop / definite-article / digraph rules) are rendered live from
// that JSON instead of being retyped here, so this page can never drift
// out of sync with the Framework reference on the converter page.
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  // Arabic translations kept verbatim in sync with assets/js/viral.js's
  // AYIN_RULE_AR / SPELLING_RULES_AR, since the JSON itself only carries
  // English — this keeps the same rule described with the same Arabic
  // terminology everywhere it appears on the site (site-wide requirement).
  const AYIN_RULE_AR = {
    title: 'مشكلة حرف العين — أهم قاعدة',
    note: 'في Tier 2، حرف العين (ع) بيتكتب دايمًا Ⲵ (الحرف الكبير زي الصغير عشان شكله يفضل واحد).'
  };
  const SPELLING_RULES_AR = {
    1: { name: 'التشديد (الحروف المضاعفة والحركات الطويلة المضاعفة)', rule: "الحروف المشدّدة بتتكتب مرتين. الحركات الطويلة المتكررة بتتكتب مرتين أو مرة واحدة مع علامة المد (a → aa، ā)." },
    2: { name: 'أل التعريف', rule: "دايمًا بتتكتب 'el' مهما كان الحرف اللي بعدها (شمسي أو قمري) في النطق. الثبات في الكتابة أهم من نقل النطق بالظبط، عشان يبقى أسهل على اللي بيكتب." },
    3: { name: 'الهمزة (وقفة الحنجرة)', rule: "بتتكتب بس في نص الكلمة أو آخرها، باستخدام Ɐ في Tier 2 (أو علامة ' في Tier 1). الهمزة في أول الكلمة — سواء همزة أصلية أو قاف قاهرية — بتفضل ساكنة ومش بتتكتب." },
    4: { name: 'تكامل الحروف المركّبة', rule: 'بتتطبق بس على Tier 1 (sh/kh/gh كوحدة من حرفين مش بتتفصل). في Tier 2 دول بقوا حرف واحد (ϣ, x, ɣ) فالقاعدة دي مش لازمة.', tier2_note: 'اتلغت بسبب الدمج في حرف واحد: sh→ϣ, kh→x, gh→ɣ' },
    5: { name: 'دمج القاف القاهرية والهمزة', rule: 'حرف Ɐ بيمثّل صوت الهمزة أيًا كان أصله. القاف القاهرية والهمزة بيتعاملوا كصوت واحد (وقفة حنجرية) لأنهم بينطقوا نفس الصوت في اللهجة القاهرية؛ حرف q بيتحفظله للنطق الرسمي/الفصحى.' },
    6: { name: 'حرفي P و V', rule: 'P و V حروف مستقلة وكاملة، مش بديل عن B أو F. حرف p بيستخدم غالبًا في الكلمات المستعارة/الحديثة؛ وحرف v صوت أصلي موجود جنبهم.' }
  };
  const DESIGN_PRINCIPLES_AR = [
    'تناظر منتظم بين الصوت والرمز: مصري بيهدف لتناظر منتظم قوي بين أصوات الكلام والرموز المكتوبة، مع قواعد إملائية واضحة — مش استثناءات ساكتة — بتحكم الحالات اللي فيها الصوت والرمز مش واحد لواحد (زي دمج θ←/s/ و ð←/z/ في القاهرة، ودمج ق/ء في وقفة حنجرية واحدة، والتشديد).',
    'الإملاء بييجي قبل النطق الحرفي لما يحصل تعارض: بعض تهجيات مصري بتحافظ على هوية الكلمة أو الصرف بدل النطق السطحي — زي أل التعريف اللي دايمًا بتتكتب \'el\' مهما كان النطق الفعلي. ده قرار إملائي مقصود، مش ادعاء بإن الكلمة بتتنطق كده حرفيًا.',
    'البساطة قبل الجمالية: السرعة والسهولة أهم من الأناقة الرسمية.',
    'اللهجة المرجعية هي القاهرية: عربي مصر الحضري في القاهرة هو المعيار المرجعي.',
    'مفيش أرقام بديلة عن حروف: مفيش رقم عربي أو إنجليزي بيحل محل حرف.',
    'إتاحة الكتابة على الكيبورد (Tier 1): رموز يوم بيوم قابلة للكتابة على أي كيبورد لاتيني عادي؛ Tier 2 محتاج إدخال يوناني/قبطي إضافي.'
  ];

  function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  fetch('assets/data/tier2-rules.json').then(r => r.json()).then(RULES => {
    // ---- ع rule ----
    const ayinEl = document.getElementById('hiwAyin');
    if (ayinEl) {
      const ay = RULES.ayin_rule;
      const ayText = LANG === 'ar' ? AYIN_RULE_AR : { title: ay.title, note: ay.note };
      ayinEl.innerHTML = `<h3>${escapeHtml(ayText.title)}</h3>
        <p>${escapeHtml(ayText.note)}</p>
        <p><code>${escapeHtml(ay.tier1_symbol)}</code> → <code>${escapeHtml(ay.tier2_symbol)}</code></p>
        <p>${ay.examples.map(e => escapeHtml(`${e.tier1} → ${e.tier2} (${e.meaning})`)).join(' · ')}</p>`;
    }

    // ---- Rule cards: definite article (2), glottal stop (3), digraph integrity (4), qaf/hamza merger (5) ----
    const ruleIds = [2, 3, 5, 4];
    const ruleWrap = document.getElementById('hiwRuleCards');
    if (ruleWrap) {
      let html = '';
      for (const id of ruleIds) {
        const r = RULES.spelling_rules.find(x => x.id === id);
        if (!r) continue;
        const tr = LANG === 'ar' ? (SPELLING_RULES_AR[id] || {}) : {};
        const name = tr.name || r.name;
        const rule = tr.rule || r.rule;
        const tier2Note = tr.tier2_note || r.tier2_note;
        const ex = (r.examples || []).map(e => escapeHtml(e)).join(' · ');
        html += `<div class="hiw-card"><h3>${escapeHtml(name)}</h3><p>${escapeHtml(rule)}</p>${tier2Note ? `<p><em>${escapeHtml(tier2Note)}</em></p>` : ''}${ex ? `<p>${ex}</p>` : ''}</div>`;
      }
      ruleWrap.innerHTML = html;
    }

    // ---- Design principles ----
    const principlesEl = document.getElementById('hiwPrinciples');
    if (principlesEl) {
      const list = LANG === 'ar' ? DESIGN_PRINCIPLES_AR : RULES.design_principles;
      principlesEl.innerHTML = list.map(p => `<li>${escapeHtml(p)}</li>`).join('');
    }

    // ---- Letter count in the alphabet summary line, kept in sync ----
    const countEls = document.querySelectorAll('[data-letter-count]');
    countEls.forEach(el => { el.textContent = RULES.alphabet.length; });
  }).catch(err => {
    console.error('Failed to load Masri Tier 2 rules data for How Masri Works page', err);
  });
})();
