import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getMyPets, updatePet } from "@/api/pets";
import { GradientCard } from "@/components/GradientCard";
import { InputField } from "@/components/InputField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import type { HomeStackParamList } from "@/navigation/types";
import { theme } from "@/theme/theme";
import type { Pet } from "@/types";

type Props = NativeStackScreenProps<HomeStackParamList, "PetIdentitySetup">;

export function PetIdentitySetupScreen({ navigation, route }: Props) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [wakeWord, setWakeWord] = useState("");

  useEffect(() => {
    getMyPets().then((pets) => {
      const current = pets.find((entry) => entry.id === route.params?.petId) ?? pets[0] ?? null;
      setPet(current);
      setName(current?.name ?? "");
      setSpecies(current?.species ?? "");
      setNotes(current?.notes ?? "");
      setWakeWord(current?.wakeWord ?? "Hey PetAI");
    });
  }, [route.params?.petId]);

  async function handleSave() {
    if (!pet) return;
    await updatePet(pet.id, { name, species, notes } as Partial<Pet>);
    navigation.navigate("VoiceSelection", { petId: pet.id });
  }

  return (
    <Screen subtitle="Shape your companion's identity before the first deep conversation." title="Pet Identity">
      {pet ? (
        <GradientCard>
          <View style={styles.hero}>
            <Image source={{ uri: pet.imageUrl ?? undefined }} style={styles.avatar} />
            <View>
              <Text style={styles.heroLabel}>NEURAL DESIGNATION</Text>
              <Text style={styles.heroName}>{pet.name}</Text>
            </View>
          </View>
        </GradientCard>
      ) : null}
      <View style={styles.form}>
        <InputField label="Name" onChangeText={setName} value={name} />
        <InputField label="Species" onChangeText={setSpecies} value={species} />
        <InputField label="Wake Word" onChangeText={setWakeWord} value={wakeWord} />
        <InputField label="Notes" multiline onChangeText={setNotes} value={notes} />
        <PrimaryButton label="Continue to Voice" onPress={handleSave} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: theme.radii.full,
    borderWidth: 2,
    borderColor: "rgba(165,231,255,0.35)",
  },
  heroLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  heroName: {
    color: theme.colors.onSurface,
    fontSize: 28,
    fontWeight: "700",
  },
  form: {
    gap: theme.spacing.lg,
  },
});
