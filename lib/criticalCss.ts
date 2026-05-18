/** Minimal inline CSS + hide unstyled flash until Tailwind loads. */
export const criticalCss = `
*,::before,::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
html:not(.css-ready) body{visibility:hidden}
html.css-ready body{visibility:visible}
body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5;color:#1a1a1a;background:#fff}
img,svg{display:block;max-width:100%}
a{color:inherit}
`.trim()
