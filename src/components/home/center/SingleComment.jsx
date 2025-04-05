export default function SingleComment({ commentData }) {
    return (
        <div className="">
            <div className="flex gap-4 justify-between mt-6">

                <img src={commentData.avatar} alt="" width={40} height={40} className="w-10 h-10 rounded-full" />

                <div className="flex flex-col gap-2 flex-1">
                    <span className="font-medium">{commentData.fullName}</span>
                    <p>{commentData.content}</p>
                    <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-4">
                            {/* <img src="like.jpg" alt="" width={16} height={16} className="cursor-pointer" />
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500">123 Likes</span> */}
                        </div>
                    </div>
                </div>

                {/* <img src="/more.png" alt="" width={16} height={16} className="cursor-pointer w-4 h-4" /> */}

            </div>

        </div>
    );
};