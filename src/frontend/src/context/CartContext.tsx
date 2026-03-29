import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  cartKey: string; // unique: productId-variantLabel-sizeLabel
  productId: string;
  productName: string;
  variant: string;
  size: string;
  mrp: number;
  price: number;
  discountPct: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartMrpTotal: number;
  cartSavings: number;
  deliveryCharge: number;
  grandTotal: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === item.cartKey);
      if (existing) {
        return prev.map((i) =>
          i.cartKey === item.cartKey ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((cartKey: string) => {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity: qty } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartMrpTotal = items.reduce((sum, i) => sum + i.mrp * i.quantity, 0);
  const cartSavings = cartMrpTotal - cartSubtotal;
  // Delivery: FREE if 3+ line items, else ₹30
  const deliveryCharge = items.length >= 3 ? 0 : 30;
  const grandTotal = cartSubtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartSubtotal,
        cartMrpTotal,
        cartSavings,
        deliveryCharge,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
