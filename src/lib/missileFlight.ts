/**
 * Упрощённая учебная модель полёта ракеты в вертикальной плоскости:
 * материальная точка, тяга на активном участке, сопротивление воздуха,
 * сила тяжести и полёт в заданную точку встречи. Цель неподвижна и не маневрирует,
 * система наведения, перегрузки и помехи не моделируются.
 * Модель показывает характер профиля высоты и скорости, а не боевые возможности.
 */
export interface FlightProfile {
  /** Стартовая масса, кг. */
  mass: number;
  /** Диаметр корпуса, мм. */
  diameter: number;
  /** Доля топлива в стартовой массе (подбирается калибровкой). */
  propFrac: number;
  /** Время работы двигателя, с (типовое для класса). */
  burn: number;
  /** Коэффициент сопротивления (подбирается калибровкой). */
  cd: number;
  /** Угол горки на начальном участке, градусы. */
  loft: number;
}

export interface FlightScenario {
  /** Высота пуска, м. */
  launchAlt: number;
  /** Скорость носителя, м/с. */
  launchSpeed: number;
  /** Высота точки встречи, м. */
  targetAlt: number;
  /** Дистанция до точки встречи по горизонтали, м. */
  distance: number;
}

export interface FlightPoint {
  t: number;
  x: number;
  y: number;
  v: number;
  mach: number;
}

export interface FlightResult {
  points: FlightPoint[];
  /** Долетела ли ракета до точки встречи с запасом скорости. */
  reached: boolean;
  time: number;
  endSpeed: number;
  endMach: number;
  peakSpeed: number;
  peakMach: number;
  maxAlt: number;
  /** Пройденная дистанция по горизонтали, м. */
  reach: number;
}

const G = 9.80665;
const RHO0 = 1.225;
const SCALE_HEIGHT = 8500;
const ISP = 245;
const DT = 0.05;
const MAX_TIME = 400;
const MIN_MACH = 1;
const TURN_RATE = (12 * Math.PI) / 180;
const SAMPLE_EVERY = 4;

export function soundSpeed(alt: number): number {
  return alt < 11000 ? 340.3 - 0.0041 * alt : 295.1;
}

function machFactor(mach: number): number {
  if (mach < 0.8) return 0.6;
  if (mach < 1.1) return 0.6 + ((mach - 0.8) / 0.3) * 0.65;
  return 1.25 * Math.pow(1.1 / mach, 0.5);
}

export function fly(profile: FlightProfile, scenario: FlightScenario): FlightResult {
  const area = (Math.PI * Math.pow(profile.diameter / 1000, 2)) / 4;
  const propMass = profile.mass * profile.propFrac;
  const thrust = (propMass * ISP * G) / profile.burn;
  const loft = (profile.loft * Math.PI) / 180;
  const aim = (x: number, y: number) =>
    Math.atan2(scenario.targetAlt - y, Math.max(1, scenario.distance - x)) + loft * Math.max(0, 1 - (2 * x) / scenario.distance);

  let t = 0;
  let x = 0;
  let y = scenario.launchAlt;
  let v = Math.max(20, scenario.launchSpeed);
  let gamma = aim(0, y);
  let mass = profile.mass;
  let peakSpeed = v;
  let peakMach = v / soundSpeed(y);
  let maxAlt = y;
  let reached = false;
  const points: FlightPoint[] = [{ t, x, y, v, mach: peakMach }];

  for (let step = 1; t < MAX_TIME; step += 1) {
    const burning = t < profile.burn;
    const rho = RHO0 * Math.exp(-y / SCALE_HEIGHT);
    const mach = v / soundSpeed(y);
    const drag = 0.5 * rho * v * v * profile.cd * machFactor(mach) * area;
    v += (((burning ? thrust : 0) - drag) / mass - G * Math.sin(gamma)) * DT;
    if (burning) mass -= (propMass / profile.burn) * DT;
    const wanted = aim(x, y);
    gamma += Math.max(-TURN_RATE * DT, Math.min(TURN_RATE * DT, wanted - gamma));
    x += v * Math.cos(gamma) * DT;
    y += v * Math.sin(gamma) * DT;
    t += DT;
    const machNow = v / soundSpeed(Math.max(0, y));
    if (v > peakSpeed) peakSpeed = v;
    if (machNow > peakMach) peakMach = machNow;
    if (y > maxAlt) maxAlt = y;
    reached = x >= scenario.distance;
    const spent = !burning && machNow < MIN_MACH;
    const done = reached || spent || y < 0 || v <= 0;
    if (done || step % SAMPLE_EVERY === 0) points.push({ t, x, y: Math.max(0, y), v, mach: machNow });
    if (done) break;
  }

  const last = points[points.length - 1];
  return { points, reached, time: last.t, endSpeed: last.v, endMach: last.mach, peakSpeed, peakMach, maxAlt, reach: last.x };
}

/** Наибольшая дистанция, на которую ракета долетает в заданных условиях (поиск делением пополам), м. */
export function maxReach(profile: FlightProfile, scenario: Omit<FlightScenario, 'distance'>, limit = 600000): number {
  let low = 500;
  let high = limit;
  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) / 2;
    if (fly(profile, { ...scenario, distance: mid }).reached) low = mid; else high = mid;
  }
  return low;
}

/**
 * Калибровка: доля топлива подбирается под опубликованную наибольшую скорость,
 * коэффициент сопротивления под опубликованную наибольшую дальность в благоприятных условиях.
 */
export function calibrate(
  base: Omit<FlightProfile, 'propFrac' | 'cd'>,
  reference: Omit<FlightScenario, 'distance'>,
  rangeM: number,
  speedMs: number | undefined,
): FlightProfile {
  let profile: FlightProfile = { ...base, propFrac: 0.4, cd: 0.4 };
  for (let pass = 0; pass < 3; pass += 1) {
    if (speedMs !== undefined) {
      let low = 0.1;
      let high = 0.75;
      for (let i = 0; i < 14; i += 1) {
        const mid = (low + high) / 2;
        const peak = fly({ ...profile, propFrac: mid }, { ...reference, distance: rangeM }).peakSpeed;
        if (peak < speedMs) low = mid; else high = mid;
      }
      profile = { ...profile, propFrac: (low + high) / 2 };
    }
    let low = 0.02;
    let high = 4;
    for (let i = 0; i < 14; i += 1) {
      const mid = (low + high) / 2;
      if (maxReach({ ...profile, cd: mid }, reference, rangeM * 3) > rangeM) low = mid; else high = mid;
    }
    profile = { ...profile, cd: (low + high) / 2 };
  }
  return profile;
}
