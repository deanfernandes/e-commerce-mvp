const Footer = () => {
  return (
    <footer className="bg-blue-500 text-gray-200 py-6">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-center font-bold">
          &copy; 2025 Dean Fernandes. All rights reserved.
        </p>

        <div className="flex space-x-6 text-xl">
          <a
            href="https://facebook.com"
            target="_blank"
            className="hover:text-blue-500"
          >
            <i className="fa fa-facebook"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            className="hover:text-blue-400"
          >
            <i className="fa fa-twitter"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            className="hover:text-blue-300"
          >
            <i className="fa fa-linkedin"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            className="hover:text-pink-400"
          >
            <i className="fa fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
