import { use, useEffect, useState } from "react";
import auth from "../../../utils/fetchUser";
import Spinner from "../../Spinner";
import { Link } from "react-router";

export default function Center() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        auth().then(data => {
            setUsers(Object.values(data));
            setLoading(false);
        }).catch(err => setError(err.message)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs hide-scrollbar">
            <div className="flex gap-8 w-max">
                {loading
                    ? <div className="flex flex-col items-center gap-2 cursor-pointer">
                        <Spinner />
                    </div>
                    : users.map(user => {
                        return (
                            <Link to={`/auth/${user._id}/profile`} key={user._id} className="flex flex-col items-center gap-2 cursor-pointer">
                                <img src={user.avatar || "/no-avatar.png"} alt={user.username} width={80} height={80} className="w-20 h-20 rounded-full ring-2" />
                                <span className="font-medium">{user.fullName}</span>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    );
}