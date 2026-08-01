/**
 * REFERENCE (ohlasy)
 * ──────────────────
 * ⚠️  POZOR — VŠECHNY TEXTY NÍŽE JSOU VYMYŠLENÁ VÝPLŇ, aby šlo vidět rozvržení.
 *     Nikomu skutečnému nejsou připsané a takhle se web NESMÍ spustit: vymyšlený
 *     ohlas podepsaný reálným člověkem nebo médiem je zavádějící.
 *     Než půjde web ven, nahraď je skutečnými citacemi a skutečnými jmény.
 *
 * Přidání reference = přidej objekt do pole REFERENCES.
 *  - quote  … samotný text, dvojjazyčně
 *  - author … kdo to řekl (jméno člověka, klubu, média)
 *  - role   … upřesnění pod jménem, dvojjazyčně — nepovinné
 *  - url    … odkaz na zdroj (recenze, článek) — nepovinné
 */
import type { Lang } from "../language";

export type Reference = {
  quote: Record<Lang, string>;
  author: string;
  role?: Record<Lang, string>;
  url?: string;
};

export const REFERENCES: Reference[] = [
  {
    quote: {
      csCZ: "Hraje, jako by ta krajina hrála sama. Půl hodiny jsem se nehnul z místa.",
      enUS: "He plays as if the landscape were playing itself. I didn't move for half an hour.",
    },
    author: "Jméno Příjmení", // TODO: nahradit skutečným jménem
    role: { csCZ: "hudební publicista", enUS: "music writer" },
  },
  {
    quote: {
      csCZ: "Jeden z nejsilnějších sólových večerů, co jsme tu měli. Sál ani nedýchal.",
      enUS: "One of the strongest solo nights we've had here. The room held its breath.",
    },
    author: "Název klubu", // TODO: nahradit skutečným klubem / festivalem
    role: { csCZ: "dramaturgie", enUS: "programming" },
  },
  {
    quote: {
      csCZ: "Nestandardní ladění a motivy, ze kterých se nedá vystoupit. Deska, která roste s každým poslechem.",
      enUS: "Unusual tunings and motifs you can't step out of. A record that grows with every listen.",
    },
    author: "Jméno Příjmení", // TODO: nahradit skutečným jménem
    role: { csCZ: "posluchač", enUS: "listener" },
  },
];
