import AddPost from "./center/AddPost";
import Center from "./center/Stories";
import LeftSide from "./leftSide/LeftSide";
import RightSide from "./rightSide/RightSide";
import AllPosts from "./center/AllPosts";
import { useState, useEffect } from "react";
import requester from "../../utils/requester";
import { SidebarProvider } from "../../contexts/SidebarContext";

const SERVER_POSTS_URL = `${import.meta.env.VITE_API_URL}/data/posts`;
const SERVER_USER_URL = `${import.meta.env.VITE_API_URL}/users/me`;

export default function HomePage() {
    const [allPosts, setAllPosts] = useState([]);
    const [user, setUser] = useState({});
    const [ads, setAds] = useState({});
    const token = localStorage.getItem("token");

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        requester.get(SERVER_POSTS_URL, null, { signal })
            .then(setAllPosts)
            .catch(err => {
                if (err.name === "AbortError") {
                    console.log("Posts request aborted");
                } else {
                    console.log(err.message);
                }
            });

        requester.get(`${import.meta.env.VITE_API_URL}/jsonstore/ads`, null, {}).then(setAds);

        if (token) {
            requester.get(SERVER_USER_URL, null, { headers: { 'X-Authorization': token }, signal })
                .then(setUser)
                .catch(err => {
                    if (err.name === "AbortError") {
                        console.log("User request aborted");
                    } else {
                        console.log(err.message);
                    }
                });
        }

        return () => controller.abort();
    }, []);

    function addPostHandler(data) {
        setAllPosts(prev => [data, ...prev]);
    }

    async function useAds(addContent) {
        try {
            const newAds = await requester.put(`${import.meta.env.VITE_API_URL}/jsonstore/ads`, { ...addContent }, { headers: { ...user?.headers, "X-Authorization": token } });
            setAds(newAds);
        } catch (error) {
            console.log(err.message);
            alert("Error to update ads")
        }
    }    

    return (
        <div className="flex gap-6 pt-6">
            <SidebarProvider><div className="sticky hidden xl:block w-[20%]"><LeftSide type="home"/></div></SidebarProvider>

            <div className="w-full lg:w-[70%] xl:w-[50%]">
                <div className="flex flex-col gap-6">
                    <Center />
                    <AddPost useAllPosts={addPostHandler} />
                    <AllPosts posts={allPosts} />
                </div>
            </div>

            <SidebarProvider><div className="sticky hidden lg:block w-[30%]"><RightSide/></div></SidebarProvider>
        </div>
    );
}