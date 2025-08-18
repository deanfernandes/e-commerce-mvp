import { Outlet } from "react-router";
import ProductsNavBar from "../components/products/ProductsNavBar";
import Chat from "@deanfernandes/react-chat-ws-client";

interface MainLayoutProps {
  token: string | null;
}

const MainLayout = ({ token }: MainLayoutProps) => {
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsProtocol}://${window.location.host}/chat`;

  return (
    <main className="flex-grow flex flex-col bg-white dark:bg-gray-700 text-gray-700 dark:text-white">
      {token && <ProductsNavBar />}
      <Outlet />
      {token && (
        <div className="fixed z-50 bottom-32 right-10 hidden md:block">
          <Chat serverAddress={wsUrl} token={token} />
        </div>
      )}
    </main>
  );
};

export default MainLayout;
