import type { WeaponCategoryId } from './weapons/types';

/**
 * Точки подвески: число станций и внутренних отсеков там, где оно известно из открытых данных.
 * У остальных машин показывается типовая схема класса с пометкой, что точное число не уточнено.
 * Силуэт и положение пилонов зависят от схемы самолёта: стреловидное, треугольное, переменной
 * стреловидности, «летающее крыло» и так далее.
 */
export type Layout =
  | 'fighter' | 'swept' | 'delta' | 'canard' | 'swing' | 'stealth' | 'attack' | 'bomber' | 'flyingwing' | 'heli' | 'uav';

export type StationRole = 'tip' | 'outer' | 'mid' | 'inner' | 'center' | 'fus' | 'cheek' | 'bay' | 'wing';

export interface HardpointSpec {
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
  'su-25': { external: 10 },
  'a-10': { external: 11 },
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
  'b-52': { external: 12, internal: 1, note: 'Двенадцать подкрыльевых пилонов и внутренний бомбовый отсек.' },
  'b-1b': { external: 8, internal: 3 },
  'b-2': { external: 0, internal: 2, note: 'Два внутренних отсека в центре крыла, внешней подвески нет.' },
  'f-117': { external: 0, internal: 2 },
  'tu-160': { external: 0, internal: 2 },
  'tu-160m': { external: 0, internal: 2 },
  'ah-64': { external: 4 },
  'ka-52': { external: 4 },
  'mi-28': { external: 4 },
  'mi-24': { external: 6 },
  'ah-1z': { external: 6 },
  'tb2': { external: 4 },
  'akinci': { external: 6 },
  'mq-9': { external: 7 },
  'mq-1': { external: 2 },
};

/** Схема самолёта, определяющая силуэт и положение пилонов. */
export const layoutOf: Record<string, Layout> = {
  // истребители
  'mig-15': 'swept', 'f-86': 'swept', 'mig-17': 'swept', 'mig-19': 'swept', 'f-100': 'swept', 'f-8': 'swept', 'f-105': 'swept', 'f-5': 'swept', 'f-104': 'swept',
  'mig-21': 'delta', 'mirage-2000': 'delta', 'tejas': 'delta', 'a-4': 'delta',
  'f-4': 'swept', 'f-16': 'swept', 'f-18': 'swept', 'fa-18e': 'swept', 'jf-17': 'swept', 'mirage-f1': 'swept', 'a-6': 'swept', 'a-7': 'swept', 'il-28': 'bomber', 'b-57': 'bomber',
  'f-15': 'fighter', 'f-15e': 'fighter', 'f-15ex': 'fighter', 'su-27': 'fighter', 'su-30sm': 'fighter', 'su-30mki': 'fighter', 'su-33': 'fighter', 'su-35': 'fighter',
  'su-34': 'fighter', 'mig-29': 'fighter', 'mig-35': 'fighter', 'mig-31': 'fighter', 'mig-25': 'fighter',
  'f-22': 'stealth', 'f-35a': 'stealth', 'su-57': 'stealth', 'f-117': 'stealth',
  'eurofighter': 'canard', 'rafale': 'canard', 'gripen-e': 'canard', 'j-10c': 'canard', 'j-20': 'canard',
  'mig-23': 'swing', 'mig-27': 'swing', 'f-14': 'swing', 'tornado': 'swing', 'su-24': 'swing', 'su-17': 'swing', 'f-111': 'swing',
  'tu-22m': 'swing', 'tu-160': 'swing', 'tu-160m': 'swing', 'b-1b': 'swing',
  'a-10': 'attack', 'su-25': 'attack', 'a-1': 'attack', 'ov-10': 'attack', 'ac-47': 'attack',
  'b-52': 'bomber', 'tu-95': 'bomber', 'h-6k': 'bomber', 'ac-130': 'bomber',
  'b-2': 'flyingwing', 'b-21': 'flyingwing', 's-70': 'flyingwing',
};

export const layoutOfGroup: Record<string, Layout | undefined> = {
  fighters: 'fighter', bombers: 'bomber', helicopters: 'heli', uav: 'uav',
};

/** Типовое число внешних точек, если оно не уточнено. */
export const TYPICAL_EXTERNAL: Record<Layout, number> = {
  fighter: 8, swept: 6, delta: 6, canard: 8, swing: 6, stealth: 4, attack: 8, bomber: 8, flyingwing: 0, heli: 4, uav: 4,
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
  { id: 'air', name: 'Воздушный бой', text: 'Ракеты «воздух-воздух» на законцовках и под фюзеляжем.', categories: ['aam', 'manpads'] },
  { id: 'strike', name: 'Удар по земле', text: 'Бомбы, лёгкие и тяжёлые ракеты и неуправляемые ракеты на пилонах.', categories: ['agm', 'light-agm', 'guided-bombs', 'bombs', 'rockets', 'cruise', 'atgm'] },
  { id: 'sead', name: 'Подавление ПВО', text: 'Противорадиолокационные ракеты и ракеты для самообороны.', categories: ['arm', 'aam'] },
  { id: 'sea', name: 'Борьба с кораблями', text: 'Противокорабельные ракеты на центральных пилонах.', categories: ['air-sea', 'aam'] },
];

type Slot = { role: StationRole; l: [number, number]; single?: boolean };

/** Слоты пилонов в порядке заполнения. Правая сторона зеркальна левой. Координаты рассчитаны под силуэты ниже. */
const SLOTS: Record<Layout, Slot[]> = {
  fighter: [
    { role: 'center', l: [50, 64], single: true }, { role: 'inner', l: [38, 52] }, { role: 'tip', l: [10, 59] }, { role: 'outer', l: [22, 56] },
    { role: 'fus', l: [45, 72] }, { role: 'mid', l: [30, 54] }, { role: 'cheek', l: [45, 34] }, { role: 'fus', l: [44, 80] }, { role: 'inner', l: [34, 53] },
  ],
  swept: [
    { role: 'center', l: [50, 70], single: true }, { role: 'inner', l: [38, 58] }, { role: 'tip', l: [19, 69] }, { role: 'outer', l: [25, 66] },
    { role: 'fus', l: [46, 76] }, { role: 'mid', l: [32, 62] }, { role: 'cheek', l: [46, 38] }, { role: 'fus', l: [45, 82] }, { role: 'inner', l: [35, 60] },
  ],
  delta: [
    { role: 'center', l: [50, 68], single: true }, { role: 'inner', l: [36, 68] }, { role: 'tip', l: [10, 85] }, { role: 'outer', l: [20, 80] },
    { role: 'fus', l: [45, 76] }, { role: 'mid', l: [28, 74] }, { role: 'cheek', l: [46, 50] }, { role: 'fus', l: [45, 84] }, { role: 'inner', l: [32, 71] },
  ],
  canard: [
    { role: 'center', l: [50, 68], single: true }, { role: 'inner', l: [36, 68] }, { role: 'tip', l: [10, 85] }, { role: 'outer', l: [20, 80] },
    { role: 'fus', l: [45, 72] }, { role: 'mid', l: [28, 74] }, { role: 'inner', l: [32, 71] }, { role: 'fus', l: [45, 80] }, { role: 'cheek', l: [46, 52] },
    { role: 'mid', l: [24, 77] }, { role: 'fus', l: [47, 64] },
  ],
  swing: [
    { role: 'center', l: [50, 68], single: true }, { role: 'inner', l: [36, 53] }, { role: 'tip', l: [6, 55] }, { role: 'outer', l: [14, 55] },
    { role: 'fus', l: [46, 74] }, { role: 'mid', l: [25, 54] }, { role: 'cheek', l: [46, 36] }, { role: 'fus', l: [45, 80] },
  ],
  stealth: [
    { role: 'inner', l: [30, 66] }, { role: 'outer', l: [20, 72] }, { role: 'mid', l: [25, 69] }, { role: 'tip', l: [14, 76] },
  ],
  attack: [
    { role: 'center', l: [50, 62], single: true }, { role: 'inner', l: [38, 51] }, { role: 'mid', l: [30, 51] }, { role: 'outer', l: [22, 51] },
    { role: 'outer', l: [14, 51] }, { role: 'fus', l: [46, 68] }, { role: 'tip', l: [7, 51] }, { role: 'mid', l: [34, 51] },
  ],
  bomber: [
    { role: 'inner', l: [40, 51] }, { role: 'mid', l: [33, 54] }, { role: 'mid', l: [26, 56] }, { role: 'outer', l: [19, 59] },
    { role: 'outer', l: [12, 61] }, { role: 'outer', l: [6, 63] },
  ],
  flyingwing: [],
  heli: [
    { role: 'wing', l: [38, 46] }, { role: 'wing', l: [28, 46] }, { role: 'wing', l: [18, 46] },
  ],
  uav: [
    { role: 'mid', l: [40, 50] }, { role: 'mid', l: [30, 50.5] }, { role: 'mid', l: [20, 51] }, { role: 'mid', l: [10, 51.5] },
  ],
};

/** Положение внутренних отсеков по схеме. */
const BAY_ORIGIN: Record<Layout, [number, number]> = {
  fighter: [46, 48], swept: [46, 50], delta: [46, 56], canard: [46, 56], swing: [46, 48], stealth: [46, 50], attack: [46, 50],
  bomber: [46, 42], flyingwing: [44, 52], heli: [46, 50], uav: [46, 50],
};

/** Схема станций для машины. Внутренние отсеки нумеруются после внешних точек. */
export function stationsOf(layout: Layout, external: number, internal: number): Station[] {
  const list: Station[] = [];
  const hasBays = internal > 0;
  const slots = SLOTS[layout];
  let remaining = external;
  for (const slot of slots) {
    if (remaining <= 0) break;
    if (slot.single) {
      if (hasBays && (layout === 'stealth' || layout === 'fighter' || layout === 'swept')) continue;
      list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: slot.role, x: slot.l[0], y: slot.l[1], side: 'c' });
      remaining -= 1;
      continue;
    }
    if (hasBays && ['fus', 'cheek'].includes(slot.role)) continue;
    list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: slot.role, x: slot.l[0], y: slot.l[1], side: 'l' });
    remaining -= 1;
    if (remaining > 0) {
      list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: slot.role, x: 100 - slot.l[0], y: slot.l[1], side: 'r' });
      remaining -= 1;
    }
  }
  const [bx, by] = BAY_ORIGIN[layout];
  for (let i = 0; i < internal; i += 1) {
    const x = internal <= 1 ? 50 : i % 2 === 0 ? bx : 100 - bx;
    const y = by + (internal <= 1 ? 0 : Math.floor(i / 2) * 10);
    list.push({ id: `s${list.length + 1}`, n: list.length + 1, role: 'bay', x, y, side: 'c', internal: true });
  }
  return list;
}

export const silhouettes: Record<Layout, string> = {
  fighter: 'M50 4 L53 14 L54 40 L90 56 L90 62 L56 60 L56 82 L66 92 L66 96 L50 94 L34 96 L34 92 L44 82 L44 60 L10 62 L10 56 L46 40 L47 14 Z',
  swept: 'M50 4 L53 16 L54 44 L82 66 L82 72 L55 66 L55 80 L68 90 L68 94 L50 90 L32 94 L32 90 L45 80 L45 66 L18 72 L18 66 L46 44 L47 16 Z',
  delta: 'M50 5 L52 20 L53 42 L92 80 L92 88 L56 85 L56 91 L60 96 L40 96 L44 91 L44 85 L8 88 L8 80 L47 42 L48 20 Z',
  canard: 'M50 4 L52 16 L53 44 L92 80 L92 88 L56 86 L56 94 L44 94 L44 86 L8 88 L8 80 L47 44 L48 16 Z M36 28 L47 34 L47 38 L30 36 Z M64 28 L53 34 L53 38 L70 36 Z',
  swing: 'M50 4 L53 16 L54 44 L96 52 L96 58 L55 62 L55 80 L70 90 L70 95 L50 92 L30 95 L30 90 L45 80 L45 62 L4 58 L4 52 L46 44 L47 16 Z',
  stealth: 'M50 3 L55 20 L57 38 L90 74 L90 82 L74 80 L58 86 L58 92 L50 96 L42 92 L42 86 L26 80 L10 82 L10 74 L43 38 L45 20 Z',
  attack: 'M50 6 L53 18 L54 44 L96 46 L96 56 L54 58 L54 76 L64 80 L64 92 L58 92 L58 84 L42 84 L42 92 L36 92 L36 80 L46 76 L46 58 L4 56 L4 46 L46 44 L47 18 Z',
  bomber: 'M50 4 L53 14 L54 42 L97 62 L97 67 L55 56 L55 82 L70 90 L70 94 L50 92 L30 94 L30 90 L45 82 L45 56 L3 67 L3 62 L46 42 L47 14 Z',
  flyingwing: 'M50 18 L97 66 L90 78 L78 71 L69 81 L58 74 L50 81 L42 74 L31 81 L22 71 L10 78 L3 66 Z',
  heli: 'M50 14 C58 14 60 30 59 48 L53 56 L53 92 L47 92 L47 56 L41 48 C40 30 42 14 50 14 Z M18 44 L82 44 L82 49 L18 49 Z',
  uav: 'M50 8 L52 20 L52 44 L97 50 L97 54 L52 54 L52 82 L62 90 L62 94 L50 92 L38 94 L38 90 L48 82 L48 54 L3 54 L3 50 L48 44 L48 20 Z',
};
