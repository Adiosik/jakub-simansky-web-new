# Poznámky k projektu

## Obsah z Google Sheetu

Koncerty a reference se neberou ze zdrojáku, ale z Google Sheetu, který
spravuje Daniel a plní Jakub. Cesta je: Sheet (záložky `koncerty`
a `reference`) → Apps Script (`apps-script/Code.gs`) → stažení při buildu
v GitHub Action → `src/data/generated/koncerty.json` a `reference.json` → web.

Obě záložky se čtou **nezávisle** — v Apps Scriptu i ve stahovacím skriptu.
Rozbitá nebo chybějící jedna nezablokuje druhou.

**Když se mění cokoli, co ovlivňuje ten obsah, musí se to promítnout na obě
strany.** Konkrétně:

- přidání, přejmenování nebo zrušení pole v `Gig` (src/data/concerts.ts)
  nebo `Reference` (src/data/references.ts)
- změna názvů sloupců v tabulce
- změna toho, co je povinné a co ne

Pokaždé to znamená upravit i `apps-script/Code.gs` **a** říct Danielovi, že si
musí nasadit novou verzi skriptu v Sheetu — samotný commit do repozitáře na
běžící endpoint nesáhne. Bez toho začne stahování vracet stará nebo neúplná
data a build si toho nemusí všimnout.

Skript hledá sloupce **podle názvu v hlavičce, ne podle pořadí**, takže
přeházení sloupců v tabulce nevadí. Přejmenování ano.

Stahování je `npm run data`, ne součást `npm run build` — místní build tak
běží bez přístupu k Sheetu a bere commitnutá data. Ta jsou v gitu schválně:
slouží jako záloha, když stahování selže. Skript kvůli tomu **nikdy neshodí
nasazení** — každá chyba končí návratovým kódem 0 a poznámkou v protokolu.

Web navíc koncertům **přestane věřit po 21 dnech** (`MAX_STARI_DNI`) a ukáže
prázdný stav místo možná neplatných termínů. U referencí tahle pojistka
schválně **není** — starý rozhovor je pořád pravdivý, zbytečně by zmizela
celá sekce. Prázdný seznam referencí se naopak nezapíše vůbec (skoro jistě
jde o omylem vymazanou záložku) a zůstane záloha.

Odkazy v referencích se kontrolují dvakrát — v Apps Scriptu i ve stahovacím
skriptu — a projde jen `http(s)://`. Jdou z tabulky rovnou do `href`. Kdyby tedy koncerty ze stránky
zmizely, první, co zkontroluj, je `vygenerovano` v `koncerty.json` — znamená
to, že stahování delší dobu neběží.

Action stažená data **commituje zpátky**, aby záloha odpovídala poslednímu
úspěšnému stažení. Bez toho zestárne a při první neúspěšné aktualizaci se na
web dostanou dávno neplatné záznamy — 10. 9. 2026 se takhle objevil testovací
koncert v Ostravě jako skutečný termín. Ty commity dělá `github-actions[bot]`
a workflow nespouštějí, takže nevzniká smyčka.

## Konvence kódu

**Názvy v kódu anglicky** — proměnné, funkce, konstanty, typy, komponenty,
props, klíče JSON, CSS proměnné i názvy souborů. Česky zůstávají komentáře,
texty webu v `src/language/*` a hlavičky sloupců v Google Sheetu (ty čte
Jakub). Nový kód piš anglicky, i když je okolní kód zatím česky.

### TODO: refaktor českých identifikátorů

Starší kód má česky pojmenované věci (`VIDET`, `SLOUPCE`, `poZlomech`,
`nadchazejici`, `drzetPozici`, `nechatZalohu`, `nactiMotiv`, CSS proměnné
`--zaklad`, `--inkoust`, `--obili`, `--mezera`…). Převést je najednou jako
samostatný refaktor, ne průběžně.

Na co si při něm dát pozor:

- **Nahrazovat jen v kódu, ne v komentářích.** Část identifikátorů je bez
  diakritiky shodná s běžnými slovy (`klik`, `pozice`), prosté hledání
  a nahrazování by přepsalo i české komentáře.
- **Klíče v odpovědi Apps Scriptu** (`koncerty`, `preskoceno`, `chyba`,
  `vygenerovano`…) jsou smlouva mezi Sheetem a buildem. Změna znamená upravit
  `apps-script/Code.gs` i `scripts/fetch-sheet.mjs` naráz a nasadit v Sheetu
  novou verzi skriptu — a do té doby nechat stahovací skript číst oboje.
- **`koncerty.json`** se přejmenuje taky; Action ukládá celou složku
  `src/data/generated`, takže workflow se měnit nemusí.
- CSS proměnné nahrazovat od nejdelšího názvu (`--zaklad-2` před `--zaklad`).

## Nasazení

Push do `main` spouští build a nasazení na https://jakubsimansky.com.
**Push vždy nech schválit Danielem**, nepouštěj ho z vlastní iniciativy.
