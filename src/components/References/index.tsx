/**
 * References — sekce „reference": ohlasy na desky a koncerty vedle sebe.
 * Obsah je v src/data/references.ts (zatím vymyšlená výplň, viz poznámka tam).
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { REFERENCES } from "../../data/references";
import Section from "../Section";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

export default function References({ texts, lang }: Props) {
  const t = texts.sections.references;
  if (REFERENCES.length === 0) return null;

  return (
    <Section id="reference" title={t.title} intro={t.intro} wide>
      <Box sx={styles.grid}>
        {REFERENCES.map((ref) => (
          <Box component="figure" key={ref.author + ref.quote.csCZ} sx={styles.item}>
            <Box component="span" sx={styles.mark} aria-hidden="true">„</Box>
            <Box component="blockquote" sx={styles.quote}>{ref.quote[lang]}</Box>
            <Box component="figcaption" sx={styles.author}>
              {ref.author}
              {ref.role && <Box sx={styles.role}>{ref.role[lang]}</Box>}
            </Box>
            {ref.url && (
              <Box component="a" href={ref.url} target="_blank" rel="noopener noreferrer" sx={styles.source}>
                {t.source}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Section>
  );
}
