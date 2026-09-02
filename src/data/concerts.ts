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
  /**
   * S kým Jakub hraje. Vynech u sólového vystoupení — štítek „sólo" se
   * doplní sám, aby na první pohled bylo jasné, o který případ jde.
   */
  band?: string;
  /** Odkaz na vstupenky — nepovinné */
  ticketUrl?: string;
  /** Vyprodáno — nepovinné */
  soldOut?: boolean;
};

/** Pořadí v poli je i pořadím na stránce — nikde se to neseřazuje podle data. */
export const CONCERTS: Gig[] = [
  { date: "2026-09-30", city: "Praha", venue: "Cargo Gallery" },
];
