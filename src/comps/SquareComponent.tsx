"use client";

import { useState } from "react";
import Image from "next/image";

interface SquareProps {
    imagePath: string;
    hoverImagePath?: string;
    squareHeading: string;
    link: string;
}

export default function SquareComponent({
                                            imagePath,
                                            hoverImagePath,
                                            squareHeading,
                                            link,
                                        }: SquareProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            href={link}
            className="relative group w-full aspect-[4/5] rounded-sm overflow-hidden shadow-sm block"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Image
                src={hovered && hoverImagePath ? hoverImagePath : imagePath}
                alt={squareHeading}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className={`object-cover transition-transform duration-700 ease-in-out ${
                    hovered ? "scale-110" : "scale-100"
                }`}
            />

            {/* Darken overlay on hover */}
            <div className={`absolute inset-0 transition-opacity duration-300 bg-black/10 ${hovered ? "opacity-100" : "opacity-0"}`} />

            {/* Centered Heading Box */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className={`
                    border border-white bg-black/20 backdrop-blur-[2px] 
                    text-white text-center py-2 px-3 w-full max-w-[140px]
                    transition-all duration-300 pointer-events-none
                    ${hovered ? "border-pink-500 scale-105" : "border-white"}
                `}>
                    <h2 className="text-[11px] sm:text-xs uppercase tracking-widest font-bold leading-tight">
                        {squareHeading}
                    </h2>
                </div>
            </div>
        </a>
    );
}