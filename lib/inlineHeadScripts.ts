/**
 * Runs before interactive: prioritize stylesheets, retry on error, hide body until CSS applies.
 */
export const inlineHeadScripts = `
(function () {
  var ROOT = document.documentElement;

  function markCssReady() {
    ROOT.classList.add('css-ready');
  }

  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (r) { r.unregister(); });
      });
    }
    if ('caches' in window) {
      caches.keys().then(function (keys) {
        keys.forEach(function (k) { caches.delete(k); });
      });
    }
  } catch (e) {}

  function moveStylesheetsFirst() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      document.head.insertBefore(links[i], document.head.firstChild);
    }
  }

  function tailwindLoaded() {
    var el = document.createElement('div');
    el.className = 'text-primary';
    el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    document.body.appendChild(el);
    var rgb = window.getComputedStyle(el).color;
    el.remove();
    return rgb === 'rgb(139, 69, 19)' || rgb === 'rgb(139,69,19)';
  }

  function wireStylesheet(link) {
    if (link.dataset.cssGuard) return;
    link.dataset.cssGuard = '1';

    if (link.sheet) return;

    link.addEventListener('load', function () {
      if (tailwindLoaded()) markCssReady();
    });

    link.addEventListener('error', function () {
      var href = (link.getAttribute('href') || '').split('?')[0];
      if (!href) return;
      var retry = document.createElement('link');
      retry.rel = 'stylesheet';
      retry.href = href + '?cb=' + Date.now();
      retry.addEventListener('load', function () {
        if (tailwindLoaded()) markCssReady();
      });
      document.head.insertBefore(retry, document.head.firstChild);
    });
  }

  function boot() {
    moveStylesheetsFirst();
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) wireStylesheet(links[i]);
    if (links.length === 0) markCssReady();
  }

  boot();

  document.addEventListener('DOMContentLoaded', function () {
    moveStylesheetsFirst();
    document.querySelectorAll('link[rel="stylesheet"]').forEach(wireStylesheet);

    if (tailwindLoaded()) {
      markCssReady();
      return;
    }

    if (!sessionStorage.getItem('css-recovery-reload')) {
      sessionStorage.setItem('css-recovery-reload', '1');
      location.reload();
      return;
    }

    markCssReady();
  });

  setTimeout(function () {
    markCssReady();
  }, 5000);
})();
`.trim()
