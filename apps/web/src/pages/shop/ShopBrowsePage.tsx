import { Link } from "react-router-dom";
import { ProductCard } from "../../components/shop/ProductCard";
import { Icon } from "../../components/ui/Icon";
import { getShopProductBySlug } from "../../data/shop";
import { useI18n } from "../../features/i18n/i18n-context";
import { localizeShopProduct } from "../../features/i18n/shop-localization";
import { formatVndFromUsd } from "../../lib/currency";
import { getProductImageUrl } from "../../lib/product-image";
import { useShop } from "./ShopLayout";

export function ShopBrowsePage() {
  const { locale, t } = useI18n();
  const { addToCart, products, openCart } = useShop();
  const starterKit =
    getShopProductBySlug(products, "starter-kit") ?? products[0];
  const companions = products.filter(
    (product) => product.slug !== "starter-kit",
  );
  const starterImage = starterKit
    ? (getProductImageUrl(
        starterKit.id,
        starterKit.updatedAt,
        starterKit.imageKey,
      ) ?? starterKit.heroImage)
    : "";
  const localizedStarterKit = starterKit ? localizeShopProduct(starterKit, locale) : null;

  return (
    <div className="relative">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-24 pt-20">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2">
          <div className="z-10">
            <div className="glass-card mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1">
              <div className="heartbeat h-2 w-2 rounded-full bg-primary" />
              <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-primary">
                {t("Pre-Order Now")}
              </span>
            </div>
            <h1 className="mb-4 max-w-lg text-[48px] font-bold leading-[1.1] tracking-[-0.04em] md:text-[80px]">
              {t("Choose your AI companion.")}
            </h1>
            <p className="mb-8 max-w-md text-[20px] leading-[1.6] text-on-surface-variant">
              {t(
                "Pick a PetAI device, customize its personality, and bring it to life with our neural core technology.",
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="rounded-xl bg-on-surface px-8 py-4 font-bold text-background transition-all duration-300 hover:shadow-[0_0_20px_rgba(165,231,255,0.4)]"
                href="#collection"
              >
                {t("Shop Collection")}
              </a>
              <button
                className="glass-card rounded-xl px-8 py-4 font-bold transition-all duration-300 hover:bg-white/10"
                type="button"
              >
                {t("Watch Launch Film")}
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:h-[800px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-50 blur-3xl" />
            <img
              alt="PetAI Companions"
              className="relative z-10 h-auto w-full rounded-3xl object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOSy2ZCUa9m6vJ5SCv1s2_YbwXiYNkt6e3ptwKxrHmNIZgvecggzM4RNg5k1gvWCJEP8mE1Rf5UrxX8ISTTYlzzUC4-79CBT2jbW4pN9RRtQg16Ok9dJFanDDa60L9P3SUQYqeeyJOt9VJqbR8nSLUSqK2Yr8J-AAC3o0LvkgricRA3vsZL62otaAMXyR5OFfYccfuVRNEA4oXWuUntPwwhBxxTtiP3MJRFfF4HZEmfHcs60bV4NlAT8VtVOvmBLq-5sutvfZq1unM"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[80px]" id="collection">
        <div className="mb-[80px] flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-[48px] font-semibold tracking-[-0.02em]">
              {t("Neural Plush Line")}
            </h2>
            <p className="max-w-md text-on-surface-variant">
              {t("Hand-crafted synthetic fibers embedded with touch-sensitive neural arrays.")}
            </p>
          </div>
          <div className="glass-card flex items-center gap-3 rounded-xl p-4">
            <Icon className="text-primary" name="auto_awesome" />
            <span className="font-mono text-[12px] uppercase tracking-[0.16em]">
              {t("AI Integrated")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companions.map((product) => (
            <ProductCard
              key={product.id}
              onAddToCart={addToCart}
              product={product}
            />
          ))}
        </div>
      </section>

      {starterKit && localizedStarterKit ? (
        <section className="overflow-hidden px-6 py-[160px]">
          <div className="glass-card relative mx-auto max-w-7xl rounded-[40px] p-8 lg:p-20">
            <div className="noise-overlay absolute inset-0" />
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-primary">
                  {t("The Essential Experience")}
                </div>
                <h2 className="mb-4 text-[48px] font-semibold tracking-[-0.02em]">
                  {localizedStarterKit.name}
                </h2>
                <p className="mb-8 text-[20px] leading-[1.6] text-on-surface-variant">
                  {localizedStarterKit.description}
                </p>
                <div className="mb-8 space-y-4">
                  {localizedStarterKit.specs.slice(0, 3).map((spec) => (
                    <div className="flex items-center gap-4" key={spec.label}>
                      <span className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Icon name={spec.icon} />
                      </span>
                      <span>{spec.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-[48px] font-bold text-primary">
                    {formatVndFromUsd(
                      localizedStarterKit.price,
                      locale === "vn" ? "vi-VN" : "en-US",
                    )}
                  </div>
                  <div className="flex flex-1 gap-3">
                    <button
                      className="grow rounded-xl bg-on-surface px-8 py-4 font-bold text-background transition hover:opacity-90"
                      onClick={() => addToCart(localizedStarterKit)}
                      type="button"
                    >
                      {t("Configure Bundle")}
                    </button>
                    <button
                      className="rounded-xl border border-white/10 px-5 py-4 text-on-surface-variant transition hover:bg-white/[0.04]"
                      onClick={openCart}
                      type="button"
                    >
                      {t("Cart")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-secondary/10 blur-3xl" />
                <Link className="block" to={`/shop/${starterKit.slug}`}>
                  <img
                    alt={localizedStarterKit.name}
                    className="relative z-10 w-full rounded-[28px] object-cover"
                    src={starterImage}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
