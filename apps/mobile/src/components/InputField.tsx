import { StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "@/theme/theme";

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
};

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline = false,
}: InputFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(187,201,207,0.35)"
        secureTextEntry={secureTextEntry}
        style={[styles.input, multiline && styles.multiline]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    fontSize: theme.typography.mono.fontSize,
    letterSpacing: theme.typography.mono.letterSpacing,
    fontWeight: theme.typography.mono.fontWeight,
  },
  input: {
    minHeight: 56,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.black,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.onSurface,
    fontSize: theme.typography.body.fontSize,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: theme.spacing.md,
  },
});
