/**
 * KONCERTY
 * ────────
 * Přidání termínu = přidej objekt do pole CONCERTS.
 * date je ve formátu "RRRR-MM-DD" (datum se zobrazí podle zvoleného jazyka).
 * ticketUrl a soldOut jsou nepovinné.
 * Minulé termíny klidně smaž, nebo si je nech jako archiv.
 */

export type Gig = {
  /** Datum ve formátu RRRR-MM-DD */
  date: string;
  /** Město */
  city: string;
  /** Místo konání (klub, sál…) */
  venue: string;
  /** Odkaz na vstupenky — nepovinné */
  ticketUrl?: string;
  /** Vyprodáno — nepovinné */
  soldOut?: boolean;
};

export const CONCERTS: Gig[] = [
  { date: "2026-07-18", city: "Olomouc", venue: "Jazz Tibet Club" },
  { date: "2026-08-09", city: "Brno", venue: "Kabinet múz" },
  { date: "2026-09-05", city: "Přerov", venue: "Městský dům", soldOut: true },
  { date: "2026-10-11", city: "Praha", venue: "Café v lese" },
  { date: "2026-11-22", city: "Ostrava", venue: "Provoz Hlubina" },
];
