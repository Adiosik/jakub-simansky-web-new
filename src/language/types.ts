export type Translation = {
  /** Navigace v hlavičce — `sounds` má rozbalovací podmenu (records/listen/bands). */
  nav: {
    about: string;
    sounds: string;
    records: string;
    bands: string;
    lessons: string;
    concerts: string;
    contact: string;
    menu: string;
    closeMenu: string;
    /** Popisky přepínače motivu (co udělá kliknutí) */
    darkMode: string;
    lightMode: string;
  };
  hero: {
    /** Alt text portrétu */
    photoAlt: string;
  };
  /** Sekce „aktuálně" — vyzdvižená novinka hned pod heroem */
  now: {
    title: string;
    /** První věta, vysázená větším písmem */
    lead: string;
    /** Zbytek oznámení */
    body: string;
    /** Datum vydání a nosiče */
    meta: string;
  };
  footer: {
    copy: string;
    copied: string;
    copyAria: string;
    note: string;
    toTop: string;
  };
  sections: {
    concerts: {
      title: string;
      intro: string;
      soldOut: string;
      empty: string;
    };
    records: {
      title: string;
    };
    contact: {
      title: string;
      intro: string;
      bookingLabel: string;
      followLabel: string;
    };
    about: {
      title: string;
      intro: string;
      body: string;
    };
    references: {
      title: string;
      intro: string;
      /** Popisek odkazu na zdroj citace */
      source: string;
      /** Druhy ohlasů — značka u položky seznamu */
      review: string;
      interview: string;
      media: string;
    };
    lessons: {
      title: string;
      intro: string;
      body: string;
      /** Alt text fotky nad textem */
      photoAlt: string;
    };
    bands: {
      title: string;
      intro: string;
    };
  };
};
