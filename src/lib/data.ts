import { eras, domains, groups, type EraId, type Era, type Domain, type Group } from '../data/taxonomy';
import { equipment, type Equipment } from '../data/equipment';

export const YEAR_MIN = 1947;
export const YEAR_MAX = 2026;

export function eraOf(year: number): Era {
  if (year < eras[0].from) return eras[0];
  return eras.find((era) => year >= era.from && year <= era.to) ?? eras[eras.length - 1];
}

export const eraById = (id: string): Era => {
  const found = eras.find((era) => era.id === id);
  if (!found) throw new Error(`Неизвестный период: ${id}`);
  return found;
};

export const domainById = (id: string): Domain => {
  const found = domains.find((domain) => domain.id === id);
  if (!found) throw new Error(`Неизвестный раздел: ${id}`);
  return found;
};

export const groupById = (id: string): Group => {
  const found = groups.find((group) => group.id === id);
  if (!found) throw new Error(`Неизвестная группа: ${id}`);
  return found;
};

export const itemsOfGroup = (groupId: string): Equipment[] =>
  equipment.filter((item) => item.group === groupId).sort((a, b) => a.year - b.year);

export const itemsIn = (eraId: EraId, groupId: string): Equipment[] =>
  itemsOfGroup(groupId).filter((item) => eraOf(item.year).id === eraId);

export const groupsOfDomain = (domainId: string): Group[] =>
  groups.filter((group) => group.domain === domainId);

export const countIn = (eraId: EraId, domainId?: string): number =>
  equipment.filter((item) => {
    if (eraOf(item.year).id !== eraId) return false;
    return domainId ? groupById(item.group).domain === domainId : true;
  }).length;

export const itemUrl = (item: Equipment): string => `/equipment/${item.id}/`;

export const groupUrl = (eraId: string, group: Group): string =>
  `/periods/${eraId}/${group.domain}/${group.id}/`;

const numberFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

export const formatNumber = (value: number): string => numberFormat.format(value);

export function rankInGroup(item: Equipment, metric: keyof Equipment['specs']): { rank: number; total: number } | null {
  const value = item.specs[metric];
  if (value === undefined) return null;
  const peers = itemsOfGroup(item.group).filter((peer) => peer.specs[metric] !== undefined);
  const rank = peers.filter((peer) => (peer.specs[metric] as number) > value).length + 1;
  return { rank, total: peers.length };
}
