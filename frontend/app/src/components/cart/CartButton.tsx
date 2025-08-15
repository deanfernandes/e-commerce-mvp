import { Link } from "react-router";
import { useCartContext } from "../../hooks/useCartContext";

export const CartButton: React.FC = () => {
  const { cart } = useCartContext();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to="/cart"
      className="relative p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h12l-2-9M9 21h6"
        />
      </svg>

      {totalItems > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
          {totalItems}
        </span>
      )}
    </Link>
  );
};
