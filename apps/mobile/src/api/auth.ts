import { apiClient, USE_MOCK_API } from "@/api/client";
import { mockSession } from "@/mocks/mockData";
import type { AuthSession, Credentials, RegisterPayload } from "@/types";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

type BackendAuthSession = {
  accessToken: string;
  user: AuthSession["user"];
};

export async function login(payload: Credentials): Promise<AuthSession> {
  if (USE_MOCK_API) {
    await delay();
    return {
      ...mockSession,
      user: {
        ...mockSession.user,
        email: payload.email,
      },
    };
  }

  const { data } = await apiClient.post<BackendAuthSession>("/auth/login", payload);
  return {
    token: data.accessToken,
    user: data.user,
  };
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  if (USE_MOCK_API) {
    await delay();
    return {
      ...mockSession,
      user: {
        ...mockSession.user,
        name: payload.name,
        email: payload.email,
      },
    };
  }

  const { data } = await apiClient.post<BackendAuthSession>("/auth/register", payload);
  return {
    token: data.accessToken,
    user: data.user,
  };
}
