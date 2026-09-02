import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Čtecí šířka sekce. Drží ji text i fotka nad ním, aby lícovaly.
 * Pozor: `ch` se počítá z písma toho kterého prvku, takže i obrázek musí mít
 * `fontSize: var(--text)` — jinak vyjde stejné číslo jinak široké.
 */
const SIRKA = "58ch";

/** Fotka nad textem — v jeho šířce, ve vlastním čtvercovém formátu. */
export const photo: SxProps<Theme> = {
  fontSize: "var(--text)",
  width: `min(100%, ${SIRKA})`,
  aspectRatio: "1 / 1",
  objectFit: "cover",
  display: "block",
  mx: "auto",
  mb: "clamp(1.8rem,4vw,2.6rem)",
  background: "var(--zaklad-2)",
};

export const body: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text)",
  fontWeight: 300,
  lineHeight: 1.85,
  color: "var(--inkoust-70)",
  maxWidth: SIRKA,
  mx: "auto",
  whiteSpace: "pre-line",
  textAlign: "left",
};
