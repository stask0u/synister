'use client'

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        return Cookies.get("token") ?? null;
    });

    const [user, setUser] = useState<User | null>(() => {
        const savedUser = Cookies.get("user");
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            Cookies.remove("user");
            return null;
        }
    });

    const login = async (email: string, password: string) => {
        const res = await axios.post("https://synister-backend.onrender.com/users/login", { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        console.log(res.data.user);
        console.log(res.data.token);
        Cookies.set("user", res.data.user);
        Cookies.set("token", res.data.token);
    };

    const register = async (name: string, email: string, password: string) => {
        await axios.post("https://synister-backend.onrender.com/users/register", { name, email, password });
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        Cookies.remove("user");
        Cookies.set("token", "");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}