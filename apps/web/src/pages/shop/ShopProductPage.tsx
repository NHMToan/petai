import { Navigate, useParams } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { getShopProductBySlug } from "../../data/shop";
import { useI18n } from "../../features/i18n/i18n-context";
import { localizeShopProduct } from "../../features/i18n/shop-localization";
import { formatVndFromUsd } from "../../lib/currency";
import { getProductImageUrl } from "../../lib/product-image";
import { useShop } from "./ShopLayout";

export function ShopProductPage() {
  const { locale, t } = useI18n();
  const { productId = "" } = useParams();
  const { addToCart, products } = useShop();
  const product = getShopProductBySlug(products, productId);

  if (!product) {
    return <Navigate replace to="/shop" />;
  }

  const localizedProduct = localizeShopProduct(product, locale);

  const mainImage =
    getProductImageUrl(localizedProduct.id, localizedProduct.updatedAt, localizedProduct.imageKey) ??
    localizedProduct.gallery[0] ??
    localizedProduct.heroImage;
  const gallery = [
    mainImage,
    ...localizedProduct.gallery.filter((image) => image !== mainImage),
  ].slice(0, 4);

  return (
    <main className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-[160px] pt-24">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute right-[-10rem] top-1/2 h-80 w-80 rounded-full bg-secondary/10 blur-[100px]" />

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="glass-card relative overflow-hidden rounded-xl">
            <div className="noise-overlay absolute inset-0" />
            <img
              alt={localizedProduct.name}
              className="relative z-10 h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
              src={mainImage}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {gallery.map((image, index) => (
              <div
                className={`aspect-square overflow-hidden rounded-lg border ${index === 0 ? "border-primary/40 ring-1 ring-primary/40" : "border-transparent"} glass-card`}
                key={`${localizedProduct.id}-${index}`}
              >
                <img
                  alt={`${localizedProduct.name} ${index + 1}`}
                  className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
                  src={image}
                />
              </div>
            ))}
            <div className="glass-card flex aspect-square items-center justify-center rounded-lg">
              <Icon className="text-4xl text-primary" name="videocam" />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-on-secondary-container">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                {localizedProduct.badge}
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-on-surface-variant">
                {localizedProduct.tagline}
              </span>
            </div>
            <h1 className="text-[48px] font-semibold tracking-[-0.02em]">
              {localizedProduct.name}
            </h1>
            <p className="text-[80px] font-bold leading-none tracking-[-0.04em] text-primary">
              {formatVndFromUsd(localizedProduct.price, locale === "vn" ? "vi-VN" : "en-US")}
            </p>
          </div>

          <div className="glass-card space-y-4 rounded-xl p-8">
            <p className="text-[20px] leading-[1.6] text-on-surface-variant">
              {localizedProduct.longDescription}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {localizedProduct.specs.map((spec) => (
                <div className="flex items-start gap-3" key={spec.label}>
                  <Icon className="text-primary" name={spec.icon} />
                  <div>
                    <h4 className="font-mono text-[12px] uppercase tracking-[0.12em] text-on-surface">
                      {spec.label}
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="glass-card flex items-center rounded-full border border-white/10 px-4 py-3">
                <span className="w-12 text-center font-mono text-lg text-on-surface">
                  1
                </span>
              </div>
              <button
                className="flex-1 rounded-full border border-white/10 bg-surface-container-highest/50 py-4 font-semibold text-on-surface transition-all duration-300 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(165,231,255,0.3)]"
                onClick={() => addToCart(localizedProduct)}
                type="button"
              >
                {t("Add to Cart")}
              </button>
            </div>
            <button
              className="w-full rounded-full bg-on-surface py-5 font-bold text-background transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              onClick={() => addToCart(localizedProduct)}
              type="button"
            >
              {t("Buy Now")}
            </button>
          </div>

          <div className="flex justify-between gap-8 border-t border-white/5 pt-8">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Icon className="text-sm" name="verified_user" />
                <span className="font-mono text-[12px] uppercase tracking-[0.12em]">
                {t("2-Year Warranty")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Icon className="text-sm" name="local_shipping" />
              <span className="font-mono text-[12px] uppercase tracking-[0.12em]">
                {t("Free Express Shipping")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <section className="mt-[160px]">
        <h2 className="mb-8 text-center text-[48px] font-semibold tracking-[-0.02em]">
          {t("Neural Specifications")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {product.specs.slice(0, 3).map((spec) => (
            <div
              className="glass-card rounded-xl border-l-2 border-primary p-8"
              key={`panel-${spec.label}`}
            >
              <h3 className="mb-2 font-mono text-[12px] uppercase tracking-[0.16em] text-primary">
                {spec.label}
              </h3>
              <p className="text-on-surface-variant">
                {spec.value}. Optimized for the PetAI ecosystem and
                stitch-consistent hardware experience.
              </p>
            </div>
          ))}
        </div>
      </section> */}
    </main>
  );
}
