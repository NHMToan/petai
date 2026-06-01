import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useI18n } from "@/i18n/useI18n";
import { theme } from "@/theme/theme";
import { authStore } from "@/store/authStore";
import { ClaimDeviceScreen } from "@/screens/ClaimDeviceScreen";
import { DeviceSettingsScreen } from "@/screens/DeviceSettingsScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { PetIdentitySetupScreen } from "@/screens/PetIdentitySetupScreen";
import { PetProfileScreen } from "@/screens/PetProfileScreen";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { ShopCheckoutScreen } from "@/screens/ShopCheckoutScreen";
import { ShopProductScreen } from "@/screens/ShopProductScreen";
import { ShopScreen } from "@/screens/ShopScreen";
import { TalkScreen } from "@/screens/TalkScreen";
import { VoiceChatScreen } from "@/screens/VoiceChatScreen";
import { VoiceSelectionScreen } from "@/screens/VoiceSelectionScreen";
import type {
  AppTabParamList,
  AuthStackParamList,
  HomeStackParamList,
  SettingsStackParamList,
  ShopStackParamList,
} from "@/navigation/types";

const RootAuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootHomeStack = createNativeStackNavigator<HomeStackParamList>();
const RootShopStack = createNativeStackNavigator<ShopStackParamList>();
const RootSettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const RootTabs = createBottomTabNavigator<AppTabParamList>();

function commonStackOptions(title?: string) {
  return {
    title,
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerTintColor: theme.colors.primary,
    headerShadowVisible: false,
    headerTitleStyle: {
      color: theme.colors.onSurface,
      fontWeight: "700" as const,
    },
    contentStyle: {
      backgroundColor: theme.colors.background,
    },
  };
}

function AuthNavigator() {
  return (
    <RootAuthStack.Navigator screenOptions={{ headerShown: false }}>
      <RootAuthStack.Screen component={LoginScreen} name="Login" />
      <RootAuthStack.Screen component={RegisterScreen} name="Register" />
    </RootAuthStack.Navigator>
  );
}

function HomeNavigator() {
  const { t } = useI18n();

  return (
    <RootHomeStack.Navigator>
      <RootHomeStack.Screen component={HomeScreen} name="Home" options={commonStackOptions(t("Home"))} />
      <RootHomeStack.Screen component={ClaimDeviceScreen} name="ClaimDevice" options={commonStackOptions(t("Claim Device"))} />
      <RootHomeStack.Screen component={PetIdentitySetupScreen} name="PetIdentitySetup" options={commonStackOptions(t("Pet Identity"))} />
      <RootHomeStack.Screen component={VoiceSelectionScreen} name="VoiceSelection" options={commonStackOptions(t("Voice Selection"))} />
      <RootHomeStack.Screen component={TalkScreen} name="Talk" options={commonStackOptions(t("Talk"))} />
      <RootHomeStack.Screen component={VoiceChatScreen} name="VoiceChat" options={commonStackOptions(t("Voice Chat"))} />
      <RootHomeStack.Screen component={DeviceSettingsScreen} name="DeviceSettings" options={commonStackOptions(t("Device Settings"))} />
      <RootHomeStack.Screen component={PetProfileScreen} name="PetProfile" options={commonStackOptions(t("Pet Profile"))} />
    </RootHomeStack.Navigator>
  );
}

function ShopNavigator() {
  const { t } = useI18n();

  return (
    <RootShopStack.Navigator>
      <RootShopStack.Screen component={ShopScreen} name="Shop" options={commonStackOptions(t("Shop"))} />
      <RootShopStack.Screen component={ShopProductScreen} name="ShopProduct" options={commonStackOptions(t("Product Details"))} />
      <RootShopStack.Screen component={ShopCheckoutScreen} name="ShopCheckout" options={commonStackOptions(t("Checkout"))} />
    </RootShopStack.Navigator>
  );
}

function SettingsNavigator() {
  const { t } = useI18n();

  return (
    <RootSettingsStack.Navigator>
      <RootSettingsStack.Screen component={SettingsScreen} name="Settings" options={commonStackOptions(t("Account"))} />
    </RootSettingsStack.Navigator>
  );
}

function AppNavigator() {
  const { t } = useI18n();

  return (
    <RootTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(19,19,19,0.96)",
          borderTopColor: "rgba(255,255,255,0.06)",
          height: 84,
          paddingTop: 10,
          paddingBottom: 16,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarIcon: ({ color, size }) => {
          const icon =
            route.name === "HomeTab"
              ? "pets"
              : route.name === "ShopTab"
                ? "shopping-bag"
                : "settings";

          return <MaterialIcons color={color} name={icon} size={size} />;
        },
      })}
    >
      <RootTabs.Screen component={HomeNavigator} name="HomeTab" options={{ title: t("Home") }} />
      <RootTabs.Screen component={ShopNavigator} name="ShopTab" options={{ title: t("Shop") }} />
      <RootTabs.Screen component={SettingsNavigator} name="SettingsTab" options={{ title: t("Settings") }} />
    </RootTabs.Navigator>
  );
}

export function RootNavigator() {
  const session = authStore((state) => state.session);

  return session ? <AppNavigator /> : <AuthNavigator />;
}
