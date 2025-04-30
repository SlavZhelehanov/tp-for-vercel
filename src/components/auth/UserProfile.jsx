import { useEffect, useState } from "react";

import AllPosts from "../home/center/AllPosts";
import LeftSide from "../home/leftSide/LeftSide";
import RightSide from "../home/rightSide/RightSide";
import requester from "../../utils/requester";
import { useNavigate, useParams } from "react-router";
import auth from "../../utils/fetchUser";
import PageNotFound from "../404/PageNotFound";
import Spinner from "../Spinner";
import { SidebarProvider } from "../../contexts/SidebarContext";

// const SERVER_USERDATA_URL = "http://localhost:3030/users/me";
// const SERVER_FOLLOWERS_URL = "http://localhost:3030/jsonstore/followers";
const SERVER_FOLLOWERS_URL = `${import.meta.env.VITE_API_URL}/jsonstore/followers`;
// const SERVER_FOLLOWING_URL = "http://localhost:3030/jsonstore/followings";
const SERVER_FOLLOWING_URL = `${import.meta.env.VITE_API_URL}/jsonstore/followings`;
// const SERVER_POSTS_URL = "http://localhost:3030/data/posts?owner=";
const COVER_IMAGE = "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=600";

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [userActivites, setUserActivites] = useState({ followers: 0, following: 0, posts: 0 });
    const [notFound, setNotFound] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // if (!token) return navigate("/auth/login");

        const controller = new AbortController();
        const signal = controller.signal;

        // auth().then(data => {
        //     if (!data[id]) {
        //         setNotFound(true);
        //     } else {
        //         setUser(data[id]);
        //     }
        // }).catch(err => {
        //     if (err.name === "AbortError") {
        //         console.log("User data request aborted");
        //     } else {
        //         console.log(err.message);
        //         setNotFound(true);
        //     }
        // });

        async function fetchUserData() {
            try {
                requester.get(`${import.meta.env.VITE_API_URL}/jsonstore/users`, null, { signal }).then(data => setUser(data[id]));
                // auth(token).then(setUser);//requester.get(`http://localhost:3030/users/${id}`, null, { signal });
                const postsData = await requester.get(`${import.meta.env.VITE_API_URL}/data/posts`, null, { signal });

                setPosts(postsData.filter(p => p._ownerId === id));
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("User data request aborted");
                } else {
                    console.log(err.message);
                    setNotFound(true);
                }
            }
        }

        fetchUserData();
        // // Fetch user data
        // requester
        //     .get(SERVER_USERDATA_URL, null, { headers: { "X-Authorization": token }, signal })
        //     .then(setUser)
        //     .catch((err) => {
        //         if (err.name === "AbortError") {
        //             console.log("User data request aborted");
        //         } else {
        //             console.log(err.message);
        //             logout();
        //             return navigate("/auth/login");
        //         }
        //     });

        // Fetch followers, following, and posts data
        Promise.all([
            requester.get(SERVER_FOLLOWERS_URL, null, { signal }),
            requester.get(SERVER_FOLLOWING_URL, null, { signal }),
            // requester.get(`${SERVER_POSTS_URL}${user._id}`, null, { headers: { "X-Authorization": token }, signal }),
        ])
            .then(([followersData, followingData]) => {
                setUserActivites({
                    followers: followersData[id]?.length || 0,
                    following: followingData[id]?.length || 0,
                    // posts: postsData.filter(f => f.owner === user._id)[0]?.posts?.length || 0,
                });
            })
            .catch((err) => {
                if (err.name === "AbortError") {
                    console.log("Activity data request aborted");
                } else {
                    console.error("Error fetching user activities:", err.message);
                }
            });

        // Cleanup function to abort requests
        return () => controller.abort();
    }, [navigate, id]);

    if (notFound) return <PageNotFound />

    if (!user) return <Spinner />

    console.log(user);
    

    return (
        <div className="flex gap-6 pt-6">
            <SidebarProvider><div className="hidden xl:block w-[20%]"><LeftSide type="profile" /></div></SidebarProvider>

            <div className="w-full lg:w-[70%] xl:w-[50%]">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-full h-64 relative">
                            <img src={COVER_IMAGE} alt="Cover" className="w-full h-full rounded-md object-cover" />
                            <img src={user?.avatar || "/no-avatar.png"} width={128} height={128} alt="Avatar" className="bg-amber-50 w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover" />
                        </div>
                        <h1 className="mt-20 mb-4 text-2xl font-medium">{user?.fullName}</h1>
                        <div className="flex items-center justify-center gap-12 mb-4">
                            <div className="flex flex-col items-center">
                                <span className="font-medium">{posts?.length}</span>
                                <span className="text-sm">Posts</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-medium">{userActivites?.followers}</span>
                                <span className="text-sm">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-medium">{userActivites?.following}</span>
                                <span className="text-sm">Following</span>
                            </div>
                        </div>
                    </div>
                    <AllPosts posts={posts} />
                </div>
            </div>

            <SidebarProvider><div className="hidden lg:block w-[30%]"><RightSide user={user} /></div></SidebarProvider>
        </div>
    );
}