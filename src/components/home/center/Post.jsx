// import Comments from "./Comments";

import { Link } from "react-router";

export default function Post({ post }) {
    return (
        <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={post.avatar || "/no-avatar.png"} alt="Avatar" width={40} height={40} className="w-10 h-10 rounded-full" />
                    <span className="font-medium">{post.fullName}</span>
                </div>
                <Link to={`/post/${post._id}/details`}><img src="/more.png" alt="more" width={16} height={16} className="cursor-pointer" /></Link>
            </div>

            <div className="flex flex-col gap-4">
                <div className="w-full min-h-96 relative">
                    <img src={post.image} alt="post image" className="w-full h-full object-cover rounded-md" />
                </div>
                <p>{post.content}</p>
            </div>

            <div className="flex items-center justify-between text-sm my-4">

                <div className="flex gap-8">
                    {/* <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <img src="/like.jpg" alt="" width={16} height={16} className="cursor-pointer" />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">123<span className="hidden md:inline"> Likes</span></span>
                    </div> */}

                    {/* <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <img src="/comment.png" alt="" width={16} height={16} className="cursor-pointer" />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">123<span className="hidden md:inline"> Comments</span></span>
                    </div> */}
                </div>

                {/* <div className="">
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <img src="/share.png" alt="" width={16} height={16} className="cursor-pointer" />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">123<span className="hidden md:inline"> Shares</span></span>
                    </div>
                </div> */}

            </div>

            {/* <Comments /> */}

        </div>
    );
}