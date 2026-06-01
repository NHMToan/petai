import type { AdminUser, Device, Order, Pet, ShopProduct, Stat, Voice } from "../../types";
import { apiClient } from "./client";

export async function fetchAdminDashboard(): Promise<{
  stats: Stat[];
  activity: Array<{ name: string; detail: string; time: string }>;
}> {
  const [users, devices, pets, voices] = await Promise.all([
    fetchAdminUsers(),
    fetchAdminDevices(),
    fetchAdminPets(),
    fetchAdminVoices(),
  ]);

  return {
    stats: [
      { label: "TOTAL USERS", value: users.length.toString(), helper: `${users.filter((user) => user.role === "ADMIN").length} Admins`, icon: "group", accent: "primary" },
      { label: "TOTAL DEVICES", value: devices.length.toString(), helper: "Tracked", icon: "inventory_2", accent: "secondary" },
      { label: "CLAIMED DEVICES", value: devices.filter((device) => device.status === "CLAIMED").length.toString(), helper: "Linked", icon: "sensors", accent: "primary" },
      { label: "ACTIVE PETS", value: pets.length.toString(), helper: "Managed", icon: "pets", accent: "neutral" },
      { label: "AVAILABLE VOICES", value: voices.length.toString(), helper: voices.find((voice) => voice.isActive)?.version ?? "n/a", icon: "graphic_eq", accent: "secondary" },
    ],
    activity: [
      ...devices.slice(0, 1).map((device) => ({
        name: device.name,
        detail: `${device.serialNumber} · ${device.status}${device.claimedBy ? ` · ${device.claimedBy.name}` : ""}`,
        time: device.updatedAt ? new Date(device.updatedAt).toLocaleString() : "Recently",
      })),
      ...pets.slice(0, 1).map((pet) => ({
        name: pet.name,
        detail: `${pet.owner?.name ?? "No owner"} · ${pet.voice?.name ?? "No voice"}`,
        time: pet.updatedAt ? new Date(pet.updatedAt).toLocaleString() : "Recently",
      })),
      ...users.slice(0, 1).map((user) => ({
        name: user.name,
        detail: `${user.email} · ${user.role}`,
        time: user.createdAt ? new Date(user.createdAt).toLocaleString() : "Recently",
      })),
    ],
  };
}

export async function fetchAdminDevices() {
  const { data } = await apiClient.get<Device[]>("/admin/devices");
  return data;
}

export async function createAdminDevice(payload: {
  name: string;
  serialNumber: string;
  productCode: string;
  status?: string;
}) {
  const { data } = await apiClient.post<Device>("/admin/devices", payload);
  return data;
}

export async function updateAdminDevice(
  id: string,
  payload: {
    name?: string;
    serialNumber?: string;
    productCode?: string;
    status?: string;
  },
) {
  const { data } = await apiClient.patch<Device>(`/admin/devices/${id}`, payload);
  return data;
}

export async function fetchAdminPets() {
  const { data } = await apiClient.get<Pet[]>("/admin/pets");
  return data;
}

export async function createAdminPet(payload: {
  name: string;
  species: string;
  breed?: string;
  notes?: string;
  deviceId?: string;
  voiceId?: string;
  userId?: string;
}) {
  const { data } = await apiClient.post<Pet>("/admin/pets", payload);
  return data;
}

export async function updateAdminPet(
  id: string,
  payload: {
    name?: string;
    species?: string;
    breed?: string;
    notes?: string;
    deviceId?: string;
    voiceId?: string;
    userId?: string;
  },
) {
  const { data } = await apiClient.patch<Pet>(`/admin/pets/${id}`, payload);
  return data;
}

export async function deleteAdminPet(id: string) {
  const { data } = await apiClient.delete<{ success: boolean }>(`/admin/pets/${id}`);
  return data;
}

export async function fetchAdminUsers() {
  const { data } = await apiClient.get<AdminUser[]>("/admin/users");
  return data;
}

export async function fetchAdminVoices() {
  const { data } = await apiClient.get<Voice[]>("/admin/voices");
  return data;
}

export async function createAdminVoice(payload: {
  name: string;
  description?: string;
  tone: string;
  locale: string;
  version: string;
  isActive?: boolean;
}) {
  const { data } = await apiClient.post<Voice>("/admin/voices", payload);
  return data;
}

export async function updateAdminVoice(
  id: string,
  payload: {
    name?: string;
    description?: string;
    tone?: string;
    locale?: string;
    version?: string;
    isActive?: boolean;
  },
) {
  const { data } = await apiClient.patch<Voice>(`/admin/voices/${id}`, payload);
  return data;
}

export async function deleteAdminVoice(id: string) {
  const { data } = await apiClient.delete<{ success: boolean }>(`/admin/voices/${id}`);
  return data;
}

export async function fetchAdminVoicePreview(id: string) {
  const { data } = await apiClient.get<Blob>(`/admin/voices/${id}/preview`, {
    responseType: "blob",
  });
  return data;
}

export async function fetchAdminProducts() {
  const { data } = await apiClient.get<ShopProduct[]>("/admin/products");
  return data;
}

export async function createAdminProduct(payload: Omit<ShopProduct, "id">) {
  const { data } = await apiClient.post<ShopProduct>("/admin/products", payload);
  return data;
}

export async function updateAdminProduct(id: string, payload: Partial<Omit<ShopProduct, "id">>) {
  const { data } = await apiClient.patch<ShopProduct>(`/admin/products/${id}`, payload);
  return data;
}

export async function deleteAdminProduct(id: string) {
  const { data } = await apiClient.delete<{ success: boolean }>(`/admin/products/${id}`);
  return data;
}

export async function uploadAdminProductImage(id: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  const { data } = await apiClient.post<ShopProduct>(`/admin/products/${id}/image`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function fetchAdminOrders() {
  const { data } = await apiClient.get<Order[]>("/admin/orders");
  return data;
}
