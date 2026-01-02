"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import UserCard from "@/components/UserCard";
import LearningModuleCard from "@/components/LearningModuleCard";
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

  // Learning Modules
  const learningModules = [
    {
      category: "Cryptocurrency",
      title: "Bitcoin & Blockchain Fundamentals",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop",
      accentColor: "var(--brand-blue)",
    },
    {
      category: "Saham",
      title: "Analisis Saham Indonesia untuk Pemula",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      accentColor: "var(--brand-blue)",
    },
    {
      category: "Emas",
      title: "Investasi Emas & Logam Mulia",
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop",
      accentColor: "var(--brand-blue)",
    },
    {
      category: "Reksa Dana",
      title: "Strategi Reksa Dana Jangka Panjang",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop",
      accentColor: "var(--brand-blue)",
    },
    {
      category: "Obligasi",
      title: "Obligasi & Surat Utang Negara",
      image: "https://images.unsplash.com/photo-1554224311-beee460ae6fb?w=400&h=300&fit=crop",
      accentColor: "var(--brand-blue)",
    },
    {
      category: "Properti",
      title: "Real Estate Investment Trust (REIT)",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      accentColor: "var(--brand-blue)",
    },
  ];

  // OWI philosophy from README
  const owiPhilosophy = [
    {
      icon: "🦉",
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
                      <div className="text-8xl mb-2">🦉</div>
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

        {/* Learning Modules Section */}
        <section
          id="learning"
          className="section"
        >
          <div className="container mx-auto px-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Take your <span style={{ color: "var(--brand-blue)" }}>knowledge</span>
                </h2>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--brand-black)" }}>
                  a degree further
                </h2>
                <p className="text-gray-600 max-w-md">
                  Make education work for you with flexible online courses from leading schools.
                </p>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center gap-4">
                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-full text-sm font-medium text-white" style={{ backgroundColor: "var(--brand-black)" }}>
                    New courses (12)
                  </button>
                  <button className="px-4 py-2 rounded-full text-sm font-medium border-2 text-gray-700 hover:bg-gray-50" style={{ borderColor: "var(--brand-black)" }}>
                    Recommended (8)
                  </button>
                  <button className="px-4 py-2 rounded-full text-sm font-medium border-2 text-gray-700 hover:bg-gray-50" style={{ borderColor: "var(--brand-black)" }}>
                    Most popular (22)
                  </button>
                </div>
                
                {/* Slider Navigation */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const slider = document.getElementById('learning-slider');
                      const cardWidth = 360; // 320px card + 24px gap + 16px padding
                      if (slider) slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <img src="/icons/Left circle.svg" alt="Previous" className="w-10 h-10" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-10 text-center">1/6</span>
                  <button
                    onClick={() => {
                      const slider = document.getElementById('learning-slider');
                      const cardWidth = 360; // 320px card + 24px gap + 16px padding
                      if (slider) slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <img src="/icons/Right circle.svg" alt="Next" className="w-10 h-10" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Slider Container */}
            <div className="relative overflow-hidden py-10">
              <div id="learning-slider" className="flex gap-6 overflow-x-scroll pb-4 snap-x snap-mandatory scrollbar-hide">
                {learningModules.map((module, index) => (
                  <div key={index} className="mt-5 flex-none w-[calc(33.333%-16px)] min-w-[320px] snap-start ">
                    <LearningModuleCard
                      category={module.category}
                      title={module.title}
                      image={module.image}
                      accentColor={module.accentColor}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
                    <div className="text-7xl mb-4 animate-float">🦉</div>
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
