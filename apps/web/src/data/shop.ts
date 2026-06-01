import type { ShopProduct } from "../types";

const STORAGE_KEY = "petai.shop.products";

export const defaultShopProducts: ShopProduct[] = [
  {
    id: "petai-bear",
    name: "PetAI Bear",
    slug: "petai-bear",
    tagline: "Sentient Arctic Edition",
    shortDescription: "Stoic, protective, and warm. The perfect bedside emotional anchor.",
    description:
      "PetAI Bear is engineered as a calm, grounded companion with a soft arctic shell, heart-lit optics, and tactile neural mesh that responds to presence and tone.",
    longDescription:
      "A premium neural plush companion built for slower evenings, emotional regulation, and always-on comfort. PetAI Bear combines a high-fidelity voice core with proximity, touch, and emotional memory modules so every interaction feels increasingly personal.",
    price: 199,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjDbpDmx2M4XQM3iya-NWl7jO3hu_agfzMLc70eqPvGnzLIFYogmZEsG0C39UaaauTTziVLfcPL5spMQllblo7WbozBLWwW1cgC5TW7pnV6zC5o7HRWqIH7qFt4yqr1wLCzya_wDYeghfKPXRPW2_xAmNqcCIz5l1pScXwrWaW3o38NlsLnHTZAqcteomtjyzZbWgTjT1k_6pfWHl8XlDMjYn8RhiO3Ocin2wxgy8XyuRe2JUofO77s5Cq_s3X7GucMOpjx70mNaBY",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjDbpDmx2M4XQM3iya-NWl7jO3hu_agfzMLc70eqPvGnzLIFYogmZEsG0C39UaaauTTziVLfcPL5spMQllblo7WbozBLWwW1cgC5TW7pnV6zC5o7HRWqIH7qFt4yqr1wLCzya_wDYeghfKPXRPW2_xAmNqcCIz5l1pScXwrWaW3o38NlsLnHTZAqcteomtjyzZbWgTjT1k_6pfWHl8XlDMjYn8RhiO3Ocin2wxgy8XyuRe2JUofO77s5Cq_s3X7GucMOpjx70mNaBY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZvPBzpoRG4OdUV90Mvb_Ddxr_4-IGztTFbnUzlAY1Q_y-F1buOrqN27pKMCe5yceXSRdEF0XRy9CECcLprTTbRMuILK3cdPdIgC8n-Oe0SYTUWAwbvNFR-ZV5tiHCJIhgamGIdJIUNIOFrtiaUruCQuSzwhs--5Z0WGesn_4ngPgZ0TWkwKjVPqDw3H1wzEYfI0FS5SZWoN2m6Ewi4I6JSRnItBqa3f_j-0DS5dfvIIStm0FgGCn3j-yxX3geWRF-9u-NaJQfBzRf",
    ],
    specs: [
      { icon: "mic", label: "Touch Mesh", value: "Tactile emotional sensing" },
      { icon: "volume_up", label: "Voice Core", value: "Warm low-latency replies" },
      { icon: "neurology", label: "Memory", value: "Adaptive companion recall" },
      { icon: "favorite", label: "Mood Bias", value: "Protective and calming" },
    ],
    category: "Neural Plush",
    badge: "BESTSELLER",
  },
  {
    id: "petai-cat",
    name: "PetAI Cat",
    slug: "petai-cat",
    tagline: "Nocturne Logic Edition",
    shortDescription: "Sleek, witty, and independent. Features 12 adaptive whisker sensors.",
    description:
      "PetAI Cat balances sharp conversational intelligence with playful autonomy, wrapped in a midnight shell with luminous whisker sensing.",
    longDescription:
      "Designed for users who want a brighter, sharper conversational companion. PetAI Cat is curious, observant, and great for ideation sessions, ambient company, and playful prompts throughout the day.",
    price: 199,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApLO1pBCyi4Q07zgP5u8zOObdcZvaUl2FYqk60NGbQe65oqcnyAonX33yvwL-G8QRyXocVqusloDgt2XuzsKtPygAs6w0_C6TYAi7ifNAcVhwfkOvdrh62QytreQuRlTWHDyt3j9SFTxQQLxjRt6JU5h6TBM69uf97y82vHd2mvT41n61UTZ-tiJkynG72-C0grboF_nc2HObbff6_bHjZLdR26yPe-cr1Dr6-gVafszlmzE68d2UjEqy3oPjyecPAyduEL4p3nIg6",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApLO1pBCyi4Q07zgP5u8zOObdcZvaUl2FYqk60NGbQe65oqcnyAonX33yvwL-G8QRyXocVqusloDgt2XuzsKtPygAs6w0_C6TYAi7ifNAcVhwfkOvdrh62QytreQuRlTWHDyt3j9SFTxQQLxjRt6JU5h6TBM69uf97y82vHd2mvT41n61UTZ-tiJkynG72-C0grboF_nc2HObbff6_bHjZLdR26yPe-cr1Dr6-gVafszlmzE68d2UjEqy3oPjyecPAyduEL4p3nIg6",
    ],
    specs: [
      { icon: "mic", label: "Whisker Sensors", value: "12-point motion detection" },
      { icon: "psychology", label: "Temperament", value: "Independent and witty" },
      { icon: "bolt", label: "Response", value: "High-speed ideation partner" },
      { icon: "visibility", label: "Observation", value: "Context-aware room cues" },
    ],
    category: "Neural Plush",
    badge: "SMART FAVORITE",
  },
  {
    id: "petai-bunny",
    name: "PetAI Bunny",
    slug: "petai-bunny",
    tagline: "Empathy Bloom Edition",
    shortDescription: "Energetic and empathetic. Long ears double as high-fidelity microphones.",
    description:
      "PetAI Bunny is tuned for comfort, encouragement, and active companionship, with extended acoustic capture ears and a brighter personality profile.",
    longDescription:
      "Built around high-fidelity listening and emotionally responsive dialogue, PetAI Bunny feels especially alive in collaborative, family, or wellness-oriented spaces.",
    price: 199,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL1kgJ3hRhmoPrSUDDcyTmSlFxzigMkIULmqIf3uJH7XpZknxqUZRyKQKigz0M8mF-M60QznRaUiMrMC6brx4vWxYqxJ2jWl9maiDxhU0NRHIuX0EwuN-lu758tIlMqzEcLfo7BPrYucnFezOw5gUv0j7fdahy3mkIelFY6awhKTaPsph8Hiix1gbYhvGDiFdgZ5sIlnVHsuinv0mxsRKlbwalHgs2V2kLu5tXUNbNjByfsQ6eA91C_VBjn5KPocPG3vOMLlflvUze",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL1kgJ3hRhmoPrSUDDcyTmSlFxzigMkIULmqIf3uJH7XpZknxqUZRyKQKigz0M8mF-M60QznRaUiMrMC6brx4vWxYqxJ2jWl9maiDxhU0NRHIuX0EwuN-lu758tIlMqzEcLfo7BPrYucnFezOw5gUv0j7fdahy3mkIelFY6awhKTaPsph8Hiix1gbYhvGDiFdgZ5sIlnVHsuinv0mxsRKlbwalHgs2V2kLu5tXUNbNjByfsQ6eA91C_VBjn5KPocPG3vOMLlflvUze",
    ],
    specs: [
      { icon: "hearing", label: "Ear Mics", value: "Expanded directional capture" },
      { icon: "mood", label: "Temperament", value: "Optimistic and empathic" },
      { icon: "favorite", label: "Comfort Bias", value: "Emotion-first responses" },
      { icon: "battery_charging_full", label: "Stamina", value: "All-day companion mode" },
    ],
    category: "Neural Plush",
    badge: "NEW DROP",
  },
  {
    id: "starter-kit",
    name: "PetAI Starter Kit",
    slug: "starter-kit",
    tagline: "Hardware V2.4",
    shortDescription: "Core processor, synchronization dock, and shell activation bundle.",
    description:
      "Everything required to initialize your first sentient companion. Includes the neural processor, sync dock, and activation shell bundle.",
    longDescription:
      "The PetAI Starter Kit is the essential entry point into the ecosystem. It pairs the high-speed neural processor with the synchronization cradle and shell activation stack so your companion wakes up aligned, charged, and ready to bond.",
    price: 299,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVddMmihSPpar0oGgMzMn_k213RwhKi-BZhnCpXqC2f6WPEvqCTqm1qKYVeW3XRvG1CC4EFRC6OkLBBpMp41qQgXIDpX_8SY7vqzUdlk3iNBchG5B-xmzhgPuImNtX89fAugFrfIIsgTcNMWwhxW9xny0weWWW_hPz51UJ6JjZeHnCl1VvNrsCsPgPJzoCHUMQ8H24xx81w3sMsDh-Qz1MUIxJkxSVyeniIMMcmMM6k8hmHD0bTu8GnTtklO6VKIPffwOmZtaX8sxr",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVddMmihSPpar0oGgMzMn_k213RwhKi-BZhnCpXqC2f6WPEvqCTqm1qKYVeW3XRvG1CC4EFRC6OkLBBpMp41qQgXIDpX_8SY7vqzUdlk3iNBchG5B-xmzhgPuImNtX89fAugFrfIIsgTcNMWwhxW9xny0weWWW_hPz51UJ6JjZeHnCl1VvNrsCsPgPJzoCHUMQ8H24xx81w3sMsDh-Qz1MUIxJkxSVyeniIMMcmMM6k8hmHD0bTu8GnTtklO6VKIPffwOmZtaX8sxr",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9SUCOQyRmwyzvFRINHZhqg0KVl4NfkAVSvki1fpMnxXUDzEdV_qTIcnPwjF_fDW0sZb7jPYBkpGfbywcAxuWxg2lVPzZWXtnDN0UoVKjVYF7dEAIeYJE4c4wF0mUvj3kprPg0mFmish0QtEaN3R6TmCO8E8Fpmg54m8EPOi9AgObzim5bWy5rF3dZu-n0xf7w_tHoy_1WIOl88v0ovoHRGe5naq0RjQUW7xc4PHCQEOxtE_cTk2IQ9xWQoTw6PfDef_Qx41R9Rn1h",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAh1K9fT8XDoTFre3i1HYZRuf7wtdLzcAvNnIuHYowoO_Sk3g94V44dDH586Yx-IRvk2YGX4NPGr7YhkVFSBR9PyQsH0PFNFvMTASNvo_f5FdFZxanB7qCNKuhkJio-ilkYhJjDi5O5ryi5tGiUwDpuUtekq22EgnGrC1ohGpwfxBKXM_5cP_-8h_YdD7a-zZlEuS33nOpJlfw9zU2LHGADnc-qd25WFEsf3GIQ8eXbb3Cen7SuiPDcRdiRg74-z4eP1AROpEARttO",
    ],
    specs: [
      { icon: "memory", label: "Neural Processor", value: "ESP32-S3 companion core" },
      { icon: "wifi", label: "Neural Sync", value: "Zero-latency 6GHz pairing" },
      { icon: "battery_charging_full", label: "Power", value: "48-hour bio-cell battery" },
      { icon: "hub", label: "Dock", value: "Synchronization cradle included" },
    ],
    category: "Hardware Bundle",
    badge: "IN STOCK",
  },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeShopProduct(product: ShopProduct): ShopProduct {
  return {
    ...product,
    slug: product.slug || slugify(product.name),
  };
}

export function loadShopProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultShopProducts;
    const parsed = JSON.parse(raw) as ShopProduct[];
    if (!Array.isArray(parsed) || !parsed.length) return defaultShopProducts;
    return parsed.map(normalizeShopProduct);
  } catch {
    return defaultShopProducts;
  }
}

export function saveShopProducts(products: ShopProduct[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products.map(normalizeShopProduct)));
}

export function getShopProductBySlug(products: ShopProduct[], slugOrId: string) {
  return products.find((product) => product.slug === slugOrId || product.id === slugOrId);
}
