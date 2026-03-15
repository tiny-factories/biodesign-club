import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Biodesign Club",
  description:
    "A community-driven space where people from diverse disciplines come together to explore the intersection of biology, design, and technology, fostering collaboration around innovative, sustainable, and regenerative solutions. These clubs serve as hubs for experimentation, learning, and creating projects inspired by natural systems and biomimicry. Here’s a more detailed breakdown of what a biodesign club might look like:",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="m-2 rounded border-2 border-black p-2 dark:border-white">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link href="/" className="font-semibold sm:mr-2">
              🌱🦠 BioDesign Club
            </Link>
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-black/20 bg-[#c8cac2] p-2 focus:bg-gray-100 focus:outline-none dark:bg-[#c8cac2] dark:focus:bg-gray-900 sm:flex-grow"
            />
            <div className="flex gap-4 text-sm sm:text-base">
              <Link href="/community">Community</Link>
              <Link href="/library">Library</Link>
            </div>
          </div>
        </nav>
        <div className="p-2">{children}</div>
      </body>
    </html>
  );
}
