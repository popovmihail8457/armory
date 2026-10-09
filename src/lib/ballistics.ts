/**
 * Упрощённая учебная модель внешней баллистики: материальная точка,
 * сила тяжести и сопротивление воздуха, стандартная атмосфера, без ветра,
 * вращения Земли и деривации. Результат показывает характер траектории,
 * а не заменяет таблицы стрельбы.
 */
export type ShellTypeId = 'apfsds' | 'apds' | 'ap' | 'heat' | 'hesh' | 'he';

export interface BallisticInput {
  type: ShellTypeId;
  /** Калибр ствола, мм. */
  caliber: number;
  /** Начальная скорость, м/с. */
  v0: number;
  /** Масса снаряда в полёте, кг. */
  mass: number;
}

export interface TrajectoryPoint {
  t: number;
  x: number;
  y: number;
  v: number;
  /** Пройденный путь по дуге, м. */
  s: number;
}

export interface Trajectory {
  points: TrajectoryPoint[];
  range: number;
  time: number;
  impactSpeed: number;
  pathLength: number;
  /** Угол падения к горизонту, градусы (отрицательный). */
  impactAngle: number;
  apex: TrajectoryPoint;
}

/** Типовые параметры формы: доля калибра у летящего тела и базовый коэффициент сопротивления. */
const SHAPE: Record<ShellTypeId, { dRatio: number; cd: number }> = {
  apfsds: { dRatio: 0.22, cd: 0.72 },
  apds: { dRatio: 0.5, cd: 0.3 },
  ap: { dRatio: 1, cd: 0.33 },
  heat: { dRatio: 1, cd: 0.4 },
  hesh: { dRatio: 1, cd: 0.36 },
  he: { dRatio: 1, cd: 0.295 },
};

const G = 9.80665;
const RHO0 = 1.225;
const SCALE_HEIGHT = 8500;
const SOUND = 340;
const DT = 0.01;
const MAX_TIME = 200;

/** Зависимость сопротивления от числа Маха: рост у скорости звука и плавное снижение на сверхзвуке. */
function machFactor(mach: number): number {
  if (mach < 0.8) return 0.55;
  if (mach < 1.1) return 0.55 + ((mach - 0.8) / 0.3) * 0.7;
  return 1.25 * Math.pow(1.1 / mach, 0.45);
}

function dragConstant(input: BallisticInput): number {
  const shape = SHAPE[input.type];
  const diameter = (input.caliber * shape.dRatio) / 1000;
  const area = (Math.PI * diameter * diameter) / 4;
  return (shape.cd * area) / (2 * input.mass);
}

function interpolateGround(prev: TrajectoryPoint, next: TrajectoryPoint): TrajectoryPoint {
  const k = prev.y / (prev.y - next.y);
  return {
    t: prev.t + (next.t - prev.t) * k,
    x: prev.x + (next.x - prev.x) * k,
    y: 0,
    v: prev.v + (next.v - prev.v) * k,
    s: prev.s + (next.s - prev.s) * k,
  };
}

export function simulate(input: BallisticInput, angleDeg: number): Trajectory {
  const k = dragConstant(input);
  const angle = (angleDeg * Math.PI) / 180;
  let vx = input.v0 * Math.cos(angle);
  let vy = input.v0 * Math.sin(angle);
  let point: TrajectoryPoint = { t: 0, x: 0, y: 0, v: input.v0, s: 0 };
  let apex = point;
  let impactAngle = 0;
  const points: TrajectoryPoint[] = [point];

  while (point.t < MAX_TIME) {
    const v = Math.hypot(vx, vy);
    const rho = RHO0 * Math.exp(-point.y / SCALE_HEIGHT);
    const decel = k * rho * machFactor(v / SOUND) * v;
    vx -= decel * vx * DT;
    vy -= (G + decel * vy) * DT;
    const speed = Math.hypot(vx, vy);
    const next: TrajectoryPoint = {
      t: point.t + DT,
      x: point.x + vx * DT,
      y: point.y + vy * DT,
      v: speed,
      s: point.s + speed * DT,
    };
    if (next.y < 0) {
      points.push(interpolateGround(point, next));
      impactAngle = (Math.atan2(vy, vx) * 180) / Math.PI;
      break;
    }
    if (next.y > apex.y) apex = next;
    points.push(next);
    point = next;
  }

  const last = points[points.length - 1];
  return { points, range: last.x, time: last.t, impactSpeed: last.v, pathLength: last.s, impactAngle, apex };
}

/** Скорость на заданной дистанции при настильной стрельбе (угол подбирать не нужно: берётся малый угол). */
export function speedAt(input: BallisticInput, distance: number): number | undefined {
  const k = dragConstant(input);
  let v = input.v0;
  let x = 0;
  while (x < distance) {
    v -= k * RHO0 * machFactor(v / SOUND) * v * v * DT;
    x += v * DT;
    if (v < 50) return undefined;
  }
  return v;
}

/** Время полёта до заданной дистанции при настильной стрельбе. */
export function timeTo(input: BallisticInput, distance: number): number | undefined {
  const k = dragConstant(input);
  let v = input.v0;
  let x = 0;
  let t = 0;
  while (x < distance) {
    v -= k * RHO0 * machFactor(v / SOUND) * v * v * DT;
    x += v * DT;
    t += DT;
    if (v < 50) return undefined;
  }
  return t;
}
