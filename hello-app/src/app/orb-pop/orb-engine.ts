export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 450;
export const FLOOR_Y = 410;
export const CEILING_Y = 34;
export const PLAYER_WIDTH = 34;
export const PLAYER_HEIGHT = 46;
export const ORB_RADIUS = [10, 18, 28, 42];

const TICK_SECONDS = 1 / 120;
const GRAVITY = 600;
const BOUNCE_HEIGHT = [110, 170, 240, 310];
const ORB_SPEED_X = 110;
const SPLIT_KICK = 260;
const PLAYER_SPEED = 300;
const BEAM_SPEED = 640;
const HITBOX_WIDTH = 24;
const HITBOX_HEIGHT = 38;
const START_LIVES = 3;
const SAFE_SECONDS = 1.5;
const POP_SCORE = [80, 40, 20, 10];
const TIME_BONUS_PER_SECOND = 10;

const LEVELS = [
  [1],
  [2],
  [1, 1],
  [2, 1],
  [3],
  [3, 1],
  [3, 2],
  [2, 2, 2],
  [3, 3],
];

export type OrbStatus = 'playing' | 'cleared' | 'hit' | 'timeUp' | 'over';

export interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export interface OrbInput {
  /** -1 for left, 1 for right, 0 to stand still. */
  move: number;
  fire: boolean;
}

export class OrbEngine {
  status: OrbStatus = 'playing';
  level = 1;
  lives = START_LIVES;
  score = 0;
  playerX = WORLD_WIDTH / 2;
  beam: { x: number; tipY: number } | null = null;
  orbs: Orb[] = [];
  timeLeft = 0;
  timeLimit = 0;
  safeTime = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.level = 1;
    this.lives = START_LIVES;
    this.score = 0;
    this.loadLevel();
  }

  /** Moves on after a level is cleared or a life is lost. */
  next(): void {
    if (this.status === 'cleared') {
      this.level += 1;
    }
    this.loadLevel();
  }

  update(seconds: number, input: OrbInput): void {
    let remaining = seconds;
    while (remaining > 0 && this.status === 'playing') {
      const step = Math.min(TICK_SECONDS, remaining);
      this.tick(step, input);
      remaining -= step;
    }
  }

  private loadLevel(): void {
    const sizes = sizesForLevel(this.level);
    this.status = 'playing';
    this.playerX = WORLD_WIDTH / 2;
    this.beam = null;
    this.safeTime = SAFE_SECONDS;
    this.orbs = sizes.map((size, index) => {
      // Start towards the walls, so nothing drops straight onto the player.
      const fromWall = 130 + Math.floor(index / 2) * 110;
      const onLeft = index % 2 === 0;
      return {
        x: onLeft ? fromWall : WORLD_WIDTH - fromWall,
        y: 130,
        vx: onLeft ? ORB_SPEED_X : -ORB_SPEED_X,
        vy: 0,
        size,
      };
    });
    const pops = sizes.reduce((total, size) => total + 2 ** (size + 1) - 1, 0);
    this.timeLimit = 25 + pops * 3.5;
    this.timeLeft = this.timeLimit;
  }

  private tick(seconds: number, input: OrbInput): void {
    this.timeLeft -= seconds;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.loseLife('timeUp');
      return;
    }

    this.safeTime = Math.max(0, this.safeTime - seconds);
    this.movePlayer(seconds, input);
    this.moveBeam(seconds);
    this.orbs.forEach((orb) => moveOrb(orb, seconds));
    this.popHitOrb();

    if (this.orbs.length === 0) {
      this.score += Math.floor(this.timeLeft) * TIME_BONUS_PER_SECOND;
      this.status = 'cleared';
    } else if (this.safeTime === 0 && this.orbs.some((orb) => this.touchesPlayer(orb))) {
      this.loseLife('hit');
    }
  }

  private movePlayer(seconds: number, input: OrbInput): void {
    const half = PLAYER_WIDTH / 2;
    const moved = this.playerX + input.move * PLAYER_SPEED * seconds;
    this.playerX = Math.max(half, Math.min(WORLD_WIDTH - half, moved));
    if (input.fire && !this.beam) {
      this.beam = { x: this.playerX, tipY: FLOOR_Y - PLAYER_HEIGHT };
    }
  }

  private moveBeam(seconds: number): void {
    if (this.beam) {
      this.beam.tipY -= BEAM_SPEED * seconds;
      if (this.beam.tipY <= CEILING_Y) {
        this.beam = null;
      }
    }
  }

  private popHitOrb(): void {
    const beam = this.beam;
    if (!beam) {
      return;
    }
    const index = this.orbs.findIndex(
      (orb) =>
        Math.abs(orb.x - beam.x) <= ORB_RADIUS[orb.size] &&
        orb.y + ORB_RADIUS[orb.size] >= beam.tipY,
    );
    if (index === -1) {
      return;
    }

    const [orb] = this.orbs.splice(index, 1);
    this.beam = null;
    this.score += POP_SCORE[orb.size];
    if (orb.size > 0) {
      for (const direction of [-1, 1]) {
        this.orbs.push({
          x: orb.x,
          y: orb.y,
          vx: direction * ORB_SPEED_X,
          vy: -SPLIT_KICK,
          size: orb.size - 1,
        });
      }
    }
  }

  private touchesPlayer(orb: Orb): boolean {
    const left = this.playerX - HITBOX_WIDTH / 2;
    const top = FLOOR_Y - HITBOX_HEIGHT;
    const nearestX = Math.max(left, Math.min(left + HITBOX_WIDTH, orb.x));
    const nearestY = Math.max(top, Math.min(FLOOR_Y, orb.y));
    return Math.hypot(orb.x - nearestX, orb.y - nearestY) < ORB_RADIUS[orb.size];
  }

  private loseLife(reason: 'hit' | 'timeUp'): void {
    this.lives -= 1;
    this.status = this.lives > 0 ? reason : 'over';
  }
}

function moveOrb(orb: Orb, seconds: number): void {
  const radius = ORB_RADIUS[orb.size];
  orb.vy += GRAVITY * seconds;
  orb.x += orb.vx * seconds;
  orb.y += orb.vy * seconds;

  if (orb.x < radius) {
    orb.x = radius;
    orb.vx = Math.abs(orb.vx);
  } else if (orb.x > WORLD_WIDTH - radius) {
    orb.x = WORLD_WIDTH - radius;
    orb.vx = -Math.abs(orb.vx);
  }

  if (orb.y > FLOOR_Y - radius) {
    orb.y = FLOOR_Y - radius;
    // A fixed bounce speed keeps each size at the same height for the whole level.
    orb.vy = -Math.sqrt(2 * GRAVITY * BOUNCE_HEIGHT[orb.size]);
  } else if (orb.y < CEILING_Y + radius) {
    orb.y = CEILING_Y + radius;
    orb.vy = Math.abs(orb.vy);
  }
}

function sizesForLevel(level: number): number[] {
  if (level <= LEVELS.length) {
    return LEVELS[level - 1];
  }
  const count = Math.min(4, 3 + Math.floor((level - LEVELS.length - 1) / 3));
  return Array.from({ length: count }, () => 3);
}
