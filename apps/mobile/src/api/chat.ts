import { apiClient, USE_MOCK_API } from "@/api/client";
import { mockPets } from "@/mocks/mockData";
import type { ChatConversationState, ChatMemory, Pet, RealtimeClientSession, RealtimeVoice, VoiceTurnResponse } from "@/types";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

type BackendConversationState = {
  pet: {
    id: string;
    name: string;
    species: string;
    breed?: string | null;
    age?: number | null;
    notes?: string | null;
    imageUrl?: string | null;
    voiceId?: string | null;
  };
  conversation: {
    id: string;
    title?: string | null;
    summary: string;
    lastMessageAt?: string | null;
    messages: ChatConversationState["messages"];
  };
  memories: ChatMemory[];
  config: {
    textModel: string;
    memoryModel: string;
    realtimeModel: string;
    defaultRealtimeVoice: RealtimeVoice;
  };
};

type BackendPostMessageResponse = {
  conversationId: string;
  userMessage: ChatConversationState["messages"][number];
  assistantMessage: ChatConversationState["messages"][number];
  summary: string;
  memories: ChatMemory[];
};

type BackendSyncVoiceTurnResponse = BackendPostMessageResponse;

export async function getConversationState(petId: string): Promise<BackendConversationState> {
  if (USE_MOCK_API) {
    await delay();
    const pet = mockPets.find((entry) => entry.id === petId) ?? mockPets[0];
    return {
      pet,
      conversation: {
        id: `conversation_${pet.id}`,
        title: pet.name,
        summary: "",
        lastMessageAt: null,
        messages: [],
      },
      memories: [],
      config: {
        textModel: "mock",
        memoryModel: "mock",
        realtimeModel: "mock",
        defaultRealtimeVoice: "marin",
      },
    };
  }

  const { data } = await apiClient.get<BackendConversationState>(`/pets/${petId}/chat`);
  return data;
}

export async function postChatMessage(
  petId: string,
  payload: { message: string; title?: string },
): Promise<BackendPostMessageResponse> {
  const { data } = await apiClient.post<BackendPostMessageResponse>(`/pets/${petId}/chat/messages`, payload);
  return data;
}

export async function createRealtimeSession(
  petId: string,
  payload?: { voice?: string },
): Promise<RealtimeClientSession> {
  const { data } = await apiClient.post<RealtimeClientSession>(
    `/pets/${petId}/chat/voice/client-secret`,
    payload ?? {},
  );
  return data;
}

export async function syncVoiceTurn(
  petId: string,
  payload: { userTranscript: string; assistantTranscript: string },
): Promise<BackendSyncVoiceTurnResponse> {
  const { data } = await apiClient.post<BackendSyncVoiceTurnResponse>(`/pets/${petId}/chat/voice/sync`, payload);
  return data;
}

export async function processVoiceTurn(
  petId: string,
  payload: { uri: string; name?: string; mimeType?: string; voice?: RealtimeVoice },
): Promise<VoiceTurnResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: payload.uri,
    name: payload.name ?? "voice-message.m4a",
    type: payload.mimeType ?? "audio/m4a",
  } as unknown as Blob);

  if (payload.voice) {
    formData.append("voice", payload.voice);
  }

  const { data } = await apiClient.post<VoiceTurnResponse>(`/pets/${petId}/chat/voice/turn`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000,
  });

  return data;
}
