import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-context";
import { useI18n } from "../../features/i18n/i18n-context";
import { getUserImageUrl } from "../../lib/api/user";
import { Icon } from "../ui/Icon";

export function MarketingNavbar({
  cartCount = 0,
  onCartClick,
}: {
  cartCount?: number;
  onCartClick?: () => void;
}) {
  const { isAuthenticated, logout, session } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dashboardPath = useMemo(() => {
    if (!session) return "/login";
    return session.user.role === "ADMIN" ? "/admin/dashboard" : "/app/dashboard";
  }, [session]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function closeMenu() {
      setMenuOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [menuOpen]);

  function handleCartClick() {
    if (onCartClick) {
      onCartClick();
      return;
    }
    navigate("/shop");
  }

  const navItems = [
    { label: t("Features"), href: "/#features", active: location.pathname === "/" && location.hash === "#features" },
    { label: t("Timeline"), href: "/#timeline", active: location.pathname === "/" && location.hash === "#timeline" },
    { label: t("Personalities"), href: "/#voices", active: location.pathname === "/" && location.hash === "#voices" },
    { label: t("FAQ"), href: "/#faq", active: location.pathname === "/" && location.hash === "#faq" },
  ];

  const userLabel = session?.user.name ?? t("PetAI User");
  const initials = userLabel
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const userImageUrl = session?.user.imageUrl
    ? getUserImageUrl(session.user.id, session.user.updatedAt ?? session.user.imageUrl)
    : null;

  return (
    <nav className="fixed left-1/2 top-8 z-50 flex h-16 w-[95%] max-w-7xl -translate-x-1/2 items-center justify-between rounded-full border border-outline-variant/20 bg-surface/30 px-5 shadow-2xl backdrop-blur-xl saturate-180 transition-all duration-500 md:px-10">
      <div className="flex items-center gap-3">
        <Link className="flex items-center gap-3" to="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-[#0f2530] shadow-[0_0_20px_rgba(165,231,255,0.16)]">
            <Icon className="text-[18px]" filled name="pets" />
          </div>
          <span className="text-[24px] font-bold tracking-[-0.06em] text-on-surface">PetAI</span>
        </Link>
      </div>

      <div className="hidden items-center gap-10 md:flex">
        {navItems.map((item) => (
          <a
            className={`font-mono text-[12px] tracking-[0.1em] transition-all duration-300 ease-out ${
              item.active ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
            href={item.href}
            key={item.label}
          >
            {item.label}
          </a>
        ))}
        <Link
          className={`font-mono text-[12px] tracking-[0.1em] transition-all duration-300 ease-out ${
            location.pathname.startsWith("/shop") ? "text-primary" : "text-on-surface-variant hover:text-primary"
          }`}
          to="/shop"
        >
          {t("Shop")}
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-all duration-300 hover:bg-white/5 hover:text-primary"
          onClick={handleCartClick}
          type="button"
        >
          <Icon name="shopping_cart" />
          {cartCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-background">
              {cartCount}
            </span>
          ) : null}
        </button>

        <button
          className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-on-surface-variant transition hover:text-primary"
          onClick={() => setLocale(locale === "vn" ? "en" : "vn")}
          type="button"
        >
          {locale.toUpperCase()}
        </button>

        {isAuthenticated && session ? (
          <div className="relative">
            <button
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5 text-on-surface transition hover:bg-white/[0.06]"
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              {userImageUrl ? (
                <img
                  alt={session.user.name}
                  className="h-9 w-9 rounded-full border border-white/10 object-cover"
                  src={userImageUrl}
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {initials || <Icon className="text-[18px]" name="person" />}
                </div>
              )}
              <div className="hidden pr-1 text-left sm:block">
                <div className="max-w-[120px] truncate text-sm font-semibold">{session.user.name}</div>
              </div>
              <Icon className={`hidden text-[18px] text-on-surface-variant transition-transform sm:block ${menuOpen ? "rotate-180" : ""}`} name="expand_more" />
            </button>

            {menuOpen ? (
              <>
                <button
                  aria-label="Close user menu"
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setMenuOpen(false)}
                  type="button"
                />
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 rounded-3xl border border-white/10 bg-[#1b1a1b]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  <div className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3">
                    <div className="truncate text-sm font-semibold text-on-surface">{session.user.name}</div>
                    <div className="truncate text-xs text-on-surface-variant">{session.user.email}</div>
                  </div>
                  <button
                    className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-on-surface transition hover:bg-white/[0.04]"
                    onClick={() => navigate(dashboardPath)}
                    type="button"
                  >
                    <Icon className="text-[18px]" name="dashboard" />
                    {t("Dashboard")}
                  </button>
                  <button
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-on-surface transition hover:bg-white/[0.04]"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    type="button"
                  >
                    <Icon className="text-[18px]" name="logout" />
                    {t("Logout")}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <>
            <Link
              className="hidden font-mono text-[13px] text-on-surface-variant transition-colors hover:text-primary sm:block"
              to="/login"
            >
              {t("Login")}
            </Link>
            <Link
              className="rounded-full bg-primary-container px-6 py-2 text-[12px] font-bold text-on-primary-container shadow-[0_0_24px_rgba(0,210,255,0.18)] transition-all hover:scale-[1.02]"
              to="/register"
            >
              {t("Adopt PetAI")}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
