import { API_BASE_URL, apiClient, USE_MOCK_API } from "@/api/client";
import { mockDevices, mockPets, mockVoices } from "@/mocks/mockData";
import type { ClaimDevicePayload, Device, Pet, Voice } from "@/types";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

type BackendPet = {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  notes?: string | null;
  imageUrl?: string | null;
  voiceId?: string | null;
  voice?: {
    id: string;
  } | null;
};

type BackendVoice = {
  id: string;
  name: string;
  description?: string | null;
  tone: string;
  locale: string;
  version: string;
  isActive: boolean;
};

function deriveSignal(id: string, offset: number, min: number, max: number) {
  const seed = Array.from(id).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1 + offset), 0);
  return min + (seed % (max - min + 1));
}

function normalizePet(pet: BackendPet): Pet {
  const moods = ["Calm", "Curious", "Playful", "Attentive"] as const;
  const mood = moods[deriveSignal(pet.id, 1, 0, moods.length - 1)];

  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? null,
    age: pet.age ?? null,
    notes: pet.notes ?? "",
    imageUrl: pet.imageUrl ?? null,
    voiceId: pet.voiceId ?? pet.voice?.id ?? null,
    mood,
    battery: deriveSignal(pet.id, 3, 72, 98),
    sync: deriveSignal(pet.id, 5, 81, 99),
    wakeWord: `Hey ${pet.name}`,
  };
}

function normalizeVoice(voice: BackendVoice): Voice {
  const locale = voice.locale || "en-US";
  const previewLine = locale.toLowerCase().startsWith("vi")
    ? `Xin chao, minh la ${voice.name}.`
    : `Hello, I'm ${voice.name}.`;

  return {
    id: voice.id,
    name: voice.name,
    description: voice.description ?? "PetAI companion voice.",
    tone: voice.tone,
    locale,
    version: voice.version,
    previewLine,
    isActive: voice.isActive,
  };
}

export async function getMyPets(): Promise<Pet[]> {
  if (USE_MOCK_API) {
    await delay();
    return mockPets;
  }

  const { data } = await apiClient.get<BackendPet[]>("/pets");
  return data.map(normalizePet);
}

export async function claimDevice(payload: ClaimDevicePayload): Promise<{ device: Device; pet: Pet }> {
  if (USE_MOCK_API) {
    await delay();
    const device = mockDevices.find(
      (entry) =>
        entry.serialNumber === payload.serialNumber &&
        entry.productCode === payload.productCode,
    ) ?? {
      id: "device_new",
      name: "PetAI Claimed Device",
      serialNumber: payload.serialNumber,
      productCode: payload.productCode,
      status: "CLAIMED" as const,
    };

    const pet = {
      ...mockPets[0],
      id: "pet_claimed",
      name: "Nova",
    };

    return { device, pet };
  }

  const { data } = await apiClient.post<{ device: Device; pet: BackendPet }>(
    "/devices/claim",
    payload,
  );
  return {
    device: data.device,
    pet: normalizePet(data.pet),
  };
}

export async function updatePet(id: string, payload: Partial<Pet>): Promise<Pet> {
  if (USE_MOCK_API) {
    await delay();
    return {
      ...(mockPets.find((pet) => pet.id === id) ?? mockPets[0]),
      ...payload,
    };
  }

  const { data } = await apiClient.patch<BackendPet>(`/pets/${id}`, {
    name: payload.name,
    species: payload.species,
    breed: payload.breed,
    age: payload.age,
    notes: payload.notes,
    voiceId: payload.voiceId,
  });
  return normalizePet(data);
}

export async function getVoices(): Promise<Voice[]> {
  if (USE_MOCK_API) {
    await delay();
    return mockVoices;
  }

  const { data } = await apiClient.get<BackendVoice[]>("/voices");
  return data.map(normalizeVoice);
}

export function getVoicePreviewUrl(voiceId: string) {
  return `${API_BASE_URL}/voices/${voiceId}/preview`;
}
