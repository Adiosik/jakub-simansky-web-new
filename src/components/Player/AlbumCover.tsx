/**
 * AlbumCover — obal alba: vlastní obrázek (album.cover), jinak generovaný
 * soutiskový motiv podle indexu.
 */
import type { Album } from "../../data/albums";
import { asset } from "../../asset";

function CoverMark({ i }: { i: number }) {
  const O = "var(--obili)", S = "var(--stroj)";
  const mm: React.CSSProperties = { mixBlendMode: "multiply" };
  const v = [
    (<g key="0"><circle cx="42" cy="54" r="28" fill={O} /><circle cx="60" cy="46" r="24" fill={S} style={mm} /></g>),
    (<g key="1">{[0,1,2,3,4].map((n) => <rect key={n} x={-10 + n * 26} y="-10" width="13" height="120" fill={n % 2 ? S : O} transform="rotate(20 50 50)" style={mm} />)}</g>),
    (<g key="2">{[34,24,14].map((r, n) => <circle key={n} cx="50" cy="50" r={r + 6} fill="none" stroke={n % 2 ? S : O} strokeWidth="6" />)}</g>),
    (<g key="3"><path d="M22 74 L50 22 L78 74 Z" fill={O} /><rect x="18" y="70" width="64" height="11" fill={S} style={mm} /></g>),
    (<g key="4">{[...Array(9)].map((_, n) => <circle key={n} cx={26 + (n % 3) * 24} cy={26 + Math.floor(n / 3) * 24} r="8" fill={n % 2 ? S : O} />)}</g>),
  ];
  return <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block", background: "var(--papir)" }}>{v[i % 5]}</svg>;
}

export default function AlbumCover({ album, index }: { album: Album; index: number }) {
  if (album.cover) {
    return <img src={asset(album.cover)} alt={album.title} loading="lazy"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  }
  return <CoverMark i={index} />;
}
