/*
 * Drop rates from the RuneScape Wiki (runescape.wiki), for members on normal mode with no luck.
 * Left out: charms, and items that need a quest, task or other condition to drop.
 */

export interface Drop {
  item: string;
  min: number;
  max: number;
  noted: boolean;
}

/** One slot on a table. A slot can give several items, or send you to the rare drop table. */
export interface TableSlot {
  weight: number;
  drops: Drop[];
  rareTableRoll?: boolean;
  /** Points this slot spends, for bosses that use `commonPoints`. */
  cost?: number;
}

export interface UniqueRoll {
  chance: number;
  /** True when hitting this table gives its item instead of a main drop. */
  replacesMain: boolean;
  slots: TableSlot[];
}

export interface ChanceDrop {
  chance: number;
  drop: Drop;
}

export interface Boss {
  id: string;
  name: string;
  always: Drop[];
  extraTables: TableSlot[][];
  uniqueRolls: UniqueRoll[];
  main: TableSlot[];
  rareTable?: { chance: number; rolls: number };
  /** When set, `main` is rolled repeatedly until these points are spent. */
  commonPoints?: number;
  tertiary: ChanceDrop[];
  /** Shown under the loot panel, for rates that are fixed or estimated. */
  note?: string;
}

function drop(item: string, min = 1, max = min): Drop {
  return { item, min, max, noted: false };
}

function noted(item: string, min = 1, max = min): Drop {
  return { item, min, max, noted: true };
}

function slot(weight: number, ...drops: Drop[]): TableSlot {
  return { weight, drops };
}

function pointSlot(weight: number, cost: number, ...drops: Drop[]): TableSlot {
  return { weight, cost, drops };
}

function tertiary(chance: number, item: string): ChanceDrop {
  return { chance, drop: drop(item) };
}

// Telos's unique chance at 0% enrage on a first kill, using the wiki's player-derived formula:
// (1,000 + 300 x 1 kill) / 1,000,000, then 30 times rarer on Bronze tier loot.
const TELOS_UNIQUE_CHANCE = 0.0013 / 30;

const RARE_TABLE_COMMON: TableSlot[] = [
  slot(1 / 400, drop('Uncut dragonstone')),
  slot(1 / 533.33, drop('Tooth half of a key')),
  slot(1 / 533.33, drop('Loop half of a key')),
  slot(1 / 640, noted('Huge plated rune salvage')),
  slot(1 / 800, noted('Magic logs', 65, 85)),
  slot(1 / 800, drop('Rune arrowheads', 110, 140)),
  slot(1 / 800, noted('Soft clay', 35, 45)),
  slot(1 / 1600, noted('Small bladed orikalkum salvage')),
  slot(1 / 1600, drop('Catalytic anima stone', 35, 45)),
  slot(1 / 1600, noted('Teak plank', 45, 55)),
  slot(1 / 1600, noted('Dragon bones', 35, 45)),
  slot(1 / 1426.18, drop('Dragon helm')),
  slot(1 / 5145.73, drop('Dragon longsword')),
  slot(1 / 5145.73, drop('Off-hand dragon longsword')),
  slot(1 / 800, noted('Molten glass', 45, 55)),
  slot(1 / 800, drop('Runite stone spirit', 25, 35)),
  slot(1 / 800, noted('Raw lobster', 135, 165)),
];

export const SUPER_RARE_TABLE: TableSlot[] = [
  slot(1 / 25600, drop('Shield left half')),
  slot(1 / 14628.57, drop('Dragon spear')),
  slot(1 / 34133.33, noted('Huge plated rune salvage', 18, 22)),
  slot(1 / 25600, noted('Yew logs', 675, 825)),
  slot(1 / 17066.67, noted('Super restore (4)', 45, 55)),
  slot(1 / 17066.67, noted('Prayer potion (4)', 45, 55)),
  slot(1 / 20480, noted('Raw rocktail', 180, 220)),
  slot(1 / 34133.33, noted('Mahogany plank', 270, 330)),
  slot(1 / 51200, drop('Magic seed', 3, 5)),
  slot(1 / 64000, noted('Water talisman', 68, 82)),
  slot(1 / 64000, noted('Battlestaff', 180, 220)),
  slot(1 / 51200, noted('Hardened dragon bones', 45, 55)),
  slot(1 / 64000, drop('Onyx bolt tips', 135, 165)),
  slot(1 / 64000, drop('Ciku seed')),
  slot(1 / 34133.33, drop('Golden dragonfruit seed', 13, 17)),
  slot(1 / 20480, noted('Uncut diamond', 45, 55)),
  slot(1 / 51200, noted('Uncut dragonstone', 45, 55)),
  slot(1 / 64000, drop('Soul rune', 450, 550)),
  slot(1 / 25600, drop('Light animica stone spirit', 270, 330)),
  slot(1 / 25600, drop('Dark animica stone spirit', 270, 330)),
  slot(1 / 24380.95, drop('Primal stone spirit', 90, 150)),
  slot(1 / 8533.33, noted('Crystal key', 9, 11)),
  slot(1 / 34133.33, noted('White berries', 67, 85)),
  slot(1 / 25600, drop('Ectoplasm', 270, 330)),
  slot(1 / 25600, noted('Medium spiky orikalkum salvage', 3, 5)),
  slot(1 / 34133.33, noted('Large blunt necronium salvage', 2)),
  slot(1 / 64000, noted('Wine of Saradomin', 13, 17)),
  slot(1 / 20480, drop('Starbloom flower seed', 5, 8)),
  slot(1 / 51200, drop('Distraction & Diversion reset token (daily)')),
  slot(1 / 51200, drop('Distraction & Diversion reset token (weekly)')),
  slot(1 / 51200, drop('Distraction & Diversion reset token (monthly)')),
  slot(1 / 512000, drop('Cheese+tom batta')),
];

export const RARE_TABLE: TableSlot[] = [...RARE_TABLE_COMMON, ...SUPER_RARE_TABLE];

export const BOSSES: Boss[] = [
  {
    id: 'araxxi',
    name: 'Araxxi (0% enrage)',
    always: [],
    extraTables: [
      [slot(49, drop('Araxyte arrow', 70, 90)), slot(1, drop('Araxyte pheromone'))],
      [
        slot(5, drop('Saradomin brew flask (6)', 9, 15)),
        slot(5, drop('Super restore flask (6)', 2, 5)),
        slot(4, drop('Rocktail', 8, 11)),
        slot(1, drop('Overload flask (6)', 2, 5)),
      ],
    ],
    uniqueRolls: [
      {
        chance: 1 / 40,
        replacesMain: false,
        slots: [
          slot(1, drop('Spider leg top')),
          slot(1, drop('Spider leg middle')),
          slot(1, drop('Spider leg bottom')),
        ],
      },
      {
        chance: 1 / 120,
        replacesMain: false,
        slots: [
          slot(1, drop("Araxxi's fang")),
          slot(1, drop("Araxxi's web")),
          slot(1, drop("Araxxi's eye")),
        ],
      },
    ],
    main: [
      slot(1, drop('Lantadyme seed', 5, 6)),
      slot(1, drop('Dwarf weed seed', 6), drop('Avantoe seed', 6)),
      slot(1, drop('Black dragonhide', 70, 90)),
      slot(1, drop('Magic logs', 150, 324)),
      slot(1, drop('Huge plated rune salvage', 10)),
      slot(1, drop('Necrite stone spirit', 20), drop('Phasmatite stone spirit', 20)),
      slot(1, drop('Coins', 400024, 449960)),
      slot(1, drop('Water talisman', 40, 70)),
      slot(1, drop('Banite stone spirit', 25)),
      slot(1, drop('Dwarf weed seed', 10)),
      slot(1, drop('Magic seed', 5, 8)),
      slot(1, drop('Battlestaff', 50, 70)),
      slot(1, drop('Onyx bolts (e)', 100, 251)),
      slot(1, drop('Sirenic scale', 2, 3)),
      slot(1, drop('Uncut onyx', 2)),
      slot(1, drop('Hydrix bolt tips', 40)),
      slot(1, drop('Eternal magic wood spirit', 37, 49)),
    ],
    tertiary: [
      tertiary(1 / 128, 'Starved ancient effigy'),
      tertiary(1 / 1000, 'Araxyte pet'),
      tertiary(1 / 500, "Araxxor's head"),
    ],
    note: 'Solo kill. Assumes level 90 Herblore for overloads, and that all three leg paths and add-ons are equally likely.',
  },
  {
    id: 'giant-mole',
    name: 'Giant Mole',
    always: [drop('Big bones'), drop('Mole claw'), drop('Mole skin', 3)],
    extraTables: [],
    uniqueRolls: [
      {
        chance: 1 / 10,
        replacesMain: false,
        slots: [
          slot(46, drop('Numbing root', 3, 6)),
          slot(5, drop('Clingy mole')),
          slot(1, drop('Dragon 2h sword')),
        ],
      },
    ],
    main: [
      slot(18, drop('Coins', 12000, 16000)),
      slot(12, drop('Coins', 18500, 23500)),
      slot(6, noted('Red dragonhide', 3)),
      slot(14, drop('Ranarr seed')),
      slot(12, drop('Grapevine seed', 4)),
      slot(10, noted('Yew logs', 30)),
      slot(16, drop('Iron stone spirit', 40)),
      slot(8, drop('Adamantite stone spirit', 20)),
      slot(14, noted('Pure essence', 600)),
      slot(14, drop('Blood rune', 60)),
      slot(4, noted('Mystic cloth', 3)),
    ],
    tertiary: [
      tertiary(1 / 400, 'Long bone'),
      tertiary(1 / 5000, 'Curved bone'),
      tertiary(1 / 2500, 'Rotten fang'),
      tertiary(1 / 500, "Giant mole's head"),
    ],
  },
  {
    id: 'kalphite-king',
    name: 'Kalphite King',
    always: [drop('Damaged chitin')],
    extraTables: [],
    uniqueRolls: [
      {
        chance: 1 / 42,
        replacesMain: true,
        slots: [
          slot(1, drop('Drygore rapier')),
          slot(1, drop('Off-hand drygore rapier')),
          slot(1, drop('Drygore longsword')),
          slot(1, drop('Off-hand drygore longsword')),
          slot(1, drop('Drygore mace')),
          slot(1, drop('Off-hand drygore mace')),
        ],
      },
    ],
    main: [
      slot(6, drop('Starbloom flower seed', 5)),
      slot(6, drop('Snapdragon seed', 5)),
      slot(8, drop('Snapdragon seed', 10)),
      slot(6, drop('Lantadyme seed', 5)),
      slot(5, drop('Lantadyme seed', 10)),
      slot(6, drop('Dwarf weed seed', 5)),
      slot(5, drop('Dwarf weed seed', 10)),
      slot(6, drop('Torstol seed', 5)),
      slot(4, drop('Magic seed', 5)),
      slot(4, drop('Palm tree seed', 5)),
      slot(4, drop('Yew seed', 10)),
      slot(35, drop('Shark', 50)),
      slot(4, drop('Eternal magic wood spirit', 13, 22)),
      slot(4, drop('Onyx bolts (e)', 200)),
      slot(4, noted('Black dragonhide', 100)),
      slot(5, drop('Super restore (4)', 40)),
      slot(2, noted('Earth talisman', 50)),
      slot(9, drop('Coins', 40000, 80000)),
      slot(5, noted('Inert adrenaline crystal', 10)),
    ],
    rareTable: { chance: 1 / 50, rolls: 3 },
    tertiary: [
      tertiary(1 / 50, 'Perfect chitin'),
      tertiary(10 / 1280, 'Sealed clue scroll (hard)'),
      tertiary(99 / 12800, 'Sealed clue scroll (elite)'),
      tertiary(1 / 12800, 'Sealed clue scroll (master)'),
      tertiary(1 / 900, 'Starved ancient effigy'),
      tertiary(1 / 2000, 'Kalphite claw'),
      tertiary(1 / 500, "Kalphite King's head"),
    ],
  },
  {
    id: 'nex',
    name: 'Nex',
    always: [drop('Big bones')],
    extraTables: [],
    uniqueRolls: [
      {
        chance: 3 / 64,
        replacesMain: true,
        slots: [
          'Torva full helm',
          'Torva platebody',
          'Torva platelegs',
          'Torva boots',
          'Torva gloves',
          'Pernix cowl',
          'Pernix body',
          'Pernix chaps',
          'Pernix boots',
          'Pernix gloves',
          'Virtus mask',
          'Virtus robe top',
          'Virtus robe legs',
          'Virtus boots',
          'Virtus gloves',
          'Virtus wand',
          'Virtus book',
          'Zaryte bow',
        ].map((item) => slot(1, drop(item))),
      },
    ],
    main: [
      slot(11, drop('Avantoe seed', 8), drop('Dwarf weed seed', 8)),
      slot(8, drop('Torstol seed', 5)),
      slot(6, drop('Torstol seed', 12)),
      slot(8, drop('Magic seed', 5)),
      slot(8, drop('Saradomin brew (4)', 10), drop('Super restore (4)', 30)),
      slot(29, drop('Saradomin brew (4)', 30), drop('Super restore (4)', 10)),
      slot(8, noted('Magic logs', 375)),
      slot(16, drop('Phasmatite stone spirit', 20)),
      slot(8, drop('Necrite stone spirit', 20)),
      slot(8, noted('Green dragonhide', 400)),
      slot(8, noted('Uncut dragonstone', 20)),
      slot(10, drop('Onyx bolts (e)', 375)),
    ],
    rareTable: { chance: 1 / 50, rolls: 2 },
    tertiary: [
      tertiary(10 / 1280, 'Sealed clue scroll (hard)'),
      tertiary(594 / 128000, 'Sealed clue scroll (elite)'),
      tertiary(6 / 128000, 'Sealed clue scroll (master)'),
      tertiary(1 / 900, 'Starved ancient effigy'),
      tertiary(1 / 2000, 'Blood-soaked feather'),
      tertiary(1 / 500, "Nex's wings"),
    ],
  },
  {
    id: 'queen-black-dragon',
    name: 'Queen Black Dragon',
    always: [drop('Dragon bones', 8), drop('Royal dragonhide', 5, 7), drop('Royal bolts', 70, 100)],
    extraTables: [
      [
        slot(1, drop('Saradomin brew (2)', 4, 10)),
        slot(1, drop('Super restore (2)', 4, 10)),
        slot(1, drop('Rocktail', 4, 10)),
      ],
    ],
    uniqueRolls: [
      {
        chance: 23 / 253,
        replacesMain: false,
        slots: [
          slot(5, drop('Royal torsion spring')),
          slot(5, drop('Royal sight')),
          slot(5, drop('Royal frame')),
          slot(5, drop('Royal bolt stabiliser')),
          slot(2, drop('Dragonbone upgrade kit')),
          slot(1, drop('Dragon kiteshield')),
        ],
      },
    ],
    main: [
      slot(7, drop('Raw shark', 40)),
      slot(7, drop('Inert adrenaline crystal')),
      slot(5, drop('Coins', 200000)),
      slot(7, drop('Drakolith stone spirit', 25), drop('Orichalcite stone spirit', 25)),
      slot(7, noted('Magic logs', 120)),
      slot(3, drop('Magic seed')),
      slot(8, drop('Torstol seed', 2)),
      slot(8, drop('Lantadyme seed', 6)),
      { weight: 4, drops: [], rareTableRoll: true },
      slot(1, drop('Draconic visage')),
      slot(3, drop('Lantadyme seed')),
      slot(6, drop('Snapdragon seed', 5)),
      slot(5, drop('Uncut dragonstone', 5)),
      slot(5, drop('Phasmatite stone spirit', 15)),
      slot(5, drop('Necrite stone spirit', 15)),
      slot(10, drop('Coins', 150000)),
      slot(9, noted('Yew logs', 300)),
      slot(9, drop('Onyx bolt tips', 30)),
    ],
    tertiary: [
      tertiary(1 / 2500, 'Queen Black Dragon scale'),
      tertiary(1 / 500, "Queen Black Dragon's shackles"),
    ],
  },
  {
    id: 'rasial',
    name: 'Rasial, the First Necromancer',
    always: [],
    extraTables: [],
    uniqueRolls: [
      {
        chance: 1 / 320,
        replacesMain: false,
        slots: [slot(1, drop('Omni guard')), slot(1, drop('Soulbound lantern'))],
      },
      {
        chance: 1 / 128,
        replacesMain: false,
        slots: [
          'Crown of the First Necromancer',
          'Robe top of the First Necromancer',
          'Robe bottom of the First Necromancer',
          'Hand wrap of the First Necromancer',
          'Foot wraps of the First Necromancer',
        ].map((item) => slot(1, drop(item))),
      },
    ],
    main: [
      slot(5 / 3, drop('Torstol seed', 5, 8)),
      slot(5 / 3, drop('Dwarf weed seed', 5, 8)),
      slot(5 / 3, drop('Fellstalk seed', 4, 7)),
      slot(8, drop('Dark animica stone spirit', 80)),
      slot(8, drop('Light animica stone spirit', 80)),
      slot(6, drop('Primal stone spirit', 19)),
      slot(8, drop('Catalytic anima stone', 60)),
      slot(5 / 2, drop('Elder wood spirit', 5, 8)),
      slot(5 / 2, drop('Eternal magic wood spirit', 4, 7)),
      slot(8, noted('Medium spiky orikalkum salvage', 6)),
      slot(6, noted('Large blunt necronium salvage')),
      slot(6, noted('Super necromancy (3)', 10)),
      slot(10, drop('Hydrix bolt tips', 60)),
      slot(10, drop('Onyx bolt tips', 65)),
      slot(10, drop('Onyx dust', 45)),
      slot(6, noted('Raw rocktail', 20)),
      slot(10, noted('Robust memento', 3)),
      slot(8, noted('Powerful memento', 2)),
      slot(6, noted('Crystal key', 20)),
      slot(8, drop('Soul rune', 120)),
    ],
    tertiary: [tertiary(1 / 1500, "Miso's collar"), tertiary(1 / 500, "Rasial's crown")],
  },
  {
    id: 'telos',
    name: 'Telos, the Warden (0% enrage)',
    always: [],
    extraTables: [],
    uniqueRolls: [
      {
        chance: TELOS_UNIQUE_CHANCE,
        replacesMain: true,
        slots: [
          slot(25, drop('Orb of pure anima')),
          slot(25, drop('Orb of volcanic anima')),
          slot(25, drop('Orb of corrupted anima')),
          slot(10, drop('Dormant Seren godbow')),
          slot(10, drop('Dormant Zaros godsword')),
          slot(10, drop('Dormant staff of Sliske')),
          slot(10, drop('Reprisal ability codex')),
        ],
      },
    ],
    main: [
      slot(1, drop('Coins', 225000)),
      slot(1, drop('Light animica stone spirit', 18)),
      slot(1, drop('Black dragonhide', 53)),
      slot(1, drop('Blue dragonhide', 99)),
      slot(0.25, drop('Wine of Saradomin', 13)),
      slot(1, drop('Lantadyme seed', 3)),
      slot(1, drop('Toadflax seed', 3)),
      slot(1, drop('Torstol seed', 3)),
      slot(1, drop('Dwarf weed seed', 3)),
      slot(1, drop('Water talisman', 48)),
      slot(1, drop('Crystal key', 13)),
      slot(1, drop('Crushed nest', 45)),
      slot(1, drop('Luminous energy', 1150)),
      slot(1, drop('Incandescent energy', 900)),
      slot(1, drop('Red dragonhide', 92)),
      slot(1, drop('Tiny blunt rune salvage', 68)),
      slot(1, drop('Raw rocktail', 138)),
      slot(1, drop('Uncut dragonstone', 46)),
      slot(0.25, drop('Uncut onyx')),
      slot(1, drop('Onyx bolt tips', 107)),
      slot(1, drop('Dragon dart tip', 500)),
      slot(1, drop('Dragon arrowheads', 1137)),
      slot(1, drop('Battlestaff', 65)),
      slot(1, drop('Small bladed rune salvage', 30)),
    ],
    tertiary: [tertiary(1 / 500, "Telos' sword"), tertiary(1 / 1400, "Telos' tendril")],
    note: "Estimated: the wiki only lists Telos's common drops as Uncommon or Rare, so these odds are a best guess, with Rare set to a quarter as likely. Quantities use the lowest listed amount. The roughly 1 in 23,000 unique chance uses an unconfirmed player formula for a first kill on Bronze tier, and all three orbs are treated as equally likely.",
  },
  {
    id: 'zamorak',
    name: 'Zamorak, Lord of Chaos (0% enrage)',
    always: [],
    extraTables: [],
    uniqueRolls: [
      {
        chance: 1 / 100,
        replacesMain: false,
        slots: [
          slot(35, drop('Codex of lost knowledge')),
          slot(16.5, drop('Chaos Roar ability codex')),
          slot(9, drop('Vestments of havoc hood')),
          slot(9, drop('Vestments of havoc robe top')),
          slot(9, drop('Vestments of havoc robe bottom')),
          slot(9, drop('Vestments of havoc boots')),
          slot(12.5 / 3, drop("Top of the Last Guardian's bow")),
          slot(12.5 / 3, drop('Divine bowstring')),
          slot(12.5 / 3, drop("Bottom of the Last Guardian's bow")),
        ],
      },
    ],
    commonPoints: 15,
    main: [
      pointSlot(2 / 3, 6, drop('Chaos relic (rare)')),
      pointSlot(1 / 3, 6, drop('Chaos relic (uncommon)', 10, 20)),
      pointSlot(1, 5, drop('Onyx bolt tips', 50, 72)),
      pointSlot(1, 4, drop('Hydrix bolt tips', 40, 60)),
      pointSlot(1, 4, drop('Blood rune', 150, 250)),
      pointSlot(1, 4, drop('Soul rune', 100, 150)),
      pointSlot(1, 4, drop('Small plated orikalkum salvage', 5, 8)),
      pointSlot(1, 3, drop('Huge bladed rune salvage', 5, 8)),
      pointSlot(1, 3, drop('Torstol seed', 1, 2)),
      pointSlot(1, 2, drop('Raw rocktail', 30, 45)),
      pointSlot(1, 1, drop('Dark animica stone spirit', 60, 70)),
      pointSlot(1, 1, drop('Accursed ashes', 10, 12)),
      pointSlot(1, 1, drop('Infernus pyroclasts', 2, 5)),
      pointSlot(1, 1, drop('Dwarf weed seed', 3, 4)),
    ],
    tertiary: [tertiary(1 / 300, 'Jewels of Zamorak'), tertiary(1 / 500, "Zamorak's Edict runes")],
    note: 'Normal mode, solo, without completing the dungeon first: 15 loot points and a 1/100 signature chance. Bow pieces are picked at random rather than in sequence.',
  },
];
