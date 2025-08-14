import { Link } from "react-router";

interface HeaderLinkProps {
  text: string;
  to: string;
  onClick?: () => void;
}

const HeaderLink = ({ text, to, onClick }: HeaderLinkProps) => {
  return (
    <Link
      to={to}
      className="bg-amber-300 px-4 py-2 hover:bg-amber-500 cursor-pointer text-center"
      onClick={onClick}
    >
      {text}
    </Link>
  );
};

export default HeaderLink;
