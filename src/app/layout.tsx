import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { LoadingScreen } from "@/components/common/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ardaa Interior Firm",
  description: "Leading design studio specializing in creating exceptional interior spaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`} suppressHydrationWarning>
        <LoadingProvider>
          <LoadingScreen />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}


