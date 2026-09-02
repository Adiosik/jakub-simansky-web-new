import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

/**
 * Sleduje myš nad prvkem a vrací její polohu jako dvojici −1…1 od středu.
 *
 * Používá to kresba v hero — staví to na triku, že se kresba
 * vytiskne dvakrát v jiné barvě a desky se podle myši rozejdou, jako když se
 * v linorytu netrefí soutisk. Držet ten výpočet na dvou místech by znamenalo
 * dvakrát řešit i ohled na `prefers-reduced-motion`.
 *
 * Když má uživatel v systému omezený pohyb, vrací vždy střed — efekt se tedy
 * nespustí vůbec, ne že by jen zpomalil.
 */
export function usePointerParallax<T extends HTMLElement>() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const ref = useRef<T | null>(null);
  const omezitPohyb = useRef(false);

  useEffect(() => {
    omezitPohyb.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  const onMouseMove = useCallback((e: ReactMouseEvent) => {
    if (omezitPohyb.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPointer({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  }, []);

  const onMouseLeave = useCallback(() => setPointer({ x: 0, y: 0 }), []);

  return { ref, pointer, onMouseMove, onMouseLeave };
}
