import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Tlačítko vedle přepínače jazyka.
 *
 * Výška na desktopu je schválně 28 px, ne 40: výšku hlavičky určuje její
 * nejvyšší prvek, a položky navigace mají ~29 px. Vyšší tlačítko by lištu
 * roztáhlo, položka „hudba" by se v ní vycentrovala a její podmenu — které
 * na ní visí — by se odlepilo od spodní linky lišty.
 * Na mobilu je 40 px kvůli dotyku; tam se podmenu nezobrazuje, takže nevadí.
 */
export const button: SxProps<Theme> = {
  ml: { xs: "0.15rem", sm: "0.9rem" },
  flex: "0 0 auto",
  width: { xs: 40, md: 28 },
  height: { xs: 40, md: 28 },
  p: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--inkoust-70)",
  transition: "color .2s ease",
  "&:hover": { color: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "2px" },
  "& svg": { width: { xs: 18, md: 17 }, height: { xs: 18, md: 17 }, display: "block" },
};
