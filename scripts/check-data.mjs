/**
 * Проверка полноты и связности данных справочника.
 * Запуск: node scripts/check-data.mjs
 * Ошибки (битые ссылки, расхождения) завершают скрипт с кодом 1. Пробелы в покрытии выводятся как сведения.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const ids = (text, pattern) => [...text.matchAll(pattern)].map((m) => m[1]);
const keysOf = (text) => ids(text, /^\s{2}'([a-z0-9-]+)':/gm);
const errors = [];
const info = [];
const dupes = (list, label) => { const seen = new Set(); list.forEach((id) => { if (seen.has(id)) errors.push(`${label}: повтор id ${id}`); seen.add(id); }); };

// Техника
const equipmentText = read('src/data/equipment.ts');
const equipment = [...equipmentText.matchAll(/e\('([^']+)', '[^']*', '[^']*', (\d+), '([^']+)'/g)].map((m) => ({ id: m[1], year: Number(m[2]), group: m[3] }));
const equipmentIds = new Set(equipment.map((item) => item.id));
dupes(equipment.map((item) => item.id), 'equipment');
const groups = new Set(ids(read('src/data/taxonomy.ts'), /\{ id: '([a-z-]+)', domain:/g));
equipment.forEach((item) => { if (!groups.has(item.group)) errors.push(`equipment ${item.id}: нет группы ${item.group}`); });
const storyIds = new Set(readdirSync(join(root, 'src/data/stories')).filter((f) => !['index.ts', 'types.ts'].includes(f)).flatMap((f) => keysOf(read('src/data/stories/' + f))));
equipment.forEach((item) => { if (!storyIds.has(item.id)) errors.push(`equipment ${item.id}: нет описания в stories`); });

// Вооружение
const dataText = read('src/data/weapons/data.ts');
const extraText = read('src/data/weapons/catalog-extra.ts');
const fullIds = ids(dataText, /^\s*w\('([^']+)'/gm);
const compactIds = ids(extraText, /^\s*x\('([^']+)'/gm);
dupes([...fullIds, ...compactIds], 'weapons');
const weaponIds = new Set([...fullIds, ...compactIds]);
const texts = new Set(keysOf(read('src/data/weapons/texts.ts')));
const modsText = read('src/data/weapons/mods.ts');
const modCount = Object.fromEntries([...modsText.matchAll(/^\s{2}'([a-z0-9-]+)': \[([\s\S]*?)\n\s{2}\],/gm)].map((m) => [m[1], (m[2].match(/name: '/g) || []).length]));
const costText = read('src/data/weapons/costs.ts');
const costCount = Object.fromEntries([...costText.matchAll(/^\s{2}'([a-z0-9-]+)': c\(\d+, '[a-z]+', (\[\[.*\]\])\)/gm)].map((m) => [m[1], JSON.parse(m[2]).length]));
const warheadText = read('src/data/weapons/warheads.ts');
fullIds.forEach((id) => {
  if (!texts.has(id)) errors.push(`weapon ${id}: нет текста`);
  if (!modCount[id]) errors.push(`weapon ${id}: нет модификаций`);
  if (costCount[id] === undefined) errors.push(`weapon ${id}: нет стоимости`);
  else if (costCount[id] !== modCount[id]) errors.push(`weapon ${id}: стоимость на ${costCount[id]} версий, а модификаций ${modCount[id]}`);
  if (!warheadText.includes(`'${id}':`)) info.push(`weapon ${id}: сцена боевой части по умолчанию`);
});
const platformRefs = [...dataText.matchAll(/\[((?:'[a-z0-9-]+'(?:, )?)*)\]/g), ...extraText.matchAll(/\[((?:'[a-z0-9-]+'(?:, )?)*)\],\n/g)].flatMap((m) => ids(m[1], /'([a-z0-9-]+)'/g));
const categories = new Set(ids(read('src/data/weapons/taxonomy.ts'), /\{ id: '([a-z-]+)', name:/g));
[...new Set(platformRefs)].forEach((id) => { if (!equipmentIds.has(id) && !categories.has(id) && !['category', 'specs'].includes(id)) errors.push(`weapons: носитель ${id} не найден в технике`); });

// Связанные данные: ключи должны существовать
const mustBeEquipment = { 'src/data/ships.ts': 'ships', 'src/data/sensors.ts': 'sensors', 'src/data/hangars.ts': 'hangars', 'src/data/operations.ts': 'operations', 'src/data/videos.ts': 'videos' };
Object.entries(mustBeEquipment).forEach(([file, label]) => { if (existsSync(join(root, file))) keysOf(read(file)).forEach((id) => { if (!equipmentIds.has(id)) errors.push(`${label}: ключ ${id} не найден в технике`); }); });
const armorText = read('src/data/armor.ts');
const armorIds = new Set(ids(armorText.slice(armorText.indexOf('export const armorOf')), /'([a-z0-9-]+)': '/g));
armorIds.forEach((id) => { if (!equipmentIds.has(id)) errors.push(`armor: ${id} не найден в технике`); });
['src/data/weapons/flight.ts', 'src/data/weapons/guidance.ts', 'src/data/weapons/modRanges.ts'].forEach((file) => keysOf(read(file)).forEach((id) => { if (!weaponIds.has(id) && !/^(short|medium|long|ramjet|manpads|ir|sarh|arh|command|tvm)$/.test(id) && !id.startsWith('sam-') && id !== 'ir-link') errors.push(`${file}: ключ ${id} не найден в вооружении`); }));
const shellsText = read('src/data/shells.ts');
const gunIds = new Set(ids(shellsText, /\{ id: '([a-z0-9-]+)', name: '[^']*', country:/g));
ids(shellsText, /gun: '([a-z0-9-]+)'/g).forEach((id) => { if (!gunIds.has(id)) errors.push(`shells: орудие ${id} не описано`); });
const gunPlatforms = new Set([...shellsText.matchAll(/platforms: \[([^\]]*)\]/g)].flatMap((m) => ids(m[1], /'([a-z0-9-]+)'/g)));
gunPlatforms.forEach((id) => { if (!equipmentIds.has(id)) errors.push(`shells: носитель ${id} не найден в технике`); });
ids(shellsText, /weaponId: '([a-z0-9-]+)'/g).forEach((id) => { if (!weaponIds.has(id)) errors.push(`shells: weaponId ${id} не найден`); });
ids(read('src/data/ships.ts'), /weaponId: '([a-z0-9-]+)'/g).forEach((id) => { if (!weaponIds.has(id)) errors.push(`ships: weaponId ${id} не найден`); });

const variantsText = read('src/data/variants.ts');
keysOf(variantsText).forEach((id) => { if (!equipmentIds.has(id)) errors.push(`variants: ключ ${id} не найден в технике`); });
[...variantsText.matchAll(/(?:add|remove): \[([^\]]*)\]/g)].flatMap((m) => ids(m[1], /'([a-z0-9-]+)'/g)).forEach((id) => { if (!weaponIds.has(id)) errors.push(`variants: образец ${id} не найден в вооружении`); });
const detailText = read('src/data/armor-details.ts');
keysOf(detailText).forEach((id) => { if (!armorIds.has(id)) errors.push(`armor-details: у ${id} нет модели брони`); });

// Покрытие
const armed = new Set(platformRefs);
const sensorIds = new Set(keysOf(read('src/data/sensors.ts')));
const shipsText = read('src/data/ships.ts');
const schemeKeys = (text) => [...text.matchAll(/^\s{2}'([a-z0-9-]+)': \{\n\s+shapes:/gm)].map((m) => m[1]);
const fleetText = read('src/data/ships-fleet.ts');
const shipIds = new Set([...schemeKeys(shipsText), ...schemeKeys(fleetText)]);
schemeKeys(fleetText).forEach((id) => { if (!equipmentIds.has(id)) errors.push(`ships-fleet: ключ ${id} не найден в технике`); });
ids(fleetText, /weaponId: '([a-z0-9-]+)'/g).forEach((id) => { if (!weaponIds.has(id)) errors.push(`ships-fleet: weaponId ${id} не найден`); });
for (const text of [shipsText, fleetText]) for (const block of text.split(/\n\s{2}'[a-z0-9-]+': \{\n\s+shapes:/).slice(1)) { const seen = new Set(); for (const mod of block.matchAll(/\bm\('([a-z0-9-]+)'|P\.([a-zA-Z0-9]+)\((?:'([a-z0-9-]+)')?/g)) { const key = mod[1] ?? mod[3] ?? mod[2]; if (['helo', 'sonar'].includes(key)) continue; if (seen.has(key)) info.push(`схема корабля: возможный повтор модуля ${key}`); seen.add(key); } }
const launchKeys = new Set(ids(shipsText.slice(shipsText.indexOf('export const launchScenes')), /'([a-z0-9-]+)': \[/g));
const hangarIds = new Set(keysOf(read('src/data/hangars.ts')));
const photoIds = existsSync(join(root, 'public/bg/items/manifest.json')) ? new Set(Object.entries(JSON.parse(read('public/bg/items/manifest.json'))).filter(([, v]) => v.file).map(([k]) => k)) : new Set();
const weaponPhotoIds = existsSync(join(root, 'public/bg/weapons/manifest.json')) ? new Set(Object.entries(JSON.parse(read('public/bg/weapons/manifest.json'))).filter(([, v]) => v.file).map(([k]) => k)) : new Set();
const missing = (label, list) => info.push(`${label}: ${list.length}${list.length ? ' (' + list.slice(0, 40).join(', ') + (list.length > 40 ? ', ...' : '') + ')' : ''}`);
const inGroup = (...names) => equipment.filter((item) => names.includes(item.group)).map((item) => item.id);
missing('Бронетехника без модели брони', inGroup('tanks', 'ifv').filter((id) => !armorIds.has(id)));
missing('Танки, БМП и артиллерия без снарядов', inGroup('tanks', 'ifv', 'artillery').filter((id) => !gunPlatforms.has(id)));
missing('ЗРК и РЛС без схемы радаров', inGroup('airdef', 'sensors').filter((id) => !sensorIds.has(id)));
missing('Корабли без схемы систем', inGroup('carriers', 'surface', 'frigates', 'amphibious').filter((id) => !shipIds.has(id)));
missing('Корабли и подлодки без схемы пуска ракет', inGroup('carriers', 'surface', 'frigates', 'amphibious', 'submarines').filter((id) => !launchKeys.has(id)));
missing('Авианосцы без ангара', inGroup('carriers').filter((id) => !hangarIds.has(id)));
missing('Техника без привязанного вооружения', equipment.map((item) => item.id).filter((id) => !armed.has(id) && !gunPlatforms.has(id)));
missing('Техника без своего фото', equipment.map((item) => item.id).filter((id) => !photoIds.has(id)));
missing('Вооружение без своего фото', [...weaponIds].filter((id) => !weaponPhotoIds.has(id)));

console.log(`Техника: ${equipment.length}. Вооружение: ${weaponIds.size} (полных записей ${fullIds.length}, сокращённых ${compactIds.length}).`);
info.filter((line) => !line.startsWith('weapon ')).forEach((line) => console.log('  ' + line));
const defaults = info.filter((line) => line.startsWith('weapon '));
if (defaults.length) console.log(`  Полные записи со сценой боевой части по умолчанию: ${defaults.length}`);
if (errors.length) { console.error('\nОшибки:\n' + errors.map((e) => '  ' + e).join('\n')); process.exit(1); }
console.log('Ошибок связности нет.');
