import type { SxProps, Theme } from "@mui/material/styles";

export const figure: SxProps<Theme> = {
  position: "relative",
  width: "100%",
  m: 0,
  "& svg": { width: "100%", height: "auto", display: "block" },
  // soutisk dvou desek; režim míchání se mění podle motivu (viz --soutisk)
  "& .sim-plate": { mixBlendMode: "var(--soutisk)" },
  "& .sim-river-band": { transition: "transform .12s ease-out" },
};

export const caption: SxProps<Theme> = {
  // Pod kresbou je v SVG prázdný pruh (viewBox je vysoký 510, krajina končí na
  // 460), takže nulové odsazení popisek blíž nedostane. Záporné procento se
  // počítá ze šířky figure, zmenšuje se tedy spolu s tím pruhem a nepřeteče ho.
  mt: "-3.5%",
  fontFamily: "var(--font-mono)",
  fontStyle: "italic",
  fontSize: "0.66rem",
  letterSpacing: "0.08em",
  color: "var(--inkoust-45)",
  textAlign: "center",
};
