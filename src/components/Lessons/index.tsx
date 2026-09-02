/**
 * Lessons — sekce „doučování": že Jakub vedle hraní taky učí. Zatím jen text,
 * odkaz na inzerát přibude, až bude. Obsah je v src/language/*.
 */
import Box from "@mui/material/Box";
import type { Translation } from "../../language";
import { LESSONS_PHOTO } from "../../data/site";
import { asset } from "../../asset";
import Section from "../Section";
import * as styles from "./styles";

export default function Lessons({ texts }: { texts: Translation }) {
  const t = texts.sections.lessons;

  return (
    <Section id="doucovani" title={t.title} wide tight>
      <Box component="img" src={asset(LESSONS_PHOTO)} alt={t.photoAlt}
        loading="lazy" sx={styles.photo} />
      <Box sx={styles.body}>{t.body}</Box>
    </Section>
  );
}
