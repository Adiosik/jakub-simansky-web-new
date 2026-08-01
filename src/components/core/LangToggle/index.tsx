/**
 * LangToggle — přepínač jazyka CZ / EN v hlavičce.
 */
import Box from "@mui/material/Box";
import type { Lang } from "../../../language";
import * as styles from "./styles";

export default function LangToggle({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <Box sx={styles.wrap}>
      <Box component="button" type="button" sx={styles.button(lang === "csCZ")} onClick={() => onChange("csCZ")}>CZ</Box>
      <Box component="span" sx={styles.sep} />
      <Box component="button" type="button" sx={styles.button(lang === "enUS")} onClick={() => onChange("enUS")}>EN</Box>
    </Box>
  );
}
