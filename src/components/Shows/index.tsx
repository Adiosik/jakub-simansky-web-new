/**
 * Shows — sekce koncertů: seznam termínů v řádcích oddělených vlásovou linkou.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { CONCERTS } from "../../data/concerts";
import Section from "../Section";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

export default function Shows({ texts, lang }: Props) {
  const t = texts.sections.concerts;
  const locale = lang === "enUS" ? "en-US" : "cs-CZ";
  const fmtDate = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  return (
    <Section id="koncerty" title={t.title} wide tight>
      {CONCERTS.length === 0 ? (
        <Box component="p" sx={styles.empty}>{t.empty}</Box>
      ) : (
        <Box component="ul" sx={styles.list}>
          {CONCERTS.map((gig) => (
            <Box component="li" key={gig.date + gig.city} sx={styles.gig}>
              <Box component="span" sx={styles.date}>{fmtDate(gig.date)}</Box>
              <Box component="span" sx={styles.place}>
                {gig.city} <Box component="span">— {gig.venue}</Box>
              </Box>
              {gig.soldOut ? <Box component="span" sx={styles.tag}>{t.soldOut}</Box> : <span />}
            </Box>
          ))}
        </Box>
      )}
    </Section>
  );
}
