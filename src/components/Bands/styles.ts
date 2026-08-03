import type { SxProps, Theme } from "@mui/material/styles";

/** Kapely vedle sebe na desktopu, pod sebou na mobilu. */
export const grid: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
  gap: { xs: "2.4rem", md: "clamp(2rem,4vw,3.4rem)" },
  width: "100%",
};

export const item: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  // na mobilu dělí bloky vodorovná linka, na desktopu svislá mezi sloupci
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

export const name: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.15rem,2.6vw,1.45rem)",
  fontWeight: 500,
  lineHeight: 1.3,
  color: "var(--inkoust)",
  m: 0,
};

export const members: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.66rem",
  letterSpacing: "0.14em",
  color: "var(--obili)",
  mt: "0.7rem",
};

export const description: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.78rem",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "var(--inkoust-70)",
  maxWidth: "38ch",
  mt: "1rem",
};

/** Odkaz na kapelu — stejný podtržený styl jako ostatní odkazy webu. */
export const link: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.12em",
  color: "var(--inkoust)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  mt: "1.1rem",
  pb: "0.2rem",
  borderBottom: "1px solid var(--linka-2)",
  transition: "color .2s ease, border-color .2s ease, gap .2s ease",
  "& svg": { width: 12, height: 12, flex: "0 0 auto" },
  "&:hover": { color: "var(--obili)", borderBottomColor: "var(--obili)", gap: "0.7rem" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};
