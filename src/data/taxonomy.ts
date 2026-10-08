export type EraId = 'early' | 'late' | 'post' | 'modern';
export type DomainId = 'fleet' | 'aviation' | 'ground';
export type MetricId =
  | 'speed' | 'range' | 'mtow' | 'endurance'
  | 'displacement' | 'length' | 'speedKn'
  | 'mass' | 'caliber';

export interface Era {
  id: EraId;
  name: string;
  from: number;
  to: number;
  lead: string;
}

export interface Domain {
  id: DomainId;
  name: string;
  lead: string;
}

export interface Group {
  id: string;
  domain: DomainId;
  name: string;
  lead: string;
  metrics: MetricId[];
}

export interface Metric {
  label: string;
  unit: string;
}

export const eras: Era[] = [
  { id: 'early', name: 'Ранняя холодная война', from: 1947, to: 1962, lead: 'От доктрины Трумэна до Карибского кризиса: реактивная авиация, первые атомные подлодки, танки послевоенного поколения.' },
  { id: 'late', name: 'Поздняя холодная война', from: 1963, to: 1991, lead: 'Гонка систем оружия: ракетные подлодки, машины четвёртого поколения, массовые БМП и РСЗО.' },
  { id: 'post', name: 'Постсоветский период', from: 1992, to: 2009, lead: 'Сокращение флотов, цифровизация, малозаметность и высокоточное оружие.' },
  { id: 'modern', name: 'Современность', from: 2010, to: 2026, lead: 'Пятое поколение авиации, беспилотники, новые авианосцы и средства противовоздушной обороны большой дальности.' },
];

export const domains: Domain[] = [
  { id: 'fleet', name: 'Флот', lead: 'Авианосцы, подводные лодки, надводные боевые корабли и десантные корабли.' },
  { id: 'aviation', name: 'Авиация', lead: 'Истребители, бомбардировщики, транспортная авиация, вертолёты и беспилотники.' },
  { id: 'ground', name: 'Наземная техника', lead: 'Танки, боевые машины пехоты, артиллерия, реактивные системы и ПВО.' },
];

export const groups: Group[] = [
  { id: 'carriers', domain: 'fleet', name: 'Авианосцы', lead: 'Плавучие аэродромы: основа морской авиации.', metrics: ['displacement', 'length', 'speedKn'] },
  { id: 'submarines', domain: 'fleet', name: 'Подводные лодки', lead: 'Атомные ударные и ракетные подводные лодки.', metrics: ['displacement', 'length', 'speedKn'] },
  { id: 'surface', domain: 'fleet', name: 'Эсминцы и крейсеры', lead: 'Надводные корабли с ракетным вооружением.', metrics: ['displacement', 'length', 'speedKn'] },
  { id: 'amphibious', domain: 'fleet', name: 'Десантные корабли', lead: 'Корабли для высадки морской пехоты и техники.', metrics: ['displacement', 'length', 'speedKn'] },
  { id: 'fighters', domain: 'aviation', name: 'Истребители', lead: 'Самолёты завоевания превосходства в воздухе.', metrics: ['speed', 'range', 'mtow'] },
  { id: 'bombers', domain: 'aviation', name: 'Бомбардировщики и штурмовики', lead: 'Ударная авиация дальнего и фронтового действия.', metrics: ['speed', 'range', 'mtow'] },
  { id: 'transport', domain: 'aviation', name: 'Транспортная авиация', lead: 'Переброска войск и грузов.', metrics: ['speed', 'range', 'mtow'] },
  { id: 'helicopters', domain: 'aviation', name: 'Вертолёты', lead: 'Ударные и многоцелевые винтокрылые машины.', metrics: ['speed', 'mtow'] },
  { id: 'uav', domain: 'aviation', name: 'Беспилотники', lead: 'Разведывательные и ударные БПЛА.', metrics: ['speed', 'mtow', 'endurance'] },
  { id: 'tanks', domain: 'ground', name: 'Танки', lead: 'Основные боевые танки.', metrics: ['mass', 'speed', 'caliber'] },
  { id: 'ifv', domain: 'ground', name: 'БМП и БТР', lead: 'Бронированные машины для перевозки и поддержки пехоты.', metrics: ['mass', 'speed'] },
  { id: 'artillery', domain: 'ground', name: 'Самоходная артиллерия', lead: 'Самоходные гаубицы и орудия.', metrics: ['mass', 'speed', 'caliber'] },
  { id: 'mlrs', domain: 'ground', name: 'Реактивные системы залпового огня', lead: 'РСЗО: массированный огонь по площадям.', metrics: ['mass', 'caliber', 'range'] },
  { id: 'airdef', domain: 'ground', name: 'Противовоздушная оборона', lead: 'Зенитные ракетные комплексы.', metrics: ['range'] },
];

export const metrics: Record<MetricId, Metric> = {
  speed: { label: 'Максимальная скорость', unit: 'км/ч' },
  range: { label: 'Дальность', unit: 'км' },
  mtow: { label: 'Максимальная взлётная масса', unit: 'т' },
  endurance: { label: 'Продолжительность полёта', unit: 'ч' },
  displacement: { label: 'Полное водоизмещение', unit: 'т' },
  length: { label: 'Длина', unit: 'м' },
  speedKn: { label: 'Скорость хода', unit: 'уз' },
  mass: { label: 'Боевая масса', unit: 'т' },
  caliber: { label: 'Калибр', unit: 'мм' },
};

export const eraColor: Record<EraId, string> = {
  early: 'var(--era-early)',
  late: 'var(--era-late)',
  post: 'var(--era-post)',
  modern: 'var(--era-modern)',
};
