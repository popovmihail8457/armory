export type Antenna = 'mechanical' | 'aesa';
export type RadarModeId = 'search' | 'tws' | 'stt' | 'sar' | 'aesa';

export interface RadarMode {
  id: RadarModeId;
  name: string;
  short: string;
  text: string;
  aesaOnly?: boolean;
}

export interface AircraftRadar {
  name: string;
  antenna: Antenna;
}

export const radarModes: RadarMode[] = [
  {
    id: 'search',
    name: 'Обзор',
    short: 'RWS',
    text: 'Луч последовательно просматривает сектор строками. Цель видна только в момент прохода луча и затем гаснет, поэтому ее положение обновляется раз в цикл. Режим даёт широкий охват и не раскрывает, что именно интересует экипаж.',
  },
  {
    id: 'tws',
    name: 'Сопровождение на проходе',
    short: 'TWS',
    text: 'Обзор продолжается, а по каждой найденной цели радар строит трек из нескольких отметок и оценивает курс и скорость. Одновременно ведётся несколько целей, но точность ниже, чем при постоянном наведении луча.',
  },
  {
    id: 'stt',
    name: 'Захват одной цели',
    short: 'STT',
    text: 'Луч становится узким и непрерывно направлен на выбранную цель. Данные обновляются много раз в секунду, и точность максимальна, но обзор остальных направлений прекращается.',
  },
  {
    id: 'sar',
    name: 'Картографирование',
    short: 'SAR',
    text: 'Самолёт движется, а радар освещает полосу земной поверхности сбоку или впереди. Из серии отражений по мере полёта собирается радиолокационное изображение местности, которое видно через облака и ночью.',
  },
  {
    id: 'aesa',
    name: 'Несколько лучей (АФАР)',
    short: 'АФАР',
    aesaOnly: true,
    text: 'Антенна с активной фазированной решёткой формирует луч электронно и может мгновенно менять его направление. Поэтому обзор, сопровождение и другие функции чередуются за доли секунды, как будто выполняются одновременно.',
  },
];

export const aircraftRadar: Record<string, AircraftRadar> = {
  'f-4': { name: 'AN/APQ-120 (поздние серии)', antenna: 'mechanical' },
  'f-15': { name: 'AN/APG-63', antenna: 'mechanical' },
  'su-27': { name: 'Н001 «Меч»', antenna: 'mechanical' },
  'eurofighter': { name: 'CAPTOR-M', antenna: 'mechanical' },
  'f-22': { name: 'AN/APG-77', antenna: 'aesa' },
  'f-35a': { name: 'AN/APG-81', antenna: 'aesa' },
  'su-57': { name: 'Н036 «Белка»', antenna: 'aesa' },
};
