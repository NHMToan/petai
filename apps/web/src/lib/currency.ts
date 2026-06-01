const USD_TO_VND = 26000;

export function usdToVnd(usd: number) {
  return Math.round(usd * USD_TO_VND);
}

export function vndToUsd(vnd: number) {
  return Number((vnd / USD_TO_VND).toFixed(2));
}

export function formatVnd(vnd: number, locale: "vi-VN" | "en-US" = "vi-VN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(vnd);
}

export function formatVndFromUsd(usd: number, locale: "vi-VN" | "en-US" = "vi-VN") {
  return formatVnd(usdToVnd(usd), locale);
}
