/**
 * Lightbox — fotka přes celou obrazovku po kliknutí v galerii.
 *
 * Postavené na nativním <dialog>. Ten sám zamkne fokus uvnitř, zavře se na
 * Esc, vrátí fokus tam, odkud se otevřel, a odečítačům obrazovky ohlásí, že
 * je modální — všechno, co by se jinak muselo psát a ladit ručně.
 *
 * Autor fotky je tady vidět normálně, ne až při najetí myší jako v mřížce.
 * Na mobilu myš není, takže bez toho by se jméno fotografky nedalo zobrazit
 * vůbec.
 */
import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import type { Photo } from "../../data/gallery";
import { asset } from "../../asset";
import * as styles from "./styles";

type Props = {
  photos: Photo[];
  /** která fotka je otevřená, nebo null = zavřeno */
  index: number | null;
  onClose: () => void;
  /** posun o krok vpřed (1) nebo vzad (-1) */
  onMove: (krok: number) => void;
  texts: Translation;
  lang: Lang;
};

export default function Lightbox({ photos, index, onClose, onMove, texts, lang }: Props) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const t = texts.sections.photos;
  const otevreno = index !== null;

  // Otevírání řídí React stav, dialog se mu jen přizpůsobí. `showModal()`,
  // ne `open` — jen modální dialog dostane pozadí, zámek fokusu a Esc.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (otevreno && !d.open) d.showModal();
    if (!otevreno && d.open) d.close();
  }, [otevreno]);

  // Šipky listují a stránka pod dialogem se mezitím nesmí posouvat.
  useEffect(() => {
    if (!otevreno) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    const predtim = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = predtim;
      document.removeEventListener("keydown", onKey);
    };
  }, [otevreno, onMove]);

  const foto = index === null ? null : photos[index];
  const vic = photos.length > 1;

  return (
    <Box component="dialog" ref={ref} sx={styles.lightbox}
      aria-label={foto ? foto.alt[lang] : undefined}
      // Esc zavře dialog sám; tohle jen srovná React stav
      onClose={onClose}
      // klik mimo fotku (na prázdnou plochu dialogu) zavírá
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {foto && (
        <>
          <Box component="button" type="button" sx={styles.lbClose}
            aria-label={t.close} onClick={onClose}>✕</Box>

          <Box component="figure" sx={styles.lbFigure}>
            <Box component="img" src={asset(foto.src)} alt={foto.alt[lang]} sx={styles.lbImg} />
            <Box component="figcaption" sx={styles.lbCaption}>
              {foto.autor && <span>{t.credit} {foto.autor}</span>}
              {vic && index !== null && <span>{index + 1} / {photos.length}</span>}
            </Box>
          </Box>

          {vic && (
            <>
              <Box component="button" type="button" sx={styles.lbNav("left")}
                aria-label={t.prev} onClick={() => onMove(-1)}>‹</Box>
              <Box component="button" type="button" sx={styles.lbNav("right")}
                aria-label={t.next} onClick={() => onMove(1)}>›</Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}
