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

export const link = (contact: boolean): SxProps<Theme> => ({
  position: "relative",
  color: "var(--inkoust-70)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: contact ? "0.6rem" : "0.34rem",
  textDecoration: "none",
  transition: "color .18s ease, transform .18s ease",
  "& svg": {
    width: contact ? 34 : 20, height: contact ? 34 : 20,
    display: "block", fill: "currentColor", flex: "0 0 auto",
  },
  "&:hover": { color: "var(--obili)", transform: "translateY(-2px)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
  "& .sim-tip": tipBase,
  "&:hover .sim-tip, &:focus-visible .sim-tip": tipShow,
});

export const watermark = (contact: boolean): SxProps<Theme> => ({
  fontFamily: "var(--font-mono)",
  fontSize: contact ? "0.92rem" : "0.6rem",
  letterSpacing: "0.08em",
  textTransform: "lowercase",
  lineHeight: 1,
});
