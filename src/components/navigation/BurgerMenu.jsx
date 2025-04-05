import { useState } from "react";
import { Link } from "react-router";
import { FaHouse, FaUsers, FaUserGroup, FaBookOpenReader, FaUserPlus, FaArrowRightToBracket, FaArrowRightFromBracket } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthContext";

export default function BurgerMenu() {
    const { isAuthenticated } = useAuth() || {};
    const [spread, setSpread] = useState();

    return (
        <div className="md:hidden">
            <div className="flex flex-col gap-[4px] cursor-pointer" onClick={() => setSpread(prev => !prev)}>
                <div className={`w-6 h-1 bg-orange-300 rounded-sm ${spread ? "rotate-45" : ""} origin-left ease-in-out duration-500`} />
                <div className={`w-6 h-1 bg-orange-300 rounded-sm ${spread ? "opacity-0" : ""} ease-in-out duration-500`} />
                <div className={`w-6 h-1 bg-orange-300 rounded-sm ${spread ? "-rotate-45" : ""} origin-left ease-in-out duration-500`} />
            </div>

            {spread &&
                <div className="absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10" onClick={() => setSpread(prev => !prev)}>
                    <Link to="/" className="flex items-center gap-2"><FaHouse className="text-orange-400" /><span>Home</span></Link>
                    {isAuthenticated ? (<>
                        <Link to="/" className="flex items-center gap-2"><FaUserGroup className="text-orange-400" /><span>Groups</span></Link>
                        <Link to="/" className="flex items-center gap-2"><FaBookOpenReader className="text-orange-400" /><span>Stories</span></Link>
                        <Link to="/" className="flex items-center gap-2"><FaUsers className="text-orange-400" /><span>Friends</span></Link>
                        <Link to="/auth/logout" className="flex items-center gap-2"><FaArrowRightFromBracket className="text-orange-400" /><span>Logout</span></Link>
                    </>) : (<>
                        <Link to="/auth/register" className="flex items-center gap-2"><FaUserPlus className="text-orange-400" /><span>Register</span></Link>
                        <Link to="/auth/login" className="flex items-center gap-2"><FaArrowRightToBracket className="text-orange-400" /><span>Login</span></Link>
                    </>)}
                </div>
            }
        </div >
    );
}