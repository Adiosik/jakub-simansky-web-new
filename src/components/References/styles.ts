import type { SxProps, Theme } from "@mui/material/styles";
import { MIRA_TABULKY } from "../Section/styles";

/** Soupis článků — čte se jako rejstřík výstřižků, proto řádky, ne karty. */
export const press: SxProps<Theme> = {
  listStyle: "none",
  m: 0,
  p: 0,
  ...MIRA_TABULKY,
};

export const pressItem: SxProps<Theme> = {
  borderBottom: "1px solid var(--linka)",
  "&:first-of-type": { borderTop: "1px solid var(--linka)" },
};

/**
 * Klikací je celý řádek, ne jen název. Na desktopu tři sloupce (druh — název —
 * zdroj), na mobilu pod sebou, kde by se do řádku nevešly.
 */
export const pressLink: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "6rem minmax(0,1fr) auto" },
  alignItems: "baseline",
  gap: { xs: "0.3rem", sm: "1.2rem" },
  textAlign: "left",
  textDecoration: "none",
  color: "var(--inkoust)",
  py: "0.95rem",
  transition: "color .18s ease, background .18s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "-2px" },
};

export const pressKind: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.18em",
  color: "var(--obili)",
};

export const pressTitle: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(0.92rem,1.9vw,1.02rem)",
  lineHeight: 1.45,
};

export const pressMeta: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6rem",
  letterSpacing: "0.1em",
  color: "var(--inkoust-45)",
  whiteSpace: { sm: "nowrap" },
};
