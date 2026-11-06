import { Component } from '@angular/core';
import { COUNTRY_ALBUMS, POP_ALBUMS, RAP_ALBUMS, ROCK_ALBUMS } from '../albums';
import { Carousel } from '../carousel/carousel';

@Component({
  imports: [Carousel],
  selector: 'app-music',
  styleUrl: './music.css',
  templateUrl: './music.html',
})
export class Music {
  protected readonly rapAlbums = RAP_ALBUMS;
  protected readonly popAlbums = POP_ALBUMS;
  protected readonly rockAlbums = ROCK_ALBUMS;
  protected readonly countryAlbums = COUNTRY_ALBUMS;
}
