/**
 * ThemeToggle — přepínač světlého a tmavého motivu vedle jazyka.
 * Ukazuje ikonu toho, na co přepne: ve světlém režimu měsíc, v tmavém slunce.
 */
import Box from "@mui/material/Box";
import type { Motiv } from "../../../theme-mode";
import * as styles from "./styles";

type Props = { motiv: Motiv; onChange: (m: Motiv) => void; labelDark: string; labelLight: string };

export default function ThemeToggle({ motiv, onChange, labelDark, labelLight }: Props) {
  const tmavy = motiv === "dark";
  return (
    <Box component="button" type="button" sx={styles.button}
      onClick={() => onChange(tmavy ? "light" : "dark")}
      aria-label={tmavy ? labelLight : labelDark} aria-pressed={tmavy}>
      {tmavy ? (
        // slunce — přepne zpět na světlý
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.2v2.4M12 19.4v2.4M4.4 4.4l1.7 1.7M17.9 17.9l1.7 1.7M2.2 12h2.4M19.4 12h2.4M4.4 19.6l1.7-1.7M17.9 6.1l1.7-1.7" />
        </svg>
      ) : (
        // měsíc — přepne na tmavý
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
        </svg>
      )}
    </Box>
  );
}
