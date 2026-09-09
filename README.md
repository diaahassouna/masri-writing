<div align="center">

<img src="https://github.com/diaahassouna/masri-writing/blob/30e5ece2975892126f90f3e0c9d72f733700ecb3/Masri%20Gold%20logo.png" alt="Masri Logo" width="160"/>

<br/>

# مصري — Masri

### A writing system for the language 100 million people speak every day — and no one has ever standardized.

**Egyptian Arabic.** The most widely spoken Arabic dialect on earth.<br/>
Sung by Umm Kulthum. Quoted in every Arab film. Written by everyone — and written *differently* by everyone.

Until now.

<br/>

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-gold.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Script: Latin + Coptic](https://img.shields.io/badge/Script-Latin%20%2B%20Coptic-blue.svg)](#the-alphabet)
[![Tier 1: ASCII only](https://img.shields.io/badge/Tier%201-ASCII%20only-brightgreen.svg)](#two-tiers)
[![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-orange.svg)](#roadmap)

**[🔗 Try the live converter — diaahassouna.github.io/masri-writing](https://diaahassouna.github.io/masri-writing)**

</div>

---

## The problem in one sentence

> Egyptian Arabic is spoken by 100 million people, written by millions daily — and spelled differently by each of them.

Online, Egyptians write their dialect in three broken ways:

| Method | Example for عشان | What's wrong |
|---|---|---|
| Arabic script | عشان | Designed for Classical Arabic; no standard dialect spellings and usually written without all vowels "Harakat/Tashkeel" |
| Franco / Arabizi | 3shan / 3chan / shan | Numerals as letters, unsearchable, no agreement on anything |
| Just... guessing | ashan / ashan / ashaan | Inconsistent, ambiguous, varies by writer |

**Masri is the fix.** One symbol per sound. No numerals. Typeable on any keyboard. Built on the Latin alphabet — with a nod to the Coptic script that ancient Egyptians themselves used to write their language.

**Want to see it in action first?** The live converter is at **[diaahassouna.github.io/masri-writing](https://diaahassouna.github.io/masri-writing)** — type Franco, get Masri, instantly.

---

## What Masri looks like

```
Arabic:   أنا بحب مصر. القهوة المصرية أحسن قهوة في الدنيا.

Tier 1:   Ana baheb Masr. El ahwa el masreya ahsan ahwa fi el donya.

Tier 2:   Ana baϨeb Maṣr. El ahwa el maṣreyya aϨsan ahwa fi el donya.

DRS:      Ana baĦeb Maṣr. El ahwa el maṣreyya aħsan ahwa fi el donya.
```

```
Arabic:   أنا عارف إنه اللغة المصرية أحسن لغة في الدنيا،
          و ده اللي خلاني أشتغل فيها كل يوم.

Tier 1:   Ana `aref inno el Logha el Masreya ahsan logha fi el donya,
          we da elli khallani ashtaghal feha koll yoom.

Tier 2:   Ana Ⲵaref inno el Loɣa el Maṣreya aϨsan loɣa fi el donya,
          we da elli xallāni aϣtaɣal feeha koll yoom.

DRS:      Ana Ɛaref inno el Loġa el Maṣreya aħsan loġa fi el donya,
          we da elli xallāni aŝtaġal feeha koll yoom.
```

---

## Explore the site

The [live site](https://diaahassouna.github.io/masri-writing) is fully bilingual (every page has an EN and AR version) and covers a lot more than the converter:

| Page | What's there |
|---|---|
| [The Converter](https://diaahassouna.github.io/masri-writing/arabizi_to_masri_viral.html) | Type Franco or Arabic, get Masri instantly |
| [How Masri Works](https://diaahassouna.github.io/masri-writing/masri_how_it_works.html) | The conceptual manual — how Tier 1, Tier 2, and DRS relate |
| [Why not Franco?](https://diaahassouna.github.io/masri-writing/masri_prior_attempts.html) | Nine attempts to write Egyptian Arabic, scored and compared |
| [The Alphabet & Keyboards](https://diaahassouna.github.io/masri-writing/masri_alphabet.html) | All 37 letters, IPA values, and how to type each one |
| [DRS (Romanization)](https://diaahassouna.github.io/masri-writing/masri_drs.html) | The Diaa Romanization System — a Pinyin-style, standard-keyboard companion to Tier 2 |
| [Grammar Reference](https://diaahassouna.github.io/masri-writing/masri_grammar.html) | Nouns, verbs, negation, word order — every example in DRS and Tier 2 |
| [Loanword Policy](https://diaahassouna.github.io/masri-writing/masri_loanwords.html) | When to keep a foreign spelling, when to Egyptianize it |
| [Language in Egypt](https://diaahassouna.github.io/masri-writing/masri_language_history.html) | A timeline of language and script in Egypt, Old Kingdom to today |
| [Numbers](https://diaahassouna.github.io/masri-writing/masri_numbers.html) | Number words from zero to a billion |
| [How Masri Was Made](https://diaahassouna.github.io/masri-writing/masri_development_story.html) | The personal story and manuscript behind the project |

---

## Two tiers

Masri has two tiers — pick the one that fits your context.

### Tier 1 — Everyday (ASCII)

Designed for texting, social media, informal writing. Uses only characters available on any standard Latin keyboard. Digraphs handle complex sounds:

| Sound | Arabic | Tier 1 | Example |
|---|---|---|---|
| SH sound | ش | `sh` (also accepts digit `4` as shorthand input) | **sh**anta (شنطة) |
| KH sound | خ | `kh` | **kh**afeef (خفيف) |
| GH sound | غ | `gh` | **gh**areeb (غريب) |
| Ayin ع | ع | `` ` `` (backtick) | ba\`deen (بعدين) |
| Glottal stop | ء / ق | `'` | Ma'aam (مقام) |

### Tier 2 — Academic / Cultural

For linguistic study, formal documentation, and precision. Employs Greek and Coptic letters for sounds Latin cannot represent on its own:

| Sound | Arabic | Tier 2 | Unicode | Origin |
|---|---|---|---|---|
| SH sound | ش | `ϣ` (also accepts digit `4` as shorthand input) | U+03E3 | Coptic Shai |
| HA sound | ح | `Ϩ` | U+03E8 | Coptic Hori |
| Ayin | ع | `Ⲵ` | U+2CB4 | Old Coptic Ain |
| GH sound | غ | `ɣ` | U+0263 | Latin Extended (IPA gamma) |
| Emphatic S | ص | `ṣ` | U+1E63 | IPA diacritic |

> **Why Coptic?** Because Coptic *is* the latest written stage of the indigenous Egyptian language — it's what ancient Egyptians spoke and wrote before Arabic arrived. These letters are not foreign borrowings. They are a homecoming.
>
> Masri isn't the first attempt at this, either — it's the ninth. Eight previous systems tried, from Wilhelm Spitta's 1880 Orientalist grammar (popularized by Daniel Willard Fiske as *"An Egyptian Alphabet for the Egyptian People,"* 2nd ed., Florence 1904) through Abd al-Aziz Fahmi's 1944 Arabic Language Academy proposal to eg-lang, a contemporary Latin-diacritic system. See what each one got right — and where it fell short — on the [**"Why not Franco?"**](https://diaahassouna.github.io/masri-writing/masri_prior_attempts.html) page. Masri's own set of emphatic consonants converges with Spitta's independently — reached without prior knowledge of his work — which suggests these aren't arbitrary choices, but a structure the dialect itself points writers toward.

---

## The alphabet

<details>
<summary><strong>Full Masri Alphabet (37 letters) — click to expand</strong></summary>

<br/>

| # | Upper | Lower | Arabic | Name | Sound | Example |
|---|---|---|---|---|---|---|
| 1 | A | a | ا | Alef | /ʔ/, /aː/ | Arrnabb أرنب |
| 2 | B | b | ب | Beh | /b/ | Baṭṭa بطة |
| 3 | P | p | پ | Pee | /p/ | Printer برنتر |
| 4 | T | t | ت | Teh | /t/ | Temsaaϩ تمساح |
| 5 | Θ | θ | ث | Ṯeh | /θ/ → /s/ | Θania ثانية |
| 6 | G | g | ج | Geem | /g/ | GamⲴa جامعة |
| 7 | J | j | ج | Jéh | /ʒ/ | Jaket جاكيت (Ṣaʿidi/MSA ج, distinct from Cairene G) |
| 8 | Ϩ | ϩ | ح | Ḥa | /ħ/ | Ϩamza حمزة |
| 9 | X | x | خ | Ḵa | /x/ | Xafeef خفيف |
| 10 | D | d | د | Daal | /d/ | Dars درس |
| 11 | Ð | ð | ذ | Ḏaal | /ð/ → /z/ | Ðaaker ذاكر |
| 12 | R | r | ر | Reh | /r/ | Ramz رمز |
| 13 | Z | z | ز | Zeen | /z/ | Zambalek زمبلك |
| 14 | S | s | س | Seen | /s/ | SomⲴa سمعة |
| 15 | C | c | — | See | /s/, /k/ | Cinema سينما |
| 16 | Ϣ | ϣ | ش | Sheen | /ʃ/ | Ϣahaada شهادة |
| 17 | Ṣ | ṣ | ص | Ṣaad | /sˤ/ | Ṣafia صافية |
| 18 | Ḍ | ḍ | ض | Ḍaad | /dˤ/ | Ḍorɣam ضرغام |
| 19 | Ṭ | ṭ | ط | Ṭah | /tˤ/ | Ṭabour طابور |
| 20 | Ẓ | ẓ | ظ | Ẓah | /ðˤ/ | Ẓarf ظرف |
| 21 | Ⲵ | Ⲵ | ع | ʿAin | /ʕ/ | Ⲵamal عمل |
| 22 | Ɣ | ɣ | غ | Gheen | /ɣ/ | Ɣareeb غريب |
| 23 | F | f | ف | Feh | /f/ | Fengaan فنجان |
| 24 | V | v | ڤ | Vee | /v/ | Varanda ڤرندة |
| 25 | Q | q | ق | Qaaf | /q/ | Qawaafel قوافل |
| 26 | K | k | ك | Kaaf | /k/ | Kaan كان |
| 27 | L | l | ل | Laam | /l/ | Lamba لمبة |
| 28 | M | m | م | Meem | /m/ | MozeeⲴ مذيع |
| 29 | N | n | ن | Noon | /n/ | Noor نور |
| 30 | H | h | ه | Heh | /h/ | Hawa هوا |
| 31 | O | o | و | Oh | /ʔo/, /o/ | Ɣobaar غبار |
| 32 | U | u | و | Ū | /ʔu/, /u/ | Ⲵumaan عمان |
| 33 | W | w | و | Dablew | /ʔw/, /w/ | WalaaⱯ ولاء |
| 34 | E | e | ي | Ee | /ʔe/, /e/ | Estanna إستنى |
| 35 | I | i | ي | Ai | /ʔi/, /i/ | Waϩeϣni واحشني |
| 36 | Y | y | ي | Wye | /ʔj/, /j/ | Ya يا |
| 37 | Ɐ | Ɐ | ء | Hamza | /ʔ/ | MasⱯooleya مسئولية |

C and J are full members of the inventory, not exceptions — C covers code-switched /s/ or /k/ (Cinema, Café), and J covers the Upper Egyptian (Ṣaʿidi) pronunciation of ج, the MSA/فصحى pronunciation, and the loanword letter چ, all realized as /ʒ/.

</details>

---

## Core design principles

**1. One symbol, one sound.**
Every sound maps to exactly one symbol and every symbol to exactly one sound. No ambiguity, no exceptions.

**2. No numerals — ever.**
The numeral `3` for ع and `7` for ح are not Masri. They break text search, they exclude non-Arabic readers, and they are a historical workaround, not a system. Digits like `3`, `4`, `5`, `7`, `8`, `9` are accepted only as *input* shorthand from Franco — Masri's actual output never contains a numeral.

**3. Keyboard-first.**
Every Tier 1 symbol is typeable on any standard Latin keyboard with no special software. The backtick `` ` `` for ع is always available — it's the top-left key on your keyboard.

**4. Cairene Arabic is the standard.**
The normative reference throughout is the urban Cairene dialect — the dialect of Cairo, and the de facto lingua franca of the Arab world through film, television, and music.

**5. Consistency over perfection.**
Orthographic consistency is what ensures a writing system survives. Masri does not chase ideal phonetic transcription at the cost of writer decision load.

---

## The ع rule — the most important rule in the system

In Franco/Arabizi, the ayin (ع) is either replaced by the numeral `3` or silently dropped. Both are wrong.

**In Masri Tier 1:** ع is always written as a backtick `` ` ``

```
❌  aref        →   ✅  `aref       (عارف — knowing)
❌  ashan       →   ✅  `ashan      (عشان — because)
❌  ala         →   ✅  `ala        (على — on)
❌  3aref       →   ✅  `aref       (never use numerals)
```

**In Masri Tier 2:** ع is written as `Ⲵ` (Old Coptic Ain, U+2CB4)

```
❌  aref        →   ✅  Ⲵaref       (عارف — knowing)
❌  ashan       →   ✅  Ⲵaϣan       (عشان — because)
❌  ala         →   ✅  Ⲵala         (على — on)
❌  3aref       →   ✅  Ⲵaref       (never use numerals)
```

---

## Numbers — El Arqaam

A sample from the complete numbers table (0 to 1,000,000,000):

| # | Arabic | Tier 2 |
|---|---|---|
| 0 | صفر | Ṣefr |
| 1 | واحد | WaϨed |
| 2 | اتنين | Etneen |
| 3 | تلاتة | Talata |
| 4 | أربعة | ArbaⲴa |
| 5 | خمسة | Xamsa |
| 10 | عشرة | Ⲵaϣara |
| 20 | عشرين | Ⲵeϣreen |
| 100 | مية | Miyya |
| 200 | ميتين | Miteen |
| 1,000 | ألف | Alf |
| 1,000,000 | مليون | Melyoon |
| 1,000,000,000 | مليار | Melyar |

> See [`numbers`](https://github.com/diaahassouna/masri-writing/blob/cb14dfe8e40a8f8db7f8709f7d5e1a004ffd914b/El_Arqaam_El_Masreyya.pdf) for the full table from 0 to 1,000,000,000.

---

## Spelling rules — the quick version

| Rule | Tier 1 |
|---|---|
| **Gemination** (doubled consonants) | Write doubled: حب → `Ϩobb`, جداً → `geddan` |
| **Definite article** | Always `el` — never assimilate: الشارع → `el ϣaareⲴ` |
| **Glottal stop** | Silent at word start; apostrophe mid-word: سؤال → `so'aal` |
| **Digraphs** | `sh`, `kh`, `gh` are indivisible units — never split across syllables |
| **Cairene ق** | Word-initial: silent (قهوة → `ahwa`). Mid-word: apostrophe |
| **P vs B** | `p ≠ b` — both exist as distinct phonemes. بيتزا → `pizza`, not `bizza` |

---

## Standardized spellings — the most common words

| Arabic | Tier 1 | Tier 2 |
|---|---|---|
| إن شاء الله | inshala / insha'allah | inϣāⱯallāh |
| قهوة | ahwa | ahwa |
| أيوه | aywa | aywa |
| مش | mesh | miϣ |
| يعني | ya`ni | yaⲴni |
| عشان | `ashan | Ⲵaϣan |
| بس | bass | bass |
| الحمد لله | elhamdolilla | elϨamdolillāh |
| ماشاء الله | mashalla | māϣāⱯallāh |

---

## Stress test sentences

These ten sentences were written to push Masri to its limits — emphatic consonants, pharyngeals, loanwords, and dialect-specific expressions all in one place.

<details>
<summary><strong>View all 10 stress-test sentences in Tier 2 + Arabic</strong></summary>

<br/>

**1.**
```
Masri:  Ana Ⲵarif inno el loɣa el maṣreya aϨsan loɣa fi el donya,
        we da elli xallāni aϣtaɣal feha koll yoom.
Arabic: أنا عارف إنه اللغة المصرية أحسن لغة في الدنيا،
        و ده اللي خلاني أشتغل فيها كل يوم.
```

**2.**
```
Masri:  El ott el adeem baⲴdeen ge el beet we Ϩabbeto geddan —
        howa el waϨeed elli miϣ meⲴaⱯadni.
Arabic: القط القديم بعدين جه البيت وحبيته جداً —
        هو الوحيد اللي مش معقدني.
```

**3.**
```
Masri:  Bass lamma Ϩawwelt aṭbaⲴ el awraaⱯ el mohemma kanet
        el printer miϣ ϣaɣɣala lel asaf Ⲵaϣan el power cable miϣ mawgood.
Arabic: بس لما حاولت اطبع الأوراق المهمة كانت البرنتر مش
        شغالة للأسف عشان الباور كابل مش موجود.
```

**4.**
```
Masri:  El ḍabⲴ da ẓahar ṭabⲴan we el mawḍooⲴ da etⲴaⱯad xalaaṣ.
Arabic: الضبع ده ظهر طبعاً والموضوع ده اتعقد خلاص.
```

**5.**
```
Masri:  Inϣāllāh bokra nϣūf, elϨamdillāh Ⲵandena waⱯt.
Arabic: إن شاء الله بكرة نشوف، الحمد لله عندنا وقت.
```

**6.**
```
Masri:  El moϣkela en el ϣaɣɣāla el xeϣna el ɣaϣeema el over
        ɣalaṭatha ziyāda fe el θamarāt.
Arabic: المشكلة إن الشغالة الخشنة الغشيمة الأوڤر
        غلطاتها زيادة في الثمرات.
```

**7.**
```
Masri:  We ewⲴa el ouda elli goowa el beet el beeⱯa elli fi el ϣaariⲴ
        el mahgoor laϨsan hatexsar keteer.
Arabic: وإوعى الأوضة اللي جوة البيت البيئة اللي في الشارع
        المهجور لاحسن هتخسر كتير.
```

**8.**
```
Masri:  ForⱯoⲴlowz raⱯaṣ Ⲵa el sellem we bass keda ya sidi
        we el meⲴallem Sardeena dafaⲴ feloos keteer lel ṣowaan we el farϣa Ⲵa el ard.
Arabic: فورقوعلوز رقص ع السلم وبس كدة يا سيدي
        والمعلم سردينة دفع فلوس كتير للصوان والفرشة ع الأرض.
```

**9.**
```
Masri:  Oom oⱯaf we enta betkallemni, Oom oⱯaf boṣṣeli we fahhemni.
Arabic: قوم أوقف وانت بتكلمني، قوم أوقف بص لي وفهمني.
```

**10.**
```
Masri:  EϨna benⱯool aaxer madena heyya madenet el Salaam ya abo el Ⲵorréf,
        matlaɣweϣϣi Ⲵalayya we balaaϣ avwora ya over enta.
Arabic: إحنا بنقول آخر مدينة هي مدينة السلام يا ابو العُرِّيف،
        متلغوشي عليا وبلاش أڤورة يا أوڤر انت.
```

</details>

---

## Repository contents

```
masri-writing/
│
├── README.md                                   ← You are here
│
├── docs/                                        ← Live site: diaahassouna.github.io/masri-writing
│   ├── index.html / index_ar.html                   Home
│   ├── arabizi_to_masri_viral.html (+ _ar)           The Converter
│   ├── masri_how_it_works.html (+ _ar)               How Masri Works
│   ├── masri_prior_attempts.html (+ _ar)             Why not Franco?
│   ├── masri_alphabet.html (+ _ar)                   The Alphabet & Keyboards
│   ├── masri_drs.html (+ _ar)                        DRS (Diaa Romanization System)
│   ├── masri_grammar.html (+ _ar)                    Grammar Reference
│   ├── masri_loanwords.html (+ _ar)                  Loanword Policy
│   ├── masri_language_history.html (+ _ar)           Language in Egypt
│   ├── masri_numbers.html (+ _ar)                    Numbers
│   ├── masri_development_story.html (+ _ar)          How Masri Was Made
│   └── assets/                                       Shared CSS/JS + JSON data driving every page
│
├── Masri_Writing_System_Framework.pdf           ← Full bilingual specification (EN + AR)
├── Masri_Writing_System_Framework_v1.0.pdf
├── Masri_Writing_System_Maktoob_bi_el_Masri.pdf
│
├── El_Arqaam_El_Masreyya.pdf                    ← Complete numbers 0 → 1,000,000,000
├── Masri Alphabet and its Unicode.pdf
├── Masri Alphabet.xlsx                          ← Source spreadsheet behind assets/data/alphabet.json
├── Letters Franco to Masri Tier 2.PNG
│
├── Masri Keyboard LTR Windows/                  ← Windows keyboard installer (MSIs: amd64/i386/ia64)
│
├── Masri_Writing_System.pptx                    ← Presentation deck
├── manuscript 1.jpeg                            ← Original handwritten manuscript (development story)
│
├── Masri logo.png
└── Masri Gold logo.png
```

---

## Roadmap

- [x] Two-tier system designed and documented
- [x] Full alphabet (37 letters) defined with Unicode mappings
- [x] Complete numbers table (0 → 1,000,000,000)
- [x] Standardized word list
- [x] Bilingual development framework (EN + AR)
- [x] Interactive web reference — 11 bilingual pages at [diaahassouna.github.io/masri-writing](https://diaahassouna.github.io/masri-writing), including Grammar, Loanword Policy, and Language History
- [x] DRS — Diaa Romanization System, a Pinyin-style standard-keyboard companion to Tier 2
- [x] Light/dark theme across the site
- [x] Windows keyboard installer (`.msi` for amd64/i386/ia64)
- [ ] Linux XKB layout
- [ ] Android IME (custom keyboard app)
- [ ] YouTube presentation / video explainer

---

## FAQ

**Q: Why not just use IPA?**
IPA is for phoneticians, not people. Masri is designed for ordinary writers texting their friends, not transcribing speech acts in a linguistics paper.

**Q: Why not just improve Arabic orthography for the dialect?**
Arabic script is right-to-left and lacks short vowels by default — two properties that create immediate problems for a Latin-reader audience and for text interoperability. Masri's Latin base enables global readability while Tier 2 preserves phonetic precision.

**Q: Is Masri trying to replace Arabic?**
No. Masri is for *spoken Egyptian Arabic* — the dialect, not the formal written language. Classical Arabic and Modern Standard Arabic are fully separate registers with their own roles. Masri doesn't compete with them.

**Q: Why the backtick for ع and not something else?**
It is on every keyboard. It is visually distinct from the apostrophe (used for glottal stops). It never appears as a letter in any other Latin-script language. It does not require Shift. It is the single best available character for this purpose.

**Q: Can I use Masri right now?**
Yes. Tier 1 requires nothing — just your existing keyboard. Start with the standardized word list and the core spelling rules above, or try the live converter at [diaahassouna.github.io/masri-writing](https://diaahassouna.github.io/masri-writing).

---

## Feedback & collaboration

Masri borrows letterforms from Coptic and Greek — scripts with real living communities and scholarly traditions attached to them. If you study Coptic, Egyptology, or Arabic dialectology and notice something worth correcting or discussing, please [open an issue](https://github.com/diaahassouna/masri-writing/issues). The goal is a system that's both usable day-to-day and respectful of where its letters come from — and feedback from people who know this history better than I do only makes it stronger.

For everyone else: try the [live converter](https://diaahassouna.github.io/masri-writing), write a sentence in Masri, and open an issue if it breaks.

---

## License & attribution

**Masri Writing System Development Framework**
© 2026 Diaa Hassouna · Cairo, Egypt

Licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).

You are free to share and adapt this material for any purpose, including commercially, as long as you give appropriate credit.

---

<div align="center">

*"Orthographic consistency — not perfection — is what ensures a writing system survives."*

**الثبات الإملائي — لا كمال النظام — هو ما يكفل له الانتشار والاستمرار.**

<br/>

Proposed by **Diaa Hassouna** · Technical Office Engineer · Cairo, Egypt · 2026

**Live converter: [diaahassouna.github.io/masri-writing](https://diaahassouna.github.io/masri-writing)**

</div>
