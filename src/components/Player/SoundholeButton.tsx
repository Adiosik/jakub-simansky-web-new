/**
 * SoundholeButton — ozvučný otvor kytary: v klidu trojúhelník PLAY, při hraní
 * se rozechvějí struny (SMIL <animate>). Přepínání PLAY⟶struny řídí CSS přes
 * .sim-root.playing (viz index.css).
 */
export default function SoundholeButton({ playing }: { playing: boolean }) {
  const strings = [
    { x: 35, w: 1.7, amp: 4.4 }, { x: 42.5, w: 1.4, amp: 3.7 }, { x: 50, w: 1.15, amp: 3.1 },
    { x: 57.5, w: 0.95, amp: 2.6 }, { x: 65, w: 0.8, amp: 2.1 },
  ];
  const TOP = 10, MID = 50, BOT = 90;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><clipPath id="simHole"><circle cx="50" cy="50" r="34" /></clipPath></defs>
      <circle cx="50" cy="50" r="36" fill="var(--otvor)" stroke="var(--saze)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="var(--papir)" strokeWidth="1" opacity="0.12" />
      {/* PLAY (v klidu) */}
      <path className="sim-tri" d="M42 35 L42 65 L67 50 Z" fill="var(--struna)" />
      {/* STRUNY (při hraní) */}
      <g className="sim-strings" clipPath="url(#simHole)">
        {strings.map((s, i) => {
          const straight = `M${s.x} ${TOP} Q ${s.x} ${MID} ${s.x} ${BOT}`;
          const left = `M${s.x} ${TOP} Q ${s.x - s.amp} ${MID} ${s.x} ${BOT}`;
          const right = `M${s.x} ${TOP} Q ${s.x + s.amp} ${MID} ${s.x} ${BOT}`;
          return (
            <path key={i} d={straight} fill="none" stroke="var(--struna)" strokeWidth={s.w} strokeLinecap="round" opacity="0.92">
              {playing && (<animate attributeName="d" values={`${straight};${left};${straight};${right};${straight}`}
                dur={`${(0.24 + i * 0.03).toFixed(2)}s`} begin={`${(i * 0.04).toFixed(2)}s`} repeatCount="indefinite" />)}
            </path>
          );
        })}
      </g>
    </svg>
  );
}
