'use client'

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");
            await login(email, password);
            router.push("/");
        } catch {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md flex flex-col gap-6 px-8">
                <h1 className="text-3xl font-semibold tracking-tight">Login</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-b border-white/40 bg-transparent outline-none text-sm"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-b border-white/40 bg-transparent outline-none text-sm"
                />

                <button
                    onClick={handleLogin}
                    className="h-12 w-full border border-white text-sm font-semibold tracking-wide hover:bg-white hover:text-black transition-colors"
                >
                    Login
                </button>

                <p className="text-sm text-center text-black/60">
                    Don&#39;t have an account?{" "}
                    <Link href="/register" className="text-black underline">Register</Link>
                </p>
            </div>
        </div>
    );
}