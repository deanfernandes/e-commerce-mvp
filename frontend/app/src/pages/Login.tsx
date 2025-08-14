import React, { useState } from "react";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate } from "react-router";

type FormData = {
  email: string;
  password: string;
};

interface LoginResponse {
  token?: string;
  message?: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuthContext();

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post<LoginResponse>(
        "api/auth/login",
        formData
      );

      setError(null);

      if (response.data.token) {
        login(response.data.token);
      }

      setFormData({
        email: "",
        password: "",
      });

      navigate("/");
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

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mt-10">Login:</h2>

      <form
        className="flex flex-col w-full md:max-w-md mx-auto gap-y-4 mt-5"
        onSubmit={handleSubmit}
      >
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
          />
        </div>

        <button
          type="submit"
          className="bg-blue-300 font-medium rounded text-white hover:bg-blue-500 transition py-2 cursor-pointer mx-5 md:mx-0"
        >
          Login
        </button>

        {loading && <p className="text-center text-sm">Loading...</p>}

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
