import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import requester from "../../utils/requester";

export default function EditPost() {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [post, setPost] = useState({});

    if (!token) return navigate("/auth/login");

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchPostData() {
            try {
                const response = await requester.get(`${import.meta.env.VITE_API_URL}/data/posts/${id}`, null, { headers: { 'X-Authorization': token }, signal });
                
                setPost(response);
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("Post data request aborted");
                } else {
                    console.error(err.message);
                }
            }
        }

        fetchPostData();

        return () => controller.abort();
    }, [])

    async function formAction(formData) {
        const postData = Object.fromEntries(formData);

        try {
            await requester.put(`${import.meta.env.VITE_API_URL}/data/posts/${id}`, { ...post, ...postData, _id: id }, { headers: { 'X-Authorization': token } });
            return navigate(`/post/${id}/details`);
        } catch (error) {
            console.error("Error updating post:", error.message);
            alert("Error updating post. Please try again.");
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-orange-400">Edit Post</h1>
            <form action={formAction} className="flex flex-col gap-6">

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                    </label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        defaultValue={post?.image}
                        placeholder="Enter the image URL"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Post Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Write your post content here..."
                        rows="6"
                        required
                        defaultValue={post?.content}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:outline-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-300 text-white py-3 rounded-lg font-semibold hover:bg-orange-400 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};