import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter } from "react-router";
import ThemeContextProvider from "./context/theme/ThemeContextProvider.tsx";
import AuthContextProvider from "./context/auth/AuthContextProvider.tsx";
import { CartContextProvider } from "./context/cart/CartContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <CartContextProvider>
    <AuthContextProvider>
      <ThemeContextProvider>
        <BrowserRouter>
          <StrictMode>
            <App />
          </StrictMode>
        </BrowserRouter>
      </ThemeContextProvider>
    </AuthContextProvider>
  </CartContextProvider>
);
