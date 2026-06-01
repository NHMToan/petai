import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createShopOrder } from "@/api/orders";
import { GradientCard } from "@/components/GradientCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { localizeShopItem } from "@/i18n/shopLocalization";
import { useI18n } from "@/i18n/useI18n";
import type { ShopStackParamList } from "@/navigation/types";
import { authStore } from "@/store/authStore";
import { shopStore } from "@/store/shopStore";
import { theme } from "@/theme/theme";

type Props = NativeStackScreenProps<ShopStackParamList, "ShopCheckout">;

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

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ShopCheckoutScreen({ navigation }: Props) {
  const { locale, t } = useI18n();
  const session = authStore((state) => state.session);
  const cart = shopStore((state) => state.cart);
  const clearCart = shopStore((state) => state.clearCart);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutFormState>({
    customerName: session?.user.name ?? "",
    customerEmail: session?.user.email ?? "",
    customerPhone: "",
    company: "",
    shippingLine1: "",
    shippingLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Vietnam",
    note: "",
  });

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [cart],
  );

  function updateForm<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    if (!form.customerName || !form.customerEmail || !form.shippingLine1 || !form.city || !form.country) {
      setError("Please complete the required customer and shipping information.");
      return false;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return false;
    }

    setError(null);
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setError(null);

    try {
      const order = await createShopOrder({
        source: "MOBILE",
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
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productSlug: item.product.slug,
          heroImage: item.product.heroImage,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      });
      setSuccessOrder(order.orderNumber);
      clearCart();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to place your order right now.");
    } finally {
      setSubmitting(false);
    }
  }

  if (successOrder) {
    return (
      <View style={styles.successScreen}>
        <GradientCard glow="secondary">
          <Text style={styles.eyebrow}>{t("ORDER CONFIRMED")}</Text>
          <Text style={styles.successTitle}>{t("Your order has been saved.")}</Text>
          <Text style={styles.successCopy}>
            {t("Customer details and line items are now in the database, and the admin team can review them from the admin order page.")}
          </Text>
          <Text style={styles.orderNumber}>{successOrder}</Text>
          <View style={styles.successActions}>
            <PrimaryButton label={t("Back to Shop")} onPress={() => navigation.popToTop()} />
          </View>
        </GradientCard>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <GradientCard>
        <Text style={styles.eyebrow}>{t("CHECKOUT")}</Text>
        <Text style={styles.title}>{t("Customer & shipping details")}</Text>
        <Text style={styles.copy}>
          {t("This checkout flow mirrors the website: review your bundle, enter shipping details, and submit one clean order record.")}
        </Text>
      </GradientCard>

      {error ? <Text style={styles.error}>{t(error)}</Text> : null}

      <GradientCard glow="secondary">
        <Text style={styles.sectionTitle}>{t("Order summary")}</Text>
        <View style={styles.summaryList}>
          {cart.map((item) => (
            (() => {
              const localizedItem = localizeShopItem(item.product, locale);
              return (
            <View key={item.product.id} style={styles.summaryRow}>
              <Image source={{ uri: localizedItem.heroImage }} style={styles.summaryImage} />
              <View style={styles.summaryBody}>
                <Text style={styles.summaryName}>{localizedItem.name}</Text>
                <Text style={styles.summaryMeta}>
                  {item.quantity} x {formatMoney(localizedItem.price)}
                </Text>
              </View>
              <Text style={styles.summaryTotal}>
                {formatMoney(item.quantity * localizedItem.price)}
              </Text>
            </View>
              );
            })()
          ))}
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t("Subtotal")}</Text>
          <Text style={styles.totalValue}>{formatMoney(subtotal)}</Text>
        </View>
      </GradientCard>

      <GradientCard>
        <Text style={styles.sectionTitle}>{t("Customer information")}</Text>
        <View style={styles.form}>
          <TextInput onChangeText={(value) => updateForm("customerName", value)} placeholder={t("Full name")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.customerName} />
          <TextInput autoCapitalize="none" keyboardType="email-address" onChangeText={(value) => updateForm("customerEmail", value)} placeholder={t("Email address")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.customerEmail} />
          <TextInput onChangeText={(value) => updateForm("customerPhone", value)} placeholder={t("Phone number")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.customerPhone} />
          <TextInput onChangeText={(value) => updateForm("company", value)} placeholder={t("Company (optional)")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.company} />
        </View>
      </GradientCard>

      <GradientCard>
        <Text style={styles.sectionTitle}>{t("Shipping address")}</Text>
        <View style={styles.form}>
          <TextInput onChangeText={(value) => updateForm("shippingLine1", value)} placeholder={t("Street address")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.shippingLine1} />
          <TextInput onChangeText={(value) => updateForm("shippingLine2", value)} placeholder={t("Apartment / suite (optional)")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.shippingLine2} />
          <TextInput onChangeText={(value) => updateForm("city", value)} placeholder={t("City")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.city} />
          <TextInput onChangeText={(value) => updateForm("state", value)} placeholder={t("State / Province")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.state} />
          <TextInput onChangeText={(value) => updateForm("postalCode", value)} placeholder={t("Postal code")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.postalCode} />
          <TextInput onChangeText={(value) => updateForm("country", value)} placeholder={t("Country")} placeholderTextColor="rgba(187,201,207,0.45)" style={styles.input} value={form.country} />
          <TextInput multiline onChangeText={(value) => updateForm("note", value)} placeholder={t("Order note (optional)")} placeholderTextColor="rgba(187,201,207,0.45)" style={[styles.input, styles.noteInput]} value={form.note} />
        </View>
      </GradientCard>

      <View style={styles.actions}>
        <PrimaryButton label={t("Back to Shop")} onPress={() => navigation.goBack()} secondary />
        <PrimaryButton label={submitting ? t("Submitting...") : t("Place Order")} loading={submitting} onPress={() => void handleSubmit()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },
  successScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  title: {
    color: theme.colors.onSurface,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 12,
  },
  copy: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: theme.spacing.md,
  },
  summaryList: {
    gap: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  summaryImage: {
    width: 64,
    height: 64,
    borderRadius: theme.radii.md,
  },
  summaryBody: {
    flex: 1,
    gap: 4,
  },
  summaryName: {
    color: theme.colors.onSurface,
    fontSize: 16,
    fontWeight: "700",
  },
  summaryMeta: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  summaryTotal: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  totalRow: {
    marginTop: theme.spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
  },
  totalValue: {
    color: theme.colors.onSurface,
    fontSize: 24,
    fontWeight: "700",
  },
  form: {
    gap: theme.spacing.md,
  },
  input: {
    minHeight: 54,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(5,5,5,0.55)",
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.onSurface,
    fontSize: 15,
  },
  noteInput: {
    minHeight: 120,
    paddingTop: theme.spacing.md,
    textAlignVertical: "top",
  },
  actions: {
    gap: theme.spacing.md,
  },
  successTitle: {
    color: theme.colors.onSurface,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  successCopy: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
  },
  orderNumber: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: theme.spacing.lg,
  },
  successActions: {
    marginTop: theme.spacing.xl,
  },
});
