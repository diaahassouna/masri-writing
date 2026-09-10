// Shared "Masri representations" module.
//
// One canonical Masri orthography, several representations of it:
//   canonical  — Tier 2 (Masri Standard, primary), DRS, Arabic-V
//   fallback   — Tier 1 (Masri Basic), Arabic-P
// These are representations, not sequential tiers — only Tier 1 and
// Tier 2 are ever called "tiers." All data/labels/grouping live in
// assets/data/representations.json so every page (homepage, converter,
// alphabet, and the dedicated Representations reference page) renders
// the same names, groupings, and placeholder behavior instead of each
// hardcoding its own copy — this is what keeps the EN and AR versions
// from drifting apart.
//
// Arabic-V is architecturally a canonical representation; its
// implementation status is "placeholder" until authoritative
// Harakat/Tashkeel derivation rules or example data are supplied.
// Callers must check status and use renderPlaceholder() rather than
// inventing or guessing vocalized text.
window.MasriRepresentations = (function () {
  const LANG = (window.MASRI_LANG === 'ar') ? 'ar' : 'en';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  let cached = null;
  function load() {
    if (cached) return Promise.resolve(cached);
    return fetch('assets/data/representations.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(DATA => { cached = DATA; return DATA; });
  }

  function byId(DATA, id) {
    return DATA.representations.find(r => r.id === id) || null;
  }

  function byGroup(DATA, groupId) {
    return DATA.representations.filter(r => r.group === groupId);
  }

  function groupLabel(DATA, groupId) {
    const g = DATA.groups.find(g => g.id === groupId);
    return g ? g[LANG] : groupId;
  }

  // Renders one representation's label + short description as a compact
  // card. `example` is caller-supplied (this module holds no example
  // strings itself — those come from each page's own data) and is
  // ignored entirely when status is "placeholder".
  function renderCard(rep, example) {
    const isPlaceholder = rep.status === 'placeholder';
    const name = escapeHtml(rep.publicName[LANG]);
    const short = escapeHtml(rep.descriptionShort[LANG]);
    let body;
    if (isPlaceholder) {
      const note = escapeHtml(rep.placeholderNote[LANG]);
      body = `<p class="rep-placeholder-note">${note}</p>`;
    } else if (example) {
      body = `<p class="rep-example">${escapeHtml(example)}</p>`;
    } else {
      body = '';
    }
    return (
      `<div class="rep-card rep-card--${rep.role}${isPlaceholder ? ' rep-card--placeholder' : ''}" data-rep-id="${rep.id}">` +
      `<div class="rep-card-name">${name}<span class="rep-card-id">${escapeHtml(rep.name)}</span></div>` +
      `<div class="rep-card-short">${short}</div>` +
      body +
      `</div>`
    );
  }

  // Renders a full group ("Canonical representations" / "Practical
  // fallbacks") as a labeled section of cards. `examples` is an object
  // keyed by representation id, e.g. { tier2: '...', drs: '...' }.
  function renderGroup(DATA, groupId, examples) {
    examples = examples || {};
    const label = escapeHtml(groupLabel(DATA, groupId));
    const cards = byGroup(DATA, groupId)
      .map(rep => renderCard(rep, examples[rep.id]))
      .join('');
    return `<div class="rep-group" data-group-id="${groupId}"><h3 class="rep-group-label">${label}</h3><div class="rep-group-cards">${cards}</div></div>`;
  }

  // Renders the full technical comparison table (Representation / Script
  // / Canonical? / Purpose / Vocalization / Compatibility), in the
  // non-numeric order Masri Standard → DRS → Arabic-V → Masri Basic →
  // Arabic-P. Arabic-V's vocalization cell always reads from its own
  // comparison.vocalization field (which stays "pending" language until
  // the JSON entry itself is updated) — never hardcoded here.
  function renderComparisonTable(DATA) {
    const order = ['tier2', 'drs', 'arabic-v', 'tier1', 'arabic-p'];
    const headers = {
      en: ['Representation', 'Script', 'Canonical?', 'Purpose', 'Vocalization', 'Compatibility'],
      ar: ['التمثيل', 'الخط', 'مرجعي؟', 'الغرض', 'التشكيل', 'التوافقية']
    }[LANG];
    const rows = order.map(id => {
      const rep = byId(DATA, id);
      if (!rep) return '';
      const c = rep.comparison;
      const cells = [
        escapeHtml(rep.publicName[LANG]),
        escapeHtml(rep.script[LANG]),
        escapeHtml(c.canonical[LANG]),
        escapeHtml(c.purpose[LANG]),
        escapeHtml(c.vocalization[LANG]),
        escapeHtml(c.compatibility[LANG])
      ];
      const rowClass = rep.status === 'placeholder' ? ' class="rep-table-row--placeholder"' : '';
      return `<tr${rowClass}>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    }).join('');
    const headHtml = `<tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`;
    return `<table class="rep-table"><thead>${headHtml}</thead><tbody>${rows}</tbody></table>`;
  }

  return { load, byId, byGroup, groupLabel, renderCard, renderGroup, renderComparisonTable, LANG };
})();
