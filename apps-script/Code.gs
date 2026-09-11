/**
 * Endpoint pro web jakubsimansky.com — vrací obsah záložek „koncerty"
 * a „reference" a seznam fotek ze složky galerie jako JSON. Na adrese
 * `?photo=<id>` vydá jednu fotku (base64) — ale jen z téhle složky.
 *
 * Tenhle soubor je kopie. Skript ve skutečnosti žije uvnitř Google Sheetu
 * (Rozšíření → Apps Script) a tady leží proto, aby byl verzovaný a šlo se
 * podívat, co endpoint dělá, bez přihlašování do Googlu. Když se tu něco změní,
 * musí se to do Sheetu překopírovat a **nasadit nová verze** — viz README.md.
 *
 * Zásada: endpoint je věrný výpis tabulky, nic nefiltruje ani neřadí. Které
 * koncerty se ukážou a v jakém pořadí jdou reference, rozhoduje až web.
 *
 * Každá záložka se čte samostatně: když je rozbitá jedna, druhá projde.
 * Koncerty zůstávají v odpovědi na nejvyšší úrovni (`koncerty`, `preskoceno`,
 * `chyba`) kvůli zpětné kompatibilitě — starší stahovací skript tak funguje
 * dál i s touhle verzí a obě strany jde aktualizovat v libovolném pořadí.
 */

/**
 * Popis záložek. Sloupce se hledají **podle názvu v hlavičce, ne podle
 * pořadí** — dají se tedy přehazovat a vkládat mezi ně vlastní poznámky.
 * Přejmenování hlavičky ale sloupec ztratí.
 */
var ZALOZKY = {
  koncerty: {
    nazev: 'koncerty',
    sloupce: {
      datum: 'date',
      mesto: 'city',
      mistokonani: 'venue', klub: 'venue', sal: 'venue',
      interpret: 'band', kapela: 'band', 'skym': 'band'
    },
    povinne: ['date', 'city', 'venue']
  },
  reference: {
    nazev: 'reference',
    sloupce: {
      medium: 'source',
      druh: 'kind',
      odkaz: 'url',
      datum: 'date',
      autor: 'author',
      jazyk: 'orig'
    },
    povinne: ['source', 'kind', 'url']
  },
  // Nepovinná — u konkrétní fotky přepíše autora, doplní popis nebo určí
  // výřez. Když chybí, fotky se na webu ukážou i tak.
  fotky: {
    nazev: 'fotky',
    sloupce: {
      soubor: 'file',
      autor: 'author',
      popis: 'alt',
      popisen: 'altEn',
      vyrez: 'crop'
    },
    povinne: ['file']
  }
};

/**
 * Složka „Jakub Šimanský - Galerie" na Disku simansky.dan@gmail.com.
 * Musí ležet na stejném účtu, pod kterým skript běží — jinak do ní nevidí.
 *
 * Uvnitř jsou podsložky podle sekcí webu: Fotky, Video, Art. V každé jsou
 * pak složky jednotlivých autorů.
 */
var GALLERY_FOLDER_ID = '1w7efvVKUsScCE0C0rqMyqR81I_deqe_B';

/**
 * Sekce galerie, které skript čte a ze kterých smí vydat soubor. Názvy
 * složek se porovnávají přes klic(), jako názvy záložek. Art bude fungovat
 * stejně jako Fotky — až bude na webu, stačí ho sem připsat a přidat do
 * doGet(). Video ne: soubory jsou na cestu přes Apps Script moc velké.
 */
var IMAGE_SECTIONS = ['fotky'];

/**
 * Podsložky, jejichž název NENÍ jméno autora — patří do nich fotky bez
 * uvedeného fotografa. Bez téhle výjimky by skript vzal název složky za
 * autora a pod fotkou by stálo „foto: Bez autora". Porovnává se přes
 * klic(), takže nezáleží na velikosti písmen ani diakritice.
 */
var NO_AUTHOR_FOLDERS = ['bezautora', 'vlastni'];

/** Co se ze složky pustí ven. Jiné soubory (PDF, dokumenty…) se ignorují. */
var IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

/**
 * Co v „interpretu" znamená totéž jako prázdno. Web má pro sólo vlastní
 * štítek, který umí i anglicky — kdyby se sem propsalo natvrdo napsané
 * „Solo", zůstalo by česky i v anglické verzi.
 */
var SOLO = ['solo'];

/**
 * Hodnoty sloupce „výřez" v záložce fotky. Galerie ukazuje fotky ve
 * čtvercích a výřez si build hledá sám; tohle je pro fotky, kde se netrefí.
 * Hodnota říká, která část fotky má zůstat vidět.
 */
var CROPS = { nahore: 'top', dole: 'bottom', vlevo: 'left', vpravo: 'right', stred: 'center' };

/** Hodnoty sloupce „druh" → klíč, kterému rozumí web. */
var DRUHY = { recenze: 'review', rozhovor: 'interview', media: 'media' };

function doGet(e) {
  var photoId = e && e.parameter && e.parameter.photo;
  if (photoId) return json(servePhoto(photoId));

  var k = nactiZalozku(ZALOZKY.koncerty, prevedKoncert);
  var r = nactiZalozku(ZALOZKY.reference, prevedReferenci);

  var vysledek = {
    koncerty: k.polozky,
    preskoceno: k.preskoceno,
    reference: r,
    photos: listImages('fotky'),
    vygenerovano: ted()
  };
  if (k.chyba) vysledek.chyba = k.chyba;
  return json(vysledek);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Seznam obrázků v jedné sekci galerie (Fotky, Art), od naposledy nahraného.
 *
 * Autor se bere z **podsložky**: fotky ve složce „Kristína Ozimaničová" mají
 * autorku Kristínu Ozimaničovou. Jakub tak nic nevypisuje, jen fotku přetáhne
 * do složky fotografa — a fotky přicházejí stejně po várkách z jednoho focení.
 * Fotky bez autora patří do složky „Bez autora" (nebo „Vlastní"), případně
 * rovnou do složky sekce.
 *
 * Nepovinná záložka „fotky" má přednost: dá se v ní u konkrétní fotky přepsat
 * autor nebo doplnit popis. Páruje se podle názvu souboru bez přípony, takže
 * stačí napsat „simansky-galia".
 *
 * Jen jedna úroveň podsložek — hlubší zanoření se nečte, ať je jasné, kde co je.
 */
function listImages(section) {
  var folder = sectionFolder(section);
  if (folder.error) return { error: folder.error, items: [] };
  var root = folder.folder;

  var meta = {};
  var captions = nactiZalozku(ZALOZKY.fotky, parsePhotoCaption);
  // chybějící záložka není chyba, je nepovinná
  (captions.polozky || []).forEach(function (p) { meta[withoutExtension(p.file)] = p; });

  var items = [];
  collectPhotos(root, null, meta, items);
  var subfolders = root.getFolders();
  while (subfolders.hasNext()) {
    var sub = subfolders.next();
    var name = sub.getName().trim();
    var folderAuthor = NO_AUTHOR_FOLDERS.indexOf(klic(name)) === -1 ? name : null;
    collectPhotos(sub, folderAuthor, meta, items);
  }
  items.sort(function (a, b) { return b.created.localeCompare(a.created); });
  return { items: items, preskoceno: captions.preskoceno || [] };
}

function collectPhotos(folder, folderAuthor, meta, items) {
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (IMAGE_TYPES.indexOf(file.getMimeType()) === -1) continue;
    var m = meta[withoutExtension(file.getName())] || {};
    var item = {
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      size: file.getSize(),
      // podle tohohle build pozná, jestli se fotka od posledně změnila
      updated: file.getLastUpdated().toISOString(),
      created: file.getDateCreated().toISOString()
    };
    // řádek v záložce má přednost před názvem podsložky
    var author = m.author || folderAuthor;
    if (author) item.author = author;
    if (m.alt) item.alt = m.alt;
    if (m.altEn) item.altEn = m.altEn;
    if (m.crop) item.crop = m.crop;
    items.push(item);
  }
}

/**
 * Složka sekce uvnitř galerie („fotky" → Fotky). Vrací { folder } nebo
 * { error }. Hledá se podle názvu, ne podle ID — Jakub ani Daniel tak
 * nemusí nic kopírovat, stačí, aby se složka jmenovala „Fotky".
 */
function sectionFolder(section) {
  var gallery;
  try {
    gallery = DriveApp.getFolderById(GALLERY_FOLDER_ID);
  } catch (err) {
    return { error: 'Složka galerie není dostupná — leží na stejném účtu jako skript?' };
  }
  var subfolders = gallery.getFolders();
  while (subfolders.hasNext()) {
    var sub = subfolders.next();
    if (klic(sub.getName()) === section) return { folder: sub };
  }
  return { error: 'V galerii chybí složka „' + section + '".' };
}

/**
 * Jedna fotka jako base64 — pro build, který si ji zmenší.
 *
 * BEZPEČNOST: skript je veřejně dostupný a běží pod Danielovým účtem. Kdyby
 * vydal soubor podle libovolného ID, dal by se jím stáhnout kterýkoli soubor
 * z jeho Disku. Proto jen obrázek, který leží v některé sekci z IMAGE_SECTIONS
 * nebo ve složce autora v ní.
 * A na „neexistuje" i „nesmíš" odpovídá stejně, aby nešlo zkoušením ID
 * zjišťovat, co na Disku je.
 */
function servePhoto(id) {
  var unavailable = { error: 'Fotka není k dispozici.' };
  var file;
  try { file = DriveApp.getFileById(id); } catch (err) { return unavailable; }
  if (IMAGE_TYPES.indexOf(file.getMimeType()) === -1) return unavailable;

  var allowed = IMAGE_SECTIONS.some(function (section) {
    var folder = sectionFolder(section);
    return !folder.error && isInFolder(file, folder.folder.getId());
  });
  if (!allowed) return unavailable;

  var blob = file.getBlob();
  return {
    id: id,
    mimeType: blob.getContentType(),
    data: Utilities.base64Encode(blob.getBytes())
  };
}

/**
 * Leží soubor ve složce — přímo v ní, nebo v některé její podsložce?
 * Hlouběji ne; stejně jako listImages() čte jen jednu úroveň.
 */
function isInFolder(file, folderId) {
  var parents = file.getParents();
  while (parents.hasNext()) {
    var parent = parents.next();
    if (parent.getId() === folderId) return true;
    var grandparents = parent.getParents();
    while (grandparents.hasNext()) {
      if (grandparents.next().getId() === folderId) return true;
    }
  }
  return false;
}

function withoutExtension(name) {
  return klic(String(name).replace(/\.[a-z0-9]+$/i, ''));
}

/**
 * Srovná text na tvar, který se dá porovnat: bez diakritiky, bez mezer,
 * malými písmeny. Díky tomu projde „Datum", „datum " i „DATUM" stejně
 * a Jakub si nemusí hlídat, jak přesně to napsal.
 */
function klic(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

/**
 * Přečte jednu záložku. Vrací { polozky, preskoceno } nebo { chyba }.
 *
 * Záložka se musí jmenovat přesně (až na velikost písmen a diakritiku).
 * Dřív se při nenalezení bral první list — se dvěma záložkami by to bylo
 * nebezpečné: po přejmenování koncertů by se jako koncerty načetly reference.
 */
function nactiZalozku(popis, prevod) {
  var listy = SpreadsheetApp.getActive().getSheets();
  var list = null;
  for (var n = 0; n < listy.length; n++) {
    if (klic(listy[n].getName()) === klic(popis.nazev)) { list = listy[n]; break; }
  }
  if (!list) {
    return { chyba: 'V tabulce chybí záložka „' + popis.nazev + '".', polozky: [], preskoceno: [] };
  }

  var radky = list.getDataRange().getValues();
  if (radky.length < 2) return { polozky: [], preskoceno: [] };

  // hlavička → index sloupce
  var kdeJe = {};
  radky[0].forEach(function (nazev, i) {
    var pole = popis.sloupce[klic(nazev)];
    if (pole) kdeJe[pole] = i;
  });

  var chybi = popis.povinne.filter(function (p) { return kdeJe[p] === undefined; });
  if (chybi.length) {
    return {
      chyba: 'V záložce „' + popis.nazev + '" chybí sloupce: ' + chybi.join(', '),
      polozky: [], preskoceno: []
    };
  }

  var pasmo = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  var polozky = [];
  var preskoceno = [];

  for (var i = 1; i < radky.length; i++) {
    var radek = radky[i];
    // úplně prázdný řádek není chyba, tabulky jich mají na konci spoustu
    if (radek.every(function (b) { return b === '' || b === null; })) continue;

    var bunka = function (pole) {
      return kdeJe[pole] === undefined ? '' : radek[kdeJe[pole]];
    };
    var vysledek = prevod(bunka, pasmo);
    if (vysledek.duvod) preskoceno.push({ radek: i + 1, duvod: vysledek.duvod });
    else polozky.push(vysledek.zaznam);
  }

  return { polozky: polozky, preskoceno: preskoceno };
}

function text(hodnota) {
  return String(hodnota === null || hodnota === undefined ? '' : hodnota).trim();
}

function jeDatum(hodnota) {
  return hodnota instanceof Date && !isNaN(hodnota.getTime());
}

function prevedKoncert(bunka, pasmo) {
  var datum = bunka('date');
  var mesto = text(bunka('city'));
  var misto = text(bunka('venue'));

  if (!jeDatum(datum)) return { duvod: 'sloupec datum není datum — naformátuj buňku jako datum, ne text' };
  if (!mesto) return { duvod: 'chybí město' };
  if (!misto) return { duvod: 'chybí místo' };

  var zaznam = {
    date: Utilities.formatDate(datum, pasmo, 'yyyy-MM-dd'),
    city: mesto,
    venue: misto
  };
  var kapela = text(bunka('band'));
  if (kapela && SOLO.indexOf(klic(kapela)) === -1) zaznam.band = kapela;
  return { zaznam: zaznam };
}

function prevedReferenci(bunka, pasmo) {
  var medium = text(bunka('source'));
  var druh = DRUHY[klic(bunka('kind'))];
  var odkaz = text(bunka('url'));
  var datum = bunka('date');

  if (!medium) return { duvod: 'chybí médium' };
  if (!druh) return { duvod: 'druh musí být Recenze, Rozhovor nebo Média' };
  // jen webové adresy — cokoli jiného by se na webu stalo rozbitým odkazem,
  // a odkaz typu „javascript:" by po kliknutí dokonce spustil kód
  if (!/^https?:\/\//i.test(odkaz)) return { duvod: 'odkaz musí začínat https://' };
  if (datum !== '' && !jeDatum(datum)) return { duvod: 'datum není datum — naformátuj buňku jako datum, nebo ji nech prázdnou' };

  var zaznam = { source: medium, kind: druh, url: odkaz };
  if (jeDatum(datum)) zaznam.date = Utilities.formatDate(datum, pasmo, 'yyyy-MM-dd');
  var autor = text(bunka('author'));
  if (autor) zaznam.author = autor;
  var jazyk = text(bunka('orig'));
  if (jazyk) zaznam.orig = jazyk.toUpperCase();
  return { zaznam: zaznam };
}

function parsePhotoCaption(cell) {
  var file = text(cell('file'));
  if (!file) return { duvod: 'chybí název souboru' };
  var record = { file: file };
  var author = text(cell('author'));
  if (author) record.author = author;
  var alt = text(cell('alt'));
  if (alt) record.alt = alt;
  var altEn = text(cell('altEn'));
  if (altEn) record.altEn = altEn;
  var crop = text(cell('crop'));
  if (crop) {
    if (!CROPS[klic(crop)]) return { duvod: 'neznámý výřez „' + crop + '" (nahoře, dole, vlevo, vpravo, střed)' };
    record.crop = CROPS[klic(crop)];
  }
  return { zaznam: record };
}

function ted() {
  return Utilities.formatDate(new Date(), 'Etc/UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

/**
 * Ke spuštění přímo v editoru (Spustit → nahled). Vypíše do protokolu totéž,
 * co vrátí endpoint — rychlejší než pořád obnovovat adresu v prohlížeči.
 */
function nahled() {
  Logger.log(doGet().getContent());
}

/**
 * Zkouška fotek: vypíše, co skript ve Fotkách našel a komu je připsal,
 * pak první fotku vydá — do protokolu jen typ a velikost, ne celý base64
 * (ten by ho zahltil). Nakonec zkusí, že soubor mimo Fotky neprojde.
 */
function previewPhotos() {
  var photos = listImages('fotky');
  if (!photos.items.length) { Logger.log('Ve Fotkách není žádná fotka. ' + (photos.error || '')); return; }
  photos.items.forEach(function (p) {
    Logger.log(p.name + ' — ' + (p.author ? 'foto: ' + p.author : 'bez autora'));
  });
  var first = photos.items[0];
  var result = servePhoto(first.id);
  Logger.log(result.error ? 'CHYBA: ' + result.error
    : 'OK: ' + first.name + ' — ' + result.mimeType + ', ' + Math.round(result.data.length * 3 / 4 / 1024) + ' kB');
  // soubor tabulky samotné leží mimo galerii — musí být odmítnut
  var outside = servePhoto(SpreadsheetApp.getActive().getId());
  Logger.log('Soubor mimo galerii: ' + (outside.error ? 'odmítnut, správně' : 'VYDÁN — CHYBA'));
}
