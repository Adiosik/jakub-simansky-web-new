/**
 * SimanskyHero — kořenová kompozice stránky. Drží jen sdílený stav (jazyk,
 * přehrávač) a skládá sekce pod sebe do jednoho dlouhého centrovaného sloupce.
 * Styling a logika jsou v komponentách pod src/components/*.
 */
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

import { translations, type Lang } from "./language";
import { nactiMotiv, pouzijMotiv, type Motiv } from "./theme-mode";
import { ALBUMS } from "./data/albums";
import Grain from "./components/Grain";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Now from "./components/Now";
import Section from "./components/Section";
import Player from "./components/Player";
import Landscape from "./components/Landscape";
import Records from "./components/Records";
import Bands from "./components/Bands";
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
  const [motiv, setMotiv] = useState<Motiv>(() => nactiMotiv());
  // které album je nachystané v přehrávači; přepíná se šipkami i klikem v sekci Desky
  const [albumIdx, setAlbumIdx] = useState(0);
  const prevAlbum = () => setAlbumIdx((i) => (i + ALBUMS.length - 1) % ALBUMS.length);
  const nextAlbum = () => setAlbumIdx((i) => (i + 1) % ALBUMS.length);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => { pouzijMotiv(motiv); }, [motiv]);

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
      // Kladný spodní okraj rozšiřuje sledovanou oblast pod spodní hranu okna,
      // takže se sekce začne odkrývat ještě než na ni dojedeš a v okamžiku,
      // kdy ji uvidíš, už je náběh rozjetý. Záporná hodnota by ho naopak
      // oddalovala, dokud prvek nevyjede kus nad spodní hranu.
      { rootMargin: "0px 0px 4% 0px", threshold: 0 },
    );

    targets.forEach((el) => {
      // Co je při načtení už ve výřezu, odkryjeme rovnou. Bez toho může prvek
      // u samého konce stránky (zápatí) uváznout neviditelný — nikdy se totiž
      // nedostane do sledované oblasti, protože už není kam odscrollovat.
      if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [lang]);

  const texts = translations[lang];

  return (
    <Box className={"sim-root" + (ready ? " is-ready" : "")} sx={rootSx}>
      <Grain />
      <Header texts={texts} lang={lang} onLang={setLang} motiv={motiv} onMotiv={setMotiv} />

      <Box component="main" sx={mainSx}>
        <Hero texts={texts} />
        <Now texts={texts} />

        <Section id="poslech" title={texts.player.title} intro={texts.player.intro} wide>
          <Player texts={texts} albumIdx={albumIdx} onPrev={prevAlbum} onNext={nextAlbum} />
        </Section>

        <Records texts={texts} lang={lang} albumIdx={albumIdx} onSelect={setAlbumIdx} />
        {/* kapely hned za sólovou diskografií — patří k sobě tematicky */}
        <Bands texts={texts} lang={lang} />
        {/* ohlasy pak jako sociální důkaz k tomu, co je nad nimi */}
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
