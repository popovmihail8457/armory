/**
 * Контактные листы для просмотра скачанных фото: по 30 миниатюр с подписями id.
 * Запуск: node scripts/contact-sheet.mjs <набор> <папка для листов>
 */
import { readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const [set, outDir] = process.argv.slice(2);
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'bg', set);
const files = readdirSync(dir).filter((file) => file.endsWith('.jpg')).sort();
mkdirSync(outDir, { recursive: true });
const COLS = 6, ROWS = 5, W = 300, H = 170, LABEL = 22;
const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

for (let page = 0; page * COLS * ROWS < files.length; page += 1) {
  const chunk = files.slice(page * COLS * ROWS, (page + 1) * COLS * ROWS);
  const tiles = await Promise.all(chunk.map(async (file, i) => {
    const image = await sharp(join(dir, file)).resize(W, H, { fit: 'cover' }).toBuffer();
    const label = Buffer.from(`<svg width="${W}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111"/><text x="6" y="16" font-family="Arial" font-size="15" fill="#fff">${esc(file.replace('.jpg', ''))}</text></svg>`);
    const left = (i % COLS) * W;
    const top = Math.floor(i / COLS) * (H + LABEL);
    return [{ input: image, left, top }, { input: label, left, top: top + H }];
  }));
  const out = join(outDir, `${set}-${String(page + 1).padStart(2, '0')}.jpg`);
  await sharp({ create: { width: COLS * W, height: ROWS * (H + LABEL), channels: 3, background: '#222' } }).composite(tiles.flat()).jpeg({ quality: 78 }).toFile(out);
  console.log(out);
}
