import type { WeaponCategoryId } from './weapons/types';

/**
 * Точки подвески: число станций и внутренних отсеков там, где оно известно из открытых данных.
 * У остальных машин показывается типовая схема класса с пометкой, что точное число не уточнено.
 */
export type Layout = 'fighter' | 'bomber' | 'heli' | 'uav';

export type StationRole = 'tip' | 'outer' | 'mid' | 'inner' | 'center' | 'fus' | 'cheek' | 'bay' | 'wing';

export interface HardpointSpec {
  layout?: Layout;
  /** Внешние точки подвески. */
  external?: number;
  /** Внутренние отсеки или станции внутри фюзеляжа. */
  internal?: number;
  note?: string;
}

export const hardpointSpecs: Record<string, HardpointSpec> = {
  'f-15': { external: 9 },
  'f-15e': { external: 9, note: 'Конформные баки добавляют точки подвески вдоль воздухозаборников.' },
  'f-15ex': { external: 9 },
  'f-16': { external: 9 },
  'f-18': { external: 9 },
  'fa-18e': { external: 11 },
  'f-22': { external: 4, internal: 3, note: 'Основной отсек под фюзеляжем и два боковых отсека у воздухозаборников.' },
  'f-35a': { external: 6, internal: 4, note: 'Четыре внутренние станции в двух отсеках; внешние точки снижают малозаметность.' },
  'f-4': { external: 9 },
  'su-27': { external: 10 },
  'su-30mki': { external: 12 },
  'su-30sm': { external: 12 },
  'su-33': { external: 12 },
  'su-35': { external: 12 },
  'su-25': { layout: 'fighter', external: 10 },
  'a-10': { layout: 'fighter', external: 11 },
  'mig-21': { external: 4 },
  'mig-29': { external: 6 },
  'tornado': { external: 7 },
  'eurofighter': { external: 13 },
  'rafale': { external: 14 },
  'mirage-2000': { external: 9 },
  'gripen-e': { external: 10 },
  'jf-17': { external: 7 },
  'j-10c': { external: 11 },
  'tejas': { external: 8 },
  'b-52': { layout: 'bomber', external: 12, internal: 1, note: 'Двенадцать подкрыльевых пилонов и внутренний бомбовый отсек.' },
  'b-1b': { layout: 'bomber', external: 8, internal: 3 },
  'b-2': { layout: 'bomber', external: 0, internal: 2 },
  'f-117': { layout: 'bomber', external: 0, internal: 2 },
  'tu-160': { layout: 'bomber', external: 0, internal: 2 },
  'tu-160m': { layout: 'bomber', external: 0, internal: 2 },
  'ah-64': { layout: 'heli', external: 4 },
  'ka-52': { layout: 'heli', external: 4 },
  'mi-28': { layout: 'heli', external: 4 },
  'mi-24': { layout: 'heli', external: 6 },
  'ah-1z': { layout: 'heli', external: 6 },
  'tb2': { layout: 'uav', external: 4 },
  'akinci': { layout: 'uav', external: 6 },
  'mq-9': { layout: 'uav', external: 7 },
  'mq-1': { layout: 'uav', external: 2 },
};

/** Типовое число внешних точек, если оно не уточнено. */
export const TYPICAL_EXTERNAL: Record<Layout, number> = { fighter: 6, bomber: 8, heli: 4, uav: 4 };

export const layoutOfGroup: Record<string, Layout | undefined> = {
  fighters: 'fighter', bombers: 'fighter', helicopters: 'heli', uav: 'uav',
};

export interface Station {
  id: string;
  n: number;
  role: StationRole;
  /** Положение на схеме, проценты от размера рисунка. */
  x: number;
  y: number;
  side: 'l' | 'r' | 'c';
  internal?: boolean;
}

export const roleName: Record<StationRole, string> = {
  tip: 'Законцовка крыла',
  outer: 'Внешний пилон крыла',
  mid: 'Средний пилон крыла',
  inner: 'Внутренний пилон крыла',
  center: 'Подфюзеляжный пилон',
  fus: 'Под фюзеляжем, ракеты',
  cheek: 'У воздухозаборника',
  bay: 'Внутренний отсек',
  wing: 'Пилон крыла вертолёта',
};

/** Какие классы вооружения подвешиваются на станцию данного типа. */
export const roleAccepts: Record<StationRole, WeaponCategoryId[]> = {
  tip: ['aam'],
  outer: ['aam', 'rockets', 'light-agm', 'arm'],
  mid: ['aam', 'agm', 'arm', 'air-sea', 'light-agm', 'guided-bombs', 'bombs', 'rockets', 'atgm'],
  inner: ['agm', 'arm', 'air-sea', 'cruise', 'light-agm', 'guided-bombs', 'bombs', 'rockets', 'aam'],
  center: ['bombs', 'guided-bombs', 'cruise', 'air-sea', 'agm'],
  fus: ['aam'],
  cheek: ['aam'],
  bay: ['aam', 'guided-bombs', 'bombs', 'cruise', 'agm'],
  wing: ['atgm', 'light-agm', 'rockets', 'aam', 'manpads', 'agm'],
};

/** Наборы нагрузки: какие классы вооружения выбирает набор. */
export const loadouts: { id: string; name: string; text: string; categories: WeaponCategoryId[] }[] = [
  { id: 'air', name: 'Воздушный бой', text: 'Ракеты «воздух-воздух» на законцовках и под фюзеляжем.', categories: ['aam'] },
  { id: 'strike', name: 'Удар по земле', text: 'Бомбы, лёгкие и тяжёлые ракеты и неуправляемые ракеты на пилонах.', categories: ['agm', 'light-agm', 'guided-bombs', 'bombs', 'rockets', 'cruise', 'atgm'] },
  { id: 'sead', name: 'Подавление ПВО', text: 'Противорадиолокационные ракеты и ракеты для самообороны.', categories: ['arm', 'aam'] },
  { id: 'sea', name: 'Борьба с кораблями', text: 'Противокорабельные ракеты на центральных пилонах.', categories: ['air-sea', 'aam'] },
];

const FIGHTER_SLOTS: { role: StationRole; l: [number, number]; r: [number, number] }[] = [
  { role: 'center', l: [50, 60], r: [50, 60] },
  { role: 'inner', l: [38, 52], r: [62, 52] },
  { role: 'tip', l: [10, 54], r: [90, 54] },
  { role: 'outer', l: [22, 53], r: [78, 53] },
  { role: 'fus', l: [44, 70], r: [56, 70] },
  { role: 'mid', l: [30, 52], r: [70, 52] },
  { role: 'cheek', l: [44, 36], r: [56, 36] },
  { role: 'fus', l: [43, 78], r: [57, 78] },
  { role: 'inner', l: [34, 56], r: [66, 56] },
];

const BOMBER_SLOTS: [number, number][] = [[40, 54], [33, 56], [26, 58], [19, 60], [12, 62], [6, 64]];

function pairs(count: number, slots: { role: StationRole; l: [number, number]; r: [number, number] }[]): Station[] {
  const list: Station[] = [];
  let n = 0;
  let remaining = count;
  for (const slot of slots) {
    if (remaining <= 0) break;
    if (slot.role === 'center') {
      list.push({ id: `s${++n}`, n, role: slot.role, x: slot.l[0], y: slot.l[1], side: 'c' });
      remaining -= 1;
      continue;
    }
    const takeBoth = remaining >= 2;
    list.push({ id: `s${++n}`, n, role: slot.role, x: slot.l[0], y: slot.l[1], side: 'l' });
    if (takeBoth) list.push({ id: `s${++n}`, n, role: slot.role, x: slot.r[0], y: slot.r[1], side: 'r' });
    remaining -= takeBoth ? 2 : 1;
  }
  return list;
}

/** Схема станций для машины. Внутренние отсеки нумеруются после внешних точек. */
export function stationsOf(layout: Layout, external: number, internal: number): Station[] {
  let list: Station[] = [];
  if (layout === 'fighter') list = pairs(external, internal > 0 ? FIGHTER_SLOTS.filter((slot) => !['center', 'fus', 'cheek'].includes(slot.role)) : FIGHTER_SLOTS);
  else if (layout === 'bomber') {
    const wing = external - (external % 2);
    BOMBER_SLOTS.slice(0, wing / 2).forEach(([x, y], i) => {
      list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: i === 0 ? 'inner' : i < 3 ? 'mid' : 'outer', x, y, side: 'l' });
      list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: i === 0 ? 'inner' : i < 3 ? 'mid' : 'outer', x: 100 - x, y, side: 'r' });
    });
  } else if (layout === 'heli') {
    const rows: [number, number][] = [[38, 46], [28, 46], [18, 46]];
    rows.slice(0, Math.ceil(external / 2)).forEach(([x, y]) => {
      list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: 'wing', x, y, side: 'l' });
      list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: 'wing', x: 100 - x, y, side: 'r' });
    });
  } else {
    const rows: [number, number][] = [[40, 46], [30, 47], [20, 48], [10, 49]];
    let left = external;
    rows.forEach(([x, y]) => {
      if (left <= 0) return;
      list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: 'mid', x, y, side: 'l' });
      left -= 1;
      if (left <= 0) return;
      list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: 'mid', x: 100 - x, y, side: 'r' });
      left -= 1;
    });
  }
  for (let i = 0; i < internal; i += 1) {
    const column = internal <= 1 ? 0 : i % 2;
    const row = internal <= 1 ? 0 : Math.floor(i / 2);
    const x = internal <= 1 ? 50 : column === 0 ? 46 : 54;
    const y = (layout === 'bomber' ? 42 : 46) + row * 10;
    list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: 'bay', x, y, side: 'c', internal: true });
  }
  return list;
}

export const silhouettes: Record<Layout, string> = {
  fighter: 'M50 4 L53 14 L54 40 L90 56 L90 62 L56 60 L56 82 L66 92 L66 96 L50 94 L34 96 L34 92 L44 82 L44 60 L10 62 L10 56 L46 40 L47 14 Z',
  bomber: 'M50 3 L54 16 L56 40 L98 60 L98 68 L56 64 L56 84 L72 94 L72 98 L50 96 L28 98 L28 94 L44 84 L44 64 L2 68 L2 60 L44 40 L46 16 Z',
  heli: 'M50 14 C58 14 60 30 59 48 L53 56 L53 92 L47 92 L47 56 L41 48 C40 30 42 14 50 14 Z M18 44 L82 44 L82 49 L18 49 Z',
  uav: 'M50 8 L52 20 L52 44 L97 50 L97 54 L52 54 L52 82 L62 90 L62 94 L50 92 L38 94 L38 90 L48 82 L48 54 L3 54 L3 50 L48 44 L48 20 Z',
};
