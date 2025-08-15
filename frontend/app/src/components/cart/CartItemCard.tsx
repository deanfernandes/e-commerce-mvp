import { useCartContext } from "../../hooks/useCartContext";
import type { Product } from "../../types/Product";

interface CartItemCardProps {
  product: Product;
  quantity: number;
}

const CartItemCard = ({ product, quantity }: CartItemCardProps) => {
  const { removeFromCart, incrementCartItem, decrementCartItem } =
    useCartContext();

  return (
    <div className="rounded-lg shadow-lg p-4 pr-34">
      <h3 className="mt-2 text-lg font-semibold">{product.title}</h3>
      <p className="text-gray-700 font-medium">${product.price.toFixed(2)}</p>
      <div className="flex items-center space-x-2">
        <button
          className="bg-blue-300 px-2 py-1 rounded hover:bg-blue-500 cursor-pointer"
          onClick={() => decrementCartItem(product.id)}
        >
          -
        </button>
        <p className="text-gray-500 px-2">{quantity}</p>
        <button
          className="bg-blue-300 px-2 py-1 rounded hover:bg-blue-500 cursor-pointer"
          onClick={() => incrementCartItem(product.id)}
        >
          +
        </button>
      </div>
      <p>Sub total: ${(product.price * quantity).toFixed(2)}</p>
      <button
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 cursor-pointer flex items-center justify-center"
        onClick={() => removeFromCart(product.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z"
          />
        </svg>
      </button>
    </div>
  );
};

export default CartItemCard;
