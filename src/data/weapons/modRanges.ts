import { flightMods } from './flight';
import { weaponMods } from './mods';
import type { WeaponData } from './types';

/**
 * Дальность по версиям, км, порядок как в mods.ts. null: открытых данных по версии нет.
 * Для ракет «воздух-воздух» и зенитных значения берутся из flightMods, здесь остальные классы.
 * Образцы, у которых версии по дальности не различаются или данные ненадёжны, сюда не включены.
 */
const MOD_RANGES: Record<string, (number | null)[]> = {
  'gbu-31': [28, 28, 28, 28, 72],
  'harpoon': [90, 124, 124],
  'exocet': [42, 50, 70, 180],
  'kh-35': [130, 260],
  'tomahawk': [2500, 460, 1300, 1600, 1600],
  'storm-shadow': [560, 560, 1000],
  'jassm': [370, 925, null],
  'bgm-71': [3, 3.75, 3.75, 3.75, 3.75],
  '9m133': [5.5, 5.5, 8],
  'hawk-missile': [25, 40],
  'brimstone': [20, 20, 60],
  'agm-45': [16, 40],
  'am39': [50, 70],
  'nsm': [185, 280],
  'atacms-missile': [165, 300, 140, 300],
  'agm-86': [2400, 1100],
  'kh-55': [2500, 3000],
  'm26': [32, 45],
  'kh-31': [110, 70, 250],
  'kh-59': [40, 115, 285],
  'kalibr': [300, 1500],
  'p-15': [40, 40, 80],
  'kh-22': [500, 500, null],
  'moskit': [120, 160],
  'bazalt': [550, 700],
  'asroc': [10, 22],
};

/** Дальность по версиям для графика во вкладках модификаций. undefined: показывать нечего. */
export function modRangesOf(weapon: WeaponData): (number | null)[] | undefined {
  const count = (weaponMods[weapon.id] ?? []).length;
  const flight = flightMods[weapon.id];
  const ranges = flight && weapon.specs.range !== undefined
    ? flight.map((spec) => (spec === null ? null : spec.rangeKm ?? weapon.specs.range!))
    : MOD_RANGES[weapon.id];
  if (!ranges || ranges.length !== count) return undefined;
  const known = ranges.filter((value): value is number => value !== null);
  return known.length > 1 && new Set(known).size > 1 ? ranges : undefined;
}
