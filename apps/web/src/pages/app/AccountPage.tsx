import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Icon } from "../../components/ui/Icon";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatePanel } from "../../components/ui/StatePanel";
import { useAuth } from "../../features/auth/auth-context";
import { useI18n } from "../../features/i18n/i18n-context";
import {
  changeCurrentUserPassword,
  fetchCurrentUser,
  getUserImageUrl,
  updateCurrentUserProfile,
  uploadCurrentUserImage,
} from "../../lib/api/user";
import { getApiErrorMessage } from "../../lib/api/errors";
import type { UserProfile } from "../../types";

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function AccountPage() {
  const { t } = useI18n();
  const { session, updateSessionUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        setProfile(data);
        setName(data.name);
      })
      .catch((nextError) => setError(getApiErrorMessage(nextError, t("Unable to load your account."))))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmitProfile(event: FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateCurrentUserProfile({ name });
      setProfile(updated);
      updateSessionUser({ name: updated.name, imageUrl: updated.imageUrl ?? null, updatedAt: updated.updatedAt });
      setSuccess(t("Profile updated."));
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, t("Unable to update your profile.")));
    } finally {
      setSavingProfile(false);
    }
  }

  async function onSubmitPassword(event: FormEvent) {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError(t("New password and confirmation do not match."));
      setSuccess(null);
      return;
    }

    setSavingPassword(true);
    setError(null);
    setSuccess(null);

    try {
      await changeCurrentUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(emptyPasswordForm);
      setSuccess(t("Password changed."));
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, t("Unable to change password.")));
    } finally {
      setSavingPassword(false);
    }
  }

  async function onUploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await uploadCurrentUserImage(file);
      setProfile(updated);
      updateSessionUser({ name: updated.name, imageUrl: updated.imageUrl ?? null, updatedAt: updated.updatedAt });
      setSuccess(t("Profile image uploaded."));
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, t("Unable to upload profile image.")));
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  const avatarFallback = session?.user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const avatarSrc = profile?.imageUrl ? getUserImageUrl(profile.id, profile.updatedAt ?? profile.imageUrl) : null;

  return (
    <div>
      <PageHeader
        description="Manage your PetAI owner profile, secure your account, and personalize the image shown across the app."
        title={t("Account")}
      />
      {loading ? <StatePanel message={t("Loading your account profile.")} title={t("Loading account")} /> : null}
      {error ? <div className="mb-6"><StatePanel message={error} title={t("Could not update account")} tone="error" /></div> : null}
      {success ? <div className="mb-6"><StatePanel message={success} title={t("Saved")} /></div> : null}

      {!loading ? (
        <div className="grid gap-8 lg:grid-cols-12">
          <GlassCard className="min-h-[58rem] bg-[linear-gradient(145deg,rgba(165,231,255,0.06)_0%,rgba(255,255,255,0.02)_24%,rgba(255,255,255,0.01)_100%)] p-10 text-center lg:col-span-4">
            <div className="mx-auto flex max-w-[18rem] flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-[-2.5rem] rounded-full bg-primary/10 blur-[36px]" />
                {avatarSrc ? (
                  <img
                    alt={profile?.name ?? session?.user.name ?? "User avatar"}
                    className="relative h-44 w-44 rounded-full border border-primary/20 object-cover shadow-[0_0_30px_rgba(165,231,255,0.12)]"
                    src={avatarSrc}
                  />
                ) : (
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-primary/20 bg-[radial-gradient(circle_at_35%_30%,rgba(165,231,255,0.14),rgba(165,231,255,0.03)_45%,rgba(15,17,20,0.92)_100%)] text-4xl font-bold text-primary shadow-[0_0_30px_rgba(165,231,255,0.12)]">
                    {avatarFallback || "PA"}
                  </div>
                )}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15">
                <Icon name="upload" />
                {uploadingImage ? t("Uploading...") : t("Upload Profile Image")}
                <input accept="image/*" className="hidden" disabled={uploadingImage} onChange={onUploadImage} type="file" />
              </label>

              <h2 className="mt-8 text-[3rem] font-bold leading-none tracking-tight">{profile?.name ?? session?.user.name}</h2>
              <p className="mt-4 text-[1.05rem] text-on-surface-variant">{profile?.email ?? session?.user.email}</p>
              <p className="mono-label mt-5 text-primary">{profile?.role ?? session?.user.role}</p>
            </div>

            <div className="mt-10 space-y-5 border-t border-white/8 pt-10 text-left">
              {[
                ["Member Since", profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"],
                ["Account Type", profile?.role ?? session?.user.role ?? "USER"],
                ["Security", "Password Protected"],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between" key={label}>
                  <span className="text-[1.05rem] text-on-surface-variant">{label}</span>
                  <span className="text-[1.05rem] font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="space-y-8 lg:col-span-8">
            <GlassCard className="bg-[linear-gradient(145deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0.015)_100%)] p-10">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="badge" />
                </div>
                <div>
                  <h3 className="text-[2rem] font-bold tracking-tight">{t("Profile Details")}</h3>
                  <p className="text-[1.05rem] text-on-surface-variant">Update the display name shown across your PetAI experience.</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={onSubmitProfile}>
                <label className="block">
                  <span className="mono-label mb-2 block text-on-surface-variant">Display Name</span>
                  <input className="field" onChange={(event) => setName(event.target.value)} value={name} />
                </label>
                <label className="block">
                  <span className="mono-label mb-2 block text-on-surface-variant">Email</span>
                  <input className="field" readOnly value={profile?.email ?? session?.user.email ?? ""} />
                </label>
                <button className="btn-primary rounded-2xl px-7 py-4 text-base" disabled={savingProfile} type="submit">
                  <Icon name="save" />
                  {savingProfile ? t("Saving...") : t("Save Profile")}
                </button>
              </form>
            </GlassCard>

            <GlassCard className="bg-[linear-gradient(145deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_58%,rgba(108,4,202,0.12)_100%)] p-10">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="lock" />
                </div>
                <div>
                  <h3 className="text-[2rem] font-bold tracking-tight">{t("Change Password")}</h3>
                  <p className="text-[1.05rem] text-on-surface-variant">Keep your owner account secure with a fresh password.</p>
                </div>
              </div>

              <form className="space-y-7" onSubmit={onSubmitPassword}>
                <label className="block">
                    <span className="mono-label mb-2 block text-on-surface-variant">{t("Current Password")}</span>
                  <input
                    className="field"
                    onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                    type="password"
                    value={passwordForm.currentPassword}
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mono-label mb-2 block text-on-surface-variant">{t("New Password")}</span>
                    <input
                      className="field"
                      onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                      type="password"
                      value={passwordForm.newPassword}
                    />
                  </label>
                  <label className="block">
                    <span className="mono-label mb-2 block text-on-surface-variant">{t("Confirm Password")}</span>
                    <input
                      className="field"
                      onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                      type="password"
                      value={passwordForm.confirmPassword}
                    />
                  </label>
                </div>
                <button className="btn-primary rounded-2xl px-7 py-4 text-base" disabled={savingPassword} type="submit">
                  <Icon name="key" />
                  {savingPassword ? t("Updating...") : t("Change Password")}
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      ) : null}
    </div>
  );
}
