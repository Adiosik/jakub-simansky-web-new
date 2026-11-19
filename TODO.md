# TODO

Odložené a otevřené věci. Podrobnosti k SEO a rychlosti jsou v `docs/seo.md`.

## Rychlost webu

- [ ] **Předvykreslení stránky při buildu** (statické HTML místo prázdného `<div id="root">`).
      Odloženo 2026-11-19, rychlost teď stačí (PageSpeed mobil 96, LCP 2,3 s). Přínos je hlavně pro
      vyhledávače a AI boty bez JavaScriptu, viz „Statický textový obsah pro boty“ v `docs/seo.md`.
      Je to velký zásah s rizikem krátkého probliknutí obsahu, takže domluvit se SEO a UI/UX.
- [ ] Větší předstih přehrávačů Bandcampu (800 → ~1500 px). Na Slow 4G při pomalém scrollu čeká druhé album
      ve výřezu ~1,7 s. Daniel 2026-11-19: zatím vynechat.

## Chyby

- [ ] Odkaz přímo na `/#desky` (a další kotvy) stránku po načtení neposune, zůstane nahoře. Je to tak už
      dlouho (nález Testy 2026-11-19). Nejspíš proto, že React vykreslí sekce až po pokusu prohlížeče
      skočit na kotvu. Patří UI/UX.
