/*
 * GTA Online heist values after Title Update 1.73 (July 2026), from GTA BOOM, Timesaver and the
 * GTA Wiki. Rockstar doesn't publish most of these, so they are community-confirmed figures.
 */

export type Difficulty = 'normal' | 'hard';
export type HeistId = 'cayo' | 'casino' | 'bogdan' | 'kortz';

export const HEISTS: { id: HeistId; name: string; minPlayers: number }[] = [
  { id: 'cayo', name: 'The Cayo Perico Heist', minPlayers: 1 },
  { id: 'casino', name: 'The Diamond Casino Heist', minPlayers: 2 },
  { id: 'bogdan', name: 'Doomsday: The Bogdan Problem', minPlayers: 2 },
  { id: 'kortz', name: 'The Kortz Center Heist', minPlayers: 1 },
];

export const ELITE_BONUS: Record<Difficulty, number> = { normal: 50000, hard: 100000 };

export interface CayoPrimary {
  id: string;
  name: string;
  normal: number;
  hard: number;
  /** Extra secondary loot value on repeat runs. */
  repeatBonus: number;
}

export const CAYO_PRIMARY: CayoPrimary[] = [
  { id: 'tequila', name: 'Sinsimito Tequila', normal: 400000, hard: 440000, repeatBonus: 0.2 },
  { id: 'ruby', name: 'Ruby Necklace', normal: 560000, hard: 616000, repeatBonus: 0.1 },
  { id: 'bonds', name: 'Bearer Bonds', normal: 616000, hard: 677600, repeatBonus: 0.05 },
  { id: 'diamond', name: 'Pink Diamond', normal: 910000, hard: 1001000, repeatBonus: 0 },
  {
    id: 'panther',
    name: 'Panther Statue (event only)',
    normal: 1900000,
    hard: 2090000,
    repeatBonus: 0,
  },
];

export interface CayoLoot {
  id: string;
  name: string;
  min: number;
  max: number;
  bagPercent: number;
}

export const CAYO_SECONDARY: CayoLoot[] = [
  { id: 'gold', name: 'Gold', min: 295500, max: 300000, bagPercent: 66.7 },
  { id: 'cocaine', name: 'Cocaine', min: 178200, max: 182250, bagPercent: 50 },
  { id: 'artwork', name: 'Artwork', min: 141750, max: 162000, bagPercent: 50 },
  { id: 'weed', name: 'Weed', min: 117450, max: 121500, bagPercent: 37.5 },
  { id: 'cash', name: 'Cash', min: 70875, max: 74925, bagPercent: 25 },
];

export const CAYO_SAFE = { min: 18000, max: 99000 };
export const CAYO_FENCING_FEE = 0.1;
export const CAYO_PAVEL_CUT = 0.02;
export const CAYO_SETUP_FEE = 100000;

export interface CasinoTarget {
  id: string;
  name: string;
  repeat: Record<Difficulty, number>;
  firstRun: Record<Difficulty, number>;
}

export const CASINO_TARGETS: CasinoTarget[] = [
  {
    id: 'cash',
    name: 'Cash',
    repeat: { normal: 1480500, hard: 1628550 },
    firstRun: { normal: 2753730, hard: 3029103 },
  },
  {
    id: 'artwork',
    name: 'Artwork',
    repeat: { normal: 1645000, hard: 1809500 },
    firstRun: { normal: 3059700, hard: 3365670 },
  },
  {
    id: 'gold',
    name: 'Gold',
    repeat: { normal: 1809500, hard: 1990450 },
    firstRun: { normal: 3365670, hard: 3702237 },
  },
  {
    id: 'diamonds',
    name: 'Diamonds (event weeks)',
    repeat: { normal: 2303000, hard: 2533300 },
    firstRun: { normal: 4283580, hard: 4711938 },
  },
];

export interface CrewMember {
  id: string;
  name: string;
  cut: number;
}

export const CASINO_HACKERS: CrewMember[] = [
  { id: 'rickie', name: 'Rickie Lukens', cut: 0.03 },
  { id: 'yohan', name: 'Yohan Blair', cut: 0.05 },
  { id: 'christian', name: 'Christian Feltz', cut: 0.07 },
  { id: 'paige', name: 'Paige Harris', cut: 0.09 },
  { id: 'avi', name: 'Avi Schwartzman', cut: 0.1 },
];

export const CASINO_GUNMEN: CrewMember[] = [
  { id: 'karl', name: 'Karl Abolaji', cut: 0.05 },
  { id: 'charlie', name: 'Charlie Reed', cut: 0.07 },
  { id: 'patrick', name: 'Patrick McReary', cut: 0.08 },
  // Sources disagree on Gustavo: gtabase lists 9%, the GTA Wiki lists 8%.
  { id: 'gustavo', name: 'Gustavo Mota', cut: 0.09 },
  { id: 'chester', name: 'Chester McCoy', cut: 0.1 },
];

export const CASINO_DRIVERS: CrewMember[] = [
  { id: 'karim', name: 'Karim Denz', cut: 0.05 },
  { id: 'zach', name: 'Zach Nelson', cut: 0.06 },
  { id: 'taliana', name: 'Taliana Martinez', cut: 0.07 },
  { id: 'eddie', name: 'Eddie Toh', cut: 0.09 },
  { id: 'chester', name: 'Chester McCoy', cut: 0.1 },
];

export const CASINO_LESTER_CUT = 0.05;
export const CASINO_SETUP_FEE = 25000;

export const BOGDAN = {
  repeat: { normal: 1282500, hard: 1603125 } as Record<Difficulty, number>,
  firstRun: { normal: 1567215, hard: 1959019 } as Record<Difficulty, number>,
  eliteBonus: 50000,
  setupFee: 95000,
};

export interface KortzPainting {
  id: string;
  name: string;
  difficulty: Difficulty;
  firstSale: number;
  additionalSale: number;
  /** True when a value is worked out from the 4x first-sale ratio, not seen in a completed run. */
  estimated?: boolean;
}

export const KORTZ_PAINTINGS: KortzPainting[] = [
  {
    id: 'derniere',
    name: 'La Dernière Débauche',
    difficulty: 'normal',
    firstSale: 1925000,
    additionalSale: 481250,
  },
  {
    id: 'melee',
    name: 'Mi O Melee',
    difficulty: 'normal',
    firstSale: 1268000,
    additionalSale: 317000,
  },
  {
    id: 'voices',
    name: 'I Hear Voices',
    difficulty: 'normal',
    firstSale: 1234000,
    additionalSale: 308500,
    estimated: true,
  },
  {
    id: 'consumato',
    name: 'Consumato',
    difficulty: 'normal',
    firstSale: 1232000,
    additionalSale: 308000,
    estimated: true,
  },
  {
    id: 'fruit',
    name: 'I, Fruit',
    difficulty: 'hard',
    firstSale: 1372800,
    additionalSale: 343200,
  },
  {
    id: 'necklace',
    name: 'The Girl with the Pearl Necklace',
    difficulty: 'hard',
    firstSale: 1361800,
    additionalSale: 340450,
    estimated: true,
  },
  {
    id: 'rome',
    name: 'The Downfall of Rome',
    difficulty: 'hard',
    firstSale: 1342000,
    additionalSale: 335500,
  },
];

export interface KortzLoot {
  id: string;
  name: string;
  normal: [number, number];
  hard: [number, number];
  bagPercent: number;
  /** Crisp Gallery items need a second player to open the shutter. */
  needsTwoPlayers?: boolean;
}

export const KORTZ_SECONDARY: KortzLoot[] = [
  {
    id: 'crisp-paintings',
    name: 'Crisp Gallery paintings',
    normal: [140000, 162000],
    hard: [154000, 178200],
    bagPercent: 50,
    needsTwoPlayers: true,
  },
  {
    id: 'crisp-cabinets',
    name: 'Crisp Gallery glass cabinets',
    normal: [100000, 127000],
    hard: [110000, 139700],
    bagPercent: 30,
    needsTwoPlayers: true,
  },
  {
    id: 'crisp-statues',
    name: 'Crisp Gallery statue or meteorite',
    normal: [70000, 96000],
    hard: [77000, 105600],
    bagPercent: 20,
    needsTwoPlayers: true,
  },
  {
    id: 'crisp-rings',
    name: 'Crisp Gallery Coquard rings',
    normal: [42000, 53000],
    // Not confirmed yet: estimated with the 10% Hard increase seen on every other item.
    hard: [46200, 58300],
    bagPercent: 10,
    needsTwoPlayers: true,
  },
  {
    id: 'loading-bay',
    name: 'Loading bay item',
    normal: [105000, 140000],
    hard: [115500, 154000],
    bagPercent: 30,
  },
  {
    id: 'paintings',
    name: 'Paintings',
    normal: [102000, 122000],
    hard: [112200, 134200],
    bagPercent: 50,
  },
  {
    id: 'glass-cases',
    name: 'Vertical glass case items',
    normal: [77500, 100000],
    hard: [85250, 110000],
    bagPercent: 30,
  },
  {
    id: 'statues',
    name: 'Fertility statue or Coquard rings',
    normal: [50000, 64000],
    hard: [55000, 70400],
    bagPercent: 20,
  },
  {
    id: 'rings',
    name: 'Coquard rings and bracelets',
    normal: [28000, 35000],
    hard: [30800, 38500],
    bagPercent: 10,
  },
  {
    id: 'deposit-boxes',
    name: 'Safety deposit boxes',
    normal: [5000, 12000],
    hard: [5500, 13200],
    bagPercent: 30,
  },
];

export const KORTZ_PAINTING_BAG_PERCENT = 50;
export const KORTZ_BUYER_REQUEST: Record<Difficulty, number> = { normal: 50000, hard: 100000 };
export const KORTZ_PLANNING_FEE = 100000;

/** Starting cuts for each crew size, host first. */
export const DEFAULT_CUTS: Record<number, number[]> = {
  1: [100],
  2: [60, 40],
  3: [50, 25, 25],
  4: [40, 20, 20, 20],
};

export const MINIMUM_CUT = 15;
