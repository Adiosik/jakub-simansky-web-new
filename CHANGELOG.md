# Changelog

Formát dle [Keep a Changelog](https://keepachangelog.com/cs/1.1.0/),
verze dle [Semantic Versioning](https://semver.org/lang/cs/).

> Před každým commitem zapiš změny do sekce `[Unreleased]` (Added / Changed / Fixed / Removed).
> Při pushi do `main` se z `[Unreleased]` stane nová verze s datem (skill `project-release`).
> Běžné stažení dat ze Sheetu (denní běh) do CHANGELOGu nepatří.

## [Unreleased]

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
