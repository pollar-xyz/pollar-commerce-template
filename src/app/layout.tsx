import type { Metadata } from "next";
import { Providers } from "./providers";
import { StoreHeader } from "@/storefront/StoreHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pollar Commerce — base e-commerce template",
  description:
    "A reusable USDC commerce core with a swappable storefront shell, powered by Pollar on Stellar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <Providers>
          <StoreHeader />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
