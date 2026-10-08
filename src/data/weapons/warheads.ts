import type { WarheadScene } from './types';

export interface WarheadInfo {
  id: WarheadScene;
  name: string;
  short: string;
  text: string;
  readout: [string, string, string];
}

/** Схематичные объяснения принципа действия боевых частей на уровне открытой энциклопедии. */
export const warheadInfo: WarheadInfo[] = [
  {
    id: 'frag',
    name: 'Осколочно-фугасная боевая часть',
    short: 'Осколки',
    text: 'При взрыве корпус боевой части дробится на осколки, которые разлетаются во все стороны или в заданном секторе. Неконтактный взрыватель срабатывает рядом с целью, поэтому прямого попадания не нужно. Поражение зависит от расстояния и числа осколков.',
    readout: ['Подрыв рядом с целью', 'Поражение осколками', 'Неконтактный взрыватель'],
  },
  {
    id: 'shaped',
    name: 'Кумулятивная боевая часть',
    short: 'Кумулятив',
    text: 'Заряд имеет коническую выемку, облицованную металлом. При взрыве облицовка схлопывается и превращается в тонкую струю, летящую с огромной скоростью. Струя пробивает броню давлением, а не теплом. Эффективность зависит от расстояния до преграды.',
    readout: ['Коническая облицовка', 'Металлическая струя', 'Пробитие преграды'],
  },
  {
    id: 'tandem',
    name: 'Тандемная боевая часть',
    short: 'Тандем',
    text: 'В боевой части два кумулятивных заряда один за другим. Первый подрывает элемент динамической защиты, второй пробивает основную броню, которая осталась без прикрытия. Такая схема создана против брони с динамической защитой.',
    readout: ['Первый заряд снимает защиту', 'Второй заряд пробивает броню', 'Два заряда подряд'],
  },
  {
    id: 'kinetic',
    name: 'Кинетическая боевая часть',
    short: 'Кинетика',
    text: 'Поражение достигается энергией удара, а не взрывом. Подкалиберный снаряд представляет собой длинный стержень из плотного металла, разогнанный до высокой скорости. Перехватчик ракет поражает цель прямым попаданием без боевой части.',
    readout: ['Высокая скорость', 'Плотный сердечник', 'Поражение ударом'],
  },
  {
    id: 'blast',
    name: 'Фугасная боевая часть',
    short: 'Фугас',
    text: 'Взрыв заряда создаёт ударную волну и резкий рост давления. Они разрушают конструкции и поражают на расстоянии. Действие зависит от массы заряда и высоты подрыва.',
    readout: ['Ударная волна', 'Давление на конструкции', 'Зависит от массы заряда'],
  },
  {
    id: 'penetrator',
    name: 'Проникающая боевая часть',
    short: 'Проникающая',
    text: 'Прочный корпус на скорости пробивает преграду: бетон, грунт или борт корабля. Взрыватель с замедлением срабатывает уже внутри, поэтому основной заряд действует там, где защита слабее.',
    readout: ['Прочный корпус', 'Пробитие преграды', 'Подрыв с замедлением'],
  },
  {
    id: 'cluster',
    name: 'Кассетная боевая часть',
    short: 'Кассета',
    text: 'Боевая часть раскрывается над целью и высвобождает множество малых боеприпасов. Они накрывают большую площадь. Часть боеприпасов может не сработать и остаться на местности, поэтому оружие этого типа ограничено международными соглашениями.',
    readout: ['Раскрытие над целью', 'Много малых боеприпасов', 'Поражение по площади'],
  },
];

const DEFAULT: Record<string, WarheadScene> = {
  'aim-9': 'frag', 'aim-7': 'frag', 'aim-120': 'frag', 'r-73': 'frag', 'r-27': 'frag', 'r-77': 'frag', 'meteor': 'frag',
  'aim-54': 'frag', 'iris-t': 'frag', 'mica': 'frag', 'r-33': 'frag', 'asraam': 'frag',
  'sm-2': 'frag', 'pac-2': 'frag', '48n6': 'frag', 'aster-30': 'frag', 'stinger-missile': 'frag', '9m39': 'frag',
  'hawk-missile': 'frag', '9m38': 'frag', '9m330': 'frag', '57e6': 'frag', '40n6': 'frag', 'mistral-missile': 'frag',
  'rim-7': 'frag', 'essm': 'frag', 'ram': 'frag', 'sm-6': 'frag', 'tamir': 'frag',
  'agm-88': 'frag', 'agm-45': 'frag', 'kh-58': 'frag', 'alarm': 'frag', 'apkws': 'frag', '9m22': 'frag', 'hydra-70': 'frag',
  'm61': 'frag', 'gsh-30-1': 'frag', 'mk-45': 'frag',
  'starstreak-missile': 'kinetic', 'thaad-interceptor': 'kinetic', '2a46': 'kinetic', 'rh-120': 'kinetic', 'm242': 'kinetic',
  'gau-8': 'kinetic', 'm2hb': 'kinetic', 'm240': 'kinetic',
  'agm-65': 'shaped', '9m14': 'shaped', 'bgm-71': 'shaped', '2a28': 'shaped',
  'agm-114': 'tandem', 'fgm-148': 'tandem', '9m133': 'tandem', 'brimstone': 'tandem',
  'mk-82': 'blast', 'mk-84': 'blast', 'gbu-12': 'blast', 'gbu-31': 'blast', 'kh-55': 'blast', 'agm-86': 'blast',
  '9m723': 'blast', 'r-17-missile': 'blast', 'gmlrs': 'blast', 'mk-48': 'blast', 'mk-46': 'blast', 'mk-54': 'blast',
  'harpoon': 'penetrator', 'exocet': 'penetrator', 'am39': 'penetrator', 'sea-eagle': 'penetrator', 'granit': 'penetrator',
  'kh-35': 'penetrator', 'nsm': 'penetrator', 'kh-29': 'penetrator', 'gbu-57': 'penetrator', 'gbu-39': 'penetrator',
  'storm-shadow': 'penetrator', 'jassm': 'penetrator', 'taurus': 'penetrator', 'tomahawk': 'penetrator',
  'atacms-missile': 'cluster', 'agm-154': 'cluster', 'm26': 'cluster',
};

/** Сцена по версиям там, где боевая часть меняется от версии к версии (порядок как в mods.ts). */
const BY_MOD: Record<string, WarheadScene[]> = {
  'agm-65': ['shaped', 'shaped', 'shaped', 'shaped', 'penetrator'],
  'agm-114': ['shaped', 'tandem', 'tandem', 'tandem', 'blast', 'frag'],
  'bgm-71': ['shaped', 'shaped', 'shaped', 'tandem', 'tandem'],
  'gbu-31': ['blast', 'blast', 'blast', 'blast', 'blast'],
  'tomahawk': ['penetrator', 'penetrator', 'cluster', 'penetrator', 'penetrator'],
  'agm-154': ['cluster', 'penetrator'],
  'atacms-missile': ['cluster', 'cluster', 'cluster', 'blast'],
  'gmlrs': ['cluster', 'blast', 'penetrator'],
  'm26': ['cluster', 'cluster'],
  'hydra-70': ['frag', 'shaped', 'frag'],
  '9m22': ['frag', 'cluster'],
  'mk-84': ['blast', 'penetrator'],
  'agm-86': ['blast', 'blast'],
  'm242': ['frag', 'kinetic'],
  '9m723': ['blast', 'cluster'],
  'storm-shadow': ['penetrator', 'penetrator', 'penetrator'],
};

export function warheadScenes(weaponId: string, modCount: number): WarheadScene[] {
  const byMod = BY_MOD[weaponId];
  if (byMod && byMod.length === modCount) return byMod;
  const fallback = DEFAULT[weaponId] ?? 'blast';
  return Array.from({ length: Math.max(1, modCount) }, () => fallback);
}
