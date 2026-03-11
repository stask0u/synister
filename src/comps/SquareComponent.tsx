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
            className="relative group w-full h-80 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Image
                src={hovered && hoverImagePath ? hoverImagePath : imagePath}
                alt={squareHeading}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className={`object-cover transition-transform duration-500 ease-out ${
                    hovered ? "scale-105" : "scale-100"
                }`}
            />

            <div
                className={`absolute inset-0 transition-colors duration-500 ${
                    hovered ? "bg-black/20" : "bg-black/0"
                }`}
            ></div>
            <h2
                className={`
          absolute bottom-5 left-1/2 -translate-x-1/2 px-6 py-2 text-white font-space font-semibold text-lg
          border-2 border-white rounded-md
          transition-all duration-500
          ${hovered ? "border-pink-500 translate-y-[-5px] tracking-wider" : ""}
        `}
            >
                {squareHeading}
            </h2>
        </a>
    );
}
