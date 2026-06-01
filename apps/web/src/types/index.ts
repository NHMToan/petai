export type Role = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type Device = {
  id: string;
  name: string;
  serialNumber: string;
  productCode: string;
  status: string;
  claimedAt?: string | null;
  claimedById?: string | null;
  claimedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  pets?: Array<{ id: string; name: string }>;
  createdAt?: string;
  updatedAt?: string;
};

export type Voice = {
  id: string;
  name: string;
  description?: string | null;
  tone: string;
  locale: string;
  version: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    pets: number;
  };
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  notes?: string | null;
  imageUrl?: string | null;
  imageKey?: string | null;
  userId?: string | null;
  deviceId?: string | null;
  voiceId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  } | null;
  device?: Device | null;
  voice?: Voice | null;
};

export type PetChatRole = "user" | "assistant" | "system";

export type PetChatMessage = {
  id: string;
  role: PetChatRole;
  content: string;
  model?: string | null;
  createdAt?: string;
};

export type PetMemory = {
  id: string;
  kind: "PROFILE" | "PREFERENCE" | "RELATIONSHIP" | "ROUTINE" | "FACT";
  content: string;
  importance: number;
  lastUsedAt?: string | null;
};

export type PetChatState = {
  pet: {
    id: string;
    name: string;
    species: string;
    breed?: string | null;
    notes?: string | null;
    voice?: {
      id: string;
      name: string;
      locale: string;
      tone: string;
    } | null;
  };
  conversation: {
    id: string;
    title?: string | null;
    summary: string;
    lastMessageAt?: string | null;
    messages: PetChatMessage[];
  };
  memories: PetMemory[];
  config: {
    textModel: string;
    memoryModel: string;
    realtimeModel: string;
    defaultRealtimeVoice: string;
  };
};

export type PetChatReply = {
  conversationId: string;
  userMessage: PetChatMessage;
  assistantMessage: PetChatMessage;
  summary: string;
  memories: PetMemory[];
  usage?: {
    inputTokens?: number | null;
    outputTokens?: number | null;
  };
};

export type PetVoiceClientSecret = {
  value: string;
  expiresAt: number;
  model: string;
  voice: string;
};

export type ClaimDeviceResult = {
  device: Device;
  pet: Pet;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    pets: number;
    devices: number;
  };
};

export type NavItem = {
  label: string;
  to: string;
  icon: string;
};

export type Stat = {
  label: string;
  value: string;
  helper?: string;
  icon: string;
  accent?: "primary" | "secondary" | "neutral";
};

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

export type ShopProductSpec = {
  icon: string;
  label: string;
  value: string;
};

export type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  price: number;
  heroImage: string;
  gallery: string[];
  specs: ShopProductSpec[];
  category: string;
  badge: string;
  imageKey?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  product: ShopProduct;
  quantity: number;
};

export type OrderStatus = "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED";
export type OrderSource = "WEB" | "MOBILE";

export type CheckoutOrderItem = {
  productId: string;
  productName: string;
  productSlug?: string | null;
  heroImage?: string | null;
  quantity: number;
  unitPrice: number;
};

export type CheckoutOrderPayload = {
  source?: OrderSource;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  shippingLine1: string;
  shippingLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  note?: string;
  items: CheckoutOrderItem[];
};

export type OrderItem = CheckoutOrderItem & {
  id: string;
  lineTotal: number;
  createdAt?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  source: OrderSource;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  company?: string | null;
  shippingLine1: string;
  shippingLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  note?: string | null;
  subtotal: number;
  total: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  items: OrderItem[];
};
