'use client'

import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe("pk_live_51TCMltR4w1bZj6pFzgKeeiDUc23WNMqvbUl57THybjLLXge8jPVxHfnCa0QbEiCnEFYFUDUVcUGFohqZtT3RV1sH00QsWOx7S5");

interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

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

const inputClass = "w-full bg-transparent border border-white/20 px-3 py-2 text-sm focus:outline-none focus:border-white/60 transition-colors placeholder:opacity-40";

export default function CheckoutPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [clientSecret, setClientSecret] = useState("");
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(true);
    const [shippingError, setShippingError] = useState("");
    const [shippingConfirmed, setShippingConfirmed] = useState(false);
    const initialized = useRef(false);

    const [shipping, setShipping] = useState<ShippingAddress>({
        fullName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });

    function handleShippingChange(e: React.ChangeEvent<HTMLInputElement>) {
        setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleConfirmShipping() {
        const { fullName, address, city, postalCode, country } = shipping;
        if (!fullName || !address || !city || !postalCode || !country) {
            setShippingError("All shipping fields are required.");
            return;
        }
        setShippingError("");

        try {
            const orderRes = await axios.post(
                "https://synister-backend.onrender.com/orders",
                { shippingAddress: shipping },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrderId(orderRes.data.order._id);
            setClientSecret(orderRes.data.clientSecret);
            setShippingConfirmed(true);
        } catch (err) {
            console.error("Order creation failed:", err);
            setShippingError("Failed to create order. Please try again.");
        }
    }

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
            } catch (err) {
                console.error("Cart fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, [token]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen mx-auto max-w-4xl px-6 py-16">
            <h1 className="text-3xl font-semibold tracking-tight mb-12">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Left — order summary */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium">Order summary</h2>
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

                {/* Right — shipping then payment */}
                <div className="flex flex-col gap-10">

                    {/* Shipping form */}
                    <div>
                        <h2 className="text-lg font-medium mb-6">Shipping address</h2>
                        <div className="flex flex-col gap-3">
                            {[
                                { name: "fullName", placeholder: "Full name" },
                                { name: "address", placeholder: "Street address" },
                                { name: "city", placeholder: "City" },
                                { name: "postalCode", placeholder: "Postal code" },
                                { name: "country", placeholder: "Country" },
                            ].map(f => (
                                <input
                                    key={f.name}
                                    name={f.name}
                                    placeholder={f.placeholder}
                                    value={(shipping as any)[f.name]}
                                    onChange={handleShippingChange}
                                    disabled={shippingConfirmed}
                                    className={inputClass + (shippingConfirmed ? " opacity-40 cursor-not-allowed" : "")}
                                />
                            ))}
                        </div>

                        {shippingError && <p className="text-red-500 text-sm mt-3">{shippingError}</p>}

                        {!shippingConfirmed && (
                            <button
                                onClick={handleConfirmShipping}
                                className="mt-4 h-11 w-full border border-white text-sm font-semibold tracking-wide hover:bg-white hover:text-black transition-colors"
                            >
                                Continue to payment
                            </button>
                        )}

                        {shippingConfirmed && (
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-xs opacity-50">Address confirmed</p>
                                <button
                                    onClick={() => { setShippingConfirmed(false); setClientSecret(""); }}
                                    className="text-xs opacity-50 hover:opacity-100 underline"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Payment — only shown after shipping confirmed */}
                    {shippingConfirmed && clientSecret && (
                        <div>
                            <h2 className="text-lg font-medium mb-6">Payment</h2>
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm orderId={orderId} />
                            </Elements>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}