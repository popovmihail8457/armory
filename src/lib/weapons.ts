import { categoryPrinciple } from '../data/weapons/taxonomy';
import { weapons } from '../data/weapons/data';
import { weaponTexts } from '../data/weapons/texts';
import { weaponCategories } from '../data/weapons/taxonomy';
import type { WeaponData, WeaponCategory, WeaponMetricId, WeaponText } from '../data/weapons/types';
import { eraOf } from './data';

export { weapons, weaponCategories };

export const weaponById = (id: string): WeaponData => {
  const found = weapons.find((weapon) => weapon.id === id);
  if (!found) throw new Error(`Неизвестное вооружение: ${id}`);
  return found;
};

export const categoryById = (id: string): WeaponCategory => {
  const found = weaponCategories.find((category) => category.id === id);
  if (!found) throw new Error(`Неизвестная категория: ${id}`);
  return found;
};

export const weaponText = (id: string): WeaponText => {
  const found = weaponTexts[id];
  if (found) return found;
  const weapon = weapons.find((item) => item.id === id);
  if (!weapon?.brief) throw new Error(`Нет текста для вооружения: ${id}`);
  return { summary: weapon.brief, history: '', principle: categoryPrinciple[weapon.category] ?? '', features: [], fact: '' };
};

export const weaponsOfCategory = (categoryId: string): WeaponData[] =>
  weapons.filter((weapon) => weapon.category === categoryId || weapon.also?.includes(categoryId as WeaponCategory['id'])).sort((a, b) => a.year - b.year);

export const classesOf = (weapon: WeaponData): WeaponCategory[] =>
  [weapon.category, ...(weapon.also ?? [])].map((id) => categoryById(id));

export const weaponsForPlatform = (itemId: string): WeaponData[] =>
  weapons.filter((weapon) => weapon.platforms.includes(itemId)).sort((a, b) => a.year - b.year);

export const weaponUrl = (weapon: WeaponData): string => `/weapons/${weapon.id}/`;

export const weaponEra = (weapon: WeaponData) => eraOf(weapon.year);

export function rankInCategory(weapon: WeaponData, metric: WeaponMetricId): { rank: number; total: number } | null {
  const value = weapon.specs[metric];
  if (value === undefined) return null;
  const peers = weaponsOfCategory(weapon.category).filter((peer) => peer.specs[metric] !== undefined);
  const rank = peers.filter((peer) => (peer.specs[metric] as number) > value).length + 1;
  return { rank, total: peers.length };
}
