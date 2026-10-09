import type { WeaponCategoryId, WeaponData } from './types';

/**
 * Уточнение класса образца. В исходных записях все стволы лежат в одном классе «guns»,
 * а малые ракеты распределены по общим классам. Здесь они переходят в рабочие классы справочника.
 */

/** Малые управляемые ракеты и боеприпасы «воздух-поверхность» (УРВП). */
const LIGHT_AGM = new Set(['agm-114', 'agm-176', 'apkws', 'mam-l', 'mam-t', 'cirit', 'umtas', 'hj-10', 'pars3-lr', 'blue-arrow-7', 'kab-20', 'brimstone', 'agm-179', 'jagm', 'gbu-44', 'lmur']);
/** Ракеты ПЗРК. */
const MANPADS = new Set(['stinger-missile', '9m32', '9m39', '9m342', '9m336', 'redeye-missile', 'mistral-missile', 'starstreak-missile', 'blowpipe', 'rbs-70', 'rbs-90', 'piorun-missile', 'qw-1', 'anza', 'javelin-sam', 'starburst', '9m36', 'fn-6']);

const NAVAL = new Set(['mk-45', 'mk-42', 'mk-7', 'mk-8', 'ak-230', 'ak-726', 'ak-100', 'ak-176', 'ak-130', 'oto-76', 'oto-127', 'bofors-57', 'mk-110', 'mk-38', 'ak-306', 'a-190', 'millennium', 'phalanx', 'goalkeeper', 'kortik', 'ak-630']);
const AIRCRAFT = new Set(['m61', 'gau-8', 'gsh-23', 'gsh-30-1', 'gsh-30-2', 'gsh-6-23', 'gsh-6-30', 'gsh-301', 'aden', 'defa-550', 'bk-27', 'mk-213', 'gau-12', 'gau-22', 'gau-19', 'nr-23', 'nr-30', 'n-37', 'am-23', 'm39', 'mk-12', 'm197', 'mg-151', 'm230', 'giat-30', 'yakb-12-7', 'm134']);
const TANK = new Set(['d-10t', 'u-5ts', 'd-56t', 'm32-gun', 'm81', 'l11', 'l30', 'cn120-26', '2a82', 'zpt-98', '2a46', 'rh-120', 'l7']);

/** Пулемёты, чьё описание не содержит слова «пулемёт» в типе. */
const MACHINE_GUNS = new Set(['m2hb', 'kpv', 'dshkm', 'nsv', 'kord', 'm134', 'gau-19']);

/** Безоткатные орудия и ручные противотанковые гранатомёты. */
const LAUNCHERS = new Set(['carl-gustaf', 'm40-rr', 'b-10', 'spg-9', 'pg-7vr']);
const AUTOCANNON_IDS = new Set(['2a42', 'rh-202-gun', 'zpu-4']);

const has = (weapon: WeaponData, pattern: RegExp) => pattern.test(weapon.type);

function gunClass(weapon: WeaponData): WeaponCategoryId {
  const id = weapon.id;
  if (LAUNCHERS.has(id)) return 'at-launchers';
  if (AUTOCANNON_IDS.has(id)) return 'autocannons';
  if (TANK.has(id) || has(weapon, /(^|[^а-яё])танков/i)) return 'tank-guns';
  if (NAVAL.has(id) || has(weapon, /корабельн/i)) return 'naval-guns';
  if (AIRCRAFT.has(id) || has(weapon, /авиационн|вертолёт/i)) return MACHINE_GUNS.has(id) && !/пушк/i.test(weapon.type) ? 'mg' : 'aircraft-guns';
  if (has(weapon, /миномёт/i)) return 'mortars';
  if (has(weapon, /гранатомёт/i)) return 'grenade-launchers';
  if (has(weapon, /снайперск|крупнокалиберная.*винтовка/i)) return 'snipers';
  if (MACHINE_GUNS.has(id) || has(weapon, /пулемёт/i) && !has(weapon, /пистолет-пулемёт/i)) return 'mg';
  if (has(weapon, /пистолет/i)) return 'smg';
  if (has(weapon, /зенитн|автоматическая пушка|автоматический .*пушка|спаренная|боевых машин/i) || (weapon.specs.diameter ?? 0) >= 20 && (weapon.specs.diameter ?? 0) <= 57 && weapon.specs.rpm !== undefined && weapon.specs.rpm > 100) return 'autocannons';
  if (has(weapon, /автомат|винтовк|карабин/i)) return 'rifles';
  return 'howitzers';
}

/** Новый класс образца: ничего не меняется, если образец остаётся в прежнем классе. */
export function reclass(weapon: WeaponData): WeaponCategoryId {
  if (LIGHT_AGM.has(weapon.id)) return 'light-agm';
  if (MANPADS.has(weapon.id)) return 'manpads';
  if (LAUNCHERS.has(weapon.id)) return 'at-launchers';
  if (weapon.category === 'guns') return gunClass(weapon);
  if (weapon.category === 'rockets' && (has(weapon, /гранатомёт|безоткатн/i) || (weapon.specs.range !== undefined && weapon.specs.range <= 1))) return 'at-launchers';
  return weapon.category;
}
