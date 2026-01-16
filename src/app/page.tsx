"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import UserCard from "@/components/UserCard";
import LearningModulesSection from "@/components/LearningModulesSection";
import Squares from "@/components/Squares";
import Link from "next/link";

export default function Home() {
  // Feature data from README
  const features = [
    {
      icon: "/icons/adaptive.svg",
      title: "Adaptive Accessibility Profiling",
      description:
        "Platform menyesuaikan UI dan konten sesuai profil aksesibilitas pengguna secara otomatis.",
      highlights: [
        "High Contrast Mode",
        "Ukuran font dinamis",
        "State management preferensi",
        "Struktur semantik screen reader",
      ],
      accentColor: "var(--brand-sage)",
    },
    {
      icon: "/icons/owi.svg",
      title: "AI Assistant — OWI",
      description:
        "Asisten konsultan investasi berbasis RAG dengan bahasa sederhana dan edukatif.",
      highlights: [
        "Voice Input & Text-to-Speech",
        "Chat history per sesi",
        "Referensi valid OJK",
        "Fokus edukasi, bukan transaksi",
      ],
      accentColor: "var(--brand-blue)",
    },
    {
      icon: "/icons/learn.svg",
      title: "Micro-Learning Adaptif",
      description:
        "Modul singkat berbasis multi-modal untuk pembelajaran investasi yang efektif.",
      highlights: [
        "Fundamental keuangan & investasi",
        "Audio Learning Support",
        "Progress tracking",
      ],
      accentColor: "var(--brand-sage)",
    },
    {
      icon: "/icons/invest.svg",
      title: "Simulasi Investasi Sederhana",
      description:
        "Kalkulator pertumbuhan aset jangka panjang tanpa aksi jual-beli.",
      highlights: [
        "Grafik kontras tinggi",
        "Alt-text deskriptif otomatis",
        "Visualisasi risiko & return",
      ],
      accentColor: "var(--brand-blue)",
    },
  ];

  // User types from README
  const userTypes = [
    {
      icon: "/icons/tunanetra.svg",
      title: "Tunanetra",
      features: ["Text-to-Speech", "ARIA Labels", "Screen Reader Support"],
    },
    {
      icon: "/icons/tunarungu.svg",
      title: "Tunarungu",
      features: ["Captionable Content", "Visual-first Learning UI"],
    },
    {
      icon: "/icons/daksa.svg",
      title: "Disabilitas Daksa",
      features: ["Full Keyboard Navigation", "Large Click Area"],
    },
    {
      icon: "/icons/kognitif.svg",
      title: "Disabilitas Kognitif",
      features: ["Plain Language Content", "Micro-Learning"],
    },
  ];

  // Accessibility pilars from README
  const accessibilityPilars = [
    {
      pilar: "Perceivable",
      title: "Dapat Dipersepsikan",
      implementations: [
        "Audio support untuk konten",
        "Kontras warna tinggi",
        "Caption untuk multimedia",
      ],
      color: "var(--brand-sage)",
    },
    {
      pilar: "Operable",
      title: "Dapat Dioperasikan",
      implementations: [
        "Full keyboard navigation",
        "Focus indicator jelas",
        "Button minimum 44×44 px",
      ],
      color: "var(--brand-sage)",
    },
    {
      pilar: "Understandable",
      title: "Dapat Dipahami",
      implementations: [
        "Plain language content",
        "Icon clarity dengan label",
        "Breadcrumb onboarding",
      ],
      color: "var(--brand-blue)",
    },
    {
      pilar: "Robust",
      title: "Kokoh & Andal",
      implementations: [
        "ARIA role & label lengkap",
        "Screen reader friendly",
        "Struktur semantik HTML5",
      ],
      color: "var(--brand-blue)",
    },
  ];



  // OWI philosophy from README
  const owiPhilosophy = [
    {
      icon: "/mascot/owi-mascot-5.svg",
      title: "Burung Hantu (Owl)",
      meaning: "Kebijaksanaan & kemampuan melihat dalam gelap (tantangan finansial)",
    },
    {
      icon: "👁️",
      title: "Mata Besar",
      meaning: "Analisis dan perhatian pada detail investasi",
    },
    {
      icon: "🤖",
      title: "AI Asisten",
      meaning: "Pemandu investasi yang sabar, inklusif & adaptif",
    },
    {
      icon: "✨",
      title: "Ability & Vision",
      meaning: "Semua orang mampu merencanakan masa depan finansial",
    },
  ];


  return (
    <>
      {/* Background Squares */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Squares
          direction="down"
          speed={0.5}
          squareSize={40}
          borderColor="rgba(33, 33, 33, 0.1)"
          hoverFillColor="rgba(80, 217, 144, 0.05)"
        />
      </div>

      <Navbar />
      <main id="main-content">
        {/* Hero Section - Split Layout */}
        <section
          className="relative pt-24 pb-20 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)" }}
        >
          <div className="container mx-auto px-6 relative z-10">

            {/* Split Layout Container */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4 mb-16">

              {/* Left Text */}
              <div className="flex-1 text-center lg:text-right">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight text-[var(--brand-black)]">
                  LITERASI <br />
                  INVESTASI
                </h1>
              </div>

              {/* Center Mascot */}
              <div className="flex-none relative z-20">
                <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] mx-auto animate-float">
                  <img
                    src="/mascot/owi-mascot-3.svg"
                    alt="OWI Mascot"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                {/* Decorative Badge */}
                <div className="absolute -top-6 -right-6 md:top-0 md:-right-12 animate-spin-slow hidden md:block">
                  <div className="w-24 h-24 rounded-full bg-[var(--brand-sage)] text-white flex items-center justify-center text-xs font-bold text-center p-2 shadow-lg transform rotate-12">
                    FOR ALL ABILITIES
                  </div>
                </div>
              </div>

              {/* Right Text */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight text-[var(--brand-sage)] mb-6">
                  TANPA <br />
                  BATAS
                </h1>
                <p className="text-lg text-gray-600 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                  Platform edukasi investasi yang dirancang khusus untuk penyandang disabilitas.
                  Belajar cerdas bersama <strong style={{ color: "var(--brand-blue)" }}>OWI</strong>.
                </p>
              </div>
            </div>

            {/* Centered CTA */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-30">
              <Link
                href="#features"
                className="group btn flex items-center gap-3 text-base pl-8 pr-2 py-2 rounded-full font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(80,217,144,0.5)] active:scale-95"
                style={{ backgroundColor: "var(--brand-sage)", color: "white" }}>
                <span>Belajar Sekarang</span>
                <div className="w-10 h-10 bg-white text-[var(--brand-sage)] rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
              <Link
                href="#owi"
                className="inline-flex items-center justify-center text-base px-8 py-3 rounded-full font-bold transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white border-2 border-solid hover:-translate-y-1 hover:shadow-lg active:scale-95"
                style={{
                  borderColor: "var(--brand-sage)",
                  color: "var(--brand-sage)",
                }}
              >
                Kenali OWI
              </Link>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section bg-gradient-light drop-shadow-xl">
          <div className="container mx-auto px-6">
            <h2 className="section-title">Fitur Utama Finable</h2>
            <p className="section-subtitle">
              Dirancang khusus untuk memberikan pengalaman belajar investasi yang
              adaptif, inklusif, dan mudah dipahami.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  highlights={feature.highlights}
                  accentColor={feature.accentColor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Users Section */}
        <section id="users" className="section">
          <div className="container mx-auto px-6">
            <h2 className="section-title">Pengguna Utama</h2>
            <p className="section-subtitle">
              Finable mendukung berbagai jenis disabilitas dengan fitur khusus
              yang disesuaikan untuk setiap kebutuhan.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {userTypes.map((user, index) => (
                <UserCard
                  key={index}
                  icon={user.icon}
                  title={user.title}
                  features={user.features}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Learning Modules Section - Dynamic */}
        <LearningModulesSection />

        {/* OWI Section */}
        <section id="owi" className="section bg-gradient-light drop-shadow-xl">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: "var(--brand-black)" }}
                >
                  Filosofi Maskot — <span style={{ color: "var(--brand-blue)" }}>OWI</span>
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  OWI (Open Wisdom Intelligence) adalah AI Assistant yang menjadi
                  pendamping belajar investasi Anda. Terinspirasi dari burung hantu
                  yang melambangkan kebijaksanaan, OWI membantu pengguna &quot;melihat&quot;
                  peluang investasi yang sebelumnya tidak terlihat.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {owiPhilosophy.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-sm"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4
                          className="font-semibold text-sm"
                          style={{ color: "var(--brand-black)" }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{item.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div
                  className="relative w-72 h-72 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--brand-sage)" }}
                >
                  <div className="text-center text-white">
                    <div className="mb-4 animate-float flex justify-center"><img src="/mascot/owi-mascot-6.svg" alt="OWI" className="w-24 h-24" /></div>
                    <div className="font-bold text-2xl">OWI</div>
                    <div className="text-sm text-gray-200 mt-2">
                      Owl Investment Assistant
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="section">
          <div className="container mx-auto px-6 text-center">
            <h2 className="section-title">
              Mulai Perjalanan Literasi Investasi Anda
            </h2>
            <p className="section-subtitle">
              Finable hadir untuk memperjuangkan kesetaraan dalam akses literasi
              investasi. Karena setiap orang berhak cerdas secara finansial.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="#features" className="btn btn-primary text-lg px-4 py-2"
                style={{
                  color: "var(--brand-white)",
                  backgroundColor: "var(--brand-sage)"
                }}>
                <span></span>
                Mulai Belajar Sekarang
              </Link>
              <Link href="#owi" className="text-lg px-8 py-4 rounded-xl border transition-all hover:opacity-90 inline-flex items-center gap-2"
                style={{ borderColor: "var(--brand-black)", color: "var(--brand-black)", background: "var(--brand-white)" }}>
                <span></span>
                Tanya OWI
              </Link>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              <span>Fokus edukasi — </span>
              <strong>bukan</strong> platform transaksi investasi
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
