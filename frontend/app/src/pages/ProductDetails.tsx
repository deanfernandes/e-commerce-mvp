import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Product } from "../types/Product";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import { useCartContext } from "../hooks/useCartContext";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const { addToCart } = useCartContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axios.get<Product>(`/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        });

        if (res.status === 200) {
          setProduct(res.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data.message) {
            console.error(err.response.data.message);
            return;
          }
        }
        console.error("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }

      try {
        const res = await fetch(`/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(`Failed to fetch product. ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product as Product, 1);

    console.log(`Added "${product?.title}" to cart!`);
  };

  if (loading) return <p className="text-center text-sm">Loading...</p>;

  if (!product)
    return (
      <p className="text-center text-sm text-red-500">Product not found.</p>
    );

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-300 hover:text-blue-500 font-medium hover:underline cursor-pointer mb-4"
      >
        &larr; Back
      </button>

      <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
      <p className="italic">{product.description}</p>
      <p className="text-lg font-semibold mt-2">${product.price.toFixed(2)}</p>

      <button
        onClick={handleAddToCart}
        className="mt-6 px-6 py-3 bg-blue-300 text-white rounded hover:bg-blue-500 transition cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
