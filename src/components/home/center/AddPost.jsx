import { useAuth } from "../../../contexts/AuthContext";
import requester from "../../../utils/requester";
import { useEffect, useState, useRef } from "react";
import auth from "../../../utils/fetchUser";

const SERVER_URL = `${import.meta.env.VITE_API_URL}/data/posts`;

export default function AddPost({ useAllPosts }) {
    const { isAuthenticated } = useAuth();
    const isSubmitting = useRef(false);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        auth(token).then(setUser);
    }, []);

    async function submintAction(formData) {
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        const content = Object.fromEntries(formData);

        if (content.image.trim() && content.content.trim()) {
            try {
                const post = await requester.post(SERVER_URL, {...content, fullName: user.fullName,avatar: user.avatar, }, {headers: { 'X-Authorization': token }, });

                console.log("New post created:", post);
                
                if (useAllPosts) useAllPosts(post);
            } catch (err) {
                console.error("Error creating post:", err.message);
            } finally {
                isSubmitting.current = false; // Reset the submission state
            }
        } else {
            console.error("Both image and content fields are required.");
            isSubmitting.current = false; // Reset the submission state
        }
    }

    return (
        <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
            {isAuthenticated
                ? <>
                    <img src={user?.avatar || "/no-avatar.png"} alt="Avatar" width={48} height={48} className="w-12 h-12 object-cover rounded-full" />

                    <div className="flex-1">
                        <form action={submintAction} className="flex flex-col gap-4">
                            <input type="url" name="image" id="url" placeholder="Add image url..." className="bg-slate-100 rounded-lg p-2" />
                            <textarea placeholder="Tell me a story" name="content" className="bg-slate-100 rounded-lg flex-1 p-2"></textarea>
                            {/* <img src="/emoji.jpg" alt="" width={20} height={20} className="w-5 h-5 cursor-pointer self-end" /> */}
                            <button className="cursor-pointer hover:bg-orange-100 hover:text-blue-500 rounded-lg p-2 bg-orange-400 text-white">Send</button>
                        </form>

                        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap"></div>
                    </div>
                </>
                :
                <div className="text-center w-full">
                    <h1 className="text-lg font-semibold text-orange-400">The most recent posts</h1>
                    <p className="text-sm text-gray-500">Stay tuned for updates!</p>
                </div>
            }

        </div>
    );
}