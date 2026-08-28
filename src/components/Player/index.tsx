/**
 * Player — poslech celých desek přes vložený přehrávač Bandcampu.
 *
 * Rámeček se načítá rovnou se stránkou (vědomé rozhodnutí): `iframe`
 * z bandcamp.com tím pádem dostane IP adresu návštěvníka a nastaví cookies
 * i tomu, kdo si nic nepustí. Kdyby to mělo být zase až na kliknutí, stačí
 * `iframe` schovat za stav a tlačítko — v historii gitu to je.
 */
import Box from "@mui/material/Box";
import { ALBUMS } from "../../data/albums";
import type { Translation } from "../../language";
import AlbumCover from "./AlbumCover";
import * as styles from "./styles";

type Props = {
  texts: Translation;
  albumIdx: number;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Přehrávač je vždy bílý — ověřeno pokusem s `bgcol=ff0000`, který se nijak
 * neprojevil. `bgcol` dnes Bandcamp ignoruje a zvenčí do cizího `iframe`
 * nesáhneme. Necháváme ho tu i tak, kdyby ho zase začal respektovat.
 * `linkcol` funguje. Seznam skladeb nezobrazujeme (`tracklist=false`) — web ho
 * má u každé desky v sekci Desky a přehrávač je díky tomu 120 px místo 470.
 * Obal schováváme taky (`artwork=none`), protože stejný je hned nad rámečkem
 * v naší hlavičce s přepínáním alb a dvakrát vedle sebe působil zdvojeně.
 */
const BGCOL = "e4e7de";
const LINKCOL = "a8843c";

const embedSrc = (id: string) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=${BGCOL}/linkcol=${LINKCOL}/artwork=none/tracklist=false/`;

export default function Player({ texts, albumIdx, onPrev, onNext }: Props) {
  const album = ALBUMS[albumIdx];

  return (
    <Box sx={styles.player}>
      <Box sx={styles.top}>
        <Box sx={styles.cover}><AlbumCover album={album} index={albumIdx} /></Box>
        <Box sx={styles.titles}>
          <Box sx={styles.title}>{album.artist ? album.artist + " — " : ""}{album.title}</Box>
          <Box sx={styles.sub}>{album.year} · {album.label}</Box>
        </Box>

        <Box sx={styles.navs}>
          <Box component="button" type="button" sx={styles.nav} onClick={onPrev} aria-label={texts.player.prevAlbum}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10l4-4 4 4" /></svg>
          </Box>
          <Box component="button" type="button" sx={styles.nav} onClick={onNext} aria-label={texts.player.nextAlbum}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
          </Box>
        </Box>
      </Box>

      {album.bandcampId && (
        <Box
          component="iframe"
          sx={styles.frame}
          src={embedSrc(album.bandcampId)}
          title={`${album.title} — Bandcamp`}
          loading="lazy"
          allow="autoplay; encrypted-media"
        />
      )}
    </Box>
  );
}
