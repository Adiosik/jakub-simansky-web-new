import type { SxProps, Theme } from "@mui/material/styles";
import { MIRA_TABULKY } from "../Section/styles";

export const list: SxProps<Theme> = { listStyle: "none", m: 0, p: 0, ...MIRA_TABULKY };

/** Řádek koncertu — datum / místo / štítek, oddělené vlásovou linkou. */
export const gig: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "minmax(10rem,auto) 1fr auto" },
  gap: { xs: "0.3rem", sm: "1.5rem" },
  alignItems: "baseline",
  textAlign: { xs: "center", sm: "left" },
  py: "1.1rem",
  borderTop: "1px solid var(--linka)",
  "&:last-of-type": { borderBottom: "1px solid var(--linka)" },
};

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

export const tag: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.14em",
  color: "var(--inkoust-45)",
  border: "1px solid var(--linka-2)",
  p: "0.18rem 0.45rem",
  justifySelf: { xs: "center", sm: "end" },
};

export const empty: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.8rem",
  color: "var(--inkoust-45)",
};
