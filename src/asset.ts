/**
 * asset — složí cestu k souboru z public/ přes BASE_URL, takže funguje i kdyby
 * web někdy běžel v podcestě. Vstup může mít i vedoucí lomítko.
 * Dnes je BASE_URL "/" (vlastní doména), dřív "/jakub-simansky-web-new/".
 */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, "");
