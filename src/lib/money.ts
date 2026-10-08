const fmt = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

/** Значение в тысячах долларов в читаемом виде: «35 тыс.» или «1,7 млн». */
export function moneyShort(thousands: number): string {
  if (thousands >= 1000) return `${fmt.format(thousands / 1000)} млн`;
  return `${fmt.format(thousands)} тыс.`;
}

/** Диапазон в тысячах долларов: «≈35-90 тыс. $» или «≈1,7-2,2 млн $». */
export function moneyRange(from: number, to: number): string {
  if (to >= 1000 && from >= 1000) return `≈${fmt.format(from / 1000)}-${fmt.format(to / 1000)} млн $`;
  if (to >= 1000) return `≈${moneyShort(from)} - ${moneyShort(to)} $`;
  return `≈${fmt.format(from)}-${fmt.format(to)} тыс. $`;
}
