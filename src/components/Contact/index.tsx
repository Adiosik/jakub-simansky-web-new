/**
 * Contact — sekce „kontakt": velký e-mail s kopírováním a odkazy na sítě.
 */
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Translation } from "../../language";
import { EMAIL } from "../../data/site";
import { SOCIALS } from "../../data/socials";
import SocialLink from "../core/Social";
import CopyButton from "../core/CopyButton";
import Section from "../Section";

const label: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.64rem",
  letterSpacing: "0.2em",
  color: "var(--inkoust-45)",
  mb: "0.9rem",
};

const mailRow: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.7rem",
  flexWrap: "wrap",
};

/** E-mail je největší prvek sekce — ať je jasné, kam psát. */
const email: SxProps<Theme> = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.05rem,3.4vw,1.9rem)",
  color: "var(--inkoust)",
  textDecoration: "none",
  borderBottom: "1px solid var(--linka-2)",
  pb: "0.15rem",
  transition: "color .2s ease, border-color .2s ease",
  "&:hover": { color: "var(--obili)", borderBottomColor: "var(--obili)" },
  "&:focus-visible": { outline: "2px solid var(--obili)", outlineOffset: "4px" },
};

const socials: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  // mezera se na užších displejích stáhne, ať se sítě vejdou na jeden řádek
  // a poslední z nich nepřeteče dolů
  gap: { xs: "1.2rem 1.4rem", sm: "1.4rem 2.2rem" },
  // odstup od štítku „sledujte" dává `mb` toho štítku, stejně jako u bookingu
  mt: 0,
};

export default function Contact({ texts }: { texts: Translation }) {
  const t = texts.sections.contact;
  return (
    <Section id="kontakt" title={t.title} wide tight>
      <Box sx={label}>{t.bookingLabel}</Box>
      <Box sx={mailRow}>
        <Box component="a" href={`mailto:${EMAIL}`} sx={email}>{EMAIL}</Box>
        <CopyButton value={EMAIL} labelCopy={texts.footer.copy} labelCopied={texts.footer.copied}
          ariaLabel={texts.footer.copyAria} />
      </Box>

      <Box sx={{ ...socials, mt: "clamp(2.4rem,6vw,3.6rem)" }}>
        {SOCIALS.map((s) => <SocialLink key={s.name} social={s} variant="contact" />)}
      </Box>
    </Section>
  );
}
