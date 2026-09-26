import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch {
                return null;
            }
        }
        return null;
    });
    const [organizationId, setOrganizationId] = useState(() => {
        return localStorage.getItem('organizationId') || null;
    });
    const [loading] = useState(false);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('organizationId', res.data.organizationId);
        setUser(res.data.user);
        setOrganizationId(res.data.organizationId);
    };

    const signup = async (name, email, password, organizationName) => {
        const res = await api.post('/auth/signup', { name, email, password, organizationName });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('organizationId', res.data.organization.id);
        setUser(res.data.user);
        setOrganizationId(res.data.organization.id);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setOrganizationId(null);
    };

    return (
        <AuthContext.Provider value={{ user, organizationId, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/* eslint-disable-next-line react-refresh/only-export-components */
export function useAuth() {
    return useContext(AuthContext);
}