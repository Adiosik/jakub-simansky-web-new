# Endpoint pro koncerty, reference a fotky

Koncerty a reference na webu se neberou ze zdrojáku, ale z Google Sheetu.
Tenhle skript je mezičlánek: přečte obě záložky a vydá je jako JSON, který si
při buildu stáhne GitHub Action.

Každá záložka se čte samostatně — když je jedna rozbitá nebo chybí, druhá
projde. Názvy záložek musí sedět (`koncerty`, `reference`; na velikosti
písmen a diakritice nezáleží).

Soubor `Code.gs` je **kopie**. Skript ve skutečnosti běží uvnitř Sheetu; tady
leží proto, aby byl verzovaný a šlo se do něj podívat bez přihlašování.

## Záložka „koncerty"

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
nebo `s kým`.

Sloupce se hledají **podle názvu, ne podle pořadí**, takže se dají přehazovat
a vkládat mezi ně vlastní poznámkové sloupce. Přejmenovat hlavičku ale nejde —
tím se sloupec ztratí.

Řádek, kterému chybí něco povinného, se **přeskočí** a vypíše se v poli
`preskoceno` i s důvodem. Zbytek tabulky projde.

## Záložka „reference"

| druh | médium | autor | datum | jazyk | odkaz |
|---|---|---|---|---|---|
| Recenze | Kapitál noviny | Michael Papcun | 16.4.2025 | SK | https://… |

Sloupce jsou ve stejném pořadí, v jakém se řádek čte na webu; odkaz je na
konci, protože vidět není — celý řádek na něj jen vede.

- **médium**, **druh** a **odkaz** jsou povinné
- **druh** z rozevírací nabídky: `Recenze`, `Rozhovor`, `Média`
- **odkaz** musí začínat `https://` — cokoli jiného se přeskočí (odkaz
  z tabulky jde rovnou do webu a typ `javascript:` by po kliknutí spustil kód)
- **datum** s kalendářem jako u koncertů; na webu se ukáže jen měsíc a rok.
  Profily médií (Full Moon, Rate Your Music) datum nemají — nech ho prázdné.
- **jazyk** z nabídky: `CZ`, `SK`, `EN`, `PL`

Pořadí řádků nehraje roli — web řadí od nejnovějšího a reference bez data
dává na konec.

## Fotky z Disku

Fotky do galerie se nenahrávají do Sheetu, ale do složky na Disku
simansky.dan@gmail.com. Skript z ní vydá seznam a build si fotky stáhne
a zmenší.

```
Jakub Šimanský - Galerie
├── Fotky
│   ├── Kristína Ozimaničová     ← složka = jméno fotografa
│   │   ├── koncert-cargo.jpg
│   │   └── …
│   ├── Libor Galia
│   └── Bez autora               ← fotky bez uvedeného fotografa
├── Video                        (zatím se nečte, viz níž)
└── Art                          (zatím se nečte, bude jako Fotky)
```

- **Nový fotograf = nová složka ve Fotkách**, pojmenovaná přesně tak, jak má
  jméno stát na webu (i s diakritikou) — objeví se jako „foto: …".
- Fotky bez autora patří do složky **Bez autora** (projde i **Vlastní**),
  případně rovnou do Fotek. U nich se jméno neukáže.
- Jen jedna úroveň: složka ve složce fotografa se už nečte.
- Formát je jedno (JPG, PNG, HEIC z iPhonu…), nahrávají se originály —
  zmenšení a převod na WebP obstará build. Ten z fotek zároveň smaže
  metadata, včetně GPS polohy.
- Na webu jsou fotky od naposledy nahrané.
- Složka **Fotky** se musí jmenovat takhle (velikost písmen a diakritika
  nevadí). Po přejmenování ji skript nenajde.

**Art** bude fungovat stejně jako Fotky — složky podle autorů, originály.
Až bude na webu, stačí ho ve skriptu připsat do `IMAGE_SECTIONS`.

**Video** takhle fungovat nemůže. Soubory mají stovky MB, Apps Script vydá
najednou zhruba 50 MB a GitHub Pages nechce soubory nad 100 MB — video by
v každém kroku narazilo. Videa patří na YouTube (nebo Vimeo) a web je
jen vloží; odkazy může Jakub psát do Sheetu jako reference.

Nepovinná záložka **fotky** v Sheetu u konkrétní fotky přepíše autora,
doplní popis nebo určí výřez. Páruje se podle názvu souboru bez přípony
a stačí vyplnit, co je potřeba — ostatní buňky nech prázdné:

| soubor | autor | popis | popis en | výřez |
|---|---|---|---|---|
| simansky-vrbaak | | Jakub opřený o zeď s graffiti | Jakub leaning against a wall | dole |

- **popis** a **popis en** čte odečítač obrazovky nevidomým; bez nich se
  fotka ohlásí jen jako „Jakub Šimanský"
- **výřez**: galerie ukazuje fotky ve čtvercích. Fotka na výšku se ořízne
  kousek od horního okraje (tam bývá hlava), na šířku na střed. Když to
  u některé nesedí, napiš, která část má zůstat vidět: `nahoře`, `dole`,
  `vlevo`, `vpravo` nebo `střed`. Hodí se z toho udělat rozevírací nabídku.
  Celá fotka je vidět vždycky po rozkliknutí.

Skript z Disku vydá jen obrázek, který leží ve Fotkách nebo ve složce
fotografa v nich. Endpoint je veřejný a běží pod Danielovým účtem — bez téhle
kontroly by se přes něj dal stáhnout kterýkoli soubor z Disku.

### Jak se fotka dostane na web

1. **Jakub** nahraje originál do Fotky → složka fotografa.
2. **GitHub Action** běží každé ráno v 6:00, nebo ručně přes Actions → Deploy
   na GitHub Pages → Run workflow. Zeptá se tohohle skriptu, co je ve
   Fotkách, a dostane seznam: ID, název, autora, datum změny a řádek ze
   záložky fotky, pokud tam je.
3. **Nové nebo změněné fotky** si stáhne jednu po druhé přes `?photo=ID`.
   Fotky, které už zná (stejné ID a datum změny), přeskočí — originály mají
   desítky MB a skript má denní kvóty.
4. **Knihovna sharp** každou staženou fotku:
   - natočí podle údaje z foťáku (fotky z mobilu by jinak ležely na boku)
   - zmenší na 1600 px po delší straně
   - smaže metadata, včetně GPS polohy
   - uloží jako WebP — z 15 MB originálu je kolem 150 kB

   HEIC z iPhonu sharp sám neumí (kodek je zatížený patenty), rozbalí ho
   předtím knihovna heic-decode.
5. Action zmenšené fotky (`public/photos/gallery/`) a jejich seznam
   (`src/data/generated/photos.json`) **commitne do repozitáře**, stejně
   jako koncerty. Když se příště stažení nepovede, web postaví z posledního
   dobrého stavu.
6. **Web** podle seznamu poskládá galerii, od naposledy nahrané fotky.

Na webu se tedy nová fotka objeví až po dalším běhu Action, ne hned po
nahrání. Smazaná fotka zmizí stejně — při dalším běhu i z repozitáře.

Když se jedna fotka nepovede (rozbitý soubor, výpadek), přeskočí se
a v protokolu Action je důvod. Ostatní fotky, koncerty i nasazení jedou dál.

**Ořez do čtverce** se s fotkou samotnou neděje — soubor zůstává celý
a po rozkliknutí je vidět vcelku. Pro čtverec v mřížce se jen uloží, kterou
část ukázat (CSS `object-position`): na výšku kousek od horního okraje, na
šířku střed, nebo co je ve sloupci **výřez**. Automatické hledání výřezu
bylo vyzkoušené, ale u dvou ze šesti fotek mířilo na okna nebo keř místo na
Jakuba.

## Nasazení

1. V Sheetu **Rozšíření → Apps Script**. Musí to být odsud — skript se tím
   naváže na tabulku. Samostatný projekt založený na script.google.com by
   neměl k jaké tabulce sáhnout a spadl by na `SpreadsheetApp.getActive()`.
2. Obsah `Code.gs` vložit do editoru (přepsat, co tam je) a **uložit**.
   Dokud se neuloží, editor v liště nenabídne žádné funkce.
3. Vybrat funkci **nahled** a **Spustit** — poprvé si to vyžádá povolení
   (k tabulce a k Disku). V protokolu se objeví totéž, co pak vrátí endpoint;
   tímhle se dá ověřit tabulka ještě před nasazením. Funkce **previewPhotos**
   vypíše, co našla ve Fotkách a komu fotky připsala.
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

Totéž platí obráceně: když se na webu změní, jaká pole koncerty nebo reference
mají nebo jak se sloupce jmenují, musí se upravit i tenhle skript — viz
`CLAUDE.md` v kořeni repozitáře.
