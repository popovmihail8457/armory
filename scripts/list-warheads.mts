/**
 * Таблица «образец: сцена боевой части» для ручной проверки соответствия.
 * Запуск: node --experimental-strip-types scripts/list-warheads.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'weapons');
const work = join(tmpdir(), 'armory-warheads');
mkdirSync(work, { recursive: true });
for (const file of ['types.ts', 'data.ts', 'catalog-extra.ts', 'warheads.ts']) {
  writeFileSync(join(work, file), readFileSync(join(root, file), 'utf8').replace(/from '(\.[^']*)'/g, "from '$1.ts'"));
}
const { weapons } = await import(pathToFileURL(join(work, 'data.ts')).href);
const { warheadScenes } = await import(pathToFileURL(join(work, 'warheads.ts')).href);
const groups: Record<string, string[]> = {};
for (const weapon of weapons) {
  const scenes = warheadScenes(weapon, 1);
  const key = `${weapon.category} -> ${scenes[0] ?? 'нет сцены'}`;
  (groups[key] ??= []).push(weapon.id);
}
for (const key of Object.keys(groups).sort()) console.log(key.padEnd(34), groups[key].length, groups[key].join(', '));
