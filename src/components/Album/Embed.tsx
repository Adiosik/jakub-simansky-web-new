/**
 * Embed — samotný rámeček přehrávače Bandcampu pro jedno album.
 * Používá ho jak přehrávač pod nadpisem sekce, tak jednotlivá alba ve výpisu.
 *
 * Rámeček je vždy bílý — ověřeno pokusem s `bgcol=ff0000`, který se nijak
 * neprojevil. `bgcol` dnes Bandcamp ignoruje a zvenčí do cizího `iframe`
 * nesáhneme. Necháváme ho tu i tak, kdyby ho zase začal respektovat.
 * `linkcol` funguje. Seznam skladeb nezobrazujeme (`tracklist=false`) — web ho
 * má u každého alba vypsaný a rámeček je díky tomu 120 px místo 470.
 * Obal schováváme taky (`artwork=none`), je vždy hned nad ním.
 */
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

const BGCOL = "fba8cb";
const LINKCOL = "78334a";

const embedSrc = (id: string) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=${BGCOL}/linkcol=${LINKCOL}/artwork=none/tracklist=false/`;

export default function Embed({ album, sx }: { album: Album; sx?: SxProps<Theme> }) {
  if (!album.bandcampId) return null;

  return (
    <Box
      component="iframe"
      sx={{ width: `min(100%, ${EMBED_WIDTH}px)`, height: EMBED_HEIGHT, border: 0, display: "block", ...sx }}
      src={embedSrc(album.bandcampId)}
      title={`${album.title} — Bandcamp`}
      loading="lazy"
      allow="autoplay; encrypted-media"
    />
  );
}
