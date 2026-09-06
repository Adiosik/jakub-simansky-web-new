/**
 * Stáhne koncerty z Apps Scriptu a zapíše je do src/data/generated/koncerty.json.
 *
 * Pouští se v GitHub Action před buildem (`npm run data`), ne jako součást
 * `npm run build` — místní build tak funguje bez přístupu k Sheetu a bere
 * commitnutá data.
 *
 * ZÁSADA: tenhle skript nesmí shodit nasazení. Když se data nepodaří stáhnout
 * nebo nedávají smysl, nechá na disku ten commitnutý soubor a skončí v pořádku.
 * Web pak vydeployuje poslední známé koncerty místo prázdné sekce. Chyba se
 * vypíše nahlas do protokolu Action, ale nezastaví ji.
 *
 * Adresa je v proměnné SHEET_URL (GitHub Secrets). Není to tajemství v tom
 * smyslu, že by data byla citlivá — koncerty jsou stejně veřejné. Jde o to,
 * že veřejně známý endpoint se dá tlouct požadavky a Apps Script má denní
 * kvóty; jakmile se vyčerpají, přestane fungovat i nám.
 */
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOREN = join(dirname(fileURLToPath(import.meta.url)), "..");
const CIL = join(KOREN, "src/data/generated/koncerty.json");
const CASOVY_LIMIT = 20_000;

/**
 * Kontrola jednoho záznamu. Musí sedět s typem `Gig` v src/data/concerts.ts
 * a s tím, co posílá apps-script/Code.gs — když se změní jedno, musí se
 * změnit všechny tři (viz CLAUDE.md).
 */
function zkontroluj(zaznam, poradi) {
  if (typeof zaznam !== "object" || zaznam === null) {
    return { chyba: `záznam ${poradi} není objekt` };
  }
  const { date, city, venue, band } = zaznam;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
    return { chyba: `záznam ${poradi}: datum „${date}" není ve tvaru RRRR-MM-DD` };
  }
  // regulární výraz pustí i 2026-02-31; tohle odhalí, že takový den neexistuje
  if (new Date(date + "T00:00:00Z").toISOString().slice(0, 10) !== date) {
    return { chyba: `záznam ${poradi}: datum „${date}" neexistuje` };
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

/**
 * Důvod, proč se má nechat commitnutá záloha. Vyhazuje se jako výjimka
 * a chytá až úplně nahoře.
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

async function main() {
const adresa = process.env.SHEET_URL;
if (!adresa) {
  nechatZalohu("SHEET_URL není nastavená.");
}

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
let data;
try {
  data = JSON.parse(text);
} catch {
  // typicky přihlašovací stránka Googlu, když je implementace nastavená
  // na „jen já" místo „kdokoli"
  nechatZalohu(`Odpověď není JSON. Začátek: ${text.slice(0, 120)}`);
}

if (data.chyba) {
  nechatZalohu(`Skript v Sheetu hlásí: ${data.chyba}`);
}
if (!Array.isArray(data.koncerty)) {
  nechatZalohu("Odpověď nemá pole „koncerty“.");
}

// řádky, které zahodil už skript v Sheetu — ať je vidět i v protokolu Action
for (const { radek, duvod } of data.preskoceno ?? []) {
  console.warn(`⚠  Sheet přeskočil řádek ${radek}: ${duvod}`);
}

const koncerty = [];
for (const [i, zaznam] of data.koncerty.entries()) {
  const { zaznam: cisty, chyba } = zkontroluj(zaznam, i + 1);
  if (chyba) console.warn(`⚠  Přeskočeno — ${chyba}`);
  else koncerty.push(cisty);
}

if (koncerty.length === 0) {
  // Prázdno je legitimní stav (žádné vypsané termíny), ale je taky to, co
  // uvidíme, kdyby někdo omylem smazal obsah tabulky. Proto nahlas.
  console.warn("⚠  Ze Sheetu nepřišel ani jeden platný koncert.");
}

const vystup = {
  vygenerovano: data.vygenerovano ?? new Date().toISOString(),
  koncerty,
};

const puvodni = await readFile(CIL, "utf8").catch(() => "");
const novy = JSON.stringify(vystup, null, 2) + "\n";

if (puvodni === novy) {
  console.log(`✓ ${koncerty.length} koncertů, beze změny.`);
} else {
  await writeFile(CIL, novy);
  console.log(`✓ Zapsáno ${koncerty.length} koncertů do ${CIL}`);
}
}

try {
  await main();
} catch (e) {
  // I nečekaná chyba nechá nasazení běžet — web pak vyjede s posledními
  // známými koncerty. Do protokolu se ale vypíše celá, ať jde dohledat.
  if (e instanceof Zaloha) console.warn(`⚠  ${e.message}`);
  else console.warn(`⚠  Nečekaná chyba: ${e.stack ?? e}`);
  console.warn("   Nechávám commitnutá data, nasazení pokračuje.");
  process.exitCode = 0;
}
