export const USE_MOCK_API = (import.meta.env.VITE_USE_MOCK_API ?? "true") === "true";

export async function mockRequest<T>(data: T, delay = 350): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, delay));
  return data;
}
