/** Minimal inline CSS so the page is readable if the main stylesheet is delayed or 404. */
export const criticalCss = `
*,::before,::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5;color:#1a1a1a;background:#fff}
img,svg{display:block;max-width:100%}
a{color:inherit}
.hidden{display:none}
`.trim()
