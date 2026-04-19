import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "KAGUJJE Boost - Uganda's #1 SMM Panel",
  description: "Supercharge your social media growth with real followers, views, and engagement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
