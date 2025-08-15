import { createContext } from "react";
import type { CartItem } from "../../types/CartItem";
import type { Product } from "../../types/Product";

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  incrementCartItem: (productId: number) => void;
  decrementCartItem: (productId: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
