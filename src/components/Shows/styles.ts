import type { SxProps, Theme } from "@mui/material/styles";
import { MIRA_TABULKY } from "../Section/styles";

export const list: SxProps<Theme> = { listStyle: "none", m: 0, p: 0, ...MIRA_TABULKY };

/** Řádek koncertu — datum / místo / štítek, oddělené vlásovou linkou. */
const gigBase = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "minmax(10rem,auto) 1fr auto" },
  gap: { xs: "0.3rem", sm: "1.5rem" },
  alignItems: "baseline",
  textAlign: { xs: "center", sm: "left" },
  py: "1.1rem",
  borderTop: "1px solid var(--linka)",
  "&:last-of-type": { borderBottom: "1px solid var(--linka)" },
} as const;

export const gig: SxProps<Theme> = gigBase;

export const date: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.12em",
  color: "var(--obili)",
};

export const place: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "1rem",
  color: "var(--inkoust)",
  "& span": { color: "var(--inkoust-45)", fontSize: "0.86em" },
};

export const tags: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
  justifySelf: { xs: "center", sm: "end" },
};

export const tag: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.14em",
  color: "var(--inkoust-45)",
  border: "1px solid var(--linka-2)",
  p: "0.18rem 0.45rem",
  whiteSpace: "nowrap",
};

/** Blok odehraných — pod tlačítkem, stejná šíře jako seznam nadcházejících. */
export const past: SxProps<Theme> = {
  ...MIRA_TABULKY,
  mt: "clamp(1rem,2.5vw,1.6rem)",
  borderBottom: "1px solid var(--linka)",
  "&[hidden]": { display: "none" },
};

/** Nadpis roku nad odehranými — celý je tlačítko, které rok rozbalí. */
export const yearHeading: SxProps<Theme> = { m: 0, font: "inherit" };

/**
 * Ročník. Mezera nad ním jen tehdy, když je rok nad ním rozbalený — ať se rok
 * nelepí na poslední koncert. Zavřené roky pod sebou zůstanou těsně jako seznam.
 */
export const yearSection = (afterOpenYear: boolean): SxProps<Theme> => ({
  mt: afterOpenYear ? "1.4rem" : 0,
});

export const yearButton: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  gap: "1rem",
  minHeight: 44, // dotykový cíl, níž nejít
  // bez vnějšího okraje a se stejným odsazením nahoře i dole — rok
  // a chevron pak sedí svisle uprostřed mezi linkami
  p: "0.4rem 0.6rem 0.4rem 0",
  background: "none",
  border: "none",
  borderTop: "1px solid var(--linka)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  color: "var(--obili)",
  cursor: "pointer",
  textAlign: "left",
  "&:hover": { color: "var(--inkoust)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "2px" },
};

export const yearCount: SxProps<Theme> = { color: "var(--inkoust-45)", letterSpacing: "0.12em" };

/** Malý chevron vpravo od roku, otočený nahoru, když je rok otevřený. */
export const chevron = (open: boolean): SxProps<Theme> => ({
  width: 11,
  height: 11,
  flex: "0 0 auto",
  transform: open ? "rotate(180deg)" : "none",
  transition: "transform .25s ease",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});

/** Seznam pod rokem; první řádek nemá horní linku, tu už má tlačítko roku. */
export const yearList: SxProps<Theme> = {
  listStyle: "none",
  m: 0,
  p: 0,
  "&[hidden]": { display: "none" },
  "& > li:first-of-type": { borderTop: "none" },
  // spodní linku drží celý blok odehraných, ať je jen jedna
  "& > li:last-of-type": { borderBottom: "none" },
};

/** Odehraný termín: nižší řádek a tlumenější, ať nesoupeří s nadcházejícími. */
export const pastGig: SxProps<Theme> = {
  ...gigBase,
  py: "0.65rem",
  "& > span:first-of-type": { color: "var(--inkoust-45)" },
  "& > span:nth-of-type(2)": { fontSize: "0.9rem", color: "var(--inkoust-45)" },
};

export const empty: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.8rem",
  color: "var(--inkoust-45)",
};
