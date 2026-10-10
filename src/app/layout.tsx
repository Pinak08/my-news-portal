import type { Metadata } from "next";
import { Noto_Sans_Gujarati, Noto_Serif_Gujarati } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Self-hosted at build time by next/font: no request to Google on page load,
// no layout shift, and real Gujarati glyphs (the old Inter/Playfair fonts had
// none, so every phone fell back to its own system font).
const sans = Noto_Sans_Gujarati({ subsets: ["gujarati", "latin"], display: "swap", variable: "--font-sans" });
const serif = Noto_Serif_Gujarati({ subsets: ["gujarati", "latin"], display: "swap", variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    default: "TV10 Gujarat – સત્ય. આજે. હંમેશા.",
    template: "%s | TV10 Gujarat",
  },
  description: "ગુજરાત અને સમગ્ર ભારતના સચોટ, સમયસર અને નિષ્પક્ષ સમાચાર તમારા સુધી પહોંચાડીએ છીએ.",
  openGraph: {
    siteName: "TV10 Gujarat",
    type: "website",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="gu" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
