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
  gridTemplateColumns: scrolled ? "1fr auto 0fr" : "1fr auto 1fr",
  alignItems: "center",
  columnGap: "1.2rem",
  p: "var(--hlavicka-pad) clamp(1.1rem,4vw,3rem)",
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
  fontSize: "0.72rem",
  letterSpacing: "0.2em",
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

/** Hamburger — jen na mobilu. */
export const burger: SxProps<Theme> = {
  display: { xs: "inline-flex", md: "none" },
  flexDirection: "column",
  justifyContent: "center",
  gap: "5px",
  width: 34,
  height: 34,
  p: 0,
  background: "none",
  border: "none",
  cursor: "pointer",
  "& span": { display: "block", height: "1.5px", width: "20px", background: "var(--inkoust)", mx: "auto" },
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
  gap: "0.9rem",
  background: "rgba(228,231,222,.98)",
  backdropFilter: "blur(6px)",
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity .28s ease",
});

export const sheetItem: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "1.6rem",
  color: "var(--inkoust)",
  textDecoration: "none",
  p: "0.2rem 0.6rem",
  transition: "color .18s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};

export const sheetSub: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.86rem",
  letterSpacing: "0.06em",
  color: "var(--inkoust-45)",
  textDecoration: "none",
  p: "0.1rem 0.6rem",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};

export const sheetClose: SxProps<Theme> = {
  position: "absolute",
  top: "1rem",
  right: "clamp(1.1rem,4vw,3rem)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  letterSpacing: "0.18em",
  color: "var(--inkoust-70)",
  background: "none",
  border: "none",
  cursor: "pointer",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "3px" },
};
