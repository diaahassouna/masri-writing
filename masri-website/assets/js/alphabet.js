// Masri Alphabet page — shared by masri_alphabet.html (EN) and
// masri_alphabet_ar.html (AR). Which language's data fields to use is
// decided by window.MASRI_LANG, set inline by each page before this file
// loads. Static chrome text is baked into each page's HTML directly; this
// file only handles the data-driven parts (letter grid, tables, audio,
// keyboards).
(function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  const STRINGS = {
    en: {
      card_no: 'No.', card_listen: 'Listen',
      voice_note_arabic: n => `${n} Arabic voice(s) found — picked automatically for the most accurate pronunciation.`,
      voice_note_none: 'No Arabic voice found on this device — falling back to your default voice. Pronunciation of Coptic/Greek letters will be approximate.',
      voice_note_unsupported: 'Speech synthesis is not supported in this browser.',
      copied_label: 'Copied!',
      custom_im_toast: 'The Masri Custom Input Method is still in development — check back soon!',
      hex_letter: 'Letter', hex_type_this: 'Type this…', hex_then_press: '…then press', hex_compose_win: 'Compose (WinCompose)',
      hex_hold_option: 'Hold Option, type…', hex_compose_then: 'Compose key, then…', hex_add_shortcut: 'Add shortcut',
      data_error: 'Could not load the alphabet data. Please check your connection and reload.',
      data_error_file: "This page was opened directly as a file (the address bar starts with file://), so the browser blocks it from loading its data files — that's a browser security rule, not a bug in the page. Fix: serve this folder instead of double-clicking the file. Easiest way — open a terminal in this folder and run: python3 -m http.server — then visit http://localhost:8000/ in your browser. Or upload the whole folder to a static host like GitHub Pages."
    },
    ar: {
      card_no: 'رقم', card_listen: 'استمع',
      voice_note_arabic: n => `لقينا ${n} صوت عربي — اتختار أوتوماتيك لأدق نطق.`,
      voice_note_none: 'مفيش صوت عربي على الجهاز ده — هنستخدم الصوت الافتراضي بدله. نطق حروف القبطي/اليوناني هيبقى تقريبي.',
      voice_note_unsupported: 'المتصفح ده مش بيدعم تحويل النص لصوت.',
      copied_label: 'اتنسخ!',
      custom_im_toast: 'طريقة إدخال مصري المخصصة لسه تحت التطوير — تابعنا قريب!',
      hex_letter: 'الحرف', hex_type_this: 'اكتب…', hex_then_press: '…بعدين دوس', hex_compose_win: 'Compose (WinCompose)',
      hex_hold_option: 'امسك Option واكتب…', hex_compose_then: 'مفتاح Compose، بعدين…', hex_add_shortcut: 'ضيف اختصار',
      data_error: 'مقدرناش نحمّل بيانات الأبجدية. اتأكد من الاتصال وحدّث الصفحة.',
      data_error_file: "الصفحة دي اتفتحت كملف مباشرة (الرابط بيبدأ بـ file://)، فالمتصفح بيمنعها من تحميل ملفات البيانات — ده قانون أمان في المتصفح، مش مشكلة في الصفحة نفسها. الحل: شغّل الفولدر ده على سيرفر محلي بدل ما تفتح الملف بدبل كليك. أسهل طريقة — افتح Terminal في الفولدر ده واكتب: python3 -m http.server — بعدين افتح http://localhost:8000/ في المتصفح. أو ارفع الفولدر كله على استضافة زي GitHub Pages."
    }
  };
  function t(key) { return STRINGS[LANG][key]; }
  function dataErrorMsg() { return (location.protocol === 'file:') ? t('data_error_file') : t('data_error'); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function originDotClass(origin) {
    if (origin === 'Coptic') return 'dot-coptic';
    if (origin === 'Greek') return 'dot-greek';
    if (origin === 'Latin ext.') return 'dot-latin';
    if (origin === 'Vowel/semivowel') return 'dot-vowel';
    if (origin === 'Borrowed') return 'dot-borrowed';
    return 'dot-ascii';
  }

  function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // -----------------------------------------------------------------
  // Custom input method buttons (feature in development) — no data needed
  // -----------------------------------------------------------------
  document.querySelectorAll('.custom-im-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = t('custom_im_toast');
      setTimeout(() => { btn.textContent = original; }, 2200);
    });
  });

  // -----------------------------------------------------------------
  // OS tabs — no data needed
  // -----------------------------------------------------------------
  document.querySelectorAll('.os-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.os-tab').forEach(tb => tb.classList.remove('active'));
      document.querySelectorAll('.os-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.os-panel[data-os-panel="${tab.dataset.os}"]`).classList.add('active');
    });
  });

  fetch('assets/data/alphabet.json')
    .then(r => r.json())
    .then(DATA => {
      const ALL_LETTERS = DATA.alphabet.concat(DATA.borrowed_orthography);
      function noteFor(l) { return (LANG === 'ar' && l.notes_ar) ? l.notes_ar : l.notes; }

      // ---------------------------------------------------------------
      // Alphabet grid
      // ---------------------------------------------------------------
      const grid = document.getElementById('alphaGrid');
      const emptyState = document.getElementById('emptyState');
      const searchBox = document.getElementById('alphaSearch');
      const chips = document.querySelectorAll('#filterChips .chip');
      let activeOrigin = 'all';

      chips.forEach((chip, i) => {
        if (i === 0) chip.dataset.origin = 'all';
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          activeOrigin = chip.dataset.origin;
          renderGrid();
        });
      });
      chips[0].querySelector('.chip-count').textContent = '(' + ALL_LETTERS.length + ')';

      function renderGrid() {
        const q = searchBox.value.trim().toLowerCase();
        const filtered = ALL_LETTERS.filter(l => {
          const matchesOrigin = activeOrigin === 'all' || l.origin === activeOrigin;
          const haystack = (l.name + ' ' + l.ipa + ' ' + l.arabic + ' ' + l.letter_upper + ' ' + l.letter_lower + ' ' + l.notes + ' ' + (l.notes_ar || '')).toLowerCase();
          const matchesSearch = !q || haystack.includes(q);
          return matchesOrigin && matchesSearch;
        });
        grid.innerHTML = filtered.map(l => `
          <div class="letter-card" data-letter="${escapeHtml(l.letter_upper)}">
            <div class="lc-top">
              <span class="lc-no">${escapeHtml(t('card_no'))} ${l.no || '—'}</span>
              <span class="lc-origin-dot ${originDotClass(l.origin)}" title="${escapeHtml(l.origin)}"></span>
            </div>
            <div class="lc-glyphs">${escapeHtml(l.letter_upper)}&nbsp;${escapeHtml(l.letter_lower)}</div>
            <div class="lc-arabic">${escapeHtml(l.arabic)}</div>
            <div class="lc-name">${escapeHtml(l.name)}</div>
            <div class="lc-ipa">${escapeHtml(l.ipa)}</div>
            <div class="lc-notes">${escapeHtml(noteFor(l))}</div>
            <button class="lc-play" data-speak="${escapeHtml(l.arabic)}" data-name="${escapeHtml(l.name)}">
              <svg width="12" height="12" viewBox="0 0 24 24"><use href="#speaker-icon"></use></svg> ${escapeHtml(t('card_listen'))}
            </button>
          </div>
        `).join('');
        emptyState.hidden = filtered.length > 0;
        grid.querySelectorAll('.lc-play').forEach(btn => {
          btn.addEventListener('click', () => {
            const card = btn.closest('.letter-card');
            speakLetter(btn.dataset.speak, btn.dataset.name, card);
          });
        });
      }
      searchBox.addEventListener('input', renderGrid);
      renderGrid();

      // ---------------------------------------------------------------
      // Ayin rule examples
      // ---------------------------------------------------------------
      document.getElementById('ayinExamples').innerHTML = DATA.ayin_rule.examples.map(e => `
        <div class="ayin-ex-row">
          <span class="arabic">${escapeHtml(e.arabic)}</span>
          <span class="tier2">${escapeHtml(e.tier2)}</span>
          <span class="meaning">"${escapeHtml(LANG === 'ar' ? (e.meaning_ar || e.meaning) : e.meaning)}"</span>
        </div>
      `).join('');

      // ---------------------------------------------------------------
      // Vowel tables
      // ---------------------------------------------------------------
      function fillVowelTable(id, rows, cols) {
        const el = document.getElementById(id);
        el.innerHTML = rows.map(r => `<tr>${cols.map(c => `<td>${escapeHtml(r[c] || '')}</td>`).join('')}</tr>`).join('');
      }
      const soundCol = LANG === 'ar' ? 'sound_ar' : 'sound';
      fillVowelTable('shortVowelTable', DATA.vowel_system.short_vowels, ['arabic', soundCol, 'tier2']);
      fillVowelTable('longVowelTable', DATA.vowel_system.long_vowels, ['arabic', soundCol, 'tier2']);
      fillVowelTable('diphthongTable', DATA.vowel_system.diphthongs, ['arabic', soundCol, 'spelling']);

      // ---------------------------------------------------------------
      // Audio / TTS
      // ---------------------------------------------------------------
      const voiceSelect = document.getElementById('voiceSelect');
      const rateSlider = document.getElementById('rateSlider');
      const voiceNote = document.getElementById('voiceNote');
      let voices = [];

      function loadVoices() {
        voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
        if (!voices.length) return;
        const arabicVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ar'));
        const otherVoices = voices.filter(v => !v.lang || !v.lang.toLowerCase().startsWith('ar'));
        const ordered = arabicVoices.concat(otherVoices);
        voiceSelect.innerHTML = ordered.map((v, i) =>
          `<option value="${i}">${escapeHtml(v.name)} (${escapeHtml(v.lang)})</option>`
        ).join('');
        voiceSelect.dataset.pool = JSON.stringify(ordered.map(v => v.name));
        voiceNote.textContent = arabicVoices.length
          ? t('voice_note_arabic')(arabicVoices.length)
          : t('voice_note_none');
      }
      if (window.speechSynthesis) {
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      } else {
        voiceNote.textContent = t('voice_note_unsupported');
      }

      function currentVoice() {
        if (!voices.length) return null;
        const arabicVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ar'));
        const otherVoices = voices.filter(v => !v.lang || !v.lang.toLowerCase().startsWith('ar'));
        const ordered = arabicVoices.concat(otherVoices);
        const idx = parseInt(voiceSelect.value || '0', 10);
        return ordered[idx] || ordered[0] || null;
      }

      function speak(text, lang) {
        if (!window.speechSynthesis) return;
        const utter = new SpeechSynthesisUtterance(text);
        const v = currentVoice();
        if (v) { utter.voice = v; utter.lang = v.lang; }
        else if (lang) { utter.lang = lang; }
        utter.rate = parseFloat(rateSlider.value || '0.85');
        window.speechSynthesis.speak(utter);
        return utter;
      }

      function speakLetter(arabic, name, card) {
        if (card) {
          document.querySelectorAll('.letter-card.playing').forEach(c => c.classList.remove('playing'));
          card.classList.add('playing');
        }
        const v = currentVoice();
        const text = (v && v.lang && v.lang.toLowerCase().startsWith('ar')) ? arabic : name;
        const utter = speak(text, 'ar-EG');
        if (utter && card) {
          utter.onend = () => card.classList.remove('playing');
        }
      }

      document.getElementById('playAllBtn').addEventListener('click', () => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        let i = 0;
        function next() {
          if (i >= ALL_LETTERS.length) return;
          const l = ALL_LETTERS[i];
          const card = document.querySelector(`.letter-card[data-letter="${CSS.escape(l.letter_upper)}"]`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.querySelectorAll('.letter-card.playing').forEach(c => c.classList.remove('playing'));
            card.classList.add('playing');
          }
          const v = currentVoice();
          const text = (v && v.lang && v.lang.toLowerCase().startsWith('ar')) ? l.arabic : l.name;
          const utter = speak(text, 'ar-EG');
          i++;
          if (utter) utter.onend = () => setTimeout(next, 150);
          else setTimeout(next, 400);
        }
        next();
      });

      document.getElementById('stopAllBtn').addEventListener('click', () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        document.querySelectorAll('.letter-card.playing').forEach(c => c.classList.remove('playing'));
      });

      document.getElementById('listenPlayBtn').addEventListener('click', () => {
        const text = document.getElementById('listenInput').value.trim();
        if (text) speak(text, 'ar-EG');
      });

      // ---------------------------------------------------------------
      // Recording script download
      // ---------------------------------------------------------------
      document.getElementById('downloadScriptBtn').addEventListener('click', () => {
        let lines = [
          'MASRI ALPHABET — NATIVE RECORDING SCRIPT',
          'El Abgadeyya El Maṣreyya — Diaa Hassouna, CC BY 4.0',
          '',
          'Read each line clearly: letter name, then its Arabic sound.',
          ''
        ];
        ALL_LETTERS.forEach(l => {
          lines.push(`${l.no || '—'}. ${l.letter_upper}${l.letter_lower !== l.letter_upper ? '/' + l.letter_lower : ''}  —  ${l.name}  —  ${l.arabic}  —  ${l.ipa}`);
        });
        downloadText('masri_recording_script.txt', lines.join('\n'));
      });

      // ---------------------------------------------------------------
      // Virtual keypad
      // ---------------------------------------------------------------
      const KEYPAD_CHARS = ['Ⲵ', 'ⲵ', 'Ϩ', 'ϩ', 'ϣ', 'Ϣ', 'Ɣ', 'ɣ', 'Θ', 'θ', 'Ð', 'ð', 'Ṣ', 'ṣ', 'Ḍ', 'ḍ', 'Ṭ', 'ṭ', 'Ẓ', 'ẓ', 'Ɐ', 'ɐ', 'P', 'p', 'V', 'v', 'C', 'c', 'J', 'j'];
      const keypadGrid = document.getElementById('keypadGrid');
      const keypadOutput = document.getElementById('keypadOutput');
      keypadGrid.innerHTML = KEYPAD_CHARS.map(c => `<button class="keypad-key" data-char="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
      keypadGrid.querySelectorAll('.keypad-key').forEach(btn => {
        btn.addEventListener('click', () => {
          keypadOutput.value += btn.dataset.char;
          keypadOutput.focus();
        });
      });
      document.getElementById('keypadBackspace').addEventListener('click', () => {
        keypadOutput.value = keypadOutput.value.slice(0, -1);
      });
      document.getElementById('keypadClear').addEventListener('click', () => {
        keypadOutput.value = '';
      });
      document.getElementById('keypadCopy').addEventListener('click', (e) => {
        navigator.clipboard.writeText(keypadOutput.value).then(() => {
          const btn = e.currentTarget;
          const original = btn.textContent;
          btn.textContent = t('copied_label');
          setTimeout(() => { btn.textContent = original; }, 1200);
        });
      });

      // ---------------------------------------------------------------
      // Mnemonic compose scheme (shared across Windows / Linux / iOS / Android tables)
      // ---------------------------------------------------------------
      const COMPOSE_SCHEME = [
        { char: 'Ϩ', name: 'Ḥa', keys: 'h a', shortcut: ':haa' },
        { char: 'ϩ', name: 'ḥa', keys: 'H A', shortcut: ':haa.' },
        { char: 'ϣ', name: 'sheen', keys: 's h', shortcut: ':sheen' },
        { char: 'Ϣ', name: 'Sheen', keys: 'S H', shortcut: ':sheen.' },
        { char: 'Ⲵ', name: 'ain', keys: 'a i', shortcut: ':ain' },
        { char: 'ɣ', name: 'ghain', keys: 'g h', shortcut: ':ghain' },
        { char: 'Ɣ', name: 'Ghain', keys: 'G H', shortcut: ':ghain.' },
        { char: 'θ', name: 'theh', keys: 't h', shortcut: ':theh' },
        { char: 'Θ', name: 'Theh', keys: 'T H', shortcut: ':theh.' },
        { char: 'ð', name: 'dhal', keys: 'd h', shortcut: ':dhal' },
        { char: 'Ð', name: 'Dhal', keys: 'D H', shortcut: ':dhal.' },
        { char: 'ṣ', name: 'saad', keys: 's s', shortcut: ':saad' },
        { char: 'Ṣ', name: 'Saad', keys: 'S S', shortcut: ':saad.' },
        { char: 'ḍ', name: 'daad', keys: 'd d', shortcut: ':daad' },
        { char: 'Ḍ', name: 'Daad', keys: 'D D', shortcut: ':daad.' },
        { char: 'ṭ', name: 'tah', keys: 't t', shortcut: ':tah' },
        { char: 'Ṭ', name: 'Tah', keys: 'T T', shortcut: ':tah.' },
        { char: 'ẓ', name: 'zah', keys: 'z z', shortcut: ':zah' },
        { char: 'Ẓ', name: 'Zah', keys: 'Z Z', shortcut: ':zah.' },
        { char: 'ɐ', name: 'hamza', keys: "'", shortcut: ':hamza' }
      ];

      function letterByChar(c) {
        return ALL_LETTERS.find(l => l.letter_upper === c || l.letter_lower === c);
      }
      function unicodeFor(c) {
        const l = letterByChar(c);
        if (!l) return '';
        return (c === l.letter_upper) ? l.unicode_upper : l.unicode_lower;
      }

      document.getElementById('hexTableWin').innerHTML = `
        <thead><tr><th>${escapeHtml(t('hex_letter'))}</th><th>${escapeHtml(t('hex_type_this'))}</th><th>${escapeHtml(t('hex_then_press'))}</th><th>${escapeHtml(t('hex_compose_win'))}</th></tr></thead>
        <tbody>${COMPOSE_SCHEME.map(r => `<tr><td>${r.char}</td><td>${unicodeFor(r.char).replace('U+', '')}</td><td>Alt+X</td><td>${r.keys}</td></tr>`).join('')}</tbody>
      `;
      document.getElementById('hexTableMac').innerHTML = `
        <thead><tr><th>${escapeHtml(t('hex_letter'))}</th><th>${escapeHtml(t('hex_hold_option'))}</th></tr></thead>
        <tbody>${COMPOSE_SCHEME.map(r => `<tr><td>${r.char}</td><td>${unicodeFor(r.char).replace('U+', '')}</td></tr>`).join('')}</tbody>
      `;
      document.getElementById('hexTableLinux').innerHTML = `
        <thead><tr><th>${escapeHtml(t('hex_letter'))}</th><th>${escapeHtml(t('hex_compose_then'))}</th></tr></thead>
        <tbody>${COMPOSE_SCHEME.map(r => `<tr><td>${r.char}</td><td>${r.keys}</td></tr>`).join('')}</tbody>
      `;
      document.getElementById('hexTableIOS').innerHTML = `
        <thead><tr><th>${escapeHtml(t('hex_letter'))}</th><th>${escapeHtml(t('hex_add_shortcut'))}</th></tr></thead>
        <tbody>${COMPOSE_SCHEME.map(r => `<tr><td>${r.char}</td><td>${r.shortcut}</td></tr>`).join('')}</tbody>
      `;
      document.getElementById('hexTableAndroid').innerHTML = `
        <thead><tr><th>${escapeHtml(t('hex_letter'))}</th><th>${escapeHtml(t('hex_add_shortcut'))}</th></tr></thead>
        <tbody>${COMPOSE_SCHEME.map(r => `<tr><td>${r.char}</td><td>${r.shortcut}</td></tr>`).join('')}</tbody>
      `;

      // ---------------------------------------------------------------
      // Downloadable WinCompose sequences.txt
      // ---------------------------------------------------------------
      document.getElementById('downloadWinCompose').addEventListener('click', () => {
        let lines = [
          '# Masri Writing System — WinCompose custom sequences',
          '# El Abgadeyya El Maṣreyya, Diaa Hassouna, CC BY 4.0',
          '# Copy this into %AppData%\\WinCompose\\Sequences.txt (or append to your existing file), then restart WinCompose.',
          ''
        ];
        COMPOSE_SCHEME.forEach(r => {
          const keys = r.keys.split(' ').map(k => k === "'" ? '<apostrophe>' : `<${k}>`).join(' ');
          lines.push(`<Multi_key> ${keys} : "${r.char}" ${unicodeFor(r.char)} # Masri ${r.name}`);
        });
        downloadText('masri_wincompose_sequences.txt', lines.join('\n'));
      });

      // ---------------------------------------------------------------
      // Downloadable Linux .XCompose
      // ---------------------------------------------------------------
      document.getElementById('downloadXCompose').addEventListener('click', () => {
        let lines = [
          '# Masri Writing System — X11 Compose file',
          '# El Abgadeyya El Maṣreyya, Diaa Hassouna, CC BY 4.0',
          '# Save as ~/.XCompose, then log out and back in (or export GTK_IM_MODULE=xim and restart apps).',
          '',
          'include "%L"',
          ''
        ];
        COMPOSE_SCHEME.forEach(r => {
          const keys = r.keys.split(' ').map(k => k === "'" ? '<apostrophe>' : `<${k}>`).join(' ');
          lines.push(`<Multi_key> ${keys} : "${r.char}" ${unicodeFor(r.char)} # Masri ${r.name}`);
        });
        downloadText('masri_dotXCompose', lines.join('\n'));
      });
    })
    .catch(err => {
      console.error('Failed to load Masri alphabet data', err);
      const grid = document.getElementById('alphaGrid');
      if (grid) grid.innerHTML = `<p class="empty-state">${escapeHtml(dataErrorMsg())}</p>`;
    });
})();
