export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ClaimDevice: undefined;
  PetIdentitySetup: { petId?: string } | undefined;
  VoiceSelection: { petId?: string } | undefined;
  Talk: { petId?: string } | undefined;
  VoiceChat: { petId?: string } | undefined;
  DeviceSettings: { petId?: string } | undefined;
  PetProfile: { petId?: string } | undefined;
};

export type ShopStackParamList = {
  Shop: undefined;
  ShopProduct: { productId: string };
  ShopCheckout: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  ShopTab: undefined;
  SettingsTab: undefined;
};
