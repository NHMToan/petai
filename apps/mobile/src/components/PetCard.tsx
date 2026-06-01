import { GradientCard } from "@/components/GradientCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useI18n } from "@/i18n/useI18n";
import { localizePetMood, localizePetSpecies } from "@/i18n/petLocalization";
import { theme } from "@/theme/theme";
import type { Pet } from "@/types";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type PetCardProps = {
  pet: Pet;
  onPress?: () => void;
  onChatPress?: () => void;
};

export function PetCard({ pet, onPress }: PetCardProps) {
  const { locale } = useI18n();
  const content = (
    <GradientCard glow="primary">
      <View style={styles.topRow}>
        <Image
          source={{ uri: pet.imageUrl ?? undefined }}
          style={styles.avatar}
        />
        <StatusBadge label={`${pet.sync}% sync`} />
      </View>
      <Text style={styles.name}>{pet.name}</Text>
      <View style={styles.nameRow}>
        <Text style={styles.description}>
          {localizePetSpecies(pet.species, locale)}
          {pet.breed ? ` · ${pet.breed}` : ""}
        </Text>
      </View>
      <View style={styles.metrics}>
        <View>
          <Text style={styles.metricLabel}>BATTERY</Text>
          <Text style={styles.metricValue}>{pet.battery}%</Text>
        </View>
        <View>
          <Text style={styles.metricLabel}>MOOD</Text>
          <Text style={styles.metricValue}>{localizePetMood(pet.mood, locale)}</Text>
        </View>
      </View>
    </GradientCard>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: "rgba(165,231,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  name: {
    color: theme.colors.onSurface,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  description: {
    flex: 1,
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
  },
  chatButton: {
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: "rgba(165,231,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(165,231,255,0.22)",
  },
  chatButtonText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  chatPressed: {
    transform: [{ scale: 0.96 }],
  },
  metrics: {
    marginTop: theme.spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: "700",
  },
  metricValue: {
    color: theme.colors.onSurface,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
});
