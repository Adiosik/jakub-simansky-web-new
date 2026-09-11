/**
 * GALERIE — fotky, video, art
 * ───────────────────────────
 * Tři samostatné sekce pod jednou položkou v hlavičce. Prázdné pole znamená,
 * že se sekce nevykreslí a zmizí i z rozbalovacího menu — dokud pro ni není
 * obsah, nikam nevede mrtvý odkaz.
 *
 * Fotky se berou ze složky na Google Disku, kam je nahrává Jakub — build je
 * stáhne a zmenší do public/photos/gallery/ a seznam zapíše do
 * `generated/photos.json` (viz apps-script/README.md). Ručně se do toho
 * souboru nesahá, přepíše se při dalším buildu.
 *
 * VIDEA a ART zatím čekají na obsah, viz poznámky u nich.
 */
import type { Lang } from "../language";
import data from "./generated/photos.json";

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

/** Jedna fotka tak, jak ji zapíše scripts/fetch-sheet.mjs. */
type GeneratedPhoto = {
  src: string;
  position: string;
  author?: string;
  /** popis ze záložky „fotky" v Sheetu, sloupce „popis" a „popis en" */
  alt?: string;
  altEn?: string;
};

/**
 * Popis, když v Sheetu žádný není. Jméno se v obou jazycích píše stejně.
 * Anglická verze ho dostane i tehdy, když je jen český popis — odečítač
 * obrazovky by jinak v angličtině předčítal češtinu.
 */
const DEFAULT_ALT = "Jakub Šimanský";

export const FOTKY: Photo[] = (data.photos as GeneratedPhoto[]).map((photo) => ({
  src: photo.src,
  alt: { csCZ: photo.alt ?? DEFAULT_ALT, enUS: photo.altEn ?? DEFAULT_ALT },
  autor: photo.author,
  pozice: photo.position,
}));

/** TODO: doplň videa — stačí ID z adresy youtube.com/watch?v=… a název. */
export const VIDEA: Video[] = [];

/** TODO: doplň výtvarnou práci — kresby, obaly, plakáty. Stejný tvar jako FOTKY. */
export const ART: Photo[] = [];
