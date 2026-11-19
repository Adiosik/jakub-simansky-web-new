# SEO a vyhledatelnost — jakubsimansky.com

> Cíl: kdo hledá „Jakub Šimanský“ (Google, Bing, AI vyhledávače), najde jeho web,
> desky, koncerty a profily. Dlouhodobě knowledge panel v Google.
> Vzor: kus.nás (`docs/seo.md` tam), přizpůsobený osobnímu webu muzikanta.
> Audit a zavedení 2026-11-19.

## Výchozí stav (audit 2026-11-19)

- Web je SPA: bez JavaScriptu je HTML prázdné. Google stránku dokreslí, ale Bing, AI vyhledávače
  (ChatGPT, Perplexity, Claude) a náhledy odkazů (Facebook, WhatsApp, Messenger) JS nespouštějí.
  Proto je všechno důležité pro vyhledávače **staticky v `<head>`**.
- Na dotaz „Jakub Šimanský“ ani „jakubsimansky.com“ web ve vyhledávání nebyl (vychází Bandcamp, GoOut dua).
- V pořádku: HTTPS, `www` → holá doména 301, staré `adiosik.github.io/jakub-simansky-web-new/` → 301,
  skutečné 404, `lang="cs"`, jeden `h1`.

## Pravidla

| Co | Jak | Kde |
|---|---|---|
| Hlavní adresa | `https://jakubsimansky.com/` (holá doména), canonical v `<head>` | `index.html`, `public/CNAME` |
| Title | ≤ 60 znaků, jméno na začátku | `index.html` |
| Description | 120–160 znaků, fakticky (kdo, co hraje, odkud) | `index.html` |
| Open Graph / Twitter | title, description, `og:image` 1200 × 630 absolutní adresou | `index.html`, `public/og-image.jpg` |
| Strukturovaná data | `WebSite` + `Person` (`sameAs` = profily ze `socials.tsx`, `memberOf` = kapely z `bands.ts`), `MusicAlbum` z `albums.ts`, `MusicEvent` z nadcházejících koncertů | `src/seo/structuredData.ts`, vkládá plugin ve `vite.config.ts` při buildu |
| robots.txt | vše povoleno včetně AI botů, odkaz na sitemap | `public/robots.txt` |
| Sitemap | jen indexovatelné adresy (teď jedna) | `public/sitemap.xml` |
| `llms.txt` | stručný popis pro AI: kdo, desky, profily | `public/llms.txt` — **ručně**, při nové desce nebo profilu doplnit |

**Koncerty v JSON-LD** se počítají ke dni buildu funkcí `nadchazejici()` — stejná pojistka jako na stránce
(po `MAX_STARI_DNI` bez stažení žádné koncerty). Denní build v 6:00 je drží čerstvé. Hodnoty ze Sheetu
se escapují (`<` → `<`), aby nemohly ukončit `<script>`.

**Obrázek pro sdílení** (`public/og-image.jpg`) je perokresba hlavy (`public/photos/hlava.png`) na růžovém
pozadí `--zaklad`, vyrobená jednorázově přes sharp. Až bude vhodná fotka, nahradit souborem stejného
jména 1200 × 630 (a upravit `og:image:alt`).

## Co ještě není (navrženo, čeká)

- [ ] **Statický textový obsah pro boty bez JS** (bio, desky, koncerty) — buildem do `<div id="root">`.
      Nebylo uděláno: obsah by před načtením JS krátce problikl (vliv na vzhled). Rozhodnout s UI/UX.
- [ ] **Anglická verze na vlastní adrese** (`/en/` + `hreflang`) — dnes vyhledávače znají jen CZ.
      Mění chování přepínače jazyka → UI/UX.
- [x] `h1` „Jakub Šimanský“ (vizuálně skrytý, dřív „šimanský“) — UI/UX (2026-11-19).
- [x] Fotky v mřížce galerie mají alt (stejný jako v lightboxu), tlačítko si drží vlastní aria-label — UI/UX (2026-11-19).
- [x] Ikony webu (`favicon.ico` 48 × 48, `apple-touch-icon`, manifest) — dělá UI/UX (2026-11-19).
- [ ] Výkon — viz „Rychlost webu“ níže (podsessiona Rychlost webu).

## Rychlost webu

PageSpeed Insights, mobil, měřeno přes https://pagespeed.web.dev/ (API bez klíče mívá vyčerpanou kvótu).

| Datum | Výkon | LCP | TBT | CLS | Velikost | Poznámka |
|---|---|---|---|---|---|---|
| 2026-11-19 | 72 | 6,1 s | 180 ms | 0 | 3,8 MB | před úpravami; LCP prvek je text v hlavičce, stránka je čistě klientský React |
| _po nasazení_ | | | | | | obrázky WebP + `inert` na menu |

- [x] Obrázky ve WebP: maska hlavy `hlava.webp` (alfa kanál beze ztráty, shodný s PNG na pixel, takže
      animace soutisku je stejná), obaly alb WebP v původní velikosti, `bez-niesnera` zmenšen z 3072 na
      1280 px. Dohromady 2,5 MB → 0,26 MB. `hlava.png` zůstává v repozitáři jako zdroj pro ikony
      a `og-image`, web ho nenačítá. (2026-11-19)
- [x] Zavřené mobilní menu je `inert` — jeho odkazy nejdou vybrat klávesnicí. (2026-11-19)
- [ ] Přehrávače Bandcampu načítat později (`src/components/Album/Embed.tsx`, předstih 800 px) — 3 iframe
      ≈ 1,6 MB a ~0,9 s hlavního vlákna. UI/UX doporučuje menší předstih / načtení po `load`.
- [ ] Předvykreslení stránky při buildu — hlavní lék na LCP, souvisí se „statickým obsahem pro boty“ výše.
- GitHub Pages drží cache 10 min, nastavit nejde.

## Mimo web — udělá Daniel / Jakub

Pravidlo: všude **stejné jméno „Jakub Šimanský“, popis jednou větou a odkaz `https://jakubsimansky.com`**.
Nový profil → doplnit do `src/data/socials.tsx` (tím i do `sameAs`) a do `public/llms.txt`.

| Co | Proč | Kdo | Stav |
|---|---|---|---|
| **Google Search Console** — doménová vlastnost `jakubsimansky.com` (TXT v DNS), odeslat sitemap, požádat o indexaci `/` | bez toho nevíme, co Google vidí; zrychlí indexaci | Daniel | [ ] |
| **Bing Webmaster Tools** (import z GSC) | ChatGPT hledá přes index Bingu | Daniel | [ ] |
| Odkaz na web v bio: Instagram, Facebook, Bandcamp | konzistentní entita | Jakub | [ ] |
| **Spotify for Artists** — ověřit profil, bio + odkaz na web | Spotify profil je silný signál | Jakub | [ ] |
| **Apple Music for Artists** | totéž | Jakub | [ ] |
| Profily kapel (Šimanský Niesner, Šimanský Vaľko Podracký) a mappa → odkaz na web | propojení s kapelami | Jakub | [ ] |
| **GoOut** — vlastní profil (sólo koncerty), odkaz na web | GoOut je vysoko ve výsledcích | Jakub | [ ] |
| **Wikidata** — položka hudebníka (Spotify / Apple / Bandcamp ID, Discogs, MusicBrainz, web) | nejsilnější páka pro knowledge panel | Daniel (s Claudem) | [ ] |
| **Discogs, MusicBrainz** — zápisy desek | zdroj pro Google i AI | Daniel / Jakub | [ ] |
| Média z referencí — požádat o odkaz na web u rozhovorů a recenzí | zpětné odkazy | Jakub | [ ] |
| Knowledge panel — až se objeví, nárokovat („Get verified“) | správa údajů | Jakub | [ ] |

Wikipedii netlačit — bez nezávislých zdrojů ji smažou a uškodí to víc než pomůže.

## Měsíční kontrola (~10 min, skill `simansky-seo-monthly`)

1. **Technika (živý web):** `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/og-image.jpg` vrací 200;
   v HTML je description, `og:image`, canonical a platné JSON-LD (Person, MusicAlbum, případně MusicEvent).
2. **Indexy:** Search Console (indexováno, dotazy na jméno, zobrazení / kliky) a Bing — až budou ověřené.
3. **Vyhledávání:** dotaz „Jakub Šimanský“ — je web na první stránce? knowledge panel?
4. **AI dotazy** (nový chat, se zapnutým hledáním): ChatGPT, Perplexity, Gemini, Claude
   - Q1 „Kdo je Jakub Šimanský (kytarista)?“ — zná ho? odkáže na jakubsimansky.com?
   - Q2 „Český fingerstyle kytarista, americký primitivismus — koho doporučíš?“
   - Q3 „Kde hraje Jakub Šimanský koncerty?“ — vezme termíny z webu?
   Zapisuje se: ✅ zmínka / 🔗 odkaz na web / · nic.
5. **Zápis** řádku do tabulky níže, chybějící hodnoty „—“ / „?“ s důvodem.

| Měsíc | Technika | Indexováno G / B | „Jakub Šimanský“ v Google | ChatGPT Q1/Q2/Q3 | Perplexity | Gemini | Claude | Poznámka |
|---|---|---|---|---|---|---|---|---|
| 2026-11 (audit) | před nasazením: nic z výše | ? / ? (neověřeno) | web nenalezen | — | — | — | Q1 · (web search: Bandcamp, GoOut) | výchozí stav |
