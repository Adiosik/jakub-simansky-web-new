/**
 * Hero — centrovaný úvod: drobná linka nad jménem, obří jméno malými písmeny,
 * podtitul, krátký lede a pod tím velký portrét s drobným creditem.
 */
import Box from "@mui/material/Box";
import type { Translation } from "../../language";
import { PROFILE_PHOTO } from "../../data/site";
import { asset } from "../../asset";
import * as styles from "./styles";

export default function Hero({ texts }: { texts: Translation }) {
  return (
    <Box component="section" id="top" sx={styles.hero}>
      <Box component="p" className="sim-anim d1" sx={styles.eyebrow}>
        {texts.head.tagline}
      </Box>

      <Box component="h1" className="sim-anim d2" sx={styles.name}>
        jakub šimanský
      </Box>

      <Box component="p" className="sim-anim d2" sx={styles.subtitle}>
        {texts.hero.subtitle}
      </Box>

      <Box component="p" className="sim-anim d3" sx={styles.lede}>
        {texts.lede}
      </Box>

      <Box component="figure" className="sim-anim d4" sx={styles.figure}>
        <img src={asset(PROFILE_PHOTO)} alt={texts.hero.photoAlt} />
        <Box component="figcaption" sx={styles.credit}>{texts.hero.photoCredit}</Box>
      </Box>
    </Box>
  );
}
