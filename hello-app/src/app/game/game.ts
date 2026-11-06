import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { GameEngine } from './game-engine';
import { PALETTES, drawGame } from './game-renderer';
import { MAX_NAME_LENGTH, addHighScore, loadHighScores, loadLastName } from './high-scores';

const CRASH_FLASH_SECONDS = 0.5;
const RESTART_DELAY_MS = 500;
const LONGEST_FRAME_SECONDS = 0.05;

@Component({
  selector: 'app-game',
  styleUrl: './game.css',
  templateUrl: './game.html',
  host: {
    '(window:keydown)': 'onKeyDown($event)',
    '(window:keyup)': 'onKeyUp($event)',
    '(window:blur)': 'clearSteering()',
  },
})
export class Game {
  protected readonly maxNameLength = MAX_NAME_LENGTH;
  protected readonly phase = signal<'ready' | 'playing' | 'naming' | 'over'>('ready');
  protected readonly finalScore = signal(0);
  protected readonly highScores = signal(loadHighScores());
  protected readonly bestScore = computed(() => this.highScores()[0]?.score ?? 0);
  protected readonly isNewBest = signal(false);
  protected readonly playerName = signal(loadLastName());
  protected readonly canSave = computed(() => this.playerName().trim().length > 0);
  protected readonly lastSavedAt = signal<number | null>(null);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  private readonly playAgainButton = viewChild<ElementRef<HTMLButtonElement>>('playAgain');
  private readonly engine = new GameEngine();
  private readonly reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  private leftHeld = false;
  private rightHeld = false;
  private pointerSteer = 0;
  private crashFlash = 0;
  private crashedAt = 0;
  private width = 0;
  private height = 0;
  private lastFrame = 0;
  private frameRequest = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(() => this.nameInput()?.nativeElement.select());
    effect(() => this.playAgainButton()?.nativeElement.focus());

    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      const resizeObserver = new ResizeObserver(() => this.resize(canvas, context));
      resizeObserver.observe(canvas);
      this.resize(canvas, context);

      for (const palette of PALETTES) {
        document.fonts.load(`20px ${palette.font}`);
      }

      const frame = (now: number) => {
        this.renderFrame(context, now);
        this.frameRequest = requestAnimationFrame(frame);
      };
      this.frameRequest = requestAnimationFrame(frame);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.frameRequest);
        resizeObserver.disconnect();
      });
    });
  }

  protected start(): void {
    this.engine.reset();
    this.crashFlash = 0;
    this.isNewBest.set(false);
    this.lastSavedAt.set(null);
    this.phase.set('playing');
  }

  protected saveScore(event: Event): void {
    event.preventDefault();
    if (!this.canSave()) {
      return;
    }

    const savedAt = Date.now();
    this.highScores.update((scores) =>
      addHighScore(scores, { name: this.playerName().trim(), score: this.finalScore(), savedAt }),
    );
    this.lastSavedAt.set(savedAt);
    this.phase.set('over');
  }

  protected skipSaving(): void {
    this.phase.set('over');
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const steering = this.steeringKey(event);

    // The name box needs these keys. A steering key still held from the crash mustn't type.
    if (this.phase() === 'naming') {
      if (steering && event.repeat) {
        event.preventDefault();
      }
      return;
    }

    if (steering) {
      event.preventDefault();
      if (steering === 'left') {
        this.leftHeld = true;
      } else {
        this.rightHeld = true;
      }
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      if (this.phase() === 'playing') {
        event.preventDefault();
      } else if (
        !event.repeat &&
        !this.activatesFocusedControl(event) &&
        performance.now() - this.crashedAt > RESTART_DELAY_MS
      ) {
        event.preventDefault();
        this.start();
      }
    }
  }

  protected onKeyUp(event: KeyboardEvent): void {
    const steering = this.steeringKey(event);
    if (steering === 'left') {
      this.leftHeld = false;
    } else if (steering === 'right') {
      this.rightHeld = false;
    }
  }

  protected clearSteering(): void {
    this.leftHeld = false;
    this.rightHeld = false;
    this.pointerSteer = 0;
  }

  protected onPointerDown(event: PointerEvent): void {
    const canvas = this.canvas().nativeElement;
    canvas.setPointerCapture(event.pointerId);
    const bounds = canvas.getBoundingClientRect();
    this.pointerSteer = event.clientX < bounds.left + bounds.width / 2 ? -1 : 1;
  }

  protected onPointerUp(): void {
    this.pointerSteer = 0;
  }

  /** True when the key would press the focused button or link, so it shouldn't start a run. */
  private activatesFocusedControl(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    return target.closest(event.key === 'Enter' ? 'a, button' : 'button') !== null;
  }

  private steeringKey(event: KeyboardEvent): 'left' | 'right' | null {
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        return 'left';
      case 'ArrowRight':
      case 'd':
      case 'D':
        return 'right';
      default:
        return null;
    }
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
      const keySteer = Number(this.rightHeld) - Number(this.leftHeld);
      this.engine.update(elapsed, keySteer || this.pointerSteer);
      if (this.engine.crashed) {
        this.finishRun();
      }
    }

    this.crashFlash = Math.max(0, this.crashFlash - elapsed / CRASH_FLASH_SECONDS);
    drawGame(
      context,
      this.width,
      this.height,
      this.engine,
      now / 1000,
      this.crashFlash,
      this.reducedMotion,
    );
  }

  private finishRun(): void {
    const score = this.engine.score;
    this.crashFlash = 1;
    this.crashedAt = performance.now();
    this.finalScore.set(score);
    this.isNewBest.set(score > this.bestScore());
    this.phase.set('naming');
  }
}
