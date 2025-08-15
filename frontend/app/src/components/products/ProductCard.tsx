import { Link } from "react-router";
import type { Product } from "../../types/Product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="rounded-lg shadow-lg p-4">
      <h3 className="mt-2 text-lg font-semibold">{product.title}</h3>
      <Link
        to={`/products/${product.id}`}
        className="inline-block mt-3 text-blue-300 hover:text-blue-500 font-medium hover:underline"
      >
        View details
      </Link>
    </div>
  );
};

export default ProductCard;
