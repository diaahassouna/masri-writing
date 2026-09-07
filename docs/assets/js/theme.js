/* Masri site — light/dark theme toggle.
   Initial theme is set synchronously by the inline snippet in <head>
   (before CSS paints) so there is no flash; this file only wires up the
   button click on every page and keeps localStorage in sync. */
(function () {
  var STORAGE_KEY = 'masri-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    var btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    btn.setAttribute('aria-pressed', current === 'light' ? 'true' : 'false');
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  });
})();
