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
};

/**
 * Drobná prostrkaná linka nad jménem (obor + místo).
 *
 * Na úzkých displejích je písmo i prostrkání menší a čárky po stranách kratší.
 * Nejde o kosmetiku: kdyby se text zalomil na dva řádky, čárky by zůstaly
 * svisle uprostřed vedle dvouřádkového bloku a vypadaly by odtržené. Takhle se
 * text udrží na jednom řádku a čárky sedí těsně u něj.
 */
export const eyebrow: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: { xs: "0.58rem", sm: "0.68rem" },
  letterSpacing: { xs: "0.1em", sm: "0.24em" },
  color: "var(--inkoust-45)",
  m: 0,
  display: "flex",
  alignItems: "center",
  gap: { xs: "0.5rem", sm: "0.9rem" },
  "&::before, &::after": {
    content: '""',
    width: { xs: "15px", sm: "clamp(18px,5vw,42px)" },
    height: "1px",
    background: "var(--linka-2)",
    display: "inline-block",
    flex: "0 0 auto",
  },
};

/** Jméno — obří, malými písmeny, na dva řádky až od určité šířky. */
export const name: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontWeight: 500,
  fontSize: "clamp(2.9rem,10vw,6.2rem)",
  lineHeight: 1.02,
  letterSpacing: "-0.02em",
  textTransform: "lowercase",
  m: "clamp(1rem,3vw,1.8rem) 0 0",
  maxWidth: "16ch",
};

/** Podtitul „kdo jsem" — jediné místo v okrové. */
export const subtitle: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1rem,2.4vw,1.35rem)",
  fontWeight: 400,
  color: "var(--obili)",
  m: "0.9rem 0 0",
};

export const lede: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.86rem",
  fontWeight: 300,
  lineHeight: 1.8,
  color: "var(--inkoust-70)",
  maxWidth: "46ch",
  m: "1.6rem 0 0",
};

/** Portrét — velký, centrovaný, bez rámečku; jen jemná vinětace do papíru. */
export const figure: SxProps<Theme> = {
  m: "clamp(2.6rem,7vh,4.5rem) 0 0",
  width: "100%",
  maxWidth: 720,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& img": {
    width: "100%",
    height: "auto",
    display: "block",
    filter: "saturate(.88) contrast(1.02)",
  },
};

export const credit: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontStyle: "italic",
  fontSize: "0.66rem",
  letterSpacing: "0.08em",
  color: "var(--inkoust-45)",
  mt: "0.8rem",
};
