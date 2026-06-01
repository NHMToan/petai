import { StyleSheet, View } from "react-native";
import { theme } from "@/theme/theme";

type WaveformMockProps = {
  active?: boolean;
  bars?: number;
};

export function WaveformMock({ active = false, bars = 24 }: WaveformMockProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: bars }).map((_, index) => {
        const height = 12 + ((index * 13) % 56);
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height,
                opacity: active ? 0.95 : 0.35,
                backgroundColor:
                  index % 3 === 0 ? theme.colors.secondary : theme.colors.primary,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 92,
  },
  bar: {
    width: 4,
    borderRadius: theme.radii.full,
  },
});
