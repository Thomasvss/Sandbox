import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { OrbEngine } from './orb-engine';
import { drawOrbPop } from './orb-renderer';

const BEST_SCORE_KEY = 'orb-pop-best';
const BETWEEN_LEVELS_SECONDS = 1.3;
const LONGEST_FRAME_SECONDS = 0.05;

@Component({
  selector: 'app-orb-pop',
  styleUrl: './orb-pop.css',
  templateUrl: './orb-pop.html',
  host: {
    '(window:keydown)': 'onKeyDown($event)',
    '(window:keyup)': 'onKeyUp($event)',
    '(window:blur)': 'onBlur()',
  },
})
export class OrbPop {
  protected readonly phase = signal<'ready' | 'playing' | 'paused' | 'between' | 'over'>('ready');
  protected readonly message = signal('');
  protected readonly finalScore = signal(0);
  protected readonly finalLevel = signal(1);
  protected readonly bestScore = signal(readBestScore());
  protected readonly isNewBest = signal(false);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly engine = new OrbEngine();

  private leftHeld = false;
  private rightHeld = false;
  private fireHeld = false;
  private betweenSeconds = 0;
  private width = 0;
  private height = 0;
  private lastFrame = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      const resizeObserver = new ResizeObserver(() => this.resize(canvas, context));
      resizeObserver.observe(canvas);
      this.resize(canvas, context);
      document.fonts.load("700 15px 'Orbitron'");

      let frameRequest = 0;
      const frame = (now: number) => {
        this.renderFrame(context, now);
        frameRequest = requestAnimationFrame(frame);
      };
      frameRequest = requestAnimationFrame(frame);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frameRequest);
        resizeObserver.disconnect();
      });
    });
  }

  protected start(): void {
    this.engine.reset();
    this.isNewBest.set(false);
    this.phase.set('playing');
  }

  protected resume(): void {
    this.phase.set('playing');
  }

  protected hold(control: 'left' | 'right' | 'fire', held: boolean): void {
    if (control === 'left') {
      this.leftHeld = held;
    } else if (control === 'right') {
      this.rightHeld = held;
    } else {
      this.fireHeld = held;
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const control = controlForKey(event.key);
    const isConfirm = event.key === 'Enter' || event.key === ' ';
    const phase = this.phase();

    if (phase === 'playing' || phase === 'between') {
      if (control) {
        event.preventDefault();
        this.hold(control, true);
      } else if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
        if (phase === 'playing') {
          this.pause();
        }
      }
      return;
    }

    if (control && control !== 'fire') {
      event.preventDefault();
      this.hold(control, true);
    }

    // A focused button or link handles these keys itself.
    const target = event.target as HTMLElement;
    const onControl = target.closest(event.key === 'Enter' ? 'a, button' : 'button') !== null;
    if (isConfirm && !event.repeat && !onControl) {
      event.preventDefault();
      if (phase === 'paused') {
        this.resume();
      } else {
        this.start();
      }
    }
  }

  protected onKeyUp(event: KeyboardEvent): void {
    const control = controlForKey(event.key);
    if (control) {
      this.hold(control, false);
    }
  }

  protected onBlur(): void {
    this.leftHeld = false;
    this.rightHeld = false;
    this.fireHeld = false;
    if (this.phase() === 'playing') {
      this.pause();
    }
  }

  private pause(): void {
    this.phase.set('paused');
  }

  private resize(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
    const pixelRatio = window.devicePixelRatio || 1;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    canvas.width = Math.round(this.width * pixelRatio);
    canvas.height = Math.round(this.height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  private renderFrame(context: CanvasRenderingContext2D, now: number): void {
    const elapsed = Math.min((now - this.lastFrame) / 1000, LONGEST_FRAME_SECONDS);
    this.lastFrame = now;

    if (this.phase() === 'playing') {
      this.engine.update(elapsed, {
        move: Number(this.rightHeld) - Number(this.leftHeld),
        fire: this.fireHeld,
      });
      this.handleStatus();
    } else if (this.phase() === 'between') {
      this.betweenSeconds -= elapsed;
      if (this.betweenSeconds <= 0) {
        this.engine.next();
        this.phase.set('playing');
      }
    }

    drawOrbPop(context, this.width, this.height, this.engine, now / 1000);
  }

  private handleStatus(): void {
    switch (this.engine.status) {
      case 'cleared':
        this.showMessage(`Level ${this.engine.level} clear!`);
        break;
      case 'hit':
        this.showMessage('Ouch! Try again');
        break;
      case 'timeUp':
        this.showMessage("Time's up! Try again");
        break;
      case 'over':
        this.finishRun();
        break;
    }
  }

  private showMessage(message: string): void {
    this.message.set(message);
    this.betweenSeconds = BETWEEN_LEVELS_SECONDS;
    this.phase.set('between');
  }

  private finishRun(): void {
    const score = this.engine.score;
    this.finalScore.set(score);
    this.finalLevel.set(this.engine.level);
    if (score > this.bestScore()) {
      this.bestScore.set(score);
      this.isNewBest.set(true);
      saveBestScore(score);
    }
    this.phase.set('over');
  }
}

function controlForKey(key: string): 'left' | 'right' | 'fire' | null {
  switch (key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'left';
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'right';
    case ' ':
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'fire';
    default:
      return null;
  }
}

function readBestScore(): number {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // The best score just won't survive a reload if storage is unavailable.
  }
}
