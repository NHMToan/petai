import { useEffect, useMemo, useState } from "react";
import type { CartItem } from "../../types";
import { useI18n } from "../../features/i18n/i18n-context";
import { localizeShopProduct } from "../../features/i18n/shop-localization";
import { formatVndFromUsd } from "../../lib/currency";
import { getProductImageUrl } from "../../lib/product-image";
import { createShopOrder } from "../../lib/api/orders";
import { Icon } from "../ui/Icon";

type CheckoutStep = "cart" | "shipping" | "review" | "success";

type CheckoutFormState = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company: string;
  shippingLine1: string;
  shippingLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  note: string;
};

const initialForm: CheckoutFormState = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  company: "",
  shippingLine1: "",
  shippingLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Vietnam",
  note: "",
};

export function CartDrawer({
  clearCart,
  items,
  onClose,
  onDecrement,
  onIncrement,
  onRemove,
  open,
}: {
  clearCart: () => void;
  items: CartItem[];
  onClose: () => void;
  onDecrement: (productId: string) => void;
  onIncrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  open: boolean;
}) {
  const { locale, t } = useI18n();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<CheckoutFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (!open) {
      setStep("cart");
      setError(null);
      setSubmitting(false);
      setOrderNumber(null);
    }
  }, [open]);

  const steps = useMemo(
    () => [
      { key: "cart" as const, label: "Cart", icon: "shopping_bag" },
      { key: "shipping" as const, label: "Shipping", icon: "local_shipping" },
      { key: "review" as const, label: "Review", icon: "payments" },
    ],
    [],
  );

  function updateForm<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateShipping() {
    if (!form.customerName || !form.customerEmail || !form.shippingLine1 || !form.city || !form.country) {
      setError(t("Please complete the customer and shipping information."));
      return false;
    }
    setError(null);
    return true;
  }

  async function submitOrder() {
    if (!validateShipping() || items.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const order = await createShopOrder({
        source: "WEB",
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone || undefined,
        company: form.company || undefined,
        shippingLine1: form.shippingLine1,
        shippingLine2: form.shippingLine2 || undefined,
        city: form.city,
        state: form.state || undefined,
        postalCode: form.postalCode || undefined,
        country: form.country,
        note: form.note || undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productSlug: item.product.slug,
          heroImage: item.product.heroImage,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      });
      setOrderNumber(order.orderNumber);
      setStep("success");
      clearCart();
      setForm(initialForm);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("Unable to place your order right now."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        aria-hidden={!open}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        type="button"
      />
      <aside
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col overflow-hidden border-l border-outline-variant bg-surface-container-highest/80 p-0 shadow-2xl backdrop-blur-[40px] backdrop-saturate-150 transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="noise-overlay absolute inset-0" />
        <div className="relative z-10 flex items-center justify-between border-b border-outline-variant/30 p-6">
          <div>
            <h2 className="text-[24px] font-semibold text-primary">{t("Your Neural Core")}</h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
              {step === "success" ? t("ORDER CONFIRMED") : `${totalItems} ${t("items in cart")}`}
            </p>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>

        {step !== "success" ? (
          <div className="relative z-10 flex items-center justify-between border-b border-outline-variant/10 px-6 py-4">
            {steps.map((currentStep, index) => {
              const activeIndex = steps.findIndex((entry) => entry.key === step);
              const stepIndex = steps.findIndex((entry) => entry.key === currentStep.key);
              const active = stepIndex <= activeIndex;

              return (
                <div className="flex flex-1 items-center" key={currentStep.key}>
                  <div className={`flex flex-col items-center gap-1 ${active ? "" : "opacity-40"}`}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-secondary-container text-on-secondary-container shadow-[0_0_20px_rgba(165,231,255,0.2)]" : "bg-white/5 text-on-surface-variant"}`}>
                      <Icon className="text-[20px]" filled={active} name={currentStep.icon} />
                    </div>
                    <span className={`font-mono text-[10px] uppercase tracking-[0.16em] ${active ? "text-primary" : "text-on-surface-variant"}`}>{t(currentStep.label)}</span>
                  </div>
                  {index < steps.length - 1 ? <div className="mx-2 h-px flex-1 bg-outline-variant" /> : null}
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6">
          {error ? <div className="mb-4 rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}

          {step === "cart" ? (
            <div className="space-y-6">
              {items.length === 0 ? (
                <div className="glass-card rounded-3xl border border-dashed border-white/10 p-8 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04]">
                    <Icon className="text-3xl text-primary" name="shopping_cart" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{t("Your cart is empty")}</h3>
                  <p className="text-on-surface-variant">{t("Choose a neural companion or starter kit to begin building your bundle.")}</p>
                </div>
              ) : (
                items.map((item) => (
                  (() => {
                    const localizedProduct = localizeShopProduct(item.product, locale);
                    return (
                  <div className="rounded-2xl border border-white/5 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.01)_100%)] p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(165,231,255,0.12)]" key={item.product.id}>
                    <div className="flex gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        <img
                          alt={localizedProduct.name}
                          className="h-full w-full object-cover"
                          src={getProductImageUrl(item.product.id, item.product.updatedAt, item.product.imageKey) ?? item.product.heroImage}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-on-surface">{localizedProduct.name}</h3>
                            <p className="mt-1 text-sm text-on-surface-variant">{localizedProduct.tagline}</p>
                          </div>
                          <button className="text-on-surface-variant transition-colors hover:text-error" onClick={() => onRemove(item.product.id)} type="button">
                            <Icon className="text-[18px]" name="delete" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-3 py-1">
                            <button className="transition-colors hover:text-primary" onClick={() => onDecrement(item.product.id)} type="button">
                              <Icon className="text-[16px]" name="remove" />
                            </button>
                            <span className="w-6 text-center font-mono text-sm">{item.quantity}</span>
                            <button className="transition-colors hover:text-primary" onClick={() => onIncrement(item.product.id)} type="button">
                              <Icon className="text-[16px]" name="add" />
                            </button>
                          </div>
                          <span className="font-mono text-primary">{formatVndFromUsd(item.product.price * item.quantity, locale === "vn" ? "vi-VN" : "en-US")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                    );
                  })()
                ))
              )}
            </div>
          ) : null}

          {step === "shipping" ? (
            <div className="space-y-5">
              <div>
                <div className="mono-label mb-2 text-on-surface-variant">{t("CUSTOMER")}</div>
                <div className="grid gap-4">
                  <input className="field" onChange={(event) => updateForm("customerName", event.target.value)} placeholder={t("Full name")} value={form.customerName} />
                  <input className="field" onChange={(event) => updateForm("customerEmail", event.target.value)} placeholder={t("Email address")} value={form.customerEmail} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input className="field" onChange={(event) => updateForm("customerPhone", event.target.value)} placeholder={t("Phone number")} value={form.customerPhone} />
                    <input className="field" onChange={(event) => updateForm("company", event.target.value)} placeholder={t("Company (optional)")} value={form.company} />
                  </div>
                </div>
              </div>

              <div>
                <div className="mono-label mb-2 text-on-surface-variant">{t("SHIPPING")}</div>
                <div className="grid gap-4">
                  <input className="field" onChange={(event) => updateForm("shippingLine1", event.target.value)} placeholder={t("Street address")} value={form.shippingLine1} />
                  <input className="field" onChange={(event) => updateForm("shippingLine2", event.target.value)} placeholder={t("Apartment, suite, building (optional)")} value={form.shippingLine2} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input className="field" onChange={(event) => updateForm("city", event.target.value)} placeholder={t("City")} value={form.city} />
                    <input className="field" onChange={(event) => updateForm("state", event.target.value)} placeholder={t("State / Province")} value={form.state} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input className="field" onChange={(event) => updateForm("postalCode", event.target.value)} placeholder={t("Postal code")} value={form.postalCode} />
                    <input className="field" onChange={(event) => updateForm("country", event.target.value)} placeholder={t("Country")} value={form.country} />
                  </div>
                  <textarea className="field min-h-28 resize-none" onChange={(event) => updateForm("note", event.target.value)} placeholder={t("Order note (optional)")} value={form.note} />
                </div>
              </div>
            </div>
          ) : null}

          {step === "review" ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                <div className="mono-label mb-3 text-primary">{t("CUSTOMER SUMMARY")}</div>
                <div className="space-y-2 text-sm text-on-surface-variant">
                  <div><span className="text-on-surface">{form.customerName}</span> · {form.customerEmail}</div>
                  {form.customerPhone ? <div>{form.customerPhone}</div> : null}
                  <div>{[form.shippingLine1, form.shippingLine2, form.city, form.state, form.postalCode, form.country].filter(Boolean).join(", ")}</div>
                  {form.note ? <div>{t("Note")}: {form.note}</div> : null}
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  (() => {
                    const localizedProduct = localizeShopProduct(item.product, locale);
                    return (
                  <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3" key={item.product.id}>
                    <div>
                      <div className="font-semibold">{localizedProduct.name}</div>
                      <div className="text-sm text-on-surface-variant">{item.quantity} x {formatVndFromUsd(item.product.price, locale === "vn" ? "vi-VN" : "en-US")}</div>
                    </div>
                    <div className="font-mono text-primary">{formatVndFromUsd(item.product.price * item.quantity, locale === "vn" ? "vi-VN" : "en-US")}</div>
                  </div>
                    );
                  })()
                ))}
              </div>
            </div>
          ) : null}

          {step === "success" ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_0_30px_rgba(165,231,255,0.2)]">
                <Icon className="text-4xl" name="check_circle" />
              </div>
              <div className="mono-label mb-3 text-primary">{t("ORDER RECEIVED")}</div>
              <h3 className="mb-3 text-2xl font-semibold">{t("Thanks, your order is in the queue.")}</h3>
              <p className="max-w-sm text-on-surface-variant">
                {t("We saved your order details and the admin team can now review it. Reference number:")} <span className="font-mono text-on-surface">{orderNumber}</span>
              </p>
            </div>
          ) : null}
        </div>

        <div className="relative z-10 border-t border-white/10 p-6">
          <div className="mb-4 flex items-center justify-between text-sm text-on-surface-variant">
            <span>{t("Subtotal")}</span>
            <span className="font-mono text-on-surface">{formatVndFromUsd(subtotal, locale === "vn" ? "vi-VN" : "en-US")}</span>
          </div>

          {step === "cart" ? (
            <>
              <button
                className="mb-3 w-full rounded-full bg-on-surface py-4 font-bold text-background transition hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length === 0}
                onClick={() => setStep("shipping")}
                type="button"
              >
                {t("Continue to Checkout")}
              </button>
              <button className="w-full rounded-full border border-white/10 bg-white/[0.03] py-4 font-semibold text-on-surface transition hover:bg-white/[0.06]" onClick={onClose} type="button">
                {t("Keep Browsing")}
              </button>
            </>
          ) : null}

          {step === "shipping" ? (
            <div className="flex gap-3">
              <button className="flex-1 rounded-full border border-white/10 bg-white/[0.03] py-4 font-semibold text-on-surface transition hover:bg-white/[0.06]" onClick={() => setStep("cart")} type="button">
                {t("Back")}
              </button>
              <button
                className="flex-1 rounded-full bg-on-surface py-4 font-bold text-background transition hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                onClick={() => {
                  if (validateShipping()) setStep("review");
                }}
                type="button"
              >
                {t("Review Order")}
              </button>
            </div>
          ) : null}

          {step === "review" ? (
            <div className="flex gap-3">
              <button className="flex-1 rounded-full border border-white/10 bg-white/[0.03] py-4 font-semibold text-on-surface transition hover:bg-white/[0.06]" onClick={() => setStep("shipping")} type="button">
                {t("Back")}
              </button>
              <button
                className="flex-1 rounded-full bg-on-surface py-4 font-bold text-background transition hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={submitting}
                onClick={() => void submitOrder()}
                type="button"
              >
                {submitting ? t("Submitting...") : t("Place Order")}
              </button>
            </div>
          ) : null}

          {step === "success" ? (
            <button className="w-full rounded-full bg-on-surface py-4 font-bold text-background transition hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]" onClick={onClose} type="button">
              {t("Close")}
            </button>
          ) : null}
        </div>
      </aside>
    </>
  );
}
