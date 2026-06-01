export function getProductImageUrl(productIdOrSlug: string, updatedAt?: string, hasImageKey?: string | null) {
  if (!hasImageKey) {
    return null;
  }
  const version = updatedAt ? `?v=${encodeURIComponent(updatedAt)}` : "";
  const baseUrl = String(import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api").replace(/\/$/, "");
  return `${baseUrl}/shop/products/${encodeURIComponent(productIdOrSlug)}/image${version}`;
}
