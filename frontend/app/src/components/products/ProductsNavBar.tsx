import { NavLink } from "react-router";

const ProductsNavBar = () => {
  return (
    <nav className="bg-blue-500 text-white flex space-x-6 py-2">
      <NavLink
        to="/products"
        className={({ isActive }) =>
          isActive
            ? "ml-2 underline pointer-events-none cursor-default"
            : "ml-2 hover:underline"
        }
      >
        Products
      </NavLink>
      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          isActive
            ? "ml-2 underline pointer-events-none cursor-default"
            : "ml-2 hover:underline"
        }
      >
        Favorites
      </NavLink>
    </nav>
  );
};

export default ProductsNavBar;
