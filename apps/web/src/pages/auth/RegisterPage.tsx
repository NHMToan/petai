import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthInput } from "../../components/forms/AuthInput";
import { AuthSplitLayout } from "../../components/layout/AuthSplitLayout";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../features/auth/auth-context";
import { useI18n } from "../../features/i18n/i18n-context";
import { getApiErrorMessage } from "../../lib/api/errors";

export function RegisterPage() {
  const { t } = useI18n();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("hello@petai.io");
  const [password, setPassword] = useState("demo1234");
  const [confirmPassword, setConfirmPassword] = useState("demo1234");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await register(name, email, password);
      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to create account right now."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      imageUrl="https://lh3.googleusercontent.com/aida/ADBb0ugkblfUXdiymexi0KyeLvKbdev3v3v3lG-m3fQ-yP15cmdH-2l4yTJ18cKoEbOPoHvOeih5x3KsXIak6MlduS5TGqjvLlmwDuM5osMv-STWgEjbTUpDBCs3uBXMKaPCywzuIUePWitQHprv9AiDSR6d-f7VcSilaT_OK2qsMPJ3gZ-tGnBTbE3N7j4XJ5Z_lIWQa-acnZ-KvmCJD7cJlOyG9jnGjQ_fqWW_Ujjr6F7Ul0WMQvnaGCQd8qRj"
      subtitle={t("Start your journey with an AI companion that grows with you.")}
      title={t("Create your PetAI account")}
    >
      <p className="mb-8 text-on-surface-variant">The exported Stitch registration flow is now connected to real app state and routing.</p>
      <form className="space-y-5" onSubmit={onSubmit}>
        <AuthInput icon="person" label="FULL NAME" onChange={(e) => setName(e.target.value)} value={name} />
        <AuthInput icon="mail" label="EMAIL ADDRESS" onChange={(e) => setEmail(e.target.value)} type="email" value={email} />
        <div className="grid gap-4 md:grid-cols-2">
          <AuthInput icon="lock" label="PASSWORD" onChange={(e) => setPassword(e.target.value)} type="password" value={password} />
          <AuthInput icon="security" label="CONFIRM" onChange={(e) => setConfirmPassword(e.target.value)} type="password" value={confirmPassword} />
        </div>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <button className="w-full rounded-xl bg-on-surface py-4 font-bold text-background transition hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]" disabled={submitting} type="submit">
          <span className="inline-flex items-center gap-2">
            {submitting ? t("Creating Account...") : t("Create Account")}
            <Icon name="arrow_forward" />
          </span>
        </button>
      </form>
      <div className="mt-8 text-sm text-on-surface-variant">
        {t("Already have an account?")} <Link className="text-primary" to="/login">{t("Login")}</Link>
      </div>
    </AuthSplitLayout>
  );
}
