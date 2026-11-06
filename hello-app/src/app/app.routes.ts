import { Routes } from '@angular/router';
import { Game } from './game/game';
import { Heists } from './heists/heists';
import { Music } from './music/music';
import { OrbPop } from './orb-pop/orb-pop';
import { Quiz } from './quiz/quiz';
import { Simulator } from './simulator/simulator';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'music' },
  { path: 'music', component: Music, title: 'Music' },
  { path: 'game', component: Game, title: 'Game' },
  { path: 'simulator', component: Simulator, title: 'Simulator' },
  { path: 'heists', component: Heists, title: 'Heists' },
  { path: 'orb-pop', component: OrbPop, title: 'Orb Pop' },
  { path: 'quiz', component: Quiz, title: 'Gossip Girl Quiz' },
  { path: '**', redirectTo: 'music' },
];
