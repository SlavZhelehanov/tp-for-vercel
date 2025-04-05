import { useEffect, useState } from "react";
import { Link } from "react-router";
import auth from "../../../utils/fetchUser";
import requester from "../../../utils/requester";
import Spinner from "../../Spinner";

export default function FriendRequests() {
    const [userId, setUserId] = useState(null);
    const [friendRequests, setFriendRequests] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const token = localStorage.getItem("token");

        if (token) {
            (async () => {
                try {
                    const data = await auth(token);
                    setUserId(data._id);
                    setLoading(true);
                    setError(null);

                    let users = await requester.get(`${import.meta.env.VITE_API_URL}/jsonstore/users`, null, { signal });
                    users = Object.values(users).filter(user => user._id !== data._id);

                    let oldFollowers = await requester.get(`${import.meta.env.VITE_API_URL}/jsonstore/followers`, null, { signal });
                    oldFollowers = oldFollowers[data._id] || [];
                    setFollowers(oldFollowers); // Initialize followers state

                    const nonEquals = users.filter(item1 => !oldFollowers.some(item2 => item1._id === item2._id)).concat(oldFollowers.filter(item2 => !users.some(item1 => item1._id === item2._id)));
                    const randomCount = Math.floor(Math.random() * nonEquals.length) + 1;
                    const shuffledArray = nonEquals.sort(() => Math.random() - 0.5);
                    const randomItems = shuffledArray.slice(0, randomCount);

                    setFriendRequests(randomItems);
                    setLoading(false);
                } catch (err) {
                    if (err.name === "AbortError") {
                        console.log("User data request aborted");
                    } else {
                        console.log(err.message);
                        setError(err.message);
                    }
                } finally {
                    setLoading(false);
                }
            })();
        }

        return () => abortController.abort();
    }, []);

    function handleReject(userId) {
        setFriendRequests(prevRequests => prevRequests.filter(user => user._id !== userId));
    }

    async function handleAccept(userId) {
        const acceptedUser = friendRequests.find(user => user._id === userId);

        if (acceptedUser) {
            setLoading(true);
            setError(null);

            console.log({...followers, ...acceptedUser});
            

            try {
                // const newData = await requester.put(`http://localhost:3030/jsonstore/followers/${userId}`, { ...followers, acceptedUser }, {});
                // console.log(newData);
                
                // setFollowers(newData);
                // setFriendRequests(prevRequests => prevRequests.filter(user => user._id !== userId));
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log("User data request aborted");
                } else {
                    console.log(error.message);
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }            
        }
    }

    if (!userId || friendRequests.length === 0) return null;

    return (
        <>
            {loading
                ? <Spinner />
                : error
                    ? <div className="text-red-500 text-center">{error}</div>
                    : <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
                        <div className="flex justify-between items-center font-medium">
                            <span className="text-gray-500">Friend Requests</span>
                            <Link to="/" className="text-orange-400 text-xs">See all</Link>
                        </div>

                        {friendRequests.map(user => {
                            return (
                                <div className="flex items-center justify-between" key={user._id}>
                                    <div className="flex flex-center gap-4">
                                        <img src={user.avatar} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                                        <span className="font-semibold">{user.fullName}</span>
                                    </div>

                                    <div className="flex gap-3 justify-end">
                                        <img
                                            src="/accept.jpg"
                                            alt="Accept"
                                            width={30}
                                            height={30}
                                            className="cursor-pointer"
                                            onClick={() => handleAccept(user._id)} // Accept handler
                                        />
                                        <img
                                            src="/reject.jpg"
                                            alt="Reject"
                                            width={20}
                                            height={20}
                                            className="cursor-pointer"
                                            onClick={() => handleReject(user._id)} // Reject handler
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>}
        </>
    );
}