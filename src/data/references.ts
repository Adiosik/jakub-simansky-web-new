/**
 * OHLASY (reference)
 * ──────────────────
 * Co o Jakubovi napsala a odvysílala média. Obsah spravuje Jakub v Google
 * Sheetu (záložka „reference"), odkud se stahuje při buildu do
 * `generated/reference.json` — viz apps-script/README.md. Ručně se do toho
 * souboru psát dá, ale příští build to přepíše.
 *
 * Na rozdíl od koncertů tu **není pojistka na stáří dat**. Zrušený koncert by
 * po výpadku stahování dál zval lidi; starý rozhovor je ale pořád pravdivý
 * rozhovor, takže by bylo zbytečné kvůli výpadku schovat celou sekci.
 *
 * Pořadí v tabulce nehraje roli, web si reference seřadí sám (viz SERAZENE).
 */
import data from "./generated/reference.json";

export type Reference = {
  /** médium, ve kterém to vyšlo */
  source: string;
  /** kdo to psal nebo moderoval */
  author?: string;
  kind: "review" | "interview" | "media";
  /** jazyk originálu, ukazuje se jako značka („EN", „SK"…) */
  orig?: string;
  /** ISO datum vydání; na webu se ukáže jen měsíc a rok */
  date?: string;
  url: string;
};

// Přetypování je tu oprávněné: stahovací skript každou položku ověří (druh,
// odkaz, datum) dřív, než ji do souboru zapíše. TypeScript z JSON sám vyčte
// jen `kind: string`, ne ten výčet.
export const REFERENCES = data.references as Reference[];

/**
 * Od nejnovějšího. Reference bez data (profily médií jako Full Moon nebo
 * Rate Your Music) jdou na konec; mezi sebou drží pořadí z tabulky, protože
 * řazení v JS je stabilní.
 */
export const SERAZENE: Reference[] = [...REFERENCES].sort((a, b) => {
  if (!a.date) return b.date ? 1 : 0;
  if (!b.date) return -1;
  return b.date.localeCompare(a.date);
});
