"use client";

import { useState,useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/comps/Navbar";
import Footer from "@/comps/footer";
import axios from "axios";

interface Variant {
    size: string;
    stock: number;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    category: string;
    subcategory?: string;
    variants: Variant[];
    isActive: boolean;
}

export default function ProductsPage() {
    const [category, setCategory] = useState<string>("all");
    const [maxPrice, setMaxPrice] = useState<number>(200);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axios.get("https://synister-backend.onrender.com/products");
                setProducts(response.data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    const filteredProducts = products.filter(
        (product) =>
            (category === "all" || product.subcategory === category || product.category===category) &&
            product.price <= maxPrice
    );

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar/>
            <main className="px-4 md:px-20 py-16 flex flex-col gap-12">
                {/* HEADER */}
                <section className="flex flex-col gap-4 max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-semibold">
                        All Products
                    </h1>
                    <p className="text-neutral-600">
                        Explore the full SynisterWear collection — refined streetwear built
                        for everyday presence.
                    </p>
                </section>

                <section className="flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="flex gap-3 flex-wrap">
                        {["all", "hoodies", "tees", "jackets", "hats"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`
                px-4 py-2 text-sm border rounded-full transition
                ${
                                    category === cat
                                        ? "border-black"
                                        : "border-neutral-300 text-neutral-500 hover:border-black"
                                }
              `}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* PRICE FILTER */}
                    <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-600">
            Max price: €{maxPrice}
          </span>
                        <input
                            type="range"
                            min={20}
                            max={200}
                            step={10}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-40"
                        />
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product._id}
                            href={`/clothes/${product._id}`}
                            className="group flex flex-col gap-4"
                        >
                            <div className="relative w-full h-[360px] overflow-hidden rounded-xl bg-neutral-100">
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">{product.name}</h3>
                                <span className="text-sm text-neutral-600">
                €{product.price.toFixed(2)}
              </span>
                            </div>
                        </Link>
                    ))}
                </section>

                {filteredProducts.length === 0 && (
                    <p className="text-neutral-500">
                        No products match the selected filters.
                    </p>
                )}
            </main>
            <Footer/>
        </>

    );
}
