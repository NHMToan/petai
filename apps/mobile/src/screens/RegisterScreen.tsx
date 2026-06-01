import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import type { AuthStackParamList } from "@/navigation/types";
import { authStore } from "@/store/authStore";
import { theme } from "@/theme/theme";
import { useI18n } from "@/i18n/useI18n";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("Toan Nguyen");
  const [email, setEmail] = useState("toan@petai.io");
  const [password, setPassword] = useState("PetAI123!");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signUp, loading } = authStore();

  async function handleRegister() {
    if (!acceptedTerms) {
      setError(t("I acknowledge the Neural Protocol Terms and the Privacy Infrastructure Agreement."));
      return;
    }

    try {
      setError(null);
      await signUp({ name, email, password });
    } catch {
      setError(t("Unable to create account right now."));
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View pointerEvents="none" style={[styles.glow, styles.glowTop]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom]} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.systemIcon}>
            <MaterialIcons color={theme.colors.primary} name="auto-awesome" size={34} />
          </View>
          <View style={styles.systemState}>
            <View style={styles.systemDot} />
            <Text style={styles.systemText}>{t("System Initialized")}</Text>
          </View>
          <Text style={styles.title}>{t("Create Your Neural Profile")}</Text>
          <Text style={styles.subtitle}>{t("Connect your biology to the intelligence of the future.")}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{t("IDENTITY NAME")}</Text>
            <View style={styles.inputShell}>
              <MaterialIcons color="rgba(187,201,207,0.62)" name="person-outline" size={20} />
              <TextInput
                onChangeText={setName}
                placeholder="e.g. Julian Vane"
                placeholderTextColor="rgba(133,147,153,0.6)"
                style={styles.input}
                value={name}
              />
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{t("NEURAL ADDRESS")}</Text>
            <View style={styles.inputShell}>
              <MaterialIcons color="rgba(187,201,207,0.62)" name="alternate-email" size={20} />
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="julian@pet.ai"
                placeholderTextColor="rgba(133,147,153,0.6)"
                style={styles.input}
                value={email}
              />
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{t("ENCRYPTION KEY")}</Text>
            <View style={styles.inputShell}>
              <MaterialIcons color="rgba(187,201,207,0.62)" name="lock-outline" size={20} />
              <TextInput
                onChangeText={setPassword}
                placeholder="••••••••••••"
                placeholderTextColor="rgba(133,147,153,0.6)"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
              />
              <Pressable hitSlop={10} onPress={() => setShowPassword((value) => !value)}>
                <Ionicons
                  color="rgba(187,201,207,0.62)"
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() => setAcceptedTerms((value) => !value)}
            style={({ pressed }) => [styles.termsRow, pressed && styles.pressed]}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms ? <MaterialIcons color={theme.colors.background} name="check" size={14} /> : null}
            </View>
            <Text style={styles.termsText}>
              {t("I acknowledge the Neural Protocol Terms and the Privacy Infrastructure Agreement.")}
            </Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            disabled={loading}
            onPress={handleRegister}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              loading && styles.primaryButtonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? t("Saving...") : t("Create Account")}
            </Text>
            <MaterialIcons color={theme.colors.surfaceContainerLowest} name="arrow-forward" size={20} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerPrompt}>{t("Already have a link?")}</Text>
          <Pressable onPress={() => navigation.navigate("Login")} style={styles.footerLinkRow}>
            <Text style={styles.footerLink}>{t("EXISTING USER LOGIN")}</Text>
            <MaterialIcons color={theme.colors.primary} name="login" size={14} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 320,
  },
  glowTop: {
    top: -60,
    right: -80,
    backgroundColor: "rgba(165,231,255,0.08)",
  },
  glowBottom: {
    left: -120,
    bottom: 40,
    backgroundColor: "rgba(217,185,255,0.08)",
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    gap: 10,
  },
  systemIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  systemState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  systemDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  systemText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 4,
    color: theme.colors.onSurface,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: -0.7,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    textAlign: "center",
    maxWidth: 300,
  },
  form: {
    gap: theme.spacing.md,
  },
  fieldBlock: {
    gap: 8,
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    marginLeft: 4,
  },
  inputShell: {
    minHeight: 60,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  termsText: {
    flex: 1,
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
  },
  primaryButton: {
    minHeight: 64,
    borderRadius: 14,
    backgroundColor: theme.colors.onSurface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: theme.spacing.sm,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: theme.colors.surfaceContainerLowest,
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  footerPrompt: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
  },
  footerLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.7,
  },
  pressed: {
    opacity: 0.9,
  },
});
