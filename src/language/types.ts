export type Translation = {
  /** Navigace v hlavičce — `sounds` má rozbalovací podmenu (records/listen/bands). */
  nav: {
    about: string;
    sounds: string;
    records: string;
    bands: string;
    lessons: string;
    gallery: string;
    photos: string;
    video: string;
    art: string;
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
    toTop: string;
  };
  sections: {
    concerts: {
      title: string;
      soldOut: string;
      empty: string;
    };
    records: {
      title: string;
    };
    contact: {
      title: string;
      bookingLabel: string;
    };
    about: {
      title: string;
      body: string;
    };
    references: {
      title: string;
      /** Popisek odkazu na zdroj citace */
      source: string;
      /** Druhy ohlasů — značka u položky seznamu */
      review: string;
      interview: string;
      media: string;
    };
    lessons: {
      title: string;
      body: string;
      /** Alt text fotky nad textem */
      photoAlt: string;
    };
    /** Text sekce, která je ohlášená, ale ještě nemá obsah */
    soon: string;
    photos: {
      title: string;
    };
    video: {
      title: string;
      intro: string;
    };
    art: {
      title: string;
      intro: string;
    };
    bands: {
      title: string;
    };
  };
};
