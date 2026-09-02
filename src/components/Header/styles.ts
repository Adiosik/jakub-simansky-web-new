import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Lišta je na začátku stránky průhledná a bez jména — navigace stojí uprostřed,
 * protože jméno má hned pod tím obrovské hero. Po odscrollování se lišta objeví
 * (podklad + vlásová linka), jméno najede zleva a navigace se přesune doprava.
 *
 * Aby byl přechod plynulý, nepřepínáme mezi dvěma rozvrženími, ale animujeme
 * jedno: tři sloupce gridu [jméno | navigace | jazyk], u kterých se mění jen
 * šířky. `1fr auto 1fr` drží navigaci přesně uprostřed, `1fr auto 0fr` ji i s
 * jazykem odsune doprava. Obě hodnoty jsou ve stejné jednotce, takže se dají
 * interpolovat. Krajní sloupec s `0fr` si i tak drží šířku svého obsahu.
 */
export const header = (scrolled: boolean): SxProps<Theme> => ({
  position: "sticky",
  top: 0,
  zIndex: 60,
  display: "grid",
  // minmax(0,1fr) u prvního sloupce je nutnost: prosté `1fr` si drží minimální
  // šířku svého obsahu, takže nowrap jméno hlavičce bránilo zmenšit se pod
  // ~450 px a na úzkých displejích přetékala. Třetí sloupec `auto`/`0fr`
  // minimum naopak potřebuje, aby se ovládání vpravo nesmrsklo na nulu.
  gridTemplateColumns: scrolled ? "minmax(0,1fr) auto 0fr" : "minmax(0,1fr) auto 1fr",
  alignItems: "center",
  // na mobilu je prostřední sloupec (navigace) skrytý, takže velká mezera
  // mezi sloupci jen ubírá místo jménu
  columnGap: { xs: "0.5rem", md: "1.2rem" },
  // vodorovné odsazení je na mobilu větší než u sekcí: hamburger má 44px
  // dotykovou plochu, takže by se svými čárkami jinak lepil na okraj
  p: { xs: "var(--hlavicka-pad) 1.5rem", sm: "var(--hlavicka-pad) clamp(1.1rem,4vw,3rem)" },
  background: scrolled ? "var(--bar)" : "transparent",
  backdropFilter: scrolled ? "blur(10px)" : "none",
  borderBottom: `1px solid ${scrolled ? "var(--linka)" : "transparent"}`,
  transition: "grid-template-columns .5s cubic-bezier(.2,.8,.2,1), background .3s ease, border-color .3s ease",
});

/** Jméno vlevo — nahoře schované, po odscrollování najede. */
export const brand = (scrolled: boolean): SxProps<Theme> => ({
  gridColumn: 1,
  justifySelf: "start",
  fontFamily: "var(--font-mono)",
  // Od chvíle, kdy tu stojí jen příjmení, se vedle ovládání vejde v pohodě —
  // proto je na mobilu naopak větší než dřív, ne drobnější. Prostrkání drží
  // krok, aby značka nebyla jen shluk písmen.
  fontSize: { xs: "0.8rem", sm: "0.72rem" },
  letterSpacing: { xs: "0.16em", sm: "0.2em" },
  color: "var(--inkoust)",
  textDecoration: "none",
  whiteSpace: "nowrap",
  opacity: scrolled ? 1 : 0,
  transform: scrolled ? "none" : "translateX(-8px)",
  pointerEvents: scrolled ? "auto" : "none",
  transition: "opacity .35s ease, transform .45s cubic-bezier(.2,.8,.2,1), color .2s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
});

/** Vodorovná navigace — jen na desktopu, na mobilu ji nahradí překryv. */
export const nav: SxProps<Theme> = {
  gridColumn: 2,
  display: { xs: "none", md: "flex" },
  alignItems: "center",
  gap: "clamp(1rem,2.4vw,2.2rem)",
};

/** Pravý blok (jazyk + hamburger) — drží se na konci třetího sloupce. */
export const right: SxProps<Theme> = {
  gridColumn: 3,
  justifySelf: "end",
  display: "flex",
  alignItems: "center",
  // na mobilu jen tolik, aby se dalo trefit vedle — každý ušetřený pixel
  // je místo navíc pro jméno v levém sloupci
  gap: { xs: "0.45rem", md: 0 },
};

/** Položka navigace (i ta s podmenu) — podtržení vyjíždí zleva. */
export const item: SxProps<Theme> = {
  position: "relative",
  fontFamily: "var(--font-display)",
  fontSize: "0.94rem",
  fontWeight: 400,
  color: "var(--inkoust)",
  background: "none",
  border: "none",
  p: "0.35rem 0",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  transition: "color .2s ease",
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    height: "1px",
    width: "100%",
    background: "var(--obili)",
    transform: "scaleX(0)",
    transformOrigin: "left center",
    transition: "transform .28s cubic-bezier(.2,.8,.2,1)",
  },
  "&:hover": { color: "var(--obili)" },
  "&:hover::after, &[aria-expanded='true']::after": { transform: "scaleX(1)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};

/** Malý „chevron" u položky s podmenu. */
export const chevron = (open: boolean): SxProps<Theme> => ({
  width: 9,
  height: 9,
  flex: "0 0 auto",
  transform: open ? "rotate(180deg)" : "none",
  transition: "transform .25s ease",
});

export const dropWrap: SxProps<Theme> = { position: "relative" };

/**
 * Obal podmenu. Začíná hned pod tlačítkem (top: 100 %) a mezeru k liště řeší
 * vlastním horním odsazením — díky tomu je celá cesta myší od tlačítka
 * k položkám uvnitř prvku a menu se cestou nezavře. Odsazení = přesně odsazení
 * hlavičky, takže panel začíná na spodní lince lišty a vypadá, že na ní visí.
 */
export const drop = (open: boolean): SxProps<Theme> => ({
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  pt: "var(--hlavicka-pad)",
  pointerEvents: open ? "auto" : "none",
});

/** Vlastní vysunutá plocha — bez stínu, jen podklad a vlásová linka. */
export const dropPanel = (open: boolean): SxProps<Theme> => ({
  minWidth: "11rem",
  display: "flex",
  flexDirection: "column",
  p: "0.6rem 0.9rem",
  background: "var(--zaklad-2)",
  border: "1px solid var(--linka)",
  opacity: open ? 1 : 0,
  transform: open ? "translateY(0)" : "translateY(-6px)",
  transition: "opacity .22s ease, transform .22s ease",
});

/** Položka podmenu — mono font v lomítkách, drží „tiskový" ráz webu. */
export const dropItem: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.76rem",
  letterSpacing: "0.06em",
  color: "var(--inkoust-70)",
  textDecoration: "none",
  p: "0.32rem 0",
  whiteSpace: "nowrap",
  transition: "color .18s ease, padding-left .18s ease",
  "&:hover": { color: "var(--obili)", pl: "0.25rem" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "2px" },
};

/** Hamburger — jen na mobilu. 44 px je doporučené minimum pro dotyk. */
export const burger: SxProps<Theme> = {
  display: { xs: "inline-flex", md: "none" },
  flexDirection: "column",
  justifyContent: "center",
  gap: "6px",
  width: 44,
  height: 44,
  p: 0,
  background: "none",
  border: "none",
  cursor: "pointer",
  "& span": { display: "block", height: "2px", width: "26px", background: "var(--inkoust)", mx: "auto" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "2px" },
};

/** Mobilní překryv přes celou obrazovku. */
export const sheet = (open: boolean): SxProps<Theme> => ({
  position: "fixed",
  inset: 0,
  zIndex: 70,
  display: { xs: "flex", md: "none" },
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  // rozbalená skupina může na nízkém displeji obsah protáhnout přes okno
  overflowY: "auto",
  py: "5rem",
  background: "var(--sheet)",
  backdropFilter: "blur(6px)",
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity .28s ease",
});

/**
 * Rozbalovací položka v překryvu — vypadá jako odkaz, jen má šipku.
 * Šipka je vpravo, takže by text vytlačila z osy a skupina by nelícovala
 * s ostatními položkami. Vyrovnává to prázdné pole stejné šířky vlevo.
 */
export const sheetGroup: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "0.55rem",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-display)",
  fontSize: "2rem",
  color: "var(--inkoust)",
  p: "0.35rem 0.9rem",
  transition: "color .18s ease",
  "&::before": { content: '""', width: 14, flex: "0 0 auto" },
  "& svg": { width: 14, height: 14 },
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};

/**
 * Vysunuté podpoložky. Rozbaluje se přes `grid-template-rows: 0fr → 1fr`,
 * protože výšku obsahu tu dopředu neznáme a `max-height` by se muselo hádat:
 * moc malé ořízne, moc velké udělá po zavření prodlevu.
 */
export const sheetSub = (open: boolean): SxProps<Theme> => ({
  display: "grid",
  gridTemplateRows: open ? "1fr" : "0fr",
  opacity: open ? 1 : 0,
  transition: "grid-template-rows .28s ease, opacity .2s ease",
  "& > div": { overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" },
});

/**
 * Podpoložka je o stupeň drobnější, aby bylo vidět, že patří pod skupinu —
 * ale ne o moc, prstem se do ní musí dát trefit. Odsazení dělá z řádku terč
 * vysoký zhruba 46 px, což je nad doporučenou hranicí pro dotyk.
 */
export const sheetSubItem: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "1.5rem",
  color: "var(--inkoust-70)",
  textDecoration: "none",
  p: "0.55rem 0.9rem",
  transition: "color .18s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};

export const sheetItem: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "2rem",
  color: "var(--inkoust)",
  textDecoration: "none",
  p: "0.35rem 0.9rem",
  transition: "color .18s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};

/**
 * Křížek zavírající mobilní menu. Rozměrem i polohou sedí přesně na hamburger
 * pod ním (44 px, odsazení = odsazení hlavičky), takže po otevření menu zůstane
 * palec na stejném místě.
 */
export const sheetClose: SxProps<Theme> = {
  position: "absolute",
  top: "var(--hlavicka-pad)",
  right: "clamp(1.1rem,4vw,3rem)",
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 0,
  fontFamily: "var(--font-mono)",
  fontSize: "1.35rem",
  lineHeight: 1,
  color: "var(--inkoust-70)",
  background: "none",
  border: "none",
  cursor: "pointer",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
};
