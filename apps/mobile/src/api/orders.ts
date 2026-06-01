import { apiClient } from "@/api/client";
import type { CheckoutOrderPayload, Order } from "@/types";

export async function createShopOrder(payload: CheckoutOrderPayload) {
  const { data } = await apiClient.post<Order>("/shop/orders", payload);
  return data;
}
