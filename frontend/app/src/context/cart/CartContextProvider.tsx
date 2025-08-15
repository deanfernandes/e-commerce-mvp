import { type ReactNode, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import type { Product } from "../../types/Product";

const CART_STORAGE_KEY = "cart";

interface CartContextProviderProps {
  children: ReactNode;
}

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const sessionCart = sessionStorage.getItem(CART_STORAGE_KEY);
    return sessionCart ? JSON.parse(sessionCart) : [];
  });

  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const incrementCartItem = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementCartItem = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        incrementCartItem,
        decrementCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
