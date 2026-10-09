/**
 * Схемы бронирования и их работа против разных типов снарядов.
 * Модель качественная: слои условные, толщины и стойкость реальных машин не приводятся.
 * Доля погашенного воздействия по слоям подобрана так, чтобы итог совпадал с общеизвестными
 * закономерностями (например, кумулятивный заряд против динамической защиты), а не с цифрами пробития.
 */
export type ThreatId = 'apfsds' | 'heat' | 'tandem' | 'hesh' | 'autocannon' | 'frag';
export type LayerKind = 'aps' | 'era' | 'nera' | 'slat' | 'addon' | 'steel' | 'ceramic' | 'air' | 'back' | 'alu' | 'liner';
export type ArmorSchemeId = 'steel' | 'composite' | 'composite-era' | 'modular-aps' | 'light' | 'light-addon';

export interface Threat {
  id: ThreatId;
  name: string;
  short: string;
  text: string;
  /** Условная исходная сила воздействия. */
  power: number;
}

export interface LayerType {
  kind: LayerKind;
  name: string;
  text: string;
  /** Какую долю воздействия гасит слой для каждой угрозы. */
  absorb: Record<ThreatId, number>;
  /** Относительная ширина слоя на схеме. */
  width: number;
}

export interface ArmorScheme {
  id: ArmorSchemeId;
  name: string;
  text: string;
  /** Слои снаружи внутрь. */
  layers: LayerKind[];
}

export const threats: Threat[] = [
  { id: 'apfsds', short: 'БОПС', name: 'Оперённый подкалиберный снаряд', power: 1, text: 'Длинный стержень из плотного сплава пробивает броню за счёт скорости и массы. Против него работает толщина, плотность и твёрдость преграды.' },
  { id: 'heat', short: 'КС', name: 'Кумулятивный снаряд или граната', power: 1, text: 'Заряд формирует тонкую металлическую струю. Струю можно разрушить или отклонить движущимися пластинами и слоями разной плотности.' },
  { id: 'tandem', short: 'Тандем', name: 'Тандемный кумулятивный заряд', power: 1.3, text: 'Первый малый заряд заранее подрывает динамическую защиту, второй пробивает основную броню.' },
  { id: 'hesh', short: 'БФС', name: 'Бронебойно-фугасный снаряд', power: 1, text: 'Пластичная взрывчатка расплющивается на броне и подрывается. Ударная волна откалывает осколки с внутренней стороны сплошной плиты.' },
  { id: 'autocannon', short: '30 мм', name: 'Бронебойный снаряд автоматической пушки', power: 1, text: 'Малокалиберные снаряды опасны для лёгкой бронетехники и навесного оборудования, но не для основной брони танка.' },
  { id: 'frag', short: 'Осколки', name: 'Осколки и ударная волна', power: 1, text: 'Осколки артиллерийских снарядов и мин. От них защищает даже тонкая броня, поэтому основная масса бронемашин рассчитана именно на них.' },
];

const absorb = (apfsds: number, heat: number, tandem: number, hesh: number, autocannon: number, frag: number): Record<ThreatId, number> => ({ apfsds, heat, tandem, hesh, autocannon, frag });

export const layerTypes: LayerType[] = [
  { kind: 'aps', name: 'Комплекс активной защиты', width: 0.5, absorb: absorb(0.15, 0.9, 0.9, 0.9, 0, 0),
    text: 'Радиолокатор замечает подлетающую ракету или гранату, и защитный боеприпас разрушает её в нескольких метрах от машины. Против быстрых подкалиберных снарядов эффективность ограничена.' },
  { kind: 'slat', name: 'Решётчатый экран', width: 0.35, absorb: absorb(0, 0.35, 0.3, 0.2, 0, 0.2),
    text: 'Решётка сминает или закорачивает взрыватель реактивной гранаты до того, как сформируется струя. Срабатывает не всегда: всё зависит от того, куда попадёт граната.' },
  { kind: 'era', name: 'Динамическая защита', width: 0.45, absorb: absorb(0.2, 0.6, 0.1, 0.5, 0.1, 1),
    text: 'Коробки с пластинами и слоем взрывчатки между ними. При попадании пластины разлетаются навстречу струе и разрушают её. Современные тяжёлые блоки частично работают и против подкалиберных снарядов.' },
  { kind: 'nera', name: 'Полуактивные пакеты', width: 0.6, absorb: absorb(0.25, 0.45, 0.4, 0.6, 0.3, 1),
    text: 'Пластины металла с упругим наполнителем без взрывчатки. Под ударом они выпучиваются и сдвигаются, разрушая струю и изгибая сердечник. Не боятся повторных попаданий так, как динамическая защита.' },
  { kind: 'addon', name: 'Навесные модули', width: 0.5, absorb: absorb(0.15, 0.25, 0.25, 0.5, 0.5, 1),
    text: 'Съёмные плиты из стали, керамики или композитов поверх корпуса. Их ставят под задачу и снимают для перевозки по воздуху.' },
  { kind: 'steel', name: 'Наружная стальная плита', width: 1, absorb: absorb(0.3, 0.3, 0.3, 0.3, 1, 1),
    text: 'Катаная или литая броневая сталь. Работает за счёт толщины и наклона: наклонная плита длиннее на пути снаряда и может вызвать рикошет.' },
  { kind: 'ceramic', name: 'Наполнитель: керамика и композиты', width: 1.1, absorb: absorb(0.4, 0.75, 0.75, 0.8, 1, 1),
    text: 'Слой материалов другой плотности и твёрдости: керамика, стеклотекстолит, особые сплавы. Керамика дробит сердечник и рассеивает струю при меньшей массе, чем сталь.' },
  { kind: 'air', name: 'Воздушный зазор', width: 0.45, absorb: absorb(0, 0.1, 0.1, 0.7, 0, 0),
    text: 'Разнесение слоёв. Бронебойно-фугасный снаряд срабатывает на наружном листе, и ударная волна не доходит до основной брони. Струя кумулятивного заряда на зазоре начинает распадаться.' },
  { kind: 'back', name: 'Тыльная стальная плита', width: 0.8, absorb: absorb(0.3, 0.25, 0.25, 0.2, 1, 1),
    text: 'Несущая плита, которая останавливает ослабленные остатки сердечника или струи.' },
  { kind: 'alu', name: 'Корпус из лёгкой брони', width: 0.6, absorb: absorb(0.05, 0.05, 0.05, 0.3, 0.45, 0.9),
    text: 'Алюминиевый сплав или тонкая сталь. Держит пули и осколки, а в лобовой части иногда и снаряды малого калибра.' },
  { kind: 'liner', name: 'Противоосколочный подбой', width: 0.25, absorb: absorb(0, 0, 0, 0.1, 0.05, 0.3),
    text: 'Слой арамидной ткани или полимера на внутренней стороне. Броню не усиливает, но задерживает вторичные осколки и сужает конус их разлёта.' },
];

export const armorSchemes: ArmorScheme[] = [
  { id: 'steel', name: 'Гомогенная стальная броня', layers: ['steel', 'back'],
    text: 'Танки первых послевоенных поколений. Защита обеспечивается толщиной и наклоном стали. С появлением кумулятивных боеприпасов и оперённых снарядов такая броня перестала справляться.' },
  { id: 'composite', name: 'Комбинированная броня', layers: ['steel', 'ceramic', 'back', 'liner'],
    text: 'Между стальными плитами размещён наполнитель другой плотности. Схема появилась в 1960-1970-х прежде всего как ответ на кумулятивные боеприпасы.' },
  { id: 'composite-era', name: 'Комбинированная броня с динамической защитой', layers: ['era', 'steel', 'ceramic', 'back', 'liner'],
    text: 'Поверх комбинированной брони установлены блоки динамической защиты. В ответ появились тандемные боевые части.' },
  { id: 'modular-aps', name: 'Модульная броня с активной защитой', layers: ['aps', 'nera', 'steel', 'ceramic', 'back', 'liner'],
    text: 'Современные танки: сменные модули с полуактивными пакетами и комплекс активной защиты, который перехватывает ракеты и гранаты на подлёте.' },
  { id: 'light', name: 'Лёгкая противопульная броня', layers: ['alu', 'liner'],
    text: 'Бронетранспортёры и ранние боевые машины пехоты. Задача: защитить от пуль и осколков при малой массе, чтобы машина плавала и перевозилась по воздуху.' },
  { id: 'light-addon', name: 'Лёгкая броня с навесной защитой', layers: ['slat', 'addon', 'air', 'alu', 'liner'],
    text: 'Современные боевые машины пехоты: базовый корпус усилен навесными модулями, разнесением и решётками против гранатомётов.' },
];

/** Схема бронирования по моделям техники. */
export const armorOf: Record<string, ArmorSchemeId> = {
  // steel
  't-54': 'steel', 'm48': 'steel', 'type-59': 'steel', 'm60': 'steel', 't-62': 'steel', 'leopard-1': 'steel', 'amx-30': 'steel', 'chieftain': 'steel',
  // composite
  't-64': 'composite', 't-72': 'composite', 'leopard-2': 'composite', 'm1-abrams': 'composite', 'challenger-2': 'composite', 'leclerc': 'composite', 'type-10': 'composite', 'leopard-2a7': 'composite', 'tos-1a': 'composite',
  // composite-era
  't-80': 'composite-era', 't-90': 'composite-era', 't-90m': 'composite-era', 'type-99': 'composite-era', 'vt-4': 'composite-era', 'k2': 'composite-era',
  // modular-aps
  't-14': 'modular-aps', 'merkava-4': 'modular-aps', 'm1a2-sepv3': 'modular-aps', 'namer': 'modular-aps',
  // light
  'bmp-1': 'light', 'm113': 'light', 'btr-152': 'light', 'btr-40': 'light', 'btr-50': 'light', 'btr-60': 'light', 'btr-70': 'light', 'btr-80': 'light', 'btr-82a': 'light', 'bmp-2': 'light', 'bmp-3': 'light', 'bmd-4m': 'light', 'lvtp-5': 'light', 'vab': 'light', 'fuchs': 'light', 'lav-25': 'light', 'pt-76': 'light', 'm41': 'light', 'm551': 'light', 'm109': 'light', '2s3': 'light', '2s1': 'light', '2s19': 'light', 'pzh-2000': 'light', 'as-90': 'light', 'k9': 'light', 'krab': 'light', 'caesar': 'light', 'archer': 'light', 'zsu-57-2': 'light', 'm42': 'light', 'm163': 'light',
  // light-addon
  'm2-bradley': 'light-addon', 'marder': 'light-addon', 'warrior': 'light-addon', 'cv90': 'light-addon', 'puma': 'light-addon', 'stryker': 'light-addon', 'patria-amv': 'light-addon', 'boxer': 'light-addon', 'k21': 'light-addon',
  // партия 4: танки
  'type-90': 'composite', 'k1': 'composite', 'arjun': 'composite', 'al-khalid': 'composite', 'leopard-2a5': 'composite', 'ariete': 'composite',
  't-84': 'composite-era', 't-72b3': 'composite-era', 't-80bvm': 'composite-era', 'type-15': 'composite-era',
  // партия 4: бронеавтомобили, БМП и БТР
  't-15': 'modular-aps', 'kurganets-25': 'modular-aps', 'boomerang': 'light-addon', 'btr-90': 'light', 'tigr': 'light', 'ajax': 'light-addon', 'lynx': 'light-addon',
  'dardo': 'light-addon', 'freccia': 'light-addon', 'type-96': 'light', 'zbd-04': 'light-addon', 'zbl-09': 'light-addon', 'm-atv': 'light-addon',
  // партия 4: самоходная артиллерия
  '2s35': 'light', '2s9': 'light', '2s31': 'light', '2s25': 'light', '2s5': 'light', 'plz-05': 'light', 'g6': 'light', 'firtina': 'light',
};

export const STOP_BELOW = 0.15;
export const EDGE_BELOW = 0.35;
