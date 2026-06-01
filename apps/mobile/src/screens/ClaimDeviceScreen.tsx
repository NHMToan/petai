import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { claimDevice } from "@/api/pets";
import { InputField } from "@/components/InputField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import type { HomeStackParamList } from "@/navigation/types";
import { theme } from "@/theme/theme";

type Props = NativeStackScreenProps<HomeStackParamList, "ClaimDevice">;

export function ClaimDeviceScreen({ navigation }: Props) {
  const [serialNumber, setSerialNumber] = useState("DV-5912");
  const [productCode, setProductCode] = useState("MINI-GLOW");
  const [loading, setLoading] = useState(false);

  async function handleClaim() {
    setLoading(true);
    try {
      const result = await claimDevice({ serialNumber, productCode });
      navigation.replace("PetIdentitySetup", { petId: result.pet.id });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen subtitle="Link fresh hardware to your account or recover a new companion core." title="Claim Device">
      <View style={styles.form}>
        <InputField label="Serial Number" onChangeText={setSerialNumber} value={serialNumber} />
        <InputField label="Product Code" onChangeText={setProductCode} value={productCode} />
        <Text style={styles.helper}>Use the code on your PetAI hardware, or simulate the mock flow with the prefilled values.</Text>
        <PrimaryButton label="Claim Device" loading={loading} onPress={handleClaim} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.lg,
  },
  helper: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
});
