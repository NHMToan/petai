import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { getVoices, getMyPets, updatePet } from "@/api/pets";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { VoiceCard } from "@/components/VoiceCard";
import type { HomeStackParamList } from "@/navigation/types";
import { theme } from "@/theme/theme";
import type { Pet, Voice } from "@/types";

type Props = NativeStackScreenProps<HomeStackParamList, "VoiceSelection">;

export function VoiceSelectionScreen({ navigation, route }: Props) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMyPets(), getVoices()]).then(([pets, availableVoices]) => {
      const currentPet = pets.find((entry) => entry.id === route.params?.petId) ?? pets[0] ?? null;
      setPet(currentPet);
      setVoices(availableVoices);
      setSelectedVoiceId(currentPet?.voiceId ?? availableVoices[0]?.id ?? null);
    });
  }, [route.params?.petId]);

  async function handleContinue() {
    if (!pet || !selectedVoiceId) return;
    await updatePet(pet.id, { voiceId: selectedVoiceId } as Partial<Pet>);
    navigation.navigate("Talk", { petId: pet.id });
  }

  return (
    <Screen subtitle="Choose the synthetic voice that will carry your pet's personality." title="Voice Selection">
      <View style={styles.list}>
        {voices.map((voice) => (
          <VoiceCard
            key={voice.id}
            onPress={() => setSelectedVoiceId(voice.id)}
            selected={voice.id === selectedVoiceId}
            voice={voice}
          />
        ))}
      </View>
      <PrimaryButton label="Start Talking" onPress={handleContinue} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.md,
  },
});
