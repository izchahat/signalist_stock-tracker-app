import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

export const metadata: Metadata = {
  title: "Signalist",
  description: "Track real-time stock prices, get personalized alerts and explore detailed company insights.",
};

/**
 * Application root layout that sets the document language and global HTML/body classes and renders app content with a global toaster.
 *
 * @param children - The page content to render inside the application's root `<body>`.
 * @returns The root HTML structure containing the provided `children` and the global `Toaster` component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
    <body className="h-full antialiased">
    {children}
    <Toaster />
    </body>
    </html>
  );
}
