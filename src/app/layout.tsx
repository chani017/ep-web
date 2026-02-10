import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "일상의실천",
  description: "일상의실천",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
