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
 *  2. stahovat se začne, až je album 800 px od výřezu — do chvíle, než se na
 *     něj dojede, je obvykle hotovo;
 *  3. hotový rámeček se prolne, ne že by cvakl.
 * Zároveň tím pořád neplatíme za tři cizí `iframe` hned při načtení stránky.
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

const embedSrc = (id: string) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=${BGCOL}/linkcol=${LINKCOL}/artwork=none/tracklist=false/`;

export default function Embed({ album, sx }: { album: Album; sx?: SxProps<Theme> }) {
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
   * Druhý spouštěč: chvíli po dotažení stránky se doplní i alba, na která
   * se ještě nedojelo. Samotný předstih před výřezem na mobilu nestačil —
   * displej je nízký, takže 800 px je sotva screen a půl, a při rychlém
   * scrollu uživatel dojede k přehrávači dřív, než se stihne stáhnout.
   * Čeká se na `load`, aby si to nekonkurovalo s fonty a obaly alb.
   */
  useEffect(() => {
    if (stahovat) return;
    let id = 0;
    const naplanuj = () => { id = window.setTimeout(() => setStahovat(true), 1200); };
    if (document.readyState === "complete") naplanuj();
    else window.addEventListener("load", naplanuj, { once: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener("load", naplanuj);
    };
  }, [stahovat]);

  /**
   * Pojistka k `onLoad`. U cizího rámečku se na tu událost nedá spolehnout
   * a kdyby nepřišla, zůstal by přehrávač načtený, ale neviditelný. Po dvou
   * vteřinách ho odkryjeme tak jako tak — to je horší varianta než prolnutí,
   * ale pořád lepší než prázdné bílé pole.
   */
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
        // Podklad je bílý schválně, i v tmavém režimu: přehrávač sám bílý je,
        // takže s jakoukoli jinou barvou by po načtení blikl. Takhle na místě
        // od začátku stojí ta plocha, která tam nakonec bude.
        background: "#fff",
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
          loading="lazy"
          onLoad={() => setNacteno(true)}
          allow="autoplay; encrypted-media"
        />
      )}
    </Box>
  );
}
