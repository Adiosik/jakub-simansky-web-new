/**
 * LandscapePlate — jedna „tisková deska" hanácké krajiny (kopce, paneláky,
 * zámecká věž, komín, kouř, ptáci). Vykresluje se dvakrát přes sebe (teplá +
 * studená barva) pro efekt soutisku. Barvu řídí rodič přes `color` (currentColor).
 */
import type { ReactElement } from "react";

const PANELAKY = [
  { x: 520, y: 280, w: 30, h: 40, cols: 2, rows: 3 },
  { x: 556, y: 252, w: 34, h: 68, cols: 3, rows: 5 },
  { x: 638, y: 268, w: 42, h: 52, cols: 3, rows: 4 },
];

type PanelakProps = { x: number; y: number; w: number; h: number; cols: number; rows: number };

function Panelak({ x, y, w, h, cols, rows }: PanelakProps) {
  const padX = 6, padY = 7, ww = 6, wh = 7;
  const stepX = cols > 1 ? (w - 2 * padX - ww) / (cols - 1) : 0;
  const stepY = rows > 1 ? (h - 2 * padY - wh) / (rows - 1) : 0;
  const wins: ReactElement[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    wins.push(<rect key={r + "-" + c} x={x + padX + c * stepX} y={y + padY + r * stepY} width={ww} height={wh} fill="var(--papir)" opacity="0.55" />);
  }
  return (<g><rect x={x} y={y} width={w} height={h} fill="currentColor" />{wins}</g>);
}

export default function LandscapePlate() {
  return (
    <g>
      <circle cx="140" cy="118" r="46" fill="currentColor" opacity="0.9" />
      <path d="M0 300 Q160 250 340 290 T720 280 L800 300 L800 420 L0 420 Z" fill="currentColor" opacity="0.92"/>
      <path d="M0 340 Q200 300 420 332 T800 330 L800 460 L0 460 Z" fill="currentColor"/>
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={20 + i * 56} y1="372" x2={42 + i * 56} y2="338" stroke="var(--papir)" strokeWidth="2" opacity="0.5" />
      ))}
      {/* paneláky (různé výšky) */}
      {PANELAKY.map((p, i) => <Panelak key={i} {...p} />)}
      {/* zámecká věž se špicí – kužel splývá s válcem, bez okapu */}
      <g>
        <rect x="595" y="250" width="36" height="70" fill="currentColor" />
        <path d="M595 250 L613 210 L631 250 Z" fill="currentColor" />
        <circle cx="613" cy="207" r="3" fill="currentColor" />
        <rect x="608" y="272" width="10" height="15" fill="var(--papir)" opacity="0.55" />
      </g>
      <path d="M690 150 L724 150 L718 320 L696 320 Z" fill="currentColor" />
      {[0, 1, 2, 3].map((i) => (<line key={"c" + i} x1="694" y1={185 + i * 32} x2="720" y2={185 + i * 32} stroke="var(--papir)" strokeWidth="3" opacity="0.6" />))}
      <path className="sim-smoke" d="M707 150 q-18 -26 4 -50 q22 -22 2 -48 q-16 -22 8 -40" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <g className="sim-birds">
        <path d="M120 130 q14 -12 28 0 q14 -12 28 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M210 100 q11 -9 22 0 q11 -9 22 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  );
}
