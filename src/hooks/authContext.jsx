import React, { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [cookies, setCookies, removeCookies] = useCookies(['token-auth']);
    const [user, setUser] = useState()

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch('https://blog.kata.academy/api/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${cookies['token-auth']}`,
                    },
                });
                const { user } = await response.json()
                setUser(user)
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    setUser({})
                    removeCookies('token-auth');
                }
            } catch (error) {
                setIsAuthenticated(false);
                removeCookies('token-auth');
            }
        };

        if (cookies['token-auth']) {
            validateToken();
        } else {
            setIsAuthenticated(false);
        }
    }, [cookies, removeCookies]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, cookies, setCookies, removeCookies, user }}>
            {children}
        </AuthContext.Provider>
    );
};