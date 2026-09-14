/**
 * Records — sekce „alba": diskografie pod sebou, každé album jako centrovaný
 * blok — název s rokem a vydavatelem, pod ním velký obal, přehrávač Bandcampu,
 * popis a skladby. Název je nahoře, aby bylo jasné, ke které desce obal patří,
 * ještě než se k němu doroluje.
 *
 * Popis a skladby jsou schované za tlačítkem „o albu". Rozepsané pod
 * každou deskou dělaly ze sekce stěnu textu; takhle je na první pohled vidět
 * jen to hlavní.
 *
 * Dřív tu byl jeden přehrávač pod nadpisem a alba se do něj přepínala klikem
 * na obal. Když má každé album vlastní, není co přepínat — odpadly tím šipky,
 * stav vybraného alba i skákání po stránce.
 */
import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { ALBUMS, type Text } from "../../data/albums";
import AlbumCover from "../Album/AlbumCover";
import Embed from "../Album/Embed";
import Section from "../Section";
import ShowMore from "../core/ShowMore";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

/** Vlastní jméno je řetězec, obecný údaj má obě jazykové verze. */
const text = (t: Text, lang: Lang) => (typeof t === "string" ? t : t[lang]);

/**
 * Rozbalovací část alba. Obsah zůstává v HTML i sbalený (jen `hidden`), aby
 * ho tlačítko mělo na co odkázat a vyhledávače ho viděly.
 */
function About({ id, texts, children }: { id: string; texts: Translation; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box id={id} hidden={!open} sx={styles.about}>{children}</Box>
      <ShowMore rozbaleno={open} onToggle={() => setOpen((o) => !o)} controls={id}
        vice={texts.sections.records.readMore} mene={texts.sections.showLess} />
    </>
  );
}

export default function Records({ texts, lang }: Props) {
  const t = texts.sections.records;

  return (
    <Section id="desky" title={t.title} wide>
      <Box sx={styles.list}>
        {ALBUMS.map((album, i) => (
          <Box key={album.title} sx={styles.item}>
            <Box component="h3" sx={styles.title}>
              {album.artist ? album.artist + " — " : ""}{album.title}
            </Box>
            <Box sx={styles.meta}>{album.year} · {text(album.label, lang)}</Box>
            {album.format && <Box sx={styles.format}>({text(album.format, lang)})</Box>}
            <Box sx={styles.cover}><AlbumCover album={album} index={i} /></Box>
            <Embed album={album} sx={{ ...styles.SIRKA, mt: "1.4rem" }} />
            <About id={`album-${i}-about`} texts={texts}>
              {album.description && <Box sx={styles.desc}>{album.description[lang]}</Box>}
              <Box sx={styles.tracks}>
                <Box sx={styles.tracksText}>{album.tracks.join(" · ")}</Box>
              </Box>
            </About>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
