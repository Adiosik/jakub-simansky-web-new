import type { SxProps, Theme } from "@mui/material/styles";

/** Přehrávač — bez rámečku a stínu, jen vlásové linky nahoře a dole. */
export const player: SxProps<Theme> = {
  width: "100%",
  maxWidth: 780,
  mx: "auto",
  textAlign: "left",
  borderTop: "1px solid var(--linka)",
  borderBottom: "1px solid var(--linka)",
  py: "clamp(1.2rem,3vw,1.8rem)",
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
};

export const top: SxProps<Theme> = {
  display: "flex",
  // mobil: zalomení je potřeba, název alba jde na druhý řádek (viz `titles`).
  // desktop: bez zalomení — jinak po objevení šipek pro skladby přeteče
  // přepínání alb na další řádek
  flexWrap: { xs: "wrap", sm: "nowrap" },
  alignItems: "center",
  columnGap: "1.1rem",
  rowGap: "0.8rem",
};

/** Transportní blok: šipka zpět — play — šipka vpřed, jako u běžného přehrávače. */
export const transport: SxProps<Theme> = {
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
};

/**
 * Šipky pro přeskakování skladeb. Vykreslují se až při přehrávání (než se
 * spustí, nedrží místo), proto krátký náběh, ať nenaskočí natvrdo.
 */
export const trackNav: SxProps<Theme> = {
  flex: "0 0 auto",
  width: 38,
  height: 38,
  p: 0,
  // kulaté a tmavé jako ozvučný otvor play tlačítka, šipka béžová jako struny
  borderRadius: "50%",
  border: "2px solid var(--saze)",
  background: "var(--otvor)",
  color: "var(--struna)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  animation: "simTrackNavIn .28s ease both",
  transition: "transform .18s ease",
  "&:hover": { transform: "scale(1.08)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
  "& svg": { width: 15, height: 15, display: "block" },
};

export const playBtn: SxProps<Theme> = {
  flex: "0 0 auto",
  width: 78,
  height: 78,
  border: "none",
  background: "none",
  cursor: "pointer",
  p: 0,
  borderRadius: "50%",
  transition: "transform .18s ease",
  "&:hover": { transform: "scale(1.04)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
  "& svg": { width: "100%", height: "100%", display: "block" },
};

export const cover: SxProps<Theme> = {
  width: 62,
  height: 62,
  flex: "0 0 auto",
  overflow: "hidden",
  background: "var(--zaklad-2)",
};

// na mobilu se název přesune na celý druhý řádek
export const titles: SxProps<Theme> = {
  minWidth: 0,
  flex: "1 1 auto",
  order: { xs: 2, sm: 0 },
  flexBasis: { xs: "100%", sm: "auto" },
};

export const title: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: 1.25,
  color: "var(--inkoust)",
};

export const sub: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.64rem",
  letterSpacing: "0.14em",
  color: "var(--inkoust-45)",
  mt: "0.25rem",
};

/**
 * Vybraná / právě hrající skladba — ať je při přepínání šipkami vidět, kde jsi.
 * Řádek je v layoutu pořád, jen zesvětlá, když se nehraje.
 */
export const nowTrack = (playing: boolean): SxProps<Theme> => ({
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  color: playing ? "var(--obili)" : "var(--inkoust-45)",
  mt: "0.4rem",
  display: "flex",
  alignItems: "baseline",
  gap: "0.45rem",
  transition: "color .25s ease",
  "& .lbl": { fontSize: "0.56rem", letterSpacing: "0.16em", color: "var(--inkoust-45)" },
  "& .nm": { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
});

/** Šipky pro přepínání alb — jen obrys, bez výplně. */
export const navs: SxProps<Theme> = {
  flex: "0 0 auto",
  ml: "auto",
  display: "flex",
  // na mobilu nad sebou (užší lišta, míň místa vedle obalu), na desktopu vedle sebe
  flexDirection: { xs: "column", sm: "row" },
  gap: "0.4rem",
};

export const nav: SxProps<Theme> = {
  width: 34,
  height: 34,
  p: 0,
  border: "1px solid var(--linka-2)",
  background: "none",
  cursor: "pointer",
  color: "var(--inkoust)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "border-color .18s ease, color .18s ease",
  "&:hover": { borderColor: "var(--obili)", color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "2px" },
  "& svg": { width: 13, height: 13, display: "block" },
};

/** Dva nezávislé sloupce skladeb; pevná výška, delší album se odscrolluje uvnitř. */
export const tracklist: SxProps<Theme> = {
  m: 0,
  p: "0.2rem 0.2rem 0 0",
  borderTop: "1px solid var(--linka)",
  pt: "1rem",
  maxHeight: "13rem",
  overflowY: "auto",
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  gap: { xs: "0.05rem", sm: "1.4rem" },
  alignItems: "flex-start",
};

export const trackCol: SxProps<Theme> = {
  listStyle: "none",
  m: 0,
  p: 0,
  flex: 1,
  minWidth: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

export const track = (active: boolean): SxProps<Theme> => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  background: "none",
  border: "none",
  cursor: "pointer",
  font: "inherit",
  fontFamily: "var(--font-mono)",
  color: active ? "var(--obili)" : "var(--inkoust)",
  textAlign: "left",
  p: "0.34rem 0.4rem",
  transition: "background .15s ease, color .15s ease",
  "&:hover": { background: "var(--zaklad-2)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "-2px" },
  "& .sim-track-state": { opacity: active ? 1 : 0 },
  "&:hover .sim-track-state": { opacity: 1 },
});

export const trackIx = (active: boolean): SxProps<Theme> => ({
  flex: "0 0 auto",
  width: "1.8em",
  fontSize: "0.66rem",
  color: active ? "var(--obili)" : "var(--inkoust-45)",
  fontVariantNumeric: "tabular-nums",
  textAlign: "center",
});

export const trackName = (active: boolean): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  fontSize: "0.78rem",
  fontWeight: active ? 500 : 300,
  lineHeight: 1.35,
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export const trackState = (active: boolean): SxProps<Theme> => ({
  flex: "0 0 auto",
  fontSize: "0.56rem",
  letterSpacing: "0.14em",
  color: active ? "var(--obili)" : "var(--inkoust-45)",
  transition: "opacity .15s ease",
});
