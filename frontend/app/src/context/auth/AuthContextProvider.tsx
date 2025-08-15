import { useEffect, useState, type ReactNode } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import type User from "../../types/User";

interface AuthContextProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = "token";

type JwtPayload = {
  name: string;
  user: string;
  id: number;
};

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    console.log(`Get token`);
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log(token);

    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);

      const decoded = jwtDecode<JwtPayload>(token);
      setUser({ name: decoded.name, user: decoded.user, id: decoded.id });
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
  }, [token]);

  const login = (token: string) => {
    setToken(token);
  };

  const logout = () => {
    console.log("logout");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
