import { useEffect, useState } from "react";
import Post from "./Post";

export default function AllPosts({ posts }) {
    const [printPosts, setPrintPosts] = useState([]);

    useEffect(() => {
        setPrintPosts(posts);
    }, [posts]);
    return (
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
            {printPosts && printPosts.map(post => <Post key={post._id} post={post} />)}
        </div>
    );
}