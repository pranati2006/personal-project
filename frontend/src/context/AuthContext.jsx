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

    const login = async (username, password) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                const loggedUser = data.user;
                setUser(loggedUser);
                localStorage.setItem("galleryUser", JSON.stringify(loggedUser));
                return { success: true };
            } else {
                return { success: false, error: "Invalid username or password" };
            }
        } catch (err) {
            console.error(err);
            return { success: false, error: "Server error" };
        }
    };
    const create = async (username, password) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                const newUser = { name: username, id: data.user_id };
                setUser(newUser);
                localStorage.setItem("galleryUser", JSON.stringify(newUser));
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            console.error(err);
            return { success: false, error: "Server error" };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("galleryUser");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, create }}>
            {children}
        </AuthContext.Provider>
    );
};
