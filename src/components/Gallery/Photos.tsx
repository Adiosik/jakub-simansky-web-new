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
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import type { Photo } from "../../data/gallery";
import { asset } from "../../asset";
import Section from "../Section";
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
  const tlacitko = useRef<HTMLButtonElement | null>(null);
  // kde na obrazovce bylo tlačítko těsně před sbalením
  const drzetPozici = useRef<number | null>(null);

  const prepni = () => {
    if (vse && tlacitko.current) drzetPozici.current = tlacitko.current.getBoundingClientRect().top;
    setVse((v) => !v);
  };

  /**
   * Po sbalení vrátit tlačítko na totéž místo obrazovky.
   *
   * Sbalením zmizí kus stránky nad místem, kde se člověk dívá, a prohlížeč ho
   * odhodí dolů — na mobilu až na reference. Takhle zůstane tlačítko pod
   * prstem a nad ním poslední fotky, které zůstaly vidět.
   *
   * useLayoutEffect, ne useEffect: posun musí proběhnout dřív, než se sbalená
   * stránka poprvé vykreslí, jinak by bylo vidět cuknutí. A `instant`, protože
   * web má jinak plynulé rolování a tady by bylo znát.
   */
  useLayoutEffect(() => {
    if (drzetPozici.current === null || !tlacitko.current) return;
    const posun = tlacitko.current.getBoundingClientRect().top - drzetPozici.current;
    window.scrollBy({ top: posun, behavior: "instant" });
    drzetPozici.current = null;
  }, [vse]);
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

      <Box component="button" type="button" ref={tlacitko} sx={styles.more(photos.length)}
        aria-expanded={vse} onClick={prepni}>
        {vse ? t.less : `${t.more} (${photos.length})`}
      </Box>

      <Lightbox photos={photos} index={otevrena} onClose={() => setOtevrena(null)}
        onMove={posun} texts={texts} lang={lang} />
    </Section>
  );
}
