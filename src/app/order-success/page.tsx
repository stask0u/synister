"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const redirectStatus = searchParams.get("redirect_status");

    if (redirectStatus === "failed") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
                <h1 className="text-3xl font-semibold">Payment Failed</h1>
                <p className="text-neutral-400">Something went wrong with your payment. You have not been charged.</p>
                <Link
                    href="/checkout"
                    className="px-6 py-3 border border-white text-sm font-medium hover:bg-white hover:text-black transition-colors"
                >
                    Try Again
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="text-5xl">✓</div>
            <h1 className="text-3xl font-semibold">Order Confirmed</h1>
            <p className="text-neutral-400 max-w-md">
                Thank you for your purchase. Your order has been placed and will be processed shortly.
            </p>
            {orderId && <p className="text-xs text-neutral-600">Order ID: {orderId}</p>}
            <Link
                href="/clothes"
                className="px-6 py-3 border border-white text-sm font-medium hover:bg-white hover:text-black transition-colors"
            >
                Continue Shopping
            </Link>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Confirming your order...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}