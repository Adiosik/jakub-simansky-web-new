/**
 * OHLASY (reference)
 * ──────────────────
 * Co o Jakubovi napsala a odvysílala média. Sesbíráno z odkazů na
 * linktr.ee/jakubsimansky a dohledáno k nim.
 *
 * ⚠️  CITACE SE NEVYMÝŠLEJÍ. Do `quote` patří jen to, co je doslova ověřené
 *     proti originálu. Kde si zněním nejsme jistí, položka `quote` nemá —
 *     ukáže se pak jen jako odkaz na článek, což je pořád pravdivé.
 *
 * Přidání ohlasu = přidej objekt do pole REFERENCES.
 *  - source … médium, ve kterém to vyšlo
 *  - title  … název článku nebo pořadu, doslova. V soupisu vidět není (řádek
 *             nese název média), ale jde do aria-label odkazu, aby šly od sebe
 *             rozeznat odkazy na totéž médium. U stránek jmenovaných jen
 *             „Jakub Šimanský" ho nech být, nic by nepřidal.
 *  - author … kdo to psal nebo moderoval — nepovinné
 *  - kind   … "review" | "interview" | "media", řídí popisek u odkazu
 *  - orig   … jazyk originálu, ukazuje se jako značka ("EN", "SK", …)
 *  - date   … ISO datum vydání, formátuje se podle jazyka webu — nepovinné
 *  - quote  … vytažená citace; anglická je originál, česká překlad — nepovinné
 */
import type { Lang } from "../language";

export type Reference = {
  source: string;
  title?: string;
  author?: string;
  kind: "review" | "interview" | "media";
  orig: string;
  date?: string;
  url: string;
  quote?: Record<Lang, string>;
};

export const REFERENCES: Reference[] = [
  {
    source: "Nowe Idzie Od Morza",
    title: "Fantastic 4 (March 21st)",
    author: "Jakub Knera",
    kind: "review",
    orig: "EN",
    date: "2025-03-21",
    url: "https://noweidzieodmorza.com/16323-fantastic-4-march-21st/",
    // Ověřená citace, kterou tu Daniel zatím nechce vypsanou:
    //   „Zvuk jeho kytary má melancholickou příchuť, a přitom pevnost,
    //    lyričnost a transovou hloubku."
    //   (originál: „The sound of his guitar has a melancholic flavor but, at
    //    the same time, firmness, lyricism, and trance-like depth.")
  },
  {
    source: "Kapitál noviny",
    title: "Moderný svet je trash",
    author: "Michael Papcun",
    kind: "review",
    orig: "SK",
    date: "2025-04-16",
    url: "https://kapital-noviny.sk/simansky-what-do-you-mean-by-that/",
    // TODO: kandidáti na citaci, ale ověř je proti originálu, než je nasadíš —
    // došly přes strojový převod stránky a slovenština v nich může být zkomolená:
    //   „Zvukové plochy vrství do až mantrických motívov."
    //   „Najintenzívnejší je vo svojich najtichších momentoch, kde sa noty predlžujú."
  },
  {
    source: "Kulturní magazín UNI",
    title: "JAKUB ŠIMANSKÝ: What Do You Mean By That?",
    author: "Tomáš S. Polívka",
    kind: "review",
    orig: "CZ",
    // v tiráži je uvedený jen měsíc, den je dopsaný jen kvůli formátu data
    date: "2025-05-01",
    url: "https://www.magazinuni.cz/hudba/jakub-simansky-what-do-you-mean-by-that/",
    // TODO: kandidáti na citaci, ověř znění proti originálu, než je nasadíš:
    //   „Kolekce deseti instrumentálních kusů tak zní vítaně pestře."
    //   „Hudba vás ponese sama."
  },
  {
    source: "ČRo Vltava — ArtCafé",
    title: "Nové album a hudební experimenty Jakuba Šimanského posouvají hranice zvuku a emocí",
    kind: "interview",
    orig: "CZ",
    url: "https://www.mujrozhlas.cz/artcafe/kytarista-jakub-simansky-predstavuje-zbrusu-nove-album-what-do-you-mean",
  },
  {
    source: "Full Moon",
    kind: "media",
    orig: "CZ",
    url: "https://www.fullmoonzine.cz/interpret/jakub-simansky",
  },
  {
    source: "Rate Your Music",
    kind: "review",
    orig: "EN",
    url: "https://rateyourmusic.com/artist/jakub-simansky",
  },
];
