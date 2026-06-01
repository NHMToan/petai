import type { CheckoutOrderPayload, Order } from "../../types";
import { apiClient } from "./client";

export async function createShopOrder(payload: CheckoutOrderPayload) {
  const { data } = await apiClient.post<Order>("/shop/orders", payload);
  return data;
}

export async function fetchAdminOrders() {
  const { data } = await apiClient.get<Order[]>("/admin/orders");
  return data;
}
