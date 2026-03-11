import { notFound } from "next/navigation";
import ProductImageSlider from "@/comps/ImageSlider";
import Navbar from "@/comps/Navbar";
import Footer from "@/comps/footer";
import AddToCartButton from "@/comps/AddToCartBtn";

interface Variant {
    size: string;
    stock: number;
}

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    price: number;
    category: string;
    subcategory?: string;
    variants: Variant[];
    isActive: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const res = await fetch(`https://synister-backend.onrender.com/products/slug/${slug}`);
    if (!res.ok) return {};
    const product = await res.json();

    return {
        title: `${product.name} | SynisterWear`,
        description: product.description?.slice(0, 155),
        openGraph: {
            images: [product.images[0]],
        },
    };
}

export async function generateStaticParams() {
    const res = await fetch("https://synister-backend.onrender.com/products");
    const products = await res.json();

    return products.map((p: { slug?: string; _id: string }) => ({
        slug: p.slug ?? p._id,
    }));
}


export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const res = await fetch(`https://synister-backend.onrender.com/products/slug/${slug}`, {
        next: { revalidate: 3600 }
    });

    if (!res.ok) notFound();

    const product: Product = await res.json();

    return (
        <>
            <Navbar/>
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <ProductImageSlider
                        images={product.images}
                        productName={product.name}
                    />

                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-semibold tracking-tight">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-2xl font-medium">€{product.price.toFixed(2)}</p>

                        <p className="mt-6 text-gray-600 leading-relaxed">
                            {product.description}
                        </p>

                        <AddToCartButton productId={product._id} variants={product.variants} />
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}