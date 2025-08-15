import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post("api/auth/register", formData);

      if (response.status === 201) {
        setSuccess(true);
        setError(false);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(true);
        setSuccess(false);
      }

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch {
      setError(true);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mt-10">Sign Up:</h2>

      <form
        className="flex flex-col w-full md:max-w-md mx-auto gap-y-4 mt-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col mx-5 md:mx-0">
          <label htmlFor="name" className="mb-1 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="border border-gray-300 rounded py-1"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={success}
          />
        </div>

        <div className="flex flex-col mx-5 md:mx-0">
          <label htmlFor="email" className="mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 rounded py-1"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={success}
          />
        </div>

        <div className="flex flex-col mx-5 md:mx-0">
          <label htmlFor="password" className="mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="border border-gray-300 rounded py-1"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            disabled={success}
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-300 font-medium rounded text-white hover:bg-blue-500 transition py-2 cursor-pointer  mx-5 md:mx-0 ${
            success ? "cursor-default pointer-events-none bg-blue-500" : ""
          }`}
          disabled={success}
        >
          Sign Up
        </button>

        {loading && <p className="text-center text-sm">Loading...</p>}

        {success && (
          <p className="text-center text-sm text-green-500">
            Successfully signed up! Redirecting...
          </p>
        )}

        {error && (
          <p className="text-center text-sm text-red-500">
            Something went wrong. Please try again later.
          </p>
        )}
      </form>
    </div>
  );
};

export default SignUp;
