/**
 * Runs in <head> before paint: unregister legacy SW + retry failed stylesheets.
 * Fixes intermittent "HTML only" loads after deploys (stale CDN HTML + missing CSS hash).
 */
export const inlineHeadScripts = `
(function () {
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

  function retryStylesheets() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        if (link.dataset.cssGuard) return;
        link.dataset.cssGuard = '1';
        link.addEventListener('error', function () {
          var href = (link.getAttribute('href') || '').split('?')[0];
          if (!href) return;
          var retry = document.createElement('link');
          retry.rel = 'stylesheet';
          retry.href = href + '?cb=' + Date.now();
          document.head.appendChild(retry);
        });
      })(links[i]);
    }
  }

  retryStylesheets();
  document.addEventListener('DOMContentLoaded', function () {
    retryStylesheets();
    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    document.body.appendChild(probe);
    var boxSizing = window.getComputedStyle(probe).boxSizing;
    probe.remove();
    var styled = boxSizing === 'border-box';
    if (!styled && !sessionStorage.getItem('css-recovery-reload')) {
      sessionStorage.setItem('css-recovery-reload', '1');
      location.reload();
    }
  });
})();
`.trim()
