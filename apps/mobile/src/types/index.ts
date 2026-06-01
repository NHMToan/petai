export type Role = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  imageUrl?: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  notes?: string | null;
  imageUrl?: string | null;
  voiceId?: string | null;
  mood: string;
  battery: number;
  sync: number;
  wakeWord?: string;
};

export type Voice = {
  id: string;
  name: string;
  description: string;
  tone: string;
  locale: string;
  version: string;
  previewLine: string;
  isActive: boolean;
};

export type Device = {
  id: string;
  name: string;
  serialNumber: string;
  productCode: string;
  status: "AVAILABLE" | "CLAIMED" | "DISABLED";
};

export type ShopItem = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description?: string;
  longDescription?: string;
  price: number;
  heroImage: string;
  gallery?: string[];
  specs?: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  category?: string;
  badge: string;
};

export type OrderSource = "WEB" | "MOBILE";
export type OrderStatus = "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED";

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
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: string | null;
  createdAt: string;
};

export type ChatConversationState = {
  id: string;
  title?: string | null;
  summary: string;
  lastMessageAt?: string | null;
  messages: ChatMessage[];
};

export type ChatMemory = {
  id: string;
  kind: "PROFILE" | "PREFERENCE" | "RELATIONSHIP" | "ROUTINE" | "FACT";
  content: string;
  importance: number;
  lastUsedAt?: string | null;
};

export type RealtimeVoice = "alloy" | "ash" | "ballad" | "coral" | "echo" | "sage" | "shimmer" | "verse" | "marin" | "cedar";

export type RealtimeClientSession = {
  value: string;
  expiresAt: number;
  model: string;
  voice: RealtimeVoice;
};

export type VoiceTurnResponse = {
  conversationId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  summary: string;
  memories: ChatMemory[];
  audio: {
    mimeType: string;
    fileName: string;
    base64: string;
  };
};

export type Credentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type ClaimDevicePayload = {
  serialNumber: string;
  productCode: string;
};
