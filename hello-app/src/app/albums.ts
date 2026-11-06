export interface Album {
  title: string;
  artist: string;
  year: number;
  /** ChartMasters estimate of worldwide equivalent album units (sales, singles and streams). */
  estimatedUnits: number;
  cover: string;
}

const COVER_BASE = 'https://is1-ssl.mzstatic.com/image/thumb';

export const RAP_ALBUMS: Album[] = [
  {
    title: 'Take Care',
    artist: 'Drake',
    year: 2011,
    estimatedUnits: 17_747_000,
    cover: `${COVER_BASE}/Music124/v4/d2/53/62/d2536245-b94c-b3fd-7168-9512f655f6d4/00602527899091.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'Nothing Was the Same',
    artist: 'Drake',
    year: 2013,
    estimatedUnits: 12_004_000,
    cover: `${COVER_BASE}/Music118/v4/5f/30/6d/5f306d67-bff8-2595-9d41-51be895d3208/00602537542321.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'Views',
    artist: 'Drake',
    year: 2016,
    estimatedUnits: 22_350_000,
    cover: `${COVER_BASE}/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'Scorpion',
    artist: 'Drake',
    year: 2018,
    estimatedUnits: 18_752_000,
    cover: `${COVER_BASE}/Music115/v4/bb/6d/8f/bb6d8f67-6d04-10b5-dd62-eb5809ac54fc/00602567879152.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'Certified Lover Boy',
    artist: 'Drake',
    year: 2021,
    estimatedUnits: 10_658_000,
    cover: `${COVER_BASE}/Music125/v4/cb/6b/5f/cb6b5fc3-8d35-908a-18e6-6f8eda46ce11/21UM1IM07521.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'For All The Dogs',
    artist: 'Drake',
    year: 2023,
    estimatedUnits: 6_952_000,
    cover: `${COVER_BASE}/Music126/v4/fa/9e/e6/fa9ee672-0880-2b5b-a69d-981e8fcb807e/23UM1IM09863.rgb.jpg/600x600bb.jpg`,
  },
];

export const POP_ALBUMS: Album[] = [
  {
    title: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
    artist: 'Billie Eilish',
    year: 2019,
    estimatedUnits: 21_944_000,
    cover: `${COVER_BASE}/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'After Hours',
    artist: 'The Weeknd',
    year: 2020,
    estimatedUnits: 23_054_000,
    cover: `${COVER_BASE}/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'SOUR',
    artist: 'Olivia Rodrigo',
    year: 2021,
    estimatedUnits: 25_184_000,
    cover: `${COVER_BASE}/Music115/v4/02/ed/8c/02ed8cab-c089-2fdd-7ce6-ab334a9a4e19/21UMGIM26093.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: "Harry's House",
    artist: 'Harry Styles',
    year: 2022,
    estimatedUnits: 14_385_000,
    cover: `${COVER_BASE}/Music126/v4/2a/19/fb/2a19fb85-2f70-9e44-f2a9-82abe679b88e/886449990061.jpg/600x600bb.jpg`,
  },
  {
    title: 'Midnights',
    artist: 'Taylor Swift',
    year: 2022,
    estimatedUnits: 21_064_000,
    cover: `${COVER_BASE}/Music112/v4/11/33/de/1133deee-070e-98d3-950a-2269807b074e/22UM1IM24801.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: "Short n' Sweet",
    artist: 'Sabrina Carpenter',
    year: 2024,
    estimatedUnits: 14_901_000,
    cover: `${COVER_BASE}/Music221/v4/a1/1c/ca/a11ccab6-7d4c-e041-d028-998bcebeb709/24UMGIM61704.rgb.jpg/600x600bb.jpg`,
  },
];

export const ROCK_ALBUMS: Album[] = [
  {
    title: 'Hotel California',
    artist: 'Eagles',
    year: 1976,
    estimatedUnits: 74_723_000,
    cover: `${COVER_BASE}/Music115/v4/88/16/2c/88162c3d-46db-8321-61f3-3a47404cfe76/075596050920.jpg/600x600bb.jpg`,
  },
  {
    title: 'Rumours',
    artist: 'Fleetwood Mac',
    year: 1977,
    estimatedUnits: 73_188_000,
    cover: `${COVER_BASE}/Music124/v4/4d/13/ba/4d13bac3-d3d5-7581-2c74-034219eadf2b/081227970949.jpg/600x600bb.jpg`,
  },
  {
    title: 'Back in Black',
    artist: 'AC/DC',
    year: 1980,
    estimatedUnits: 66_879_000,
    cover: `${COVER_BASE}/Music115/v4/1e/14/58/1e145814-281a-58e0-3ab1-145f5d1af421/886443673441.jpg/600x600bb.jpg`,
  },
  {
    title: 'The Joshua Tree',
    artist: 'U2',
    year: 1987,
    estimatedUnits: 51_904_000,
    cover: `${COVER_BASE}/Music115/v4/8f/e2/c3/8fe2c384-f6cb-9af7-371d-2b6a9b204e59/17UMGIM79292.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'Metallica (The Black Album)',
    artist: 'Metallica',
    year: 1991,
    estimatedUnits: 55_487_000,
    cover: `${COVER_BASE}/Music125/v4/9e/80/1b/9e801b06-67fa-0990-2d15-85480ad3cd46/850007452025.png/600x600bb.jpg`,
  },
  {
    title: 'Hybrid Theory',
    artist: 'Linkin Park',
    year: 2000,
    estimatedUnits: 43_372_000,
    cover: `${COVER_BASE}/Features115/v4/f0/31/b2/f031b2b2-bcf0-6102-426f-e0b2c7437415/dj.vrgpwamf.jpg/600x600bb.jpg`,
  },
];

export const COUNTRY_ALBUMS: Album[] = [
  {
    title: 'The Woman in Me',
    artist: 'Shania Twain',
    year: 1995,
    estimatedUnits: 19_159_000,
    cover: `${COVER_BASE}/Music114/v4/92/92/94/92929471-71e2-4ff7-131e-2ad7693c4aaf/06UMGIM15740.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'Come On Over',
    artist: 'Shania Twain',
    year: 1997,
    estimatedUnits: 48_368_000,
    cover: `${COVER_BASE}/Music122/v4/1e/2f/98/1e2f98c2-3fa6-9601-9825-6a6d19a99cf3/06UMGIM07033.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'Some Hearts',
    artist: 'Carrie Underwood',
    year: 2005,
    estimatedUnits: 12_669_000,
    cover: `${COVER_BASE}/Music114/v4/e7/14/80/e714805d-8aff-9e66-b25f-c75e5683a130/mzi.omppwbeg.jpg/600x600bb.jpg`,
  },
  {
    title: 'Fearless',
    artist: 'Taylor Swift',
    year: 2008,
    estimatedUnits: 29_954_000,
    cover: `${COVER_BASE}/Music221/v4/cb/6e/a7/cb6ea70a-6cb8-89a0-4da7-91e2d04a7bba/08PNDIM05386.rgb.jpg/600x600bb.jpg`,
  },
  {
    title: 'Dangerous: The Double Album',
    artist: 'Morgan Wallen',
    year: 2021,
    estimatedUnits: 14_568_000,
    cover: `${COVER_BASE}/Music221/v4/68/05/ab/6805abb2-10d1-35cb-aa84-71386b285b7d/00602435514642_Cover.jpg/600x600bb.jpg`,
  },
  {
    title: 'One Thing At A Time',
    artist: 'Morgan Wallen',
    year: 2023,
    estimatedUnits: 14_225_000,
    cover: `${COVER_BASE}/Music211/v4/db/9f/8e/db9f8e0c-d947-b7fd-cc93-a832c81ce4ee/00602455241252_Cover.jpg/600x600bb.jpg`,
  },
];
