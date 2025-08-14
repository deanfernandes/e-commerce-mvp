import { createContext } from "react";
import type User from "../../types/User";

export type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default AuthContext;
