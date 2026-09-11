/**
 * Endpoint pro web jakubsimansky.com — vrací obsah záložek „koncerty"
 * a „reference" jako JSON.
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
  }
};

/**
 * Co v „interpretu" znamená totéž jako prázdno. Web má pro sólo vlastní
 * štítek, který umí i anglicky — kdyby se sem propsalo natvrdo napsané
 * „Solo", zůstalo by česky i v anglické verzi.
 */
var SOLO = ['solo'];

/** Hodnoty sloupce „druh" → klíč, kterému rozumí web. */
var DRUHY = { recenze: 'review', rozhovor: 'interview', media: 'media' };

function doGet() {
  var k = nactiZalozku(ZALOZKY.koncerty, prevedKoncert);
  var r = nactiZalozku(ZALOZKY.reference, prevedReferenci);

  var vysledek = {
    koncerty: k.polozky,
    preskoceno: k.preskoceno,
    reference: r,
    vygenerovano: ted()
  };
  if (k.chyba) vysledek.chyba = k.chyba;

  return ContentService
    .createTextOutput(JSON.stringify(vysledek, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
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
