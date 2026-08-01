/**
 * Footer — tichá uzavírací linka stránky: jméno, rok a jednořádková poznámka.
 * Sítě a e-mail sem záměrně nepatří, jsou hned nad tím v sekci Kontakt.
 */
import Box from "@mui/material/Box";
import type { Translation } from "../../language";
import * as styles from "./styles";

export default function Footer({ texts }: { texts: Translation }) {
  return (
    <Box component="footer" className="sim-in" sx={styles.footer}>
      <Box component="span" sx={styles.name}>
        © {new Date().getFullYear()} jakub šimanský
      </Box>
      <Box component="span" sx={styles.sep} aria-hidden="true">·</Box>
      <Box component="span">{texts.footer.note}</Box>
    </Box>
  );
}
