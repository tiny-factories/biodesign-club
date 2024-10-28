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
      <body>
        <nav className="flex justify-between border-2 border-black dark:border-white m-2 ">
          <Link
            href="/"
            className="border-r-2 border-black dark:border-white p-2"
          >
            🌱🦠 BioDesign Club
          </Link>
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow bg-[#c8cac2] dark:bg-[#c8cac2] focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 p-2"
          />
          <div className="flex gap-4 border-l-2 border-black dark:border-white p-2">
            <Link href="/community">Community</Link>
            <Link href="/library">Library</Link>
          </div>
        </nav>
        <div className="p-2">{children}</div>
      </body>
    </html>
  );
}
