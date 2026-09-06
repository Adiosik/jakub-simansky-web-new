import type { SxProps, Theme } from "@mui/material/styles";

export const hero: SxProps<Theme> = {
  // width: 100 % je nutnost, ne kosmetika. Hero je flex položka v rodiči
  // s `alignItems: center`, takže by se bez toho roztáhl podle nejširšího
  // potomka (nadpisu) místo podle okna — jméno by se nezalomilo a na úzkých
  // displejích by vytlačilo celou stránku do šířky.
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  px: "clamp(1.1rem,4vw,3rem)",
  pt: "clamp(3rem,9vh,7rem)",
  /**
   * Hero vyplní okno až na výšku hlavičky, aby při prvním načtení nevykukovala
   * shora další sekce. `svh` je záměr: na mobilu se počítá k menší, ustálené
   * výšce okna, takže se nic nerozbije, až se při odrolování schová lišta
   * prohlížeče. Odečtená hodnota je výška hlavičky — svislé odsazení
   * (--hlavicka-pad, dvakrát) plus 28px přepínače motivu, což je v ní ten
   * nejvyšší prvek.
   *
   * Odečtených 9vh navíc: nadpis další sekce leží o --mezera (13vh, dole
   * omezeno na 5rem) pod heroem, takže se s nimi trefí jen pár desítek pixelů
   * pod okraj okna — při načtení není vidět, ale stačí na něj krátce sjet.
   * Ta nerovnost 9vh < --mezera platí v celém rozsahu, ve kterém se mezera
   * pohybuje, takže sekce nevykoukne ani na velmi nízkém nebo vysokém okně.
   */
  minHeight: "calc(100svh - 2 * var(--hlavicka-pad) - 28px - 9vh)",
  // volné místo, které minHeight přidá, se rozdělí nad i pod obsah — na vysokém
  // okně by jinak celé zbylo dole a kresba by visela u horního okraje
  justifyContent: "center",
};

/**
 * Nadpis stránky — skrytý očím, ale ne odečítačům obrazovky a vyhledávačům.
 *
 * `display: none` ani `visibility: hidden` použít nejde, ty text schovají
 * i před nimi. Tenhle postup ho zmenší na jeden pixel mimo výřez a ořízne,
 * takže nezabírá místo a nikam neposouvá rozvržení.
 */
export const jmeno: SxProps<Theme> = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * Kresba pod jménem — celá, bez ořezu; pozadí má průhledné.
 * Uvnitř leží dvě barevné desky přes sebe, proto `position: relative`
 * a pevný poměr stran: desky jsou odsazené na všechny strany a bez něj
 * by obal neměl podle čeho určit výšku.
 */
export const figure: SxProps<Theme> = {
  m: "clamp(2.2rem,6vh,3.6rem) 0 0",
  width: "100%",
  maxWidth: 620,
  position: "relative",
  aspectRatio: "1536 / 1024",
  /**
   * Kresba se vybarvuje maskou, ne obrázkem: soubor je černá linka na
   * průhledném pozadí, a černou nejde filtrem spolehlivě převést na libovolný
   * odstín (nemá co otáčet — chybí jí barevný tón). Maska použije tvar linky
   * a barvu vezme z podkladu, takže se dá nastavit přesně — a hlavně jde
   * použít dvakrát v jiné barvě, což je celý ten soutiskový efekt.
   */
  /**
   * Míchání zůstává na obalu, ne na vnitřní desce. Prvek s vlastním
   * `transform` zakládá vrstvicí kontext, takže kdyby se míchalo až uvnitř,
   * desky by se přetiskovaly jen samy se sebou a soutisk by zmizel. Takhle
   * se obaly míchají mezi sebou přesně jako dřív.
   */
  "& .sim-kresba": {
    position: "absolute",
    inset: 0,
    // na světlém podkladu násobíme, na tmavém rozsvěcíme (viz --soutisk)
    mixBlendMode: "var(--soutisk)",
    transition: "transform .12s ease-out",
  },
  "& .sim-kresba > *": {
    position: "absolute",
    inset: 0,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
  },
  "& .sim-kresba-a > *": { background: "var(--kresba)" },
  "& .sim-kresba-b > *": { background: "var(--kresba-2)" },
};

