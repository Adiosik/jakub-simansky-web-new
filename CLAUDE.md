# Poznámky k projektu

## Obsah z Google Sheetu

Koncerty se neberou ze zdrojáku, ale z Google Sheetu, který spravuje Daniel
a plní Jakub. Cesta je: Sheet → Apps Script (`apps-script/Code.gs`) → stažení
při buildu v GitHub Action → `src/data/generated/koncerty.json` → web.

**Když se mění cokoli, co ovlivňuje ten obsah, musí se to promítnout na obě
strany.** Konkrétně:

- přidání, přejmenování nebo zrušení pole v `Gig` (src/data/concerts.ts)
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

## Nasazení

Push do `main` spouští build a nasazení na https://jakubsimansky.com.
**Push vždy nech schválit Danielem**, nepouštěj ho z vlastní iniciativy.
