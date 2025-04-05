import { useAuth } from "../../../contexts/AuthContext";
import SingleComment from "./SingleComment";

export default function Comments({
    comments,
    owner,
    getComment
}) {
    const { isAuthenticated } = useAuth();

    return (
        <div className="">

            {isAuthenticated && <form action={getComment} className="flex items-center gap-4">
                <img src={owner?.avatar} alt="" width={32} height={32} className="w-8 h-8 rounded-full" />

                <div className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
                    <input type="text" name="content" placeholder="Write a comment..." className="bg-transparent outline-none flex-1" />
                    <img src="emoji.jpg" alt="" width={16} height={16} className="cursor-pointer" />
                    <button className="cursor-pointer rounded-xl bg-orange-300 text-white hover:bg-orange-400 w-20 h-12">Sent</button>
                </div>
            </form>}

            {comments?.map(commentData => <SingleComment key={commentData._id} commentData={commentData} />)}

        </div>
    );
}