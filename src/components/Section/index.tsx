/**
 * Section — obálka jedné sekce dlouhé stránky: kotva pro navigaci, nadpis,
 * nepovinný úvodní odstavec a obsah.
 * Náběh při scrollu obstará třída .sim-in (observer je v SimanskyHero).
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
    <Box component="section" id={id} className="sim-in" sx={styles.section(wide)}>
      <Box component="h2" sx={styles.marker}>{title}</Box>
      {intro && <Box component="p" sx={styles.intro}>{intro}</Box>}
      {children && <Box sx={styles.body(tight)}>{children}</Box>}
    </Box>
  );
}
