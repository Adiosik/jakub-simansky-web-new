/**
 * Stáhne koncerty a reference z Apps Scriptu a zapíše je do
 * src/data/generated/koncerty.json a src/data/generated/reference.json.
 *
 * Pouští se v GitHub Action před buildem (`npm run data`), ne jako součást
 * `npm run build` — místní build tak funguje bez přístupu k Sheetu a bere
 * commitnutá data.
 *
 * ZÁSADA: tenhle skript nesmí shodit nasazení. Když se data nepodaří stáhnout
 * nebo nedávají smysl, nechá na disku commitnutý soubor a skončí v pořádku.
 * Web pak vydeployuje poslední známý stav místo prázdné sekce. Chyba se
 * vypíše nahlas do protokolu Action, ale nezastaví ji.
 *
 * Koncerty a reference se zpracují **každé zvlášť**: když je rozbitá jedna
 * záložka, druhá se zapíše normálně.
 *
 * Adresa je v proměnné SHEET_URL (GitHub Secrets). Není to tajemství v tom
 * smyslu, že by data byla citlivá — jsou stejně veřejná. Jde o to, že veřejně
 * známý endpoint se dá tlouct požadavky a Apps Script má denní kvóty; jakmile
 * se vyčerpají, přestane fungovat i nám.
 */
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOREN = join(dirname(fileURLToPath(import.meta.url)), "..");
const CIL = join(KOREN, "src/data/generated/koncerty.json");
const REFERENCES_FILE = join(KOREN, "src/data/generated/reference.json");
const CASOVY_LIMIT = 20_000;

/** RRRR-MM-DD, a zároveň den, který existuje (regex sám pustí i 2026-02-31). */
function isIsoDate(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
}

/**
 * Kontrola jednoho koncertu. Musí sedět s typem `Gig` v src/data/concerts.ts
 * a s tím, co posílá apps-script/Code.gs — když se změní jedno, musí se
 * změnit všechny tři (viz CLAUDE.md).
 */
function zkontroluj(zaznam, poradi) {
  if (typeof zaznam !== "object" || zaznam === null) {
    return { chyba: `záznam ${poradi} není objekt` };
  }
  const { date, city, venue, band } = zaznam;

  if (!isIsoDate(date)) {
    return { chyba: `záznam ${poradi}: datum „${date}" není platné RRRR-MM-DD` };
  }
  if (typeof city !== "string" || !city.trim()) {
    return { chyba: `záznam ${poradi}: chybí město` };
  }
  if (typeof venue !== "string" || !venue.trim()) {
    return { chyba: `záznam ${poradi}: chybí místo konání` };
  }

  const cisty = { date, city: city.trim(), venue: venue.trim() };
  if (typeof band === "string" && band.trim()) cisty.band = band.trim();
  return { zaznam: cisty };
}

const REFERENCE_KINDS = new Set(["review", "interview", "media"]);

/**
 * Kontrola jedné reference. Musí sedět s typem `Reference`
 * v src/data/references.ts a s tím, co posílá apps-script/Code.gs.
 */
function checkReference(item, position) {
  if (typeof item !== "object" || item === null) {
    return { error: `položka ${position} není objekt` };
  }
  const { source, kind, url, date, author, orig } = item;

  if (typeof source !== "string" || !source.trim()) {
    return { error: `položka ${position}: chybí médium` };
  }
  if (!REFERENCE_KINDS.has(kind)) {
    return { error: `položka ${position}: neznámý druh „${kind}"` };
  }
  // Kontroluje to i Apps Script, tady schválně znovu: tenhle skript je poslední
  // brána před webem. Odkaz z tabulky jde rovnou do `href`, a cokoli jiného
  // než webová adresa by bylo rozbité — `javascript:` by po kliknutí dokonce
  // spustil kód.
  let parsed = null;
  try { parsed = new URL(url); } catch { /* neplatná adresa */ }
  if (!parsed || !["http:", "https:"].includes(parsed.protocol)) {
    return { error: `položka ${position}: odkaz „${url}" není webová adresa` };
  }
  if (date !== undefined && !isIsoDate(date)) {
    return { error: `položka ${position}: datum „${date}" není platné RRRR-MM-DD` };
  }

  const value = { source: source.trim(), kind, url: parsed.href };
  if (date) value.date = date;
  if (typeof author === "string" && author.trim()) value.author = author.trim();
  if (typeof orig === "string" && orig.trim()) value.orig = orig.trim().toUpperCase();
  return { value };
}

/**
 * Důvod, proč se má nechat commitnutá záloha. Vyhazuje se jako výjimka.
 *
 * Není to `process.exit(0)` schválně: ten Node ukončí okamžitě, i když je
 * rozečtená odpověď ze sítě, a na Windows kvůli tomu spadne na chybě libuv
 * s návratovým kódem 127. V Action by takový pád zastavil nasazení — tedy
 * přesně to, čemu se tenhle skript má vyhýbat.
 */
class Zaloha extends Error {}

function nechatZalohu(duvod) {
  throw new Zaloha(duvod);
}

/** Zapíše jen při změně, ať Action necommituje soubor, který se nezměnil. */
async function writeIfChanged(file, content, label) {
  const previous = await readFile(file, "utf8").catch(() => "");
  const next = JSON.stringify(content, null, 2) + "\n";
  if (previous === next) {
    console.log(`✓ ${label}, beze změny.`);
  } else {
    await writeFile(file, next);
    console.log(`✓ Zapsáno: ${label}.`);
  }
}

/** Stáhne a rozparsuje odpověď — společné pro obě záložky. */
async function fetchSheet() {
  const adresa = process.env.SHEET_URL;
  if (!adresa) nechatZalohu("SHEET_URL není nastavená.");

  let odpoved;
  try {
    odpoved = await fetch(adresa, {
      redirect: "follow", // Apps Script přesměrovává na script.googleusercontent.com
      signal: AbortSignal.timeout(CASOVY_LIMIT),
    });
  } catch (e) {
    nechatZalohu(`Stažení selhalo: ${e.message}`);
  }
  if (!odpoved.ok) {
    nechatZalohu(`Endpoint vrátil ${odpoved.status} ${odpoved.statusText}.`);
  }

  const text = await odpoved.text();
  try {
    return JSON.parse(text);
  } catch {
    // typicky přihlašovací stránka Googlu, když je implementace nastavená
    // na „jen já" místo „kdokoli"
    nechatZalohu(`Odpověď není JSON. Začátek: ${text.slice(0, 120)}`);
  }
}

async function processConcerts(data) {
  if (data.chyba) nechatZalohu(`Skript v Sheetu hlásí: ${data.chyba}`);
  if (!Array.isArray(data.koncerty)) nechatZalohu("Odpověď nemá pole „koncerty“.");

  // řádky, které zahodil už skript v Sheetu — ať je vidět i v protokolu Action
  for (const { radek, duvod } of data.preskoceno ?? []) {
    console.warn(`⚠  Koncerty: Sheet přeskočil řádek ${radek}: ${duvod}`);
  }

  const koncerty = [];
  for (const [i, zaznam] of data.koncerty.entries()) {
    const { zaznam: cisty, chyba } = zkontroluj(zaznam, i + 1);
    if (chyba) console.warn(`⚠  Koncert přeskočen — ${chyba}`);
    else koncerty.push(cisty);
  }

  if (koncerty.length === 0) {
    // Prázdno je legitimní stav (žádné vypsané termíny), ale je taky to, co
    // uvidíme, kdyby někdo omylem smazal obsah tabulky. Proto nahlas.
    console.warn("⚠  Ze Sheetu nepřišel ani jeden platný koncert.");
  }

  await writeIfChanged(CIL, {
    vygenerovano: data.vygenerovano ?? new Date().toISOString(),
    koncerty,
  }, `${koncerty.length} koncertů`);
}

async function processReferences(data) {
  const section = data.reference;
  // starší verze skriptu v Sheetu reference neposílá
  if (section === undefined) nechatZalohu("Sheet reference neposílá — běží tam starší verze skriptu.");
  if (section.chyba) nechatZalohu(`Skript v Sheetu hlásí: ${section.chyba}`);
  if (!Array.isArray(section.polozky)) nechatZalohu("Odpověď nemá pole „reference.polozky“.");

  for (const { radek, duvod } of section.preskoceno ?? []) {
    console.warn(`⚠  Reference: Sheet přeskočil řádek ${radek}: ${duvod}`);
  }

  const references = [];
  for (const [i, item] of section.polozky.entries()) {
    const { value, error } = checkReference(item, i + 1);
    if (error) console.warn(`⚠  Reference přeskočena — ${error}`);
    else references.push(value);
  }

  // U koncertů je prázdno běžné, u referencí ne — ohlasy se z webu nestahují.
  // Prázdný seznam tu skoro jistě znamená omylem vymazanou záložku, tak
  // ho nezapíšeme a necháme zálohu.
  if (references.length === 0) nechatZalohu("Ze Sheetu nepřišla ani jedna platná reference.");

  await writeIfChanged(REFERENCES_FILE, {
    generatedAt: data.vygenerovano ?? new Date().toISOString(),
    references,
  }, `${references.length} referencí`);
}

/** Chybu vypíše do protokolu; nasazení tím nekončí. */
function report(error, label) {
  if (error instanceof Zaloha) console.warn(`⚠  ${label}: ${error.message}`);
  else console.warn(`⚠  ${label}: nečekaná chyba: ${error.stack ?? error}`);
  console.warn(`   ${label}: nechávám commitnutá data, nasazení pokračuje.`);
}

let data = null;
try {
  data = await fetchSheet();
} catch (e) {
  report(e, "Koncerty i reference");
}

if (data) {
  for (const [label, handler] of [["Koncerty", processConcerts], ["Reference", processReferences]]) {
    try {
      await handler(data);
    } catch (e) {
      report(e, label);
    }
  }
}

process.exitCode = 0;
