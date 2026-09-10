/**
 * GALERIE — fotky, video, art
 * ───────────────────────────
 * Tři samostatné sekce pod jednou položkou v hlavičce. Prázdné pole znamená,
 * že se sekce nevykreslí a zmizí i z rozbalovacího menu — dokud pro ni není
 * obsah, nikam nevede mrtvý odkaz.
 *
 * VIDEA a ART zatím čekají na obsah, viz poznámky u nich.
 */
import type { Lang } from "../language";

export type Photo = {
  /** cesta od kořene webu; soubory patří do public/photos/ */
  src: string;
  /** popis pro odečítače obrazovky, dvojjazyčně */
  alt: Record<Lang, string>;
  /** autor fotky — ukáže se pod ní. U cizích fotek ho uvádět vždycky. */
  autor?: string;
  /**
   * Kam má mířit ořez. Galerie ukazuje všechno ve stejných čtvercích, takže
   * z fotky na šířku se kus odřízne — a bez tohohle by šel střed pryč
   * i s obličejem, když je u kraje. Hodnota pro CSS `object-position`,
   * první číslo je vodorovně („30% 50%" = třetina zleva, na výšku uprostřed).
   */
  pozice?: string;
};

export type Video = {
  /** ID videa na YouTube — ta část za `v=` v adrese */
  youtubeId: string;
  /** název, ukáže se pod přehrávačem */
  title: string;
};

export const FOTKY: Photo[] = [
  {
    src: "/photos/galerie/simansky-ozimanicova-1.webp",
    alt: {
      csCZ: "Jakub Šimanský z profilu před rozbrázděnou skalní stěnou",
      enUS: "Jakub Šimanský in profile in front of a ridged rock wall",
    },
    autor: "Kristína Ozimaničová",
    // obličej je v levé třetině
    pozice: "30% 50%",
  },
  {
    src: "/photos/galerie/simansky-ozimanicova-2.webp",
    alt: {
      csCZ: "Jakub Šimanský se zavřenýma očima, v kostkované šále, před skalní stěnou",
      enUS: "Jakub Šimanský with his eyes closed, in a checked scarf, in front of a rock wall",
    },
    autor: "Kristína Ozimaničová",
    // obličej je v pravé třetině
    pozice: "70% 50%",
  },
  {
    src: "/photos/profil.png",
    alt: {
      csCZ: "Jakub Šimanský s banjem, vedle opřené dvě kytary",
      enUS: "Jakub Šimanský holding a banjo, two guitars leaning against the wall beside him",
    },
  },
  {
    src: "/photos/galerie/simansky-vrbaak.webp",
    alt: {
      csCZ: "Černobílá fotka: Jakub Šimanský opřený o betonovou zeď s graffiti, v ruce pouzdro od kytary",
      enUS: "Black-and-white photo: Jakub Šimanský leaning against a concrete wall with graffiti, holding a guitar case",
    },
    autor: "Vrbaak",
    // na výšku a Jakub stojí dole — horní část se zdí a okny se odřízne
    pozice: "50% 100%",
  },
  {
    src: "/photos/galerie/simansky-ozimanicova-4.webp",
    alt: {
      csCZ: "Jakub Šimanský v modré čepici hledí vzhůru, ruce sepjaté, v lese",
      enUS: "Jakub Šimanský in a blue beanie looking up, hands clasped, in a forest",
    },
    autor: "Kristína Ozimaničová",
    // obličej i sepjaté ruce jsou vlevo
    pozice: "20% 50%",
  },
  {
    src: "/photos/galerie/simansky-galia.webp",
    alt: {
      csCZ: "Jakub Šimanský v modré košili před keřem s červeným podzimním listím",
      enUS: "Jakub Šimanský in a blue shirt in front of a bush with red autumn leaves",
    },
    autor: "Libor Galia",
    // na výšku — ořez drží obličej a horní polovinu postavy
    pozice: "50% 15%",
  },
];

/** TODO: doplň videa — stačí ID z adresy youtube.com/watch?v=… a název. */
export const VIDEA: Video[] = [];

/** TODO: doplň výtvarnou práci — kresby, obaly, plakáty. Stejný tvar jako FOTKY. */
export const ART: Photo[] = [];
