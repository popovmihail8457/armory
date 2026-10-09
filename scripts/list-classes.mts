/**
 * Таблица «образец: сцена боевой части» для ручной проверки соответствия.
 * Запуск: node --experimental-strip-types scripts/list-classes.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'weapons');
const work = join(tmpdir(), 'armory-classes');
mkdirSync(work, { recursive: true });
for (const file of ['types.ts', 'data.ts', 'catalog-extra.ts', 'warheads.ts', 'classes.ts']) {
  writeFileSync(join(work, file), readFileSync(join(root, file), 'utf8').replace(/from '(\.[^']*)'/g, "from '$1.ts'"));
}
const { weapons } = await import(pathToFileURL(join(work, 'data.ts')).href);
const groups: Record<string, string[]> = {};
for (const weapon of weapons) (groups[weapon.category] ??= []).push(weapon.id);
for (const key of Object.keys(groups).sort()) console.log(key.padEnd(20), groups[key].length, groups[key].join(", "));
