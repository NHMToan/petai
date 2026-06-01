import { API_BASE_URL, apiClient, USE_MOCK_API } from "@/api/client";
import { mockShopItems } from "@/mocks/mockData";
import type { ShopItem } from "@/types";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

type BackendProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  price: number;
  heroImage: string;
  gallery: string[];
  specs: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  category: string;
  badge: string;
  imageKey?: string | null;
};

function normalizeProduct(product: BackendProduct): ShopItem {
  const heroImage = getProductImageUrl(product) ?? product.heroImage;
  const gallery = (product.gallery ?? []).map((image) =>
    typeof image === "string" && image.length > 0 ? image : heroImage,
  );

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    shortDescription: product.shortDescription,
    description: product.description,
    longDescription: product.longDescription,
    price: product.price,
    heroImage,
    gallery,
    specs: product.specs,
    category: product.category,
    badge: product.badge,
  };
}

function getProductImageUrl(product: BackendProduct) {
  if (!product.imageKey) {
    return product.heroImage;
  }

  const normalizedBase = API_BASE_URL.replace(/\/+$/, "");
  return `${normalizedBase}/shop/products/${encodeURIComponent(product.slug || product.id)}/image`;
}

export async function getShopProducts(): Promise<ShopItem[]> {
  if (USE_MOCK_API) {
    await delay();
    return mockShopItems;
  }

  const { data } = await apiClient.get<BackendProduct[]>("/shop/products");
  return data.map(normalizeProduct);
}

export async function getShopProduct(idOrSlug: string): Promise<ShopItem> {
  if (USE_MOCK_API) {
    await delay();
    const match = mockShopItems.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
    if (!match) {
      throw new Error("Product not found");
    }
    return match as ShopItem;
  }

  const { data } = await apiClient.get<BackendProduct>(`/shop/products/${idOrSlug}`);
  return normalizeProduct(data);
}
