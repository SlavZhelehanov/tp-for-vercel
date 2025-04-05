import { useEffect, useState } from "react";
import { Link } from "react-router";

import BurgerMenu from "./BurgerMenu";
import { FaHouse, FaUsers, FaBookOpenReader, FaRegCircleUser, FaRegMessage, FaRegBell, FaCircleUser, FaGear, FaArrowRightFromBracket, FaSistrix } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthContext";
import auth from "../../utils/fetchUser";

export default function Navigation() {
    const { isAuthenticated } = useAuth();
    const [showDialog, setShowDialog] = useState(false);
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) auth(token).then(user => setProfileImage(user.avatar));
    }, [isAuthenticated]);

    return (
        <div className="flex items-center justify-between h-24">

            <div className="md:hidden lg:block w-[20%]">
                <Link to="/" className="font-bold text-xl text-orange-500">THE PLACE</Link>
            </div>

            <div className="hidden md:flex w-[50%] text-sm items-center gap-2">
                <div className="flex gap-6 text-gray-600">
                    <Link to="/" className="flex items-center gap-2"><FaHouse /><span>Home</span></Link>
                    {/* //TODO: When add databse */}
                    {/* <Link to="/" className="flex items-center gap-2"><FaUsers /><span>Friends</span></Link>
                    <Link to="/" className="flex items-center gap-2"><FaBookOpenReader /><span>Stories</span></Link> */}
                </div>
                {/* //TODO: When add databse */}
                {/* <div className="flex items-center p-2 bg-slate-100 rounded-lg w-full">
                    <FaSistrix className="text-gray-500 mr-2 text-lg" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none text-gray-600 flex-1"
                    />
                </div> */}
            </div>

            <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
                {isAuthenticated
                    ? <div className="flex items-center gap-6">
                        {/* //TODO: When add databse */}
                        {/* <div className="cursor-pointer"><FaUsers /></div>
                        <div className="cursor-pointer"><FaRegMessage /></div>
                        <div className="cursor-pointer"><FaRegBell /></div> */}
                        <div className="cursor-pointer" onClick={() => setShowDialog(prev => !prev)}><FaCircleUser /></div>
                        {showDialog && (
                            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-20" onClick={() => setShowDialog(prev => !prev)}>
                                <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-full mx-auto mb-4" />
                                <div className="flex flex-col items-start gap-2">
                                    <Link to="/auth/settings" className="flex items-center gap-2"><FaGear /><span>Account Details</span></Link>
                                    <Link to="/auth/logout" className="flex items-center gap-2"><FaArrowRightFromBracket /><span>Logout</span></Link>
                                </div>
                            </div>
                        )}
                    </div>
                    :
                    <div>
                        <Link to="/auth/login" className="flex items-center gap-2"><FaRegCircleUser /><span>Login</span></Link>
                    </div>
                }
                <BurgerMenu />
            </div>

        </div>
    );
}