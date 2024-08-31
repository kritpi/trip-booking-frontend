import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";

const notoSanThai = Noto_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  style: ["normal"],
  subsets: ["latin", "latin-ext", "thai"],
});

export const metadata: Metadata = {
  title: "Trip-Booking",
  description: "Tour Booking Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSanThai.className}>
        <NextUIProvider>
          <div className="px-[33px] sm:px-[56px] md:px-[100px] py-[5.8rem]">
            {children}
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
