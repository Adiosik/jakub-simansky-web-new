/**
 * useArpeggioPlayer — veškerá Web Audio logika ukázkového přehrávače (placeholder
 * „znělka" alba, ne reálná nahrávka). Drží stav vybraného alba + skladby a vrací
 * ovládání. Každá skladba spustí arpeggio od jiného tónu (rotace sekvence).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ALBUMS } from "../../data/albums";

const STEP = 0.44;

export function useArpeggioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [albumIdx, setAlbumIdx] = useState(0);
  const [trackIdx, setTrackIdx] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextRef = useRef<number>(0);
  const stepIdx = useRef<number>(0);
  const seqRef = useRef<number[]>(ALBUMS[0].sequence);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (ctxRef.current) ctxRef.current.close();
  }, []);

  useEffect(() => { setTrackIdx(0); }, [albumIdx]);
  useEffect(() => {
    const base = ALBUMS[albumIdx].sequence;
    const off = base.length ? trackIdx % base.length : 0;
    // každá skladba začne arpeggio na jiném tónu, ať zní odlišně
    seqRef.current = base.slice(off).concat(base.slice(0, off));
    stepIdx.current = 0;
  }, [albumIdx, trackIdx]);

  function ensureCtx() {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain(); master.gain.value = 0;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600;
      const delay = ctx.createDelay(1.0); delay.delayTime.value = 0.33;
      const fb = ctx.createGain(); fb.gain.value = 0.27;
      delay.connect(fb); fb.connect(delay);
      master.connect(lp); lp.connect(ctx.destination); lp.connect(delay); delay.connect(ctx.destination);
      ctxRef.current = ctx; masterRef.current = master;
    }
    return ctxRef.current;
  }

  function pluck(ctx: AudioContext, freq: number, t: number) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.9, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0007, t + 1.7);
    const o1 = ctx.createOscillator(); o1.type = "triangle"; o1.frequency.value = freq;
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2;
    const og2 = ctx.createGain(); og2.gain.value = 0.22;
    o1.connect(g); o2.connect(og2); og2.connect(g); g.connect(masterRef.current!);
    o1.start(t); o2.start(t); o1.stop(t + 1.8); o2.stop(t + 1.8);
  }

  const scheduler = useCallback(() => {
    const ctx = ctxRef.current; if (!ctx) return;
    const seq = seqRef.current;
    while (nextRef.current < ctx.currentTime + 0.2) {
      pluck(ctx, seq[stepIdx.current % seq.length], nextRef.current);
      stepIdx.current++; nextRef.current += STEP;
    }
  }, []);

  const startAudio = useCallback(async () => {
    const ctx = ensureCtx();
    if (ctx.state === "suspended") await ctx.resume();
    masterRef.current!.gain.cancelScheduledValues(ctx.currentTime);
    masterRef.current!.gain.setTargetAtTime(0.16, ctx.currentTime, 0.3);
    nextRef.current = ctx.currentTime + 0.06;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(scheduler, 60);
    setPlaying(true);
  }, [scheduler]);

  const stopAudio = useCallback(async () => {
    const ctx = ensureCtx();
    if (ctx.state === "suspended") await ctx.resume();
    masterRef.current!.gain.cancelScheduledValues(ctx.currentTime);
    masterRef.current!.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => { void (playing ? stopAudio() : startAudio()); }, [playing, startAudio, stopAudio]);

  const selectTrack = useCallback((i: number) => {
    if (i === trackIdx && playing) { void stopAudio(); return; }
    setTrackIdx(i);
    void startAudio();
  }, [trackIdx, playing, startAudio, stopAudio]);

  const selectAlbum = useCallback((i: number) => {
    if (i === albumIdx && playing) { void stopAudio(); return; }
    setAlbumIdx(i);
    void startAudio();
  }, [albumIdx, playing, startAudio, stopAudio]);

  const prev = useCallback(() => setAlbumIdx((i) => (i + ALBUMS.length - 1) % ALBUMS.length), []);
  const next = useCallback(() => setAlbumIdx((i) => (i + 1) % ALBUMS.length), []);

  // Přeskakování skladeb dokola v rámci alba. Na rozdíl od selectTrack nikdy
  // nezastavuje — šipky slouží k přepínání, ne k pauze.
  const stepTrack = useCallback((dir: 1 | -1) => {
    const n = ALBUMS[albumIdx].tracks.length;
    if (!n) return;
    setTrackIdx((i) => (i + dir + n) % n);
    void startAudio();
  }, [albumIdx, startAudio]);

  const prevTrack = useCallback(() => stepTrack(-1), [stepTrack]);
  const nextTrack = useCallback(() => stepTrack(1), [stepTrack]);

  return { playing, albumIdx, trackIdx, toggle, selectAlbum, selectTrack, prev, next, prevTrack, nextTrack };
}

export type ArpeggioPlayer = ReturnType<typeof useArpeggioPlayer>;
