import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import requester from "../../utils/requester";

// const SERVER_URL = "http://localhost:3030/users/logout";
const SERVER_URL = `${import.meta.env.VITE_API_URL}/users/logout`;

export default function Logout() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (isAuthenticated && token) {

            requester.get(SERVER_URL, null, { headers: { "X-Authorization": token } }).then(res => {
                logout();

                navigate("/");
            }).catch(err => console.log(err));
        }
    }, [token]);

    return (
        <div className="text-center">
            <p>Logging out...</p>
        </div>
    );
}