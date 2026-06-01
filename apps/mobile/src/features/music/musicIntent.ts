export type MusicIntent =
  | { action: "play"; query: string | null }
  | { action: "pause" }
  | { action: "resume" }
  | { action: "stop" };

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function cleanQuery(query: string) {
  const cleaned = query
    .replace(/^(cho toi|giup toi|please|petai|hay|nhe|di)\s+/i, "")
    .replace(/\s+(nhe|di|please)$/i, "")
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

export function parseMusicIntent(text: string): MusicIntent | null {
  const normalized = normalize(text);

  if (
    /(tam dung nhac|dung nhac|pause music|pause song|pause playback)/.test(
      normalized,
    )
  ) {
    return { action: "pause" };
  }

  if (
    /(tiep tuc nhac|phat tiep nhac|resume music|continue music|resume playback)/.test(
      normalized,
    )
  ) {
    return { action: "resume" };
  }

  if (
    /(tat nhac|stop music|stop playback|dung phat nhac)/.test(normalized)
  ) {
    return { action: "stop" };
  }

  const playPatterns = [
    /(?:phat nhac|mo nhac|bat nhac)\s+(.*)$/i,
    /(?:phat bai|mo bai|bat bai)\s+(.*)$/i,
    /(?:play music|play song|put on)\s+(.*)$/i,
  ];

  for (const pattern of playPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      return { action: "play", query: cleanQuery(match[1] ?? "") };
    }
  }

  if (/(phat nhac|mo nhac|bat nhac|play music|play song)/.test(normalized)) {
    return { action: "play", query: null };
  }

  return null;
}
