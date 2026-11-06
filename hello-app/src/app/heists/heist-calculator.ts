import {
  BOGDAN,
  CASINO_DRIVERS,
  CASINO_GUNMEN,
  CASINO_HACKERS,
  CASINO_LESTER_CUT,
  CASINO_SETUP_FEE,
  CASINO_TARGETS,
  CAYO_FENCING_FEE,
  CAYO_PAVEL_CUT,
  CAYO_PRIMARY,
  CAYO_SECONDARY,
  CAYO_SETUP_FEE,
  CrewMember,
  Difficulty,
  ELITE_BONUS,
  KORTZ_BUYER_REQUEST,
  KORTZ_PAINTINGS,
  KORTZ_PAINTING_BAG_PERCENT,
  KORTZ_PLANNING_FEE,
  KORTZ_SECONDARY,
  MINIMUM_CUT,
} from './heist-data';

export interface ResultLine {
  label: string;
  amount: number;
}

export interface PlayerShare {
  name: string;
  cut: number;
  amount: number;
}

export interface HeistResult {
  lines: ResultLine[];
  /** What is left for the players. */
  crewTake: number;
  shares: PlayerShare[];
  warnings: string[];
}

interface CrewInputs {
  difficulty: Difficulty;
  cuts: number[];
  elite: boolean;
}

export interface CayoInputs extends CrewInputs {
  primaryId: string;
  stacks: Record<string, number>;
  safe: number;
  repeatRun: boolean;
}

export interface CasinoInputs extends CrewInputs {
  targetId: string;
  firstRun: boolean;
  takePercent: number;
  hackerId: string;
  gunmanId: string;
  driverId: string;
}

export interface BogdanInputs extends CrewInputs {
  firstRun: boolean;
}

export interface KortzInputs {
  difficulty: Difficulty;
  players: number;
  paintingId: string;
  customValue: number;
  firstSale: boolean;
  items: Record<string, number>;
  buyerRequest: boolean;
  elite: boolean;
  payPlanningFee: boolean;
}

export function calculateCayo(inputs: CayoInputs): HeistResult {
  const primary = find(CAYO_PRIMARY, inputs.primaryId);
  const primaryValue = primary[inputs.difficulty];
  const bonus = inputs.repeatRun ? primary.repeatBonus : 0;

  let secondary = 0;
  let bagUsed = 0;
  for (const loot of CAYO_SECONDARY) {
    const stacks = inputs.stacks[loot.id] ?? 0;
    secondary += stacks * midpoint(loot.min, loot.max) * (1 + bonus);
    bagUsed += stacks * loot.bagPercent;
  }

  const gross = primaryValue + secondary + inputs.safe;
  const fencing = gross * CAYO_FENCING_FEE;
  const pavel = gross * CAYO_PAVEL_CUT;
  const crewTake = gross - fencing - pavel;

  const lines: ResultLine[] = [
    { label: `Primary: ${primary.name}`, amount: primaryValue },
    { label: 'Secondary loot', amount: secondary },
    { label: "El Rubio's safe", amount: inputs.safe },
    { label: 'Fencing fee (10%)', amount: -fencing },
    { label: "Pavel's cut (2%)", amount: -pavel },
  ];

  return {
    lines,
    crewTake,
    shares: splitTake(crewTake, inputs, CAYO_SETUP_FEE, ELITE_BONUS[inputs.difficulty]),
    warnings: [...bagWarning(bagUsed, inputs.cuts.length), ...cutWarnings(inputs.cuts)],
  };
}

export function calculateCasino(inputs: CasinoInputs): HeistResult {
  const target = find(CASINO_TARGETS, inputs.targetId);
  const fullVault = (inputs.firstRun ? target.firstRun : target.repeat)[inputs.difficulty];
  const gross = fullVault * (inputs.takePercent / 100);
  const hacker = find(CASINO_HACKERS, inputs.hackerId);
  const gunman = find(CASINO_GUNMEN, inputs.gunmanId);
  const driver = find(CASINO_DRIVERS, inputs.driverId);

  const lester = gross * CASINO_LESTER_CUT;
  const crewLine = (role: string, member: CrewMember) => ({
    label: `${role}: ${member.name} (${Math.round(member.cut * 100)}%)`,
    amount: -gross * member.cut,
  });

  const lines: ResultLine[] = [
    { label: `Vault: ${target.name} (${inputs.takePercent}% taken)`, amount: gross },
    { label: 'Lester (5%)', amount: -lester },
    crewLine('Hacker', hacker),
    crewLine('Gunman', gunman),
    crewLine('Driver', driver),
  ];

  const crewTake = lines.reduce((total, line) => total + line.amount, 0);
  const warnings = cutWarnings(inputs.cuts);
  if (gunman.id === 'chester' && driver.id === 'chester') {
    warnings.push('Chester McCoy can only fill one role, so pick someone else as gunman or driver.');
  }

  return {
    lines,
    crewTake,
    shares: splitTake(crewTake, inputs, CASINO_SETUP_FEE, ELITE_BONUS[inputs.difficulty]),
    warnings,
  };
}

export function calculateBogdan(inputs: BogdanInputs): HeistResult {
  const payout = (inputs.firstRun ? BOGDAN.firstRun : BOGDAN.repeat)[inputs.difficulty];
  return {
    lines: [{ label: 'Finale payout', amount: payout }],
    crewTake: payout,
    shares: splitTake(payout, inputs, BOGDAN.setupFee, BOGDAN.eliteBonus),
    warnings: cutWarnings(inputs.cuts),
  };
}

export function calculateKortz(inputs: KortzInputs): HeistResult {
  const painting = KORTZ_PAINTINGS.find((option) => option.id === inputs.paintingId);
  const primaryValue = painting
    ? inputs.firstSale
      ? painting.firstSale
      : painting.additionalSale
    : inputs.customValue;

  let secondary = 0;
  let bagUsed = KORTZ_PAINTING_BAG_PERCENT;
  for (const loot of KORTZ_SECONDARY) {
    if (loot.needsTwoPlayers && inputs.players < 2) {
      continue;
    }
    const count = inputs.items[loot.id] ?? 0;
    const [min, max] = loot[inputs.difficulty];
    secondary += count * midpoint(min, max);
    bagUsed += count * loot.bagPercent;
  }

  const lines: ResultLine[] = [
    { label: `Primary: ${painting?.name ?? 'Custom value'}`, amount: primaryValue },
    { label: 'Secondary loot', amount: secondary },
  ];
  if (inputs.buyerRequest) {
    lines.push({ label: "Buyer's Request", amount: KORTZ_BUYER_REQUEST[inputs.difficulty] });
  }
  if (inputs.elite) {
    lines.push({ label: 'Elite Challenge', amount: ELITE_BONUS[inputs.difficulty] });
  }
  if (inputs.payPlanningFee) {
    lines.push({ label: 'Planning fee', amount: -KORTZ_PLANNING_FEE });
  }

  const crewTake = lines.reduce((total, line) => total + line.amount, 0);
  return {
    lines,
    crewTake,
    shares: [],
    warnings: bagWarning(bagUsed, inputs.players),
  };
}

function splitTake(
  crewTake: number,
  inputs: CrewInputs,
  setupFee: number,
  eliteBonus: number,
): PlayerShare[] {
  return inputs.cuts.map((cut, index) => ({
    name: index === 0 ? 'Host' : `Player ${index + 1}`,
    cut,
    amount:
      (crewTake * cut) / 100 + (inputs.elite ? eliteBonus : 0) - (index === 0 ? setupFee : 0),
  }));
}

function cutWarnings(cuts: number[]): string[] {
  const warnings: string[] = [];
  const total = cuts.reduce((sum, cut) => sum + cut, 0);
  if (total !== 100) {
    warnings.push(`Player cuts add up to ${total}%, but they must total 100%.`);
  }
  if (cuts.length > 1 && cuts.some((cut) => cut < MINIMUM_CUT)) {
    warnings.push(`Each player must get at least ${MINIMUM_CUT}%.`);
  }
  return warnings;
}

function bagWarning(bagUsed: number, players: number): string[] {
  const capacity = players * 100;
  return bagUsed > capacity + 0.5
    ? [`That loot needs ${Math.round(bagUsed)}% of a bag, but this crew only carries ${capacity}%.`]
    : [];
}

function midpoint(min: number, max: number): number {
  return (min + max) / 2;
}

function find<T extends { id: string }>(options: T[], id: string): T {
  return options.find((option) => option.id === id) ?? options[0];
}
