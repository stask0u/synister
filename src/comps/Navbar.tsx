'use client'

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping, faMagnifyingGlass, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const CartWindow = dynamic(() => import("@/comps/CartWindow"), {
    ssr: false,
});

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // Added for mobile menu
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { user, logout } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    const handleUserClick = () => {
        if (user) {
            logout();
        } else {
            router.push("/login");
        }
    };

    return (
        <nav className="w-full h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bg-white sticky top-0 z-[100] border-b border-gray-100">
            <div className="z-[110]">
                <Image
                    src="/synisterwear.png"
                    alt="SynisterIcon"
                    width={96}
                    height={96}
                    className="w-20 md:w-24 object-contain"
                />
            </div>

            <div className="hidden md:flex items-center gap-8">
                <div className="relative flex items-center">
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="size-4 cursor-pointer hover:text-pink-500 transition-colors"
                        onClick={() => setSearchOpen(prev => !prev)}
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        className={`
                            ml-3 h-9 bg-transparent
                            border-b border-black/20
                            text-sm outline-none
                            transition-all duration-300 ease-out
                            ${searchOpen ? 'w-56 opacity-100' : 'w-0 opacity-0'}
                        `}
                    />
                </div>

                <ul className="flex gap-8 text-xs uppercase tracking-[0.2em] font-bold">
                    <li className="cursor-pointer hover:text-pink-500 transition"><Link href="/">Home</Link></li>
                    <li className="cursor-pointer hover:text-pink-500 transition"><Link href="/about">About us</Link></li>
                    <li className="cursor-pointer hover:text-pink-500 transition"><Link href="/clothes">Clothes</Link></li>
                </ul>
            </div>

            <div className="flex items-center gap-4 md:gap-6 z-[110]">

                <div className="relative flex items-center">
                    <FontAwesomeIcon
                        icon={faBasketShopping}
                        onClick={() => setCartOpen(prev => !prev)}
                        className="size-5 cursor-pointer hover:text-pink-500 transition-colors"
                    />
                    {cartOpen && <CartWindow />}
                </div>

                <div className="hidden md:flex items-center gap-2 cursor-pointer group" onClick={handleUserClick}>
                    <FontAwesomeIcon icon={faUser} className="size-5 group-hover:text-pink-500 transition-colors" />
                    { user && (
                        <span className="text-sm text-black/70 font-medium">{user.name}</span>
                    )}
                </div>

                {/* HAMBURGER TOGGLE */}
                <button
                    className="md:hidden flex items-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="size-6" />
                </button>
            </div>

            {/* MOBILE MENU OVERLAY */}
            <div className={`
                fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-8
                transition-transform duration-500 ease-in-out md:hidden
                ${menuOpen ? "translate-y-0" : "-translate-y-full"}
            `}>
                {/* Mobile Search inside Menu */}
                <div className="w-[80%] border-b border-gray-200 pb-2 flex items-center">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="size-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="SEARCH..."
                        className="ml-4 w-full bg-transparent outline-none text-lg font-bold uppercase"
                    />
                </div>

                <ul className="flex flex-col items-center gap-6 text-xl font-black uppercase tracking-tighter">
                    <li onClick={() => setMenuOpen(false)}><Link href="/">Home</Link></li>
                    <li onClick={() => setMenuOpen(false)}><Link href="/about">About us</Link></li>
                    <li onClick={() => setMenuOpen(false)}><Link href="/clothes">Clothes</Link></li>
                </ul>

                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="flex items-center gap-3" onClick={handleUserClick}>
                        <FontAwesomeIcon icon={faUser} className="size-6" />
                        <span className="font-bold uppercase tracking-widest text-sm">
                           {
                               user
                                   ? `Logout (${user.name})`
                                   : "Login / Register"
                           }
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}