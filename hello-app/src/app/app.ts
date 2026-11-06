import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  // index.html sets the starting theme before the app loads.
  protected readonly isDark = signal(document.documentElement.dataset['theme'] === 'dark');

  protected toggleTheme(event: MouseEvent): void {
    const theme = this.isDark() ? 'light' : 'dark';
    this.isDark.set(theme === 'dark');
    document.documentElement.dataset['theme'] = theme;

    try {
      localStorage.setItem('theme', theme);
    } catch {
      // The choice just won't survive a reload if storage is unavailable.
    }

    // After a mouse click, release focus so Space goes to the game rather than this button.
    if (event.detail > 0) {
      (event.currentTarget as HTMLElement).blur();
    }
  }
}
