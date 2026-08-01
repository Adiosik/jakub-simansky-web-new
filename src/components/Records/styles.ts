import type { SxProps, Theme } from "@mui/material/styles";

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

/** Obal je zároveň tlačítko — chová se stejně jako „přehrát ukázku" pod popisem. */
export const cover: SxProps<Theme> = {
  position: "relative",
  display: "block",
  width: "min(100%, 460px)",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  p: 0,
  border: "none",
  background: "var(--zaklad-2)",
  cursor: "pointer",
  // jemný stín pod obalem — nadlehčí desku nad podkladem, při najetí se prohloubí
  boxShadow: "0 12px 26px -18px rgba(35,41,31,.55)",
  transition: "box-shadow .35s ease, transform .35s ease",
  "& > *": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform .5s cubic-bezier(.2,.8,.2,1)",
  },
  "&:hover, &:focus-visible": {
    transform: "translateY(-4px)",
    boxShadow: "0 24px 44px -20px rgba(35,41,31,.6)",
  },
  "&:hover > *": { transform: "scale(1.04)" },
  "&:hover .sim-cover-hint, &:focus-visible .sim-cover-hint": { opacity: 1, transform: "scale(1)" },
  // obrys jen při ovládání klávesnicí, ne jako trvalý stav hrajícího alba
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "6px" },
};

/**
 * Odznak play/pauza v rohu obalu — naznačí, že se na desku dá kliknout, aniž by
 * překryl grafiku. V klidu je schovaný a vyjede při najetí myší nebo zaostření
 * klávesnicí; u právě hrajícího alba zůstává vidět, ať je jasné, odkud zvuk jde.
 */
export const coverHint = (active: boolean): SxProps<Theme> => ({
  position: "absolute",
  right: "0.85rem",
  bottom: "0.85rem",
  width: 42,
  height: 42,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  background: active ? "var(--obili)" : "rgba(35,41,31,.72)",
  color: active ? "var(--inkoust)" : "var(--zaklad)",
  backdropFilter: "blur(2px)",
  opacity: active ? 1 : 0,
  transform: active ? "scale(1)" : "scale(.86)",
  transition: "opacity .25s ease, transform .25s ease, background .25s ease",
  "& svg": { width: 15, height: 15, display: "block" },
});

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
  fontSize: "0.66rem",
  letterSpacing: "0.16em",
  color: "var(--inkoust-45)",
  mt: "0.55rem",
};

/**
 * Čtecí šířka popisu desky. Stejnou drží i rozdělovač nad seznamem skladeb.
 * Pozor: `ch` se počítá z písma toho kterého prvku, takže oba musí mít stejnou
 * velikost písma (VELIKOST_POPISU), jinak stejné číslo vyjde jinak široké.
 */
const VELIKOST_POPISU = "0.78rem";
const SIRKA_POPISU = "58ch";

export const desc: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: VELIKOST_POPISU,
  fontWeight: 300,
  lineHeight: 1.85,
  color: "var(--inkoust-70)",
  maxWidth: SIRKA_POPISU,
  mt: "1.3rem",
  whiteSpace: "pre-line",
  textAlign: "left",
};

/**
 * Seznam skladeb. Linku nese obal, ne samotný odstavec — jinak by kopírovala
 * délku textu skladeb a byla by nápadně kratší než popis nad ní.
 */
export const tracks: SxProps<Theme> = {
  // shodná velikost písma jako `desc` — jen tak vyjde `ch` stejně široké
  fontSize: VELIKOST_POPISU,
  width: `min(100%, ${SIRKA_POPISU})`,
  mt: "1.3rem",
  pt: "1.1rem",
  borderTop: "1px solid var(--linka)",
};

export const tracksText: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.7rem",
  lineHeight: 1.9,
  color: "var(--inkoust-45)",
  mx: "auto",
};

/** Tlačítko „přehrát ukázku" — text s podtržením, ne rámeček. */
export const play = (active: boolean): SxProps<Theme> => ({
  mt: "1.4rem",
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  letterSpacing: "0.14em",
  color: active ? "var(--obili)" : "var(--inkoust)",
  background: "none",
  border: "none",
  cursor: "pointer",
  p: "0 0 0.3rem",
  borderBottom: `1px solid ${active ? "var(--obili)" : "var(--linka-2)"}`,
  transition: "color .2s ease, border-color .2s ease",
  "&:hover": { color: "var(--obili)", borderBottomColor: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
});
