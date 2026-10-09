const src = process.env.ARMORY_SRC!;
const { pathToFileURL } = await import('node:url');
const load = (p: string) => import(pathToFileURL(src + '/' + p).href);
const { equipment } = await load('data/equipment.ts');
const { stories } = await load('data/stories/index.ts');
const { variants } = await load('data/variants.ts');
let n = 0;
for (const item of equipment) {
  if (variants[item.id]) continue;
  const names: string[] = stories[item.id]?.variants ?? [];
  if (names.length < 2) continue;
  n += 1;
  console.log(item.id, '|', item.wiki, '|', names.join(' ; '));
}
console.log('total', n);
