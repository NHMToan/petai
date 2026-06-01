import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import type { AuthStackParamList } from "@/navigation/types";
import { authStore } from "@/store/authStore";
import { theme } from "@/theme/theme";
import { useI18n } from "@/i18n/useI18n";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { t } = useI18n();
  const [email, setEmail] = useState("hello@petai.io");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, loading } = authStore();

  async function handleLogin() {
    try {
      setError(null);
      await signIn({ email, password });
    } catch {
      setError(t("Unable to sign in right now."));
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View pointerEvents="none" style={[styles.glow, styles.glowTop]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom]} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <View style={styles.brandGlow} />
            <Text style={styles.brand}>PetAI</Text>
          </View>
          <Text style={styles.title}>{t("Welcome Back")}</Text>
          <Text style={styles.subtitle}>{t("Sign in to continue your journey")}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>{t("Email Address")}</Text>
            <View style={styles.inputShell}>
              <MaterialIcons color="rgba(187,201,207,0.62)" name="mail-outline" size={20} />
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor="rgba(187,201,207,0.3)"
                style={styles.input}
                value={email}
              />
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>{t("Password")}</Text>
              <Text style={styles.inlineLink}>{t("Forgot Password?")}</Text>
            </View>
            <View style={styles.inputShell}>
              <MaterialIcons color="rgba(187,201,207,0.62)" name="lock-outline" size={20} />
              <TextInput
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(187,201,207,0.3)"
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

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            disabled={loading}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              loading && styles.primaryButtonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>{loading ? t("Saving...") : t("Sign In")}</Text>
            <MaterialIcons color={theme.colors.surfaceContainerLowest} name="arrow-forward" size={20} />
          </Pressable>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t("OR CONTINUE WITH")}</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={styles.socialButton}>
            <Ionicons color={theme.colors.onSurface} name="logo-google" size={18} />
            <Text style={styles.socialText}>GOOGLE</Text>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Ionicons color={theme.colors.onSurface} name="logo-apple" size={18} />
            <Text style={styles.socialText}>APPLE</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t("Don't have an account?")}{" "}
            <Text onPress={() => navigation.navigate("Register")} style={styles.footerLink}>
              {t("RegisterNow")}
            </Text>
          </Text>
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
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: "rgba(71,214,255,0.08)",
  },
  glowTop: {
    top: -80,
    right: -80,
  },
  glowBottom: {
    left: -120,
    bottom: -60,
    backgroundColor: "rgba(217,185,255,0.07)",
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  brandWrap: {
    marginBottom: theme.spacing.md,
    position: "relative",
  },
  brandGlow: {
    position: "absolute",
    top: -18,
    right: -18,
    bottom: -18,
    left: -18,
    borderRadius: theme.radii.full,
    backgroundColor: "rgba(0,210,255,0.16)",
    opacity: 0.65,
  },
  brand: {
    color: theme.colors.primary,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1,
  },
  title: {
    color: theme.colors.onSurface,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "600",
    letterSpacing: -0.7,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    opacity: 0.82,
    textAlign: "center",
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
    textTransform: "uppercase",
    marginLeft: 4,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  inlineLink: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  inputShell: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "rgba(14,14,14,0.9)",
    borderWidth: 1,
    borderColor: "rgba(60,73,78,0.45)",
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
  error: {
    color: theme.colors.error,
    fontSize: 14,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: theme.colors.onSurface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: theme.spacing.md,
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(60,73,78,0.35)",
  },
  dividerText: {
    color: "rgba(187,201,207,0.45)",
    fontSize: 11,
    letterSpacing: 1.7,
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  socialButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  socialText: {
    color: theme.colors.onSurface,
    fontSize: 11,
    letterSpacing: 1.7,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingTop: theme.spacing.xl,
  },
  footerText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
});
