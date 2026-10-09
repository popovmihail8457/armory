/**
 * Запуск произвольного скрипта поверх данных справочника без сборки сайта.
 * Копирует src/data, src/lib и src/components-независимые модули во временную папку,
 * дописывая расширения .ts в импортах, и запускает файл-сценарий.
 * Запуск: node --experimental-strip-types scripts/run-ts.mts scripts/сценарий.mts
 * Сценарий импортирует модули через process.env.ARMORY_SRC (путь к копии src).
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const work = join(tmpdir(), 'armory-run');
const fix = (text: string) => text.replace(/(from\s+|import\s*\()'(\.[^']*)'/g, (match, head, path) => (path.endsWith('.ts') || path.endsWith('.astro') ? match : `${head}'${path}.ts'`));

function copy(dir: string) {
  for (const name of readdirSync(join(root, dir))) {
    const path = join(root, dir, name);
    if (statSync(path).isDirectory()) { copy(join(dir, name)); continue; }
    if (!name.endsWith('.ts')) continue;
    mkdirSync(join(work, dir), { recursive: true });
    writeFileSync(join(work, dir, name), fix(readFileSync(path, 'utf8')));
  }
}
['data', 'lib'].forEach(copy);
process.env.ARMORY_SRC = work;
const script = resolve(process.argv[2]);
await import(pathToFileURL(script).href);
