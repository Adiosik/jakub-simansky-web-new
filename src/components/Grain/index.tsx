/**
 * Grain — jemný šum přes celou plochu pro „tiskový" nádech.
 * Drží se nízko: stačí náznak, jinak by zašpinil text. Režim míchání i sílu
 * řídí proměnné, protože na tmavém podkladu se musí rozsvěcet, ne násobit.
 */
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

const sx: SxProps<Theme> = {
  // 100% (ne 100vw/100vh) — vyplní viewport bez šířky scrollbaru, takže nebliká vodorovný scrollbar
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 50,
  opacity: "var(--zrno-opacity)",
  mixBlendMode: "var(--zrno-blend)",
};

export default function Grain() {
  return (
    <Box component="svg" sx={sx} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="simNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#simNoise)" />
    </Box>
  );
}
