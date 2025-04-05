import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import requester from "../../../utils/requester";
import auth from "../../../utils/fetchUser";

const SERVER_URL = `${import.meta.env.VITE_API_URL}/jsonstore/followers`;
const TP_COVER_IMAGE = "https://images.pexels.com/photos/3707669/pexels-photo-3707669.jpeg?auto=compress&cs=tinysrgb&w=600&lazy-load";
const USER_COVER_IMAGE = "https://images.pexels.com/photos/29620685/pexels-photo-29620685/free-photo-of-beautiful-waterfall-in-kastamonu-turkey.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load";

export default function ProfileCard() {
    const navigate = useNavigate();
    const [followersCount, setFollowersCount] = useState(0);
    const [userData, setUserData] = useState({});
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            auth(token).then(user => {
                setUserData(user);
                requester.get(SERVER_URL, null, {}).then(data => {
                    setFollowersCount(data[user._id]?.length || 0);
                });
            });
            
        } else requester.get(SERVER_URL, null, {}).then(data => {
            let sum = 0;
            Object.values(data).forEach(item => sum += item.length);
            setFollowersCount(sum);
            setUserData({ cover: TP_COVER_IMAGE, avatar: "/the-place-favicon-32x32.png", fullname: "THE PLACE" });
        });
    }, [token]);

    function handleNavigateToProfile() {
        if (userData._id) return navigate(`/auth/${userData._id}/profile`);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
            <div className="h-20 relative">
                <img src={userData?.cover || USER_COVER_IMAGE} alt="" className="w-full h-full object-cover rounded-md" />
                <img src={userData?.avatar} alt="" width={48} height={48} className="bg-amber-50 w-12 h-12 object-cover rounded-full absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10" />
            </div>
            <div className="h-20 flex flex-col gap-2 items-center">
                <span className="font-semibold">{userData?.fullname}</span>
                <div className="flex items-center gap-4">
                    <div className="flex">
                        <img src="https://images.pexels.com/photos/2446760/pexels-photo-2446760.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={12} height={12} className="w-3 h-3" />
                        <img src="https://images.pexels.com/photos/2446760/pexels-photo-2446760.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={12} height={12} className="w-3 h-3" />
                        <img src="https://images.pexels.com/photos/2446760/pexels-photo-2446760.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={12} height={12} className="w-3 h-3" />
                    </div>
                    <span className="text-xs">{followersCount} Followers</span>
                </div>
                {token && <button className="cursor-pointer bg-orange-400 text-white text-xs p-2 rounded-md" onClick={handleNavigateToProfile}>My Profile</button>}
            </div>
        </div>
    );
}