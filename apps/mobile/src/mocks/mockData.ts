import type { AuthSession, Device, Pet, ShopItem, Voice } from "@/types";

export const mockSession: AuthSession = {
  token: "mock-jwt-token",
  user: {
    id: "user_1",
    name: "Toan Nguyen",
    email: "toan@petai.io",
    role: "USER",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3IdodoqJPjzNfsGL4CqRjV63SCph8V9eeDwf2gkWkMtIfo81LVherc2MJggagt1HjE4M-TdIDTcHBqnzQql8qp82mjI3hSqjr9qWfyKTcS_g52T1rRbeBx3yY8Jscvf5VWM1MwSaTRli8X1KkTwVWwKrqtaP5Sm9B12dpCotrATd3kx2Xtv3Aq8EoOpf-szDi7gE3vB__e8AO6lYo1MQIK9aYC8ADPEg7m0p2ersPaqmQ6bl1wgt-aapEzkwsYAJ_IwtAle-muvDj",
  },
};

export const mockPets: Pet[] = [
  {
    id: "pet_1",
    name: "Luna",
    species: "Companion",
    breed: "Shiba Neural Plush",
    notes: "Curious, affectionate, and tuned for calm evening chats.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida/ADBb0uhMtoP9EuxzuWE5xT-TEsfxrmjUNO6ahwrGexlNjs-R0iCEMKHg6ksNzlmFV9xYDOt43tcgY63SE7TC4bGhMHHqA9VZSsEaxTkYw2kvMQG5Y2mw34ZoO_wOumTLaPciDzYhpr09broFwCV-dbUq9vtJ7DbALSV9d5w_Xsxp_WPSkRb9lGJTTH0eQufKXrCJCHNMRByLLrwGpgpjo1npK6JcejjNxhR-uBIKyuC3EcX0r7zCRPlwqJT6D7U2",
    voiceId: "voice_nova",
    mood: "Happy",
    battery: 92,
    sync: 98,
    wakeWord: "Hey Luna",
  },
  {
    id: "pet_2",
    name: "Mochi",
    species: "Companion",
    breed: "Cloud Rabbit",
    notes: "Playful and energetic in the morning, softer at night.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGfFMqGvUk6xYU4tLukKuR60tHeKp_ruv46ee54KYyY8dmiG0pFts39JX4xFl1YQTDpy4tpFurNfacIioYtIRRxXMc2VFJoiaZmTpvc224Z-pECHcajpv6y_EPJyomcYHsQ_Sr85oFE49Ilm9m9i7sjXLwuapbjTLQdLI0fjIc7cRrtsjO8wRi3OQwFKZGzPQSouLUlPuJmLg9SFwEMPLU5qcsR5PrTwfjSViVppJD0KqHAWsawuSZ4ASAGHWt6Gcs6bWOK1h2p-r6",
    voiceId: "voice_shimmer",
    mood: "Playful",
    battery: 81,
    sync: 96,
    wakeWord: "Hey Mochi",
  },
];

export const mockVoices: Voice[] = [
  {
    id: "voice_shimmer",
    name: "Shimmer",
    description: "Soft and luminous for comforting moments.",
    tone: "Soft",
    locale: "en-US",
    version: "v2.1",
    previewLine: "I am here, glowing softly beside you.",
    isActive: true,
  },
  {
    id: "voice_nova",
    name: "Nova",
    description: "Confident, warm, and expressive for daily check-ins.",
    tone: "Balanced",
    locale: "vi-VN",
    version: "v3.4",
    previewLine: "Xin chao, minh da san sang lang nghe ban roi day.",
    isActive: true,
  },
  {
    id: "voice_orbit",
    name: "Orbit",
    description: "Playful with extra bounce for active pets.",
    tone: "Playful",
    locale: "en-US",
    version: "v1.8",
    previewLine: "Ready for another tiny adventure together?",
    isActive: true,
  },
];

export const mockDevices: Device[] = [
  {
    id: "device_1",
    name: "PetAI Starter Core",
    serialNumber: "DV-4021",
    productCode: "CORE-ALPHA",
    status: "CLAIMED",
  },
  {
    id: "device_2",
    name: "PetAI Mini Companion",
    serialNumber: "DV-5912",
    productCode: "MINI-GLOW",
    status: "AVAILABLE",
  },
];

export const mockShopItems: ShopItem[] = [
  {
    id: "shop_1",
    slug: "starter-core",
    name: "Starter Core",
    tagline: "Essential neural bridge",
    shortDescription: "A premium plush shell paired with the PetAI neural core.",
    description: "A premium plush shell paired with the PetAI neural core.",
    longDescription:
      "The Starter Core pairs PetAI's primary neural hardware with a soft plush shell so you can begin voice, memory, and emotional companion experiences right away.",
    price: 249,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDOSy2ZCUa9m6vJ5SCv1s2_YbwXiYNkt6e3ptwKxrHmNIZgvecggzM4RNg5k1gvWCJEP8mE1Rf5UrxX8ISTTYlzzUC4-79CBT2jbW4pN9RRtQg16Ok9dJFanDDa60L9P3SUQYqeeyJOt9VJqbR8nSLUSqK2Yr8J-AAC3o0LvkgricRA3vsZL62otaAMXyR5OFfYccfuVRNEA4oXWuUntPwwhBxxTtiP3MJRFfF4HZEmfHcs60bV4NlAT8VtVOvmBLq-5sutvfZq1unM",
    gallery: [],
    specs: [
      { icon: "memory", label: "Neural Core", value: "Included" },
      { icon: "mic", label: "Voice", value: "Realtime ready" },
      { icon: "favorite", label: "Companion Shell", value: "Soft-touch plush" },
    ],
    category: "Starter",
    badge: "Best Seller",
  },
  {
    id: "shop_2",
    slug: "bunny-companion",
    name: "Bunny Companion",
    tagline: "Long-ear listener",
    shortDescription: "Extra sensory whiskers and a brighter conversational tone.",
    description: "Extra sensory whiskers and a brighter conversational tone.",
    longDescription:
      "The Bunny Companion edition is tuned for expressive interactions, lighter moods, and a more playful physical silhouette.",
    price: 289,
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrUj8EHYRP4PxR540Y2L7O73w9Ti5DGyBlXdbm7NQzKzZw_oSueE5yyIkxFJKaYhFe_qNmoKweS3wlyWhLJLMYiTb-w_wLIXSElFTcXdGbvAAdY8WXOHS4ylkP7GmvP3glH0KmlAx_l8FfUzpLRtnwJxYPX9G7Tevmb5s14D9WO8aNjnt5QBfvwBovQ_Rqfz2QUBW684Ov7mS6qWUKMcW-zwEH3dd0AKws-GIbZ-1gxuzvqL8sh2Kf3o6z6T5iAQfu79yI_F8PpR44",
    gallery: [],
    specs: [
      { icon: "hearing", label: "Sensory Profile", value: "Enhanced response" },
      { icon: "graphic_eq", label: "Conversation Tone", value: "Bright and playful" },
      { icon: "toys", label: "Shell", value: "Long-ear companion body" },
    ],
    category: "Companion",
    badge: "New",
  },
];
