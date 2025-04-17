import { Route, Routes } from 'react-router';

import './App.css';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedForUserRoute, ProtectedFromUserRoute } from './components/navigation/ProtectedRoute';

import Navigation from "./components/navigation/Navigation";
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import Settings from './components/auth/Settings';
import Logout from './components/auth/Logout';
import HomePage from './components/home/HomePage';
import UserProfile from './components/auth/UserProfile';
import PageNotFound from './components/404/PageNotFound';
import PostDetails from './components/post/Details';
import EditPost from './components/post/Edit';

export default function App() {
    return (
        <AuthProvider>
            <div className="sticky px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 w-full bg-gray-300">
                <Navigation />
            </div>



            <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-slate-100">
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="/auth/:id/profile" element={<UserProfile />} />
                    <Route path="/post/:id/details" element={<PostDetails />} />

                    <Route path="/auth/register" element={<ProtectedFromUserRoute><RegisterForm /></ProtectedFromUserRoute>} />
                    <Route path="/auth/login" element={<ProtectedFromUserRoute><LoginForm /></ProtectedFromUserRoute>} />

                    <Route path="/auth/settings" element={<ProtectedForUserRoute><Settings /></ProtectedForUserRoute>} />
                    <Route path="/post/:id/edit" element={<ProtectedForUserRoute><EditPost /></ProtectedForUserRoute>} />
                    <Route path="/auth/logout" element={<ProtectedForUserRoute><Logout /></ProtectedForUserRoute>} />

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </div>
        </AuthProvider>
    )
}