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
        {/* Hero Section */}
        <section
          className="flex items-center pt-5 pb-32 bg-cover bg-center bg-no-repeat bg-white"
          style={{ backgroundImage: "url(/hero.svg)", minHeight: "125vh" }}
        >
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6">
                  <span></span>
                  <span>Platform Edukasi Inklusif untuk Semua</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                  Literasi Investasi{" "}
                  <span style={{ color: "var(--brand-sage)" }}>Tanpa Batas</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
                  Finable adalah platform edukasi investasi yang dirancang khusus
                  untuk penyandang disabilitas. Dengan AI Assistant{" "}
                  <strong style={{ color: "var(--brand-blue)" }}>OWI</strong>,
                  informasi investasi dapat dipahami dengan lebih mudah dan inklusif.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="#features" className="btn btn-light"
                  style={{ color: "var(--brand-black)" }}>
                    <span></span>
                    Jelajahi Fitur
                  </Link>
                  <Link
                    href="#owi"
                    className="btn btn-light"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <span></span>
                    Kenali OWI
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                  <div>
                    <div className="text-3xl font-bold" style={{ color: "var(--brand-sage)" }}>
                      4+
                    </div>
                    <div className="text-sm text-gray-300">Tipe Disabilitas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold" style={{ color: "var(--brand-blue)" }}>
                      WCAG
                    </div>
                    <div className="text-sm text-gray-300">2.2 Compliant</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold" style={{ color: "var(--brand-sage)" }}>
                      AI
                    </div>
                    <div className="text-sm text-gray-300">Powered by OWI</div>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="hidden lg:flex justify-center items-center">
                <div
                  className="relative w-80 h-80 rounded-full flex items-center justify-center animate-float"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="w-64 h-64 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <div className="text-center">
                      <div className="text-8xl mb-2"><img src="/mascot/owi-mascot-3.svg" alt="OWI Logo" width={256} height={256} /></div>
                      <div className="text-white font-bold text-2xl">OWI</div>
                      <div className="text-gray-300 text-sm">
                        Open Wisdom Intelligence
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#features" className="btn btn-primary text-lg px-8 py-4"
              style={{color: "var(--brand-white)",
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
