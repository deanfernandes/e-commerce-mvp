import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import useAuthContext from "./hooks/useAuthContext";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

function App() {
  const { user, token } = useAuthContext();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<MainLayout token={token} />}>
          <Route index element={<Home />} />
          <Route
            path="/signup"
            element={!user ? <SignUp /> : <Navigate to="/" replace />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/products"
            element={user ? <Products /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/products/:id"
            element={
              user ? <ProductDetails /> : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
