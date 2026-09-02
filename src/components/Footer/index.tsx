/**
 * Footer — tichá uzavírací linka stránky: rok a autor webu.
 * Sítě a e-mail sem záměrně nepatří, jsou hned nad tím v sekci Kontakt.
 */
import Box from "@mui/material/Box";
import * as styles from "./styles";

export default function Footer() {
  return (
    <Box component="footer" className="sim-in" sx={styles.footer}>
      <Box component="span" sx={styles.name}>
        © {new Date().getFullYear()} Daniel Šimanský
      </Box>
    </Box>
  );
}
