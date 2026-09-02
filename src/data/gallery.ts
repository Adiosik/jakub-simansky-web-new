/**
 * GALERIE — fotky, video, art
 * ───────────────────────────
 * Tři samostatné sekce pod jednou položkou v hlavičce. Prázdné pole znamená,
 * že se sekce nevykreslí a zmizí i z rozbalovacího menu — dokud pro ni není
 * obsah, nikam nevede mrtvý odkaz.
 *
 * ⚠️  TODO: ve FOTKY jsou zatím dvě fotky, které na stránce už jinde jsou
 *     (kresba hlavy z hero a portrét od doučování). Je to jen výplň, aby
 *     sekce nebyla prázdná — nahraď je fotkami z koncertů a ze zákulisí.
 *     VIDEA a ART čekají na obsah, viz poznámky u nich.
 */
import type { Lang } from "../language";

export type Photo = {
  /** cesta od kořene webu; soubory patří do public/photos/ */
  src: string;
  /** popis pro odečítače obrazovky, dvojjazyčně */
  alt: Record<Lang, string>;
};

export type Video = {
  /** ID videa na YouTube — ta část za `v=` v adrese */
  youtubeId: string;
  /** název, ukáže se pod přehrávačem */
  title: string;
};

export const FOTKY: Photo[] = [
  {
    src: "/photos/profil.png",
    alt: {
      csCZ: "Jakub Šimanský s banjem, vedle opřené dvě kytary",
      enUS: "Jakub Šimanský holding a banjo, two guitars leaning against the wall beside him",
    },
  },
  {
    src: "/photos/hlava.png",
    alt: {
      csCZ: "Kresba hlavy — obal alba Bez Niesnera",
      enUS: "Line drawing of a head — cover of the album Bez Niesnera",
    },
  },
];

/** TODO: doplň videa — stačí ID z adresy youtube.com/watch?v=… a název. */
export const VIDEA: Video[] = [];

/** TODO: doplň výtvarnou práci — kresby, obaly, plakáty. Stejný tvar jako FOTKY. */
export const ART: Photo[] = [];
