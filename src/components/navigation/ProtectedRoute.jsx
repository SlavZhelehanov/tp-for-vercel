import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

export const ProtectedFromUserRoute = ({ children }) => {
    const location = useLocation(); 
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth() || {};

    useEffect(() => {
        if (isAuthenticated) return navigate("/");
        return navigate(location);
    }, [isAuthenticated]);

    return children;
};

export const ProtectedForUserRoute = ({ children }) => {
    const location = useLocation();    
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth() || {};

    useEffect(() => {
        if (!isAuthenticated) return navigate("/auth/login");
        return navigate(location);
    }, [isAuthenticated]);

    return children;
};