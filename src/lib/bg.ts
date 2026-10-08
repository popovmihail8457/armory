import type { EraId } from '../data/taxonomy';

export interface BgEntry {
  file?: string;
  missing?: boolean;
  title?: string;
  page?: string;
  license?: string;
  author?: string;
}

const found = import.meta.glob('../../public/bg/manifest.json', { eager: true, import: 'default' });

export const bgManifest = (Object.values(found)[0] ?? {}) as Record<string, BgEntry>;

const DOMAIN_ORDER = ['aviation', 'fleet', 'ground'];

const urlOf = (entry?: BgEntry): string | undefined => (entry?.file ? `/bg/${entry.file}` : undefined);

/** Фото для страницы: сначала группа, затем раздел периода, затем любой раздел периода. */
export function bgFor(era?: EraId, domain?: string, group?: string): string | undefined {
  if (!era) return undefined;
  if (domain && group) {
    const exact = urlOf(bgManifest[`${era}/${domain}/${group}`]);
    if (exact) return exact;
  }
  const domains = domain ? [domain, ...DOMAIN_ORDER.filter((d) => d !== domain)] : DOMAIN_ORDER;
  for (const d of domains) {
    const key = Object.keys(bgManifest).find((k) => k.startsWith(`${era}/${d}/`) && bgManifest[k].file);
    if (key) return urlOf(bgManifest[key]);
  }
  return undefined;
}

/** Сопоставление моделей с уже скачанными фото группы, на которых изображена именно эта машина. */
const ITEM_PHOTO_KEYS: Record<string, string> = {
  'm1-abrams': 'late/ground/tanks',
  'arleigh-burke': 'post/fleet/surface',
  'nimitz': 'late/fleet/carriers',
  'a-10': 'late/aviation/bombers',
  'f-22': 'post/aviation/fighters',
  'bmp-1': 'late/ground/ifv',
  'leopard-2': 'post/ground/tanks',
  'pzh-2000': 'post/ground/artillery',
  'ah-64': 'modern/aviation/helicopters',
  'b-2': 'post/aviation/bombers',
  'mq-9': 'modern/aviation/uav',
  'mq-1': 'post/aviation/uav',
  'c-17': 'post/aviation/transport',
  'typhoon': 'late/fleet/submarines',
  'virginia': 'post/fleet/submarines',
  'gerald-ford': 'modern/fleet/carriers',
  'k2': 'modern/ground/tanks',
  'puma': 'modern/ground/ifv',
  'himars': 'post/ground/mlrs',
  'm2-bradley': 'post/ground/ifv',
  'f-35a': 'modern/aviation/fighters',
  'f-15': 'late/aviation/fighters',
  'b-52': 'modern/aviation/bombers',
  'm109': 'late/ground/artillery',
  'm270': 'late/ground/mlrs',
  'patriot': 'late/ground/airdef',
  'nautilus': 'early/fleet/submarines',
  'iwo-jima': 'early/fleet/amphibious',
  'wasp': 'late/fleet/amphibious',
  'america': 'modern/fleet/amphibious',
  'mistral': 'post/fleet/amphibious',
  'forrest-sherman': 'early/fleet/surface',
  'kirov': 'late/fleet/surface',
  'de-gaulle': 'post/fleet/carriers',
  'm113': 'early/ground/ifv',
  's-75': 'early/ground/airdef',
  'uh-1': 'late/aviation/helicopters',
  'il-76': 'late/aviation/transport',
};

const itemFound = import.meta.glob('../../public/bg/items/manifest.json', { eager: true, import: 'default' });
export const itemManifest = (Object.values(itemFound)[0] ?? {}) as Record<string, BgEntry>;

/** Фото именно этой модели, иначе ничего: чужую технику на фоне страницы модели не показываем. */
export function bgForItem(id: string): string | undefined {
  const own = itemManifest[id];
  if (own?.file) return `/bg/items/${own.file}`;
  const key = ITEM_PHOTO_KEYS[id];
  return key ? urlOf(bgManifest[key]) : undefined;
}