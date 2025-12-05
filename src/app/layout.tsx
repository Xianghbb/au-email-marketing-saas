import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B2B Email Marketing SaaS",
  description: "AI-powered email marketing for Australian businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
