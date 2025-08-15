import { Outlet } from "react-router";
import ProductsNavBar from "../components/products/ProductsNavBar";

interface MainLayoutProps {
  token: string | null;
}

const MainLayout = ({ token }: MainLayoutProps) => {
  return (
    <main className="flex-grow flex flex-col bg-white dark:bg-gray-700 text-gray-700 dark:text-white">
      {token && <ProductsNavBar />}
      <Outlet />
    </main>
  );
};

export default MainLayout;
