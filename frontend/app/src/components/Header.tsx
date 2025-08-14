import { useState } from "react";
import logo from "../assets/logo.jpg";
import { Link } from "react-router";
import ThemeToggleButton from "./ThemeToggleButton";
import HeaderLink from "./HeaderLink";
import useAuthContext from "../hooks/useAuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { user, logout } = useAuthContext();

  return (
    <header className="bg-blue-300 p-5 flex justify-between relative">
      <div className="flex space-x-5 items-center">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="logo" className="w-16 h-16" />
        </Link>

        <h1 className="text-3xl select-none font-bold hidden md:block text-white">
          e-commerce-mvp
        </h1>
      </div>

      <div className="flex items-center space-x-5">
        <ThemeToggleButton />

        <nav className="hidden md:flex space-x-5 items-center">
          {!user ? (
            <>
              <HeaderLink text="Sign Up" to="/signup" />
              <HeaderLink text="Login" to="/login" />
            </>
          ) : (
            <HeaderLink text="Logout" to="/" onClick={() => logout()} />
          )}
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            className="w-9 h-9 text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {user && (
          <p className="underline text-white uppercase text-xl">{user.name}</p>
        )}
      </div>

      {menuOpen && (
        <nav className="flex flex-col absolute top-full right-0 md:hidden z-10 shadow-md">
          {!user ? (
            <>
              <HeaderLink
                text="Sign Up"
                to="/signup"
                onClick={() => setMenuOpen(false)}
              />
              <HeaderLink
                text="Login"
                to="/login"
                onClick={() => setMenuOpen(false)}
              />
            </>
          ) : (
            <HeaderLink text="Logout" to="/" onClick={() => logout()} />
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
