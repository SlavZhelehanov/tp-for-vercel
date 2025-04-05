import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import requester from "../../utils/requester";

// const SERVER_URL = "http://localhost:3030/users/register";
const SERVER_URL = `${import.meta.env.VITE_API_URL}/users/register`;
// const SERVER_JSONSTORE_URL = "http://localhost:3030/jsonstore/users/";
const SERVER_JSONSTORE_URL = `${import.meta.env.VITE_API_URL}/jsonstore/users/`;

export default function RegisterForm() {
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const isClickedRef = useRef(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleRegister(event) {
        event.preventDefault();

        if (isClickedRef.current) return;
        isClickedRef.current = true;

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (data.password !== data.repeat_password) {
            setMessage({ text: "Passwords do not match!", type: "error" });
            isClickedRef.current = false;
            return;
        }
        if (!data.birthDate) data.birthDate = "";
        if (!data.avatar) data.avatar = `https://robohash.org/${data.username}`;

        setLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const response = await requester.post(SERVER_URL, { ...data, createdAt: Date.now() }, { signal });
            const res_store = await requester.post(SERVER_JSONSTORE_URL, { ...data, createdAt: Date.now() }, { signal });

            if (!response.code && !res_store.code) {
                setMessage({ text: "Registration successful!", type: "success" });
                login(response);
                navigate("/");
            } else {
                setMessage({ text: response.message || res_store.message || "Registration failed!", type: "error" });
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Request was aborted");
            } else {
                setMessage({ text: error.message, type: "error" });
            }
        } finally {
            setLoading(false);
            isClickedRef.current = false;
        }

        return () => controller.abort();
    }

    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="h-[calc(100vh-96px)] flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Create an Account
                </h2>

                {/* Display Success/Error Message */}
                {message.text && (
                    <div
                        className={`p-3 mb-4 text-white rounded-xl transition-opacity duration-500 ${message.type === "success" ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Repeat Password</label>
                        <input
                            type="password"
                            name="repeat_password"
                            required
                            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    {/* Optional Birth Date Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Birth Date (Optional)</label>
                        <input
                            type="date"
                            name="birthDate"
                            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    {/* Optional Avatar Picture Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Avatar Picture (Optional)</label>
                        <input
                            type="url"
                            name="avatar"
                            placeholder="Enter a link to your avatar"
                            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-400 to-yellow-300 text-white p-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-blue-500 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
