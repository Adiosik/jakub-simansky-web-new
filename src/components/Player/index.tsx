/**
 * Player — přehrávač: play tlačítko (ozvučný otvor kytary), obal a přepínání
 * alb v horním řádku, pod tím seznam skladeb ve dvou sloupcích.
 */
import Box from "@mui/material/Box";
import { ALBUMS } from "../../data/albums";
import type { Translation } from "../../language";
import type { ArpeggioPlayer } from "./useArpeggioPlayer";
import SoundholeButton from "./SoundholeButton";
import AlbumCover from "./AlbumCover";
import * as styles from "./styles";

type Props = { texts: Translation; player: ArpeggioPlayer };

export default function Player({ texts, player }: Props) {
  const { playing, albumIdx, trackIdx, toggle, selectTrack, prev, next, prevTrack, nextTrack } = player;
  const album = ALBUMS[albumIdx];

  // rozdělení skladeb do dvou nezávislých sloupců (1…k vlevo, zbytek vpravo)
  const items = album.tracks.map((track, i) => ({ track, i }));
  const mid = Math.ceil(items.length / 2);
  const columns = [items.slice(0, mid), items.slice(mid)];

  return (
    <Box sx={styles.player}>
      <Box sx={styles.top}>
        <Box sx={styles.transport}>
          {/* Šipky se objeví až s přehráváním — dokud nic nehraje, nedrží místo. */}
          {playing && (
            <Box component="button" type="button" sx={styles.trackNav}
              onClick={prevTrack} aria-label={texts.player.prevTrack}>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <rect x="1.7" y="3.4" width="1.7" height="9.2" rx="0.3" />
                <path d="M9 3.4L3.8 8 9 12.6z" />
                <path d="M14 3.4L8.8 8 14 12.6z" />
              </svg>
            </Box>
          )}

          <Box component="button" type="button" className="sim-playbtn" sx={styles.playBtn}
            onClick={toggle} aria-pressed={playing} aria-label={playing ? texts.player.stop : texts.player.play}>
            <SoundholeButton playing={playing} />
          </Box>

          {playing && (
            <Box component="button" type="button" sx={styles.trackNav}
              onClick={nextTrack} aria-label={texts.player.nextTrack}>
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M2 3.4L7.2 8 2 12.6z" />
                <path d="M7 3.4L12.2 8 7 12.6z" />
                <rect x="12.6" y="3.4" width="1.7" height="9.2" rx="0.3" />
              </svg>
            </Box>
          )}
        </Box>

        <Box sx={styles.cover}><AlbumCover album={album} index={albumIdx} /></Box>
        <Box sx={styles.titles}>
          <Box sx={styles.title}>{album.artist ? album.artist + " — " : ""}{album.title}</Box>
          <Box sx={styles.sub}>{album.year} · {album.label}</Box>
          {/* řádek je v layoutu vždy, ať lišta při spuštění nepodskočí */}
          <Box sx={styles.nowTrack(playing)}>
            {playing && <Box component="span" className="lbl">{texts.player.trackNow}</Box>}
            <Box component="span" className="nm">{album.tracks[trackIdx]}</Box>
          </Box>
        </Box>

        {/* Přepínání alb — svisle, ať se neplete s vodorovnými šipkami skladeb */}
        <Box sx={styles.navs}>
          <Box component="button" type="button" sx={styles.nav} onClick={prev} aria-label={texts.player.prevAlbum}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10l4-4 4 4" /></svg>
          </Box>
          <Box component="button" type="button" sx={styles.nav} onClick={next} aria-label={texts.player.nextAlbum}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
          </Box>
        </Box>
      </Box>

      <Box sx={styles.tracklist}>
        {columns.map((col, c) => (
          <Box component="ol" sx={styles.trackCol} key={c}>
            {col.map(({ track, i }) => {
              const active = i === trackIdx;
              const isPlaying = active && playing;
              return (
                <li key={track + i}>
                  <Box component="button" type="button" sx={styles.track(active)}
                    onClick={() => selectTrack(i)} aria-pressed={isPlaying}>
                    <Box component="span" sx={styles.trackIx(active)}>
                      {isPlaying ? "●" : String(i + 1).padStart(2, "0")}
                    </Box>
                    <Box component="span" sx={styles.trackName(active)}>{track}</Box>
                    <Box component="span" className="sim-track-state" sx={styles.trackState(active)}>
                      {isPlaying ? texts.player.nowPlaying : texts.player.playLabel}
                    </Box>
                  </Box>
                </li>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
