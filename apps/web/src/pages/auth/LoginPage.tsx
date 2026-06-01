import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthInput } from "../../components/forms/AuthInput";
import { AuthSplitLayout } from "../../components/layout/AuthSplitLayout";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../features/auth/auth-context";
import { useI18n } from "../../features/i18n/i18n-context";
import { getApiErrorMessage } from "../../lib/api/errors";

export function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("alex@petai.io");
  const [password, setPassword] = useState("demo1234");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const session = await login(email, password);
      const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      const defaultPath = session.user.role === "ADMIN" ? "/admin/dashboard" : "/app/dashboard";
      const nextPath =
        session.user.role === "ADMIN"
          ? requestedPath?.startsWith("/admin/")
            ? requestedPath
            : defaultPath
          : requestedPath?.startsWith("/app/")
            ? requestedPath
            : defaultPath;
      navigate(nextPath, { replace: true });
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to log in right now."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBaXAE6B0CiatMX38NpfIsZWbzwoDBSTKxBhWV2rT-uM0j2fBpJMSUf4KoL53BJm0l3LH8IZj7wpFpATfE6c5gjC-MYN8387Bf-D2VLdzcLX4Vo-phJPtaLw9NcA9cOPUTKVM99l836lspnEZ6OklgFZlOldxzJT3KFwkGEklDT-x60ikHzpdq6ncloLs8HljubQGiW_EhP1lvu2Fk8sxPgCFfhwd6U0y0_7KnLNmgIpHXI8ztWovTLZHIMI2OZrUNUQ9gz6QZzlyUA"
      subtitle="Your AI companion that truly feels alive."
      title={t("Welcome back")}
    >
      <p className="mb-8 text-on-surface-variant">{t("Log in to manage your AI pet companion.")}</p>
      <form className="space-y-6" onSubmit={onSubmit}>
        <AuthInput icon="alternate_email" label="EMAIL ADDRESS" onChange={(e) => setEmail(e.target.value)} type="email" value={email} />
        <AuthInput icon="lock" label="PASSWORD" onChange={(e) => setPassword(e.target.value)} type="password" value={password} />
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <button className="w-full rounded-xl bg-primary py-4 font-bold text-on-primary-fixed transition hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]" disabled={submitting} type="submit">
          <span className="inline-flex items-center gap-2">
            {submitting ? t("Logging in...") : t("Login")}
            <Icon name="arrow_forward" />
          </span>
        </button>
      </form>
      <div className="mt-8 flex items-center justify-between text-sm text-on-surface-variant">
        <span>{t("Use `admin@petai.io` to enter admin mode.")}</span>
        <Link className="text-primary" to="/register">
          {t("Register")}
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
