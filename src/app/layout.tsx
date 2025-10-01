import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { WalletProvider } from "@/components/WalletProvider";
import { MiniKitProvider } from "@/components/MiniKitProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Base Giveaway - Win Exclusive Prizes",
  description: "Participate in exclusive giveaways and win amazing prizes on the Base network. Connect your wallet and join the fun!",
  keywords: ["Base", "giveaway", "prizes", "crypto", "blockchain", "Web3", "Farcaster", "minikit"],
  authors: [{ name: "Base Giveaway Team" }],
  openGraph: {
    title: "Base Giveaway - Win Exclusive Prizes",
    description: "Participate in exclusive giveaways and win amazing prizes on the Base network",
    url: "https://www.basedgiveaways.xyz",
    siteName: "Base Giveaway",
    type: "website",
    images: [
      {
        url: "https://www.basedgiveaways.xyz/app-images/app-image-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Base Giveaway - Win Exclusive Prizes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Giveaway - Win Exclusive Prizes",
    description: "Participate in exclusive giveaways and win amazing prizes on the Base network",
    images: ["https://www.basedgiveaways.xyz/app-images/app-image-1200x630.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta property="fc:miniapp" content="Base Giveaway" />
        <meta property="fc:miniapp:url" content="https://www.basedgiveaways.xyz" />
        <meta property="fc:miniapp:description" content="Participate in exclusive giveaways and win amazing prizes on the Base network" />
        <meta property="fc:miniapp:image" content="https://www.basedgiveaways.xyz/app-images/app-image-1200x630.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <WalletProvider>
          <MiniKitProvider>
            {children}
            <Toaster />
          </MiniKitProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
