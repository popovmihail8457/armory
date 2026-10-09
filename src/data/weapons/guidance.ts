/**
 * Схемы наведения ракет для анимации на странице образца.
 * ir: тепловая головка с захватом до пуска; ir-link: тепловая головка с радиокоррекцией и захватом после пуска;
 * sarh: полуактивная радиолокационная; arh: инерциальная с радиокоррекцией и активной головкой;
 * command: радиокомандное наведение; tvm: наведение через ракету.
 */
export type GuidanceScene = 'ir' | 'ir-link' | 'sarh' | 'arh' | 'command' | 'tvm';

export const guidanceName: Record<GuidanceScene, string> = {
  ir: 'Тепловая головка',
  'ir-link': 'Тепловая головка с радиокоррекцией',
  sarh: 'Полуактивная радиолокационная',
  arh: 'Активная радиолокационная с радиокоррекцией',
  command: 'Радиокомандное',
  tvm: 'Наведение через ракету',
};

/** Какие схемы показывать для образца. Первая открыта по умолчанию. Пуск с земли или корабля задаётся отдельно. */
export const guidanceScenes: Record<string, GuidanceScene[]> = {
  'aim-9': ['ir', 'ir-link'], 'r-73': ['ir'], 'r-60': ['ir'], 'python-5': ['ir-link', 'ir'], 'iris-t': ['ir-link', 'ir'], 'asraam': ['ir-link', 'ir'],
  'aim-7': ['sarh'], 'r-27': ['sarh', 'ir'], 'super-530': ['sarh'], 'r-23': ['sarh', 'ir'], 'r-33': ['sarh'],
  'aim-120': ['arh'], 'r-77': ['arh'], 'meteor': ['arh'], 'mica': ['arh', 'ir-link'], 'aim-54': ['arh'], 'r-37': ['arh'],
  'stinger-missile': ['ir'], '9m39': ['ir'], 'redeye-missile': ['ir'], '9m32': ['ir'], 'mistral-missile': ['ir'], 'ram': ['ir'],
  'hawk-missile': ['sarh'], '9m38': ['sarh'], '3m9': ['sarh'], 'rim-7': ['sarh'], 'sm-2': ['sarh'], 'essm': ['sarh', 'arh'], 'sea-dart': ['sarh'],
  'v-750': ['command'], '5v27': ['command'], '9m33': ['command'], '9m330': ['command'], '57e6': ['command'], 'starstreak-missile': ['command'],
  'pac-2': ['tvm'], '48n6': ['tvm'],
  'sm-6': ['arh'], 'aster-30': ['arh'], '40n6': ['arh'], 'pac-3': ['arh'],
};

/** Образцы, запускаемые с земли или корабля: на схеме вместо самолёта показывается станция наведения. */
export const groundLaunched = new Set([
  'stinger-missile', '9m39', 'redeye-missile', '9m32', 'mistral-missile', 'ram', 'hawk-missile', '9m38', '3m9', 'rim-7', 'sm-2', 'essm', 'sea-dart',
  'v-750', '5v27', '9m33', '9m330', '57e6', 'starstreak-missile', 'pac-2', '48n6', 'sm-6', 'aster-30', '40n6', 'pac-3',
]);
