import type { SxProps, Theme } from "@mui/material/styles";

/** Kapely vedle sebe na desktopu, pod sebou na mobilu. */
export const grid: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
  gap: { xs: "2.4rem", md: "clamp(2.4rem,5vw,4rem)" },
  width: "100%",
  // texty kapel jsou různě dlouhé; zarovnání nahoru drží nadpisy v jedné lince
  alignItems: "start",
  /**
   * Dělicí linka je vlastní prvek uprostřed mřížky, ne rámeček druhého sloupce.
   * Rámeček by seděl na jeho levé hraně, tedy o půl mezery vedle skutečného
   * středu — a čím větší mezera, tím víc by to bylo znát.
   */
  position: "relative",
  "&::after": {
    content: { xs: "none", md: '""' },
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: "1px",
    background: "var(--linka)",
  },
};

export const item: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  // na mobilu dělí bloky vodorovná linka; na desktopu je linka uprostřed mřížky
  pt: { xs: "2.2rem", md: 0 },
  borderTop: { xs: "1px solid var(--linka)", md: "none" },
  "&:first-of-type": { pt: 0, borderTop: "none" },
};

export const name: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.15rem,2.6vw,1.45rem)",
  fontWeight: 500,
  lineHeight: 1.3,
  color: "var(--inkoust)",
  m: 0,
};

export const members: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  letterSpacing: "0.14em",
  color: "var(--obili)",
  mt: "0.7rem",
};

export const description: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text)",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "var(--inkoust-70)",
  // popisy jsou víceodstavcové, proto zarovnání vlevo a `pre-line`, aby se
  // prázdné řádky v datech projevily jako odstavce. Šířku needržíme na `ch`,
  // ale na celém sloupci — pevná měřítko by z dlouhého textu udělalo nudli
  // uprostřed prázdného místa.
  maxWidth: "100%",
  textAlign: "left",
  whiteSpace: "pre-line",
  mt: "1rem",
};

/** Odkazy na sítě kapely — dvojice ikona + název, stejné jako v kontaktech. */
export const links: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: { xs: "1.2rem 1.6rem", sm: "1.4rem 2.4rem" },
  mt: "1.8rem",
};
