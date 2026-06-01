import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";
import type { Voice } from "@/types";

type VoiceCardProps = {
  voice: Voice;
  selected?: boolean;
  onPress?: () => void;
  onPreviewPress?: () => void;
  previewing?: boolean;
  disabled?: boolean;
  compact?: boolean;
};

export function VoiceCard({
  voice,
  selected = false,
  onPress,
  onPreviewPress,
  previewing = false,
  disabled = false,
  compact = false,
}: VoiceCardProps) {
  const toneLabel = voice.tone.toUpperCase();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        selected && styles.cardSelected,
        disabled && styles.cardDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {selected ? <View style={styles.selectedDot} /> : null}
      <View style={styles.topRow}>
        <Pressable
          disabled={disabled}
          onPress={(event) => {
            event.stopPropagation();
            onPreviewPress?.();
          }}
          style={({ pressed }) => [
            styles.iconWrap,
            selected && styles.iconWrapSelected,
            pressed && !disabled && styles.iconPressed,
          ]}
        >
          <MaterialIcons
            color={selected ? theme.colors.primary : theme.colors.onSurfaceVariant}
            name={previewing ? "pause-circle-filled" : "play-circle-outline"}
            size={compact ? 30 : 34}
          />
        </Pressable>
        <View style={styles.textMeta}>
          <Text numberOfLines={1} style={styles.locale}>
            {voice.locale}
          </Text>
        </View>
      </View>
      <View style={[styles.content, compact && styles.contentCompact]}>
        <Text numberOfLines={1} style={[styles.name, selected && styles.nameSelected]}>
          {voice.name}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {toneLabel}
        </Text>
      </View>
      <View style={styles.selectedBar}>
        <View style={[styles.selectedBarFill, !selected && styles.selectedBarFillMuted]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 206,
    minWidth: 220,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  cardCompact: {
    minHeight: 188,
    minWidth: 200,
  },
  cardSelected: {
    backgroundColor: "#1e2529",
    borderColor: "rgba(165,231,255,0.38)",
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  cardDisabled: {
    opacity: 0.65,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  iconWrapSelected: {
    backgroundColor: "rgba(165,231,255,0.14)",
    borderColor: "rgba(165,231,255,0.28)",
  },
  iconPressed: {
    transform: [{ scale: 0.96 }],
  },
  textMeta: {
    alignItems: "flex-end",
  },
  content: {
    alignItems: "center",
    marginTop: 24,
  },
  contentCompact: {
    marginTop: 18,
  },
  name: {
    color: theme.colors.onSurface,
    fontSize: 30,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  nameSelected: {
    color: theme.colors.primary,
  },
  meta: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    marginTop: 12,
    fontWeight: "500",
    letterSpacing: 3.4,
  },
  locale: {
    color: "rgba(229,226,225,0.7)",
    fontSize: 11,
    letterSpacing: 1.2,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  selectedDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
  },
  selectedBar: {
    marginTop: 24,
    width: "100%",
    height: 4,
    borderRadius: theme.radii.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  selectedBarFill: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
  },
  selectedBarFillMuted: {
    width: "66%",
    opacity: 0.6,
  },
});
