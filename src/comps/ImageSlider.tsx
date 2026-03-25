"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImageSlider({
                                               images,
                                               productName,
                                           }: {
    images: string[];
    productName: string;
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="flex flex-col gap-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                <Image
                    src={images[activeIndex]}
                    alt={productName}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized
                />
            </div>

            <div className="flex gap-4">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`relative h-20 w-20 overflow-hidden rounded-md border
              ${
                            activeIndex === index
                                ? "border-black"
                                : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                    >
                        <Image
                            src={img}
                            alt={`${productName} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
