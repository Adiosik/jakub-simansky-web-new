/**
 * Světlý / tmavý motiv. Volba se drží v atributu `data-theme` na kořeni
 * dokumentu — barvy jsou CSS proměnné, takže přepnutí atributu překreslí web.
 *
 * Výchozí stav bere systémové nastavení; jakmile uživatel přepne ručně, jeho
 * volba má přednost a pamatuje se. Zápis i čtení jsou v try/catch, protože
 * v anonymním okně nebo při zakázaných datech stránek localStorage vyhazuje.
 */
export type Motiv = "light" | "dark";

const KLIC = "sim:motiv";

/** Motiv podle systému, když si uživatel ještě nevybral. */
export function motivPodleSystemu(): Motiv {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function nactiMotiv(): Motiv {
  try {
    const ulozeny = localStorage.getItem(KLIC);
    if (ulozeny === "light" || ulozeny === "dark") return ulozeny;
  } catch { /* soukromé okno — jedeme podle systému */ }
  return motivPodleSystemu();
}

export function pouzijMotiv(motiv: Motiv) {
  document.documentElement.dataset.theme = motiv;
  try {
    localStorage.setItem(KLIC, motiv);
  } catch { /* nevadí, přežije to jen do zavření karty */ }
}
