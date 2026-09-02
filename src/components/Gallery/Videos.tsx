/**
 * Videos — sekce „video": vložené přehrávače z YouTube pod sebou.
 */
import Box from "@mui/material/Box";
import type { Translation } from "../../language";
import { VIDEA } from "../../data/gallery";
import Section from "../Section";
import * as styles from "./styles";

export default function Videos({ texts }: { texts: Translation }) {
  const t = texts.sections.video;

  // stejně jako u fotek: v navigaci sekce je, tak ať na stránce taky stojí
  if (VIDEA.length === 0) {
    return <Section id="video" title={t.title} intro={t.intro} wide>
      <Box sx={styles.soon}>{texts.sections.soon}</Box>
    </Section>;
  }

  return (
    <Section id="video" title={t.title} intro={t.intro} wide>
      <Box sx={styles.list}>
        {VIDEA.map((video) => (
          <Box key={video.youtubeId} sx={styles.item}>
            {/* nocookie doména neuloží divákovi cookies, dokud video nespustí */}
            <Box component="iframe" sx={styles.frame}
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
              title={video.title} loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
            <Box sx={styles.videoTitle}>{video.title}</Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
