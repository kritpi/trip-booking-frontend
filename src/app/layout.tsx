'use client'
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import NextAuthProvider from "@/provider/NextAuthProvider";
import { SessionProvider } from "next-auth/react";
import { Providers } from "../provider/NextUiProviders";
import "./globals.css";
import { Navbar } from "@/components/components/navbar";

const notoSanThai = Noto_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  style: ["normal"],
  subsets: ["latin", "latin-ext", "thai"],
});

// export const metadata: Metadata = { 
//   title: "Trip-Booking",
//   description: "Tour Booking Web Application",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSanThai.className}>
        <NextAuthProvider>
          <SessionProvider>
            <Providers>
              <Navbar></Navbar>
              <div className="grid mx-[15rem] my-[3rem]">{children}</div>
            </Providers>
          </SessionProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
