import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: 'SynisterWear',
        template: '%s | SynisterWear',
    },
    description: 'Streetwear with attitude. Soft fabric. Hard presence.',
    metadataBase: new URL('https://synisterwear.com'),
    openGraph: {
        title: 'SynisterWear',
        description: 'Streetwear with attitude. Soft fabric. Hard presence.',
        url: 'https://synisterwear.com',
        siteName: 'SynisterWear',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'SynisterWear streetwear',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
