/**
 * Bands — sekce „kapely": uskupení, ve kterých Jakub hraje vedle sólové dráhy.
 * Obsah je v src/data/bands.ts.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { BANDS } from "../../data/bands";
import Section from "../Section";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

export default function Bands({ texts, lang }: Props) {
  const t = texts.sections.bands;
  if (BANDS.length === 0) return null;

  return (
    <Section id="kapely" title={t.title} intro={t.intro} wide>
      <Box sx={styles.grid}>
        {BANDS.map((band) => (
          <Box key={band.name} sx={styles.item}>
            <Box component="h3" sx={styles.name}>{band.name}</Box>
            {band.members && <Box sx={styles.members}>{band.members.join(" · ")}</Box>}
            {band.description && <Box sx={styles.description}>{band.description[lang]}</Box>}
            {band.url && (
              <Box component="a" href={band.url} target="_blank" rel="noopener noreferrer" sx={styles.link}>
                {t.listen}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Section>
  );
}
