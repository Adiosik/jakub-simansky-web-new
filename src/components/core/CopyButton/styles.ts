import type { SxProps, Theme } from "@mui/material/styles";
import type { CSSProperties } from "react";

const tipBase: CSSProperties = {
  position: "absolute",
  bottom: "165%",
  left: "50%",
  transform: "translateX(-50%) translateY(4px)",
  background: "var(--inkoust)",
  color: "var(--zaklad)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.56rem",
  letterSpacing: "0.14em",
  padding: "0.22rem 0.45rem",
  whiteSpace: "nowrap",
  opacity: 0,
  pointerEvents: "none",
  transition: "opacity .15s ease, transform .15s ease",
};
const tipShow = { opacity: 1, transform: "translateX(-50%) translateY(0)" };

export const button = (copied: boolean): SxProps<Theme> => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  p: 0,
  background: "none",
  border: "none",
  color: copied ? "var(--obili)" : "var(--inkoust-45)",
  cursor: "pointer",
  transition: "color .15s ease, transform .15s ease",
  "& svg": { width: 15, height: 15, display: "block" },
  "&:hover": { color: copied ? "var(--obili)" : "var(--inkoust)", transform: "translateY(-1px)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
  "& .sim-tip": copied ? { ...tipBase, ...tipShow } : tipBase,
  "&:hover .sim-tip, &:focus-visible .sim-tip": tipShow,
});
