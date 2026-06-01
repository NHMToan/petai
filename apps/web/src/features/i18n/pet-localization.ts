import type { AppLocale } from "./i18n-context";

const speciesMap: Record<string, Record<AppLocale, string>> = {
  companion: {
    en: "Companion",
    vn: "Bạn đồng hành",
  },
  bunny: {
    en: "Bunny",
    vn: "Thỏ",
  },
  bear: {
    en: "Bear",
    vn: "Gấu",
  },
  cat: {
    en: "Cat",
    vn: "Mèo",
  },
  dog: {
    en: "Dog",
    vn: "Chó",
  },
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

export function localizePetSpecies(value: string | null | undefined, locale: AppLocale) {
  if (!value) return "";
  return speciesMap[normalizeKey(value)]?.[locale] ?? value;
}
