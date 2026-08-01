/**
 * About — sekce „o mně": životopisný text v úzkém čtecím sloupci.
 */
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Translation } from "../../language";
import Section from "../Section";

const body: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.82rem",
  fontWeight: 300,
  lineHeight: 1.95,
  color: "var(--inkoust-70)",
  textAlign: "left",
  whiteSpace: "pre-line",
  maxWidth: "60ch",
  mx: "auto",
};

export default function About({ texts }: { texts: Translation }) {
  const t = texts.sections.about;
  return (
    <Section id="o-mne" title={t.title} intro={t.intro}>
      <Box sx={body}>{t.body}</Box>
    </Section>
  );
}
