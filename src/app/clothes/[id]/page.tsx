import { notFound } from "next/navigation";
import ProductImageSlider from "@/comps/ImageSlider";
import { products } from "@/lib/products";
import Navbar from "@/comps/Navbar";
import Footer from "@/comps/footer";

export default async function ProductPage({
                                              params,
                                          }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = products.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    return (
        <>
            <Navbar/>
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image slider */}
                    <ProductImageSlider
                        images={product.images}
                        productName={product.name}
                    />

                    {/* Product info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-semibold tracking-tight">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-2xl font-medium">€{product.price.toFixed(2)}</p>

                        <p className="mt-6 text-gray-600 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium">Size</h3>
                            <div className="mt-4 flex gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        className="h-11 w-11 rounded-md border border-gray-300 text-sm font-medium
                             hover:border-black transition-colors"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="mt-12 h-14 w-full rounded-md border border-black
                       text-sm font-semibold tracking-wide
                       hover:bg-black hover:text-white
                       transition-colors"
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}
