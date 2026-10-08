import type { WeaponCategory, WeaponMetric, WeaponMetricId } from './types';

export const weaponCategories: WeaponCategory[] = [
  { id: 'aam', name: 'Ракеты «воздух-воздух»', lead: 'Управляемые ракеты для поражения воздушных целей с самолётов и вертолётов.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'aam' },
  { id: 'agm', name: 'Авиационные средства поражения наземных целей', lead: 'Ракеты и управляемые бомбы для ударов по земле, кораблям и радиолокаторам.', metrics: ['range', 'mass', 'warhead'], scene: 'strike' },
  { id: 'antiship', name: 'Противокорабельные ракеты', lead: 'Ракеты для поражения надводных кораблей, летящие на малой высоте над морем.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'seaskim' },
  { id: 'cruise', name: 'Крылатые ракеты', lead: 'Беспилотные самолёты-снаряды для ударов по наземным целям на большом расстоянии.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'cruise' },
  { id: 'sam', name: 'Зенитные ракеты', lead: 'Ракеты наземных и корабельных комплексов ПВО и переносных зенитных комплексов.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'sam' },
  { id: 'atgm', name: 'Противотанковые ракеты', lead: 'Управляемые ракеты для борьбы с бронированной техникой.', metrics: ['range', 'mass', 'diameter'], scene: 'atgm' },
  { id: 'guns', name: 'Пушки и автоматические орудия', lead: 'Авиационные, танковые и корабельные орудия.', metrics: ['diameter', 'rpm', 'muzzle', 'mass'] },
  { id: 'torpedo', name: 'Торпеды', lead: 'Подводное оружие для поражения подводных лодок и кораблей.', metrics: ['range', 'speed', 'mass', 'warhead'], scene: 'torpedo' },
];

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
