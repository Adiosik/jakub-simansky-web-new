import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Míra tabulek uvnitř širokých sekcí (reference, koncerty). Je užší než celý
 * sloupec, aby řádek nebyl přes celou obrazovku a dal se přečíst na jeden zátah.
 *
 * Pozor: `ch` se počítá z písma toho kterého prvku, proto míra předepisuje
 * i písmo. Uvnitř tabulky si ho jednotlivé buňky zase přenastavují — tady
 * slouží jen k tomu, aby šířka vyšla všude stejně.
 */
export const MIRA_TABULKY: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.05rem,2.6vw,1.45rem)",
  width: "100%",
  maxWidth: "44ch",
  // `body` sekce je blok, ne flex — bez tohohle by se užší tabulka zarazila
  // doleva a rozešla se s vycentrovaným nadpisem nad ní
  mx: "auto",
};

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
 * Nadpis sekce. Dřív ho z okolního textu vydělovala lomítka („/ desky /");
 * bez nich to musí odvést sám stupeň písma, proto je znatelně větší než
 * cokoli jiného v sekci — jinak by na dlouhé stránce splynul s obsahem.
 */
export const marker: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.7rem,4.5vw,2.6rem)",
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: "-0.015em",
  color: "var(--inkoust)",
  m: 0,
};

export const intro: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-drobne)",
  fontWeight: 300,
  lineHeight: 1.75,
  color: "var(--inkoust-70)",
  maxWidth: "56ch",
  m: "0.9rem 0 0",
};

/**
 * `tight` je pro sekce bez úvodní věty, které začínají rovnou tabulkou —
 * plné odsazení tam nechává nadpis viset vysoko nad prvním řádkem, protože
 * mezeru pod nadpisem už nemá co vyplnit.
 */
export const body = (tight: boolean): SxProps<Theme> => ({
  width: "100%",
  mt: tight ? "clamp(1.3rem,2.8vw,2rem)" : "clamp(1.8rem,4vw,3rem)",
});
