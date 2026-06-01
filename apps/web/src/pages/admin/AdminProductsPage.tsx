import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DataTable } from "../../components/ui/DataTable";
import { GlassCard } from "../../components/ui/GlassCard";
import { Icon } from "../../components/ui/Icon";
import { PageHeader } from "../../components/ui/PageHeader";
import { normalizeShopProduct } from "../../data/shop";
import { useI18n } from "../../features/i18n/i18n-context";
import { createAdminProduct, deleteAdminProduct, fetchAdminProducts, updateAdminProduct, uploadAdminProductImage } from "../../lib/api/admin";
import { formatVnd, usdToVnd, vndToUsd } from "../../lib/currency";
import type { ShopProduct, TableColumn } from "../../types";

type ProductFormState = {
  name: string;
  slug: string;
  tagline: string;
  category: string;
  price: string;
  badge: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  heroImage: string;
  galleryText: string;
  specsText: string;
};

const emptyForm: ProductFormState = {
  name: "",
  slug: "",
  tagline: "",
  category: "Neural Plush",
  price: "5174000",
  badge: "NEW",
  shortDescription: "",
  description: "",
  longDescription: "",
  heroImage: "",
  galleryText: "",
  specsText: "",
};

function specsToText(specs: ShopProduct["specs"]) {
  return normalizeSpecs(specs)
    .map((spec) => `${spec.label} | ${spec.value} | ${spec.icon}`)
    .join("\n");
}

function parseSpecs(text: string, fallback?: ShopProduct["specs"]) {
  const parsed = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.includes("|") ? "|" : line.includes("｜") ? "｜" : line.includes(";") ? ";" : null;
      if (!separator) return null;

      const parts = line.split(separator).map((part) => part.trim());
      const [labelRaw = "", valueRaw = "", iconRaw = "auto_awesome"] = parts;
      if (!labelRaw || !valueRaw) return null;
      return {
        label: labelRaw,
        value: valueRaw,
        icon: iconRaw || "auto_awesome",
      };
    })
    .filter((entry): entry is { label: string; value: string; icon: string } => Boolean(entry));

  if (parsed.length) return parsed;
  const normalizedFallback = normalizeSpecs(fallback);
  if (normalizedFallback.length) return normalizedFallback;
  return defaultSpecs();
}

function defaultSpecs() {
  return [
    { icon: "auto_awesome", label: "Core", value: "Configurable AI companion profile" },
    { icon: "memory", label: "Neural", value: "On-device interaction memory" },
    { icon: "wifi", label: "Sync", value: "Cloud-assisted adaptation pipeline" },
  ];
}

function normalizeSpecs(specs: unknown): ShopProduct["specs"] {
  if (!Array.isArray(specs)) return [];

  return specs
    .map((entry) => {
      if (Array.isArray(entry)) {
        const [label, value, icon] = entry;
        if (typeof label !== "string" || typeof value !== "string") return null;
        return {
          label: label.trim(),
          value: value.trim(),
          icon: typeof icon === "string" && icon.trim() ? icon.trim() : "auto_awesome",
        };
      }

      if (!entry || typeof entry !== "object") return null;

      const maybe = entry as { label?: unknown; value?: unknown; icon?: unknown };
      if (typeof maybe.label !== "string" || typeof maybe.value !== "string") return null;

      return {
        label: maybe.label.trim(),
        value: maybe.value.trim(),
        icon: typeof maybe.icon === "string" && maybe.icon.trim() ? maybe.icon.trim() : "auto_awesome",
      };
    })
    .filter((entry): entry is ShopProduct["specs"][number] => Boolean(entry?.label && entry.value));
}

function ProductModal({
  form,
  imageName,
  onChange,
  onImageChange,
  onClose,
  onSubmit,
  saving,
  title,
  t,
  errorMessage,
}: {
  form: ProductFormState;
  imageName: string | null;
  onChange: (key: keyof ProductFormState, value: string) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  saving: boolean;
  title: string;
  t: (key: string) => string;
  errorMessage: string | null;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#1f1e1f]/95 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-white/8 px-8 pb-6 pt-8">
          <div>
            <h3 className="text-3xl font-bold text-on-surface">{title}</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Manage storefront metadata and product content used by `/shop`.</p>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-8 py-6">
            <div className="flex items-center gap-5 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <img
                alt="Product preview"
                className="h-24 w-24 rounded-2xl border border-white/10 object-cover"
                src={form.heroImage || "https://placehold.co/240x240/1f1e1f/e5e2e1?text=Product"}
              />
              <div className="flex-1">
                <p className="mb-2 font-semibold text-on-surface">Hero Image</p>
                <p className="mb-3 text-sm text-on-surface-variant">Upload the main product image shown in shop cards and product detail.</p>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15">
                  <Icon name="upload" />
                  Upload Image
                  <input accept="image/*" className="hidden" onChange={onImageChange} type="file" />
                </label>
                <p className="mt-3 text-xs text-on-surface-variant">{imageName ?? "No new image selected"}</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">PRODUCT NAME</span>
              <input className="field" onChange={(event) => onChange("name", event.target.value)} required value={form.name} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">SLUG</span>
              <input className="field" onChange={(event) => onChange("slug", event.target.value)} required value={form.slug} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">TAGLINE</span>
              <input className="field" onChange={(event) => onChange("tagline", event.target.value)} required value={form.tagline} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">CATEGORY</span>
              <input className="field" onChange={(event) => onChange("category", event.target.value)} required value={form.category} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">{t("PRICE (USD)")}</span>
              <input className="field" min="0" onChange={(event) => onChange("price", event.target.value)} required type="number" value={form.price} />
            </label>
            <label className="block">
              <span className="mono-label mb-2 block text-on-surface-variant">BADGE</span>
              <input className="field" onChange={(event) => onChange("badge", event.target.value)} required value={form.badge} />
            </label>
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">SHORT DESCRIPTION</span>
              <textarea className="field min-h-20 resize-none" onChange={(event) => onChange("shortDescription", event.target.value)} required value={form.shortDescription} />
            </label>
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">DESCRIPTION</span>
              <textarea className="field min-h-20 resize-none" onChange={(event) => onChange("description", event.target.value)} required value={form.description} />
            </label>
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">LONG DESCRIPTION</span>
              <textarea className="field min-h-24 resize-none" onChange={(event) => onChange("longDescription", event.target.value)} required value={form.longDescription} />
            </label>
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">GALLERY URLS (one URL per line)</span>
              <textarea
                className="field min-h-28 resize-none"
                onChange={(event) => onChange("galleryText", event.target.value)}
                placeholder="https://...&#10;https://..."
                value={form.galleryText}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mono-label mb-2 block text-on-surface-variant">SPECS (one per line: label | value | icon)</span>
              <textarea
                className="field min-h-28 resize-none"
                onChange={(event) => onChange("specsText", event.target.value)}
                placeholder="Neural Core | 1.5T adaptive parameters | memory&#10;Voice Engine | Ultra-low latency response | graphic_eq"
                value={form.specsText}
              />
            </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/8 px-8 py-5">
            {errorMessage ? (
              <div className="mr-auto rounded-xl border border-error/30 bg-error/15 px-3 py-2 text-xs font-medium text-error">
                {errorMessage}
              </div>
            ) : null}
            <button className="btn-secondary" onClick={onClose} type="button">
              {t("Cancel")}
            </button>
            <button className="btn-primary" disabled={saving} type="submit">
              <Icon name="save" />
              {saving ? "Saving..." : t("Save Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function toForm(product: ShopProduct): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    tagline: product.tagline,
    category: product.category,
    price: String(usdToVnd(product.price)),
    badge: product.badge,
    shortDescription: product.shortDescription,
    description: product.description,
    longDescription: product.longDescription,
    heroImage: product.heroImage,
    galleryText: product.gallery.join("\n"),
    specsText: specsToText(product.specs),
  };
}

function toProduct(form: ProductFormState, existing?: ShopProduct): ShopProduct {
  const galleryFromText = form.galleryText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const normalized = normalizeShopProduct({
    id: existing?.id ?? `product-${Date.now().toString(36)}`,
    name: form.name.trim(),
    slug: form.slug.trim(),
    tagline: form.tagline.trim(),
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    longDescription: form.longDescription.trim(),
    price: vndToUsd(Number(form.price) || 0),
    heroImage: form.heroImage.trim(),
    gallery: galleryFromText.length ? galleryFromText : existing?.gallery?.length ? existing.gallery : [form.heroImage.trim()],
    specs: parseSpecs(form.specsText, existing?.specs),
    category: form.category.trim(),
    badge: form.badge.trim(),
  });

  return {
    ...normalized,
    gallery: [form.heroImage.trim(), ...normalized.gallery.filter((image) => image !== form.heroImage.trim())].slice(0, 4),
  };
}

function isDataUrl(value: string) {
  return value.startsWith("data:image/");
}

export function AdminProductsPage() {
  const { locale, t } = useI18n();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        priceLabel: formatVnd(usdToVnd(product.price), locale === "vn" ? "vi-VN" : "en-US"),
      })),
    [locale, products],
  );

  const columns = useMemo<TableColumn<(typeof rows)[number]>[]>(
    () => [
      { key: "name", header: "NAME" },
      { key: "slug", header: "SLUG" },
      { key: "category", header: "CATEGORY" },
      { key: "badge", header: "BADGE" },
      { key: "priceLabel", header: t("PRICE") },
      {
        key: "actions",
        header: "ACTIONS",
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15"
              onClick={() => {
                setEditingId(row.id);
                setForm(toForm(row));
                setImageName(null);
                setModalOpen(true);
              }}
              type="button"
            >
              {t("Edit")}
            </button>
            <button
              className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-xs font-semibold text-error transition hover:bg-error/15"
              onClick={() => {
                const confirmed = window.confirm(`Delete product "${row.name}"?`);
                if (!confirmed) return;
                deleteAdminProduct(row.id)
                  .then(() => setProducts((current) => current.filter((entry) => entry.id !== row.id)))
                  .catch(() => undefined);
              }}
              type="button"
            >
              {t("Delete")}
            </button>
          </div>
        ),
      },
    ],
    [products, t],
  );

  function resetModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setSaving(false);
    setImageName(null);
    setImageFile(null);
    setSubmitError(null);
  }

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setForm((current) => ({ ...current, heroImage: result }));
      setImageName(file.name);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.heroImage.trim()) return;
    setSubmitError(null);
    setSaving(true);
    try {
      const current = editingId ? products.find((product) => product.id === editingId) : undefined;
      const nextProduct = toProduct(form, current);
      const { id: _id, ...payload } = nextProduct;
      const safePayload: Omit<ShopProduct, "id"> = {
        ...payload,
        heroImage: imageFile && isDataUrl(payload.heroImage) ? (current?.heroImage ?? "https://placehold.co/800x800/111/ddd?text=PetAI") : payload.heroImage,
        gallery: imageFile ? (current?.gallery?.filter((image) => !isDataUrl(image)) ?? []) : payload.gallery,
      };

      if (editingId) {
        const updated = await updateAdminProduct(editingId, safePayload);
        const finalProduct = imageFile ? await uploadAdminProductImage(editingId, imageFile) : updated;
        setProducts((existing) => existing.map((product) => (product.id === editingId ? finalProduct : product)));
      } else {
        const created = await createAdminProduct(safePayload);
        const finalProduct = imageFile ? await uploadAdminProductImage(created.id, imageFile) : created;
        setProducts((existing) => [finalProduct, ...existing]);
      }
      resetModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string | string[] } | undefined)?.message;
        setSubmitError(Array.isArray(message) ? message.join(", ") : message ?? "Could not save product.");
      } else {
        setSubmitError("Could not save product.");
      }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchAdminProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <PageHeader
        actions={
          <button
            className="btn-primary"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setImageName(null);
              setModalOpen(true);
            }}
            type="button"
          >
            {t("Add Product")}
          </button>
        }
        description="Control the storefront product list used by `/shop`, including pricing and product metadata."
        title={t("Products Management")}
      />
      <GlassCard className="p-6">
        <DataTable columns={columns} rows={rows} />
      </GlassCard>

      {modalOpen ? (
        <ProductModal
          form={form}
          imageName={imageName}
          onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))}
          onImageChange={onImageChange}
          onClose={resetModal}
          onSubmit={submit}
          errorMessage={submitError}
          saving={saving}
          t={t}
          title={editingId ? t("Edit Product") : t("Add Product")}
        />
      ) : null}
    </div>
  );
}
