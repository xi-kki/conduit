import type { Metadata } from "next";
import Inter from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/error-boundary";

// Use local font to avoid Google Fonts network issues during build
const inter = Inter({
  src: "../../public/fonts/Inter-Regular.woff2",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Conduit — Web3 Event Ticketing on Sui",
  description:
    "The curated Web3 events hub on Sui. Discover, attend, and own the best on-chain experiences with NFT tickets.",
  keywords: ["Sui", "Web3", "Events", "NFT", "Tickets", "Blockchain"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ErrorBoundary>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
