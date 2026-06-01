import { Link } from "react-router-dom";
import { useI18n } from "../../features/i18n/i18n-context";
import { localizeShopProduct } from "../../features/i18n/shop-localization";
import { formatVndFromUsd } from "../../lib/currency";
import { getProductImageUrl } from "../../lib/product-image";
import type { ShopProduct } from "../../types";

export function ProductCard({
  onAddToCart,
  product,
}: {
  onAddToCart: (product: ShopProduct) => void;
  product: ShopProduct;
}) {
  const { locale, t } = useI18n();
  const localizedProduct = localizeShopProduct(product, locale);
  const imageSrc = getProductImageUrl(localizedProduct.id, localizedProduct.updatedAt, localizedProduct.imageKey) ?? localizedProduct.heroImage;

  return (
    <div className="glass-card group rounded-3xl p-4 overflow-hidden transition-all duration-500 hover:scale-[1.02]">
      <Link className="block" to={`/shop/${localizedProduct.slug}`}>
        <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-surface-container">
          <img
            alt={localizedProduct.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={imageSrc}
          />
          <div className="glass-card absolute right-4 top-4 rounded-full px-3 py-1 font-mono text-[12px] text-primary">
            {formatVndFromUsd(localizedProduct.price, locale === "vn" ? "vi-VN" : "en-US")}
          </div>
        </div>
      </Link>
      <div className="px-2">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">{localizedProduct.tagline}</div>
        <h3 className="mb-1 text-[32px] font-semibold leading-tight tracking-[-0.02em]">{localizedProduct.name}</h3>
        <p className="mb-6 min-h-[78px] text-on-surface-variant">{localizedProduct.shortDescription}</p>
        <div className="flex gap-3">
          <button
            className="flex-1 rounded-xl border border-primary/20 bg-transparent py-4 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-background"
            onClick={() => onAddToCart(localizedProduct)}
            type="button"
          >
            {t("Add to Neural Hub")}
          </button>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 text-on-surface-variant transition hover:bg-white/[0.04] hover:text-on-surface"
            to={`/shop/${localizedProduct.slug}`}
          >
            {t("View")}
          </Link>
        </div>
      </div>
    </div>
  );
}
