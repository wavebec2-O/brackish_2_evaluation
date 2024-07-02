import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/me');
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/users/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    const register = async (name, email, password, skills) => {
        const res = await api.post('/users/register', { name, email, password, skills });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
    };

    return (
        <AuthContext.Provider value={{ user, login, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
