/**
 * Stáhne koncerty a reference z Apps Scriptu a zapíše je do
 * src/data/generated/koncerty.json a src/data/generated/reference.json.
 * Fotky galerie stáhne z Disku (přes tentýž skript), zmenší je do
 * public/photos/gallery/ a jejich seznam zapíše do src/data/generated/photos.json.
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
 * Koncerty, reference a fotky se zpracují **každé zvlášť**: když je rozbitá
 * jedna část, ostatní se zapíšou normálně.
 *
 * Adresa je v proměnné SHEET_URL (GitHub Secrets). Není to tajemství v tom
 * smyslu, že by data byla citlivá — jsou stejně veřejná. Jde o to, že veřejně
 * známý endpoint se dá tlouct požadavky a Apps Script má denní kvóty; jakmile
 * se vyčerpají, přestane fungovat i nám.
 */
import { writeFile, readFile, readdir, mkdir, unlink, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOREN = join(dirname(fileURLToPath(import.meta.url)), "..");
const CIL = join(KOREN, "src/data/generated/koncerty.json");
const REFERENCES_FILE = join(KOREN, "src/data/generated/reference.json");
const PHOTOS_FILE = join(KOREN, "src/data/generated/photos.json");
const PHOTOS_DIR = join(KOREN, "public/photos/gallery");
/** cesta, pod kterou jsou fotky na webu */
const PHOTOS_URL = "/photos/gallery/";
const CASOVY_LIMIT = 20_000;
/** originál z foťáku má klidně 20 MB a přes Apps Script jde jako base64 */
const PHOTO_TIMEOUT = 120_000;
/** delší strana fotky na webu; víc nepotřebuje ani zvětšení v lightboxu */
const PHOTO_MAX_SIDE = 1600;
const PHOTO_QUALITY = 80;

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
 * Výřez do čtverce jako CSS `object-position`. Hodnoty z Apps Scriptu
 * (sloupec „výřez" v záložce fotky) říkají, která část fotky má zůstat vidět.
 */
const CROP_POSITIONS = {
  top: "50% 0%",
  bottom: "50% 100%",
  left: "0% 50%",
  right: "100% 50%",
  center: "50% 50%",
};

/**
 * Výřez, když ho nikdo neurčil. Na výšku kousek od horního okraje, protože
 * tam bývá hlava — střed by ji u postavy v celé výšce uřízl. Na šířku střed.
 * Zkoušené i automatické hledání výřezu (sharp attention/entropy), jenže
 * u dvou ze šesti fotek mířilo na okna nebo keř místo na Jakuba.
 */
function defaultPosition(width, height) {
  return height > width ? "50% 20%" : "50% 50%";
}

/**
 * Kontrola jedné fotky ze seznamu. ID jde do adresy i do názvu souboru,
 * takže projde jen tvar, jaký mají ID na Disku.
 */
function checkPhoto(item, position) {
  if (typeof item !== "object" || item === null) {
    return { error: `položka ${position} není objekt` };
  }
  const { id, name, mimeType, updated, author, alt, altEn, crop } = item;

  if (typeof id !== "string" || !/^[A-Za-z0-9_-]{10,100}$/.test(id)) {
    return { error: `položka ${position}: neplatné ID „${id}"` };
  }
  if (typeof name !== "string" || typeof mimeType !== "string" || typeof updated !== "string") {
    return { error: `položka ${position} (${id}): chybí název, typ nebo datum změny` };
  }
  if (crop !== undefined && !(crop in CROP_POSITIONS)) {
    return { error: `${name}: neznámý výřez „${crop}"` };
  }

  const value = { id, name, mimeType, updated };
  if (typeof author === "string" && author.trim()) value.author = author.trim();
  if (typeof alt === "string" && alt.trim()) value.alt = alt.trim();
  if (typeof altEn === "string" && altEn.trim()) value.altEn = altEn.trim();
  if (crop) value.crop = crop;
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

/** Jedna fotka z Disku jako Buffer. Apps Script ji vydá jako base64 v JSONu. */
async function downloadPhoto(id) {
  const url = new URL(process.env.SHEET_URL);
  url.searchParams.set("photo", id);
  const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(PHOTO_TIMEOUT) });
  if (!response.ok) throw new Error(`endpoint vrátil ${response.status} ${response.statusText}`);
  const body = await response.json();
  if (body.error) throw new Error(body.error);
  if (body.id !== id || typeof body.data !== "string") throw new Error("odpověď k fotce nesedí");
  return Buffer.from(body.data, "base64");
}

/**
 * Zmenší fotku a uloží ji jako WebP. Metadata sharp zahodí sám — s nimi by
 * na web odešla i GPS poloha, kde fotka vznikla.
 */
async function convertPhoto(sharp, input, mimeType, file) {
  let image;
  if (/hei[cf]/i.test(mimeType)) {
    // HEIC z iPhonu sharp z npm neumí (patenty na kodek HEVC). Rozbalí ho
    // heic-decode (libheif přeložený do JS) a sharp dostane surové pixely.
    // Otočení si libheif bere ze souboru sám.
    const { default: decode } = await import("heic-decode");
    const { width, height, data } = await decode({ buffer: input });
    image = sharp(Buffer.from(data.buffer), { raw: { width, height, channels: 4 } });
  } else {
    image = sharp(input);
  }
  const { data, info } = await image
    // fotky z mobilu leží na boku a natočení mají jen v EXIFu, který se zahodí
    .rotate()
    .resize(PHOTO_MAX_SIDE, PHOTO_MAX_SIDE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: PHOTO_QUALITY })
    .toBuffer({ resolveWithObject: true });
  // až hotový soubor — kdyby převod spadl uprostřed, nezůstane na disku půlka
  await writeFile(file, data);
  return { width: info.width, height: info.height };
}

const exists = (file) => access(file).then(() => true, () => false);

async function processPhotos(data) {
  const section = data.photos;
  if (section === undefined) nechatZalohu("Sheet fotky neposílá — běží tam starší verze skriptu.");
  if (section.error) nechatZalohu(`Skript v Sheetu hlásí: ${section.error}`);
  if (!Array.isArray(section.items)) nechatZalohu("Odpověď nemá pole „photos.items“.");

  for (const { radek, duvod } of section.preskoceno ?? []) {
    console.warn(`⚠  Fotky: Sheet přeskočil řádek ${radek} v záložce fotky: ${duvod}`);
  }

  // Až tady, ne nahoře v souboru: sharp je nativní knihovna, a kdyby se na
  // stroji s buildem nenačetla, spadl by celý skript i s koncerty.
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch (e) {
    nechatZalohu(`Knihovna sharp nejde načíst: ${e.message}`);
  }

  // Minulé stažení. Fotka se stejným ID a datem změny se nestahuje znovu —
  // jinak by každý build tahal desítky MB originálů a pálil kvóty Apps Scriptu.
  const previousFile = JSON.parse(await readFile(PHOTOS_FILE, "utf8").catch(() => "{}"));
  const previous = new Map((previousFile.photos ?? []).map((p) => [p.id, p]));

  await mkdir(PHOTOS_DIR, { recursive: true });
  const photos = [];
  let downloaded = 0;

  for (const [i, item] of section.items.entries()) {
    const { value, error } = checkPhoto(item, i + 1);
    if (error) {
      console.warn(`⚠  Fotka přeskočena — ${error}`);
      continue;
    }
    const file = join(PHOTOS_DIR, `${value.id}.webp`);
    const cached = previous.get(value.id);

    let size;
    if (cached && cached.updated === value.updated && await exists(file)) {
      size = { width: cached.width, height: cached.height };
    } else {
      try {
        size = await convertPhoto(sharp, await downloadPhoto(value.id), value.mimeType, file);
        downloaded++;
        console.log(`   ↓ ${value.name} (${size.width}×${size.height})`);
      } catch (e) {
        console.warn(`⚠  Fotka ${value.name} přeskočena — ${e.message}`);
        // nová verze nejde stáhnout, ale starou máme — lepší než nic
        if (cached && await exists(file)) photos.push(cached);
        continue;
      }
    }

    const photo = {
      id: value.id,
      name: value.name,
      src: `${PHOTOS_URL}${value.id}.webp`,
      width: size.width,
      height: size.height,
      position: CROP_POSITIONS[value.crop] ?? defaultPosition(size.width, size.height),
      updated: value.updated,
    };
    if (value.author) photo.author = value.author;
    if (value.alt) photo.alt = value.alt;
    if (value.altEn) photo.altEn = value.altEn;
    photos.push(photo);
  }

  // Stejně jako u referencí: prázdná galerie skoro jistě znamená chybu
  // (přesunutá nebo přejmenovaná složka), ne záměr.
  if (photos.length === 0) nechatZalohu("Z Disku nepřišla ani jedna použitelná fotka.");

  await writeIfChanged(PHOTOS_FILE, { photos }, `${photos.length} fotek, staženo ${downloaded}`);

  // Až po zápisu seznamu: soubory fotek, které z Disku zmizely, pryč, ať se
  // v repozitáři nehromadí. Jen v naší složce a jen naše .webp.
  const keep = new Set(photos.map((p) => `${p.id}.webp`));
  for (const name of await readdir(PHOTOS_DIR)) {
    if (name.endsWith(".webp") && !keep.has(name)) {
      await unlink(join(PHOTOS_DIR, name));
      console.log(`   ✗ smazána fotka ${name}, na Disku už není`);
    }
  }
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
  report(e, "Koncerty, reference i fotky");
}

if (data) {
  const handlers = [["Koncerty", processConcerts], ["Reference", processReferences], ["Fotky", processPhotos]];
  for (const [label, handler] of handlers) {
    try {
      await handler(data);
    } catch (e) {
      report(e, label);
    }
  }
}

process.exitCode = 0;
