import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import {
  calculateBogdan,
  calculateCasino,
  calculateCayo,
  calculateKortz,
  HeistResult,
} from './heist-calculator';
import {
  BOGDAN,
  CASINO_DRIVERS,
  CASINO_GUNMEN,
  CASINO_HACKERS,
  CASINO_SETUP_FEE,
  CASINO_TARGETS,
  CAYO_PRIMARY,
  CAYO_SAFE,
  CAYO_SECONDARY,
  CAYO_SETUP_FEE,
  DEFAULT_CUTS,
  Difficulty,
  HEISTS,
  HeistId,
  KORTZ_PAINTINGS,
  KORTZ_SECONDARY,
} from './heist-data';

const CUSTOM_PAINTING = 'custom';

const DEFAULTS = {
  difficulty: 'normal' as Difficulty,
  elite: false,
  firstRun: true,
  cayoPrimaryId: 'diamond',
  cayoStacks: { cocaine: 2 } as Record<string, number>,
  cayoSafeValue: 58500,
  repeatRun: false,
  casinoTargetId: 'gold',
  takePercent: 100,
  hackerId: 'paige',
  gunmanId: 'karl',
  driverId: 'karim',
  paintingId: 'derniere',
  customValue: 0,
  kortzItems: {} as Record<string, number>,
  buyerRequest: false,
  payPlanningFee: false,
};

@Component({
  imports: [DecimalPipe],
  selector: 'app-heists',
  styleUrl: './heists.css',
  templateUrl: './heists.html',
})
export class Heists {
  protected readonly heists = HEISTS;
  protected readonly cayoPrimary = CAYO_PRIMARY;
  protected readonly cayoSecondary = CAYO_SECONDARY;
  protected readonly cayoSafe = CAYO_SAFE;
  protected readonly casinoTargets = CASINO_TARGETS;
  protected readonly hackers = CASINO_HACKERS;
  protected readonly gunmen = CASINO_GUNMEN;
  protected readonly drivers = CASINO_DRIVERS;
  protected readonly kortzSecondary = KORTZ_SECONDARY;
  protected readonly customPainting = CUSTOM_PAINTING;

  protected readonly heistId = signal<HeistId>('cayo');
  protected readonly difficulty = signal(DEFAULTS.difficulty);
  protected readonly players = signal(1);
  protected readonly cuts = signal(DEFAULT_CUTS[1]);
  protected readonly elite = signal(DEFAULTS.elite);
  protected readonly firstRun = signal(DEFAULTS.firstRun);

  protected readonly cayoPrimaryId = signal(DEFAULTS.cayoPrimaryId);
  protected readonly cayoStacks = signal(DEFAULTS.cayoStacks);
  protected readonly cayoSafeValue = signal(DEFAULTS.cayoSafeValue);
  protected readonly repeatRun = signal(DEFAULTS.repeatRun);

  protected readonly casinoTargetId = signal(DEFAULTS.casinoTargetId);
  protected readonly takePercent = signal(DEFAULTS.takePercent);
  protected readonly hackerId = signal(DEFAULTS.hackerId);
  protected readonly gunmanId = signal(DEFAULTS.gunmanId);
  protected readonly driverId = signal(DEFAULTS.driverId);

  protected readonly paintingId = signal(DEFAULTS.paintingId);
  protected readonly customValue = signal(DEFAULTS.customValue);
  protected readonly kortzItems = signal(DEFAULTS.kortzItems);
  protected readonly buyerRequest = signal(DEFAULTS.buyerRequest);
  protected readonly payPlanningFee = signal(DEFAULTS.payPlanningFee);

  /** Changes on reset, so the form is rebuilt and boxes the user cleared are filled in again. */
  protected readonly formVersion = signal(0);

  protected readonly paintings = computed(() =>
    KORTZ_PAINTINGS.filter((painting) => painting.difficulty === this.difficulty()),
  );
  protected readonly selectedPaintingId = computed(() => {
    const id = this.paintingId();
    const available = id === CUSTOM_PAINTING || this.paintings().some((p) => p.id === id);
    return available ? id : this.paintings()[0].id;
  });

  protected readonly setupFee = computed(() => {
    switch (this.heistId()) {
      case 'cayo':
        return CAYO_SETUP_FEE;
      case 'casino':
        return CASINO_SETUP_FEE;
      case 'bogdan':
        return BOGDAN.setupFee;
      default:
        return 0;
    }
  });

  protected readonly result = computed<HeistResult>(() => {
    const crew = {
      difficulty: this.difficulty(),
      cuts: this.cuts(),
      elite: this.elite(),
    };
    switch (this.heistId()) {
      case 'cayo':
        return calculateCayo({
          ...crew,
          primaryId: this.cayoPrimaryId(),
          stacks: this.cayoStacks(),
          safe: this.cayoSafeValue(),
          repeatRun: this.repeatRun(),
        });
      case 'casino':
        return calculateCasino({
          ...crew,
          targetId: this.casinoTargetId(),
          firstRun: this.firstRun(),
          takePercent: this.takePercent(),
          hackerId: this.hackerId(),
          gunmanId: this.gunmanId(),
          driverId: this.driverId(),
        });
      case 'bogdan':
        return calculateBogdan({ ...crew, firstRun: this.firstRun() });
      default:
        return calculateKortz({
          difficulty: this.difficulty(),
          players: this.players(),
          paintingId: this.selectedPaintingId(),
          customValue: this.customValue(),
          firstSale: this.firstRun(),
          items: this.kortzItems(),
          buyerRequest: this.buyerRequest(),
          elite: this.elite(),
          payPlanningFee: this.payPlanningFee(),
        });
    }
  });

  protected readonly playerOptions = computed(() => {
    const minimum = HEISTS.find((heist) => heist.id === this.heistId())?.minPlayers ?? 1;
    return [1, 2, 3, 4].filter((count) => count >= minimum);
  });

  protected selectHeist(id: HeistId): void {
    this.heistId.set(id);
    if (!this.playerOptions().includes(this.players())) {
      this.selectPlayers(this.playerOptions()[0]);
    }
  }

  protected resetValues(): void {
    this.difficulty.set(DEFAULTS.difficulty);
    this.elite.set(DEFAULTS.elite);
    this.firstRun.set(DEFAULTS.firstRun);
    this.cayoPrimaryId.set(DEFAULTS.cayoPrimaryId);
    this.cayoStacks.set(DEFAULTS.cayoStacks);
    this.cayoSafeValue.set(DEFAULTS.cayoSafeValue);
    this.repeatRun.set(DEFAULTS.repeatRun);
    this.casinoTargetId.set(DEFAULTS.casinoTargetId);
    this.takePercent.set(DEFAULTS.takePercent);
    this.hackerId.set(DEFAULTS.hackerId);
    this.gunmanId.set(DEFAULTS.gunmanId);
    this.driverId.set(DEFAULTS.driverId);
    this.paintingId.set(DEFAULTS.paintingId);
    this.customValue.set(DEFAULTS.customValue);
    this.kortzItems.set(DEFAULTS.kortzItems);
    this.buyerRequest.set(DEFAULTS.buyerRequest);
    this.payPlanningFee.set(DEFAULTS.payPlanningFee);
    this.selectPlayers(this.playerOptions()[0]);
    this.formVersion.update((version) => version + 1);
  }

  protected selectPlayers(count: number): void {
    this.players.set(count);
    this.cuts.set(DEFAULT_CUTS[count]);
  }

  protected setCut(index: number, value: string): void {
    this.cuts.update((cuts) => cuts.map((cut, i) => (i === index ? toAmount(value) : cut)));
  }

  protected setStack(id: string, value: string): void {
    this.cayoStacks.update((stacks) => ({ ...stacks, [id]: toAmount(value) }));
  }

  protected setKortzItem(id: string, value: string): void {
    this.kortzItems.update((items) => ({ ...items, [id]: toAmount(value) }));
  }

  protected setAmount(target: { set(value: number): void }, value: string): void {
    target.set(toAmount(value));
  }

  protected setTakePercent(value: string): void {
    this.takePercent.set(Math.min(100, toAmount(value)));
  }
}

function toAmount(value: string): number {
  return Math.max(0, Number(value) || 0);
}
