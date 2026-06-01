import type { AuthSession, AuthUser } from "../../types";
import { apiClient } from "./client";

type Credentials = {
  email: string;
  password: string;
};

type RegisterPayload = Credentials & {
  name: string;
};

type AuthApiResponse = {
  accessToken: string;
  user: AuthUser;
};

function normalizeSession(data: AuthApiResponse): AuthSession {
  return {
    token: data.accessToken,
    user: data.user,
  };
}

export async function loginApi(payload: Credentials): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthApiResponse>("/auth/login", payload);
  return normalizeSession(data);
}

export async function registerApi(payload: RegisterPayload): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthApiResponse>("/auth/register", payload);
  return normalizeSession(data);
}
