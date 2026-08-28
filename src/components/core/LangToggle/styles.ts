import type { SxProps, Theme } from "@mui/material/styles";

export const wrap: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  flex: "0 0 auto",
  // odsazení od poslední položky navigace, ať se cz/en nelepí na „kontakt";
  // na mobilu menší, tam se místem šetří
  ml: { xs: "0.5rem", sm: "1rem" },
};

export const button = (on: boolean): SxProps<Theme> => ({
  background: "none",
  border: "none",
  p: 0,
  cursor: "pointer",
  fontFamily: "var(--font-mono)",
  fontSize: "0.68rem",
  letterSpacing: "0.14em",
  textTransform: "lowercase",
  color: on ? "var(--obili)" : "var(--inkoust-45)",
  transition: "color .15s ease",
  "&:hover": { color: "var(--inkoust)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
});

export const sep: SxProps<Theme> = {
  color: "var(--linka-2)",
  lineHeight: 1,
  fontSize: "0.68rem",
  "&::before": { content: '"/"' },
};
