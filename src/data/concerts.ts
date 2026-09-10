/**
 * KONCERTY
 * ────────
 * Obsah spravuje Jakub v Google Sheetu; při buildu ho stáhne GitHub Action
 * do `generated/koncerty.json` (viz apps-script/README.md). Ten soubor je
 * commitnutý schválně — je zároveň zálohou, takže když stahování selže,
 * web vydeployuje poslední známá data místo prázdné sekce.
 *
 * Ručně se do něj psát dá, ale příští build to přepíše.
 */
import data from "./generated/koncerty.json";

export type Gig = {
  /** Datum ve formátu RRRR-MM-DD */
  date: string;
  /** Město */
  city: string;
  /** Místo konání (klub, sál…) */
  venue: string;
  /** S kým hraje. Prázdné = sólo, štítek si doplní web sám. */
  band?: string;
};

/** Kolik termínů se na stránce ukáže. */
export const MAX_KONCERTU = 3;

/**
 * Po kolika dnech přestaneme datům věřit.
 *
 * Když stahování ze Sheetu delší dobu selhává, web jede z commitnuté zálohy.
 * Proběhlé termíny z ní vypadnou samy, ale zrušený koncert v budoucnu ne —
 * ten by web dál nabízel, i kdyby ho Jakub z tabulky dávno smazal. Po téhle
 * lhůtě proto raději neukážeme nic; sekce má pro ten případ vlastní text,
 * který odkáže na sociální sítě.
 *
 * Tři týdny jsou kompromis: při denním stahování se na tuhle mez nedosáhne
 * ani omylem, a zrušený termín na webu nevydrží měsíc.
 */
export const MAX_STARI_DNI = 21;

export const CONCERTS: Gig[] = data.koncerty;

/** Kdy Apps Script naposledy přečetl tabulku. */
export const VYGENEROVANO = data.vygenerovano;

/**
 * Dnešní datum jako RRRR-MM-DD podle **místního** času, ne UTC.
 * `toISOString()` by v Česku po 22:00 vrátil už zítřek a koncert konaný dnes
 * by ze stránky zmizel o den dřív.
 */
function dnesniDatum(ted: Date) {
  const dvojmisti = (n: number) => String(n).padStart(2, "0");
  return `${ted.getFullYear()}-${dvojmisti(ted.getMonth() + 1)}-${dvojmisti(ted.getDate())}`;
}

/**
 * Nejbližší nadcházející termíny, seřazené od nejbližšího.
 *
 * Filtruje se tady, ne ve skriptu ani při buildu, schválně: rozhoduje den,
 * kdy se návštěvník dívá, ne den posledního buildu. I kdyby denní stahování
 * týden nefungovalo, koncerty, které mezitím proběhly, samy zmizí.
 */
export function nadchazejici(ted = new Date()): Gig[] {
  const stari = (ted.getTime() - new Date(VYGENEROVANO).getTime()) / 86_400_000;
  // NaN (rozbité datum) bereme taky jako nedůvěryhodné
  if (!(stari < MAX_STARI_DNI)) return [];

  const dnes = dnesniDatum(ted);
  return CONCERTS
    .filter((gig) => gig.date >= dnes)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, MAX_KONCERTU);
}
