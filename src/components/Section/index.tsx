/**
 * Section — obálka jedné sekce dlouhé stránky: kotva pro navigaci, nadpis,
 * nepovinný úvodní odstavec a obsah.
 * Náběh při scrollu obstará třída .sim-in (observer je v SimanskyHero).
 *
 * Kotva (`id`) a náběh jsou schválně na dvou různých prvcích. Neodkrytá sekce
 * je posunutá o 42 px dolů (`transform` v .sim-in) a prohlížeč s tím posunem
 * počítá i při skoku z navigace — dojel by o 42 px dál a po odkrytí by nadpis
 * zajel pod hlavičku. Vnější `section` se proto nikdy neposouvá.
 */
import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import * as styles from "./styles";

type Props = {
  id: string;
  title: string;
  intro?: string;
  /** true = široký sloupec (alba, kapely), false = úzký čtecí sloupec */
  wide?: boolean;
  /** true = menší mezera pod nadpisem (sekce bez úvodní věty) */
  tight?: boolean;
  children?: ReactNode;
};

export default function Section({ id, title, intro, wide = false, tight = false, children }: Props) {
  return (
    <Box component="section" id={id} sx={styles.section(wide)}>
      <Box className="sim-in" sx={styles.reveal}>
        <Box component="h2" sx={styles.marker}>{title}</Box>
        {intro && <Box component="p" sx={styles.intro}>{intro}</Box>}
        {children && <Box sx={styles.body(tight)}>{children}</Box>}
      </Box>
    </Box>
  );
}
