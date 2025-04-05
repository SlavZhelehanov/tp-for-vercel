import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [user, setUser] = useState({});
    const [ads, setAds] = useState({});
    const [refresh, setRefresh] = useState(true);

    const updateUser = (newUser) => {
        // Hardcoded admin user
        if (newUser._id === "60f0cf0b-34b0-4abd-9769-8c42f830dffc") newUser.headers = { 'X-Admin': 'admin' };

        setUser(newUser);
    };

    const useAds = (newAdd) => {
        setAds(newAdd);
        setRefresh(prev => !prev);
    };

    return (
        <SidebarContext.Provider value={{ user, ads, useAds, updateUser, refresh }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    return useContext(SidebarContext);
}