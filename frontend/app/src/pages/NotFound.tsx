import { useParams } from "react-router";

const NotFound = () => {
  const params = useParams();

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-6xl font-bold">404 - Page Not Found</h1>
      <h2 className="text-3xl font-semibold">{params["*"]}</h2>
    </div>
  );
};

export default NotFound;
