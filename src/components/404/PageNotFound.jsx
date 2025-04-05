import { Link } from "react-router";

export default function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-6">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
                Go Back Home
            </Link>
        </div>
    );
};