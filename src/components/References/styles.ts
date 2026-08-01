import type { SxProps, Theme } from "@mui/material/styles";

/** Ohlasy vedle sebe na desktopu, pod sebou na mobilu. */
export const grid: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
  gap: { xs: "2.4rem", md: "clamp(2rem,4vw,3.4rem)" },
  width: "100%",
};

export const item: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  // na mobilu odděluje bloky vodorovná linka, na desktopu svislá mezi sloupci
  pt: { xs: "2.2rem", md: 0 },
  borderTop: { xs: "1px solid var(--linka)", md: "none" },
  pl: { md: "clamp(1rem,2vw,2rem)" },
  borderLeft: { md: "1px solid var(--linka)" },
  "&:first-of-type": {
    pt: 0,
    borderTop: "none",
    pl: { md: 0 },
    borderLeft: { md: "none" },
  },
};

/** Velká uvozovka v okrové — jediný barevný prvek bloku. */
export const mark: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "2.6rem",
  lineHeight: 0.7,
  color: "var(--obili)",
  mb: "0.9rem",
  userSelect: "none",
};

export const quote: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(0.95rem,1.9vw,1.08rem)",
  fontWeight: 400,
  lineHeight: 1.65,
  color: "var(--inkoust)",
  m: 0,
  maxWidth: "34ch",
};

export const author: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  letterSpacing: "0.1em",
  color: "var(--inkoust-70)",
  mt: "1.3rem",
};

export const role: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6rem",
  letterSpacing: "0.16em",
  color: "var(--inkoust-45)",
  mt: "0.35rem",
};

/** Odkaz na zdroj citace — stejný podtržený styl jako ostatní odkazy webu. */
export const source: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  letterSpacing: "0.12em",
  color: "var(--inkoust-45)",
  textDecoration: "none",
  mt: "0.6rem",
  pb: "0.15rem",
  borderBottom: "1px solid var(--linka)",
  transition: "color .18s ease, border-color .18s ease",
  "&:hover": { color: "var(--obili)", borderBottomColor: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
};
