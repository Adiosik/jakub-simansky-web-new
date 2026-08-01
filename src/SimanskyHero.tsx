/**
 * SimanskyHero — kořenová kompozice stránky. Drží jen sdílený stav (jazyk,
 * přehrávač) a skládá sekce pod sebe do jednoho dlouhého centrovaného sloupce.
 * Styling a logika jsou v komponentách pod src/components/*.
 */
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

import { translations, type Lang } from "./language";
import { useArpeggioPlayer } from "./components/Player/useArpeggioPlayer";
import Grain from "./components/Grain";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Now from "./components/Now";
import Section from "./components/Section";
import Player from "./components/Player";
import Landscape from "./components/Landscape";
import Records from "./components/Records";
import References from "./components/References";
import Shows from "./components/Shows";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/core/ScrollToTop";

const rootSx: SxProps<Theme> = {
  background: "var(--zaklad)",
  color: "var(--inkoust)",
  minHeight: "100vh",
  position: "relative",
  // overflow-x: clip ořízne vodorovně bez vytvoření scroll-kontejneru => sticky header funguje
  overflowX: "clip",
  display: "flex",
  flexDirection: "column",
  fontFamily: "var(--font-mono)",
};

const mainSx: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  // menší než --mezera: zápatí je jen tenká linka, plná sekční mezera by před ní
  // dělala prázdné pole
  pb: "clamp(3rem,7vh,5rem)",
};

export default function SimanskyHero() {
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<Lang>("csCZ");
  const player = useArpeggioPlayer();

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Náběh sekcí při scrollu: jakmile se prvek dostane do viewportu, dostane
  // .is-visible a zůstane odkrytý (observer ho přestane sledovat).
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".sim-in, .sim-print-wrap");
    const reveal = (el: Element) => el.classList.add("is-visible");

    if (!("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          reveal(e.target);
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    targets.forEach((el) => {
      // Co je při načtení už ve výřezu, odkryjeme rovnou. Bez toho může prvek
      // u samého konce stránky (zápatí) uváznout neviditelný — nikdy se totiž
      // nedostane nad zmenšenou spodní hranu, protože už není kam odscrollovat.
      if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [lang]);

  const texts = translations[lang];

  return (
    <Box className={"sim-root" + (ready ? " is-ready" : "") + (player.playing ? " playing" : "")} sx={rootSx}>
      <Grain />
      <Header texts={texts} lang={lang} onLang={setLang} />

      <Box component="main" sx={mainSx}>
        <Hero texts={texts} />
        <Now texts={texts} />

        <Section id="poslech" title={texts.player.title} intro={texts.player.intro} wide>
          <Player texts={texts} player={player} />
        </Section>

        <Records texts={texts} lang={lang} player={player} />
        {/* ohlasy hned za deskami — sociální důkaz u toho, co potvrzuje */}
        <References texts={texts} lang={lang} />
        <Shows texts={texts} lang={lang} />
        <About texts={texts} />

        <Section id="krajina" title={texts.print.title} wide>
          <Landscape caption={texts.print.caption} alt={texts.print.alt} />
        </Section>

        <Contact texts={texts} />
      </Box>

      <Footer texts={texts} />
      <ScrollToTop label={texts.footer.toTop} />
    </Box>
  );
}
