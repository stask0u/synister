'use client'

import "./cartWindowStyles.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartItem {
    _id: string;
    product_id: {
        _id: string;
        name: string;
        images: string[];
        price: number;
    };
    size: string;
    quantity: number;
}

export default function CartWindow() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const router = useRouter();
    useEffect(() => {
        const getCartItems = async () => {
            try {
                const response = await axios.get("https://synister-backend.onrender.com/cart", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCart(response.data.cart?.items ?? []);
                setTotal(response.data.totalAmount ?? 0);
            } catch {
                console.error("Failed to fetch cart");
            } finally {
                setLoading(false);
            }
        };

        if (token) getCartItems();
        else setLoading(false);
    }, [token]);

    const removeItem = async (itemId: string) => {
        try {
            await axios.delete(`https://synister-backend.onrender.com/cart/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCart(prevCart => {
                const updatedCart = prevCart.map(item => {
                    if (item._id !== itemId) return item;
                    return { ...item, quantity: item.quantity - 1 }; // намали с 1
                }).filter(item => item.quantity > 0); // премахни само ако quantity стане 0

                const newTotal = updatedCart.reduce(
                    (sum, item) => sum + item.product_id.price * item.quantity, 0
                );
                setTotal(newTotal);
                return updatedCart;
            });

        } catch {
            console.error("Failed to remove item");
        }
    };

    if (loading) {
        return (
            <div className="cartWindow-block">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="cartWindow-block">
            {!token ? (
                <p className="text-sm opacity-60">You need to be logged in</p>
            ) : cart.length === 0 ? (
                <p className="text-sm opacity-60">Your cart is empty</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item._id} className="flex gap-4 py-3 border-b border-white/10 relative">
                            <Image
                                src={item.product_id.images[0]}
                                alt={item.product_id.name}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex flex-col justify-between flex-1">
                                <p className="text-sm font-medium">{item.product_id.name}</p>
                                <p className="text-xs opacity-60">Size: {item.size}</p>
                                <p className="text-xs opacity-60">Qty: {item.quantity}</p>
                                <p className="text-sm">€{item.product_id.price.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => removeItem(item._id)}
                                className="absolute top-2 right-0 opacity-50 hover:opacity-100 transition"
                            >
                                <FontAwesomeIcon icon={faXmark} className="size-4"/>
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-between mt-4">
                        <p className="text-sm font-medium">Total</p>
                        <p className="text-sm font-medium">€{total.toFixed(2)}</p>
                    </div>

                    <button
                        onClick={() => router.push("/checkout")}
                        className="mt-4 w-full h-11 border border-white text-sm font-semibold hover:bg-white hover:text-black transition-colors"
                    >
                        Checkout
                    </button>
                </>
            )}
        </div>
    );
}