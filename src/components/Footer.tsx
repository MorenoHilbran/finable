"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Fitur",
      links: [
        { href: "#features", label: "Adaptive Accessibility" },
        { href: "#features", label: "AI Assistant OWI" },
        { href: "#features", label: "Micro-Learning" },
        { href: "#features", label: "Simulasi Investasi" },
      ],
    },
    {
      title: "Aksesibilitas",
      links: [
        { href: "#accessibility", label: "WCAG 2.2" },
        { href: "#users", label: "Tunanetra" },
        { href: "#users", label: "Tunarungu" },
        { href: "#users", label: "Disabilitas Daksa" },
      ],
    },
    {
      title: "Tentang",
      links: [
        { href: "#owi", label: "Filosofi OWI" },
        { href: "#technology", label: "Teknologi" },
        { href: "#impact", label: "Dampak Sosial" },
      ],
    },
  ];

  return (
    <footer
      className="pt-96 pb-12 md:pt-[500px] md:pb-16 -mt-[420px] md:-mt-[420px] relative -z-2"
      style={{ 
        backgroundImage: "url('/footer.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
      role="contentinfo"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-white mb-4"
            >
              <span className="text-3xl"></span>
              <span>FINABLE</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Platform edukasi investasi inklusif untuk penyandang disabilitas.
              Belajar investasi dengan AI Assistant OWI yang adaptif.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-lg"></span>
              <span>WCAG 2.2 Compliant</span>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-300 text-sm transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--brand-sage)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = ""}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Finable. Untuk kesetaraan akses literasi investasi.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <span></span>
                SDGs: Reduced Inequalities
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-6 max-w-2xl mx-auto">
            Finable hadir bukan untuk keuntungan semata — tetapi untuk
            memperjuangkan kesetaraan dalam akses literasi investasi. Karena
            setiap orang berhak cerdas secara finansial.
          </p>
        </div>
      </div>
    </footer>
  );
}

