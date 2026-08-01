import type { SxProps, Theme } from "@mui/material/styles";

export const section = (wide: boolean): SxProps<Theme> => ({
  width: "100%",
  maxWidth: wide ? "var(--sloupec)" : "var(--sloupec-uzky)",
  mx: "auto",
  px: "clamp(1.1rem,4vw,3rem)",
  mt: "var(--mezera)",
  // aby nadpis sekce nezmizel pod lepkavou hlavičkou při skoku z navigace
  scrollMarginTop: "5.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
});

/**
 * Značka sekce — název v lomítkách („// desky //"). Lomítka jsou v okrové
 * a v mono fontu, samotný název ve fontu display. Náš protějšek klasického
 * dekorativního oddělovače sekcí.
 */
export const marker: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.15rem,3vw,1.6rem)",
  fontWeight: 500,
  color: "var(--inkoust)",
  m: 0,
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  "& .sl": {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8em",
    color: "var(--obili)",
    letterSpacing: "-0.05em",
  },
};

export const intro: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.8rem",
  fontWeight: 300,
  lineHeight: 1.75,
  color: "var(--inkoust-70)",
  maxWidth: "56ch",
  m: "0.9rem 0 0",
};

export const body: SxProps<Theme> = {
  width: "100%",
  mt: "clamp(1.8rem,4vw,3rem)",
};
