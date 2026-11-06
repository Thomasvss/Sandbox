import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Confetti } from './confetti';
import { QUIZ_QUESTIONS, QuizQuestion } from './quiz-questions';
import { playVictorySound } from './victory-sound';

const SOUND_KEY = 'quiz-sound';

interface ShuffledQuestion extends QuizQuestion {
  options: string[];
}

@Component({
  selector: 'app-quiz',
  styleUrl: './quiz.css',
  templateUrl: './quiz.html',
})
export class Quiz {
  protected readonly questions = signal(shuffleOptions());
  protected readonly index = signal(0);
  protected readonly picked = signal<string | null>(null);
  protected readonly score = signal(0);
  protected readonly finished = signal(false);
  protected readonly imageFailed = signal(false);
  protected readonly soundOn = signal(readSoundSetting());

  private readonly confettiCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('confetti');
  private confetti: Confetti | null = null;

  protected readonly current = computed(() => this.questions()[this.index()]);
  protected readonly isLast = computed(() => this.index() === this.questions().length - 1);
  protected readonly rating = computed(() => {
    const share = this.score() / this.questions().length;
    if (share === 1) {
      return 'You know everything. Are you Gossip Girl?';
    }
    if (share >= 0.7) {
      return 'A true Upper East Sider.';
    }
    if (share >= 0.4) {
      return "You're on the guest list, but not the VIP one.";
    }
    return 'Time for a rewatch from the Pilot.';
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.confetti = new Confetti(this.confettiCanvas().nativeElement);
      destroyRef.onDestroy(() => this.confetti?.destroy());
    });
  }

  protected toggleSound(): void {
    this.soundOn.update((on) => !on);
    saveSoundSetting(this.soundOn());
  }

  protected pick(option: string): void {
    if (this.picked() !== null) {
      return;
    }
    this.picked.set(option);
    if (option === this.current().answer) {
      this.score.update((score) => score + 1);
      this.celebrate();
    }
  }

  protected next(): void {
    if (this.isLast()) {
      this.finished.set(true);
      return;
    }
    this.index.update((index) => index + 1);
    this.picked.set(null);
    this.imageFailed.set(false);
  }

  private celebrate(): void {
    if (this.soundOn()) {
      playVictorySound();
    }
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.confetti?.burst();
    }
  }

  protected restart(): void {
    this.questions.set(shuffleOptions());
    this.index.set(0);
    this.picked.set(null);
    this.score.set(0);
    this.finished.set(false);
    this.imageFailed.set(false);
  }
}

function readSoundSetting(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

function saveSoundSetting(on: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  } catch {
    // The choice just won't survive a reload if storage is unavailable.
  }
}

function shuffleOptions(): ShuffledQuestion[] {
  return QUIZ_QUESTIONS.map((question) => ({
    ...question,
    options: shuffle([question.answer, ...question.wrongAnswers]),
  }));
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}
