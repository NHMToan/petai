import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { GradientCard } from "@/components/GradientCard";
import { Screen } from "@/components/Screen";
import type { HomeStackParamList } from "@/navigation/types";
import { theme } from "@/theme/theme";

type Props = NativeStackScreenProps<HomeStackParamList, "DeviceSettings">;

const rows = [
  "Always-on listening",
  "Ambient mood lights",
  "Low power sleep mode",
];

export function DeviceSettingsScreen({ route }: Props) {
  const [toggles, setToggles] = useState([true, true, false]);

  return (
    <Screen subtitle={`Hardware controls for ${route.params?.petId ?? "your current companion"}.`} title="Device Settings">
      <GradientCard>
        <View style={styles.stack}>
          {rows.map((row, index) => (
            <View key={row} style={styles.row}>
              <Text style={styles.label}>{row}</Text>
              <Switch
                onValueChange={(value) =>
                  setToggles((current) =>
                    current.map((entry, toggleIndex) => (toggleIndex === index ? value : entry)),
                  )
                }
                trackColor={{ false: "rgba(255,255,255,0.12)", true: "rgba(165,231,255,0.35)" }}
                value={toggles[index]}
              />
            </View>
          ))}
        </View>
      </GradientCard>
      <Pressable style={styles.reset}>
        <Text style={styles.resetText}>Run diagnostics and recalibrate sensors</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: theme.spacing.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  label: {
    flex: 1,
    color: theme.colors.onSurface,
    fontSize: 16,
    lineHeight: 22,
  },
  reset: {
    borderRadius: theme.radii.md,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: theme.spacing.lg,
  },
  resetText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
});
