import {
  CEILING_Y,
  FLOOR_Y,
  ORB_RADIUS,
  OrbEngine,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './orb-engine';

const ORB_COLOURS = ['#7dffb2', '#3fd8ff', '#b78bff', '#ff6fb5'];
const ARENA_THEMES = [
  { top: '#0b1b33', bottom: '#123a4a', grid: '#2bd0c4' },
  { top: '#1a0f33', bottom: '#3a1854', grid: '#c47bff' },
  { top: '#0d2420', bottom: '#14493a', grid: '#62f0a8' },
  { top: '#2a1020', bottom: '#561a3a', grid: '#ff7fb0' },
];

/** Draws one frame, scaled from the fixed game world to the canvas size. */
export function drawOrbPop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  engine: OrbEngine,
  seconds: number,
): void {
  const theme = ARENA_THEMES[(engine.level - 1) % ARENA_THEMES.length];

  ctx.save();
  ctx.scale(width / WORLD_WIDTH, height / WORLD_HEIGHT);
  drawArena(ctx, theme);

  if (engine.beam) {
    drawBeam(ctx, engine.beam.x, engine.beam.tipY);
  }
  for (const orb of engine.orbs) {
    drawOrb(ctx, orb.x, orb.y, ORB_RADIUS[orb.size], ORB_COLOURS[orb.size]);
  }
  drawRobot(ctx, engine, seconds);
  drawHud(ctx, engine);
  ctx.restore();
}

function drawArena(
  ctx: CanvasRenderingContext2D,
  theme: { top: string; bottom: string; grid: string },
): void {
  const sky = ctx.createLinearGradient(0, 0, 0, FLOOR_Y);
  sky.addColorStop(0, theme.top);
  sky.addColorStop(1, theme.bottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  ctx.strokeStyle = theme.grid;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= WORLD_WIDTH; x += 40) {
    ctx.moveTo(x, CEILING_Y);
    ctx.lineTo(x, FLOOR_Y);
  }
  for (let y = CEILING_Y; y <= FLOOR_Y; y += 40) {
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD_WIDTH, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#0a0d16';
  ctx.fillRect(0, 0, WORLD_WIDTH, CEILING_Y);
  ctx.fillRect(0, FLOOR_Y, WORLD_WIDTH, WORLD_HEIGHT - FLOOR_Y);
  ctx.fillStyle = theme.grid;
  ctx.fillRect(0, CEILING_Y - 2, WORLD_WIDTH, 2);
  ctx.fillRect(0, FLOOR_Y, WORLD_WIDTH, 3);
}

function drawBeam(ctx: CanvasRenderingContext2D, x: number, tipY: number): void {
  const top = FLOOR_Y - PLAYER_HEIGHT;
  ctx.fillStyle = 'rgba(255, 233, 120, 0.3)';
  ctx.fillRect(x - 5, tipY, 10, top - tipY);
  ctx.fillStyle = '#fff6c2';
  ctx.fillRect(x - 1.5, tipY, 3, top - tipY);
  ctx.beginPath();
  ctx.arc(x, tipY, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colour: string,
): void {
  const glow = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius * 1.45);
  glow.addColorStop(0, colour);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const body = ctx.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.4,
    radius * 0.1,
    x,
    y,
    radius,
  );
  body.addColorStop(0, '#ffffff');
  body.addColorStop(0.3, colour);
  body.addColorStop(1, '#141830');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, radius * 0.62, radius * 0.22, -0.4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawRobot(ctx: CanvasRenderingContext2D, engine: OrbEngine, seconds: number): void {
  // Blink while the player is protected after a level starts.
  if (engine.safeTime > 0 && Math.floor(seconds * 10) % 2 === 0) {
    return;
  }

  const x = engine.playerX;
  const left = x - PLAYER_WIDTH / 2;
  const top = FLOOR_Y - PLAYER_HEIGHT;

  ctx.fillStyle = '#29324f';
  ctx.fillRect(left + 4, FLOOR_Y - 8, 10, 8);
  ctx.fillRect(left + PLAYER_WIDTH - 14, FLOOR_Y - 8, 10, 8);

  ctx.fillStyle = '#e9edf7';
  ctx.beginPath();
  ctx.roundRect(left, top + 12, PLAYER_WIDTH, PLAYER_HEIGHT - 20, 7);
  ctx.fill();

  ctx.fillStyle = '#12182c';
  ctx.beginPath();
  ctx.roundRect(left + 6, top + 18, PLAYER_WIDTH - 12, 12, 5);
  ctx.fill();
  ctx.fillStyle = '#62f0a8';
  ctx.fillRect(x - 8, top + 22, 4, 4);
  ctx.fillRect(x + 4, top + 22, 4, 4);

  ctx.fillStyle = '#ffd257';
  ctx.fillRect(x - 3, top, 6, 13);
}

function drawHud(ctx: CanvasRenderingContext2D, engine: OrbEngine): void {
  ctx.fillStyle = '#ffffff';
  ctx.font = "700 15px 'Orbitron', sans-serif";
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE ${engine.score.toLocaleString('en-US')}`, 12, 17);

  ctx.textAlign = 'center';
  ctx.fillText(`LEVEL ${engine.level}`, WORLD_WIDTH / 2, 17);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#ff6fb5';
  ctx.fillText('♥'.repeat(Math.max(0, engine.lives)), WORLD_WIDTH - 12, 17);

  const share = engine.timeLimit > 0 ? engine.timeLeft / engine.timeLimit : 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, FLOOR_Y + 14, WORLD_WIDTH, 12);
  ctx.fillStyle = share > 0.25 ? '#62f0a8' : '#ff6f61';
  ctx.fillRect(0, FLOOR_Y + 14, WORLD_WIDTH * share, 12);
}
