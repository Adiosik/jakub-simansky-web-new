/**
 * Gallery — galerie jako celek: fotky, video a art pod sebou. V hlavičce jim
 * odpovídá jedno rozbalovací menu. Každá část se sama schová, když pro ni
 * nejsou data, takže tenhle obal se o prázdné sekce nemusí starat.
 * Obsah je v src/data/gallery.ts.
 */
import type { Translation, Lang } from "../../language";
import { FOTKY, ART } from "../../data/gallery";
import Photos from "./Photos";
import Videos from "./Videos";

type Props = { texts: Translation; lang: Lang };

export default function Gallery({ texts, lang }: Props) {
  return (
    <>
      <Photos id="fotky" title={texts.sections.photos.title}
        photos={FOTKY} texts={texts} lang={lang} />
      <Videos texts={texts} />
      <Photos id="art" title={texts.sections.art.title} intro={texts.sections.art.intro}
        photos={ART} texts={texts} lang={lang} />
    </>
  );
}
