export type Translation = {
  head: {
    tagline: string;
    location: string;
  };
  /** Navigace v hlavičce — `sounds` má rozbalovací podmenu (records/listen/bands). */
  nav: {
    about: string;
    sounds: string;
    records: string;
    listen: string;
    bands: string;
    concerts: string;
    contact: string;
    menu: string;
    closeMenu: string;
  };
  hero: {
    /** Podtitul pod jménem — jednořádkové „kdo jsem" */
    subtitle: string;
    /** Drobný credit pod portrétem */
    photoCredit: string;
    /** Alt text portrétu */
    photoAlt: string;
  };
  eyebrow: string;
  lede: string;
  /** Sekce „aktuálně" — vyzdvižená novinka hned pod heroem */
  now: {
    title: string;
    lead: string;
    cta: string;
  };
  player: {
    title: string;
    intro: string;
    prevAlbum: string;
    nextAlbum: string;
  };
  print: {
    title: string;
    caption: string;
    alt: string;
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
      intro: string;
      play: string;
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
    };
    bands: {
      title: string;
      intro: string;
      /** Popisek odkazu na kapelu */
      listen: string;
    };
  };
};
