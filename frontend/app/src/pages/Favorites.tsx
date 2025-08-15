import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import ProductCard from "../components/products/ProductCard";

const Favorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuthContext();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);

        console.log(`Fetching favorites...`);

        const res = await axios.get<Product[]>(
          `/api/users/${user?.id}/favorites`,
          {
            timeout: 5000,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          setFavorites(res.data);
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

    fetchFavorites();
  }, []);

  if (loading) return <p className="text-center text-sm">Loading...</p>;

  if (error) return <p className="text-center text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-col flex-grow p-4">
      <h2 className="text-2xl font-semibold mb-4">Favorites:</h2>

      {favorites.length === 0 ? (
        <div>You have no favorites added yet.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favorites.map((f) => (
              <ProductCard key={f.id} product={f} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
