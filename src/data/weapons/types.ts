export type WeaponCategoryId = 'aam' | 'agm' | 'antiship' | 'cruise' | 'sam' | 'atgm' | 'guns' | 'torpedo';

export type WeaponMetricId = 'range' | 'speed' | 'mass' | 'warhead' | 'length' | 'diameter' | 'rpm' | 'muzzle';

export type TrajectoryScene = 'ballistic' | 'sam' | 'cruise' | 'seaskim' | 'aam' | 'atgm' | 'torpedo' | 'strike';

export interface WeaponCategory {
  id: WeaponCategoryId;
  name: string;
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
  category: WeaponCategoryId;
  /** Тип одной строкой, например «Ракета ближнего боя с ИК-наведением» */
  type: string;
  specs: Partial<Record<WeaponMetricId, number>>;
  guidance: string;
  propulsion: string;
  warheadType: string;
  /** id моделей техники, на которых применяется */
  platforms: string[];
  wiki: string;
}

export interface WeaponText {
  summary: string;
  history: string;
  principle: string;
  features: string[];
  fact: string;
}
