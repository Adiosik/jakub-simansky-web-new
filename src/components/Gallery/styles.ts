import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Mřížka stejně velkých čtverců. Dřív to byly sloupce, kde si každá fotka
 * nechala svůj tvar — jenže pak byla fotka na šířku viditelně menší než
 * čtvercová vedle ní a galerie působila nahodile. Ořez se u každé fotky dá
 * nasměrovat přes `pozice` v datech, aby nepřišla o obličej.
 */
/**
 * Kolik sloupců a kolik fotek je vidět, než se galerie rozbalí:
 * mobil jeden sloupec a tři fotky pod sebou, tablet 2 × 2, desktop 2 × 3.
 */
const ZLOMY = ["xs", "sm", "md"] as const;
type Zlom = (typeof ZLOMY)[number];
const SLOUPCE: Record<Zlom, number> = { xs: 1, sm: 2, md: 3 };
const VIDET: Record<Zlom, number> = { xs: 3, sm: 4, md: 6 };

/** Hodnota pro každý zlom zvlášť, vypočtená z funkce. */
const poZlomech = <T,>(f: (z: Zlom) => T) =>
  Object.fromEntries(ZLOMY.map((z) => [z, f(z)])) as Record<Zlom, T>;

export const grid = (sbaleno: boolean): SxProps<Theme> => ({
  display: "grid",
  gridTemplateColumns: poZlomech((z) => `repeat(${SLOUPCE[z]}, minmax(0, 1fr))`),
  gap: "clamp(0.6rem,2vw,1.4rem)",
  width: "100%",
  /*
   * Skrývání podle pořadí fotky. Pro každý zlom jedno pravidlo: fotky za jeho
   * limitem schová na něm i na všech užších; na širších je nechá být, tam
   * rozhodne jejich vlastní, pozdější pravidlo. Pořadí pravidel je proto
   * podstatné — mají stejnou specifičnost, takže vyhrává to pozdější.
   */
  ...(sbaleno && Object.fromEntries(ZLOMY.map((z, i) => [
    `& > figure:nth-of-type(n+${VIDET[z] + 1})`,
    { display: poZlomech((b) => (ZLOMY.indexOf(b) <= i ? "none" : "block")) },
  ]))),
});

export const tile: SxProps<Theme> = {
  m: 0,
  position: "relative",
  transition: "transform .35s ease",
  "&:hover": { transform: "translateY(-4px)" },
  "&:hover img": { boxShadow: "0 24px 44px -20px var(--stin)" },
  "&:hover figcaption, &:focus-within figcaption": { opacity: 1 },
};

export const photo: SxProps<Theme> = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  display: "block",
  background: "var(--zaklad-2)",
  boxShadow: "0 12px 26px -18px var(--stin)",
  transition: "box-shadow .35s ease",
};

/** Tlačítko kolem fotky v mřížce — samo nic nekreslí, jen otevírá lightbox. */
export const zoom: SxProps<Theme> = {
  display: "block",
  width: "100%",
  p: 0,
  border: 0,
  background: "none",
  cursor: "zoom-in",
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
};

/**
 * Lightbox. Pozadí je barva webu (`--sheet`, totéž co mobilní menu), ne
 * černá — ta působila jako vytržení ze stránky. V tmavém režimu je z toho
 * tmavá švestková, ve světlém růžová, a fotka pořád zůstává to nejsilnější
 * na obrazovce.
 */
export const lightbox: SxProps<Theme> = {
  // dialog přes celé okno, ať klik na prázdnou plochu míří na něj a zavírá
  width: "100vw",
  height: "100dvh",
  maxWidth: "none",
  maxHeight: "none",
  m: 0,
  p: { xs: "3.5rem 0.8rem", md: "3rem 5rem" },
  border: 0,
  background: "transparent",
  color: "var(--inkoust)",
  overflow: "hidden",
  "&[open]": { display: "flex", alignItems: "center", justifyContent: "center" },
  "&::backdrop": { background: "var(--sheet)" },
};

export const lbFigure: SxProps<Theme> = {
  m: 0,
  maxWidth: "100%",
  maxHeight: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.8rem",
};

export const lbImg: SxProps<Theme> = {
  display: "block",
  maxWidth: "100%",
  // místo na popisek pod fotkou
  maxHeight: "calc(100dvh - 9rem)",
  objectFit: "contain",
};

export const lbCaption: SxProps<Theme> = {
  display: "flex",
  gap: "1.4rem",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  letterSpacing: "0.1em",
  color: "var(--inkoust-70)",
};

const lbTlacitko: SxProps<Theme> = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  p: 0,
  border: 0,
  background: "none",
  color: "var(--inkoust-70)",
  fontFamily: "var(--font-display)",
  lineHeight: 1,
  cursor: "pointer",
  transition: "color .18s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "2px" },
};

export const lbClose: SxProps<Theme> = {
  ...lbTlacitko,
  top: "0.6rem",
  right: "0.6rem",
  fontSize: "1.5rem",
};

export const lbNav = (strana: "left" | "right"): SxProps<Theme> => ({
  ...lbTlacitko,
  top: "50%",
  transform: "translateY(-50%)",
  [strana]: { xs: "0.2rem", md: "1.2rem" },
  fontSize: "3rem",
});

/**
 * Autor přes spodní okraj fotky, schovaný do najetí myší.
 *
 * Schovává se průhledností, ne `display: none` — odečítač obrazovky ho tak
 * přečte vždycky, i když ho oko nevidí. Tmavý přechod je tu kvůli čitelnosti:
 * světlé písmo na fotce by se jinak ztrácelo ve světlých místech obrázku.
 */
export const credit: SxProps<Theme> = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  p: "2rem 0.8rem 0.65rem",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  letterSpacing: "0.08em",
  color: "#fff",
  background: "linear-gradient(to top, rgba(0,0,0,.62), rgba(0,0,0,0))",
  textAlign: "left",
  opacity: 0,
  pointerEvents: "none",
  transition: "opacity .25s ease",
};

/**
 * Kdy se ukáže tlačítko pod galerií (vzhled má společné ShowMore). Na
 * desktopu se vejde víc fotek než na mobilu, takže se to rozhoduje po zlomech.
 */
export const more = (pocet: number): SxProps<Theme> => ({
  display: poZlomech((z) => (pocet > VIDET[z] ? "inline-flex" : "none")),
});

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
