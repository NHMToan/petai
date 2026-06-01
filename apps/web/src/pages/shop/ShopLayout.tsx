import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { CartDrawer } from "../../components/shop/CartDrawer";
import { MarketingNavbar } from "../../components/layout/MarketingNavbar";
import { fetchShopProducts } from "../../lib/api/shop";
import type { CartItem, ShopProduct } from "../../types";

type ShopContextValue = {
  addToCart: (product: ShopProduct) => void;
  cart: CartItem[];
  openCart: () => void;
  products: ShopProduct[];
  setProducts: React.Dispatch<React.SetStateAction<ShopProduct[]>>;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) {
    throw new Error("useShop must be used inside ShopLayout.");
  }
  return value;
}

export function ShopLayout() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  function addToCart(product: ShopProduct) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((current) =>
      current
        .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(productId: string) {
    setCart((current) => current.filter((item) => item.product.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  function updateProducts(next: React.SetStateAction<ShopProduct[]>) {
    setProducts(next);
  }

  useEffect(() => {
    let mounted = true;
    fetchShopProducts()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const contextValue = useMemo<ShopContextValue>(
    () => ({
      addToCart,
      cart,
      openCart: () => setCartOpen(true),
      products,
      setProducts: updateProducts,
    }),
    [cart, products],
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider value={contextValue}>
      <div className="min-h-screen overflow-x-hidden bg-background font-sans text-on-surface">
        <div className="noise-overlay" />
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[50vh] w-[50vw] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-15%] right-[-10%] h-[60vh] w-[60vw] rounded-full bg-secondary/10 blur-[140px]" />
        </div>

        <MarketingNavbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

        <main className="relative z-10 pt-28">
          <Outlet />
        </main>

        <CartDrawer
          clearCart={clearCart}
          items={cart}
          onClose={() => setCartOpen(false)}
          onDecrement={(productId) => updateQuantity(productId, -1)}
          onIncrement={(productId) => updateQuantity(productId, 1)}
          onRemove={removeItem}
          open={cartOpen}
        />
      </div>
    </ShopContext.Provider>
  );
}
