/**
 * Hero — centrovaný úvod: obří jméno malými písmeny a pod ním kresba.
 */
import Box from "@mui/material/Box";
import type { Translation } from "../../language";
import { PROFILE_PHOTO } from "../../data/site";
import { asset } from "../../asset";
import { usePointerParallax } from "../../hooks/usePointerParallax";
import * as styles from "./styles";

/**
 * Každé písmeno dostane vlastní odstín (--pismeno-1 až 8) — nerovnoměrný tisk
 * jako v linorytu. `aria-label` je tu proto, že rozdělení na jednotlivé znaky
 * svádí odečítače obrazovky k hláskování; s ním přečtou celé slovo.
 */
const PRIJMENI = [..."šimanský"];

/** O kolik pixelů se desky rozejdou při krajní poloze myši. */
const SOUTISK = 9;

export default function Hero({ texts }: { texts: Translation }) {
  const { ref, pointer, onMouseMove, onMouseLeave } = usePointerParallax<HTMLElement>();
  const maska = { maskImage: `url(${asset(PROFILE_PHOTO)})`, WebkitMaskImage: `url(${asset(PROFILE_PHOTO)})` };
  const deskaA = `translate(${(-pointer.x * SOUTISK).toFixed(2)}px, ${(-pointer.y * SOUTISK).toFixed(2)}px)`;
  const deskaB = `translate(${(5 + pointer.x * SOUTISK).toFixed(2)}px, ${(3 + pointer.y * SOUTISK).toFixed(2)}px)`;

  return (
    <Box component="section" id="top" sx={styles.hero}>
      <Box component="h1" className="sim-anim d1" sx={styles.name} aria-label="šimanský">
        {PRIJMENI.map((znak, i) => (
          <Box component="span" key={i} aria-hidden="true"
            sx={{ color: `var(--pismeno-${(i % 8) + 1})` }}>{znak}</Box>
        ))}
      </Box>

      <Box component="figure" className="sim-anim d2" sx={styles.figure} ref={ref}
        onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        {/* Deska je vnořená schválně: obal nese posun podle myši (inline
            `transform`), vnitřek vlastní klidové oddalování. Na jednom prvku
            by inline transform animaci přebil. */}
        <Box className="sim-kresba sim-kresba-b" aria-hidden="true" sx={{ transform: deskaB }}>
          <Box className="sim-soutisk-b" sx={maska} />
        </Box>
        <Box className="sim-kresba sim-kresba-a" role="img" aria-label={texts.hero.photoAlt}
          sx={{ transform: deskaA }}>
          <Box className="sim-soutisk-a" sx={maska} />
        </Box>
      </Box>
    </Box>
  );
}
