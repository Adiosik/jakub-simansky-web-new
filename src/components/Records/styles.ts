import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Jediná míra celé desky — drží ji obal, přehrávač, popis i seznam skladeb,
 * takže blok lícuje shora dolů. Bandcamp se pod svých 700 px zmenšuje, takže
 * se dá zarovnat taky.
 *
 * Pozor: `ch` se počítá z písma toho kterého prvku. Obal ani rámeček přehrávače
 * žádný text nemají, proto jim `SIRKA` předepisuje i velikost písma — bez toho
 * by stejné číslo vyšlo u každého jinak široké.
 */
const SIRKA_TEXT = "58ch";
export const SIRKA: SxProps<Theme> = {
  fontSize: "var(--text)",
  width: `min(100%, ${SIRKA_TEXT})`,
};

/** Desky pod sebou, každá jako centrovaný blok — obal, název, popis. */
export const list: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--mezera)",
  alignItems: "center",
};

export const item: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  width: "100%",
};

/** Obal alba — nad vlastním přehrávačem, už bez role tlačítka. */
export const cover: SxProps<Theme> = {
  ...SIRKA,
  display: "block",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  background: "var(--zaklad-2)",
  // jemný stín pod obalem — nadlehčí desku nad podkladem, při najetí se prohloubí
  boxShadow: "0 12px 26px -18px var(--stin)",
  transition: "box-shadow .35s ease, transform .35s ease",
  "& > *": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform .5s cubic-bezier(.2,.8,.2,1)",
  },
};

export const title: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.1rem,2.6vw,1.5rem)",
  fontWeight: 500,
  lineHeight: 1.3,
  color: "var(--inkoust)",
  m: "1.6rem 0 0",
  maxWidth: "30ch",
};

export const meta: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  letterSpacing: "0.16em",
  color: "var(--inkoust-45)",
  mt: "0.55rem",
};

export const desc: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text)",
  fontWeight: 300,
  lineHeight: 1.85,
  color: "var(--inkoust-70)",
  maxWidth: SIRKA_TEXT,
  mt: "1.3rem",
  whiteSpace: "pre-line",
  textAlign: "left",
};

/**
 * Seznam skladeb. Linku nese obal, ne samotný odstavec — jinak by kopírovala
 * délku textu skladeb a byla by nápadně kratší než popis nad ní.
 */
export const tracks: SxProps<Theme> = {
  ...SIRKA,
  mt: "1.3rem",
  pt: "1.1rem",
  borderTop: "1px solid var(--linka)",
};

export const tracksText: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  lineHeight: 1.9,
  color: "var(--inkoust-45)",
  mx: "auto",
};

