/**
 * Světlý / tmavý motiv. Volba se drží v atributu `data-theme` na kořeni
 * dokumentu — barvy jsou CSS proměnné, takže přepnutí atributu překreslí web.
 *
 * Web startuje vždy ve světlém, i když má návštěvník v systému tmavý režim.
 * Je to vědomé rozhodnutí: světlá paleta je ta, ve které je web navržený,
 * a přepnutí stojí jedno kliknutí na ikonu v hlavičce. Volba se pak pamatuje.
 *
 * Čtení i zápis jsou v try/catch, protože v anonymním okně nebo při zakázaných
 * datech stránek localStorage vyhazuje.
 */
export type Motiv = "light" | "dark";

const KLIC = "sim:motiv";

export function nactiMotiv(): Motiv {
  try {
    const ulozeny = localStorage.getItem(KLIC);
    if (ulozeny === "light" || ulozeny === "dark") return ulozeny;
  } catch { /* soukromé okno — startujeme světlým */ }
  return "light";
}

export function pouzijMotiv(motiv: Motiv) {
  document.documentElement.dataset.theme = motiv;
  try {
    localStorage.setItem(KLIC, motiv);
  } catch { /* nevadí, přežije to jen do zavření karty */ }
}
