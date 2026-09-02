/**
 * KAPELY A PROJEKTY
 * ─────────────────
 * Uskupení, ve kterých Jakub hraje vedle sólové dráhy.
 *
 * Přidání kapely = přidej objekt do pole BANDS.
 *  - name        … název uskupení
 *  - members     … obsazení, jména oddělená do pole — nepovinné
 *  - description … popis, dvojjazyčně; prázdný řádek dělá odstavec — nepovinné
 *  - links       … odkazy (instagram, bandcamp, web) — popisek se odvodí z adresy
 */
import type { Lang } from "../language";

export type Band = {
  name: string;
  members?: string[];
  description?: Record<Lang, string>;
  links?: string[];
};

export const BANDS: Band[] = [
  {
    name: "Šimanský Niesner",
    members: ["Jakub Šimanský", "Tomáš Niesner"],
    description: {
      csCZ: "Dvojice kytaristů Jakub Šimanský a Tomáš Niesner společně debutovali deskou Tance neznámé, která vyšla na labelu Stoned to Death v roce 2019. Oba hráči sdílejí téměř desetiletou existenci v noise-rockové kapele Unna.\n\nV roce 2016 přešel Šimanský na sólovou dráhu a vydal svůj debut Face to Face Against American Primitivism in Eastern Europe Vol. I. Nedlouho potom spolu Šimanský a Niesner zúročili dlouholetou sehranost a začali pracovat na společné desce, po jejímž vydání následovalo poměrně intenzivní koncertování a psaní nových skladeb.\n\nV jejich hudbě je patrná pestrost a ojedinělý přístup k ladění, rytmice, mantrickému repetitivismu, ale také smysl pro poutavé melodie, čímž duo navazuje na tradici amerického primitivismu, český folk nebo vlivy východní hudby.\n\nV roce 2020 se jejich skladba objevila na kompilaci Imaginational Anthem Vol. X amerického labelu Tompkins Square. Šimanský a Niesner pak následně vydali svoji druhou dlouhohrající desku Všechno Dobré. V září 2023 jim vyšlo nové album Jako doma.",
      enUS: "Guitarists Jakub Šimanský and Tomáš Niesner debuted together with the record Tance neznámé, released on Stoned to Death in 2019. Both had spent nearly a decade in the noise-rock band Unna.\n\nIn 2016 Šimanský went solo with his debut Face to Face Against American Primitivism in Eastern Europe Vol. I. Not long after, he and Niesner drew on years of playing together and started work on a joint record, followed by fairly intense touring and writing.\n\nTheir music shows range and an unusual approach to tuning, rhythm and mantra-like repetition, along with a feel for arresting melody — the duo carrying on the tradition of American primitivism, Czech folk and Eastern influences.\n\nIn 2020 one of their pieces appeared on Imaginational Anthem Vol. X, a compilation by the American label Tompkins Square. Šimanský and Niesner then released their second full-length, Všechno Dobré, and in September 2023 a new album, Jako doma.",
    },
    links: [
      "https://www.instagram.com/simanskyniesner/",
      "https://simanskyniesner.bandcamp.com/music",
    ],
  },
  {
    name: "Šimanský Vaľko Podracký",
    members: ["Jakub Šimanský", "Michal Vaľko", "Ján Podracký"],
    description: {
      csCZ: "Šimanský Vaľko Podracký, takzvanou Nejnesvětější trojici, tvoří kytarista a hráč na banjo Jakub Šimanský, niněrista Michal Vaľko a hráč na dechové nástroje Ján Podracký. Brněnské trio propojuje kytarový primitivismus, drone, minimalismus a syrové folkové experimentování.\n\nNa debutovém albu K-drone, vydaném labelem mappa, proměňuje opakující se motivy v hutné a neklidné zvukové krajiny plné drhnoucích strun, bloudících fléten a extatických smyček. Zní jako acidový antiwestern natočený v tajném podzemním úkrytu: kouřem nasáklý folk a experimentální táborákové písně.",
      enUS: "Šimanský Vaľko Podracký — the so-called Unholiest Trinity — is guitarist and banjo player Jakub Šimanský, hurdy-gurdy player Michal Vaľko and wind player Ján Podracký. The Brno trio ties together guitar primitivism, drone, minimalism and raw folk experimentation.\n\nOn the debut album K-drone, released by the mappa label, repeating motifs turn into dense, restless soundscapes full of scraping strings, wandering flutes and ecstatic loops. It sounds like an acid anti-western shot in a secret underground hideout: smoke-soaked folk and experimental campfire songs.",
    },
    links: [
      "https://www.instagram.com/simansky_valko_podracky/",
      // trio nemá vlastní bandcamp, deska visí u vydavatele mappa
      "https://mappa.bandcamp.com/album/k-drone",
    ],
  },
];
