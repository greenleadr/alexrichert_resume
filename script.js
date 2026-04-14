(function () {
  'use strict';

  var STORAGE_KEY = 'resume-theme';
  var root = document.documentElement;

  /* ---------- Theme ---------- */
  function initialTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  applyTheme(initialTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    /* ---------- Print / Download PDF ---------- */
    var printBtn = document.getElementById('print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    /* ---------- Active-section highlighting in nav ---------- */
    var navLinks = Array.prototype.slice.call(
      document.querySelectorAll('.nav-links a[href^="#"]')
    );
    var idToLink = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (id) idToLink[id] = a;
    });

    var sections = Object.keys(idToLink)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = idToLink[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

      sections.forEach(function (s) { io.observe(s); });
    }
  });
})();
