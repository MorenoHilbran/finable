import Link from "next/link";

export default function KelasSayaPage() {
  return (
    <div>
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Back Button - Top Left */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-sage)" }}
        >
          <span>←</span>
          <span>Kembali ke Dashboard</span>
        </Link>

        {/* Breadcrumb - Top Right */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/dashboard"
                className="transition-colors hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                Dashboard
              </Link>
            </li>
            <li style={{ color: "var(--text-muted)" }}>/</li>
            <li
              className="font-medium"
              style={{ color: "var(--brand-black)" }}
            >
              Kelas Saya
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: "var(--brand-dark-blue)" }}
        >
          📚 Kelas Saya
        </h1>
        <p className="text-gray-600">
          Akses modul pembelajaran investasi yang telah disesuaikan dengan kebutuhan Anda.
        </p>
      </div>

      {/* Empty State */}
      <div
        className="card text-center py-16"
        style={{ background: "linear-gradient(135deg, rgba(78, 153, 204, 0.05) 0%, rgba(80, 217, 144, 0.05) 100%)" }}
      >
        <div className="text-6xl mb-4">📖</div>
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--brand-dark-blue)" }}
        >
          Belum Ada Kelas
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Modul pembelajaran akan segera tersedia. Kami sedang menyiapkan konten edukasi investasi yang inklusif dan mudah dipahami.
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: "rgba(80, 217, 144, 0.1)",
            color: "var(--brand-sage)",
          }}
        >
          <span>🚧</span>
          Segera Hadir
        </div>
      </div>

      {/* Preview Cards */}
      <h3
        className="text-lg font-semibold mt-8 mb-4"
        style={{ color: "var(--brand-dark-blue)" }}
      >
        Modul yang Akan Tersedia
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Dasar-Dasar Investasi",
            description: "Pelajari konsep investasi dari nol dengan bahasa yang mudah dipahami.",
            icon: "🌱",
            level: "Pemula",
          },
          {
            title: "Mengenal Reksa Dana",
            description: "Pahami cara kerja reksa dana dan bagaimana memilih yang tepat.",
            icon: "📊",
            level: "Pemula",
          },
          {
            title: "Investasi Saham 101",
            description: "Pengenalan pasar saham dan cara menganalisis perusahaan.",
            icon: "📈",
            level: "Menengah",
          },
          {
            title: "Perencanaan Keuangan",
            description: "Susun rencana keuangan yang sesuai dengan tujuan hidup Anda.",
            icon: "🎯",
            level: "Pemula",
          },
          {
            title: "Manajemen Risiko",
            description: "Pelajari cara mengelola risiko dalam berinvestasi.",
            icon: "🛡️",
            level: "Menengah",
          },
          {
            title: "Investasi Obligasi",
            description: "Kenali instrumen obligasi dan potensi keuntungannya.",
            icon: "📄",
            level: "Menengah",
          },
        ].map((module, index) => (
          <div
            key={index}
            className="card opacity-60"
          >
            <div className="text-3xl mb-3">{module.icon}</div>
            <h4
              className="font-semibold mb-1"
              style={{ color: "var(--brand-dark-blue)" }}
            >
              {module.title}
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              {module.description}
            </p>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: module.level === "Pemula"
                  ? "rgba(80, 217, 144, 0.1)"
                  : "rgba(78, 153, 204, 0.1)",
                color: module.level === "Pemula"
                  ? "var(--brand-sage)"
                  : "var(--brand-blue)",
              }}
            >
              {module.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
