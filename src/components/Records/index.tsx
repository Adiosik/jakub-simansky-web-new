/**
 * Records — sekce „alba": diskografie pod sebou, každé album jako centrovaný
 * blok — velký obal, pod ním přehrávač Bandcampu, název, popis a skladby.
 *
 * Dřív tu byl jeden přehrávač pod nadpisem a alba se do něj přepínala klikem
 * na obal. Když má každé album vlastní, není co přepínat — odpadly tím šipky,
 * stav vybraného alba i skákání po stránce.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { ALBUMS, type Text } from "../../data/albums";
import AlbumCover from "../Album/AlbumCover";
import Embed from "../Album/Embed";
import Section from "../Section";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

/** Vlastní jméno je řetězec, obecný údaj má obě jazykové verze. */
const text = (t: Text, lang: Lang) => (typeof t === "string" ? t : t[lang]);

export default function Records({ texts, lang }: Props) {
  const t = texts.sections.records;

  return (
    <Section id="desky" title={t.title} wide>
      <Box sx={styles.list}>
        {ALBUMS.map((album, i) => (
          <Box key={album.title} sx={styles.item}>
            <Box sx={styles.cover}><AlbumCover album={album} index={i} /></Box>
            <Embed album={album} sx={{ ...styles.SIRKA, mt: "1.4rem" }} />
            <Box component="h3" sx={styles.title}>
              {album.artist ? album.artist + " — " : ""}{album.title}
            </Box>
            <Box sx={styles.meta}>{album.year} · {text(album.label, lang)}</Box>
            {album.format && <Box sx={styles.format}>({text(album.format, lang)})</Box>}
            {album.description && <Box sx={styles.desc}>{album.description[lang]}</Box>}
            <Box sx={styles.tracks}>
              <Box sx={styles.tracksText}>{album.tracks.join(" · ")}</Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
