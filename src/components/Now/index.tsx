/**
 * Now — sekce „aktuálně": vyzdvižená novinka hned pod heroem.
 *
 * Nečte z ALBUMS schválně. Deska, kterou ohlašuje, ještě nevyšla — nemá seznam
 * skladeb ani ID na Bandcampu, takže by v diskografii i v přehrávači dělala
 * prázdné místo. Až vyjde, přesune se do ALBUMS a tahle sekce ohlásí další.
 */
import Box from "@mui/material/Box";
import type { Translation } from "../../language";
import { NOW_COVER } from "../../data/site";
import { asset } from "../../asset";
import Section from "../Section";
import * as styles from "./styles";

export default function Now({ texts }: { texts: Translation }) {
  const t = texts.now;

  return (
    <Section id="aktualne" title={t.title}>
      <Box sx={styles.wrap}>
        <Box component="img" sx={styles.cover} src={asset(NOW_COVER)} alt={t.lead} />
        <Box component="p" sx={styles.lead}>{t.lead}</Box>
        <Box component="p" sx={styles.body}>{t.body}</Box>
        <Box sx={styles.meta}>{t.meta}</Box>
      </Box>
    </Section>
  );
}
