import type { AppLocale } from "@/store/localeStore";

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

const moodMap: Record<string, Record<AppLocale, string>> = {
  calm: {
    en: "Calm",
    vn: "Bình tĩnh",
  },
  curious: {
    en: "Curious",
    vn: "Tò mò",
  },
  playful: {
    en: "Playful",
    vn: "Tinh nghịch",
  },
  attentive: {
    en: "Attentive",
    vn: "Chú tâm",
  },
  happy: {
    en: "Happy",
    vn: "Vui vẻ",
  },
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

export function localizePetSpecies(value: string | null | undefined, locale: AppLocale) {
  if (!value) return "";
  return speciesMap[normalizeKey(value)]?.[locale] ?? value;
}

export function localizePetMood(value: string | null | undefined, locale: AppLocale) {
  if (!value) return "";
  return moodMap[normalizeKey(value)]?.[locale] ?? value;
}
