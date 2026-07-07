import Link from "next/link";
import { categories } from "@/lib/articles";
import SocialIcons from "@/components/SocialIcons";

const SITE_NAME = "TV10 Gujarat";

export default function Footer() {
  const navCategories = categories.filter((c) => c.slug !== "/");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white font-serif mb-2">{SITE_NAME}</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              ગુજરાત અને સમગ્ર ભારતના સચોટ, સમયસર અને નિષ્પક્ષ સમાચાર તમારા સુધી પહોંચાડીએ છીએ.
              સમાચાર માટે તમારો વિશ્વસનીય સ્ત્રોત.
            </p>
            <SocialIcons className="mt-4" iconClassName="w-6 h-6 text-gray-300" />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">વિભાગો</h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {navCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">સંપર્ક</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 news@tv10gujarat.in</li>
              <li>📞 +91 98256 50103</li>
              <li>📍 અમદાવાદ, ગુજરાત, ભારત</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">અમારા વિશે</Link>
              <span>·</span>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">ગોપનીયતા</Link>
              <span>·</span>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">સંપર્ક કરો</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          © {year} {SITE_NAME}. તમામ હકો સુરક્ષિત. ભારતમાં ❤️ સાથે બનાવેલ.
        </div>
      </div>
    </footer>
  );
}
