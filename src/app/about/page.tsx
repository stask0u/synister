import type { Metadata } from 'next';
import Navbar from "@/comps/Navbar";
import Footer from "@/comps/footer";


export const metadata: Metadata = {
    title: "About Us",
    description:
        "Discover the philosophy behind SynisterWear — premium streetwear built on contrast, quality, and presence.",
};
export default function AboutPage() {
    return (
        <>
            <Navbar/>
            <main className="flex flex-col gap-24 px-4 md:px-20 py-16">

                {/* HERO SECTION */}
                <section className="flex flex-col gap-6 max-w-3xl">
                    <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                        More than clothing.
                        <br/>
                        It’s presence.
                    </h1>

                    <p className="text-base md:text-lg text-neutral-600">
                        SynisterWear was created for people who understand that style is not
                        about being loud — it’s about being felt. Every piece is designed to
                        balance comfort with confidence, simplicity with edge.
                    </p>
                </section>

                {/* IMAGE + TEXT SECTION */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="relative w-full h-[420px] overflow-hidden rounded-xl">
                        {/*<Image*/}
                        {/*    src="/clothes/back.jpg"*/}
                        {/*    alt="SynisterWear fabric detail"*/}
                        {/*    fill*/}
                        {/*    className="object-cover"*/}
                        {/*/>*/}
                    </div>

                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl md:text-3xl font-semibold">
                            Designed with intention
                        </h2>

                        <p className="text-neutral-600">
                            We focus on clean silhouettes, premium fabrics, and precise fits.
                            No unnecessary graphics. No compromises in quality. Just clothing
                            that feels right the moment you put it on.
                        </p>

                        <p className="text-neutral-600">
                            From hoodies to tees and limited outerwear, each item is built to be
                            worn daily — and remembered.
                        </p>
                    </div>
                </section>

                {/* SECOND IMAGE + TEXT (REVERSED) */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1 flex flex-col gap-6">
                        <h2 className="text-2xl md:text-3xl font-semibold">
                            Soft fabric. Hard presence.
                        </h2>

                        <p className="text-neutral-600">
                            Comfort is non-negotiable. We use soft, breathable, and durable
                            materials — but the attitude is always sharp. SynisterWear is made
                            to move with you, stand with you, and represent you.
                        </p>

                        <p className="text-neutral-600">
                            Whether you’re in the city, at the gym, or off the clock, the clothes
                            adapt — not the other way around.
                        </p>
                    </div>

                    <div className="order-1 md:order-2 relative w-full h-[420px] overflow-hidden rounded-xl">
                        {/*<Image*/}
                        {/*    src="/clothes/front.jpg"*/}
                        {/*    alt="SynisterWear streetwear look"*/}
                        {/*    fill*/}
                        {/*    className="object-cover"*/}
                        {/*/>*/}
                    </div>
                </section>

                {/* CLOSING STATEMENT */}
                <section className="max-w-3xl flex flex-col gap-6">
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        Built for those who know
                    </h2>

                    <p className="text-neutral-600">
                        SynisterWear isn’t for everyone — and that’s intentional. It’s for
                        those who value restraint, detail, and identity. If you know, you
                        know.
                    </p>
                </section>

            </main>
            <Footer/>
        </>

    );
}