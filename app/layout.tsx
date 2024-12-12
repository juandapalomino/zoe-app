import type { Metadata } from "next";
import { rubik } from "./ui/fonts";
import "./ui/globals.css";

export const metadata: Metadata = {
  title: "Advisors App - Zoe Financial",
  description: "Find your company advisors!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className}`}>{children}</body>
    </html>
  );
}
