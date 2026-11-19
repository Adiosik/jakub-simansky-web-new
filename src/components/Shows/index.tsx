/**
 * Shows — sekce koncertů: seznam termínů v řádcích oddělených vlásovou linkou.
 *
 * Nahoře nadcházející (nejvýš MAX_KONCERTU), pod nimi za tlačítkem odehrané,
 * od nejnovějšího a po rocích. Každý rok se rozbaluje zvlášť; otevřený je
 * jen ten nejnovější — ten zajímá nejvíc, starší jsou o klik dál.
 */
import { useId, useState } from "react";
import Box from "@mui/material/Box";
import type { Translation, Lang } from "../../language";
import { nadchazejici, pastGigs, type Gig } from "../../data/concerts";
import { lineupName } from "../../data/bands";
import Section from "../Section";
import ShowMore from "../core/ShowMore";
import * as styles from "./styles";

type Props = { texts: Translation; lang: Lang };

/** Odehrané koncerty po rocích, v pořadí, v jakém přišly (od nejnovějšího). */
function groupByYear(gigs: Gig[]) {
  const years = new Map<string, Gig[]>();
  for (const gig of gigs) {
    const year = gig.date.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), gig]);
  }
  return [...years];
}

export default function Shows({ texts, lang }: Props) {
  const t = texts.sections.concerts;
  const [showPast, setShowPast] = useState(false);
  const pastId = useId();
  // seznamy se počítají při vykreslení, aby se řídily dnem návštěvníka
  const upcoming = nadchazejici();
  const past = pastGigs();
  const pastByYear = groupByYear(past);
  // null = výchozí stav, tj. otevřený jen nejnovější rok
  const [openYears, setOpenYears] = useState<Set<string> | null>(null);
  const isYearOpen = (year: string) => (openYears ?? new Set(pastByYear.slice(0, 1).map(([y]) => y))).has(year);
  const toggleYear = (year: string) =>
    setOpenYears((current) => {
      const next = new Set(current ?? pastByYear.slice(0, 1).map(([y]) => y));
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  const locale = lang === "enUS" ? "en-US" : "cs-CZ";
  const fmtDate = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  const row = (gig: Gig, isPast = false) => (
    <Box component="li" key={gig.date + gig.city + gig.venue} sx={isPast ? styles.pastGig : styles.gig}>
      <Box component="span" sx={styles.date}>{fmtDate(gig.date)}</Box>
      <Box component="span" sx={styles.place}>
        {gig.city} <Box component="span">— {gig.venue}</Box>
      </Box>
      {/* štítek má každý termín — buď sestavu, nebo „sólo“. Bez toho by
          u smíšeného programu nešlo poznat, o který případ jde. */}
      <Box sx={styles.tags}>
        <Box component="span" sx={styles.tag}>{lineupName(gig.band) ?? t.solo}</Box>
      </Box>
    </Box>
  );

  return (
    <Section id="koncerty" title={t.title} wide tight>
      {upcoming.length === 0 ? (
        <Box component="p" sx={styles.empty}>{t.empty}</Box>
      ) : (
        <Box component="ul" sx={styles.list}>{upcoming.map((gig) => row(gig))}</Box>
      )}

      {past.length > 0 && (
        <>
          <ShowMore rozbaleno={showPast} onToggle={() => setShowPast((v) => !v)} pocet={past.length}
            vice={t.showPast} mene={t.hidePast} controls={pastId} />
          <Box id={pastId} hidden={!showPast} sx={styles.past}>
            {pastByYear.map(([year, gigs], i) => {
              const open = isYearOpen(year);
              const afterOpenYear = i > 0 && isYearOpen(pastByYear[i - 1][0]);
              const listId = `${pastId}-${year}`;
              return (
                <Box component="section" key={year} sx={styles.yearSection(afterOpenYear)}>
                  <Box component="h3" sx={styles.yearHeading}>
                    <Box component="button" type="button" aria-expanded={open} aria-controls={listId}
                      onClick={() => toggleYear(year)} sx={styles.yearButton}>
                      <span>{year} <Box component="span" sx={styles.yearCount}>({gigs.length})</Box></span>
                      <Box component="svg" sx={styles.chevron(open)} viewBox="0 0 12 12" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        aria-hidden="true">
                        <path d="M2.5 4.5L6 8l3.5-3.5" />
                      </Box>
                    </Box>
                  </Box>
                  <Box component="ul" id={listId} hidden={!open} sx={styles.yearList}>
                    {gigs.map((gig) => row(gig, true))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Section>
  );
}
