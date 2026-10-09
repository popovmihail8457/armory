/**
 * Загрузка фоновых фотографий с Wikimedia Commons.
 * Берутся только JPEG шириной от 1600 px с лицензией Public domain или CC0.
 * Запуск: node scripts/fetch-photos.mjs <набор>   где набор: items | weapons | pages
 * Автор и лицензия пишутся в manifest.json рядом с файлами, оттуда они попадают на страницу «О данных».
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Первый аргумент: папка в public/bg. Второй (необязательный): набор запросов, если он называется иначе. */
const set = process.argv[2];
const querySet = process.argv[3] ?? set;
const here = dirname(fileURLToPath(import.meta.url));
const sets = JSON.parse(readFileSync(join(here, 'photo-queries.json'), 'utf8'));
if (!sets[querySet]) { console.error('Набор не найден. Доступны:', Object.keys(sets).join(', ')); process.exit(1); }
const outDir = join(here, '..', 'public', 'bg', set);
mkdirSync(outDir, { recursive: true });
const manifestPath = join(outDir, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

const api = 'https://commons.wikimedia.org/w/api.php';
const UA = { 'User-Agent': 'ArmorySiteResearch/1.0 (educational project)' };
const strip = (s) => (s ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const used = new Set(Object.values(manifest).map((m) => m.title).filter(Boolean));
const okLicense = (lic) => /^(public domain|cc0|pd[- ]|cc pd)/i.test(lic);
const bad = /museum|memorial|toy|model|lego|diorama|cropped|poster|cockpit|interior|stamp|coin|diagram|drawing|painting|monument|statue|replica|mock-?up|artist|concept|rendering|illustration|black.?white|\bbw\b|logo|patch|insignia|emblem|\bmap\b|chart|schematic|cutaway/i;

async function getJson(url) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await sleep(2500);
    try { return JSON.parse(await (await fetch(url, { headers: UA })).text()); } catch { console.log('  wait 20s'); await sleep(20000); }
  }
  return null;
}

async function find(queries, rx) {
  for (const q of queries) {
    const url = `${api}?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=25&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1920&origin=*`;
    const data = await getJson(url);
    const pages = Object.values(data?.query?.pages ?? {}).sort((a, b) => a.index - b.index);
    for (const p of pages) {
      const ii = p.imageinfo?.[0];
      if (!ii || ii.mime !== 'image/jpeg' || ii.width < 1600 || ii.width / ii.height < 1.3) continue;
      const title = p.title.replace(/^File:/, '');
      if (used.has(p.title) || !rx.test(title) || bad.test(title)) continue;
      const meta = ii.extmetadata ?? {};
      const license = strip(meta.LicenseShortName?.value);
      if (!okLicense(license)) continue;
      return { title: p.title, thumb: ii.thumburl.split('?')[0], page: ii.descriptionurl, license, author: strip(meta.Artist?.value).slice(0, 120), width: ii.width, query: q };
    }
  }
  return null;
}

async function download(url, file) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await sleep(2500);
    let res;
    try { res = await fetch(url, { headers: UA }); } catch { console.log('  net error, retry'); await sleep(15000); continue; }
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf[0] === 0xff && buf[1] === 0xd8 && buf.length < 4_000_000) { writeFileSync(file, buf); return buf.length; }
      return -1;
    }
    console.log('  download status', res.status, 'wait 20s');
    await sleep(20000);
  }
  return -1;
}

const save = () => writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
let total = 0;
const missing = [];
for (const [id, [queries, pattern]] of Object.entries(sets[querySet])) {
  const name = `${id}.jpg`;
  if (manifest[id]?.file && existsSync(join(outDir, name))) continue;
  const cand = await find(queries, new RegExp(pattern, 'i'));
  if (!cand) { console.log('MISSING', id); missing.push(id); continue; }
  const size = await download(cand.thumb, join(outDir, name));
  if (size < 0) { console.log('FAILED', id, cand.title); missing.push(id); continue; }
  used.add(cand.title);
  total += size;
  manifest[id] = { file: name, bytes: size, ...cand };
  save();
  console.log('OK', id, '|', cand.title.slice(0, 70), '|', cand.license, '|', Math.round(size / 1024) + ' KB');
}
save();
console.log('Готово. Загружено за запуск:', Math.round(total / 1024), 'КБ. Без фото:', missing.join(', ') || 'нет');
