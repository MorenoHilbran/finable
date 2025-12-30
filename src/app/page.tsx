import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import UserCard from "@/components/UserCard";
import AccessibilityCard from "@/components/AccessibilityCard";
import Link from "next/link";

export default function Home() {
  // Feature data from README
  const features = [
    {
      icon: "🎨",
      title: "Adaptive Accessibility Profiling",
      description:
        "Platform menyesuaikan UI dan konten sesuai profil aksesibilitas pengguna secara otomatis.",
      highlights: [
        "High Contrast Mode",
        "Ukuran font dinamis",
        "State management preferensi",
        "Struktur semantik screen reader",
      ],
      accentColor: "var(--brand-cyan)",
    },
    {
      icon: "🦉",
      title: "AI Assistant — OWI",
      description:
        "Asisten konsultan investasi berbasis RAG dengan bahasa sederhana dan edukatif.",
      highlights: [
        "Voice Input & Text-to-Speech",
        "Chat history per sesi",
        "Referensi valid OJK",
        "Fokus edukasi, bukan transaksi",
      ],
      accentColor: "var(--brand-magenta)",
    },
    {
      icon: "📚",
      title: "Micro-Learning Adaptif",
      description:
        "Modul singkat berbasis multi-modal untuk pembelajaran investasi yang efektif.",
      highlights: [
        "Fundamental keuangan & investasi",
        "Audio Learning Support",
        "Progress tracking",
      ],
      accentColor: "var(--brand-green)",
    },
    {
      icon: "📊",
      title: "Simulasi Investasi Sederhana",
      description:
        "Kalkulator pertumbuhan aset jangka panjang tanpa aksi jual-beli.",
      highlights: [
        "Grafik kontras tinggi",
        "Alt-text deskriptif otomatis",
        "Visualisasi risiko & return",
      ],
      accentColor: "var(--brand-orange)",
    },
  ];

  // User types from README
  const userTypes = [
    {
      icon: "👁️",
      title: "Tunanetra",
      features: ["Text-to-Speech", "ARIA Labels", "Screen Reader Support"],
    },
    {
      icon: "👂",
      title: "Tunarungu",
      features: ["Captionable Content", "Visual-first Learning UI"],
    },
    {
      icon: "🦾",
      title: "Disabilitas Daksa",
      features: ["Full Keyboard Navigation", "Large Click Area"],
    },
    {
      icon: "🧠",
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
      color: "var(--brand-cyan)",
    },
    {
      pilar: "Operable",
      title: "Dapat Dioperasikan",
      implementations: [
        "Full keyboard navigation",
        "Focus indicator jelas",
        "Button minimum 44×44 px",
      ],
      color: "var(--brand-green)",
    },
    {
      pilar: "Understandable",
      title: "Dapat Dipahami",
      implementations: [
        "Plain language content",
        "Icon clarity dengan label",
        "Breadcrumb onboarding",
      ],
      color: "var(--brand-orange)",
    },
    {
      pilar: "Robust",
      title: "Kokoh & Andal",
      implementations: [
        "ARIA role & label lengkap",
        "Screen reader friendly",
        "Struktur semantik HTML5",
      ],
      color: "var(--brand-magenta)",
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

  // Technology stack
  const technologies = [
    { name: "Next.js 14+", icon: "⚡" },
    { name: "Tailwind CSS", icon: "🎨" },
    { name: "Supabase", icon: "💾" },
    { name: "Google GenAI", icon: "🧠" },
    { name: "RAG Architecture", icon: "🔗" },
    { name: "Vercel", icon: "▲" },
  ];

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero Section */}
        <section
          className="min-h-screen flex items-center pt-20"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6">
                  <span>♿</span>
                  <span>Platform Edukasi Inklusif untuk Semua</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                  Literasi Investasi{" "}
                  <span className="text-[var(--brand-cyan)]">Tanpa Batas</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
                  Finable adalah platform edukasi investasi yang dirancang khusus
                  untuk penyandang disabilitas. Dengan AI Assistant{" "}
                  <strong className="text-[var(--brand-pink-light)]">OWI</strong>,
                  informasi investasi dapat dipahami dengan lebih mudah dan inklusif.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="#features" className="btn btn-light">
                    <span>🚀</span>
                    Jelajahi Fitur
                  </Link>
                  <Link
                    href="#owi"
                    className="btn"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <span>🦉</span>
                    Kenali OWI
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                  <div>
                    <div className="text-3xl font-bold text-[var(--brand-cyan)]">
                      4+
                    </div>
                    <div className="text-sm text-gray-300">Tipe Disabilitas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[var(--brand-green-light)]">
                      WCAG
                    </div>
                    <div className="text-sm text-gray-300">2.2 Compliant</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[var(--brand-pink-light)]">
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
        <section id="features" className="section bg-gradient-light">
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

        {/* Accessibility Section */}
        <section
          id="accessibility"
          className="section"
          style={{ background: "var(--brand-dark-blue)" }}
        >
          <div className="container mx-auto px-6">
            <h2 className="section-title text-white">
              Prinsip Aksesibilitas — WCAG 2.2
            </h2>
            <p className="section-subtitle text-gray-300">
              Finable mengimplementasikan standar aksesibilitas web internasional
              untuk memastikan akses yang setara bagi semua pengguna.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessibilityPilars.map((pilar, index) => (
                <AccessibilityCard
                  key={index}
                  pilar={pilar.pilar}
                  title={pilar.title}
                  implementations={pilar.implementations}
                  color={pilar.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* OWI Section */}
        <section id="owi" className="section bg-gradient-light">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: "var(--brand-dark-blue)" }}
                >
                  Filosofi Maskot — <span className="text-[var(--brand-magenta)]">OWI</span>
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
                          style={{ color: "var(--brand-dark-blue)" }}
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
                  style={{ background: "var(--gradient-hero)" }}
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

        {/* Technology Section */}
        <section id="technology" className="section">
          <div className="container mx-auto px-6">
            <h2 className="section-title">Teknologi Pendukung</h2>
            <p className="section-subtitle">
              Dibangun dengan teknologi modern untuk performa dan aksesibilitas
              terbaik.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--brand-dark-blue)" }}
                  >
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section
          id="impact"
          className="section"
          style={{ background: "linear-gradient(135deg, #1F4A2E 0%, #46B983 100%)" }}
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="section-title text-white">Dampak Sosial</h2>
            <p className="section-subtitle text-gray-200">
              Finable berkontribusi pada SDGs: Reduced Inequalities
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[
                { icon: "💪", title: "Kemandirian Finansial", desc: "Bagi penyandang disabilitas" },
                { icon: "🌍", title: "Inklusi Keuangan", desc: "Nasional yang merata" },
                { icon: "🛡️", title: "Pencegahan", desc: "Misinformasi finansial" },
                { icon: "🎯", title: "SDGs Goal 10", desc: "Reduced Inequalities" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl text-center"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-200 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="section bg-gradient-light">
          <div className="container mx-auto px-6 text-center">
            <h2 className="section-title">
              Mulai Perjalanan Literasi Investasi Anda
            </h2>
            <p className="section-subtitle">
              Finable hadir untuk memperjuangkan kesetaraan dalam akses literasi
              investasi. Karena setiap orang berhak cerdas secara finansial.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#features" className="btn btn-primary text-lg px-8 py-4">
                <span>🚀</span>
                Mulai Belajar Sekarang
              </Link>
              <Link href="#owi" className="btn btn-secondary text-lg px-8 py-4">
                <span>🦉</span>
                Tanya OWI
              </Link>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              <span>❗ Fokus edukasi — </span>
              <strong>bukan</strong> platform transaksi investasi
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
