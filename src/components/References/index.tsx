/**
 * References — sekce „reference": co o Jakubovi napsala a odvysílala média.
 *
 * Ohlasy s ověřenou citací se ukážou jako výrazné karty nahoře, zbytek jako
 * soupis odkazů pod nimi. Rozdíl je záměrný: článek, jehož doslovné znění
 * nemáme ověřené, se dá poctivě doložit odkazem, ale citovat ne.
 * Obsah je v src/data/references.ts.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { REFERENCES, type Reference } from "../../data/references";
import Section from "../Section";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

/** U ohlasu stačí měsíc a rok — přesné datum je na to zbytečně úřední. */
function datum(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === "csCZ" ? "cs-CZ" : "en-GB", {
    year: "numeric",
    month: "long",
  });
}

export default function References({ texts, lang }: Props) {
  const t = texts.sections.references;
  if (REFERENCES.length === 0) return null;

  const druh = (r: Reference) =>
    r.kind === "review" ? t.review : r.kind === "interview" ? t.interview : t.media;

  const citovane = REFERENCES.filter(
    (r): r is Reference & { quote: Record<Lang, string> } => Boolean(r.quote),
  );
  const ostatni = REFERENCES.filter((r) => !r.quote);

  return (
    <Section id="reference" title={t.title} intro={t.intro} wide>
      {citovane.length > 0 && (
        <Box sx={styles.grid(citovane.length)}>
          {citovane.map((r) => (
            <Box component="figure" key={r.url} sx={styles.item}>
              <Box component="span" sx={styles.mark} aria-hidden="true">„</Box>
              <Box component="blockquote" sx={styles.quote(citovane.length === 1)}>
                {r.quote[lang]}
              </Box>
              <Box component="figcaption" sx={styles.author}>
                {r.author ?? r.source}
                <Box sx={styles.role}>
                  {r.author ? r.source + " · " : ""}
                  {druh(r)}
                  {r.date ? " · " + datum(r.date, lang) : ""}
                </Box>
              </Box>
              <Box component="a" href={r.url} target="_blank" rel="noopener noreferrer" sx={styles.source}>
                {t.source}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {ostatni.length > 0 && (
        <Box component="ul" sx={styles.press}>
          {ostatni.map((r) => (
            <Box component="li" key={r.url} sx={styles.pressItem}>
              <Box component="a" href={r.url} target="_blank" rel="noopener noreferrer"
                sx={styles.pressLink}>
                <Box component="span" sx={styles.pressKind}>{druh(r)}</Box>
                <Box component="span" sx={styles.pressTitle}>{r.source}</Box>
                <Box component="span" sx={styles.pressMeta}>
                  {r.author ? r.author + " · " : ""}
                  {r.date ? datum(r.date, lang) + " · " : ""}{r.orig}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Section>
  );
}
