import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../context/auth/AuthContext";

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
};

export default useAuthContext;
