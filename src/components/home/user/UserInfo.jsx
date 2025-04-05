import { Link } from "react-router";
import { FaPaperclip, FaRegCalendarMinus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import auth from "../../../utils/fetchUser";
import UpdateUser from "../../auth/UpdateUser";
// import UserInfoCardInteraction from "../rightSide/UserInfoCardInteraction";

export default function UserInfo({ user }) {
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) auth(token).then(data => setCurrentUserId(data._id));
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">User Information</span>
                {currentUserId === user._id
                    ? <UpdateUser />
                    : <Link to="/" className="text-orange-400 text-xs">See all</Link>
                }
            </div>

            <div className="flex flex-col gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="text-xl text-black">{user.username}</span>
                    <span className="text-sm">{user.email}</span>
                </div>
                {user.description && <p>{user.description}</p>}

                {user.city && <div className="flex items-center gap-2">
                    <img src="/city.png" alt="" width={16} height={16} />
                    <span>Living in <b>{user.city}</b></span>
                </div>}
                {user.school && <div className="flex items-center gap-2">
                    <img src="/school.png" alt="" width={16} height={16} />
                    <span>Went to <b>{user.school}</b></span>
                </div>}
                {user.work && <div className="flex items-center gap-2">
                    <img src="/company.png" alt="" width={16} height={16} />
                    <span>Works to <b>{user.work}</b></span>
                </div>}

                <div className="flex items-center justify-between">
                    {user.website && <div className="flex gap-1 items-center">
                        <FaPaperclip />
                        <Link to={user.website} className="text-orange-400 font-medium">{user.website}</Link>
                    </div>}
                    <div className="flex gap-1 items-center">
                        <FaRegCalendarMinus />
                        <span>Joined {new Date(user.createdAt).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                </div>
                {/* <UserInfoCardInteraction
                    userId={user._id}
                    // currentUserId={currentUserId}
                    // isBlocked={isBlocked}
                    // isFollowing={isFollowing} 
                    // isFollowingSent={isFollowingSent}
                /> */}
            </div>
        </div>
    );
}