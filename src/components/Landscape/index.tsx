/**
 * Landscape — soutiskový linoryt hanácké krajiny přes celou šířku sloupce.
 * Drží si vlastní parallax (pohyb myší posouvá teplou/studenou desku a řeku).
 * Animace běží přes CSS třídy v index.css (sim-drift, sim-smoke, sim-birds…).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import LandscapePlate from "./LandscapePlate";
import River from "./River";
import * as styles from "./styles";

const PARALLAX_STRENGTH = 11;

export default function Landscape({ caption, alt }: { caption: string; alt: string }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const figRef = useRef<HTMLElement | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (reduce.current || !figRef.current) return;
    const rect = figRef.current.getBoundingClientRect();
    setPointer({ x: ((e.clientX - rect.left) / rect.width - 0.5) * 2, y: ((e.clientY - rect.top) / rect.height - 0.5) * 2 });
  }, []);
  const onLeave = useCallback(() => setPointer({ x: 0, y: 0 }), []);

  const k = PARALLAX_STRENGTH;
  const warmPlate = `translate(${(-pointer.x * k).toFixed(2)},${(-pointer.y * k).toFixed(2)})`;
  const coldPlate = `translate(${(6 + pointer.x * k).toFixed(2)},${(4 + pointer.y * k).toFixed(2)})`;
  const riverShift = `translate(${(pointer.x * 7).toFixed(2)},${(48 + pointer.y * 4).toFixed(2)})`;

  return (
    <Box component="figure" className="sim-print-wrap" sx={styles.figure} ref={figRef}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <svg viewBox="0 0 800 510" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={alt}>
        <g className="sim-plate" style={{ color: "var(--deska-teple)" }} transform={warmPlate}><LandscapePlate /></g>
        <g className="sim-plate" style={{ color: "var(--deska-studene)" }} transform={coldPlate}><g className="sim-drift"><LandscapePlate /></g></g>
        <g className="sim-river-band" transform={riverShift}><River /></g>
      </svg>
      <Box component="figcaption" sx={styles.caption}>{caption}</Box>
    </Box>
  );
}
