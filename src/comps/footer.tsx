import Image from "next/image";

export default function Footer() {
    return (
        <main className="w-full bg-black text-white mt-20">
            <div className="max-w-7xl mx-auto px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

                <div className="flex flex-col gap-4">
                    <Image
                        src="/synisterwear.png"
                        alt="SynisterWear"
                        width={128}
                        height={128}
                        className="w-32"
                    />
                    <p className="text-sm text-white/70 leading-relaxed">
                        Soft fabric. Hard presence.
                        <br />
                        Premium streetwear designed to stand out.
                    </p>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                        Shop
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-white/70">
                        <li className="hover:text-white transition">Hoodies</li>
                        <li className="hover:text-white transition">T-Shirts</li>
                        <li className="hover:text-white transition">Jackets</li>
                        <li className="hover:text-white transition">Accessories</li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                        Company
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-white/70">
                        <li className="hover:text-white transition">About Us</li>
                        <li className="hover:text-white transition">Contact</li>
                        <li className="hover:text-white transition">Shipping & Returns</li>
                        <li className="hover:text-white transition">Privacy Policy</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                        Newsletter
                    </h3>
                    <p className="text-sm text-white/70 mb-4">
                        Get early access to drops and exclusive offers.
                    </p>
                    <div className="flex border border-white/30 rounded-md overflow-hidden">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-white/40"
                        />
                        <button className="px-4 text-sm font-semibold border-l border-white/30 hover:bg-white hover:text-black transition">
                            Join
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
                © {new Date().getFullYear()} SynisterWear. All rights reserved.
            </div>
        </main>
    );
}
