/**
 * About — sekce „o mně": životopisný text v úzkém čtecím sloupci.
 */
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Translation } from "../../language";
import Section from "../Section";

const body: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text)",
  fontWeight: 300,
  lineHeight: 1.95,
  color: "var(--inkoust-70)",
  textAlign: "left",
  whiteSpace: "pre-line",
  // stejná šířka jako sekce koncertů nad tím — text tedy lícuje s tabulkou
  width: "100%",
  mx: "auto",
};

export default function About({ texts }: { texts: Translation }) {
  const t = texts.sections.about;
  return (
    <Section id="o-mne" title={t.title} intro={t.intro} wide>
      <Box sx={body}>{t.body}</Box>
    </Section>
  );
}
