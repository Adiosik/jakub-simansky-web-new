/**
 * SOCIÁLNÍ SÍTĚ
 * Přidání = přidej objekt. `wm` (watermark) je krátká textová zkratka vedle
 * ikony v zápatí (např. „BC"); když ji vynecháš, ukáže se jen ikona.
 */
import type { ReactNode } from "react";

export type Social = { name: string; wm?: string; url: string; icon: ReactNode };

export const SOCIALS: Social[] = [
  { name: "Spotify", url: "https://open.spotify.com/artist/3EpRcSsvbEaaOFsWjjJjGY",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" /></svg>) },
  { name: "Instagram", url: "https://www.instagram.com/jakubsimansky/",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" />
      <circle cx="12" cy="12" r="4" fill="none" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>) },
  { name: "Bandcamp", wm: "BC", url: "https://jakubsimansky.bandcamp.com",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" /></svg>) },
  { name: "SoundCloud", wm: "soundcloud", url: "https://soundcloud.com/jakubsimansky",
    icon: (<svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="13" width="1.5" height="5" rx=".7" />
      <rect x="3.6" y="11" width="1.5" height="7" rx=".7" />
      <rect x="6.2" y="9.5" width="1.5" height="8.5" rx=".7" />
      <rect x="8.8" y="11" width="1.5" height="7" rx=".7" />
      <path d="M12 18V10c.4-2.4 3.8-3 5.6-1.2.5-.4 1.2-.6 1.9-.6 1.9 0 3.5 1.5 3.5 3.4S21.9 18 20 18H12z" />
    </svg>) },
];
