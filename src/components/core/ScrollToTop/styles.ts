import type { SxProps, Theme } from "@mui/material/styles";

export const button = (visible: boolean, lift: number): SxProps<Theme> => ({
  position: "fixed",
  right: { xs: "1rem", sm: "1.6rem" },
  // základ dole + dynamické zvednutí nad zápatí, jakmile je zápatí ve viewportu
  bottom: `calc(1.3rem + ${lift}px)`,
  zIndex: 55,
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--linka-2)",
  background: "var(--bar)",
  backdropFilter: "blur(6px)",
  color: "var(--inkoust)",
  cursor: "pointer",
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(8px)",
  pointerEvents: visible ? "auto" : "none",
  transition: "opacity .25s ease, transform .25s ease, bottom .2s ease, border-color .15s ease, color .15s ease",
  "&:hover": { borderColor: "var(--obili)", color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
  "& svg": { width: 15, height: 15, display: "block" },
});
