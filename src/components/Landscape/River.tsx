/**
 * River — žlutý (obilný) zvlněný říční/cestní pás přes krajinu, se soutiskovým
 * ghostem a probleskujícími bílými vlnkami (animace .sim-ripple).
 */
const RIVER_PATH =
  "M0 340 C 60 332 90 330 130 330 C 200 330 220 348 270 348 C 340 348 360 332 420 332 " +
  "C 490 332 500 350 560 350 C 640 350 660 336 700 336 C 750 336 780 342 800 344 L 800 376 " +
  "C 780 374 750 368 700 368 C 660 368 640 384 560 384 C 500 384 490 366 420 366 " +
  "C 360 366 340 382 270 382 C 220 382 200 368 130 364 C 90 362 60 374 0 374 Z";

export default function River() {
  const ripples = [
    { d: "M70 350 q16 -6 32 0", del: "0s" },
    { d: "M230 360 q16 -6 32 0", del: ".9s" },
    { d: "M400 352 q16 -6 32 0", del: "1.8s" },
    { d: "M560 366 q16 -6 32 0", del: ".5s" },
    { d: "M700 352 q16 -6 32 0", del: "1.4s" },
  ];
  return (
    <g>
      {/* studený soutiskový ghost (drží styl "dva tisky") */}
      <path d={RIVER_PATH} fill="var(--stroj)" opacity="0.3" transform="translate(5,3)" style={{ mixBlendMode: "multiply" }} />
      {/* hlavní voda – žlutá (obilí) */}
      <path d={RIVER_PATH} fill="var(--obili)" stroke="#6E6020" strokeWidth="2.2" />
      {/* bílé vlnky – probleskují a vlní se */}
      {ripples.map((r, i) => (
        <path key={i} className="sim-ripple" style={{ animationDelay: r.del }} d={r.d}
          fill="none" stroke="var(--papir)" strokeWidth="2.6" strokeLinecap="round" opacity="0.6" />
      ))}
      {/* brácha na nafukovacím člunu – pluje napříč řekou */}
      <g className="sim-boat">
        <g transform="translate(0 350)">
          <g className="sim-boat-bob">
            {/* nafukovací trup */}
            <path d="M-15 0 Q-15 6 -8 7 L8 7 Q15 6 15 0 Z" fill="var(--saze)" />
            <ellipse cx="0" cy="0" rx="15.5" ry="4" fill="none" stroke="var(--saze)" strokeWidth="2.4" />
            {/* postavička */}
            <circle cx="1" cy="-9" r="2.2" fill="var(--saze)" />
            <path d="M1 -7 L1 -1" stroke="var(--saze)" strokeWidth="2" strokeLinecap="round" />
            {/* pádlo */}
            <path d="M1 -5 L-9 1" stroke="var(--saze)" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  );
}
