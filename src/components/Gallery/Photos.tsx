/**
 * Photos — mřížka čtvercových fotek. Používá ji „fotky" i „art"; liší se jen
 * daty a nadpisem, proto je to jedna komponenta se dvěma použitími.
 *
 * Zpočátku ukáže jen část a zbytek schová za tlačítko. Kolik je to fotek,
 * záleží na šířce okna (mobil 3, tablet 4, desktop 6), proto se skrývá
 * v CSS podle zlomů a ne v JavaScriptu podle počtu — nemusí se hlídat změna
 * velikosti okna. Skryté fotky se nevykreslí, takže je prohlížeč ani
 * nezačne stahovat, dokud se na tlačítko nekline.
 */
import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import type { Photo } from "../../data/gallery";
import { asset } from "../../asset";
import Section from "../Section";
import ShowMore from "../core/ShowMore";
import Lightbox from "./Lightbox";
import * as styles from "./styles";

type Props = {
  id: string;
  title: string;
  intro?: string;
  photos: Photo[];
  texts: Translation;
  lang: Lang;
};

export default function Photos({ id, title, intro, photos, texts, lang }: Props) {
  const [vse, setVse] = useState(false);
  const [otevrena, setOtevrena] = useState<number | null>(null);
  const t = texts.sections.photos;

  // dokola: za poslední fotkou je zase první. useCallback, ať lightbox
  // nepřepojuje posluchače kláves při každém vykreslení
  const posun = useCallback((krok: number) => {
    setOtevrena((i) => (i === null ? i : (i + krok + photos.length) % photos.length));
  }, [photos.length]);

  // sekce je ohlášená v navigaci, takže se ukáže i bez obsahu — jinak by
  // odkaz v menu vedl na nic
  if (photos.length === 0) {
    return <Section id={id} title={title} intro={intro} wide>
      <Box sx={styles.soon}>{texts.sections.soon}</Box>
    </Section>;
  }

  return (
    <Section id={id} title={title} intro={intro} wide>
      <Box sx={styles.grid(!vse)}>
        {photos.map((photo, i) => (
          // index v klíči: stejná fotka se v datech smí objevit dvakrát
          <Box key={photo.src + i} component="figure" sx={styles.tile}>
            {/* tlačítko, ne klik na obrázek — jen tak se k fotce dostane
                i klávesnicí a odečítač ohlásí, že se dá otevřít */}
            <Box component="button" type="button" sx={styles.zoom}
              aria-label={`${t.open}: ${photo.alt[lang]}`} onClick={() => setOtevrena(i)}>
              <Box component="img" src={asset(photo.src)} alt="" loading="lazy"
                sx={{ ...styles.photo, objectPosition: photo.pozice ?? "50% 50%" }} />
            </Box>
            {photo.autor && (
              <Box component="figcaption" sx={styles.credit}>{t.credit} {photo.autor}</Box>
            )}
          </Box>
        ))}
      </Box>

      <ShowMore rozbaleno={vse} onToggle={() => setVse((v) => !v)} pocet={photos.length}
        vice={texts.sections.showAll} mene={texts.sections.showLess}
        sx={styles.more(photos.length)} />

      <Lightbox photos={photos} index={otevrena} onClose={() => setOtevrena(null)}
        onMove={posun} texts={texts} lang={lang} />
    </Section>
  );
}
