/** Углы обзора бортовых систем самолётов и вертолётов. Значения по открытым данным, ориентировочные. */
export interface ArcSystem {
  name: string;
  /** Полуугол в градусах относительно носа: 60 означает сектор ±60°, 180 означает круговой обзор */
  half: number;
  note?: string;
}

export interface AircraftCoverage {
  radar?: ArcSystem;
  rwr?: ArcSystem;
  maws?: ArcSystem & { sphere?: boolean };
  /** Если данных нет: none (на борту не было) или undisclosed (открытых данных нет) */
  status?: 'none' | 'undisclosed';
  note?: string;
}

export const NO_SYSTEMS = 'На самолётах этого поколения станций предупреждения об облучении и бортовых комплексов обороны не было.';
export const NO_DATA = 'Углы работы бортовых систем этой машины в открытых источниках не публикуются.';

export const coverage: Record<string, AircraftCoverage> = {
  'mig-15': { status: 'none', note: NO_SYSTEMS },
  'f-86': { status: 'none', note: NO_SYSTEMS },
  'f-15': {
    radar: { name: 'AN/APG-63', half: 60, note: 'Механическое сканирование антенной' },
    rwr: { name: 'AN/ALR-56', half: 180, note: 'Круговой обзор' },
  },
  'f-22': {
    radar: { name: 'AN/APG-77', half: 60, note: 'Электронное сканирование АФАР' },
    rwr: { name: 'AN/ALR-94', half: 180, note: 'Круговой обзор' },
    maws: { name: 'AN/AAR-56', half: 180, sphere: true, note: 'Датчики вокруг фюзеляжа обеспечивают почти полную сферу' },
  },
  'f-35a': {
    radar: { name: 'AN/APG-81', half: 60, note: 'Электронное сканирование АФАР' },
    rwr: { name: 'AN/ASQ-239 Barracuda', half: 180, note: 'Круговой обзор' },
    maws: { name: 'AN/AAQ-37 DAS', half: 180, sphere: true, note: 'Шесть датчиков образуют полную сферу обзора' },
  },
  'eurofighter': {
    radar: { name: 'CAPTOR-E', half: 100, note: 'Радиолокатор с активной фазированной решёткой и подвижным приводом: сектор обзора 100° x 100° в каждую сторону. Ранние серии (Tranche 1 и 2) несут механический CAPTOR-M с обзором ≈±70°' },
    rwr: { name: 'DASS', half: 180, note: 'Круговой обзор' },
  },
  'su-27': {
    radar: { name: 'Н001', half: 60, note: 'Механическое сканирование антенной' },
    rwr: { name: 'СПО-15 «Берёза»', half: 180, note: 'Круговой обзор' },
  },
  'su-35': {
    radar: { name: 'Н035 «Ирбис»', half: 120, note: 'Сектор обзора 120° x 120° в каждую сторону: электронное сканирование дополняется поворотом решётки' },
    rwr: { name: 'Л-150 «Пастель»', half: 180, note: 'Круговой обзор' },
  },
  'mig-29': {
    radar: { name: 'Н019 «Рубин»', half: 70, note: 'Базовая версия 9-12, механическое сканирование. У МиГ-29СМТ радиолокатор Н010М «Жук-М» с сектором 90° x 90°' },
    rwr: { name: 'СПО-15 «Берёза»', half: 180, note: 'Круговой обзор' },
  },
  'su-57': {
    radar: { name: 'Н036 «Белка»', half: 60, note: 'Угол основной решётки, боковые антенны расширяют обзор' },
  },
  'a-10': {
    rwr: { name: 'AN/ALR-69', half: 180, note: 'Круговой обзор' },
  },
  'e-3': { radar: { name: 'AN/APY-1/2', half: 180, note: 'Вращающийся обтекатель, обзор по всем направлениям' } },
  'a-50': { radar: { name: 'Шмель', half: 180, note: 'Вращающийся обтекатель, обзор по всем направлениям' } },
  'e-2d': { radar: { name: 'AN/APY-9', half: 180, note: 'Вращающийся обтекатель, обзор по всем направлениям' } },
  'ah-64': { rwr: { name: 'AN/APR-39', half: 180, note: 'Круговой обзор' } },
  'uh-60': { rwr: { name: 'AN/APR-39', half: 180, note: 'Круговой обзор' } },
};

export const coverageFor = (id: string): AircraftCoverage => coverage[id] ?? { status: 'undisclosed', note: NO_DATA };
