import { getMyPets, getVoices, updatePet } from "@/api/pets";
import { GradientCard } from "@/components/GradientCard";
import { InputField } from "@/components/InputField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { StatusBadge } from "@/components/StatusBadge";
import { VoiceCard } from "@/components/VoiceCard";
import type { HomeStackParamList } from "@/navigation/types";
import { theme } from "@/theme/theme";
import type { Pet, Voice } from "@/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = NativeStackScreenProps<HomeStackParamList, "PetProfile">;

export function PetProfileScreen({ navigation, route }: Props) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getMyPets(), getVoices()]).then(([pets, availableVoices]) => {
      const currentPet =
        pets.find((entry) => entry.id === route.params?.petId) ??
        pets[0] ??
        null;
      setPet(currentPet);
      setVoices(availableVoices);
      setSelectedVoiceId(currentPet?.voiceId ?? availableVoices[0]?.id ?? null);
    });
  }, [route.params?.petId]);

  if (!pet) {
    return <Screen title="Pet Identity" />;
  }

  async function handleSaveProfile() {
    if (!pet) return;
    setSaving(true);
    try {
      const updated = await updatePet(pet.id, {
        voiceId: selectedVoiceId,
      } as Partial<Pet>);
      setPet(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <GradientCard>
        <View style={styles.identityCard}>
          <Image
            source={{ uri: pet.imageUrl ?? undefined }}
            style={styles.avatar}
          />
          <View style={styles.editBadge}>
            <Pressable
              onPress={() =>
                navigation.navigate("PetIdentitySetup", { petId: pet.id })
              }
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>✎</Text>
            </Pressable>
          </View>
          <Text style={styles.identityLabel}>NEURAL DESIGNATION</Text>
          <Text style={styles.name}>{pet.name}</Text>
        </View>
        <PrimaryButton
          label="Chat"
          onPress={() => navigation.navigate("Talk", { petId: pet.id })}
        />
      </GradientCard>

        <View style={styles.formSection}>
          <InputField
            label="Name"
            onChangeText={() => undefined}
            value={pet.name}
          />

          <GradientCard>
            <Text style={styles.label}>AI WAKE WORD</Text>
            <Text style={styles.fieldValue}>
              {pet.wakeWord ?? `Hey ${pet.name}`}
            </Text>
          </GradientCard>
        </View>

        <View style={styles.voiceSection}>
          <View style={styles.voiceHeader}>
            <Text style={styles.sectionLabel}>NEURAL VOICE SYNTH</Text>
            <Text style={styles.voiceStatus}>PREVIEW ENGINE ACTIVE</Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.voiceList}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {voices.map((voice) => (
              <VoiceCard
                compact
                key={voice.id}
                onPress={() => setSelectedVoiceId(voice.id)}
                selected={voice.id === selectedVoiceId}
                voice={voice}
              />
            ))}
          </ScrollView>
        </View>

        <GradientCard glow="secondary">
          <Text style={styles.syncTitle}>Active Consciousness Sync</Text>
          <Text style={styles.syncBody}>
            {pet.name}'s AI core will continuously learn from real-world
            behavior logs and recent conversation state.
          </Text>
          <View style={styles.syncRow}>
            <StatusBadge label={`${pet.sync}% sync`} />
            <Text style={styles.syncMeta}>Battery {pet.battery}%</Text>
          </View>
        </GradientCard>

        <View style={styles.actionColumn}>
          <PrimaryButton
            label="Save Neural Profile"
            loading={saving}
            onPress={handleSaveProfile}
            secondary
          />
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identityCard: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: theme.radii.full,
    borderWidth: 2,
    borderColor: "rgba(165,231,255,0.3)",
  },
  editBadge: {
    position: "absolute",
    top: 74,
    right: 98,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: "700",
  },
  identityLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.4,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  name: {
    color: theme.colors.onSurface,
    fontSize: 30,
    fontWeight: "700",
  },
  formSection: {
    gap: theme.spacing.md,
  },
  dualGrid: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  fieldValue: {
    color: theme.colors.onSurface,
    fontSize: 24,
    fontWeight: "600",
    marginTop: 2,
  },
  voiceSection: {
    gap: theme.spacing.md,
  },
  voiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  sectionLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  voiceStatus: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  voiceList: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  syncTitle: {
    color: theme.colors.onSurface,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  syncBody: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
    marginTop: theme.spacing.sm,
  },
  syncRow: {
    marginTop: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  syncMeta: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  actionColumn: {
    gap: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  value: {
    color: theme.colors.onSurface,
    fontSize: 24,
    fontWeight: "700",
  },
  notes: {
    color: theme.colors.onSurface,
    fontSize: 15,
    lineHeight: 22,
  },
});
