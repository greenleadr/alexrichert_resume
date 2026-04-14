(function () {
  'use strict';

  var STORAGE_KEY = 'resume-theme';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  function initialTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
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
    /* ---------- Theme toggle ---------- */
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    /* ---------- Print / Download PDF ---------- */
    var printBtn = document.getElementById('print-btn');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

    /* ---------- Scroll progress bar + nav state + back-to-top ---------- */
    var progressFill = document.querySelector('.scroll-progress-fill');
    var nav = document.querySelector('.top-nav');
    var backToTop = document.querySelector('.back-to-top');
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var doc = document.documentElement;
        var scrolled = doc.scrollTop || document.body.scrollTop;
        var max = (doc.scrollHeight - doc.clientHeight) || 1;
        var pct = Math.max(0, Math.min(1, scrolled / max));
        if (progressFill) progressFill.style.width = (pct * 100).toFixed(2) + '%';
        if (nav) nav.classList.toggle('is-scrolled', scrolled > 24);
        if (backToTop) backToTop.classList.toggle('is-visible', scrolled > 400);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    /* ---------- Scroll-reveal observer ---------- */
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && revealEls.length) {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealIO.unobserve(entry.target);
            // trigger counter if present in this subtree
            var counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach(startCounter);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
      revealEls.forEach(function (el) { revealIO.observe(el); });
    } else {
      // no IO support — reveal everything immediately
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- Number counter animation ---------- */
    function startCounter(el) {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      if (reduceMotion) { el.textContent = el.dataset.count; return; }
      var target = parseFloat(el.dataset.count);
      if (isNaN(target)) return;
      var duration = parseInt(el.dataset.duration || '1400', 10);
      var decimals = (el.dataset.count.split('.')[1] || '').length;
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var start = performance.now();
      function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - t, 3);
        var val = target * eased;
        el.textContent = prefix + val.toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(tick);
    }
    // also kick off counters already in view on load
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) startCounter(el);
    });

    /* ---------- Active-section nav highlighting ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    var idToLink = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (id) idToLink[id] = a;
    });
    var sections = Object.keys(idToLink).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      var navIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = idToLink[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
      sections.forEach(function (s) { navIO.observe(s); });
    }
  });
})();
