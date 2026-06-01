import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getShopProducts } from "@/api/shop";
import { GradientCard } from "@/components/GradientCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { localizeShopItem } from "@/i18n/shopLocalization";
import { useI18n } from "@/i18n/useI18n";
import type { ShopStackParamList } from "@/navigation/types";
import { shopStore } from "@/store/shopStore";
import { theme } from "@/theme/theme";
import type { ShopItem } from "@/types";

type Props = NativeStackScreenProps<ShopStackParamList, "Shop">;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ShopScreen({ navigation }: Props) {
  const { locale, t } = useI18n();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cart = shopStore((state) => state.cart);
  const addToCart = shopStore((state) => state.addToCart);

  useEffect(() => {
    let mounted = true;

    getShopProducts()
      .then((products) => {
        if (!mounted) return;
        setItems(products);
        setError(null);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Could not load shop data from the backend.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const featured = items[0];
  const localizedFeatured = featured ? localizeShopItem(featured, locale) : null;
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [cart],
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <GradientCard>
          <Text style={styles.eyebrow}>{t("NEURAL COLLECTION")}</Text>
          <Text style={styles.heroTitle}>{t("Shop companions without the clutter.")}</Text>
          <Text style={styles.heroCopy}>
            {t("Browse the line, open a full product detail view, then move into a dedicated checkout screen when you are ready.")}
          </Text>
        </GradientCard>

        {cartCount > 0 ? (
          <GradientCard glow="secondary">
            <View style={styles.cartBannerRow}>
              <View style={styles.cartBannerText}>
                <Text style={styles.cartBannerEyebrow}>CART READY</Text>
                <Text style={styles.cartBannerTitle}>
                  {cartCount} {t(cartCount > 1 ? "items selected" : "item selected")}
                </Text>
                <Text style={styles.cartBannerPrice}>{formatMoney(cartSubtotal)}</Text>
              </View>
              <View style={styles.cartBannerCta}>
                <PrimaryButton
                  label={t("Checkout")}
                  onPress={() => navigation.navigate("ShopCheckout")}
                />
              </View>
            </View>
          </GradientCard>
        ) : null}

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.helper}>{t("Loading live shop inventory…")}</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.error}>{t(error)}</Text> : null}

        {localizedFeatured ? (
          <GradientCard>
            <Pressable onPress={() => navigation.navigate("ShopProduct", { productId: localizedFeatured.slug || localizedFeatured.id })}>
              <Image source={{ uri: localizedFeatured.heroImage }} style={styles.featureImage} />
            </Pressable>
            <Text style={styles.featureLabel}>{t("FEATURED BUNDLE")}</Text>
            <Text style={styles.featureName}>{localizedFeatured.name}</Text>
            <Text style={styles.featureTagline}>{localizedFeatured.tagline}</Text>
            <Text style={styles.featureCopy}>
              {localizedFeatured.longDescription ?? localizedFeatured.shortDescription}
            </Text>
            <View style={styles.featureFooter}>
              <Text style={styles.featurePrice}>{formatMoney(localizedFeatured.price)}</Text>
              <View style={styles.featureActions}>
                <PrimaryButton
                  label={t("View Details")}
                  onPress={() => navigation.navigate("ShopProduct", { productId: localizedFeatured.slug || localizedFeatured.id })}
                  secondary
                />
                <PrimaryButton
                  label={t("Add")}
                  onPress={() => addToCart(localizedFeatured, 1)}
                />
              </View>
            </View>
          </GradientCard>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("Browse the collection")}</Text>
          <Text style={styles.sectionCopy}>
            {t("Tap any product to see its full imagery, description, specs, and quantity controls.")}
          </Text>
        </View>

        <View style={styles.list}>
          {items.map((item, index) => {
            const localizedItem = localizeShopItem(item, locale);
            const inCart = cart.find((cartItem) => cartItem.product.id === item.id)?.quantity ?? 0;

            return (
              <GradientCard glow={index % 2 === 0 ? "primary" : "secondary"} key={item.id}>
                <Pressable
                  onPress={() => navigation.navigate("ShopProduct", { productId: localizedItem.slug || localizedItem.id })}
                  style={styles.productCard}
                >
                  <Image source={{ uri: localizedItem.heroImage }} style={styles.image} />
                  <View style={styles.productBody}>
                    <Text style={styles.badge}>{localizedItem.badge.toUpperCase()}</Text>
                    <Text style={styles.name}>{localizedItem.name}</Text>
                    <Text style={styles.tagline}>{localizedItem.tagline}</Text>
                    <Text style={styles.description}>{localizedItem.shortDescription}</Text>
                  </View>
                </Pressable>
                <View style={styles.footer}>
                  <View>
                    <Text style={styles.price}>{formatMoney(localizedItem.price)}</Text>
                    {inCart > 0 ? <Text style={styles.inCart}>{inCart} {t("in cart")}</Text> : null}
                  </View>
                  <View style={styles.actions}>
                    <PrimaryButton
                      label={t("Details")}
                      onPress={() => navigation.navigate("ShopProduct", { productId: localizedItem.slug || localizedItem.id })}
                      secondary
                    />
                    <PrimaryButton label={t("Add")} onPress={() => addToCart(localizedItem, 1)} />
                  </View>
                </View>
              </GradientCard>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  heroTitle: {
    color: theme.colors.onSurface,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "700",
    marginBottom: 10,
  },
  heroCopy: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
    lineHeight: 24,
  },
  cartBannerRow: {
    gap: theme.spacing.md,
  },
  cartBannerText: {
    gap: 4,
  },
  cartBannerEyebrow: {
    color: theme.colors.secondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  cartBannerTitle: {
    color: theme.colors.onSurface,
    fontSize: 24,
    fontWeight: "700",
  },
  cartBannerPrice: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  cartBannerCta: {
    marginTop: 8,
  },
  centerState: {
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  helper: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
  },
  featureImage: {
    width: "100%",
    height: 240,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.md,
  },
  featureLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  featureName: {
    color: theme.colors.onSurface,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureTagline: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    marginBottom: 12,
  },
  featureCopy: {
    color: theme.colors.onSurface,
    fontSize: 15,
    lineHeight: 22,
  },
  featureFooter: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  featurePrice: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: "700",
  },
  featureActions: {
    gap: theme.spacing.md,
  },
  sectionHeader: {
    gap: 6,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontSize: 24,
    fontWeight: "700",
  },
  sectionCopy: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: theme.spacing.lg,
  },
  productCard: {
    gap: theme.spacing.md,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: theme.radii.md,
  },
  productBody: {
    gap: 4,
  },
  badge: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  name: {
    color: theme.colors.onSurface,
    fontSize: 28,
    fontWeight: "700",
  },
  tagline: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    marginBottom: 8,
  },
  description: {
    color: theme.colors.onSurface,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  price: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: "700",
  },
  inCart: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
    marginTop: 4,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
