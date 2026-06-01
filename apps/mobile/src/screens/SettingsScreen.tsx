import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { changeCurrentUserPassword, fetchCurrentUser, updateCurrentUserProfile, type UserProfile } from "@/api/user";
import { GradientCard } from "@/components/GradientCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useI18n } from "@/i18n/useI18n";
import { authStore } from "@/store/authStore";
import { theme } from "@/theme/theme";

export function SettingsScreen() {
  const { t, locale, setLocale } = useI18n();
  const { session, signOut, updateSessionUser } = authStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchCurrentUser()
      .then((data) => {
        if (!mounted) return;
        setProfile(data);
        setName(data.name);
      })
      .catch(() => {
        if (!mounted) return;
        setError(t("Unable to load your account."));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  async function handleSaveProfile() {
    setSavingProfile(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateCurrentUserProfile({ name });
      setProfile(updated);
      updateSessionUser({ name: updated.name, imageUrl: updated.imageUrl ?? null });
      setSuccess(t("Profile updated."));
    } catch {
      setError(t("Unable to update your profile."));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setError(t("New password and confirmation do not match."));
      setSuccess(null);
      return;
    }

    setSavingPassword(true);
    setError(null);
    setSuccess(null);
    try {
      await changeCurrentUserPassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(t("Password changed."));
    } catch {
      setError(t("Unable to change password."));
    } finally {
      setSavingPassword(false);
    }
  }

  const initials =
    (profile?.name ?? session?.user.name ?? "PA")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PA";

  return (
    <Screen
      subtitle={t("Manage your account, app preferences, and companion privacy settings.")}
      title={t("Account")}
    >
      {loading ? <Text style={styles.meta}>{t("Loading account…")}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <GradientCard>
        <Text style={styles.sectionLabel}>{t("ACCOUNT")}</Text>
        <View style={styles.accountTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.accountMeta}>
            <Text style={styles.name}>{profile?.name ?? session?.user.name}</Text>
            <Text style={styles.meta}>{profile?.email ?? session?.user.email}</Text>
            <Text style={styles.role}>{profile?.role ?? session?.user.role}</Text>
          </View>
        </View>
        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("Member Since")}</Text>
            <Text style={styles.infoValue}>
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "--"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("Account Type")}</Text>
            <Text style={styles.infoValue}>{profile?.role ?? session?.user.role ?? "USER"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("Security")}</Text>
            <Text style={styles.infoValue}>{t("Password Protected")}</Text>
          </View>
        </View>
      </GradientCard>

      <GradientCard>
        <Text style={styles.sectionLabel}>{t("PROFILE DETAILS")}</Text>
        <Text style={styles.cardBody}>{t("Update the display name shown across your PetAI experience.")}</Text>
        <Text style={styles.inputLabel}>{t("Display Name")}</Text>
        <TextInput onChangeText={setName} style={styles.input} value={name} />
        <Text style={styles.inputLabel}>{t("Email")}</Text>
        <TextInput editable={false} style={[styles.input, styles.inputDisabled]} value={profile?.email ?? session?.user.email ?? ""} />
        <PrimaryButton
          label={savingProfile ? t("Saving...") : t("Save Profile")}
          loading={savingProfile}
          onPress={handleSaveProfile}
        />
      </GradientCard>

      <GradientCard glow="secondary">
        <Text style={styles.sectionLabel}>{t("CHANGE PASSWORD")}</Text>
        <Text style={styles.cardBody}>{t("Keep your owner account secure with a fresh password.")}</Text>
        <Text style={styles.inputLabel}>{t("Current Password")}</Text>
        <TextInput onChangeText={setCurrentPassword} secureTextEntry style={styles.input} value={currentPassword} />
        <Text style={styles.inputLabel}>{t("New Password")}</Text>
        <TextInput onChangeText={setNewPassword} secureTextEntry style={styles.input} value={newPassword} />
        <Text style={styles.inputLabel}>{t("Confirm Password")}</Text>
        <TextInput onChangeText={setConfirmPassword} secureTextEntry style={styles.input} value={confirmPassword} />
        <PrimaryButton
          label={savingPassword ? t("Updating...") : t("Change Password")}
          loading={savingPassword}
          onPress={handleChangePassword}
        />
      </GradientCard>

      <GradientCard glow="secondary">
        <Text style={styles.sectionLabel}>{t("LANGUAGE")}</Text>
        <Text style={styles.cardBody}>{t("Choose the interface language used across the mobile app.")}</Text>
        <View style={styles.languageRow}>
          <Pressable
            onPress={() => setLocale("en")}
            style={({ pressed }) => [
              styles.languageButton,
              locale === "en" && styles.languageButtonActive,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.languageLabel, locale === "en" && styles.languageLabelActive]}>
              {t("English")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLocale("vn")}
            style={({ pressed }) => [
              styles.languageButton,
              locale === "vn" && styles.languageButtonActive,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.languageLabel, locale === "vn" && styles.languageLabelActive]}>
              {t("Vietnamese")}
            </Text>
          </Pressable>
        </View>
      </GradientCard>

      <PrimaryButton label={t("Sign Out")} onPress={signOut} secondary />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: "700",
    marginBottom: 12,
  },
  accountTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: theme.radii.full,
    backgroundColor: "rgba(165,231,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(165,231,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: "700",
  },
  accountMeta: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: theme.colors.onSurface,
    fontSize: 24,
    fontWeight: "700",
  },
  meta: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    marginTop: 4,
  },
  role: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginTop: 8,
  },
  infoList: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  infoLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
  },
  infoValue: {
    color: theme.colors.onSurface,
    fontSize: 15,
    fontWeight: "600",
  },
  cardBody: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: theme.spacing.sm,
  },
  input: {
    minHeight: 56,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    color: theme.colors.onSurface,
    fontSize: 16,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  inputDisabled: {
    color: theme.colors.onSurfaceVariant,
  },
  languageRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  languageButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  languageButtonActive: {
    borderColor: "rgba(165,231,255,0.28)",
    backgroundColor: "rgba(165,231,255,0.12)",
  },
  languageLabel: {
    color: theme.colors.onSurface,
    fontSize: 15,
    fontWeight: "600",
  },
  languageLabelActive: {
    color: theme.colors.primary,
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
  },
  success: {
    color: theme.colors.success,
    fontSize: 14,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
});
