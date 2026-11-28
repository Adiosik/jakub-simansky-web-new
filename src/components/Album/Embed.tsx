/**
 * Embed — samotný rámeček přehrávače Bandcampu pro jedno album.
 *
 * Rámeček je vždy bílý — ověřeno pokusem s `bgcol=ff0000`, který se nijak
 * neprojevil. `bgcol` dnes Bandcamp ignoruje a zvenčí do cizího `iframe`
 * nesáhneme. Necháváme ho tu i tak, kdyby ho zase začal respektovat.
 * `linkcol` funguje. Seznam skladeb nezobrazujeme (`tracklist=false`) — web ho
 * má u každého alba vypsaný a rámeček je díky tomu 120 px místo 470.
 * Obal schováváme taky (`artwork=none`), je vždy hned nad ním.
 *
 * NAČÍTÁNÍ. Samotné `loading="lazy"` tu nestačilo: prohlížeč začne stahovat
 * až těsně u výřezu, takže přehrávač doskočil před očima ve chvíli, kdy na něj
 * uživatel dojel. Řešíme to třemi věcmi dohromady:
 *  1. místo je od začátku vyhrazené (obal má pevnou výšku), takže se stránka
 *     po načtení nikam neposune;
 *  2. stahovat se začne, až je album 800 px od výřezu, nebo při první
 *     interakci uživatele (viz níž) — do chvíle, než se na něj dojede, je
 *     obvykle hotovo;
 *  3. hotový rámeček se prolne, ne že by cvakl. Do té doby je na jeho místě
 *     průhledná plocha v barvě stránky, žádný bílý pruh.
 * Zároveň tím neplatíme za tři cizí `iframe` (kód Bandcampu i jejich Google
 * Tag Manager, dohromady asi 1,6 MB) hned při načtení stránky.
 */
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Album } from "../../data/albums";

/**
 * Rozměry rámečku — naměřené, ne odhadnuté. Přehrávač má vlastní pevné maximum
 * 700 px; nad ním se neroztáhne, jen kolem něj přibývá pozadí. Pod tuhle mez se
 * ale normálně zmenšuje, takže mu jde šířku předepsat. Výška 120 px platí pro
 * variantu bez seznamu skladeb (s ním je 470 px).
 */
export const EMBED_WIDTH = 700;
export const EMBED_HEIGHT = 120;

/** Jak daleko před výřezem (v px) se začne stahovat. */
const PREDSTIH = 800;

const BGCOL = "fba8cb";
const LINKCOL = "78334a";

/**
 * Pořadí stahování po první interakci. Tři přehrávače najednou si na pomalé
 * síti (mobil, 4G) dělí přenos a každý se objeví až po mnoha vteřinách —
 * včetně toho, ke kterému uživatel právě dojel. Proto jdou za sebou v pořadí
 * na stránce: další začne, až je předchozí načtený, nejpozději STAGGER_MAX ms
 * po tom, co se předchozí začal stahovat (ne od interakce — jinak by se při
 * pomalém prvním přehrávači rozjely všechny ostatní naráz).
 * Přehrávač blízko výřezu frontu přeskočí (spouštěč s předstihem níž).
 */
const STAGGER_MAX = 4000;

/** Jednorázové signály po albech: „začal se stahovat“ a „načetl se“. */
function signals() {
  const resolvers = new Map<number, () => void>();
  const promises = new Map<number, Promise<void>>();
  const wait = (order: number) => {
    if (!promises.has(order)) {
      promises.set(order, new Promise<void>((resolve) => resolvers.set(order, resolve)));
    }
    return promises.get(order)!;
  };
  const fire = (order: number) => { wait(order); resolvers.get(order)!(); };
  return { wait, fire };
}
const started = signals();
const loaded = signals();
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Kdy smí album na řadu: předchozí je načtené, nebo se stahuje už STAGGER_MAX. */
const turnOf = (order: number) =>
  started.wait(order - 1).then(() => Promise.race([loaded.wait(order - 1), delay(STAGGER_MAX)]));

const embedSrc = (id: string) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=${BGCOL}/linkcol=${LINKCOL}/artwork=none/tracklist=false/`;

type Props = {
  album: Album;
  /** pořadí alba na stránce — určuje frontu stahování po první interakci */
  order: number;
  sx?: SxProps<Theme>;
};

export default function Embed({ album, order, sx }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [stahovat, setStahovat] = useState(false);
  const [nacteno, setNacteno] = useState(false);

  useEffect(() => {
    if (stahovat) return;
    const el = ref.current;
    if (!el) return;

    // Co je při načtení už dost blízko, pustíme rovnou. Bez toho by album
    // u horního okraje stránky čekalo na pozorovatele, který u prvku
    // stojícího na místě nemusí nikdy dostat záznam — na stejnou past
    // narazilo odkrývání sekcí v SimanskyHero.
    const blizko = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight + PREDSTIH && r.bottom > -PREDSTIH;
    };
    if (!("IntersectionObserver" in window) || blizko()) {
      setStahovat(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStahovat(true);
          io.disconnect();
        }
      },
      { rootMargin: `${PREDSTIH}px 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stahovat]);

  /**
   * Druhý spouštěč: první interakce uživatele (scroll, dotyk, klik, klávesa)
   * stáhne všechna alba, i ta, ke kterým se ještě nedojelo — za sebou podle
   * fronty výš, ať první přehrávač nesdílí přenos s ostatními. Samotný
   * předstih před výřezem na mobilu nestačil — displej je nízký, 800 px je
   * sotva screen a půl a při rychlém scrollu by uživatel dojel k přehrávači
   * dřív, než se stáhne. Dřív to byl časovač 1,2 s po `load`; ten ale stahoval
   * i u návštěvníka, který jen kouká na úvod, a měření rychlosti (PageSpeed)
   * ho započítalo. Klik v menu na „hudba → alba“ je sám interakce, plynulý
   * scroll k albům pak dá přehrávačům zhruba vteřinu náskok.
   */
  useEffect(() => {
    if (stahovat) return;
    const START_EVENTS = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"] as const;
    let cancelled = false;
    const start = () => {
      START_EVENTS.forEach((ev) => window.removeEventListener(ev, start));
      if (order === 0) { setStahovat(true); return; }
      turnOf(order).then(() => { if (!cancelled) setStahovat(true); });
    };
    START_EVENTS.forEach((ev) => window.addEventListener(ev, start, { passive: true }));
    return () => {
      cancelled = true;
      START_EVENTS.forEach((ev) => window.removeEventListener(ev, start));
    };
  }, [stahovat, order]);

  /**
   * Pojistka k `onLoad`. U cizího rámečku se na tu událost nedá spolehnout
   * a kdyby nepřišla, zůstal by přehrávač načtený, ale neviditelný. Po dvou
   * vteřinách ho odkryjeme tak jako tak — to je horší varianta než prolnutí,
   * ale pořád lepší než prázdné místo.
   */
  // album bez přehrávače frontu nedrží; jinak ji pouští až skutečné
  // `onLoad` (pojistka 2 s jen odkrývá, frontu hlídá STAGGER_MAX)
  useEffect(() => {
    if (!album.bandcampId) { started.fire(order); loaded.fire(order); }
  }, [order, album.bandcampId]);

  // začátek stahování (z jakéhokoli spouštěče) odpočítává frontu dalšího alba
  useEffect(() => {
    if (stahovat) started.fire(order);
  }, [stahovat, order]);

  useEffect(() => {
    if (!stahovat || nacteno) return;
    const id = setTimeout(() => setNacteno(true), 2000);
    return () => clearTimeout(id);
  }, [stahovat, nacteno]);

  if (!album.bandcampId) return null;

  return (
    <Box
      ref={ref}
      sx={{
        width: `min(100%, ${EMBED_WIDTH}px)`,
        height: EMBED_HEIGHT,
        // Podklad průhledný, tedy v barvě stránky ve světlém i tmavém režimu.
        // Dřív tu byla bílá (přehrávač sám bílý je), jenže pak na stránce
        // svítil prázdný bílý pruh, dokud se přehrávač nenačetl; bílá plocha
        // teď naroste prolnutím až s ním.
        background: "transparent",
        ...sx,
      }}
    >
      {stahovat && (
        <Box
          component="iframe"
          sx={{
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
            opacity: nacteno ? 1 : 0,
            transition: "opacity .35s ease",
          }}
          src={embedSrc(album.bandcampId)}
          title={`${album.title} — Bandcamp`}
          // bez loading="lazy": kdy stahovat, řídí spouštěče výš — prohlížeč
          // by jinak album dál od výřezu odložil a „všechna naráz“ by neplatilo
          onLoad={() => { setNacteno(true); loaded.fire(order); }}
          allow="autoplay; encrypted-media"
        />
      )}
    </Box>
  );
}
