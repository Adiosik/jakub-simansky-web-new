import { csCZ } from "./csCZ";
import { enUS } from "./enUS";
import type { Translation } from "./types";

export type { Translation } from "./types";

export type Lang = "csCZ" | "enUS";

export const translations: Record<Lang, Translation> = { csCZ, enUS };
