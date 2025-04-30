import { useEffect, useState } from "react";
import requester from "../../utils/requester";
import { useSidebarContext } from "../../contexts/SidebarContext";
import auth from "../../utils/fetchUser";

export default function Promotion({ size }) {
    const { user, ads, useAds, updateUser, refresh } = useSidebarContext() || {};
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(ads || {});
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) auth(token).then(updateUser);
        requester.get(`${import.meta.env.VITE_API_URL}/jsonstore/ads`, null, {}).then(useAds);
        if (!isEditing) setContent(ads);
    }, [isEditing]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    console.log(content);
    

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm">
            <div className="flex items-center justify-between text-gray-500 font-medium">
                <span>Ads</span>
                {user?.headers && (
                    <img
                        src="/more.png"
                        alt=""
                        width={16}
                        height={16}
                        className="cursor-pointer"
                        onClick={handleEditToggle}
                    />
                )}
            </div>

            <div className={`flex flex-col mt-4 ${size === "sm" ? "gap-2" : "gap-4"}`}>
                
                <div className={`relative w-full ${size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"}`}>
                    {isEditing ? (
                        <input
                            type="url"
                            value={content.imageUrl}
                            onChange={(e) => setContent({ ...content, imageUrl: e.target.value })}
                            placeholder="Enter image URL"
                            className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                        />
                    ) : (
                        <img
                            src={content?.imageUrl || "/no-avatar.png"}
                            alt="Promotion"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    )}
                </div>
                
                <div className="flex items-center gap-4">
                    {isEditing ? (
                        <input
                            type="url"
                            value={content.avatarUrl}
                            onChange={(e) => setContent({ ...content, avatarUrl: e.target.value })}
                            placeholder="Enter avatar URL"
                            className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                        />
                    ) : (
                        <img
                            src={content?.avatarUrl || "/no-avatar.png"}
                            alt="Avatar"
                            width={24}
                            height={24}
                            className="object-cover rounded-full w-6 h-6"
                        />
                    )}
                    {isEditing ? (
                        <input
                            type="text"
                            value={content.title}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                            className="border border-gray-300 rounded-lg p-1 text-sm"
                        />
                    ) : (
                        <span className="text-orange-400 font-medium">{content?.title}</span>
                    )}
                </div>
                
                {isEditing ? (
                    <textarea
                        value={content.description}
                        onChange={(e) => setContent({ ...content, description: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                        rows={size === "sm" ? 2 : size === "md" ? 4 : 6}
                    />
                ) : (
                    <p className={size === "sm" ? "text-xs" : "text-sm"}>{content?.description}</p>
                )}

                {isEditing && (
                    <input
                        type="text"
                        placeholder="Your website..."
                        value={content.website}
                        onChange={(e) => setContent({ ...content, website: e.target.value })}
                        className="border border-gray-300 rounded-lg p-1 text-sm"
                    />
                )}
                
                {isEditing ? (
                    <button
                        onClick={() => {
                            useAds(content);
                            setIsEditing(false);
                        }}
                        className="cursor-pointer bg-blue-500 text-white p-2 text-xs rounded-lg"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        onClick={() => window.open(content.website || "https://example.com", "_blank")}
                        className="cursor-pointer bg-gray-200 text-gray-500 p-2 text-xs rounded-lg"
                    >
                        Learn more
                    </button>
                )}
            </div>
        </div>
    );
}