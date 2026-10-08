export type WeaponKind = 'gun' | 'missile' | 'machine-gun' | 'hardpoint' | 'launcher' | 'sensor' | 'other';

/** visible: видно на фото; approx: положение показано приблизительно; hidden: внутри или с другой стороны, на фото не видно */
export type PinState = 'visible' | 'approx' | 'hidden';

export interface Pin {
  x: number;
  y: number;
}

export interface Weapon {
  id: string;
  name: string;
  kind: WeaponKind;
  where: string;
  state: PinState;
  pins?: Pin[];
}

export interface ArmamentEntry {
  /** ключ фото в public/bg/manifest.json */
  photoKey: string;
  alt: string;
  caption: string;
  weapons: Weapon[];
}

export const kindLabel: Record<WeaponKind, string> = {
  gun: 'Орудие',
  missile: 'Ракеты',
  'machine-gun': 'Пулемёт',
  hardpoint: 'Узлы подвески',
  launcher: 'Пусковая установка',
  sensor: 'Датчик',
  other: 'Прочее',
};

export const stateLabel: Record<PinState, string> = {
  visible: 'видно на фото',
  approx: 'положение приблизительное',
  hidden: 'на фото не видно',
};

export const armament: Record<string, ArmamentEntry> = {
  'm1-abrams': {
    photoKey: 'late/ground/tanks',
    alt: 'Танк M1A1 Abrams спереди',
    caption: 'На фото M1A1 с 120-мм пушкой. Базовая M1 (1980 год) несла 105-мм орудие M68.',
    weapons: [
      { id: 'gun', name: '120-мм гладкоствольная пушка M256', kind: 'gun', where: 'В маске орудия, в передней части башни по оси.', state: 'visible', pins: [{ x: 67.7, y: 57 }] },
      { id: 'm2', name: '12,7-мм пулемёт M2HB командира', kind: 'machine-gun', where: 'На башенке командира, справа по ходу (на фото слева).', state: 'visible', pins: [{ x: 47, y: 33.5 }] },
      { id: 'm240', name: '7,62-мм пулемёт M240 заряжающего', kind: 'machine-gun', where: 'На люке заряжающего, слева по ходу (на фото справа).', state: 'approx', pins: [{ x: 59.4, y: 38 }] },
      { id: 'coax', name: '7,62-мм спаренный пулемёт M240', kind: 'machine-gun', where: 'В маске рядом с пушкой, внутри башни.', state: 'hidden' },
    ],
  },
  'arleigh-burke': {
    photoKey: 'post/fleet/surface',
    alt: 'Эсминец USS Arleigh Burke (DDG 51) на ходу',
    caption: 'USS Arleigh Burke (DDG 51), первый корабль серии.',
    weapons: [
      { id: 'mk45', name: '127-мм артиллерийская установка Mk 45', kind: 'gun', where: 'На баке, в носу перед надстройкой.', state: 'visible', pins: [{ x: 73, y: 69 }] },
      { id: 'vls', name: 'Пусковые Mk 41 VLS (всего 90 ячеек на первых кораблях серии)', kind: 'launcher', where: 'Две группы ячеек под палубой: в носу перед надстройкой и в корме. Ракеты SM-2, Tomahawk, ASROC.', state: 'approx', pins: [{ x: 65, y: 69 }, { x: 24, y: 69 }] },
      { id: 'spy', name: 'Радар AN/SPY-1 (фазированные решётки)', kind: 'sensor', where: 'На гранях надстройки, по четыре панели (видна одна).', state: 'visible', pins: [{ x: 51.5, y: 62.5 }] },
      { id: 'mk32', name: 'Торпедные аппараты Mk 32', kind: 'launcher', where: 'По бортам в средней части корпуса.', state: 'hidden' },
    ],
  },
  'a-10': {
    photoKey: 'late/aviation/bombers',
    alt: 'Штурмовики A-10 в строю, вид спереди',
    caption: 'Звено A-10C. Для разметки взят центральный самолёт.',
    weapons: [
      { id: 'gau8', name: '30-мм семиствольная пушка GAU-8/A Avenger', kind: 'gun', where: 'В носу по продольной оси. Ствол, ведущий огонь, лежит на оси самолёта.', state: 'visible', pins: [{ x: 52, y: 77.2 }] },
      { id: 'pylons', name: 'Узлы подвески под крылом (ракеты, бомбы, контейнеры)', kind: 'hardpoint', where: 'Восемь под крылом, ещё три под фюзеляжем. На фото видны внутренние подкрыльевые узлы.', state: 'approx', pins: [{ x: 47.5, y: 70 }, { x: 56.8, y: 70 }] },
    ],
  },
  'f-22': {
    photoKey: 'post/aviation/fighters',
    alt: 'Истребитель F-22 Raptor в полёте',
    caption: 'Основное вооружение скрыто во внутренних отсеках, поэтому с этого ракурса его не видно.',
    weapons: [
      { id: 'amraam', name: 'Ракеты AIM-120 AMRAAM (до 6)', kind: 'missile', where: 'В основном внутреннем отсеке под фюзеляжем между воздухозаборниками.', state: 'hidden', pins: [{ x: 50.5, y: 50 }] },
      { id: 'sidewinder', name: 'Ракеты AIM-9 Sidewinder (2)', kind: 'missile', where: 'В боковых внутренних отсеках по бокам воздухозаборников. Положение условное.', state: 'hidden', pins: [{ x: 45, y: 58 }, { x: 60, y: 47 }] },
      { id: 'm61', name: '20-мм пушка M61A2 Vulcan', kind: 'gun', where: 'В корне правого крыла, за закрывающейся створкой. Положение приблизительное.', state: 'approx', pins: [{ x: 47.5, y: 44.5 }] },
    ],
  },
  'ah-64': {
    photoKey: 'modern/aviation/helicopters',
    alt: 'Ударный вертолёт AH-64E Apache на стоянке',
    caption: 'AH-64E армии Индонезии, вид сбоку.',
    weapons: [
      { id: 'm230', name: '30-мм автоматическая пушка M230', kind: 'gun', where: 'Под носовой частью фюзеляжа, на подвижной установке.', state: 'approx', pins: [{ x: 75, y: 51 }] },
      { id: 'wing', name: 'Пилоны на крылышках: ракеты Hellfire, неуправляемые ракеты Hydra 70', kind: 'hardpoint', where: 'На двух коротких крыльях по бокам фюзеляжа. На фото видно левое крыло, правое скрыто.', state: 'visible', pins: [{ x: 69.5, y: 54.5 }] },
      { id: 'tads', name: 'Оптико-электронная станция TADS/PNVS', kind: 'sensor', where: 'В носовой части, на поворотной турели.', state: 'visible', pins: [{ x: 79.5, y: 47.5 }] },
    ],
  },
  'bmp-1': {
    photoKey: 'late/ground/ifv',
    alt: 'БМП-1, вид сзади слева',
    caption: 'Машина на постаменте, вид с кормы и левого борта.',
    weapons: [
      { id: 'grom', name: '73-мм гладкоствольное орудие 2А28 «Гром»', kind: 'gun', where: 'В башне, ствол направлен вперёд.', state: 'visible', pins: [{ x: 36, y: 31.5 }] },
      { id: 'malyutka', name: 'ПТУР 9М14 «Малютка» на направляющей', kind: 'missile', where: 'Направляющая крепится над стволом орудия. Положение приблизительное.', state: 'approx', pins: [{ x: 33, y: 29 }] },
      { id: 'ports', name: 'Бойницы для стрельбы десанта из личного оружия', kind: 'other', where: 'По бортам десантного отделения (круглые крышки).', state: 'approx', pins: [{ x: 39.6, y: 40.8 }, { x: 46.6, y: 40.5 }, { x: 55.2, y: 38.8 }] },
      { id: 'pkt', name: '7,62-мм пулемёт ПКТ', kind: 'machine-gun', where: 'Спарен с орудием в башне.', state: 'hidden' },
    ],
  },
  'leopard-2': {
    photoKey: 'post/ground/tanks',
    alt: 'Танки Leopard 2A6 ведут огонь',
    caption: 'На фото Leopard 2A6. Первая версия 1979 года несла пушку с более коротким стволом (44 калибра).',
    weapons: [
      { id: 'gun', name: '120-мм гладкоствольная пушка Rh 120 L/55', kind: 'gun', where: 'В башне по оси. На A6 ствол длиннее, чем на ранних вариантах.', state: 'visible', pins: [{ x: 69, y: 65 }] },
      { id: 'smoke', name: 'Дымовые гранатомёты', kind: 'launcher', where: 'Блоками на бортах башни.', state: 'approx', pins: [{ x: 56.5, y: 62 }] },
      { id: 'mg3', name: '7,62-мм пулемёты MG3 (спаренный и зенитный)', kind: 'machine-gun', where: 'Рядом с пушкой и на люке заряжающего.', state: 'hidden' },
    ],
  },
  'pzh-2000': {
    photoKey: 'post/ground/artillery',
    alt: 'Самоходные гаубицы PzH 2000 на позиции',
    caption: 'PzH 2000 вооружённых сил Хорватии на полигоне.',
    weapons: [
      { id: 'gun', name: '155-мм гаубица с длиной ствола 52 калибра', kind: 'gun', where: 'В башне, ствол с дульным тормозом направлен влево.', state: 'visible', pins: [{ x: 14, y: 44.6 }] },
      { id: 'mg', name: '7,62-мм пулемёт на крыше башни', kind: 'machine-gun', where: 'На крыше башни для самообороны. Положение приблизительное.', state: 'approx', pins: [{ x: 37, y: 41.5 }] },
      { id: 'ammo', name: 'Боекомплект 60 выстрелов', kind: 'other', where: 'В башне и корпусе, подаётся автоматическим заряжанием.', state: 'hidden' },
    ],
  },
};
