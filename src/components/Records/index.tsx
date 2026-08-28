/**
 * Records — sekce „desky": diskografie pod sebou, každá deska jako centrovaný
 * blok (velký obal, název, popis, skladby). Klik na obal i na tlačítko dole
 * nachystá desku v přehrávači a odscrolluje k němu.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { ALBUMS } from "../../data/albums";
import AlbumCover from "../Player/AlbumCover";
import Section from "../Section";
import * as styles from "./styles";

type Props = {
  texts: Translation;
  lang: Lang;
  /** které album je právě nachystané v přehrávači */
  albumIdx: number;
  onSelect: (i: number) => void;
};

export default function Records({ texts, lang, albumIdx, onSelect }: Props) {
  const t = texts.sections.records;

  /** Nachystá desku v přehrávači a odscrolluje k němu. */
  const pick = (i: number) => {
    onSelect(i);
    document.getElementById("poslech")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Section id="desky" title={t.title} intro={t.intro} wide>
      <Box sx={styles.list}>
        {ALBUMS.map((album, i) => {
          const active = i === albumIdx;
          return (
            <Box key={album.title} sx={styles.item}>
              <Box component="button" type="button" sx={styles.cover}
                onClick={() => pick(i)} aria-pressed={active}
                aria-label={`${t.play} — ${album.title}`}>
                <AlbumCover album={album} index={i} />
                <Box component="span" className="sim-cover-hint" sx={styles.coverHint(active)}>
                  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M4.5 2.6L13 8l-8.5 5.4z" />
                  </svg>
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
              <Box component="button" type="button" sx={styles.play(active)}
                onClick={() => pick(i)} aria-pressed={active}>
                {t.play}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}
