/**
 * ShowMore — tlačítko „zobrazit všechny / zobrazit méně" pod dlouhým výpisem.
 * Používá ho galerie i reference, aby vypadalo a chovalo se všude stejně.
 *
 * Po sbalení drží tlačítko na stejném místě obrazovky. Sbalením zmizí kus
 * stránky nad místem, kam se člověk dívá, a prohlížeč by ho jinak odhodil
 * dolů — na mobilu až na další sekci. Takhle zůstane tlačítko pod prstem
 * a nad ním poslední položky, které zůstaly vidět.
 */
import { useLayoutEffect, useRef } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import * as styles from "./styles";

type Props = {
  rozbaleno: boolean;
  onToggle: () => void;
  /** celkový počet položek, ukáže se v závorce u „zobrazit všechny" */
  pocet: number;
  vice: string;
  mene: string;
  /** doplňkové styly — typicky kdy se má tlačítko ukázat */
  sx?: SxProps<Theme>;
};

export default function ShowMore({ rozbaleno, onToggle, pocet, vice, mene, sx }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);
  // kde na obrazovce bylo tlačítko těsně před sbalením
  const drzetPozici = useRef<number | null>(null);

  const klik = () => {
    if (rozbaleno && ref.current) drzetPozici.current = ref.current.getBoundingClientRect().top;
    onToggle();
  };

  // useLayoutEffect, ne useEffect: posun musí proběhnout dřív, než se sbalená
  // stránka poprvé vykreslí, jinak by bylo vidět cuknutí. A `instant`, protože
  // web má jinak plynulé rolování a tady by bylo znát.
  useLayoutEffect(() => {
    if (drzetPozici.current === null || !ref.current) return;
    const posun = ref.current.getBoundingClientRect().top - drzetPozici.current;
    window.scrollBy({ top: posun, behavior: "instant" });
    drzetPozici.current = null;
  }, [rozbaleno]);

  return (
    <Box component="button" type="button" ref={ref} aria-expanded={rozbaleno} onClick={klik}
      sx={[styles.tlacitko, ...(Array.isArray(sx) ? sx : [sx])]}>
      {rozbaleno ? mene : `${vice} (${pocet})`}
    </Box>
  );
}
