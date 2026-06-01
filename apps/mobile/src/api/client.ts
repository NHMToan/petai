import { authStore } from "@/store/authStore";
import axios from "axios";
import { Platform } from "react-native";

// Set this to your Mac's LAN IP when testing on a real iPhone.
// Example: "http://192.168.1.23:3000/api"
const LOCAL_LAN_API_URL = "http://192.168.50.72:3000/api";

function resolveFallbackBaseUrl() {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api";
  }

  if (LOCAL_LAN_API_URL.trim().length > 0) {
    return LOCAL_LAN_API_URL.trim();
  }

  return "http://127.0.0.1:3000/api";
}

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const API_BASE_URL = (
  configuredBaseUrl && configuredBaseUrl.length > 0
    ? configuredBaseUrl
    : resolveFallbackBaseUrl()
)?.replace(/\/+$/, "");

export const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === "true";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().session?.token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
