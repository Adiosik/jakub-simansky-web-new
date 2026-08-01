# Jakub Šimanský — web

Osobní web kytaristy **Jakuba Šimanského** (fingerstyle / americký primitivismus,
z Přerova do Brna). Jedna dlouhá stránka v pastelové paletě „písková šalvěj":
obří jméno, portrét, přehrávač, diskografie, ohlasy, koncerty a kontakt —
dvojjazyčně (CZ/EN).

**Živě:** https://adiosik.github.io/jakub-simansky-web-new/

## Co to umí
- Jeden centrovaný sloupec, sekce se odkrývají při scrollu.
- **Hlavička**, která se nahoře stránky drží stranou (navigace uprostřed, jméno
  schované) a po odscrollování plynule přejde do klasické podoby.
- **Přehrávač** s přepínáním alb a skladeb (ukázkový web-audio zvuk, ne reálné
  nahrávky — sekvence tónů jsou u alb v `sequence`).
- **Desky** — klik na obal přepne přehrávač na danou desku a odscrolluje k němu.
- **Animovaná krajina** (SVG soutisk „dva tisky") s parallaxem na pohyb myši.
- **CZ/EN** přepínač, kopírování e-mailu.

## Technologie
- React 19 + TypeScript
- Vite
- MUI (Material UI) + Emotion — styling po komponentách v `styles.ts`
- Web Audio API (ukázkový přehrávač)

## Vývoj
```bash
npm install
npm run dev      # vývojový server (Vite)
npm run build    # produkční build (pouští i tsc)
npm run lint     # oxlint
npm run preview  # náhled buildu
```

## Nasazení
Nasazuje se samo přes GitHub Actions (`.github/workflows/deploy.yml`) při každém
pushi do větve `main`. Web běží v podcestě, proto má `vite.config.ts` nastavené
`base: '/jakub-simansky-web-new/'` — na soubory z `public/` se odkazuj přes
pomocnou funkci `asset()` ze `src/asset.ts`, jinak se pod podcestou nenajdou.

## Struktura
- `src/components/*` — komponenty, každá má `index.tsx` + `styles.ts`
- `src/data/*` — obsah (alba, koncerty, reference, sítě, kontakt)
- `src/language/*` — překlady CZ/EN
- `src/index.css` — design tokeny (barvy), reset a CSS animace
- `public/` — obrázky (`covers/`, `photos/`)

## Než web půjde ven
- `src/data/references.ts` — **ohlasy jsou zatím vymyšlená výplň** kvůli
  rozvržení, podepsaná `Jméno Příjmení` / `Název klubu`. Nahradit skutečnými
  citacemi a jmény.
- `src/data/albums.ts` — nejnovější deska má `label: "—"`, doplnit vydavatelství.
- `src/language/*` — `hero.photoCredit` je obecný, doplnit autora fotky.
