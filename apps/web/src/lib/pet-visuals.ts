import type { Pet } from "../types";

const petImages = [
  "https://lh3.googleusercontent.com/aida/ADBb0uglhcWTNaTW1G654_rUvQyiJMpv34YiJP59gPSDws8D_swAfLrKR0OqYtapma8s0_7z0K_iR7_hIPrjhDaOs_fBk-S0t_hl8Gy2-0IgUguKzMe6QlmZyR3iEAhsK7p5XynrC4w4cFrWE01i8-Em_TgmjhhlAytC9GHvIHkjg-UsYZUceHKNVdSWd21NkL12U4zeRRNqh-UGO9lhWKXa8DlC35aMmNbRh4Qn2tIOxGbR9lEnivU9DcEaq77l",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5fNfq1fs0wNnuNYsZltSsybLe1c-ZnSBOtwRndlwVAl2AiH0AucEayBeH2IBtOJ_2DqrNM6lY_4t-k6kMugU4I7rIcwaRSGXX44oRJ1GXzoKfh4PNCkFDQ79GJi6xN_TU9zp31RN_81xjPltjfCnj8kkqkwaekNC3KJIJetIXIQWIUFtdAVXoeRfFD0AWkPbcPx9rP9MqutqV-T-6e8xL-62BUgf8a46-71hRZbm87j1_cgs0oKuQZsVDVwgjUbUxyuCw2ryfAaMV",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAIeA8jhePmZcyHzHWNLtWE6teNpcolk89HcKA8swREqVrDbeghcUnKr26Kwh8tmG-PsgBsOSNBt16FCZhEx8Zo2HnAIEhMV1dCp3uGfkeTvt5WzvgbyFDyoNprRjZzUzN5H2CP9zob9lzvs1_iJjJNweVRIbGX9ISNnAe0lHMSkkrtcYfqzQzpLaE-mrjtQLfkj1jtcWKVgmqT84tJdTtitJFWWtegQu4KOS4Wph8fStLxqOFD3S-r_4ejZvyyLd8obu7pGuKVAMHD",
];

function hash(input: string) {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0;
  }
  return value;
}

export function getPetAvatar(pet: Pick<Pet, "id" | "name" | "deviceId" | "voiceId" | "imageUrl">) {
  if (typeof pet.imageUrl === "string" && pet.imageUrl) {
    return pet.imageUrl;
  }
  const key = `${pet.id}:${pet.name}:${pet.deviceId ?? ""}:${pet.voiceId ?? ""}`;
  return petImages[hash(key) % petImages.length];
}
