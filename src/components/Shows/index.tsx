/**
 * Shows — sekce koncertů: seznam termínů v řádcích oddělených vlásovou linkou.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { nadchazejici } from "../../data/concerts";
import Section from "../Section";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

export default function Shows({ texts, lang }: Props) {
  const t = texts.sections.concerts;
  // seznam se počítá při vykreslení, aby se řídil dnem návštěvníka
  const gigy = nadchazejici();
  const locale = lang === "enUS" ? "en-US" : "cs-CZ";
  const fmtDate = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  return (
    <Section id="koncerty" title={t.title} wide tight>
      {gigy.length === 0 ? (
        <Box component="p" sx={styles.empty}>{t.empty}</Box>
      ) : (
        <Box component="ul" sx={styles.list}>
          {gigy.map((gig) => (
            <Box component="li" key={gig.date + gig.city} sx={styles.gig}>
              <Box component="span" sx={styles.date}>{fmtDate(gig.date)}</Box>
              <Box component="span" sx={styles.place}>
                {gig.city} <Box component="span">— {gig.venue}</Box>
              </Box>
              {/* štítek má každý termín — buď kapelu, nebo „sólo“. Bez toho by
                  u smíšeného programu nešlo poznat, o který případ jde. */}
              <Box sx={styles.tags}>
                <Box component="span" sx={styles.tag}>{gig.band ?? t.solo}</Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Section>
  );
}
