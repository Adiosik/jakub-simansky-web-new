import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Čtecí šířka oznámení — drží ji text i obal nad ním, aby lícovaly.
 * Pozor: `ch` se počítá z písma toho kterého prvku, a obrázek žádný text nemá,
 * proto mu ji `cover` předepisuje taky. Jinak by stejné číslo vyšlo jinak.
 */
const SIRKA = "58ch";

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

/** Obal novinky — čtverec v šířce textu, bez rámečku, jen jemné podložení. */
export const cover: SxProps<Theme> = {
  fontSize: "var(--text)",
  width: `min(100%, ${SIRKA})`,
  aspectRatio: "1 / 1",
  objectFit: "cover",
  display: "block",
  background: "var(--zaklad-2)",
};

/** Vlastní text oznámení — čtecí šířka, ne titulková. */
export const body: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text)",
  fontWeight: 300,
  lineHeight: 1.85,
  color: "var(--inkoust-70)",
  maxWidth: SIRKA,
  textAlign: "left",
  m: 0,
};

export const meta: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  letterSpacing: "0.16em",
  color: "var(--inkoust-45)",
};

/** Odkaz „poslechnout" — podtržení, které se při hoveru přepne na okrovou. */
export const cta: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
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
