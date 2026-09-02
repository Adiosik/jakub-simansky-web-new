import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Míra hlavní citace. Drží se jí i soupis pod ní, aby celá sekce stála na
 * jedné šířce. `ch` se počítá z písma prvku, takže obojí musí mít stejné
 * písmo i stupeň — u soupisu to písmo neslouží k ničemu jinému než k tomu,
 * aby míra vyšla stejně; jednotlivé řádky si ho přenastavují samy.
 */
const PISMO_CITACE = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.05rem,2.6vw,1.45rem)",
};
const SIRKA_CITACE = "44ch";

/**
 * Citace vedle sebe, ale nikdy víc než tři sloupce. Počet sloupců se řídí
 * počtem citací — jedna samotná citace v třísloupcové mřížce by vypadala jako
 * rozbité rozvržení, ne jako záměr.
 */
export const grid = (pocet: number): SxProps<Theme> => ({
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: `repeat(${Math.min(pocet, 3)}, 1fr)` },
  gap: { xs: "2.4rem", md: "clamp(2rem,4vw,3.4rem)" },
  width: "100%",
  justifyItems: "center",
});

export const item: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  m: 0,
  // na mobilu odděluje bloky vodorovná linka, na desktopu svislá mezi sloupci
  pt: { xs: "2.2rem", md: 0 },
  borderTop: { xs: "1px solid var(--linka)", md: "none" },
  pl: { md: "clamp(1rem,2vw,2rem)" },
  borderLeft: { md: "1px solid var(--linka)" },
  "&:first-of-type": {
    pt: 0,
    borderTop: "none",
    pl: { md: 0 },
    borderLeft: { md: "none" },
  },
};

/** Velká uvozovka v okrové — jediný barevný prvek bloku. */
export const mark: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "2.6rem",
  lineHeight: 0.7,
  color: "var(--obili)",
  mb: "0.9rem",
  userSelect: "none",
};

/** Osamocená citace nese sekci sama, tak dostane víc místa i velikosti. */
export const quote = (sam: boolean): SxProps<Theme> => ({
  fontFamily: PISMO_CITACE.fontFamily,
  fontSize: sam ? PISMO_CITACE.fontSize : "clamp(0.95rem,1.9vw,1.08rem)",
  fontWeight: 400,
  lineHeight: 1.65,
  color: "var(--inkoust)",
  m: 0,
  maxWidth: sam ? SIRKA_CITACE : "34ch",
});

export const author: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  letterSpacing: "0.1em",
  color: "var(--inkoust-70)",
  mt: "1.3rem",
};

export const role: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6rem",
  letterSpacing: "0.16em",
  color: "var(--inkoust-45)",
  mt: "0.35rem",
};

/** Odkaz na zdroj citace — stejný podtržený styl jako ostatní odkazy webu. */
export const source: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  letterSpacing: "0.12em",
  color: "var(--inkoust-45)",
  textDecoration: "none",
  mt: "0.6rem",
  pb: "0.15rem",
  borderBottom: "1px solid var(--linka)",
  transition: "color .18s ease, border-color .18s ease",
  "&:hover": { color: "var(--obili)", borderBottomColor: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
};


/** Soupis článků — čte se jako rejstřík výstřižků, proto řádky, ne karty. */
export const press: SxProps<Theme> = {
  listStyle: "none",
  // `body` sekce je blok, ne flex — bez `mx: auto` by se užší seznam zarazil
  // doleva a rozešel se s vycentrovanou citací nad ním
  m: "0 auto",
  p: 0,
  // odstup, který dřív dělal štítek nad seznamem
  mt: "clamp(2.8rem,7vw,4.4rem)",
  width: "100%",
  ...PISMO_CITACE,
  maxWidth: SIRKA_CITACE,
};

export const pressItem: SxProps<Theme> = {
  borderBottom: "1px solid var(--linka)",
  "&:first-of-type": { borderTop: "1px solid var(--linka)" },
};

/**
 * Klikací je celý řádek, ne jen název. Na desktopu tři sloupce (druh — název —
 * zdroj), na mobilu pod sebou, kde by se do řádku nevešly.
 */
export const pressLink: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "6rem minmax(0,1fr) auto" },
  alignItems: "baseline",
  gap: { xs: "0.3rem", sm: "1.2rem" },
  textAlign: "left",
  textDecoration: "none",
  color: "var(--inkoust)",
  py: "0.95rem",
  transition: "color .18s ease, background .18s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "-2px" },
};

export const pressKind: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.58rem",
  letterSpacing: "0.18em",
  color: "var(--obili)",
};

export const pressTitle: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(0.92rem,1.9vw,1.02rem)",
  lineHeight: 1.45,
};

export const pressMeta: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6rem",
  letterSpacing: "0.1em",
  color: "var(--inkoust-45)",
  whiteSpace: { sm: "nowrap" },
};
