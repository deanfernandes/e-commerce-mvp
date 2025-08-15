import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../types/Product";
import useAuthContext from "../hooks/useAuthContext";
import ProductCard from "../components/products/ProductCard";

const ITEMS_PER_PAGE = 5;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthContext();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        console.log(`Fetching products...`);
        console.log(token);

        const res = await axios.get<Product[]>("/api/products", {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setProducts(res.data);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data.message) {
            setError(err.response.data.message);
            return;
          }
        }
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <p className="text-center text-sm">Loading...</p>;

  if (error) return <p className="text-center text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-col flex-grow p-4">
      <h2 className="text-2xl font-semibold mb-4">Products:</h2>

      {currentProducts.length === 0 ? (
        <div>Sorry, no products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-auto flex justify-center space-x-2 pt-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50 disabled:cursor-default"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 border rounded ${
                    page === currentPage
                      ? "bg-blue-300 text-white"
                      : "cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50 disabled:cursor-default"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
