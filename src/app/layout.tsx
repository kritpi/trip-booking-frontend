import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { Providers } from "../lib/providers";
import "./globals.css";
import { Navbar } from "@/components/components/navbar";

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
        <Providers>
          <Navbar></Navbar> 
          {/* <div className="max-w-screen-xl flex flex-wrap content-center mx-auto p-4">{children}</div> */}
          {/* <div className=" container mr-[8rem] my-[2rem]">{children}</div> */}
          <div className="grid mx-[15rem] my-[3rem]">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
