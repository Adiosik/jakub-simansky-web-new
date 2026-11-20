# Changelog

Formát dle [Keep a Changelog](https://keepachangelog.com/cs/1.1.0/),
verze dle [Semantic Versioning](https://semver.org/lang/cs/).

> Před každým commitem zapiš změny do sekce `[Unreleased]` (Added / Changed / Fixed / Removed).
> Po uceleném bloku nasazeném do produkce se z `[Unreleased]` stane nová verze s datem (skill `project-release`).
> Běžné stažení dat ze Sheetu (denní běh) do CHANGELOGu nepatří.

## [Unreleased]

### Added
- Ikona webu z Jakubovy kresby hlavy (vektor): růžová, v tmavém motivu fialová a přepíná se s ním; `.ico` pro starší prohlížeče, ikona na plochu telefonu se soutiskem a `site.webmanifest`.
- SEO: popis stránky, Open Graph a náhledový obrázek pro sdílení (`og-image.jpg`), kanonická adresa, `robots.txt`, `sitemap.xml`, `llms.txt`.
- SEO: strukturovaná data (JSON-LD) — osoba s odkazy na profily a kapely, desky a nadcházející koncerty; generují se při buildu z dat webu.
- `docs/seo.md` — vyhledatelnost: pravidla, úkoly mimo web, měsíční kontrola.
- Měření návštěvnosti přes Cloudflare Web Analytics (bez cookies).
- Koncerty: rozbalovací blok „odehrané“ pod nadcházejícími, po ročnících od nejnovějšího; každý rok se rozbaluje zvlášť (chevron), otevřený je jen nejnovější.
- Sestava Šimanský Kalhausová a zkratky sestav (ŠN, ŠVP, ŠK) — web je ve štítku převede na plný název.

### Changed
- SEO: skrytý hlavní nadpis `h1` je „Jakub Šimanský“ místo „šimanský“; fotky v mřížce galerie mají popisek (alt) pro vyhledávání obrázků.
- Titulek stránky: „Jakub Šimanský — kytarista, americký primitivismus“.
- Rychlost: obrázky ve WebP — maska kresby hlavy (`hlava.webp`, alfa beze ztráty) a obaly alb, obal „Bez Niesnera“ zmenšen na 1280 px; obrázky mají místo 2,5 MB 0,26 MB, vzhled beze změny.
- Rychlost: přehrávače Bandcampu se stahují až po první interakci (scroll, dotyk, klik, klávesa) nebo 800 px před výřezem, ne 1,2 s po načtení; po interakci jeden po druhém v pořadí na stránce, ať první nesdílí přenos s ostatními. Místo bílého pruhu je před načtením průhledná plocha v barvě stránky.
- Koncerty: místo 3 se ukáže až 10 nadcházejících termínů.

### Fixed
- Skok z menu na sekci, na kterou se ještě nedojelo (např. „kapely“ po načtení stránky), dojel o 42 px dál a nadpis zajel pod hlavičku; náběhová animace už neposouvá samotnou kotvu.
- Přístupnost: zavřené mobilní menu je `inert`, jeho odkazy už nejdou vybrat klávesnicí.

## [1.0.0] — 2026-11-05

Výchozí verze — první číslovaná, stav webu nasazeného na GitHub Pages (jakubsimansky.com).
Shrnutí dosavadního vývoje (2026-08-01 → 2026-11-05):

### Added
- Jednostránkový web v pastelové paletě, vlastní hosting písem (bez Google Fonts).
- Vlastní doména jakubsimansky.com, tmavý režim s přepínačem vedle jazyka (start vždy ve světlém).
- Hudba: alba s názvem nahoře, popisem a skladbami za „číst o albu", přehrávač z Bandcampu, sekce kapely.
- Koncerty ze Sheetu se štítkem sestavy; záloze koncertů se po 21 dnech přestane věřit.
- Galerie se skutečnými fotkami z Google Disku (stejné čtverce, rozbalení, lightbox).
- Reference z médií (mj. rozhovor pro Radio Wave), doučování, zápatí a sítě v kontaktech.
- Apps Script pro Sheet (přeskakuje koš, „Bez autora" i ve sloupci autor), denní nasazení přes GitHub Actions.

### Changed
- Mobilní menu se rozbaluje jako na desktopu, čitelnější drobné texty, přehrávače se načítají předem.
- Závislosti: vite 8.3.6, sharp 0.35.5, postcss, source-map-js (Dependabot, 2026-11-05).
