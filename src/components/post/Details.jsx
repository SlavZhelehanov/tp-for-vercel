import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router";
import PageNotFound from "../404/PageNotFound";
import auth from "../../utils/fetchUser";
import requester from "../../utils/requester";
import { useAuth } from "../../contexts/AuthContext";
import Comments from "../home/center/Comments";

export default function PostDetails() {
    const navigate = useNavigate();
    const [owner, setOwner] = useState({});
    const [notFound, setNotFound] = useState(false);
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const { updateLikedPosts, likedPosts } = useAuth();

    const [post, setPost] = useState({
        "_ownerId": "",
        "fullName": "",
        "avatar": "",
        "image": "",
        "content": "",
        "_createdOn": 0,
        "_id": ""
    });

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchPostData() {
            try {
                const response = await requester.get(`${import.meta.env.VITE_API_URL}/data/posts/${id}`, null, { signal });

                if (!response) return setNotFound(true);
                if (token) {
                    const userData = await auth(token);
                    setOwner(userData);

                    if (userData._id === post._ownerId && post.likes && !post.likes.includes(userData._id)) {
                        setIsLiked(true);
                    }
                }
                const searchParams = new URLSearchParams({
                    where: `postId="${id}"`,
                    sortBy: "_createdOn",
                    load: `author=_ownerId:users`,
                });
                const allComments = await requester.get(`${import.meta.env.VITE_API_URL}/data/comments?${searchParams.toString()}`, null, { signal });

                setComments(allComments);
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
    }, [token, isLiked]);

    if (notFound) return <PageNotFound />;

    function handleEdit() {
        if (!owner || owner._id !== post._ownerId) return;
        return navigate(`/post/${id}/edit`);
    }

    async function handleDelete() {
        if (owner._id !== post._ownerId) return;

        try {
            await requester.delete(`${import.meta.env.VITE_API_URL}/data/posts/${id}`, null, { headers: { "X-Authorization": token } });
            return navigate("/");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please try again.");
        }
        return navigate(`/post/${id}/edit`);
    }

    function handleEdit() {
        return navigate(`/post/${id}/edit`);
    }

    async function getComment(commentContent) {
        const formData = Object.fromEntries(commentContent);
        try {
            setComments(prev => [...prev, { ...formData, _ownerId: owner._id, avatar: owner.avatar, postId: id }]);
            await requester.post(`${import.meta.env.VITE_API_URL}/data/comments`, { ...formData, _ownerId: owner._id, avatar: owner.avatar, postId: id }, { headers: { "X-Authorization": token } });
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment. Please try again.");
        }
    }

    // TODO: Implement like/unlike functionality
    // async function handleLike() {
    //     if (!owner || owner._id === post._ownerId) return;

    //     try {
    //         if (!post.likes?.includes(owner._id)) {
    //             post.likes ? post.likes.push(owner._id) : post.likes = [owner._id];

    //             await requester.put(`http://localhost:3030/data/posts/${post._id}`, { ...post, _id: id }, { headers: { 'X-Authorization': token }, });
    //             setIsLiked(true);
    //         }
    //     } catch (error) {
    //         console.error("Error liking post:", error);
    //         alert("Failed to like post. Please try again.");
    //     }
    // }

    // async function handleUnLike() {
    //     if (!owner || owner._id === post._ownerId) return;

    //     try {
    //         if (post.likes && post.likes.includes(owner._id)) {
    //             post.likes ? post.likes = post.likes.filter(id => id != owner._id) : post.likes = [];
    //             await requester.put(`http://localhost:3030/data/posts/${post._id}`, { ...post, _id: id }, { headers: { 'X-Authorization': token }, });
    //             setIsLiked(false);
    //         }
    //     } catch (error) {
    //         console.error("Error unliking post:", error);
    //         alert("Failed to unlike post. Please try again.");
    //     }
    // }

    const formattedDate = new Date(post._createdOn).toLocaleDateString();

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
            <div className="mb-8">
                <img
                    src={post.image || "/no-avatar.png"}
                    alt="Post"
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                />
            </div>

            <div className="flex items-center gap-6 mb-8">
                <img
                    src={post.avatar || "/no-avatar.png"}
                    alt="Creator"
                    className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{post.fullName}</h2>
                    <p className="text-md text-gray-500">Created on: {formattedDate}</p>
                </div>
            </div>

            <div className="mb-8 text-center">
                <p className="text-gray-700 text-xl leading-relaxed">{post.content}</p>
            </div>

            {owner?._id === post._ownerId && <div className="flex mb-10 gap-6 items-center justify-center">
                {/* {owner._id === post._ownerId
                    ? (<>
                        <button onClick={handleEdit} className="cursor-pointer px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition">
                            Edit
                        </button>
                        <button onClick={handleDelete} className="cursor-pointer px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
                            Delete
                        </button>
                    </>)
                    : isLiked
                        ? (<button onClick={handleUnLike} className="cursor-pointer px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
                            Unlike
                        </button>)
                        : (<button onClick={handleLike} className="cursor-pointer px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
                            Like
                        </button>)
                } */}
                <button onClick={handleEdit} className="cursor-pointer px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition">
                    Edit
                </button>
                <button onClick={handleDelete} className="cursor-pointer px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
                    Delete
                </button>
            </div>}

            <Comments comments={comments} owner={owner} getComment={getComment} />
        </div>
    )
}