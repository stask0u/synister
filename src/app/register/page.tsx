'use client'

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        try {
            setError("");
            await register(name, email, password);
            router.push("/login");
        } catch {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md flex flex-col gap-6 px-8">
                <h1 className="text-3xl font-semibold tracking-tight">Register</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 border-b border-white/40 bg-transparent outline-none text-sm"
                />
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
                    onClick={handleRegister}
                    className="h-12 w-full border border-white text-sm font-semibold tracking-wide hover:bg-white hover:text-black transition-colors"
                >
                    Register
                </button>

                <p className="text-sm text-center text-black/60">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black underline">Login</Link>
                </p>
            </div>
        </div>
    );
}