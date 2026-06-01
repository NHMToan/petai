import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";

type StatusBadgeProps = {
  label: string;
  tone?: "primary" | "secondary" | "neutral";
};

export function StatusBadge({ label, tone = "primary" }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, tone === "secondary" ? styles.secondary : tone === "neutral" ? styles.neutral : styles.primary]}>
      <View style={[styles.dot, tone === "secondary" ? styles.secondaryDot : tone === "neutral" ? styles.neutralDot : styles.primaryDot]} />
      <Text style={[styles.text, tone === "secondary" ? styles.secondaryText : tone === "neutral" ? styles.neutralText : styles.primaryText]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    borderRadius: theme.radii.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: "rgba(165,231,255,0.1)",
    borderColor: "rgba(165,231,255,0.24)",
  },
  secondary: {
    backgroundColor: "rgba(217,185,255,0.12)",
    borderColor: "rgba(217,185,255,0.24)",
  },
  neutral: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.08)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radii.full,
  },
  primaryDot: {
    backgroundColor: theme.colors.primaryContainer,
  },
  secondaryDot: {
    backgroundColor: theme.colors.secondary,
  },
  neutralDot: {
    backgroundColor: theme.colors.outline,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  primaryText: {
    color: theme.colors.primary,
  },
  secondaryText: {
    color: theme.colors.secondary,
  },
  neutralText: {
    color: theme.colors.onSurfaceVariant,
  },
});
