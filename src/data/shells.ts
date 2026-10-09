import type { ShellTypeId } from '../lib/ballistics';
import type { WarheadScene } from './weapons/types';

export interface ShellType {
  id: ShellTypeId | 'rocket' | 'missile';
  name: string;
  short: string;
  text: string;
  scene: WarheadScene;
}

export interface Gun {
  id: string;
  name: string;
  country: string;
  caliber: number;
  kind: 'tank' | 'auto' | 'howitzer' | 'low' | 'mg';
  /** Техника из справочника с этим орудием. */
  platforms: string[];
  /** Страница орудия в каталоге вооружения, если есть. */
  weaponId?: string;
}

export interface Shell {
  id: string;
  name: string;
  gun: string;
  type: ShellType['id'];
  /** Начальная скорость, м/с. */
  v0?: number;
  /** Масса снаряда в полёте, кг. Если не указана, траектория не строится. */
  mass?: number;
  /** Опубликованная наибольшая дальность стрельбы, км (для гаубиц). */
  rangeKm?: number;
  note: string;
}

/** Типы снарядов: принцип действия на уровне открытой энциклопедии. */
export const shellTypes: ShellType[] = [
  { id: 'apfsds', name: 'Бронебойный оперённый подкалиберный', short: 'БОПС', scene: 'kinetic',
    text: 'Длинный тонкий стержень из плотного сплава. В стволе его ведёт отделяемый поддон, в полёте стабилизирует оперение. Самая высокая начальная скорость и самая настильная траектория среди танковых снарядов.' },
  { id: 'apds', name: 'Бронебойный подкалиберный с отделяемым поддоном', short: 'БПС', scene: 'kinetic',
    text: 'Сердечник меньшего калибра в лёгком поддоне, который отделяется после вылета. Предшественник оперённых снарядов, стабилизируется вращением.' },
  { id: 'ap', name: 'Бронебойный калиберный', short: 'ББ', scene: 'kinetic',
    text: 'Сплошной или с небольшим зарядом снаряд полного калибра. Основной противотанковый снаряд первых послевоенных танков.' },
  { id: 'heat', name: 'Кумулятивный', short: 'КС', scene: 'shaped',
    text: 'Действует кумулятивной струёй, поэтому результат не зависит от скорости снаряда у цели. Летит медленнее подкалиберного, траектория заметно круче.' },
  { id: 'hesh', name: 'Бронебойно-фугасный', short: 'БФС', scene: 'blast',
    text: 'Тонкостенный снаряд с пластичным зарядом, который расплющивается на преграде перед подрывом. Характерен для британских нарезных пушек, универсален по укреплениям.' },
  { id: 'he', name: 'Осколочно-фугасный', short: 'ОФС', scene: 'frag',
    text: 'Основной снаряд для стрельбы по пехоте, лёгкой технике и укрытиям. У гаубиц это главный тип боеприпаса, стрельба ведётся под большими углами.' },
  { id: 'rocket', name: 'Активно-реактивный', short: 'АРС', scene: 'shaped',
    text: 'После вылета из ствола включается реактивный двигатель, который разгоняет снаряд. Траектория не описывается простой баллистикой, поэтому график для него не строится.' },
  { id: 'missile', name: 'Управляемая ракета, запускаемая через ствол', short: 'ТУР', scene: 'tandem',
    text: 'Ракета выстреливается из ствола как обычный снаряд и наводится по лазерному лучу. Летит с почти постоянной скоростью, график простой баллистики для неё не строится.' },
];

export const guns: Gun[] = [
  { id: 'd-10t', name: '100-мм Д-10Т', country: 'СССР', caliber: 100, kind: 'tank', platforms: ['t-54', 'type-59'] },
  { id: 'kpvt', name: '14,5-мм пулемёт КПВТ', country: 'СССР', caliber: 14.5, kind: 'mg', platforms: ['btr-60', 'btr-70', 'btr-80'], weaponId: 'kpv' },
  { id: 'm2-50', name: '12,7-мм пулемёт M2', country: 'США', caliber: 12.7, kind: 'mg', platforms: ['m113', 'stryker', 'vab', 'patria-amv', 'namer', 'boxer'], weaponId: 'm2hb' },
  { id: 'sgmb', name: '7,62-мм пулемёт СГМБ', country: 'СССР', caliber: 7.62, kind: 'mg', platforms: ['btr-152', 'btr-40', 'btr-50'] },
  { id: 'nato-762', name: '7,62-мм пулемёт под патрон НАТО', country: 'США, ФРГ', caliber: 7.62, kind: 'mg', platforms: ['fuchs', 'lvtp-5'] },
  { id: 'mk30', name: '30-мм MK 30-2/ABM', country: 'Германия', caliber: 30, kind: 'auto', platforms: ['puma'], weaponId: 'mk30-2' },
  { id: 'zpt-98', name: '125-мм ZPT-98', country: 'Китай', caliber: 125, kind: 'tank', platforms: ['type-99'], weaponId: 'zpt-98' },
  { id: '2a82', name: '125-мм 2А82', country: 'Россия', caliber: 125, kind: 'tank', platforms: ['t-14'], weaponId: '2a82' },
  { id: 'm32', name: '76-мм M32', country: 'США', caliber: 76, kind: 'tank', platforms: ['m41'] },
  { id: 'd-56t', name: '76-мм Д-56Т', country: 'СССР', caliber: 76, kind: 'tank', platforms: ['pt-76'] },
  { id: 'm81', name: '152-мм M81', country: 'США', caliber: 152, kind: 'low', platforms: ['m551'] },
  { id: 'm113-175', name: '175-мм M113', country: 'США', caliber: 175, kind: 'howitzer', platforms: ['m107'] },
  { id: 'm46-130', name: '130-мм М-46', country: 'СССР', caliber: 130, kind: 'howitzer', platforms: ['m-46'] },
  { id: 'm137', name: '105-мм M137', country: 'США', caliber: 105, kind: 'howitzer', platforms: ['m102'] },
  { id: 'm41', name: '90-мм M41', country: 'США', caliber: 90, kind: 'tank', platforms: ['m48'] },
  { id: 'u-5ts', name: '115-мм У-5ТС', country: 'СССР', caliber: 115, kind: 'tank', platforms: ['t-62'] },
  { id: 'l7', name: '105-мм L7 / M68', country: 'Великобритания', caliber: 105, kind: 'tank', platforms: ['m60', 'leopard-1', 'm1-abrams'], weaponId: 'l7' },
  { id: 'cn-105', name: '105-мм CN-105-F1', country: 'Франция', caliber: 105, kind: 'tank', platforms: ['amx-30'] },
  { id: 'l11', name: '120-мм L11 / L30 (нарезная)', country: 'Великобритания', caliber: 120, kind: 'tank', platforms: ['chieftain', 'challenger-2'] },
  { id: '2a46', name: '125-мм 2А46', country: 'СССР', caliber: 125, kind: 'tank', platforms: ['t-64', 't-72', 't-80', 't-90', 't-90m', 'vt-4'], weaponId: '2a46' },
  { id: 'rh-120', name: '120-мм гладкоствольные пушки НАТО (Rh 120, M256)', country: 'ФРГ, США', caliber: 120, kind: 'tank', platforms: ['leopard-2', 'm1-abrams', 'k2', 'merkava-4', 'leclerc', 'leopard-2a7', 'm1a2-sepv3', 'type-10'], weaponId: 'rh-120' },
  { id: '2a28', name: '73-мм 2А28 «Гром»', country: 'СССР', caliber: 73, kind: 'low', platforms: ['bmp-1'], weaponId: '2a28' },
  { id: '2a70', name: '100-мм 2А70', country: 'СССР', caliber: 100, kind: 'low', platforms: ['bmp-3', 'bmd-4m'] },
  { id: '2a42', name: '30-мм 2А42 / 2А72', country: 'СССР', caliber: 30, kind: 'auto', platforms: ['bmp-2', 'bmp-3', 'btr-82a', 'bmd-4m'], weaponId: '2a42' },
  { id: 'm242', name: '25-мм M242 Bushmaster', country: 'США', caliber: 25, kind: 'auto', platforms: ['m2-bradley', 'lav-25'], weaponId: 'm242' },
  { id: 'rh-202', name: '20-мм Rh 202', country: 'ФРГ', caliber: 20, kind: 'auto', platforms: ['marder'] },
  { id: 'rarden', name: '30-мм L21 RARDEN', country: 'Великобритания', caliber: 30, kind: 'auto', platforms: ['warrior'] },
  { id: 'bofors-40', name: '40-мм Bofors L/70', country: 'Швеция', caliber: 40, kind: 'auto', platforms: ['cv90', 'k21'] },
  { id: '2a31', name: '122-мм 2А31', country: 'СССР', caliber: 122, kind: 'howitzer', platforms: ['2s1', 'd-30'] },
  { id: '2a33', name: '152-мм 2А33', country: 'СССР', caliber: 152, kind: 'howitzer', platforms: ['2s3'] },
  { id: '2a64', name: '152-мм 2А64', country: 'СССР', caliber: 152, kind: 'howitzer', platforms: ['2s19'] },
  { id: 'm185', name: '155-мм M185 / M284', country: 'США', caliber: 155, kind: 'howitzer', platforms: ['m109'] },
  { id: 'l31-39', name: '155-мм L31 (39 калибров)', country: 'Великобритания', caliber: 155, kind: 'howitzer', platforms: ['as-90'] },
  { id: 'l52', name: '155-мм, ствол 52 калибра', country: 'Стандарт НАТО', caliber: 155, kind: 'howitzer', platforms: ['pzh-2000', 'caesar', 'k9', 'krab', 'archer'] },
  { id: 'm201', name: '203-мм M201', country: 'США', caliber: 203, kind: 'howitzer', platforms: ['m110'] },
  { id: '2a44', name: '203-мм 2А44', country: 'СССР', caliber: 203, kind: 'howitzer', platforms: ['2s7'] },
];

export const shells: Shell[] = [
  // 100-мм Д-10Т
  { id: 'br-412d', name: 'БР-412Д', gun: 'd-10t', type: 'ap', v0: 887, mass: 15.9, note: 'Бронебойный снаряд с баллистическим наконечником, основной противотанковый для Т-54 в 1950-х.' },
  { id: '3bm8', name: '3БМ8', gun: 'd-10t', type: 'apds', v0: 1415, note: 'Подкалиберный снаряд 1960-х, вернувший 100-мм пушке возможность бороться с новыми танками.' },
  { id: 'of-412', name: 'ОФ-412', gun: 'd-10t', type: 'he', v0: 900, mass: 15.6, note: 'Осколочно-фугасная граната, общая с полевой пушкой БС-3.' },
  // 90-мм M41
  { id: 'm82', name: 'M82 APC', gun: 'm41', type: 'ap', v0: 853, mass: 10.9, note: 'Бронебойный снаряд с наконечником и небольшим разрывным зарядом.' },
  { id: 'm431', name: 'M431 HEAT', gun: 'm41', type: 'heat', v0: 1219, mass: 5.8, note: 'Кумулятивный оперённый снаряд, резко поднявший возможности 90-мм пушки.' },
  { id: 'm71', name: 'M71 HE', gun: 'm41', type: 'he', v0: 823, mass: 10.6, note: 'Осколочно-фугасный снаряд для стрельбы по небронированным целям.' },
  // 115-мм У-5ТС
  { id: '3bm3', name: '3БМ3', gun: 'u-5ts', type: 'apfsds', v0: 1615, mass: 4, note: 'Один из первых серийных оперённых подкалиберных снарядов: ради него Т-62 получил гладкий ствол.' },
  { id: '3bk4', name: '3БК4', gun: 'u-5ts', type: 'heat', v0: 950, mass: 13, note: 'Кумулятивный оперённый снаряд.' },
  { id: '3of18', name: '3ОФ18', gun: 'u-5ts', type: 'he', v0: 780, mass: 17.9, note: 'Осколочно-фугасный оперённый снаряд.' },
  // 105-мм L7 / M68
  { id: 'm392', name: 'M392 APDS', gun: 'l7', type: 'apds', v0: 1478, note: 'Подкалиберный снаряд, с которым пушка L7 стала стандартом НАТО в 1960-х.' },
  { id: 'm774', name: 'M774 APFSDS', gun: 'l7', type: 'apfsds', v0: 1508, mass: 3.4, note: 'Оперённый подкалиберный снаряд конца 1970-х с сердечником из обеднённого урана.' },
  { id: 'm456', name: 'M456 HEAT', gun: 'l7', type: 'heat', v0: 1173, mass: 10.2, note: 'Кумулятивный оперённый снаряд, универсальный по бронированным и небронированным целям.' },
  { id: 'm393', name: 'M393 HEP', gun: 'l7', type: 'hesh', v0: 732, mass: 11.3, note: 'Бронебойно-фугасный снаряд с пластичным зарядом.' },
  // 105-мм CN-105-F1
  { id: 'occ-105', name: 'OCC 105 F1 (Obus G)', gun: 'cn-105', type: 'heat', v0: 1000, mass: 11, note: 'Кумулятивный заряд установлен на подшипниках внутри вращающегося корпуса: так нарезная пушка стреляет кумулятивным снарядом без потери действия.' },
  // 120-мм L11 / L30
  { id: 'l15', name: 'L15 APDS', gun: 'l11', type: 'apds', v0: 1370, mass: 7.5, note: 'Подкалиберный снаряд танка Chieftain.' },
  { id: 'l27a1', name: 'L27A1 CHARM 3', gun: 'l11', type: 'apfsds', v0: 1650, note: 'Оперённый подкалиберный снаряд танка Challenger 2. Масса в полёте в открытых данных указана по-разному.' },
  { id: 'l31', name: 'L31 HESH', gun: 'l11', type: 'hesh', v0: 670, mass: 17, note: 'Бронебойно-фугасный снаряд, из-за которого британские танки сохранили нарезной ствол.' },
  // 125-мм 2А46
  { id: '3bm15', name: '3БМ15', gun: '2a46', type: 'apfsds', v0: 1785, mass: 3.9, note: 'Подкалиберный снаряд 1970-х с сердечником из карбида вольфрама.' },
  { id: '3bm42', name: '3БМ42 «Манго»', gun: '2a46', type: 'apfsds', v0: 1700, mass: 4.85, note: 'Снаряд 1986 года с составным вольфрамовым сердечником, массовый в экспортных поставках.' },
  { id: '3bk18m', name: '3БК18М', gun: '2a46', type: 'heat', v0: 905, mass: 19, note: 'Кумулятивный оперённый снаряд.' },
  { id: '3of26', name: '3ОФ26', gun: '2a46', type: 'he', v0: 850, mass: 23, note: 'Осколочно-фугасный оперённый снаряд, основной по небронированным целям.' },
  { id: '9m119', name: '9М119 «Рефлекс»', gun: '2a46', type: 'missile', note: 'Управляемая ракета с наведением по лазерному лучу, дальность ≈5 км.' },
  // 120-мм Rh 120 / M256
  { id: 'dm33', name: 'DM33', gun: 'rh-120', type: 'apfsds', v0: 1650, mass: 4.6, note: 'Немецкий подкалиберный снаряд 1987 года с вольфрамовым сердечником.' },
  { id: 'dm53', name: 'DM53', gun: 'rh-120', type: 'apfsds', v0: 1670, mass: 5, note: 'Снаряд конца 1990-х с удлинённым сердечником. Из ствола длиной 55 калибров скорость ≈1750 м/с.' },
  { id: 'm829a1', name: 'M829A1', gun: 'rh-120', type: 'apfsds', v0: 1575, mass: 4.6, note: 'Американский снаряд с сердечником из обеднённого урана, применялся в 1991 году.' },
  { id: 'm830', name: 'M830 HEAT-MP', gun: 'rh-120', type: 'heat', v0: 1140, mass: 13.5, note: 'Многоцелевой кумулятивный снаряд, лицензионная версия немецкого DM12.' },
  { id: 'm830a1', name: 'M830A1 MPAT', gun: 'rh-120', type: 'heat', v0: 1410, mass: 11.4, note: 'Подкалиберный кумулятивный снаряд в поддоне с неконтактным взрывателем, пригоден и по вертолётам.' },
  // 73-мм 2А28
  { id: 'pg-15v', name: 'ПГ-15В', gun: '2a28', type: 'rocket', v0: 400, note: 'Кумулятивный активно-реактивный выстрел: после вылета двигатель разгоняет гранату до ≈665 м/с.' },
  { id: 'og-15v', name: 'ОГ-15В', gun: '2a28', type: 'he', v0: 290, mass: 3.7, note: 'Осколочная граната без реактивного двигателя, появилась позже кумулятивной.' },
  // 100-мм 2А70
  { id: '3uof17', name: '3УОФ17', gun: '2a70', type: 'he', v0: 250, mass: 15.6, note: 'Осколочно-фугасный снаряд орудия малого давления. Низкая скорость даёт навесную траекторию.' },
  { id: '9m117', name: '9М117 «Аркан»', gun: '2a70', type: 'missile', note: 'Управляемая ракета, запускаемая через ствол, с наведением по лазерному лучу.' },
  // 30-мм 2А42
  { id: '3ubr6', name: '3УБР6', gun: '2a42', type: 'ap', v0: 970, mass: 0.4, note: 'Бронебойно-трассирующий снаряд.' },
  { id: '3ubr8', name: '3УБР8', gun: '2a42', type: 'apds', v0: 1120, note: 'Подкалиберный снаряд с отделяемым поддоном.' },
  { id: '3uof8', name: '3УОФ8', gun: '2a42', type: 'he', v0: 960, mass: 0.39, note: 'Осколочно-фугасно-зажигательный снаряд.' },
  // 25-мм M242
  { id: 'm791', name: 'M791 APDS-T', gun: 'm242', type: 'apds', v0: 1345, mass: 0.1, note: 'Подкалиберный трассирующий снаряд с вольфрамовым сердечником.' },
  { id: 'm919', name: 'M919 APFSDS-T', gun: 'm242', type: 'apfsds', v0: 1385, note: 'Оперённый подкалиберный снаряд с сердечником из обеднённого урана.' },
  { id: 'm792', name: 'M792 HEI-T', gun: 'm242', type: 'he', v0: 1100, mass: 0.18, note: 'Осколочно-фугасно-зажигательный трассирующий снаряд.' },
  // 20-мм Rh 202
  { id: 'dm81', name: '20 мм HEI', gun: 'rh-202', type: 'he', v0: 1045, mass: 0.12, note: 'Осколочно-фугасно-зажигательный снаряд патрона 20x139 мм.' },
  { id: 'dm63', name: '20 мм APDS', gun: 'rh-202', type: 'apds', v0: 1150, note: 'Подкалиберный снаряд с отделяемым поддоном.' },
  // 30-мм RARDEN
  { id: 'l14', name: 'L14 APDS', gun: 'rarden', type: 'apds', v0: 1175, note: 'Подкалиберный снаряд для борьбы с лёгкой бронетехникой.' },
  { id: 'l13', name: 'L13 HE', gun: 'rarden', type: 'he', v0: 1070, note: 'Осколочно-фугасный снаряд. Пушка заряжается обоймами по три выстрела.' },
  // 40-мм Bofors
  { id: 'bofors-he', name: '40 мм HE', gun: 'bofors-40', type: 'he', v0: 1025, mass: 0.96, note: 'Осколочно-фугасный снаряд. Современные версии имеют программируемый взрыватель.' },
  { id: 'bofors-apfsds', name: '40 мм APFSDS-T', gun: 'bofors-40', type: 'apfsds', v0: 1470, note: 'Оперённый подкалиберный снаряд.' },
  // Пулемёты бронетранспортёров и пушки без подробных данных
  { id: 'b-32-145', name: 'Б-32, 14,5 мм', gun: 'kpvt', type: 'ap', v0: 1005, mass: 0.064, note: 'Бронебойно-зажигательная пуля патрона 14,5x114 мм.' },
  { id: 'm33-ball', name: 'M33, 12,7 мм', gun: 'm2-50', type: 'ap', v0: 890, mass: 0.042, note: 'Обычная пуля патрона 12,7x99 мм. Бронебойные версии имеют закалённый сердечник.' },
  { id: 'lps-762', name: 'ЛПС, 7,62 мм', gun: 'sgmb', type: 'ap', v0: 800, mass: 0.0096, note: 'Пуля со стальным сердечником патрона 7,62x54 мм.' },
  { id: 'm80-762', name: 'M80, 7,62 мм', gun: 'nato-762', type: 'ap', v0: 838, mass: 0.0095, note: 'Обычная пуля патрона 7,62x51 мм.' },
  { id: 'mk30-apfsds', name: '30 мм APFSDS-T', gun: 'mk30', type: 'apfsds', note: 'Оперённый подкалиберный снаряд патрона 30x173 мм. Точные данные в открытых источниках расходятся.' },
  { id: 'mk30-ketf', name: '30 мм KETF', gun: 'mk30', type: 'he', note: 'Снаряд с программируемым взрывателем: в заданной точке выбрасывает вперёд облако готовых поражающих элементов.' },
  { id: 'dtw-125', name: 'DTW-125', gun: 'zpt-98', type: 'apfsds', v0: 1740, note: 'Китайский оперённый подкалиберный снаряд. Масса в полёте не публиковалась.' },
  { id: '3bm59', name: '3БМ59 «Свинец-1»', gun: '2a82', type: 'apfsds', note: 'Удлинённый подкалиберный снаряд нового поколения. Характеристики официально не публиковались.' },
  // Орудия техники Вьетнамской войны
  { id: 'm339', name: 'M339 AP', gun: 'm32', type: 'ap', v0: 975, note: 'Бронебойный снаряд лёгкого танка M41.' },
  { id: 'm352', name: 'M352 HE', gun: 'm32', type: 'he', v0: 732, note: 'Осколочно-фугасный снаряд.' },
  { id: 'br-350a', name: 'БР-350А', gun: 'd-56t', type: 'ap', v0: 655, mass: 6.3, note: 'Бронебойный снаряд, общий с дивизионной пушкой ЗиС-3.' },
  { id: 'of-350', name: 'ОФ-350', gun: 'd-56t', type: 'he', v0: 680, mass: 6.2, note: 'Осколочно-фугасная граната.' },
  { id: 'm409', name: 'M409 HEAT-MP', gun: 'm81', type: 'heat', v0: 683, mass: 22, note: 'Многоцелевой кумулятивный снаряд со сгорающей гильзой.' },
  { id: 'mgm-51-shell', name: 'MGM-51 Shillelagh', gun: 'm81', type: 'missile', note: 'Управляемая ракета с наведением по инфракрасному лучу, дальность ≈2-3 км.' },
  { id: 'm437', name: 'M437', gun: 'm113-175', type: 'he', v0: 914, mass: 66.6, rangeKm: 32.7, note: 'Осколочно-фугасный снаряд дальнобойной пушки.' },
  { id: 'of-482m', name: 'ОФ-482М', gun: 'm46-130', type: 'he', v0: 930, mass: 33.4, rangeKm: 27.5, note: 'Осколочно-фугасный снаряд, полный заряд.' },
  { id: 'm1-he', name: 'M1', gun: 'm137', type: 'he', v0: 494, mass: 15, rangeKm: 11.5, note: 'Стандартный 105-мм осколочно-фугасный снаряд.' },
  // Гаубицы
  { id: '3of56', name: '3ОФ56', gun: '2a31', type: 'he', v0: 690, mass: 21.8, rangeKm: 15.2, note: 'Осколочно-фугасный снаряд, полный заряд.' },
  { id: '3of25', name: '3ОФ25', gun: '2a33', type: 'he', v0: 655, mass: 43.6, rangeKm: 17.4, note: 'Осколочно-фугасный снаряд, полный заряд.' },
  { id: '3of45', name: '3ОФ45', gun: '2a64', type: 'he', v0: 810, mass: 43.6, rangeKm: 24.7, note: 'Осколочно-фугасный снаряд улучшенной аэродинамической формы.' },
  { id: 'm107', name: 'M107', gun: 'm185', type: 'he', v0: 684, mass: 43.2, rangeKm: 18.1, note: 'Стандартный осколочно-фугасный снаряд НАТО с 1950-х годов.' },
  { id: 'l15-he', name: 'L15 HE', gun: 'l31-39', type: 'he', v0: 827, mass: 43.5, rangeKm: 24.7, note: 'Осколочно-фугасный снаряд увеличенной дальности.' },
  { id: 'dm121', name: 'DM121', gun: 'l52', type: 'he', v0: 945, mass: 43.5, rangeKm: 30, note: 'Осколочно-фугасный снаряд с обтекаемой донной частью. С донным газогенератором дальность достигает ≈40 км.' },
  { id: 'm106', name: 'M106', gun: 'm201', type: 'he', v0: 711, mass: 92.5, rangeKm: 22.9, note: 'Осколочно-фугасный 203-мм снаряд.' },
  { id: '3of43', name: '3ОФ43', gun: '2a44', type: 'he', v0: 960, mass: 110, rangeKm: 37.5, note: 'Осколочно-фугасный 203-мм снаряд самой дальнобойной советской самоходной пушки.' },
];

export const gunById = (id: string): Gun => guns.find((gun) => gun.id === id)!;
export const shellTypeById = (id: ShellType['id']): ShellType => shellTypes.find((type) => type.id === id)!;
export const shellsOfGun = (gunId: string): Shell[] => shells.filter((shell) => shell.gun === gunId);
export const gunsOfPlatform = (itemId: string): Gun[] => guns.filter((gun) => gun.platforms.includes(itemId));
export const gunsOfWeapon = (weaponId: string): Gun[] => guns.filter((gun) => gun.weaponId === weaponId);
