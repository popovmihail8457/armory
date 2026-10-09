/**
 * Составляет запросы на фото для техники и вооружения, у которых ещё нет своего снимка.
 * Запрос строится по английскому названию: заголовок статьи Википедии у техники, латинское имя у вооружения.
 * Результат дописывается в scripts/photo-queries.json наборами items-auto и weapons-auto.
 * Автоматический подбор по названию даёт много промахов: после загрузки фото обязательно
 * просматриваются на контактных листах (scripts/contact-sheet.mjs).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const have = (set) => { const p = join(root, 'public/bg', set, 'manifest.json'); return existsSync(p) ? new Set(Object.entries(JSON.parse(readFileSync(p, 'utf8'))).filter(([, v]) => v.file).map(([k]) => k)) : new Set(); };
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Регулярное выражение по обозначению: части с цифрами и длинные собственные слова. */
function pattern(title) {
  const words = title.replace(/[()]/g, ' ').split(/\s+/).filter(Boolean);
  const coded = words.filter((word) => /\d/.test(word) && word.length >= 3);
  const named = words.filter((word) => /^[A-Z][a-z]{5,}$/.test(word) && !['Missile', 'System', 'Class', 'Fighting', 'Vehicle', 'Howitzer', 'Destroyer', 'Frigate', 'Carrier', 'Aircraft', 'Submarine', 'Infantry', 'Armoured', 'Armored', 'Personnel', 'Machine', 'Rocket', 'Launcher', 'Multiple', 'Self-propelled'].includes(word));
  const parts = [...coded, ...named].slice(0, 4).map((part) => escape(part).replace(/-/g, '.?'));
  return parts.length ? parts.join('|') : null;
}

const sets = JSON.parse(read('scripts/photo-queries.json'));
const itemsHave = have('items');
const weaponsHave = have('weapons');
const itemsAuto = {};
for (const m of read('src/data/equipment.ts').matchAll(/e\('([^']+)', '[^']*', '[^']*', \d+, '[^']+', \{[^}]*\},\s*'[^']*', '([^']+)'\)/g)) {
  const [, id, wiki] = m;
  if (itemsHave.has(id)) continue;
  const title = decodeURIComponent(wiki).replace(/_/g, ' ').replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  const rx = pattern(title);
  if (rx) itemsAuto[id] = [[title, title + ' military'], rx];
}
const weaponsAuto = {};
for (const m of read('src/data/weapons/catalog-extra.ts').matchAll(/x\('([^']+)', '([^']+)'/g)) {
  const [, id, name] = m;
  if (weaponsHave.has(id) || /[а-яё]/i.test(name)) continue;
  const rx = pattern(name);
  if (rx && name.length >= 4) weaponsAuto[id] = [[name, name + ' weapon'], rx];
}
for (const m of read('src/data/weapons/data.ts').matchAll(/w\('([^']+)', '[^']*'[\s\S]*?\], '([^']+)'\),/g)) {
  const [, id, wiki] = m;
  if (weaponsHave.has(id) || weaponsAuto[id]) continue;
  const title = decodeURIComponent(wiki).replace(/_/g, ' ').replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  const rx = pattern(title);
  if (rx) weaponsAuto[id] = [[title, title + ' missile'], rx];
}
sets['items-auto'] = itemsAuto;
sets['weapons-auto'] = weaponsAuto;
writeFileSync(join(root, 'scripts/photo-queries.json'), JSON.stringify(sets, null, 2));
console.log('items-auto', Object.keys(itemsAuto).length, 'weapons-auto', Object.keys(weaponsAuto).length);
