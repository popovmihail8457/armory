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
