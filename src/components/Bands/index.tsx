/**
 * Bands — sekce „kapely": uskupení, ve kterých Jakub hraje vedle sólové dráhy.
 * Obsah je v src/data/bands.ts.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { BANDS } from "../../data/bands";
import { sitZAdresy } from "../../data/socials";
import SocialLink from "../core/Social";
import Section from "../Section";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

export default function Bands({ texts, lang }: Props) {
  const t = texts.sections.bands;
  if (BANDS.length === 0) return null;

  return (
    <Section id="kapely" title={t.title} wide tight>
      <Box sx={styles.grid}>
        {BANDS.map((band) => (
          <Box key={band.name} sx={styles.item}>
            <Box component="h3" sx={styles.name}>{band.name}</Box>
            {band.members && <Box sx={styles.members}>{band.members.join(" · ")}</Box>}
            {band.description && <Box sx={styles.description}>{band.description[lang]}</Box>}
            {band.links && (
              <Box sx={styles.links}>
                {band.links.map((url) => (
                  <SocialLink key={url} social={sitZAdresy(url)} variant="contact" />
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Section>
  );
}
