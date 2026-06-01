import type { ClaimDeviceResult, Pet, PetChatReply, PetChatState, PetVoiceClientSecret, Stat, UserProfile, Voice } from "../../types";
import { apiClient } from "./client";

export async function fetchUserDashboard(): Promise<{
  stats: Stat[];
  activity: Array<{ title: string; description: string; timestamp: string; icon: string }>;
}> {
  const pets = await fetchPets();
  const claimedDevices = pets.filter((pet) => pet.device).length;
  const activeVoice = pets.find((pet) => pet.voice)?.voice?.name ?? "Unassigned";
  const latestPet = pets[0];

  return {
    stats: [
      { label: "TOTAL_PETS", value: String(pets.length).padStart(2, "0"), icon: "pets", accent: "primary" },
      {
        label: "ACTIVE_DEVICES",
        value: String(claimedDevices).padStart(2, "0"),
        helper: `${claimedDevices} Linked`,
        icon: "router",
        accent: "primary",
      },
      {
        label: "LATEST_UPDATE",
        value: latestPet?.updatedAt ? new Date(latestPet.updatedAt).toLocaleDateString() : "No data",
        icon: "forum",
        accent: "secondary",
      },
      {
        label: "VOICE_PROFILE",
        value: activeVoice,
        helper: latestPet?.device?.status ?? "READY",
        icon: "wifi",
        accent: "neutral",
      },
    ],
    activity: pets.slice(0, 3).map((pet) => ({
      title: `${pet.name} profile synced`,
      description: `${pet.species}${pet.breed ? ` · ${pet.breed}` : ""}${pet.voice?.name ? ` · Voice ${pet.voice.name}` : ""}`,
      timestamp: pet.updatedAt ? new Date(pet.updatedAt).toLocaleString() : "Just now",
      icon: pet.device ? "sensors" : "pets",
    })),
  };
}

export async function fetchPets() {
  const { data } = await apiClient.get<Pet[]>("/pets");
  return data;
}

export async function fetchPet(id: string) {
  const { data } = await apiClient.get<Pet>(`/pets/${id}`);
  return data;
}

export async function fetchVoices() {
  const { data } = await apiClient.get<Voice[]>("/voices");
  return data;
}

export async function fetchVoicePreview(voiceId: string) {
  const { data } = await apiClient.get<Blob>(`/voices/${voiceId}/preview`, {
    responseType: "blob",
  });
  return data;
}

export async function fetchPetChat(id: string) {
  const { data } = await apiClient.get<PetChatState>(`/pets/${id}/chat`);
  return data;
}

export async function sendPetChatMessage(id: string, payload: { message: string; title?: string }) {
  const { data } = await apiClient.post<PetChatReply>(`/pets/${id}/chat/messages`, payload);
  return data;
}

export async function createPetVoiceClientSecret(id: string, payload?: { voice?: string }) {
  const { data } = await apiClient.post<PetVoiceClientSecret>(`/pets/${id}/chat/voice/client-secret`, payload ?? {});
  return data;
}

export async function syncPetVoiceTurn(id: string, payload: { userTranscript: string; assistantTranscript: string }) {
  const { data } = await apiClient.post<PetChatReply>(`/pets/${id}/chat/voice/sync`, payload);
  return data;
}

export async function claimDevice(payload: { serialNumber: string; productCode: string }) {
  const { data } = await apiClient.post<ClaimDeviceResult>("/devices/claim", payload);
  return data;
}

export async function updatePet(id: string, payload: Partial<Pick<Pet, "name" | "species" | "breed" | "notes" | "voiceId">>) {
  const { data } = await apiClient.patch<Pet>(`/pets/${id}`, payload);
  return data;
}

export async function uploadPetImage(id: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<Pet>(`/pets/${id}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<UserProfile>("/me");
  return data;
}

export async function updateCurrentUserProfile(payload: { name: string }) {
  const { data } = await apiClient.patch<UserProfile>("/me", payload);
  return data;
}

export async function changeCurrentUserPassword(payload: { currentPassword: string; newPassword: string }) {
  const { data } = await apiClient.patch<{ success: boolean }>("/me/password", payload);
  return data;
}

export async function uploadCurrentUserImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<UserProfile>("/me/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export function getUserImageUrl(userId: string, version?: string | null) {
  const baseUrl = String(apiClient.defaults.baseURL ?? "").replace(/\/$/, "");
  const query = version ? `?v=${encodeURIComponent(version)}` : "";
  return `${baseUrl}/users/${userId}/image${query}`;
}
