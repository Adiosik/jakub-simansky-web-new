/**
 * DISKOGRAFIE
 * ───────────
 * Přidání nového alba = přidej objekt do pole ALBUMS níže.
 * Povinné je jen: title, year, label, tracks, sequence.
 *
 * Obal (logo alba):
 *   - nahraj obrázek do složky  public/covers/  (např. public/covers/jako-doma.jpg)
 *   - a nastav  cover: "/covers/jako-doma.jpg"
 *   - když cover vynecháš, vygeneruje se automaticky grafický motiv
 *
 * Skladby (tracks):
 *   - libovolně dlouhý seznam názvů, klidně přidávej řádky
 *
 * sequence:
 *   - frekvence tónů (Hz) pro ukázkový web-audio přehrávač (arpeggio)
 *   - není to reálná nahrávka, jen „znělka" daného alba
 */

import type { Lang } from "../language";

export type AlbumLinks = {
  bandcamp?: string;
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
};

export type Album = {
  /** Název alba */
  title: string;
  /** Interpret / projekt — u sólových desek nech prázdné */
  artist?: string;
  /** Rok vydání */
  year: number;
  /** Vydavatelství */
  label: string;
  /** Krátký popisek alba pro kartu v sekci Desky (dvojjazyčně) — nepovinné */
  description?: Record<Lang, string>;
  /** Seznam skladeb (klidně přidávej další řádky) */
  tracks: string[];
  /** Cesta k obalu v /public, např. "/covers/jako-doma.jpg" — nepovinné */
  cover?: string;
  /** Odkazy na poslech — nepovinné */
  links?: AlbumLinks;
  /** Frekvence tónů (Hz) pro ukázkové arpeggio přehrávače */
  sequence: number[];
};

// Řazeno chronologicky od nejnovějšího — první v pořadí je výchozí pro přehrání.
export const ALBUMS: Album[] = [
  {
    title: "What Do You Mean By That",
    year: 2025,
    label: "—", // TODO: doplň vydavatelství
    description: {
      csCZ: "V pořadí již třetí album je opět pozvánkou na cestu do světa bez jasných hranic hudebního žánru, kde se různé styly a experimentální přístupy protínají s akustickými nástroji.\n\nJedná se o výběr skladeb, které Jakub dokončil z nashromážděných záznamů v mobilních telefonech za posledních 8 let, které nakonec nebyly použity v projektu Šimanský Niesner. Díky tomu na posluchače opět čeká pestrá směs rytmů, nestandardních ladění, nečekaných kombinací nebo kompozic. Každá skladba je tak malým příběhem sestaveným z minulosti, za kterým nestojí žádné jiné poselství, než vytvořit hudební svět, ve kterém se můžete nechat unášet samotnou hudbou.\n\nAlbum nahrával Jakub sám postupně v průběhu roku 2024 v Brně v pronajaté kanceláři, kde celou dobu také bydlel. O zvuk se postaral Julian Werl, rakouský producent, zvukový inženýr a hudebník žijící v Brně, známý také jako Nichi Mlebom. Obálku vytvořil Jaroslav Exner. Album je vydáno vlastním nákladem.",
      enUS: "Jakub's third album is once again an invitation into a world with no clear genre boundaries, where different styles and experimental approaches meet acoustic instruments.\n\nIt is a selection of pieces he finished from recordings gathered on mobile phones over the last 8 years — material that ultimately wasn't used in the Šimanský Niesner project. So once again listeners get a colourful mix of rhythms, unusual tunings and unexpected combinations. Each track is a little story assembled from the past, with no message behind it other than to build a musical world you can let yourself drift through.\n\nJakub recorded the album himself over the course of 2024 in a rented office in Brno, where he also lived the whole time. Sound was handled by Julian Werl, an Austrian producer, sound engineer and musician based in Brno, also known as Nichi Mlebom. The cover was made by Jaroslav Exner. Self-released.",
    },
    tracks: [
      "Resurrection",
      "The Knife Thrower",
      "Devshirme",
      "Get on the Horses",
      "Golden Jelzin",
      "Cannoneer",
      "To Philip",
      "The Master Knows",
      "Stabilitas Loci",
      "Cocktail Menu",
    ],
    cover: "/covers/what-do-you-mean-by-that.png",
    sequence: [87.31, 130.81, 174.61, 261.63, 220, 174.61, 130.81, 98],
  },
  {
    title: "Face to Face Against American Primitivism in Eastern Europe, vol. 2",
    year: 2019,
    label: "Full Moon Forum",
    description: {
      csCZ: "„V téhle nové vlně (už po Danielu Bachmanovi) kytaristů amerického primitivismu patří Šimanský k mým oblíbeným. Je věrný takomské škole a dává staromódní blues a americké rágy jako každý jiný kytarista, kterého už máš rád. Šimanský k tomu jen přidává svůj východoevropský pohled — slyšíš to hned v úvodní skladbě Bulgaria.\n\nCelkově to zní, jako by Šimanský přivolával ducha Jacka Rose. Je tu zlověstné podání Sundogs, prosvítají Black Pearls from the River a samozřejmě staré blues od Dr. Ragtime.\n\nAlbum uzavírá epický ketaminový trip K-Hole Forever — možná název, který vyčnívá nejvíc…\"\n— Marcus Obst (dyingforbadmusic.com)",
      enUS: "“In this new wave (already post Daniel Bachman) of American primitive guitarists, Šimanský is one of my favorites. He's true to the Takoma school and delivers the old-school blues and American ragas like every other guitarist that you already love. Šimanský just adds his Eastern European view to it and you can hear it right in the opening track Bulgaria.\n\nOverall, it sounds like Šimanský summons the ghost of Jack Rose. There is a sinister rendition of Sundogs, Black Pearls from the River shine through and of course the old-time blues by Dr. Ragtime.\n\nThe album closes with the epic ketamine trip K-Hole Forever, which is maybe the title that stands out the most…”\n— Marcus Obst (dyingforbadmusic.com)",
    },
    tracks: [
      "Bulgarian",
      "Walking Around The Red-Blue Cockoo",
      "On The Ledge",
      "Dog Star",
      "Enfant Terrible Death Ride",
      "The Black Rose The White Masks",
      "K-Hole Forever",
    ],
    cover: "/covers/face-to-face-vol2.png",
    sequence: [65.41, 130.81, 196, 261.63, 196, 155.56, 130.81, 98],
  },
  {
    title: "Face to Face Against American Primitivism in Eastern Europe, vol. 1",
    year: 2016,
    label: "Tape-ty / STD",
    description: {
      csCZ: "Jak zní šepot travnatých kopců uprostřed průmyslové džungle Přerova? Jak voní výlety za město k ohni? První mladé víno na Hané od kluka, co propadl prstové hře někde mezi výrobou pásků. Jsou tu mladá léta uprostřed zralého obilí a rachot kombajnů, nová, ale jistá dospělost a spousta dřiny. Ze všeho nejvíc je tu ale HUDBA. Výbuchy jisker v kouři zevnitř ven. Možná znáš Jakuba jako bubeníka kapel Unna a Baalzac, ale jeho sólová poloha tě vrací do minulosti kytarové hudby, kde hraje na prvním místě srdce.\n— slova kapely Mava",
      enUS: "How does the whisper of grassy hills in the middle of the industrial jungle of Přerov sound? How do the trips out of town to meet the fire smell? The first new wine in Haná from a guy who fell for the fingerpicking guitar between the belt manufacturing. There are young summers amidst ripe grain and the clatter of combines, a new but sure adulthood and a lot of hard work. Most of all, though, there is the MUSIC. Explosions of sparks in the smoke, from the inside out. You may know Jakub as the drummer of Unna and Baalzac, but his solo work takes you back to the past of guitar music, where the heart plays first of all.\n— words by Mava",
    },
    tracks: [
      "Dan B. Raag",
      "The First School Day of Ruby Bridges",
      "The Crippled Step",
      "The Wind Player",
      "Machines Go to Fields",
      "The Revolt of the Dyke Brigade",
      "Variations on J. F.",
      "Slow Awakening in Orchards",
      "The Picnic on a Hill",
      "The Red Pony",
      "In the Sacred Groves of Barbaricum",
    ],
    cover: "/covers/face-to-face-vol1.png",
    sequence: [73.42, 146.83, 220, 293.66, 220, 196, 146.83, 110],
  },
];
