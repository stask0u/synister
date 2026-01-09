import { useState } from "react";

interface SquareProps {
    imagePath: string;       // default image
    hoverImagePath?: string; // optional image to show on hover
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
            {/* Background image */}
            <div
                className={`
          absolute inset-0 bg-center bg-cover transform transition-transform duration-500 ease-out
          ${hovered ? "scale-105" : "scale-100"}
        `}
                style={{
                    backgroundImage: `url(${hovered && hoverImagePath ? hoverImagePath : imagePath})`,
                }}
            />

            {/* Optional gradient overlay for depth */}
            <div
                className={`absolute inset-0 transition-colors duration-500 ${
                    hovered ? "bg-black/20" : "bg-black/0"
                }`}
            ></div>

            {/* Heading as outlined button */}
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
