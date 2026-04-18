import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAGUJJE Boosting - Uganda's #1 SMM Panel",
  description: "Supercharge your social media growth with KAGUJJE Boosting. Get Instagram followers, TikTok views, YouTube subscribers and more at the best prices in Uganda.",
  keywords: ["SMM Panel", "Social Media Marketing", "Instagram followers", "TikTok views", "YouTube subscribers", "Uganda"],
  openGraph: {
    title: "KAGUJJE Boosting - Uganda's #1 SMM Panel",
    description: "Supercharge your social media growth with KAGUJJE Boosting",
    type: "website",
    url: "https://boosting.kagujje.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
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
      </body>
    </html>
  );
}
