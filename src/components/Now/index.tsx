/**
 * Now — sekce „aktuálně": nejnovější deska (první v ALBUMS) jako vyzdvižená
 * novinka hned pod heroem — obal, krátký text a odkaz na poslech.
 */
import Box from "@mui/material/Box";
import type { Translation } from "../../language";
import { ALBUMS } from "../../data/albums";
import { SOCIALS } from "../../data/socials";
import AlbumCover from "../Player/AlbumCover";
import Section from "../Section";
import * as styles from "./styles";

const BANDCAMP = SOCIALS.find((s) => s.name === "Bandcamp")?.url;

export default function Now({ texts }: { texts: Translation }) {
  const album = ALBUMS[0];
  const href = album.links?.bandcamp ?? BANDCAMP;

  return (
    <Section id="aktualne" title={texts.now.title}>
      <Box sx={styles.wrap}>
        <Box sx={styles.cover}><AlbumCover album={album} index={0} /></Box>
        <Box component="p" sx={styles.lead}>{texts.now.lead}</Box>
        <Box sx={styles.meta}>{album.year} · {album.label}</Box>
        {href && (
          <Box component="a" href={href} target="_blank" rel="noopener noreferrer" sx={styles.cta}>
            {texts.now.cta}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Box>
        )}
      </Box>
    </Section>
  );
}
