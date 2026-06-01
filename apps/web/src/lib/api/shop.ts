import type { ShopProduct } from "../../types";
import { apiClient } from "./client";

export async function fetchShopProducts() {
  const { data } = await apiClient.get<ShopProduct[]>("/shop/products");
  return data;
}

export async function fetchShopProduct(idOrSlug: string) {
  const { data } = await apiClient.get<ShopProduct>(`/shop/products/${idOrSlug}`);
  return data;
}
