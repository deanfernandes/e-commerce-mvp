import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <main className="flex-grow bg-white dark:bg-gray-700 text-gray-700 dark:text-white">
      <Outlet />
    </main>
  );
};

export default MainLayout;
