/**
 * SOCIÁLNÍ SÍTĚ
 * Přidání = přidej objekt. `wm` (watermark) je krátká textová zkratka vedle
 * ikony v zápatí (např. „BC"); když ji vynecháš, ukáže se jen ikona.
 */
import type { ReactNode } from "react";

export type Social = { name: string; wm?: string; url: string; icon: ReactNode };

/**
 * Síť podle adresy — kapely mají vlastní profily na stejných sítích, takže si
 * půjčí ikonu i název odsud a nemusí se nikde duplikovat.
 */
export function sitZAdresy(url: string): Social {
  const podle = (jmeno: string) => SOCIALS.find((s) => s.name === jmeno);
  const nalez = url.includes("instagram.com") ? podle("Instagram")
    : url.includes("bandcamp.com") ? podle("Bandcamp")
    : undefined;
  return nalez
    ? { ...nalez, url }
    : { name: "web", url, icon: (<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"
        stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </svg>) };
}

/** Pořadí je i pořadím ikon v kontaktech. */
export const SOCIALS: Social[] = [
  { name: "Instagram", url: "https://www.instagram.com/jakubsimansky/",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" />
      <circle cx="12" cy="12" r="4" fill="none" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>) },
  { name: "Facebook", url: "https://www.facebook.com/jakubsimansky",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" /></svg>) },
  { name: "Bandcamp", wm: "BC", url: "https://jakubsimansky.bandcamp.com",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" /></svg>) },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/jakub-%C5%A1imansk%C3%BD/1462450613",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 3.2a1 1 0 0 0-1.19-.98l-9 1.8A1 1 0 0 0 9 5v10.2a3 3 0 1 0 2 2.83V8.02l7-1.4v7.58a3 3 0 1 0 2 2.83V3.2z" /></svg>) },
  { name: "Spotify", url: "https://open.spotify.com/artist/3EpRcSsvbEaaOFsWjjJjGY",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" /></svg>) },
];
