import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SynisterWear",
    template: "%s | SynisterWear",
  },
  description: "Streetwear with attitude. Soft fabric. Hard presence.",
  metadataBase: new URL("https://www.synister.shop"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SynisterWear",
    description: "Streetwear with attitude. Soft fabric. Hard presence.",
    url: "https://www.synister.shop/",
    siteName: "SynisterWear",
    images: [
      {
        url: "/synisterwear.png",
        width: 512,
        height: 512,
        alt: "SynisterWear",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SynisterWear",
    description: "Streetwear with attitude. Soft fabric. Hard presence.",
    images: ["/synisterwear.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SynisterWear",
    url: "https://www.synister.shop/",
    logo: "https://www.synister.shop/synisterwear.png",
    sameAs: ["https://www.instagram.com/synisterwearofficial/"],
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuthProvider>
          {children}
          <Analytics />
      </AuthProvider>
      </body>
    </html>
  );
}
