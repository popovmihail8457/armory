// Подставляет префикс подпапки (BASE_PATH, например /armory) во внутренние ссылки собранного сайта.
// Нужен для GitHub Pages вида https://имя.github.io/репозиторий/, где сайт лежит не в корне.
// Запуск после сборки: BASE_PATH=/armory node scripts/prefix-base.mjs
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');
if (!base) {
  console.log('BASE_PATH не задан, префикс не нужен.');
  process.exit(0);
}

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const roots = 'bg|equipment|weapons|periods|ballistics|flight|radar|defense|sources|survey|vietnam|favicon|_astro|404';
// Путь в кавычках, обратных кавычках или url(...): "/weapons/..." -> "/armory/weapons/..."
const pattern = new RegExp(`(["'\`(])/(?=(?:${roots})(?:[/.#?"'\`)]|$))`, 'g');
const exts = new Set(['.html', '.js', '.css']);

let files = 0;
let changes = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) { walk(path); continue; }
    if (!exts.has(path.slice(path.lastIndexOf('.')))) continue;
    const text = readFileSync(path, 'utf8');
    let count = 0;
    const next = text
      .replace(pattern, (_, quote) => { count += 1; return `${quote}${base}/`; })
      .replace(/href="\/"/g, () => { count += 1; return `href="${base}/"`; });
    if (count) { writeFileSync(path, next); files += 1; changes += count; }
  }
};
// Корень сайта "/" тоже ссылка (главная и кнопки «Главная»).
walk(dist);
console.log(`Префикс ${base}: ${changes} замен в ${files} файлах.`);
