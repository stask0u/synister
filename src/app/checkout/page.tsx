'use client'

import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,{
    apiVersion:"2024-06-20"
});
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";


function CheckoutForm({ orderId }: { orderId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!stripe || !elements) return;
        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-success?orderId=${orderId}`
            }
        });

        if (error) {
            setError(error.message ?? "Payment failed");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <PaymentElement />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                onClick={handleSubmit}
                disabled={loading || !stripe}
                className="h-12 w-full border border-white text-sm font-semibold tracking-wide hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
}

interface CartItem {
    _id: string;
    product_id: {
        name: string;
        images: string[];
        price: number;
    };
    size: string;
    quantity: number;
}

export default function CheckoutPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [clientSecret, setClientSecret] = useState("");
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(true);
    const initialized = useRef(false); // ✅ тук е правилното място

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        if (!token) {
            router.push("/login");
            return;
        }

        const initialize = async () => {
            try {
                const cartRes = await axios.get("https://synister-backend.onrender.com/cart", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCart(cartRes.data.cart?.items ?? []);
                setTotal(cartRes.data.totalAmount ?? 0);

                const orderRes = await axios.post(
                    "https://synister-backend.onrender.com/orders",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setOrderId(orderRes.data.order._id);
                setClientSecret(orderRes.data.clientSecret);

            } catch (err) {
                console.error("Checkout init failed:", err);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, [token]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!clientSecret) return <div className="min-h-screen flex items-center justify-center">Failed to initialize payment</div>;

    return (
        <div className="min-h-screen mx-auto max-w-4xl px-6 py-16">
            <h1 className="text-3xl font-semibold tracking-tight mb-12">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium">Order Summary</h2>
                    {cart.map((item) => (
                        <div key={item._id} className="flex gap-4 py-3 border-b border-white/10">
                            <img
                                src={item.product_id.images[0]}
                                alt={item.product_id.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex flex-col justify-between">
                                <p className="text-sm font-medium">{item.product_id.name}</p>
                                <p className="text-xs opacity-60">Size: {item.size}</p>
                                <p className="text-xs opacity-60">Qty: {item.quantity}</p>
                                <p className="text-sm">€{item.product_id.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between mt-4">
                        <p className="font-medium">Total</p>
                        <p className="font-medium">€{total.toFixed(2)}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-medium mb-6">Payment</h2>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm orderId={orderId} />
                    </Elements>
                </div>
            </div>
        </div>
    );
}