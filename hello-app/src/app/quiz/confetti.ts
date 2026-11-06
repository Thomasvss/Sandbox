const COLOURS = ['#f4c95d', '#e8689a', '#6fc8e8', '#8ee08a', '#b78bff', '#ffffff'];
const PIECES_PER_BURST = 130;
const GRAVITY = 900;
const DRAG = 0.985;

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  colour: string;
  angle: number;
  spin: number;
}

/** Draws bursts of confetti on a canvas, and only runs while pieces are on screen. */
export class Confetti {
  private readonly context: CanvasRenderingContext2D | null;
  private pieces: Piece[] = [];
  private frameRequest = 0;
  private lastFrame = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d');
  }

  burst(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    for (let index = 0; index < PIECES_PER_BURST; index += 1) {
      // Fire from both bottom corners, up towards the middle of the screen.
      const fromLeft = index % 2 === 0;
      const angle = (fromLeft ? -1 : -2.14) + (Math.random() - 0.5) * 0.7;
      const speed = 500 + Math.random() * 800;
      this.pieces.push({
        x: fromLeft ? 0 : this.canvas.width,
        y: this.canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 6 + Math.random() * 7,
        colour: COLOURS[index % COLOURS.length],
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 14,
      });
    }

    if (this.frameRequest === 0) {
      this.lastFrame = performance.now();
      this.frameRequest = requestAnimationFrame((now) => this.frame(now));
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.frameRequest);
    this.frameRequest = 0;
    this.pieces = [];
  }

  private frame(now: number): void {
    const context = this.context;
    if (!context) {
      return;
    }

    const seconds = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const piece of this.pieces) {
      piece.vx *= DRAG;
      piece.vy = piece.vy * DRAG + GRAVITY * seconds;
      piece.x += piece.vx * seconds;
      piece.y += piece.vy * seconds;
      piece.angle += piece.spin * seconds;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      context.fillStyle = piece.colour;
      context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.66);
      context.restore();
    }

    this.pieces = this.pieces.filter((piece) => piece.y < this.canvas.height + 30);
    this.frameRequest =
      this.pieces.length > 0 ? requestAnimationFrame((time) => this.frame(time)) : 0;
  }
}
