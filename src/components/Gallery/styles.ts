import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Sloupce, ne mřížka. Obrázky mají různé poměry stran a v mřížce by se musely
 * ořezávat na společný formát; takhle si každý nechá svůj tvar a sloupce se
 * jen doplní pod sebe. `break-inside` drží obrázek pohromadě, aby ho zlom
 * sloupce nerozřízl napůl.
 */
export const grid: SxProps<Theme> = {
  width: "100%",
  columnCount: { xs: 1, sm: 2, md: 3 },
  columnGap: "clamp(0.8rem,2vw,1.4rem)",
};

export const photo: SxProps<Theme> = {
  width: "100%",
  height: "auto",
  display: "block",
  breakInside: "avoid",
  mb: "clamp(0.8rem,2vw,1.4rem)",
  background: "var(--zaklad-2)",
  boxShadow: "0 12px 26px -18px var(--stin)",
  transition: "box-shadow .35s ease, transform .35s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 24px 44px -20px var(--stin)",
  },
};

/** Poznámka v sekci, která je ohlášená, ale obsah teprve bude. */
export const soon: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  letterSpacing: "0.16em",
  color: "var(--inkoust-45)",
  textAlign: "center",
};

export const list: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "clamp(2rem,5vw,3.2rem)",
  width: "100%",
};

export const item: SxProps<Theme> = {
  width: "min(100%, 760px)",
};

/** Poměr 16:9 drží rámeček sám, takže se výška nemusí počítat podle šířky. */
export const frame: SxProps<Theme> = {
  width: "100%",
  aspectRatio: "16 / 9",
  border: 0,
  display: "block",
  background: "var(--zaklad-2)",
};

export const videoTitle: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  letterSpacing: "0.12em",
  color: "var(--inkoust-45)",
  mt: "0.8rem",
  textAlign: "center",
};
