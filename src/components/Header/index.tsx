/**
 * Header — lepkavá lišta: jméno vlevo, navigace malými písmeny uprostřed/vpravo
 * (položka „hudba" má rozbalovací podmenu), přepínač jazyka a motivu vpravo.
 * Na mobilu se navigace schová pod hamburger do překryvu přes celou obrazovku.
 */
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import LangToggle from "../core/LangToggle";
import ThemeToggle from "../core/ThemeToggle";
import type { Motiv } from "../../theme-mode";
import * as styles from "./styles";

type Props = {
  texts: Translation;
  lang: Lang;
  onLang: (lang: Lang) => void;
  motiv: Motiv;
  onMotiv: (m: Motiv) => void;
};

/** Kotvy sekcí na stránce — musí sedět s `id` v SimanskyHero. */
const ID = {
  now: "aktualne",
  about: "o-mne",
  records: "desky",
  bands: "kapely",
  lessons: "doucovani",
  references: "reference",
  concerts: "koncerty",
  contact: "kontakt",
} as const;

export default function Header({ texts, lang, onLang, motiv, onMotiv }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Zavření podmenu klikem mimo a klávesou Esc.
  useEffect(() => {
    if (!dropOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setDropOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDropOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropOpen]);

  // Otevřený mobilní překryv nesmí nechat scrollovat stránku pod sebou.
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSheetOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  // pořadí podmenu drží pořadí sekcí na stránce: alba → kapely → doučování
  const sub = [
    { id: ID.records, label: texts.nav.records },
    { id: ID.bands, label: texts.nav.bands },
    { id: ID.lessons, label: texts.nav.lessons },
  ];

  return (
    <>
      <Box component="header" className="sim-anim d1" sx={styles.header(scrolled)}>
        {/* nahoře schované — jméno je hned pod tím v hero, nemá smysl ho zdvojovat.
            Stejně jako hero nese jen příjmení. */}
        <Box component="a" href="#top" sx={styles.brand(scrolled)}
          tabIndex={scrolled ? undefined : -1} aria-hidden={!scrolled}>šimanský</Box>

        <Box component="nav" sx={styles.nav}>
          {/* aktuálně je první — je to nejčerstvější obsah a na stránce stojí hned pod heroem */}
          <Box component="a" href={`#${ID.now}`} sx={styles.item}>{texts.now.title}</Box>
          <Box component="a" href={`#${ID.about}`} sx={styles.item}>{texts.nav.about}</Box>

          <Box ref={dropRef} sx={styles.dropWrap} onMouseLeave={() => setDropOpen(false)}>
            <Box component="button" type="button" sx={styles.item}
              aria-expanded={dropOpen} aria-haspopup="true"
              onClick={() => setDropOpen((v) => !v)} onMouseEnter={() => setDropOpen(true)}>
              {texts.nav.sounds}
              <Box component="svg" sx={styles.chevron(dropOpen)} viewBox="0 0 12 12" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.5 4.5L6 8l3.5-3.5" />
              </Box>
            </Box>
            <Box sx={styles.drop(dropOpen)}>
              <Box sx={styles.dropPanel(dropOpen)}>
                {sub.map((s) => (
                  <Box component="a" key={s.id} href={`#${s.id}`} sx={styles.dropItem}
                    onClick={() => setDropOpen(false)}>/{s.label}/</Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box component="a" href={`#${ID.references}`} sx={styles.item}>{texts.sections.references.title}</Box>
          <Box component="a" href={`#${ID.concerts}`} sx={styles.item}>{texts.nav.concerts}</Box>
          <Box component="a" href={`#${ID.contact}`} sx={styles.item}>{texts.nav.contact}</Box>
        </Box>

        <Box sx={styles.right}>
          <LangToggle lang={lang} onChange={onLang} />
          <ThemeToggle motiv={motiv} onChange={onMotiv}
            labelDark={texts.nav.darkMode} labelLight={texts.nav.lightMode} />
          <Box component="button" type="button" sx={styles.burger}
            aria-label={texts.nav.menu} aria-expanded={sheetOpen} onClick={() => setSheetOpen(true)}>
            <Box component="span" /><Box component="span" /><Box component="span" />
          </Box>
        </Box>
      </Box>

      {/* Mobilní menu */}
      <Box sx={styles.sheet(sheetOpen)} aria-hidden={!sheetOpen}>
        <Box component="button" type="button" sx={styles.sheetClose}
          onClick={() => setSheetOpen(false)} aria-label={texts.nav.closeMenu}>✕</Box>
        <Box component="a" href={`#${ID.now}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.now.title}</Box>
        <Box component="a" href={`#${ID.about}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.nav.about}</Box>
        {/* v překryvu se nic nerozbaluje, takže položky z podmenu jsou tu
            rovnocenné (lomítka jsou notace desktopu). Pořadí jako v podmenu. */}
        <Box component="a" href={`#${ID.records}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.nav.records}</Box>
        <Box component="a" href={`#${ID.bands}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.nav.bands}</Box>
        <Box component="a" href={`#${ID.lessons}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.nav.lessons}</Box>
        <Box component="a" href={`#${ID.references}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.sections.references.title}</Box>
        <Box component="a" href={`#${ID.concerts}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.nav.concerts}</Box>
        <Box component="a" href={`#${ID.contact}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.nav.contact}</Box>
      </Box>
    </>
  );
}
