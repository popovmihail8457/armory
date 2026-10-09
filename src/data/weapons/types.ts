export type WeaponCategoryId =
  | 'aam' | 'sam' | 'agm' | 'arm' | 'air-sea' | 'sea-air' | 'sea-sea' | 'sea-surface'
  | 'ground-ground' | 'ground-sea' | 'abm' | 'guided-bombs' | 'bombs' | 'cruise'
  | 'atgm' | 'rockets' | 'guns' | 'torpedo' | 'asw'
  | 'light-agm' | 'manpads'
  | 'rifles' | 'snipers' | 'smg' | 'mg' | 'grenade-launchers' | 'at-launchers' | 'mortars'
  | 'howitzers' | 'tank-guns' | 'autocannons' | 'aircraft-guns' | 'naval-guns';

export type WeaponMetricId = 'range' | 'speed' | 'mass' | 'warhead' | 'length' | 'diameter' | 'rpm' | 'muzzle';

export type TrajectoryScene =
  | 'ballistic' | 'quasi' | 'sam' | 'cruise' | 'seaskim' | 'aam' | 'atgm' | 'torpedo' | 'strike'
  | 'agm' | 'arm' | 'laser' | 'bullet' | 'lob' | 'mortar' | 'direct' | 'artillery' | 'tankshot' | 'burst' | 'navalfire';

export type WarheadScene = 'frag' | 'shaped' | 'tandem' | 'kinetic' | 'blast' | 'penetrator' | 'cluster';

export interface WeaponCategory {
  id: WeaponCategoryId;
  /** Короткая подпись схемы, например «Воздух-воздух» */
  name: string;
  /** Группа в меню: ракеты по схеме применения, бомбы, ствольное оружие и т.д. */
  group: 'missiles' | 'guided-light' | 'bombs' | 'infantry' | 'artillery' | 'other';
  lead: string;
  metrics: WeaponMetricId[];
  scene?: TrajectoryScene;
}

export interface WeaponMetric {
  label: string;
  unit: string;
}

export interface WeaponData {
  id: string;
  name: string;
  country: string;
  year: number;
  /** Основной класс */
  category: WeaponCategoryId;
  /** Дополнительные классы, в которые образец тоже входит */
  also?: WeaponCategoryId[];
  /** Тип одной строкой, например «Ракета ближнего боя с ИК-наведением» */
  type: string;
  specs: Partial<Record<WeaponMetricId, number>>;
  guidance: string;
  propulsion: string;
  warheadType: string;
  /** id моделей техники, на которых применяется */
  platforms: string[];
  wiki: string;
  /** Краткое описание для записей сокращённого формата (без отдельного текста в texts.ts). */
  brief?: string;
}

export interface WeaponText {
  summary: string;
  history: string;
  principle: string;
  features: string[];
  fact: string;
}
