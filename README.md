# Jakub Šimanský — web

Osobní web kytaristy **Jakuba Šimanského** (fingerstyle / americký primitivismus,
z Přerova do Brna). Jedna dlouhá stránka v pastelové paletě „písková šalvěj":
obří jméno, portrét, přehrávač, diskografie, ohlasy, koncerty a kontakt —
dvojjazyčně (CZ/EN).

**Živě:** https://jakubsimansky.com/

## Co to umí
- Jeden centrovaný sloupec, sekce se odkrývají při scrollu.
- **Hlavička**, která se nahoře stránky drží stranou (navigace uprostřed, jméno
  schované) a po odscrollování plynule přejde do klasické podoby.
- **Přehrávač** — vložený přehrávač Bandcampu, přepínání alb šipkami. ID alb
  jsou u desek v `albums.ts` jako `bandcampId`.
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
pushi do větve `main`. Web běží na vlastní doméně `jakubsimansky.com` z kořene,
takže `base` ve `vite.config.ts` je `/`.

Doménu drží **`public/CNAME`**. Ten soubor tam musí zůstat: při nasazení přes
vlastní workflow si GitHub `CNAME` sám nevytvoří, a kdyby v buildu chyběl,
vlastní doména by se po prvním nasazení odpojila.

Na soubory z `public/` se odkazuj přes `asset()` ze `src/asset.ts` — drží je
navázané na `BASE_URL`, takže přežijí i případný návrat do podcesty.

## Struktura
- `src/components/*` — komponenty, každá má `index.tsx` + `styles.ts`
- `src/data/*` — obsah (alba, koncerty, reference, sítě, kontakt)
- `src/language/*` — překlady CZ/EN
- `src/index.css` — design tokeny (barvy), reset a CSS animace
- `public/` — obrázky (`covers/`, `photos/`)

## Licence
Kód je pod MIT (viz [LICENSE](LICENSE)). **Obsah pod ni nespadá** — hudba, texty,
fotky, obaly desek a citované ohlasy zůstávají autorům a nesmí se bez svolení
použít. Písma jsou hostovaná u nás (ne z Google Fonts, kvůli GDPR) a mají vlastní
licenci SIL OFL 1.1, viz [src/assets/fonts/OFL.txt](src/assets/fonts/OFL.txt).

## Než web půjde ven
- `src/data/references.ts` — **ohlasy jsou zatím vymyšlená výplň** kvůli
  rozvržení, podepsaná `Jméno Příjmení` / `Název klubu`. Nahradit skutečnými
  citacemi a jmény.
- `src/data/albums.ts` — nejnovější deska má `label: "—"`, doplnit vydavatelství.
- `src/language/*` — `hero.photoCredit` je obecný, doplnit autora fotky.
