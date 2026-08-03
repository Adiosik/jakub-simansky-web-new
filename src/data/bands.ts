/**
 * KAPELY A PROJEKTY
 * ─────────────────
 * Uskupení, ve kterých Jakub hraje vedle sólové dráhy.
 *
 * Přidání kapely = přidej objekt do pole BANDS.
 *  - name        … název uskupení
 *  - members     … obsazení, jména oddělená do pole — nepovinné
 *  - description … krátký popis, dvojjazyčně — nepovinné
 *  - url         … odkaz na bandcamp / web / profil — nepovinné
 *
 * ⚠️ U položek označených TODO chybí ověřené údaje. Nejsou vymyšlené, jen
 *    prázdné — doplň je, ať na webu nestojí nic, co není pravda.
 */
import type { Lang } from "../language";

export type Band = {
  name: string;
  members?: string[];
  description?: Record<Lang, string>;
  url?: string;
};

export const BANDS: Band[] = [
  {
    name: "Šimanský & Niesner",
    members: ["Jakub Šimanský", "Tomáš Niesner"],
    description: {
      csCZ: "Kytarové duo. Dvě akustické kytary, které se proplétají mezi prstovou hrou a společně stavěnými plochami.",
      enUS: "A guitar duo. Two acoustic guitars weaving between fingerpicking and jointly built textures.",
    },
    // TODO: doplnit odkaz (bandcamp / web)
  },
  {
    name: "Šimanský Valko Podracký",
    // TODO: doplnit obsazení (křestní jména), popis a odkaz
  },
];
