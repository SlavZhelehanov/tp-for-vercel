export default function UserInfoCardInteraction({
    userId,
    currentUserId,
    // isBlocked,
    // isFollowing,
    // isFollowingSent={isFollowingSent}
}) {
    return (
        <>
            <form action="">
                <button className="w-full cursor-pointer bg-orange-400 text-white text-sm rounded-md p-2">
                    {/* {isFollowing
                    ? "Following"
                    : isFollowingSent
                        ? "Follow Request Sent"
                        : "Follow"} */}
                    Follow
                </button>
            </form>
            <form action="" className="self-end">
                <span className="text-red-400 self-end text-xs cursor-pointer">
                    {/* {isBlocked ? "Unblock User" : "Block User"} */}
                    Block User
                </span>
            </form>
        </>
    );
}