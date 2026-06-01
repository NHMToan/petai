import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { getConversationState } from "@/api/chat";
import { getMyPets } from "@/api/pets";
import { GradientCard } from "@/components/GradientCard";
import { useI18n } from "@/i18n/useI18n";
import { PetCard } from "@/components/PetCard";
import { Screen } from "@/components/Screen";
import type { HomeStackParamList } from "@/navigation/types";
import { theme } from "@/theme/theme";
import type { Pet } from "@/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

type SystemLog = {
  id: string;
  petId: string;
  petName: string;
  message: string;
  timestampLabel: string;
};

export function HomeScreen({ navigation }: Props) {
  const { t } = useI18n();
  const [pets, setPets] = useState<Pet[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const nextPets = await getMyPets();
        if (!mounted) return;
        setPets(nextPets);

        const chatStates = await Promise.all(
          nextPets.map(async (pet) => {
            try {
              const state = await getConversationState(pet.id);
              const latestMessage = state.conversation.messages[state.conversation.messages.length - 1];

              if (latestMessage) {
                return {
                  id: latestMessage.id,
                  petId: pet.id,
                  petName: pet.name,
                  message: latestMessage.content,
                  timestampLabel: new Date(latestMessage.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                } satisfies SystemLog;
              }

              if (state.conversation.summary) {
                return {
                  id: `${pet.id}-summary`,
                  petId: pet.id,
                  petName: pet.name,
                  message: state.conversation.summary,
                  timestampLabel: "Summary",
                } satisfies SystemLog;
              }

              return null;
            } catch {
              return null;
            }
          }),
        );

        if (!mounted) return;
        setLogs(chatStates.filter((entry): entry is SystemLog => Boolean(entry)));
      } catch {
        if (!mounted) return;
        setPets([]);
        setLogs([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Screen subtitle={t("Your bonded companions are online and ready to connect.")} title={t("Pets")}>
      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t("Syncing your companions…")}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t("YOUR PETS")}</Text>
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            onChatPress={() => navigation.navigate("Talk", { petId: pet.id })}
            onPress={() => navigation.navigate("VoiceChat", { petId: pet.id })}
            pet={pet}
          />
        ))}
        {!loading && pets.length === 0 ? <Text style={styles.emptyText}>{t("No pets are linked to this account yet.")}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t("SYSTEM LOGS")}</Text>
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <GradientCard glow={index % 2 === 0 ? "secondary" : "primary"} key={log.id}>
              <View style={styles.logHeader}>
                <View style={styles.logPet}>
                  <MaterialIcons color={theme.colors.primary} name="memory" size={18} />
                  <Text style={styles.logPetName}>{log.petName}</Text>
                </View>
                <Text style={styles.logTime}>{log.timestampLabel}</Text>
              </View>
              <Text numberOfLines={3} style={styles.logMessage}>
                {log.message}
              </Text>
            </GradientCard>
          ))
        ) : (
          <GradientCard glow="secondary">
            <Text style={styles.emptyText}>{t("No system logs available yet.")}</Text>
          </GradientCard>
        )}
      </View>

      <Pressable onPress={() => navigation.navigate("ClaimDevice")} style={({ pressed }) => [styles.claim, pressed && styles.pressed]}>
        <MaterialIcons color={theme.colors.primary} name="qr-code-scanner" size={20} />
        <Text style={styles.claimText}>{t("Claim a new PetAI device")}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.md,
  },
  loadingState: {
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  sectionLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: theme.typography.mono.fontSize,
    letterSpacing: theme.typography.mono.letterSpacing,
    fontWeight: "700",
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  logPet: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  logPetName: {
    color: theme.colors.onSurface,
    fontSize: 15,
    fontWeight: "600",
  },
  logTime: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  logMessage: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 21,
    marginTop: theme.spacing.md,
  },
  claim: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: theme.radii.full,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  claimText: {
    color: theme.colors.onSurface,
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
});
