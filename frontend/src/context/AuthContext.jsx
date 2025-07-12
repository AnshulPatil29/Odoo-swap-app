import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/users/me')
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    localStorage.removeItem('authToken');
                    setToken(null);
                    delete api.defaults.headers.common['Authorization'];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/auth/token', new URLSearchParams({
            username: email,
            password: password,
        }));
        const { access_token } = response.data;
        localStorage.setItem('authToken', access_token);
        setToken(access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };
    
    const refetchUser = () => {
        setLoading(true);
        api.get('/users/me')
            .then(response => setUser(response.data))
            .catch(() => logout())
            .finally(() => setLoading(false));
    };

    const value = { user, token, login, logout, loading, refetchUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;