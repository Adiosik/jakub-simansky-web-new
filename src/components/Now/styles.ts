import type { SxProps, Theme } from "@mui/material/styles";

export const wrap: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "clamp(1.6rem,4vw,2.6rem)",
};

/** Text novinky — větší než běžný odstavec, ať to má váhu titulku. */
export const lead: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.05rem,2.5vw,1.4rem)",
  fontWeight: 400,
  lineHeight: 1.55,
  color: "var(--inkoust)",
  maxWidth: "34ch",
  m: 0,
  "& em": { fontStyle: "normal", color: "var(--obili)" },
};

/** Obal novinky — čtverec, bez rámečku, jen jemné podložení. */
export const cover: SxProps<Theme> = {
  width: "min(100%, 400px)",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  background: "var(--zaklad-2)",
  "& > *": { width: "100%", height: "100%", objectFit: "cover", display: "block" },
};

export const meta: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.68rem",
  letterSpacing: "0.16em",
  color: "var(--inkoust-45)",
};

/** Odkaz „poslechnout" — podtržení, které se při hoveru přepne na okrovou. */
export const cta: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.78rem",
  letterSpacing: "0.1em",
  color: "var(--inkoust)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  pb: "0.3rem",
  borderBottom: "1px solid var(--linka-2)",
  transition: "color .2s ease, border-color .2s ease, gap .2s ease",
  "& svg": { width: 13, height: 13, flex: "0 0 auto" },
  "&:hover": { color: "var(--obili)", borderBottomColor: "var(--obili)", gap: "0.75rem" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};
