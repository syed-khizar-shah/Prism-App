import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-7xl font-extrabold text-red-600">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-900">Oops! Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-600">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      {error && (
        <p className="mt-2 text-sm text-gray-500 italic">
          {error.statusText || error.message}
        </p>
      )}
      <Link
        to="/"
        className="mt-6 rounded-md bg-black px-6 py-2 text-lg font-medium text-white transition-all duration-300 hover:bg-black/80"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
