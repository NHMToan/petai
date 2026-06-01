import type { NavItem } from "../types";

export const userNavItems: NavItem[] = [
  { label: "Overview", to: "/app/dashboard", icon: "dashboard" },
  { label: "My Pets", to: "/app/pets", icon: "pets" },
  { label: "Claim Device", to: "/app/claim-device", icon: "add_to_home_screen" },
  { label: "Account", to: "/app/account", icon: "account_circle" },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "dashboard" },
  { label: "Orders", to: "/admin/orders", icon: "receipt_long" },
  { label: "Products", to: "/admin/products", icon: "inventory_2" },
  { label: "Devices", to: "/admin/devices", icon: "router" },
  { label: "Pets", to: "/admin/pets", icon: "pets" },
  { label: "Users", to: "/admin/users", icon: "group" },
  { label: "Voices", to: "/admin/voices", icon: "record_voice_over" },
];
