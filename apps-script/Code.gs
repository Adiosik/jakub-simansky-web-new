/**
 * Endpoint pro web jakubsimansky.com — vrací obsah záložky „koncerty" jako JSON.
 *
 * Tenhle soubor je kopie. Skript ve skutečnosti žije uvnitř Google Sheetu
 * (Rozšíření → Apps Script) a tady leží proto, aby byl verzovaný a šlo se
 * podívat, co endpoint dělá, bez přihlašování do Googlu. Když se tu něco změní,
 * musí se to do Sheetu překopírovat a **nasadit nová verze** — viz README.md.
 *
 * Zásada: endpoint je věrný výpis tabulky, nic nefiltruje ani neřadí. Které
 * koncerty se ukážou (nadcházející, nejbližší tři) rozhoduje až web, protože
 * to má počítat podle dne, kdy se stránka dívá, ne podle dne posledního buildu.
 */

/** Název záložky v tabulce. */
var ZALOZKA = 'koncerty';

/**
 * Sloupce, které skript hledá. Hledá je **podle názvu v hlavičce, ne podle
 * pořadí** — sloupce v tabulce se tak dají přehazovat a vkládat mezi ně vlastní
 * poznámky, aniž by se cokoli rozbilo. Přejmenování hlavičky rozbije.
 */
var SLOUPCE = {
  datum: 'date',
  mesto: 'city',
  mistokonani: 'venue',
  klub: 'venue',
  sal: 'venue',
  interpret: 'band',
  kapela: 'band',
  'skym': 'band'
};

/**
 * Co v „interpretu" znamená totéž jako prázdno. Web má pro sólo vlastní
 * štítek, který umí i anglicky — kdyby se sem propsalo natvrdo napsané
 * „Solo", zůstalo by česky i v anglické verzi.
 */
var SOLO = ['solo'];

/** Bez čeho nemá řádek smysl — chybí-li, přeskočí se. */
var POVINNE = ['date', 'city', 'venue'];

function doGet() {
  var vysledek = nactiKoncerty();
  return ContentService
    .createTextOutput(JSON.stringify(vysledek, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Srovná název hlavičky na tvar, který se dá porovnat: bez diakritiky, bez
 * mezer, malými písmeny. Díky tomu projde „Datum", „datum " i „DATUM“ stejně
 * a Jakub si nemusí hlídat, jak přesně to napsal.
 */
function klic(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function nactiKoncerty() {
  // Záložku hledáme přes `klic()`, takže projde „Koncerty" i „koncerty ".
  // Když se nenajde, vezmeme první — čerstvá tabulka má „List 1" a je
  // zbytečné kvůli tomu hlásit chybu. Do odpovědi napíšeme, ze které se
  // četlo, ať je při ladění jasno.
  var listy = SpreadsheetApp.getActive().getSheets();
  var list = null;
  for (var n = 0; n < listy.length; n++) {
    if (klic(listy[n].getName()) === klic(ZALOZKA)) { list = listy[n]; break; }
  }
  if (!list) list = listy[0];
  if (!list) {
    return { chyba: 'Tabulka nemá žádnou záložku.', koncerty: [] };
  }

  var radky = list.getDataRange().getValues();
  if (radky.length < 2) {
    return { koncerty: [], preskoceno: [], vygenerovano: ted() };
  }

  // hlavička → index sloupce
  var kdeJe = {};
  radky[0].forEach(function (nazev, i) {
    var pole = SLOUPCE[klic(nazev)];
    if (pole) kdeJe[pole] = i;
  });

  var chybi = POVINNE.filter(function (p) { return kdeJe[p] === undefined; });
  if (chybi.length) {
    return {
      chyba: 'V hlavičce chybí povinné sloupce: ' + chybi.join(', '),
      koncerty: []
    };
  }

  var pasmo = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  var koncerty = [];
  var preskoceno = [];

  for (var i = 1; i < radky.length; i++) {
    var radek = radky[i];

    // úplně prázdný řádek není chyba, tabulky jich mají na konci spoustu
    var prazdny = radek.every(function (b) { return b === '' || b === null; });
    if (prazdny) continue;

    var duvod = null;
    var datum = radek[kdeJe.date];
    var mesto = String(radek[kdeJe.city] || '').trim();
    var misto = String(radek[kdeJe.venue] || '').trim();

    if (!(datum instanceof Date) || isNaN(datum.getTime())) {
      duvod = 'sloupec datum není datum — naformátuj buňku jako datum, ne text';
    } else if (!mesto) {
      duvod = 'chybí město';
    } else if (!misto) {
      duvod = 'chybí místo';
    }

    if (duvod) {
      preskoceno.push({ radek: i + 1, duvod: duvod });
      continue;
    }

    var zaznam = {
      date: Utilities.formatDate(datum, pasmo, 'yyyy-MM-dd'),
      city: mesto,
      venue: misto
    };

    // prázdné „s kým" znamená sólo — štítek si doplní web sám
    if (kdeJe.band !== undefined) {
      var kapela = String(radek[kdeJe.band] || '').trim();
      if (kapela && SOLO.indexOf(klic(kapela)) === -1) zaznam.band = kapela;
    }

    koncerty.push(zaznam);
  }

  return {
    zalozka: list.getName(),
    koncerty: koncerty,
    preskoceno: preskoceno,
    vygenerovano: ted()
  };
}

function ted() {
  return Utilities.formatDate(new Date(), 'Etc/UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

/**
 * Ke spuštění přímo v editoru (Spustit → nahled). Vypíše do protokolu totéž,
 * co vrátí endpoint — rychlejší než pořád obnovovat adresu v prohlížeči.
 */
function nahled() {
  Logger.log(JSON.stringify(nactiKoncerty(), null, 2));
}
