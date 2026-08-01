/**
 * asset — složí cestu k souboru z public/ tak, aby fungovala i pod podcestou
 * (GitHub Pages běží na /jakub-simansky-web-new/). Vstup může mít i vedoucí
 * lomítko. Dev: BASE_URL = "/", prod: BASE_URL = "/jakub-simansky-web-new/".
 */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, "");
