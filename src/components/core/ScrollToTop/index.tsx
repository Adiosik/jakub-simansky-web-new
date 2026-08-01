/**
 * ScrollToTop — plovoucí tlačítko vpravo dole. Objeví se po odscrollování dolů,
 * klikem plynule vyjede na začátek stránky. Desktop i mobil.
 */
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import * as styles from "./styles";

// mezera (px) nad footerem, jakmile se footer objeví — menší = tlačítko vyjede míň
const GAP_ABOVE_FOOTER = 1;

export default function ScrollToTop({ label = "Nahoru" }: { label?: string }) {
  const [visible, setVisible] = useState(false);
  // o kolik px zvednout, ať tlačítko nepřekrývá footer (zvlášť na mobilu dole)
  const [lift, setLift] = useState(0);

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > 400);
      const footer = document.querySelector("footer");
      const overlap = footer ? window.innerHeight - footer.getBoundingClientRect().top : 0;
      setLift(overlap > 0 ? overlap + GAP_ABOVE_FOOTER : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <Box component="button" type="button" aria-label={label} sx={styles.button(visible, lift)}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 10l4-4 4 4" />
      </svg>
    </Box>
  );
}
