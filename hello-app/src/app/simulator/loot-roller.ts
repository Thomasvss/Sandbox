import { Boss, Drop, RARE_TABLE, SUPER_RARE_TABLE, TableSlot } from './drop-tables';
import { ITEM_PRICES } from './item-prices';

export type LootTier = 'common' | 'rare' | 'unique';

export interface LootItem {
  name: string;
  quantity: number;
  noted: boolean;
  tier: LootTier;
  /** Coin value of the whole stack, or null when the item can't be traded. */
  value: number | null;
}

type Random = () => number;

/** Simulates one kill and returns its loot, best items first. */
export function rollLoot(boss: Boss, random: Random = Math.random): LootItem[] {
  const loot: LootItem[] = [];
  const add = (drops: Drop[], tier: LootTier) => {
    loot.push(...drops.map((drop) => toLootItem(drop, tier, random)));
  };

  add(boss.always, 'common');

  for (const table of boss.extraTables) {
    add(pickSlot(table, random).drops, 'common');
  }

  let skipMain = false;
  for (const uniqueRoll of boss.uniqueRolls) {
    if (random() < uniqueRoll.chance) {
      add(pickSlot(uniqueRoll.slots, random).drops, 'unique');
      skipMain ||= uniqueRoll.replacesMain;
    }
  }

  if (!skipMain && boss.commonPoints) {
    let points = boss.commonPoints;
    while (points > 0) {
      const pointsSlot = pickSlot(boss.main, random);
      add(pointsSlot.drops, 'common');
      points -= pointsSlot.cost ?? 1;
    }
  } else if (!skipMain) {
    const mainSlot = pickSlot(boss.main, random);
    add(mainSlot.drops, 'common');
    if (mainSlot.rareTableRoll) {
      // One of these two rolls is always on the super rare part of the table.
      add(pickSlot(RARE_TABLE, random).drops, 'rare');
      add(pickSlot(SUPER_RARE_TABLE, random).drops, 'rare');
    }
  }

  if (boss.rareTable && random() < boss.rareTable.chance) {
    for (let roll = 0; roll < boss.rareTable.rolls; roll += 1) {
      add(pickSlot(RARE_TABLE, random).drops, 'rare');
    }
  }

  for (const entry of boss.tertiary) {
    if (random() < entry.chance) {
      add([entry.drop], 'rare');
    }
  }

  return stackDuplicates(loot).sort((a, b) => tierRank(a.tier) - tierRank(b.tier));
}

function stackDuplicates(loot: LootItem[]): LootItem[] {
  const stacks = new Map<string, LootItem>();
  for (const item of loot) {
    const key = `${item.name}|${item.noted}|${item.tier}`;
    const stack = stacks.get(key);
    if (stack) {
      stack.quantity += item.quantity;
      stack.value = valueOf(stack.name, stack.quantity);
    } else {
      stacks.set(key, item);
    }
  }
  return [...stacks.values()];
}

function valueOf(name: string, quantity: number): number | null {
  const price = ITEM_PRICES[name];
  return price === undefined ? null : price * quantity;
}

function pickSlot(slots: TableSlot[], random: Random): TableSlot {
  const total = slots.reduce((sum, slot) => sum + slot.weight, 0);
  let remaining = random() * total;
  for (const slot of slots) {
    remaining -= slot.weight;
    if (remaining < 0) {
      return slot;
    }
  }
  return slots[slots.length - 1];
}

function toLootItem(drop: Drop, tier: LootTier, random: Random): LootItem {
  const quantity = drop.min + Math.floor(random() * (drop.max - drop.min + 1));
  return {
    name: drop.item,
    quantity,
    noted: drop.noted,
    tier,
    value: valueOf(drop.item, quantity),
  };
}

function tierRank(tier: LootTier): number {
  return tier === 'unique' ? 0 : tier === 'rare' ? 1 : 2;
}
