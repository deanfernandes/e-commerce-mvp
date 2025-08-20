import { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";

interface FormData {
  title: string;
  description: string;
  price: string;
}

export default function CreateProduct() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
  });
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { token } = useAuthContext();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/ai/health/");
        const data = await res.json();
        setAiEnabled(data.status === "ok");
      } catch {
        setAiEnabled(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAiClick = async () => {
    if (!formData.title) return;
    try {
      const res = await fetch("/ai/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: formData.title }),
      });

      console.log("test");

      const data = await res.json();
      console.log(data);
      setFormData((prev) => ({
        ...prev,
        description: data.message || "",
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI description");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });
      if (!res.ok) throw new Error("Failed to create product");
      setSuccess(true);
      setFormData({ title: "", description: "", price: "" });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-5">
        Create Product
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-1 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="border border-gray-300 rounded py-1 px-2"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={success}
          />
        </div>

        <div className="flex flex-col relative">
          <label htmlFor="description" className="mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="border border-gray-300 rounded py-1 px-2"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={success}
          />
          <button
            type="button"
            className={`absolute right-1 top-6 px-2 py-1 text-sm rounded bg-blue-300 hover:bg-blue-500 text-white disabled:bg-gray-300`}
            disabled={!aiEnabled || success}
            onClick={handleAiClick}
            title="Use AI to auto generate description for product from title"
          >
            AI
          </button>
        </div>

        <div className="flex flex-col">
          <label htmlFor="price" className="mb-1 font-medium">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            className="border border-gray-300 rounded py-1 px-2"
            value={formData.price}
            onChange={handleChange}
            required
            disabled={success}
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-400 text-white rounded py-2 hover:bg-blue-500 transition ${
            success ? "cursor-default pointer-events-none bg-green-500" : ""
          }`}
          disabled={success}
        >
          Create Product
        </button>

        {loading && <p className="text-center text-sm">Loading...</p>}
        {success && (
          <p className="text-center text-sm text-green-500">
            Product created successfully!
          </p>
        )}
        {error && (
          <p className="text-center text-sm text-red-500">
            Something went wrong.
          </p>
        )}
      </form>
    </div>
  );
}
