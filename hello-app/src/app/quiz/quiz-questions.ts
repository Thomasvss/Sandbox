/** Stills link to the Gossip Girl fan wiki. Facts were checked against its episode summaries. */
export interface QuizQuestion {
  image: string;
  imageAlt: string;
  episode: string;
  question: string;
  answer: string;
  wrongAnswers: string[];
  fact: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/2/25/101GossipGirl0049.jpg/revision/latest/scale-to-width-down/640?cb=20150607062042",
    imageAlt: "Serena walking through a crowded train station",
    episode: "Season 1, Pilot",
    question: "Where does Serena arrive when she comes back to Manhattan?",
    answer: "Grand Central",
    wrongAnswers: ["Penn Station", "JFK Airport", "The Palace Hotel"],
    fact: "Her return from boarding school sets the whole series in motion.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/e/e3/101GossipGirl0378.jpg/revision/latest/scale-to-width-down/640?cb=20150609060422",
    imageAlt: "Blair and her friends sitting on wide museum steps",
    episode: "Season 1, Pilot",
    question: "On which famous steps does Blair hold court with her friends?",
    answer: "The Met",
    wrongAnswers: ["The New York Public Library", "Grand Central", "Columbia University"],
    fact: "Jenny hand-delivers party invitations to Blair here before school.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/f/f9/107GossipGirl0015.jpg/revision/latest/scale-to-width-down/640?cb=20150704015742",
    imageAlt: "Chuck sitting alone in a velvet booth at a club",
    episode: "Season 1, Victor Victrola",
    question: "Chuck wants to invest in this club to impress his father. What is it called?",
    answer: "Victrola",
    wrongAnswers: ["Butter", "The Empire", "Rouge"],
    fact: "He hopes the club will finally make Bart proud of him.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/8/82/109GossipGirl0044.jpg/revision/latest/scale-to-width-down/640?cb=20150707074144",
    imageAlt: "Serena and Dan standing on a city street",
    episode: "Season 1, Blair Waldorf Must Pie",
    question: "In a Thanksgiving flashback, what does Dan drop when he helps Serena out of the road?",
    answer: "A pie",
    wrongAnswers: ["A camera", "His phone", "A stack of books"],
    fact: "He had just picked it up from a bakery, and it gets run over.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/1/1d/109GossipGirl0235.jpg/revision/latest/scale-to-width-down/640?cb=20150707074459",
    imageAlt: "Blair cooking in a kitchen with her father",
    episode: "Season 1, Blair Waldorf Must Pie",
    question: "Who is Blair cooking with in this Thanksgiving flashback?",
    answer: "Her father, Harold",
    wrongAnswers: ["Her stepfather, Cyrus", "Rufus Humphrey", "Bart Bass"],
    fact: "This year Harold stays in Paris, which hits Blair hard.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/b/b2/110GossipGirl0965.jpg/revision/latest/scale-to-width-down/640?cb=20150712093853",
    imageAlt: "Couples dancing in a grand ballroom",
    episode: "Season 1, Hi, Society",
    question: "Which formal Upper East Side event is taking place here?",
    answer: "The Cotillion Ball",
    wrongAnswers: ["The Snowflake Ball", "The Masquerade Ball", "Prom"],
    fact: "Serena's grandmother CeCe arrives and changes her plans to skip it.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/2/2b/110GossipGirl1124.jpg/revision/latest/scale-to-width-down/640?cb=20150712094118",
    imageAlt: "Blair and Chuck dancing together at a ball",
    episode: "Season 1, Hi, Society",
    question: "Blair works out who ruined her big night while dancing here. Who was it?",
    answer: "Chuck",
    wrongAnswers: ["Nate", "Serena", "Carter Baizen"],
    fact: "She tells him that whatever they have going is over for good.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/9/99/118GossipGirl0689.jpg/revision/latest/scale-to-width-down/640?cb=20150806071624",
    imageAlt: "A bride and groom standing with an officiant in a garden",
    episode: "Season 1 finale",
    question: "Whose wedding closes out the first season?",
    answer: "Lily and Bart",
    wrongAnswers: ["Rufus and Lily", "Eleanor and Cyrus", "Blair and Nate"],
    fact: "Lily spends the day torn over her feelings for Rufus.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/e/e4/101GossipGirl0393.jpg/revision/latest/scale-to-width-down/640?cb=20150612231051",
    imageAlt: "Jenny looking up in a school uniform outside the museum",
    episode: "Season 1, Pilot",
    question: "Jenny hand-delivers invitations to which party?",
    answer: "Kiss on the Lips",
    wrongAnswers: ["The White Party", "The Snowflake Ball", "The Masquerade"],
    fact: "It's the party that ends up as the Pilot's big scandal.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/9/9b/104GossipGirl1286.jpg/revision/latest/scale-to-width-down/640?cb=20150701045925",
    imageAlt: "Blair posing in a blue dress beside a yellow taxi",
    episode: "Season 1, Bad News Blair",
    question: "Blair is thrilled to be chosen as the face of whose clothing line?",
    answer: "Her mother Eleanor's",
    wrongAnswers: ["Lily's", "Jenny's", "Serena's"],
    fact: "The happiness doesn't last once the spotlight starts to move.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/e/e7/104GossipGirl0704.jpg/revision/latest/scale-to-width-down/640?cb=20150701050246",
    imageAlt: "Printed photos from a fashion shoot laid out on a table",
    episode: "Season 1, Bad News Blair",
    question: "Blair turns up at the shoot to find she's been replaced. By whom?",
    answer: "Serena",
    wrongAnswers: ["Jenny", "Vanessa", "Georgina"],
    fact: "Blair accuses her of trying to steal the spotlight.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/8/80/106GossipGirl0241.jpg/revision/latest/scale-to-width-down/640?cb=20150703061208",
    imageAlt: "Dan walking down a street with Vanessa",
    episode: "Season 1, The Handmaiden's Tale",
    question: "Which childhood friend comes home and tells Dan how she feels?",
    answer: "Vanessa",
    wrongAnswers: ["Georgina", "Jenny", "Kati"],
    fact: "It leaves Dan torn between two girls.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/a/a4/106GossipGirl0653.jpg/revision/latest/scale-to-width-down/640?cb=20150703060757",
    imageAlt: "Serena wearing an ornate silver mask",
    episode: "Season 1, The Handmaiden's Tale",
    question: "What kind of party are the students attending in this episode?",
    answer: "A masked ball",
    wrongAnswers: ["The Cotillion Ball", "A Christmas party", "A wedding reception"],
    fact: "Blair uses the night to send Nate on a scavenger hunt.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/a/a2/110GossipGirl0013.jpg/revision/latest/scale-to-width-down/640?cb=20150712091620",
    imageAlt: "Blair and Serena walking together along a city street",
    episode: "Season 1, Hi, Society",
    question: "Who is Blair excited to take to the Cotillion instead of Nate?",
    answer: "Prince Theodore",
    wrongAnswers: ["Marcus", "Carter Baizen", "Chuck"],
    fact: "The New York Times even plans an article about her night.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/3/38/111GossipGirl0180.jpg/revision/latest/scale-to-width-down/640?cb=20150718082058",
    imageAlt: "Harold and Roman standing together, smiling",
    episode: "Season 1, Roman Holiday",
    question: "Harold comes home for the holidays with an unexpected guest. Who?",
    answer: "His boyfriend, Roman",
    wrongAnswers: ["His brother, Roman", "His business partner, Bart", "An old friend, Rufus"],
    fact: "Blair hatches a plan to get rid of him.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/7/7a/111GossipGirl0459.jpg/revision/latest/scale-to-width-down/640?cb=20150718082327",
    imageAlt: "Two men ice skating at an outdoor rink",
    episode: "Season 1, Roman Holiday",
    question: "Where does Blair's family go skating in this episode?",
    answer: "Central Park",
    wrongAnswers: ["Rockefeller Center", "Bryant Park", "The Palace Hotel"],
    fact: "Harold ends up going to the ER with Roman.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/0/03/115GossipGirl0250.jpg/revision/latest/scale-to-width-down/640?cb=20150725071246",
    imageAlt: "Georgina looking over her shoulder with a sly expression",
    episode: "Season 1, Desperately Seeking Serena",
    question: "Who returns to Manhattan to stir up trouble and expose Serena's past?",
    answer: "Georgina Sparks",
    wrongAnswers: ["Vanessa Abrams", "Carter Baizen", "Poppy Lifton"],
    fact: "She was Serena's former partner in all things bad.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/2/27/115GossipGirl0307.jpg/revision/latest/scale-to-width-down/640?cb=20150725071436",
    imageAlt: "A group on a city street with a big shaggy dog beside a hot dog cart",
    episode: "Season 1, Desperately Seeking Serena",
    question: "Jenny meets a new guy when he bumps into her. What is he doing?",
    answer: "Walking dogs",
    wrongAnswers: ["Selling hot dogs", "Delivering flowers", "Riding a bike"],
    fact: "The dogs knock her hot dog out of her hand, and he gives her his number.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/9/99/115GossipGirl0812.jpg/revision/latest/scale-to-width-down/640?cb=20150725072348",
    imageAlt: "Serena studying at a table covered in papers",
    episode: "Season 1, Desperately Seeking Serena",
    question: "After a wild night with Georgina, what does Serena wake up late for?",
    answer: "The SATs",
    wrongAnswers: ["Her own birthday party", "Blair's fashion show", "A Yale interview"],
    fact: "She can't remember what happened the night before.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/d/d4/114GossipGirl0216.jpg/revision/latest/scale-to-width-down/640?cb=20150725011738",
    imageAlt: "Blair in a purple coat walking with Serena",
    episode: "Season 1, All About My Brother",
    question: "Blair escalates a popularity war through Gossip Girl with whom?",
    answer: "Jenny",
    wrongAnswers: ["Serena", "Vanessa", "Georgina"],
    fact: "The two spread scandalous rumors about each other.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/4/40/202GossipGirl0103.jpg/revision/latest/scale-to-width-down/640?cb=20150830035358",
    imageAlt: "A couple cycling down a tree-lined road",
    episode: "Season 2, Never Been Marcused",
    question: "Blair spends the summer dating royalty. What's his name?",
    answer: "Marcus",
    wrongAnswers: ["Louis", "Theodore", "Carter"],
    fact: "She's determined to become a royal herself.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/3/3e/202GossipGirl0923.jpg/revision/latest/scale-to-width-down/640?cb=20150830040016",
    imageAlt: "Chuck at a party with Catherine beside him",
    episode: "Season 2, Never Been Marcused",
    question: "Chuck crashes Blair's party with Catherine. Who is she to Marcus?",
    answer: "His stepmother",
    wrongAnswers: ["His sister", "His ex-girlfriend", "His aunt"],
    fact: "Chuck has plans for Blair and her new love.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/5/54/203GossipGirl0818.jpg/revision/latest/scale-to-width-down/640?cb=20150831062423",
    imageAlt: "Blair holding a candle in a dark room during a party",
    episode: "Season 2, The Dark Night",
    question: "Why is everyone lighting candles at Blair's party?",
    answer: "A citywide blackout",
    wrongAnswers: ["It's her birthday", "A power cut at the Waldorfs' only", "A candlelit theme"],
    fact: "She tells everyone that the candles mean it'll be okay.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/4/48/204GossipGirl0139.jpg/revision/latest/scale-to-width-down/640?cb=20150831081821",
    imageAlt: "Girls in school uniforms gathered on outdoor steps",
    episode: "Season 2, The Ex-Files",
    question: "Chuck pushes Serena to take over as queen of which school?",
    answer: "Constance Billard",
    wrongAnswers: ["St. Jude's", "Columbia", "NYU"],
    fact: "She turns the idea down.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/a/af/Goodbye_Colombia_4.jpg/revision/latest/scale-to-width-down/640?cb=20101012191614",
    imageAlt: "Blair and Serena walking together on a college campus",
    episode: "Season 4, Goodbye, Columbia",
    question: "Which university are Blair and Serena attending in this episode?",
    answer: "Columbia",
    wrongAnswers: ["Yale", "NYU", "Dartmouth"],
    fact: "Serena even makes the early classes look chic.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/0/03/War_2.jpg/revision/latest/scale-to-width-down/640?cb=20101102185001",
    imageAlt: "Chuck, Blair, Serena and Nate meeting at a restaurant table",
    episode: "Season 4, War at the Roses",
    question: "Nate and Serena sit Chuck and Blair down to sign what?",
    answer: "A peace treaty",
    wrongAnswers: ["A prenup", "A business contract", "A confession"],
    fact: "Anyone who breaks it gets cut out of the friend circle.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/d/d6/Empire_Dorota.jpg/revision/latest/scale-to-width-down/640?cb=20110222184557",
    imageAlt: "Dorota looking startled while holding a magazine",
    episode: "Season 4, Empire of the Son",
    question: "Dorota confronts Blair about what she thinks is an affair with whom?",
    answer: "Dan",
    wrongAnswers: ["Chuck", "Nate", "Louis"],
    fact: "Blair denies it.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/6/60/Tpd.jpg/revision/latest/scale-to-width-down/640?cb=20120221062956",
    imageAlt: "Chuck, Dan and Georgina sitting close together in a crowd",
    episode: "Season 5, The Princess Dowry",
    question: "Who really sent in the video on Blair's wedding day?",
    answer: "Dan",
    wrongAnswers: ["Chuck", "Georgina", "Serena"],
    fact: "Others had been wrongly accused of it.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/2/2d/101GossipGirl1326.jpg/revision/latest/scale-to-width-down/640?cb=20150612232602",
    imageAlt: "A close-up of a phone showing a text message",
    episode: "Series finale",
    question: "After six seasons of anonymous blasts to phones like this one, who turns out to be Gossip Girl?",
    answer: "Dan Humphrey",
    wrongAnswers: ["Georgina Sparks", "Jenny Humphrey", "Blair Waldorf"],
    fact: "He explains that he needed a way into the world of the Upper East Side.",
  },
  {
    image:
      "https://static.wikia.nocookie.net/gossipgirl/images/f/fb/Chair_Getting_Married.jpg/revision/latest/scale-to-width-down/640?cb=20170426175856",
    imageAlt: "Blair and Chuck exchanging vows under stone arches",
    episode: "Series finale",
    question: "Who officiates Blair and Chuck's wedding?",
    answer: "Cyrus",
    wrongAnswers: ["Rufus", "Jack Bass", "Dorota"],
    fact: "The police arrive right after they recite their vows.",
  },
];
