/**
 * Build logo + favicon from public/sjbw-logo-source.png (transparent PNG preferred).
 * Run: node scripts/generate-logo-assets.mjs
 */
import sharp from 'sharp'
import { existsSync } from 'fs'

const src = 'public/sjbw-logo-source.png'
if (!existsSync(src)) {
  console.error('Missing', src, '— add your transparent PNG there first.')
  process.exit(1)
}

/** Turn near-black JPEG backgrounds transparent so header bg-white shows through. */
async function withTransparency(input) {
  const { data, info } = await input
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r < 40 && g < 40 && b < 40) data[i + 3] = 0
  }

  return sharp(data, { raw: info })
}

async function logoPng(out, width) {
  const base = await withTransparency(sharp(src))
  await base
    .clone()
    .resize(width, null, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toFile(out)
}

async function iconPng(out, size) {
  const base = await withTransparency(sharp(src))
  await base
    .clone()
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(out)
}

const meta = await sharp(src).metadata()
console.log('Source:', meta.width, 'x', meta.height, 'alpha:', meta.hasAlpha)

await logoPng('public/sjbw-logo.png', 520)
await logoPng('public/sjbw-logo-sm.png', 160)
await iconPng('public/icons/icon-512.png', 512)
await iconPng('public/icons/icon-192.png', 192)
await iconPng('public/favicon.png', 32)
console.log('Done — transparent logo PNGs + white favicons')
