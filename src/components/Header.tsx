"use client";
import Link from "next/link";
import { useState } from "react";
import { categories } from "@/lib/articles";

const SITE_NAME = "The Daily Report";
const SITE_TAGLINE = "Truth. Today. Always.";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navCategories = categories.filter((c) => c.slug !== "/");

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header>
      {/* Top info bar */}
      <div className="bg-gray-900 text-gray-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>{today}</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Twitter/X</a>
            <a href="#" className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b-4 border-brand-red py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-3xl font-bold text-brand-red tracking-tight font-serif leading-none">
              {SITE_NAME}
            </span>
            <span className="text-xs text-gray-500 tracking-widest uppercase mt-0.5">
              {SITE_TAGLINE}
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex items-center border border-gray-300 rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search news..."
              className="px-3 py-1.5 text-sm outline-none w-52"
            />
            <button className="bg-brand-red text-white px-3 py-1.5 text-sm hover:bg-brand-darkred transition-colors">
              Search
            </button>
          </div>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-brand-red hidden md:block">
        <div className="max-w-7xl mx-auto">
          <ul className="flex items-center overflow-x-auto">
            <li>
              <Link
                href="/"
                className="block px-4 py-2.5 text-white text-sm font-semibold hover:bg-brand-darkred transition-colors whitespace-nowrap"
              >
                Home
              </Link>
            </li>
            {navCategories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-2.5 text-white text-sm font-semibold hover:bg-brand-darkred transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none mb-2"
            />
          </div>
          <ul>
            <li>
              <Link
                href="/"
                className="block px-4 py-3 text-sm font-semibold text-gray-800 border-b hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {navCategories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-3 text-sm font-semibold text-gray-800 border-b hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
