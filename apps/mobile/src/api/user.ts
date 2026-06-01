import { apiClient } from "@/api/client";
import type { AuthUser } from "@/types";

export type UserProfile = AuthUser & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<UserProfile>("/me");
  return data;
}

export async function updateCurrentUserProfile(payload: { name: string }) {
  const { data } = await apiClient.patch<UserProfile>("/me", payload);
  return data;
}

export async function changeCurrentUserPassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  const { data } = await apiClient.patch<{ success: boolean }>(
    "/me/password",
    payload,
  );
  return data;
}
