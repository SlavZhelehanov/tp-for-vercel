import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [user, setUser] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) return setIsAuthenticated(true);
    }, []);

    const login = ({ fullname, avatar, email, username, _id, accessToken }) => {
        setIsAuthenticated(true);
        localStorage.setItem("token", accessToken);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
    };

    const updateFollowers = (newFollowers) => {
        setFollowers(newFollowers);
    };

    const updateFollowing = (newFollowing) => {
        setFollowing(newFollowing);
    };

    const updateLikedPosts = (newLikedPosts) => {
        setLikedPosts(newLikedPosts);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, updateLikedPosts, updateFollowers, updateFollowing, followers, following, likedPosts }}>
            {children}
        </AuthContext.Provider>
    );
};
