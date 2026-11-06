export const SPAWN_DISTANCE = 110;
export const CAMERA_BACK = 4;
export const BAR_HALF_WIDTH = 0.55;

const START_SPEED = 24;
const MAX_SPEED = 62;
const ACCELERATION = 0.6;
const ROW_SPACING = 7;
const FIRST_ROW_DISTANCE = 35;
const FIELD_HALF_WIDTH = 30;
const SLOT_WIDTH = 2.2;
const SLOT_JITTER = 0.5;
const MIN_DENSITY = 0.12;
const MAX_DENSITY = 0.3;
const PLAYER_HALF_WIDTH = 0.4;
const SAFE_LANE_CLEARANCE = 1.6;
const SAFE_LANE_WANDER = 12;
const ROWS_PER_LANE_TARGET = 6;
const LANE_ROWS_KEPT_CLEAR = 3;
const LEVEL_LENGTH = 900;

export interface Bar {
  x: number;
  height: number;
  phase: number;
}

export interface Row {
  z: number;
  safeX: number;
  bars: Bar[];
}

export class GameEngine {
  x = 0;
  velocityX = 0;
  speed = START_SPEED;
  distance = 0;
  crashed = false;
  rows: Row[] = [];

  private readonly random: () => number;
  private safeX = 0;
  private recentSafeX: number[] = [];
  private safeTarget = 0;
  private rowsUntilNewTarget = 0;

  constructor(random: () => number = Math.random) {
    this.random = random;
    this.reset();
  }

  get score(): number {
    return Math.floor(this.distance);
  }

  get level(): number {
    return Math.floor(this.distance / LEVEL_LENGTH);
  }

  get lateralSpeed(): number {
    return 14 + this.speed * 0.3;
  }

  reset(): void {
    this.x = 0;
    this.velocityX = 0;
    this.speed = START_SPEED;
    this.distance = 0;
    this.crashed = false;
    this.rows = [];
    this.safeX = 0;
    this.recentSafeX = [];
    this.safeTarget = 0;
    this.rowsUntilNewTarget = 0;
    for (let z = FIRST_ROW_DISTANCE; z <= SPAWN_DISTANCE; z += ROW_SPACING) {
      this.spawnRow(z);
    }
  }

  /** Advances the game. `steer` is -1 for left, 1 for right and 0 for straight on. */
  update(seconds: number, steer: number): void {
    if (this.crashed) {
      return;
    }

    this.speed = Math.min(MAX_SPEED, this.speed + ACCELERATION * seconds);
    const targetVelocity = steer * this.lateralSpeed;
    this.velocityX += (targetVelocity - this.velocityX) * Math.min(1, seconds * 12);
    this.x += this.velocityX * seconds;

    const step = this.speed * seconds;
    this.distance += step;

    for (const row of this.rows) {
      const wasAhead = row.z > 0;
      row.z -= step;
      if (wasAhead && row.z <= 0 && this.hitsBar(row)) {
        this.crashed = true;
      }
    }

    this.rows = this.rows.filter((row) => row.z > 1 - CAMERA_BACK);
    let lastZ = this.rows.at(-1)?.z ?? 0;
    while (lastZ <= SPAWN_DISTANCE - ROW_SPACING) {
      lastZ += ROW_SPACING;
      this.spawnRow(lastZ);
    }
  }

  private hitsBar(row: Row): boolean {
    return row.bars.some(
      (bar) => Math.abs(bar.x - this.x) < BAR_HALF_WIDTH + PLAYER_HALF_WIDTH,
    );
  }

  private spawnRow(z: number): void {
    // Centre rows on where the player will be, so running sideways can't escape the field.
    const centre = this.x + (this.velocityX * z) / this.speed;
    this.moveSafeLane(centre);

    const progress = (this.speed - START_SPEED) / (MAX_SPEED - START_SPEED);
    const density = MIN_DENSITY + (MAX_DENSITY - MIN_DENSITY) * progress;
    const bars: Bar[] = [];
    // Clearing the lane's recent positions too makes it a continuous corridor, not a row of gaps.
    const clearFrom = Math.min(...this.recentSafeX) - SAFE_LANE_CLEARANCE;
    const clearTo = Math.max(...this.recentSafeX) + SAFE_LANE_CLEARANCE;

    for (let offset = -FIELD_HALF_WIDTH; offset <= FIELD_HALF_WIDTH; offset += SLOT_WIDTH) {
      const x = centre + offset + (this.random() * 2 - 1) * SLOT_JITTER;
      if (this.random() < density && (x < clearFrom || x > clearTo)) {
        bars.push({
          x,
          height: 1 + this.random() * 1.4,
          phase: this.random() * Math.PI * 2,
        });
      }
    }

    this.rows.push({ z, safeX: this.safeX, bars });
  }

  /** Wanders a clear lane through the field, slowly enough that the player can always follow. */
  private moveSafeLane(centre: number): void {
    if (this.rowsUntilNewTarget <= 0) {
      this.safeTarget = centre + (this.random() * 2 - 1) * SAFE_LANE_WANDER;
      this.rowsUntilNewTarget = ROWS_PER_LANE_TARGET;
    }
    this.rowsUntilNewTarget -= 1;

    const maxStep = (this.lateralSpeed * ROW_SPACING * 0.35) / this.speed;
    const wanted = this.safeTarget - this.safeX;
    this.safeX += Math.max(-maxStep, Math.min(maxStep, wanted));
    this.recentSafeX = [...this.recentSafeX, this.safeX].slice(-LANE_ROWS_KEPT_CLEAR);
  }
}
