
'use client'

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);




    // Autofocus when opened
    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    return (
        <nav className="w-full h-16 flex items-center justify-between px-8 relative">
            <Image
                src="/synisterwear.png"
                alt="SynisterIcon"
                className="w-24 object-contain"
            />

            <div className="flex items-center gap-8">

                <div className="relative flex items-center">

                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="size-4 cursor-pointer"
                        onClick={() => setSearchOpen(prev => !prev)}
                    />

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        className={`
                            ml-3
                            h-9
                            bg-transparent
                            border-b border-white/40
                            text-sm
                            outline-none
                            transition-all duration-300 ease-out
                            ${searchOpen ? 'w-56 opacity-100' : 'w-0 opacity-0'}
                        `}
                    />
                </div>

                <ul className="flex gap-8 text-sm uppercase tracking-wide">
                    <li className="cursor-pointer hover:opacity-70 transition"><Link href="/">Home</Link></li>
                    <li className="cursor-pointer hover:opacity-70 transition"><Link href="/about" >About us</Link></li>
                    <li className="cursor-pointer hover:opacity-70 transition"><Link href="/clothes">Clothes</Link></li>
                </ul>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
                <FontAwesomeIcon icon={faBasketShopping} className="size-5 cursor-pointer" />
                <FontAwesomeIcon icon={faUser} className="size-5 cursor-pointer" />
            </div>
        </nav>
    );
}
