import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "TV10 Gujarat – સત્ય. આજે. હંમેશા.",
    template: "%s | TV10 Gujarat",
  },
  description: "ગુજરાત અને સમગ્ર ભારતના સચોટ, સમયસર અને નિષ્પક્ષ સમાચાર તમારા સુધી પહોંચાડીએ છીએ.",
  openGraph: {
    siteName: "TV10 Gujarat",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
