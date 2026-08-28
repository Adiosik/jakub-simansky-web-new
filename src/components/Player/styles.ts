import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Rozměry vloženého přehrávače Bandcampu — naměřené, ne odhadnuté.
 *
 * Šířka: přehrávač má vlastní pevné maximum 700 px. Nad ním se už neroztáhne,
 * jen kolem něj přibývá pozadí, takže širší lišta by vedle rámečku nechala
 * prázdný pruh. Proto je celá sekce také 700 px — hlavička s obalem a šipkami
 * tak lícuje s rámečkem.
 *
 * Výška: 120 px pro variantu bez seznamu skladeb (s ním je 470 px). Stejnou
 * výšku má i zástupná plocha, aby stránka po kliknutí nepodskočila.
 */
export const EMBED_WIDTH = 700;
export const EMBED_HEIGHT = 120;

/** Přehrávač — bez rámečku a stínu, jen vlásové linky nahoře a dole. */
export const player: SxProps<Theme> = {
  width: "100%",
  maxWidth: EMBED_WIDTH,
  mx: "auto",
  textAlign: "left",
  borderTop: "1px solid var(--linka)",
  borderBottom: "1px solid var(--linka)",
  py: "clamp(1.2rem,3vw,1.8rem)",
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
};

export const top: SxProps<Theme> = {
  display: "flex",
  // mobil: název alba se zalomí na druhý řádek (viz `titles`)
  flexWrap: { xs: "wrap", sm: "nowrap" },
  alignItems: "center",
  columnGap: "1.1rem",
  rowGap: "0.8rem",
};

/**
 * Obal desky v hlavičce. Od chvíle, kdy ho vložený přehrávač nezobrazuje
 * (`artwork=none`), je to jediný obal v sekci — proto výrazně větší.
 */
export const cover: SxProps<Theme> = {
  width: { xs: 88, sm: 118 },
  height: { xs: 88, sm: 118 },
  flex: "0 0 auto",
  overflow: "hidden",
  background: "var(--zaklad-2)",
  "& > *": { width: "100%", height: "100%", objectFit: "cover", display: "block" },
};

export const titles: SxProps<Theme> = {
  minWidth: 0,
  flex: "1 1 auto",
  order: { xs: 2, sm: 0 },
  flexBasis: { xs: "100%", sm: "auto" },
};

export const title: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: 1.25,
  color: "var(--inkoust)",
};

export const sub: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.64rem",
  letterSpacing: "0.14em",
  color: "var(--inkoust-45)",
  mt: "0.25rem",
};

/** Přepínání alb — svislé šipky, ať se nepletou s ovládáním uvnitř přehrávače. */
export const navs: SxProps<Theme> = {
  flex: "0 0 auto",
  ml: "auto",
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  gap: "0.4rem",
};

export const nav: SxProps<Theme> = {
  width: 34,
  height: 34,
  p: 0,
  border: "1px solid var(--linka-2)",
  background: "none",
  cursor: "pointer",
  color: "var(--inkoust)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "border-color .18s ease, color .18s ease",
  "&:hover": { borderColor: "var(--obili)", color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "2px" },
  "& svg": { width: 13, height: 13, display: "block" },
};

export const frame: SxProps<Theme> = {
  width: "100%",
  height: EMBED_HEIGHT,
  border: 0,
  display: "block",
};
