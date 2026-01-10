import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("galleryUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (username, password) => {
        // Mock login: replace with API call later
        const mockUser = { id: 1, name: username };
        setUser(mockUser);
        localStorage.setItem("galleryUser", JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("galleryUser");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
