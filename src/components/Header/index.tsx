/**
 * Header — lepkavá lišta: jméno vlevo, navigace malými písmeny uprostřed/vpravo
 * (položky „hudba" a „galerie" mají rozbalovací podmenu), přepínač jazyka
 * a motivu vpravo. Na mobilu se navigace schová pod hamburger do překryvu
 * přes celou obrazovku.
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
  photos: "fotky",
  video: "video",
  art: "art",
  references: "reference",
  concerts: "koncerty",
  contact: "kontakt",
} as const;

type Polozka = { id: string; label: string };

export default function Header({ texts, lang, onLang, motiv, onMotiv }: Props) {
  const [scrolled, setScrolled] = useState(false);
  // které podmenu je otevřené (klíč), nebo nic
  const [drop, setDrop] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  // která skupina je rozbalená v mobilním překryvu (klíč), nebo nic
  const [sheetDrop, setSheetDrop] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Zavření podmenu klikem mimo navigaci a klávesou Esc.
  useEffect(() => {
    if (!drop) return;
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setDrop(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrop(null); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [drop]);

  // Otevřený mobilní překryv nesmí nechat scrollovat stránku pod sebou.
  useEffect(() => {
    if (!sheetOpen) { setSheetDrop(null); return; }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSheetOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  // pořadí podmenu drží pořadí sekcí na stránce
  const hudba: Polozka[] = [
    { id: ID.records, label: texts.nav.records },
    { id: ID.bands, label: texts.nav.bands },
    { id: ID.lessons, label: texts.nav.lessons },
  ];

  const galerie: Polozka[] = [
    { id: ID.photos, label: texts.nav.photos },
    { id: ID.video, label: texts.nav.video },
    { id: ID.art, label: texts.nav.art },
  ];

  /** Položka navigace s rozbalovacím podmenu. */
  const Rozbal = ({ klic, label, polozky }: { klic: string; label: string; polozky: Polozka[] }) => {
    const open = drop === klic;
    return (
      <Box sx={styles.dropWrap} onMouseLeave={() => setDrop(null)}>
        <Box component="button" type="button" sx={styles.item}
          aria-expanded={open} aria-haspopup="true"
          onClick={() => setDrop(open ? null : klic)} onMouseEnter={() => setDrop(klic)}>
          {label}
          <Box component="svg" sx={styles.chevron(open)} viewBox="0 0 12 12" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5L6 8l3.5-3.5" />
          </Box>
        </Box>
        <Box sx={styles.drop(open)}>
          <Box sx={styles.dropPanel(open)}>
            {polozky.map((s) => (
              <Box component="a" key={s.id} href={`#${s.id}`} sx={styles.dropItem}
                onClick={() => setDrop(null)}>{s.label}</Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  /** Skupina v mobilním překryvu — stejné dělení jako podmenu na desktopu. */
  const SheetRozbal = ({ klic, label, polozky }: { klic: string; label: string; polozky: Polozka[] }) => {
    const open = sheetDrop === klic;
    return (
      <>
        <Box component="button" type="button" sx={styles.sheetGroup}
          aria-expanded={open} onClick={() => setSheetDrop(open ? null : klic)}>
          {label}
          <Box component="svg" sx={styles.chevron(open)} viewBox="0 0 12 12" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 4.5L6 8l3.5-3.5" />
          </Box>
        </Box>
        <Box sx={styles.sheetSub(open)}>
          <Box component="div">
            {polozky.map((s) => (
              <Box component="a" key={s.id} href={`#${s.id}`} sx={styles.sheetSubItem}
                tabIndex={open ? undefined : -1}
                onClick={() => setSheetOpen(false)}>{s.label}</Box>
            ))}
          </Box>
        </Box>
      </>
    );
  };

  return (
    <>
      <Box component="header" className="sim-anim d1" sx={styles.header(scrolled)}>
        {/* nahoře schované — jméno je hned pod tím v hero, nemá smysl ho zdvojovat.
            Stejně jako hero nese jen příjmení. */}
        <Box component="a" href="#top" sx={styles.brand(scrolled)}
          tabIndex={scrolled ? undefined : -1} aria-hidden={!scrolled}>šimanský</Box>

        <Box component="nav" sx={styles.nav} ref={navRef}>
          {/* aktuálně je první — je to nejčerstvější obsah a na stránce stojí hned pod heroem */}
          <Box component="a" href={`#${ID.now}`} sx={styles.item}>{texts.now.title}</Box>
          <Box component="a" href={`#${ID.about}`} sx={styles.item}>{texts.nav.about}</Box>

          <Rozbal klic="hudba" label={texts.nav.sounds} polozky={hudba} />
          <Rozbal klic="galerie" label={texts.nav.gallery} polozky={galerie} />

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
        <SheetRozbal klic="hudba" label={texts.nav.sounds} polozky={hudba} />
        <SheetRozbal klic="galerie" label={texts.nav.gallery} polozky={galerie} />
        <Box component="a" href={`#${ID.references}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.sections.references.title}</Box>
        <Box component="a" href={`#${ID.concerts}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.nav.concerts}</Box>
        <Box component="a" href={`#${ID.contact}`} sx={styles.sheetItem} onClick={() => setSheetOpen(false)}>{texts.nav.contact}</Box>
      </Box>
    </>
  );
}
