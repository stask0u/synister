'use client'

import { useAuth } from "../app/context/AuthContext";
import axios from "axios";
import { useState } from "react";

interface Variant {
    size: string;
    stock: number;
}

interface Props {
    productId: string;
    variants: Variant[];
}

export default function AddToCartButton({ productId, variants }: Props) {
    const { token } = useAuth();
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setMessage("Please select a size");
            return;
        }
        try {
            await axios.post(
                "http://localhost:3001/cart",
                { product_id: productId, size: selectedSize, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Added to cart!");
        } catch {
            if (token)
            setMessage("Failed to add to cart");
            else{
                setMessage("You need to be logged in")
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="mt-10">
                <h3 className="text-sm font-medium">Size</h3>
                <div className="mt-4 flex gap-3">
                    {variants.map((variant) => (
                        <button
                            key={variant.size}
                            onClick={() => setSelectedSize(variant.size)}
                            className={`h-11 w-11 rounded-md border text-sm font-medium transition-colors
                                ${selectedSize === variant.size
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-black'
                            }`}
                        >
                            {variant.size}
                        </button>
                    ))}
                </div>
            </div>

            {message && <p className="text-sm text-black/70">{message}</p>}

            <button
                onClick={handleAddToCart}
                className="mt-4 h-14 w-full rounded-md border border-black text-sm font-semibold tracking-wide hover:bg-black hover:text-white transition-colors"
            >
                Add to cart
            </button>
        </div>
    );
}