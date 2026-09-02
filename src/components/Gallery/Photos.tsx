/**
 * Photos — sekce se sloupci obrázků. Používá ji „fotky" i „art"; liší se jen
 * daty a nadpisem, proto je to jedna komponenta se dvěma použitími.
 */
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import type { Photo } from "../../data/gallery";
import { asset } from "../../asset";
import Section from "../Section";
import * as styles from "./styles";

type Props = {
  id: string;
  title: string;
  intro?: string;
  photos: Photo[];
  texts: Translation;
  lang: Lang;
};

export default function Photos({ id, title, intro, photos, texts, lang }: Props) {
  // sekce je ohlášená v navigaci, takže se ukáže i bez obsahu — jinak by
  // odkaz v menu vedl na nic
  if (photos.length === 0) {
    return <Section id={id} title={title} intro={intro} wide>
      <Box sx={styles.soon}>{texts.sections.soon}</Box>
    </Section>;
  }

  return (
    <Section id={id} title={title} intro={intro} wide>
      <Box sx={styles.grid}>
        {photos.map((photo) => (
          <Box key={photo.src} component="img" src={asset(photo.src)} alt={photo.alt[lang]}
            loading="lazy" sx={styles.photo} />
        ))}
      </Box>
    </Section>
  );
}
