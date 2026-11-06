import { BAR_HALF_WIDTH, CAMERA_BACK, GameEngine, SPAWN_DISTANCE } from './game-engine';

const CAMERA_HEIGHT = 2.4;
const HORIZON = 0.4;
const SEGMENT_HEIGHT = 0.36;
const GRID_SPACING = 4;
const GRID_LENGTH = 8;

interface Palette {
  name: string;
  font: string;
  skyTop: string;
  skyBottom: string;
  sun: string;
  ground: string;
  grid: string;
  bar: string;
  barPeak: string;
}

export const PALETTES: Palette[] = [
  {
    name: 'Rap / Hip-Hop',
    font: "'Permanent Marker', cursive",
    skyTop: '#120826',
    skyBottom: '#5b1a8c',
    sun: '#ffc531',
    ground: '#0d0618',
    grid: '#b14dff',
    bar: '#ffc531',
    barPeak: '#ffffff',
  },
  {
    name: 'Pop',
    font: "'Pacifico', cursive",
    skyTop: '#25106b',
    skyBottom: '#ff5fa8',
    sun: '#fff0a8',
    ground: '#1a0b3f',
    grid: '#3ee8ff',
    bar: '#3ee8ff',
    barPeak: '#ff5fa8',
  },
  {
    name: 'Rock',
    font: "'Metal Mania', fantasy",
    skyTop: '#0a0a0c',
    skyBottom: '#7a1010',
    sun: '#ff4a26',
    ground: '#0b0707',
    grid: '#ff3b2f',
    bar: '#e8e8e8',
    barPeak: '#ff3b2f',
  },
  {
    name: 'Country',
    font: "'Rye', serif",
    skyTop: '#123a55',
    skyBottom: '#f08a3c',
    sun: '#ffe08a',
    ground: '#2a160c',
    grid: '#ffb25e',
    bar: '#35d0a5',
    barPeak: '#ffe08a',
  },
];

const STARS = Array.from({ length: 70 }, (_, index) => ({
  x: (index * 0.6180339) % 1,
  y: (index * 0.3247179) % 1,
  size: index % 5 === 0 ? 2 : 1,
}));

export function paletteForLevel(level: number): Palette {
  return PALETTES[level % PALETTES.length];
}

/** Draws one frame. `crashFlash` fades from 1 to 0 after a crash; `seconds` drives the animation. */
export function drawGame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  engine: GameEngine,
  seconds: number,
  crashFlash: number,
  reducedMotion: boolean,
): void {
  const palette = paletteForLevel(engine.level);
  const horizon = height * HORIZON;
  const focal = height * 0.95;
  const project = (x: number, z: number, y = 0) => {
    const scale = focal / (z + CAMERA_BACK);
    return {
      x: width / 2 + (x - engine.x) * scale,
      y: horizon + (CAMERA_HEIGHT - y) * scale,
      scale,
    };
  };

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.skyTop;
  ctx.fillRect(0, 0, width, height);

  if (!reducedMotion) {
    ctx.translate(width / 2, height / 2);
    ctx.rotate(engine.velocityX * -0.0045);
    ctx.scale(1.12, 1.12);
    ctx.translate(-width / 2, -height / 2);
    if (crashFlash > 0) {
      ctx.translate(Math.sin(seconds * 70) * 9 * crashFlash, Math.cos(seconds * 90) * 6 * crashFlash);
    }
  }

  drawSky(ctx, width, height, horizon, palette, engine.x);
  drawGround(ctx, width, height, horizon, palette, engine, project);

  const barsAhead = engine.rows.filter((row) => row.z >= 0).reverse();
  const barsBehind = engine.rows.filter((row) => row.z < 0).reverse();

  for (const row of barsAhead) {
    drawRow(ctx, width, row, palette, seconds, project, reducedMotion);
  }
  drawRecord(ctx, engine, palette, seconds, project, reducedMotion);
  for (const row of barsBehind) {
    drawRow(ctx, width, row, palette, seconds, project, reducedMotion);
  }

  ctx.restore();

  if (crashFlash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${crashFlash * 0.7})`;
    ctx.fillRect(0, 0, width, height);
  }

  drawHud(ctx, width, height, engine, palette);
}

function drawSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizon: number,
  palette: Palette,
  playerX: number,
): void {
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, palette.skyTop);
  sky.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(-width, -height, width * 3, horizon + height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (const star of STARS) {
    ctx.fillRect(star.x * width, star.y * horizon * 0.8, star.size, star.size);
  }

  const sunX = width / 2 - playerX * 0.4;
  const sunRadius = horizon * 0.62;
  ctx.save();
  ctx.beginPath();
  ctx.rect(-width, -height, width * 3, horizon + height);
  ctx.clip();
  ctx.fillStyle = palette.sun;
  ctx.beginPath();
  ctx.arc(sunX, horizon, sunRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.clip();
  ctx.fillStyle = palette.skyBottom;
  for (let band = 0; band < 5; band += 1) {
    const y = horizon - sunRadius * 0.08 - band * sunRadius * 0.16;
    ctx.fillRect(sunX - sunRadius, y, sunRadius * 2, 2 + (4 - band));
  }
  ctx.restore();
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizon: number,
  palette: Palette,
  engine: GameEngine,
  project: (x: number, z: number) => { x: number; y: number },
): void {
  ctx.fillStyle = palette.ground;
  ctx.fillRect(-width, horizon, width * 3, height * 2);

  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.45;
  ctx.beginPath();

  const firstColumn = Math.floor(engine.x / GRID_SPACING) * GRID_SPACING;
  for (let column = -30; column <= 30; column += 1) {
    const x = firstColumn + column * GRID_SPACING;
    const near = project(x, 0.6 - CAMERA_BACK);
    const far = project(x, SPAWN_DISTANCE * 3);
    ctx.moveTo(near.x, near.y);
    ctx.lineTo(far.x, far.y);
  }

  const offset = engine.distance % GRID_LENGTH;
  for (let z = -offset; z < SPAWN_DISTANCE * 2; z += GRID_LENGTH) {
    const y = project(0, Math.max(z, 0.6 - CAMERA_BACK)).y;
    ctx.moveTo(-width, y);
    ctx.lineTo(width * 2, y);
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawRow(
  ctx: CanvasRenderingContext2D,
  width: number,
  row: GameEngine['rows'][number],
  palette: Palette,
  seconds: number,
  project: (x: number, z: number, y?: number) => { x: number; y: number; scale: number },
  reducedMotion: boolean,
): void {
  ctx.globalAlpha = Math.min(1, (SPAWN_DISTANCE - row.z) / 30);

  for (const bar of row.bars) {
    const base = project(bar.x, row.z);
    const barWidth = BAR_HALF_WIDTH * 2 * base.scale;
    const left = base.x - barWidth / 2;
    if (left > width * 1.3 || left + barWidth < -width * 0.3) {
      continue;
    }

    const pulse = reducedMotion ? 1 : 0.8 + 0.2 * Math.sin(seconds * 7 + bar.phase);
    const segments = Math.max(2, Math.round((bar.height * pulse) / SEGMENT_HEIGHT));
    const segmentHeight = SEGMENT_HEIGHT * base.scale;

    for (let segment = 0; segment < segments; segment += 1) {
      ctx.fillStyle = segment === segments - 1 ? palette.barPeak : palette.bar;
      ctx.fillRect(
        left,
        base.y - (segment + 1) * segmentHeight,
        barWidth,
        segmentHeight * 0.78,
      );
    }
  }

  ctx.globalAlpha = 1;
}

function drawRecord(
  ctx: CanvasRenderingContext2D,
  engine: GameEngine,
  palette: Palette,
  seconds: number,
  project: (x: number, z: number, y?: number) => { x: number; y: number; scale: number },
  reducedMotion: boolean,
): void {
  const bob = reducedMotion ? 0 : Math.sin(seconds * 5) * 0.04;
  const ground = project(engine.x, 0);
  const record = project(engine.x, 0, 0.42 + bob);
  const radius = 0.62 * record.scale;
  const tilt = reducedMotion ? 0 : engine.velocityX * 0.012;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y, radius, radius * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(record.x, record.y);
  ctx.rotate(tilt);
  ctx.scale(1, 0.38);

  ctx.fillStyle = '#111';
  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1;
  for (const groove of [0.85, 0.72, 0.59]) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * groove, 0, Math.PI * 2);
    ctx.stroke();
  }

  const spin = reducedMotion ? 0 : seconds * 9;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.78, spin, spin + 0.7);
  ctx.stroke();

  ctx.fillStyle = palette.sun;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  engine: GameEngine,
  palette: Palette,
): void {
  const size = Math.max(16, Math.round(height * 0.05));
  ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 4;

  ctx.font = `bold ${size}px system-ui, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(engine.score.toLocaleString('en-US'), 14, 12);

  ctx.font = `${size}px ${palette.font}`;
  ctx.textAlign = 'right';
  ctx.fillText(palette.name, width - 14, 12);

  ctx.shadowBlur = 0;
}
