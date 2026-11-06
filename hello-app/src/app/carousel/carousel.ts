import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, input, signal } from '@angular/core';
import { Album } from '../albums';

// Keep in sync with the animation duration in carousel.css.
const SLIDE_DURATION_MS = 350;

@Component({
  imports: [DecimalPipe],
  selector: 'app-carousel',
  styleUrl: './carousel.css',
  templateUrl: './carousel.html',
})
export class Carousel implements OnInit {
  readonly heading = input.required<string>();
  readonly albums = input.required<Album[]>();

  protected readonly albumIndex = signal(0);
  protected readonly currentAlbum = computed(() => this.albums()[this.albumIndex()]);
  // Stays null until the first click, so the first cover doesn't slide in on page load.
  protected readonly slideDirection = signal<'forward' | 'backward' | null>(null);
  private slideEndsAt = 0;

  ngOnInit(): void {
    // Load every cover up front so a slide never animates in blank.
    for (const album of this.albums()) {
      new Image().src = album.cover;
    }
  }

  protected previousAlbum(): void {
    const count = this.albums().length;
    this.slideTo((this.albumIndex() - 1 + count) % count, 'backward');
  }

  protected nextAlbum(): void {
    this.slideTo((this.albumIndex() + 1) % this.albums().length, 'forward');
  }

  protected showAlbum(index: number): void {
    this.slideTo(index, index < this.albumIndex() ? 'backward' : 'forward');
  }

  private slideTo(index: number, direction: 'forward' | 'backward'): void {
    // Interrupting a slide would make the incoming cover jump, so let it finish first.
    if (index === this.albumIndex() || Date.now() < this.slideEndsAt) {
      return;
    }
    this.slideEndsAt = Date.now() + SLIDE_DURATION_MS;
    this.slideDirection.set(direction);
    this.albumIndex.set(index);
  }
}
