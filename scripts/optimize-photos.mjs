/**
 * Сжатие фоновых фото: основной файл не шире 1600 px, для узких экранов рядом создаётся копия
 * `<имя>-m.jpg` шириной 900 px. Запуск: node scripts/optimize-photos.mjs
 * Повторный запуск безопасен: уже сжатые файлы пропускаются.
 * Исходники в полном размере остаются в истории git.
 */
import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

sharp.cache(false);
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'bg');
const MAIN_WIDTH = 1600;
const MOBILE_WIDTH = 900;
const SKIP_BELOW = 260 * 1024;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.jpg') && !name.endsWith('-m.jpg')) files.push(path);
  }
};
walk(root);

let before = 0;
let after = 0;
for (const path of files) {
  const size = statSync(path).size;
  const source = await sharp(readFileSync(path)).rotate().toBuffer({ resolveWithObject: true });
  const width = source.info.width;
  before += size;
  const mobilePath = path.replace(/\.jpg$/, '-m.jpg');
  if (width > MAIN_WIDTH || size > SKIP_BELOW) {
    const out = await sharp(source.data).resize({ width: MAIN_WIDTH, withoutEnlargement: true }).jpeg({ quality: 72, mozjpeg: true }).toBuffer();
    if (out.length < size) writeFileSync(path, out);
  }
  if (!existsSync(mobilePath)) {
    const small = await sharp(readFileSync(path)).resize({ width: MOBILE_WIDTH, withoutEnlargement: true }).jpeg({ quality: 68, mozjpeg: true }).toBuffer();
    writeFileSync(mobilePath, small);
  }
  after += statSync(path).size;
}
const mb = (value) => (value / 1048576).toFixed(1);
console.log(`Файлов: ${files.length}. Было ${mb(before)} МБ, стало ${mb(after)} МБ (без мобильных копий).`);
