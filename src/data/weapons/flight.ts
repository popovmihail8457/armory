import { calibrate, type FlightProfile, type FlightScenario } from '../../lib/missileFlight';
import { weapons } from './data';

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
  'aim-7': 'medium', 'aim-120': 'medium', 'r-27': 'medium', 'r-77': 'medium', 'mica': 'medium', 'super-530': 'medium',
  'aim-54': 'long', 'r-33': 'long', 'r-37': 'long',
  'meteor': 'ramjet',
  'stinger-missile': 'manpads', '9m39': 'manpads', 'starstreak-missile': 'manpads', 'mistral-missile': 'manpads',
  'redeye-missile': 'manpads', '9m32': 'manpads',
  '9m330': 'sam-short', '57e6': 'sam-short', 'ram': 'sam-short', 'rim-7': 'sam-short', '9m33': 'sam-short',
  'hawk-missile': 'sam-medium', '9m38': 'sam-medium', 'essm': 'sam-medium', 'v-750': 'sam-medium', '5v27': 'sam-medium', '3m9': 'sam-medium',
  'pac-2': 'sam-long', '48n6': 'sam-long', '40n6': 'sam-long', 'sm-2': 'sam-long', 'aster-30': 'sam-long', 'sm-6': 'sam-long',
};

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
}

const round = (value: number, digits: number) => Number(value.toFixed(digits));

/** Профили полёта, сверенные с опубликованными дальностью и скоростью. Считаются один раз при сборке. */
export const flightEntries: FlightEntry[] = weapons.flatMap((weapon) => {
  const kind = flightKindOf[weapon.id];
  const { mass, diameter, range, speed } = weapon.specs;
  if (!kind || mass === undefined || diameter === undefined || range === undefined) return [];
  const preset = flightKinds[kind];
  const profile = calibrate(
    { mass, diameter, burn: preset.burn, loft: preset.loft },
    preset.reference,
    range * 1000,
    speed !== undefined ? speed / 3.6 : undefined,
  );
  return [{
    id: weapon.id,
    name: weapon.name,
    kind,
    kindLabel: preset.label,
    group: preset.group,
    rangeKm: range,
    speedKmh: speed,
    profile: { ...profile, propFrac: round(profile.propFrac, 3), cd: round(profile.cd, 3) },
  }];
});

export const flightEntryOf = (weaponId: string): FlightEntry | undefined => flightEntries.find((entry) => entry.id === weaponId);
