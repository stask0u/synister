export type Product = {
    id: string;
    name: string;
    category: "hoodies" | "tees" | "jackets" | "hats";
    price: number;
    description: string;
    images: string[];
    sizes: string[];
};

export const products: Product[] = [
    {
        id: "soft-hoodie-black",
        name: "Soft Hoodie – Black",
        category: "hoodies",
        price: 69.00,
        description:
            "Premium heavyweight cotton hoodie with a relaxed fit. Built for daily wear with a sharp street silhouette.",
        images: ["/front.jpg", "/back.jpg"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "streetwear-tee-white",
        name: "Streetwear Tee – White",
        category: "tees",
        price: 39.0,
        description:
            "Minimalist street tee made from breathable cotton. Designed for layering or standalone wear.",
        images: ["/tee-front.jpg", "/tee-back.jpg"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "limited-jacket-pink",
        name: "Limited Jacket – Pink",
        category: "jackets",
        price: 119.0,
        description:
            "Limited-run jacket with bold color presence. Cut sharp, worn loud.",
        images: ["/jacket-front.jpg", "/jacket-back.jpg"],
        sizes: ["M", "L", "XL"],
    },
];