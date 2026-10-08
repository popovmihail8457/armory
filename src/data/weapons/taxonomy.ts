import type { WeaponCategory, WeaponMetric, WeaponMetricId } from './types';

export const weaponCategories: WeaponCategory[] = [
  { id: 'aam', name: 'Воздух-воздух', group: 'missiles', lead: 'Управляемые ракеты для поражения воздушных целей с самолётов и вертолётов.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'aam' },
  { id: 'sam', name: 'Земля-воздух', group: 'missiles', lead: 'Зенитные ракеты наземных комплексов ПВО и переносных зенитных комплексов.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'sam' },
  { id: 'agm', name: 'Воздух-поверхность', group: 'missiles', lead: 'Ракеты для ударов с самолётов и вертолётов по наземным и надводным целям.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'strike' },
  { id: 'arm', name: 'Противорадиолокационные', group: 'missiles', lead: 'Ракеты, наводящиеся на излучение радиолокационных станций противника.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'strike' },
  { id: 'air-sea', name: 'Воздух-море', group: 'missiles', lead: 'Противокорабельные ракеты, запускаемые с самолётов и вертолётов.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'seaskim' },
  { id: 'sea-air', name: 'Море-воздух', group: 'missiles', lead: 'Корабельные зенитные ракеты для обороны от самолётов и ракет.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'sam' },
  { id: 'sea-sea', name: 'Море-море', group: 'missiles', lead: 'Противокорабельные ракеты, запускаемые с кораблей и подводных лодок.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'seaskim' },
  { id: 'sea-surface', name: 'Море-поверхность', group: 'missiles', lead: 'Корабельное оружие для поражения береговых целей.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'cruise' },
  { id: 'ground-ground', name: 'Земля-земля', group: 'missiles', lead: 'Тактические и оперативно-тактические ракеты наземных комплексов.', metrics: ['range', 'mass', 'warhead', 'length'], scene: 'ballistic' },
  { id: 'ground-sea', name: 'Земля-море (береговые)', group: 'missiles', lead: 'Береговые противокорабельные ракетные комплексы.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'seaskim' },
  { id: 'abm', name: 'Противоракетная оборона', group: 'missiles', lead: 'Ракеты-перехватчики для поражения баллистических ракет и боеприпасов.', metrics: ['range', 'mass', 'length', 'diameter'], scene: 'sam' },
  { id: 'cruise', name: 'Крылатые ракеты', group: 'missiles', lead: 'Беспилотные самолёты-снаряды для ударов по наземным целям на большом расстоянии.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'cruise' },
  { id: 'atgm', name: 'Противотанковые ракеты', group: 'missiles', lead: 'Управляемые ракеты для борьбы с бронированной техникой.', metrics: ['range', 'mass', 'diameter'], scene: 'atgm' },
  { id: 'asw', name: 'Противолодочные', group: 'missiles', lead: 'Ракеты и торпеды для поражения подводных лодок.', metrics: ['range', 'mass', 'warhead'], scene: 'torpedo' },
  { id: 'guided-bombs', name: 'Управляемые и планирующие бомбы', group: 'bombs', lead: 'Бомбы с комплектом наведения и крыльями, которые планируют к цели после сброса.', metrics: ['range', 'mass', 'warhead', 'length'], scene: 'strike' },
  { id: 'bombs', name: 'Свободные бомбы', group: 'bombs', lead: 'Авиабомбы без наведения, падающие по баллистической траектории.', metrics: ['mass', 'warhead', 'length', 'diameter'], scene: 'strike' },
  { id: 'rockets', name: 'Неуправляемые ракеты и РСЗО', group: 'other', lead: 'Реактивные снаряды вертолётов, самолётов и систем залпового огня.', metrics: ['range', 'mass', 'diameter', 'warhead'], scene: 'ballistic' },
  { id: 'guns', name: 'Пушки и пулемёты', group: 'other', lead: 'Авиационные, танковые, корабельные орудия и пулемёты.', metrics: ['diameter', 'rpm', 'muzzle', 'mass'] },
  { id: 'torpedo', name: 'Торпеды', group: 'other', lead: 'Подводное оружие для поражения подводных лодок и кораблей.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'torpedo' },
];

export const weaponGroups: Record<WeaponCategory['group'], string> = {
  missiles: 'Ракеты по схеме применения',
  bombs: 'Бомбы',
  other: 'Прочее оружие',
};

export const weaponMetrics: Record<WeaponMetricId, WeaponMetric> = {
  range: { label: 'Дальность', unit: 'км' },
  speed: { label: 'Скорость', unit: 'км/ч' },
  mass: { label: 'Масса', unit: 'кг' },
  warhead: { label: 'Масса боевой части', unit: 'кг' },
  length: { label: 'Длина', unit: 'м' },
  diameter: { label: 'Калибр или диаметр', unit: 'мм' },
  rpm: { label: 'Скорострельность', unit: 'выстр./мин' },
  muzzle: { label: 'Начальная скорость снаряда', unit: 'м/с' },
};
