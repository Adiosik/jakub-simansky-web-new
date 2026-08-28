import type { SxProps, Theme } from "@mui/material/styles";

/** Kulaté tlačítko vedle přepínače jazyka. 40 px, ať se na mobilu dá trefit. */
export const button: SxProps<Theme> = {
  ml: { xs: "0.15rem", sm: "0.9rem" },
  flex: "0 0 auto",
  width: 40,
  height: 40,
  p: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--inkoust-70)",
  transition: "color .2s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "2px" },
  "& svg": { width: 18, height: 18, display: "block" },
};
