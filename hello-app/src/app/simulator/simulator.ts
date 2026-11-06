import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { BOSSES } from './drop-tables';
import { PRICES_DATE } from './item-prices';
import { LootItem, rollLoot } from './loot-roller';

const ICONS: [RegExp, string][] = [
  [/coins/i, '🪙'],
  [/orb of|relic|pheromone|jewels/i, '🔮'],
  [/codex|edict/i, '📘'],
  [/seed/i, '🌱'],
  [/bones?\b|chitin|claw|skull/i, '🦴'],
  [/clue|journal/i, '📜'],
  [/key/i, '🗝️'],
  [/spirit|anima|memento|talisman/i, '🔮'],
  [/rune$|essence/i, '✴️'],
  [/bolt|arrow|dart|bow/i, '🏹'],
  [/logs|plank|battlestaff/i, '🪵'],
  [/brew|restore|potion|necromancy|wine/i, '🧪'],
  [/shark|rocktail|lobster/i, '🐟'],
  [/uncut|onyx|hydrix|crystal|glass/i, '💎'],
  [/hide|skin|cloth|robe|wrap/i, '🧵'],
  [/salvage|spring|sight|frame|stabiliser/i, '⚙️'],
  [/sword|rapier|longsword|mace|spear|guard/i, '⚔️'],
  [/helm|crown|cowl|mask|platebody|platelegs|gloves|boots|body|chaps|shield/i, '🛡️'],
];

@Component({
  imports: [DecimalPipe],
  selector: 'app-simulator',
  styleUrl: './simulator.css',
  templateUrl: './simulator.html',
})
export class Simulator {
  protected readonly bosses = BOSSES;
  protected readonly pricesDate = PRICES_DATE;
  protected readonly bossId = signal(BOSSES[0].id);
  protected readonly boss = computed(
    () => BOSSES.find((boss) => boss.id === this.bossId()) ?? BOSSES[0],
  );
  protected readonly loot = signal<LootItem[]>([]);
  protected readonly kills = signal(0);
  protected readonly uniques = signal(0);
  protected readonly totalValue = computed(() =>
    this.loot().reduce((total, item) => total + (item.value ?? 0), 0),
  );
  protected readonly gotUnique = computed(() => this.loot().some((item) => item.tier === 'unique'));

  protected selectBoss(id: string): void {
    this.bossId.set(id);
    this.loot.set([]);
    this.kills.set(0);
    this.uniques.set(0);
  }

  protected simulate(): void {
    const loot = rollLoot(this.boss());
    this.loot.set(loot);
    this.kills.update((kills) => kills + 1);
    this.uniques.update(
      (uniques) => uniques + loot.filter((item) => item.tier === 'unique').length,
    );
  }

  protected iconFor(name: string): string {
    return ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? '📦';
  }
}
