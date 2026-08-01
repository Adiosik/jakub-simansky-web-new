/**
 * CopyButton — zkopíruje text (e-mail) do schránky, ukáže tooltip a na ~1,8 s
 * přepne ikonu na zelené zaškrtnutí. Fallback přes execCommand pro starší/
 * nezabezpečené kontexty.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import * as styles from "./styles";

type Props = { value: string; labelCopy: string; labelCopied: string; ariaLabel: string };

export default function CopyButton({ value, labelCopy, labelCopied, ariaLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  }, [value]);

  return (
    <Box component="button" type="button" sx={styles.button(copied)} onClick={copy}
      aria-label={copied ? labelCopied : ariaLabel}>
      <Box component="span" className="sim-tip">{copied ? labelCopied : labelCopy}</Box>
      {copied ? (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </Box>
  );
}
