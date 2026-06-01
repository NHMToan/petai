import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "@/theme/theme";

type GradientCardProps = PropsWithChildren<{
  glow?: "primary" | "secondary";
}>;

export function GradientCard({ children, glow = "primary" }: GradientCardProps) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={
          glow === "primary"
            ? ["rgba(165,231,255,0.16)", "rgba(165,231,255,0.02)", "rgba(255,255,255,0.03)"]
            : ["rgba(217,185,255,0.16)", "rgba(217,185,255,0.02)", "rgba(255,255,255,0.03)"]
        }
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.card}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  card: {
    padding: theme.spacing.lg,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
});
