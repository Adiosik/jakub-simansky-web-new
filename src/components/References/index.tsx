/**
 * References — sekce „reference": co o Jakubovi napsala a odvysílala média.
 *
 * Soupis řádků, celý řádek je odkaz. Řazeno od nejnovějšího; zpočátku je vidět
 * jen pět a zbytek je za tlačítkem ve stejném stylu jako u galerie, aby se
 * z toho s přibývajícími ohlasy nestala nekonečná tabulka.
 * Obsah je v src/data/references.ts.
 */
import { useState } from "react";
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { SERAZENE, type Reference } from "../../data/references";
import Section from "../Section";
import ShowMore from "../core/ShowMore";
import * as styles from "./styles";

/** Kolik řádků je vidět, než se tabulka rozbalí. */
const VIDET = 5;

type Props = { texts: Translation; lang: Lang };

/** U ohlasu stačí měsíc a rok — přesné datum je na to zbytečně úřední. */
function datum(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === "csCZ" ? "cs-CZ" : "en-GB", {
    year: "numeric",
    month: "long",
  });
}

export default function References({ texts, lang }: Props) {
  const [vse, setVse] = useState(false);
  const t = texts.sections.references;
  if (SERAZENE.length === 0) return null;

  const druh = (r: Reference) =>
    r.kind === "review" ? t.review : r.kind === "interview" ? t.interview : t.media;
  const viditelne = vse ? SERAZENE : SERAZENE.slice(0, VIDET);

  return (
    <Section id="reference" title={t.title} wide tight>
      <Box component="ul" sx={styles.press}>
        {viditelne.map((r) => (
          <Box component="li" key={r.url} sx={styles.pressItem}>
            {/* Bez aria-label schválně: odečítač přečte celý obsah řádku —
                druh, médium, autora i datum — a to dva odkazy na totéž
                médium od sebe odliší samo. */}
            <Box component="a" href={r.url} target="_blank" rel="noopener noreferrer"
              sx={styles.pressLink}>
              <Box component="span" sx={styles.pressKind}>{druh(r)}</Box>
              <Box component="span" sx={styles.pressTitle}>{r.source}</Box>
              <Box component="span" sx={styles.pressMeta}>
                {/* jen to, co je vyplněné — jinak by zůstaly osiřelé tečky */}
                {[r.author, r.date && datum(r.date, lang), r.orig].filter(Boolean).join(" · ")}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {SERAZENE.length > VIDET && (
        <ShowMore rozbaleno={vse} onToggle={() => setVse((v) => !v)} pocet={SERAZENE.length}
          vice={texts.sections.showAll} mene={texts.sections.showLess} />
      )}
    </Section>
  );
}
