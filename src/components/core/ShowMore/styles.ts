import type { SxProps, Theme } from "@mui/material/styles";

/** Stejný podtržený styl jako ostatní odkazy webu, uprostřed pod výpisem. */
export const tlacitko: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  mt: "clamp(1.4rem,3vw,2rem)",
  mx: "auto",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  letterSpacing: "0.12em",
  color: "var(--inkoust)",
  background: "none",
  border: "none",
  borderBottom: "1px solid var(--linka-2)",
  p: "0.2rem 0",
  cursor: "pointer",
  transition: "color .2s ease, border-color .2s ease",
  "&:hover": { color: "var(--obili)", borderBottomColor: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};
