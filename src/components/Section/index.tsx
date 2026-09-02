/**
 * Section — obálka jedné sekce dlouhé stránky: kotva pro navigaci, značka
 * s názvem („/ desky /"), nepovinný úvodní odstavec a obsah.
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
  children?: ReactNode;
};

export default function Section({ id, title, intro, wide = false, children }: Props) {
  return (
    <Box component="section" id={id} className="sim-in" sx={styles.section(wide)}>
      <Box component="h2" sx={styles.marker}>
        <Box component="span" className="sl" aria-hidden="true">/</Box>
        {title}
        <Box component="span" className="sl" aria-hidden="true">/</Box>
      </Box>
      {intro && <Box component="p" sx={styles.intro}>{intro}</Box>}
      {children && <Box sx={styles.body}>{children}</Box>}
    </Box>
  );
}
