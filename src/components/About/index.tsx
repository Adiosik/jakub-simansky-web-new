/**
 * About — sekce „o mně": životopisný text v úzkém čtecím sloupci.
 */
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Translation } from "../../language";
import Section from "../Section";
import { MIRA_TABULKY } from "../Section/styles";

/**
 * Míru drží obal, ne text sám. Šířka se počítá v `ch` z písma prvku, a kdyby
 * ji nesl odstavec, počítala by se z jeho mono písma a vyšla jinak než
 * u tabulek. Takhle text jen vyplní obal a s koncerty nad ním lícuje.
 */
const wrap: SxProps<Theme> = MIRA_TABULKY;

const body: SxProps<Theme> = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text)",
  fontWeight: 300,
  lineHeight: 1.95,
  color: "var(--inkoust-70)",
  textAlign: "left",
  whiteSpace: "pre-line",
  width: "100%",
};

export default function About({ texts }: { texts: Translation }) {
  const t = texts.sections.about;
  return (
    <Section id="o-mne" title={t.title} wide tight>
      <Box sx={wrap}><Box sx={body}>{t.body}</Box></Box>
    </Section>
  );
}
