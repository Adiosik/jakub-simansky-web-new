/**
 * STRUKTUROVANÁ DATA (schema.org JSON-LD) PRO VYHLEDÁVAČE
 * ───────────────────────────────────────────────────────
 * Spouští se jen při buildu (plugin v vite.config.ts), ne v prohlížeči.
 * Výsledek se vloží do <head> v index.html, takže ho vidí i boti, kteří
 * nespouštějí JavaScript (Bing, AI vyhledávače, náhledy odkazů).
 *
 * Bere data ze stejných zdrojů jako stránka — nic se tu nepíše dvakrát.
 * Koncerty se počítají ke dni buildu; denní build v Action je drží čerstvé.
 * Podrobnosti v docs/seo.md.
 */
import { ALBUMS, type Text } from "../data/albums";
import { BANDS } from "../data/bands";
import { nadchazejici } from "../data/concerts";
import { SOCIALS } from "../data/socials";
import { LESSONS_PHOTO } from "../data/site";

export const SITE_URL = "https://jakubsimansky.com/";
const PERSON_ID = `${SITE_URL}#jakub`;

const absolute = (path: string) => new URL(path, SITE_URL).href;
const czech = (text: Text) => (typeof text === "string" ? text : text.csCZ);

function person() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Jakub Šimanský",
    url: SITE_URL,
    image: absolute(LESSONS_PHOTO),
    jobTitle: "kytarista",
    description:
      "Český kytarista a banjista z Brna — fingerstyle a americký primitivismus, steel a lap steel kytara, banjo.",
    knowsAbout: ["fingerstyle", "americký primitivismus", "lap steel kytara", "banjo"],
    homeLocation: { "@type": "Place", name: "Brno" },
    sameAs: SOCIALS.map((s) => s.url),
    memberOf: BANDS.map((band) => {
      // sameAs = profily kapely, ne stránka jedné desky u vydavatele
      const profiles = (band.links ?? []).filter((url) => !url.includes("/album/"));
      return { "@type": "MusicGroup", name: band.name, ...(profiles.length ? { sameAs: profiles } : {}) };
    }),
  };
}

function albums() {
  return ALBUMS.map((album) => ({
    "@type": "MusicAlbum",
    name: album.title,
    datePublished: String(album.year),
    byArtist: { "@id": PERSON_ID },
    recordLabel: { "@type": "Organization", name: czech(album.label) },
    ...(album.cover ? { image: absolute(album.cover) } : {}),
    ...(album.links?.bandcamp ? { url: album.links.bandcamp } : {}),
    numTracks: album.tracks.length,
  }));
}

function events(now: Date) {
  return nadchazejici(now).map((gig) => ({
    "@type": "MusicEvent",
    name: `Jakub Šimanský — ${gig.venue}, ${gig.city}`,
    startDate: gig.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: gig.venue,
      address: { "@type": "PostalAddress", addressLocality: gig.city },
    },
    performer: { "@id": PERSON_ID },
    url: `${SITE_URL}#koncerty`,
  }));
}

/** Celý graf jako JSON pro <script type="application/ld+json">. */
export function structuredDataJson(now = new Date()) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}#web`, url: SITE_URL, name: "Jakub Šimanský", inLanguage: ["cs", "en"] },
      person(),
      ...albums(),
      ...events(now),
    ],
  };
  // Hodnoty jdou mimo jiné ze Sheetu — „<“ by mohlo ukončit <script> předčasně.
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
