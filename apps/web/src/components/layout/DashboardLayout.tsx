import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-context";
import { useI18n } from "../../features/i18n/i18n-context";
import { getUserImageUrl } from "../../lib/api/user";
import type { NavItem, Role } from "../../types";
import { Icon } from "../ui/Icon";

function SidebarLink({
  item,
  label,
  onClick,
}: {
  item: NavItem;
  label: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-4 py-3 transition",
          isActive
            ? "border-r-2 border-primary bg-primary/10 font-semibold text-primary"
            : "text-on-surface-variant hover:bg-white/[0.03] hover:text-on-surface",
        ].join(" ")
      }
      onClick={onClick}
      to={item.to}
    >
      <Icon filled={false} name={item.icon} />
      <span>{label}</span>
    </NavLink>
  );
}

export function DashboardLayout({
  role,
  navItems,
  title,
  systemLabel,
}: {
  role: Role;
  navItems: NavItem[];
  title: string;
  systemLabel: string;
}) {
  const { session, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const isUserLayout = role === "USER";
  const initials =
    session?.user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PA";
  const userImage = session?.user.imageUrl ? getUserImageUrl(session.user.id, session.user.updatedAt ?? session.user.imageUrl) : null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <div className="noise-overlay" />
      {isUserLayout ? (
        <>
          <div className="pointer-events-none fixed left-[-12%] top-[-8%] z-0 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[150px]" />
          <div className="pointer-events-none fixed bottom-[-18%] right-[-8%] z-0 h-[38rem] w-[38rem] rounded-full bg-secondary-container/55 blur-[160px]" />
        </>
      ) : null}
      <aside
        className={[
          isUserLayout
            ? "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-outline-variant bg-surface/30 py-stack-lg shadow-xl backdrop-blur-xl transition-transform"
            : "fixed inset-y-0 left-0 z-50 w-64 border-r border-outline-variant bg-surface-container-lowest/95 px-4 py-gutter backdrop-blur-xl transition-transform",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div
          className={
            isUserLayout ? "mb-10 flex items-center gap-3 px-6" : "mb-10 px-2"
          }
        >
          <div className="mb-2 flex items-center gap-3">
            <div
              className={[
                "flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-background",
                isUserLayout
                  ? "bg-[radial-gradient(circle_at_35%_30%,rgba(95,238,255,0.32),transparent_36%),linear-gradient(135deg,#051319_0%,#102c3a_52%,#04070b_100%)] shadow-[0_0_24px_rgba(71,214,255,0.22)]"
                  : "bg-primary",
              ].join(" ")}
            >
              <Icon
                filled
                className="text-xl"
                name={isUserLayout ? "deployed_code" : "pets"}
              />
            </div>
            <div className="flex flex-col">
              <h1
                className={
                  isUserLayout
                    ? "text-xl font-bold tracking-tight text-on-surface"
                    : "text-3xl font-bold tracking-tight text-primary"
                }
              >
                PetAI
              </h1>
              <p
                className={
                  isUserLayout
                    ? "mono-label text-[10px] uppercase tracking-[0.28em] text-on-surface-variant"
                    : "mono-label text-on-surface-variant"
                }
              >
                {title}
              </p>
            </div>
          </div>
        </div>
        <nav className={isUserLayout ? "flex-1 space-y-1 px-4" : "space-y-1"}>
          {navItems.map((item) => (
            <SidebarLink
              item={item}
              key={item.to}
              label={t(item.label)}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
        {isUserLayout ? (
          <>
            {" "}
            <div className="mt-auto px-6">
              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container">
                    <Icon className="text-sm text-secondary" name="bolt" />
                  </div>
                  <div>
                    <p className="mono-label text-[10px] uppercase tracking-[0.24em] text-outline">
                      {t("System Status")}
                    </p>
                    <p className="text-xs font-bold text-on-surface">
                      {t("Connected")}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="btn-secondary mt-4 w-full"
                onClick={logout}
                type="button"
              >
                <Icon name="logout" />
                {t("Logout")}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-8 rounded-2xl border border-outline-variant/30 bg-white/[0.03] p-4">
              <p className="mono-label mb-1 text-primary">{systemLabel}</p>
              <p className="text-sm font-semibold text-on-surface">
                {session?.user.name}
              </p>
              <p className="text-xs text-on-surface-variant">
                {session?.user.email}
              </p>
            </div>
            <button
              className="btn-secondary mt-4 w-full"
              onClick={logout}
              type="button"
            >
              <Icon name="logout" />
              {t("Logout")}
            </button>
          </>
        )}
      </aside>

      {open ? (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          type="button"
        />
      ) : null}

      <div className="md:ml-64">
        <header
          className={[
            "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/20 px-container-padding backdrop-blur-xl",
            isUserLayout ? "bg-surface/10" : "bg-surface/50",
          ].join(" ")}
        >
          <div className="flex items-center gap-4">
            <button
              className="icon-button md:hidden"
              onClick={() => setOpen(true)}
              type="button"
            >
              <Icon name="menu" />
            </button>
            {isUserLayout ? (
              <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                {t("PetAI Dashboard")}
              </h1>
            ) : (
              <div className="hidden items-center gap-3 rounded-full border border-outline-variant/20 bg-black/40 px-4 py-2 lg:flex">
                <Icon
                  className="text-sm text-on-surface-variant"
                  name="search"
                />
                <input
                  className="w-72 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant"
                  placeholder={t("Search systems...")}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-on-surface-variant transition hover:text-primary"
              onClick={() => setLocale(locale === "vn" ? "en" : "vn")}
              type="button"
            >
              {locale.toUpperCase()}
            </button>
            <button className="icon-button" type="button">
              <Icon name="notifications" />
            </button>
            <button className="icon-button" type="button">
              <Icon name="sensors" />
            </button>
            <button className="icon-button" type="button">
              <Icon name="help" />
            </button>
            {isUserLayout ? (
              userImage ? (
                <img
                  alt={session?.user.name ?? "User avatar"}
                  className="h-8 w-8 rounded-full border border-primary/20 object-cover"
                  src={userImage}
                />
              ) : (
                <button
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-[linear-gradient(135deg,#1b3341_0%,#0a0f16_100%)] text-[10px] font-semibold text-primary"
                  type="button"
                >
                  {initials}
                </button>
              )
            ) : (
              <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-white/[0.03] px-3 py-1.5 md:flex">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                <span className="mono-label text-primary">{t("ONLINE")}</span>
              </div>
            )}
          </div>
        </header>
        <main className="relative z-10 px-6 py-8 md:px-container-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
