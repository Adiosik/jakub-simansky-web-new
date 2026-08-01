/**
 * Records — sekce „desky": diskografie pod sebou, každá deska jako centrovaný
 * blok (velký obal, název, popis, skladby). Klik na „přehrát ukázku" vybere
 * album v přehrávači a odscrolluje k němu.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { ALBUMS } from "../../data/albums";
import type { ArpeggioPlayer } from "../Player/useArpeggioPlayer";
import AlbumCover from "../Player/AlbumCover";
import Section from "../Section";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang; player: ArpeggioPlayer };

export default function Records({ texts, lang, player }: Props) {
  const t = texts.sections.records;

  const pick = (i: number) => {
    player.selectAlbum(i);
    document.getElementById("poslech")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Section id="desky" title={t.title} intro={t.intro} wide>
      <Box sx={styles.list}>
        {ALBUMS.map((album, i) => {
          const active = i === player.albumIdx;
          const isPlaying = active && player.playing;
          return (
            <Box key={album.title} sx={styles.item}>
              <Box component="button" type="button" sx={styles.cover}
                onClick={() => pick(i)} aria-pressed={isPlaying}
                aria-label={`${isPlaying ? t.playing : t.play} — ${album.title}`}>
                <AlbumCover album={album} index={i} />
                <Box component="span" className="sim-cover-hint" sx={styles.coverHint(isPlaying)}>
                  {isPlaying ? (
                    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <rect x="3.5" y="2.5" width="3.4" height="11" rx="0.4" />
                      <rect x="9.1" y="2.5" width="3.4" height="11" rx="0.4" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M4.5 2.6L13 8l-8.5 5.4z" />
                    </svg>
                  )}
                </Box>
              </Box>
              <Box component="h3" sx={styles.title}>
                {album.artist ? album.artist + " — " : ""}{album.title}
              </Box>
              <Box sx={styles.meta}>{album.year} · {album.label}</Box>
              {album.description && <Box sx={styles.desc}>{album.description[lang]}</Box>}
              <Box sx={styles.tracks}>
                <Box sx={styles.tracksText}>{album.tracks.join(" · ")}</Box>
              </Box>
              <Box component="button" type="button" sx={styles.play(isPlaying)}
                onClick={() => pick(i)} aria-pressed={isPlaying}>
                {isPlaying ? t.playing : t.play}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}
