import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getShopProduct } from "@/api/shop";
import { GradientCard } from "@/components/GradientCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { localizeShopItem } from "@/i18n/shopLocalization";
import { useI18n } from "@/i18n/useI18n";
import type { ShopStackParamList } from "@/navigation/types";
import { shopStore } from "@/store/shopStore";
import { theme } from "@/theme/theme";
import type { ShopItem } from "@/types";

type Props = NativeStackScreenProps<ShopStackParamList, "ShopProduct">;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ShopProductScreen({ navigation, route }: Props) {
  const { locale, t } = useI18n();
  const { productId } = route.params;
  const [product, setProduct] = useState<ShopItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToCart = shopStore((state) => state.addToCart);
  const cart = shopStore((state) => state.cart);

  useEffect(() => {
    let mounted = true;

    getShopProduct(productId)
      .then((data) => {
        if (!mounted) return;
        setProduct(data);
        setError(null);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Could not load this product.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  const inCart = useMemo(() => {
    if (!product) return 0;
    return cart.find((item) => item.product.id === product.id)?.quantity ?? 0;
  }, [cart, product]);

  const localizedProduct = useMemo(
    () => (product ? localizeShopItem(product, locale) : null),
    [locale, product],
  );

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.helper}>{t("Loading product details…")}</Text>
      </View>
    );
  }

  if (!localizedProduct) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.error}>{t(error ?? "Product not found.")}</Text>
      </View>
    );
  }

  const gallery = [localizedProduct.heroImage, ...(localizedProduct.gallery ?? []).filter((image) => image !== localizedProduct.heroImage)].slice(0, 4);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={{ uri: localizedProduct.heroImage }} style={styles.heroImage} />

      <GradientCard>
        <Text style={styles.badge}>{localizedProduct.badge.toUpperCase()}</Text>
        <Text style={styles.title}>{localizedProduct.name}</Text>
        <Text style={styles.tagline}>{localizedProduct.tagline}</Text>
        <Text style={styles.price}>{formatMoney(localizedProduct.price)}</Text>
        <Text style={styles.description}>{localizedProduct.longDescription ?? localizedProduct.description ?? localizedProduct.shortDescription}</Text>

        <View style={styles.quantityBlock}>
          <Text style={styles.sectionLabel}>{t("QUANTITY")}</Text>
          <View style={styles.quantityRow}>
            <Pressable onPress={() => setQuantity((value) => Math.max(1, value - 1))} style={styles.quantityButton}>
              <Text style={styles.quantityButtonLabel}>-</Text>
            </Pressable>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Pressable onPress={() => setQuantity((value) => value + 1)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonLabel}>+</Text>
            </Pressable>
          </View>
          {inCart > 0 ? <Text style={styles.inCart}>{inCart} {t("already in cart")}</Text> : null}
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label={t("Add to Cart")}
            onPress={() => addToCart(localizedProduct, quantity)}
            secondary
          />
          <PrimaryButton
            label={t("Buy Now")}
            onPress={() => {
              addToCart(localizedProduct, quantity);
              navigation.navigate("ShopCheckout");
            }}
          />
        </View>
      </GradientCard>

      {gallery.length > 1 ? (
        <View style={styles.gallery}>
          {gallery.map((image, index) => (
            <Image key={`${image}-${index}`} source={{ uri: image }} style={styles.galleryImage} />
          ))}
        </View>
      ) : null}

      {localizedProduct.specs?.length ? (
        <GradientCard glow="secondary">
          <Text style={styles.sectionLabel}>{t("SPECIFICATIONS")}</Text>
          <View style={styles.specList}>
            {localizedProduct.specs.map((spec) => (
              <View key={spec.label} style={styles.specRow}>
                <View style={styles.specIcon}>
                  <Text style={styles.specIconText}>{spec.icon.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={styles.specBody}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </GradientCard>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },
  centerState: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  helper: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
  },
  heroImage: {
    width: "100%",
    height: 360,
    borderRadius: theme.radii.lg,
  },
  badge: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  title: {
    color: theme.colors.onSurface,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  tagline: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
    marginBottom: 12,
  },
  price: {
    color: theme.colors.primary,
    fontSize: 42,
    fontWeight: "700",
    marginBottom: 16,
  },
  description: {
    color: theme.colors.onSurface,
    fontSize: 15,
    lineHeight: 24,
  },
  quantityBlock: {
    marginTop: theme.spacing.lg,
    gap: 10,
  },
  sectionLabel: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    minHeight: 48,
    borderRadius: theme.radii.full,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: theme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  quantityButtonLabel: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  quantityValue: {
    minWidth: 24,
    color: theme.colors.onSurface,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  inCart: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  gallery: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  galleryImage: {
    flex: 1,
    height: 92,
    borderRadius: theme.radii.md,
  },
  specList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  specRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "flex-start",
  },
  specIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(165,231,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(165,231,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  specIconText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  specBody: {
    flex: 1,
    gap: 2,
  },
  specLabel: {
    color: theme.colors.onSurface,
    fontSize: 15,
    fontWeight: "700",
  },
  specValue: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
});
