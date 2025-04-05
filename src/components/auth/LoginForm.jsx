import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import requester from "../../utils/requester";

// const SERVER_URL = "http://localhost:3030/users/login";
const SERVER_URL = `${import.meta.env.VITE_API_URL}/users/login`;

export default function LoginForm() {
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const isClickedRef = useRef(false);
    const navigate = useNavigate();
    const { login, updateLikedPosts } = useAuth();

    async function handleLogin(event) {
        event.preventDefault();

        if (isClickedRef.current) return;
        isClickedRef.current = true;

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        setLoading(true);
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const response = await requester.post(SERVER_URL, {
                email: data.email,
                password: data.password,
            }, { signal });

            const allPosts = await requester.get(`${import.meta.env.VITE_API_URL}/data/likes`, null, { headers: { "X-Authorization": response.accessToken }, signal });
            const likedPosts = allPosts?.filter(post => post._ownerId === response._id);

            if (likedPosts) updateLikedPosts(likedPosts);
            if (!response.code) {
                setMessage({ text: "Login successful!", type: "success" });
                login(response);
                return navigate("/");
            } else {
                setMessage({ text: response.message || "Login failed!", type: "error" });
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Request was aborted");
            } else {
                setMessage({ text: "Wrong credentials", type: "error" });
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
                    Enter in your Account
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

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" required className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" required className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-400 to-yellow-300 text-white p-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Signing..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link to="/auth/register" className="text-blue-500 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
