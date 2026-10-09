import { calibrate, type FlightProfile, type FlightScenario } from '../../lib/missileFlight';
import { weapons } from './data';
import { weaponMods } from './mods';
import type { WeaponData } from './types';

export type FlightKind = 'short' | 'medium' | 'long' | 'ramjet' | 'manpads' | 'sam-short' | 'sam-medium' | 'sam-long';
export type FlightGroup = 'air' | 'ground';

interface KindPreset {
  group: FlightGroup;
  label: string;
  /** Типовое время работы двигателя для класса, с. */
  burn: number;
  /** Угол горки, градусы. */
  loft: number;
  /** Условия, в которых модель сверяется с опубликованной дальностью. */
  reference: Omit<FlightScenario, 'distance'>;
}

const AIR_REFERENCE = { launchAlt: 12000, launchSpeed: 450, targetAlt: 12000 };
const ground = (targetAlt: number) => ({ launchAlt: 0, launchSpeed: 20, targetAlt });

export const flightKinds: Record<FlightKind, KindPreset> = {
  short: { group: 'air', label: 'Ближнего боя', burn: 5, loft: 0, reference: AIR_REFERENCE },
  medium: { group: 'air', label: 'Средней дальности', burn: 8, loft: 12, reference: AIR_REFERENCE },
  long: { group: 'air', label: 'Большой дальности', burn: 25, loft: 22, reference: AIR_REFERENCE },
  ramjet: { group: 'air', label: 'С прямоточным двигателем', burn: 40, loft: 10, reference: AIR_REFERENCE },
  manpads: { group: 'ground', label: 'Переносной комплекс', burn: 6, loft: 0, reference: ground(2000) },
  'sam-short': { group: 'ground', label: 'Малой дальности', burn: 6, loft: 5, reference: ground(4000) },
  'sam-medium': { group: 'ground', label: 'Средней дальности', burn: 12, loft: 15, reference: ground(10000) },
  'sam-long': { group: 'ground', label: 'Большой дальности', burn: 14, loft: 25, reference: ground(20000) },
};

/** Класс профиля полёта для образцов каталога. Образцы без записи на графики не попадают. */
export const flightKindOf: Record<string, FlightKind> = {
  'aim-9': 'short', 'r-73': 'short', 'iris-t': 'short', 'asraam': 'short', 'r-60': 'short', 'python-5': 'short',
  'aim-7': 'medium', 'aim-120': 'medium', 'r-27': 'medium', 'r-77': 'medium', 'mica': 'medium', 'super-530': 'medium', 'r-23': 'medium',
  'aim-54': 'long', 'r-33': 'long', 'r-37': 'long',
  'meteor': 'ramjet',
  'stinger-missile': 'manpads', '9m39': 'manpads', 'starstreak-missile': 'manpads', 'mistral-missile': 'manpads',
  'redeye-missile': 'manpads', '9m32': 'manpads',
  '9m330': 'sam-short', '57e6': 'sam-short', 'ram': 'sam-short', 'rim-7': 'sam-short', '9m33': 'sam-short',
  'hawk-missile': 'sam-medium', '9m38': 'sam-medium', 'essm': 'sam-medium', 'v-750': 'sam-medium', '5v27': 'sam-medium', '3m9': 'sam-medium',
  'pac-2': 'sam-long', '48n6': 'sam-long', '40n6': 'sam-long', 'sm-2': 'sam-long', 'aster-30': 'sam-long', 'sm-6': 'sam-long',
};

const AUTO_CATEGORIES = new Set(['aam', 'sam', 'sea-air', 'manpads']);

/** Класс полёта: явный из таблицы, иначе по классу и дальности образца. */
function kindOf(weapon: WeaponData): FlightKind | undefined {
  if (flightKindOf[weapon.id]) return flightKindOf[weapon.id];
  const range = weapon.specs.range;
  if (!AUTO_CATEGORIES.has(weapon.category) || range === undefined) return undefined;
  if (weapon.category === 'manpads') return 'manpads';
  if (weapon.category === 'aam') return range <= 30 ? 'short' : range <= 120 ? 'medium' : 'long';
  return range <= 12 ? 'sam-short' : range <= 60 ? 'sam-medium' : 'sam-long';
}

/**
 * Калибр, если он не опубликован: оценка по массе по степенной зависимости, снятой с ракет с известным калибром.
 * Сопротивление всё равно подгоняется под опубликованную дальность, поэтому оценка влияет на форму графика слабо.
 */
const estimateDiameter = (mass: number): number => Math.round(127 * Math.pow(mass / 85, 0.4));

/** Отличия версии от базовой записи каталога. Незаполненные поля берутся из каталога. */
export interface FlightModSpec {
  rangeKm?: number;
  speedKmh?: number;
  mass?: number;
  diameter?: number;
}

const same: FlightModSpec = {};
const r = (rangeKm: number, extra: FlightModSpec = {}): FlightModSpec => ({ rangeKm, ...extra });

/**
 * Дальность и скорость по версиям, порядок как в mods.ts.
 * null: отдельных открытых данных по версии нет, значения не придумываются.
 */
export const flightMods: Record<string, (FlightModSpec | null)[]> = {
  'aim-9': [r(4.8, { speedKmh: 1800, mass: 70 }), null, same, same, r(35)],
  'r-73': [same, same, r(40)],
  'iris-t': [same, null],
  'asraam': [same, null],
  'r-60': [same, r(10)],
  'python-5': [r(15, { speedKmh: 3700 }), r(15, { speedKmh: 3700 }), same],
  'aim-7': [null, r(30, { speedKmh: 4300 }), same, same, same],
  'aim-120': [r(70), r(70), same, r(160)],
  'r-27': [same, r(70), r(130, { mass: 350 })],
  'r-77': [same, r(110)],
  'mica': [same, same],
  'super-530': [r(25), same],
  'aim-54': [same, same, same],
  'r-33': [same, r(160)],
  'r-37': [null, same],
  'meteor': [same],
  'stinger-missile': [same, same, same],
  '9m39': [r(5), same, r(6)],
  'starstreak-missile': [same, null],
  'mistral-missile': [r(6, { speedKmh: 2900 }), r(6.5, { speedKmh: 3300 }), r(7, { speedKmh: 3300 })],
  'redeye-missile': [null, same],
  '9m32': [same, r(4.2, { speedKmh: 1800 })],
  '9m330': [same, same],
  '57e6': [r(18), same],
  'ram': [same, same, null],
  'rim-7': [null, same, same],
  '9m33': [same, same, r(15)],
  '9m38': [r(25), same, r(45, { speedKmh: 4300 })],
  'essm': [same, same, same],
  'v-750': [same, same, r(43)],
  '5v27': [r(15), same],
  '3m9': [same, same],
  'pac-2': [null, same, same, r(35, { mass: 312, diameter: 255 }), null],
  '48n6': [same, r(200), r(250)],
  'sm-2': [r(74), same, same],
  'aster-30': [same, r(150)],
  'sm-6': [same, same, null],
  'r-23': [same, null, r(50)],
};

export interface FlightModEntry {
  name: string;
  /** null: по версии нет отдельных данных. */
  profile: FlightProfile | null;
  rangeKm?: number;
  speedKmh?: number;
}

export interface FlightEntry {
  id: string;
  name: string;
  kind: FlightKind;
  kindLabel: string;
  group: FlightGroup;
  /** Опубликованная дальность, км. */
  rangeKm: number;
  /** Опубликованная скорость, км/ч. */
  speedKmh?: number;
  profile: FlightProfile;
  /** Профили по версиям в порядке вкладок модификаций. Пусто, если версии не описаны. */
  mods: FlightModEntry[];
}

const round = (value: number, digits: number) => Number(value.toFixed(digits));

/** Профили полёта, сверенные с опубликованными дальностью и скоростью. Считаются один раз при сборке. */
export const flightEntries: FlightEntry[] = weapons.flatMap((weapon) => {
  const kind = kindOf(weapon);
  const { mass, range, speed } = weapon.specs;
  if (!kind || mass === undefined || range === undefined) return [];
  const diameter = weapon.specs.diameter ?? estimateDiameter(mass);
  const preset = flightKinds[kind];
  let profile: FlightProfile;
  try {
    profile = calibrate(
    { mass, diameter, burn: preset.burn, loft: preset.loft },
    preset.reference,
    range * 1000,
    speed !== undefined ? speed / 3.6 : undefined,
  );
  } catch {
    return [];
  }
  const clean = { ...profile, propFrac: round(profile.propFrac, 3), cd: round(profile.cd, 3) };
  const names = weaponMods[weapon.id] ?? [];
  const specs = flightMods[weapon.id] ?? names.map(() => null);
  if (specs.length > 0 && specs.length !== names.length) throw new Error(`flightMods['${weapon.id}']: версий ${specs.length}, а в mods.ts ${names.length}`);
  const mods: FlightModEntry[] = specs.map((spec, i) => {
    if (spec === null) return { name: names[i].name, profile: null };
    if (Object.keys(spec).length === 0) return { name: names[i].name, profile: clean, rangeKm: range, speedKmh: speed };
    const modRange = spec.rangeKm ?? range;
    const modSpeed = spec.speedKmh ?? speed;
    const fitted = calibrate(
      { mass: spec.mass ?? mass, diameter: spec.diameter ?? diameter, burn: preset.burn, loft: preset.loft },
      preset.reference,
      modRange * 1000,
      modSpeed !== undefined ? modSpeed / 3.6 : undefined,
    );
    return { name: names[i].name, profile: { ...fitted, propFrac: round(fitted.propFrac, 3), cd: round(fitted.cd, 3) }, rangeKm: modRange, speedKmh: modSpeed };
  });
  return [{
    id: weapon.id,
    name: weapon.name,
    kind,
    kindLabel: preset.label,
    group: preset.group,
    rangeKm: range,
    speedKmh: speed,
    profile: clean,
    mods,
  }];
});

export const flightEntryOf = (weaponId: string): FlightEntry | undefined => flightEntries.find((entry) => entry.id === weaponId);
