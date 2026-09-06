# Endpoint pro koncerty

Koncerty na webu se neberou ze zdrojáku, ale z Google Sheetu. Tenhle skript je
mezičlánek: přečte tabulku a vydá ji jako JSON, který si při buildu stáhne
GitHub Action.

Soubor `Code.gs` je **kopie**. Skript ve skutečnosti běží uvnitř Sheetu; tady
leží proto, aby byl verzovaný a šlo se do něj podívat bez přihlašování.

## Tabulka

Hlavička v prvním řádku:

| datum | město | místo konání | interpret |
|---|---|---|---|
| 30.09.2026 | Praha | Cargo Gallery | Solo |
| 15.11.2026 | Brno | Kabinet múz | Šimanský Niesner |

- **datum** musí být skutečná datumová buňka, ne text. Hlídá to ověření dat
  (viz níž), takže se do sloupce text ani nedá napsat.
- **město** a **místo konání** jsou povinné. Město je Ostrava, místo konání
  je klub nebo sál — na webu se to ukáže jako „Ostrava — Provoz Hlubina".
- **interpret** se vybírá z rozevírací nabídky (viz níž). „Solo" se do dat
  nepropíše — web má pro sólo vlastní štítek, který umí i anglicky. Prázdná
  buňka znamená totéž.

### Kalendář u data

Aby v datu nikdy neskončil text, který skript nepřečte:

1. označ **A2:A1000** (celý sloupec bez hlavičky)
2. **Data → Ověření dat → Přidat pravidlo**
3. Kritéria: **Datum** → **je platné datum**
4. **Pokročilé možnosti** → Pokud jsou data neplatná: **Odmítnout vstup**
5. Hotovo

Po dvojkliku na buňku pak vyjede kalendář a datum se vybírá myší. Odmítnutí
vstupu je ta důležitější půlka — bez něj by šlo datum přepsat textem
a řádek by se na webu tiše ztratil.

Na tom, jak se datum v tabulce **zobrazuje**, nezáleží. „1. října 2026"
i „01.10.2026" jsou pro skript totéž, protože si čte hodnotu buňky, ne to,
co je vidět.

### Rozevírací nabídka u interpreta

Aby Jakub nemusel názvy kapel psát a překlepy nedělaly z jedné kapely dvě:

1. klikni na písmeno sloupce **interpret** (označí se celý)
2. **Vložit → Rozevírací nabídka**
3. jako možnosti vypiš: `Solo`, `Šimanský Niesner`, `Šimanský Vaľko Podracký`
4. Hotovo

Nabídka je jen pohodlí — skript bere jakýkoli text, takže jednorázová
spolupráce se dá do buňky napsat i ručně.

Místo „místo konání" projde i `klub` nebo `sál`, místo „interpret" i `kapela`
nebo `s kým`. Záložka se nemusí jmenovat `koncerty` — když se nenajde, vezme
se první v pořadí a do odpovědi se napíše, ze které se četlo.

Sloupce se hledají **podle názvu, ne podle pořadí**, takže se dají přehazovat
a vkládat mezi ně vlastní poznámkové sloupce. Přejmenovat hlavičku ale nejde —
tím se sloupec ztratí.

Řádek, kterému chybí něco povinného, se **přeskočí** a vypíše se v poli
`preskoceno` i s důvodem. Zbytek tabulky projde.

## Nasazení

1. V Sheetu **Rozšíření → Apps Script**. Musí to být odsud — skript se tím
   naváže na tabulku. Samostatný projekt založený na script.google.com by
   neměl k jaké tabulce sáhnout a spadl by na `SpreadsheetApp.getActive()`.
2. Obsah `Code.gs` vložit do editoru (přepsat, co tam je) a **uložit**.
   Dokud se neuloží, editor v liště nenabídne žádné funkce.
3. Vybrat funkci **nahled** a **Spustit** — poprvé si to vyžádá povolení.
   V protokolu se objeví totéž, co pak vrátí endpoint; tímhle se dá ověřit
   tabulka ještě před nasazením.
4. **Implementovat → Nová implementace → Webová aplikace**
   - Popis: co se v téhle verzi změnilo („Přidán sloupec interpret"), ne co
     skript dělá. Popisy se v přehledu implementací řadí pod sebe a časem
     z nich je seznam změn — bez nich tam bude jen „Verze 1, 2, 3".
   - Spustit jako: **já**
   - Kdo má přístup: **Kdokoli**
5. Zkopírovat adresu, která končí `/exec` — tu potřebuje build

„Kdokoli" znamená, že adresa je fakticky veřejná. U dat, která stejně visí na
webu, to nevadí, ale ať se to ví.

## Po každé změně skriptu

Nestačí přepsat kód v editoru. Musí se **Implementovat → Spravovat
implementace → tužka → Verze: Nová verze**. Bez toho běží pořád ta stará
a build dostane stará data, aniž by co hlásilo chybu.

Totéž platí obráceně: když se na webu změní, jaká pole koncerty mají nebo jak
se sloupce jmenují, musí se upravit i tenhle skript — viz `CLAUDE.md`
v kořeni repozitáře.
