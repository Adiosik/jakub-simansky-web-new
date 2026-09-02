import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Zápatí je záměrně jen tichá uzavírací linka — sítě a e-mail jsou hned nad ním
 * v sekci Kontakt, opakovat je tady by byla duplicita.
 * Odstup od poslední sekce dává `main` svým spodním paddingem.
 */
export const footer: SxProps<Theme> = {
  px: "clamp(1.1rem,4vw,3rem)",
  py: "clamp(1.6rem,4vw,2.2rem)",
  borderTop: "1px solid var(--linka)",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  justifyContent: "center",
  gap: "0.5rem 1.1rem",
  textAlign: "center",
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  letterSpacing: "0.16em",
  color: "var(--inkoust-45)",
};

export const name: SxProps<Theme> = { color: "var(--inkoust-70)" };

