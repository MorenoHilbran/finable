import Link from "next/link";

export default function InvestasiPage() {
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
              Investasi
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
          📊 Investasi
        </h1>
        <p className="text-gray-600">
          Simulasi dan pantau perkembangan investasi Anda dengan visualisasi yang mudah dipahami.
        </p>
      </div>

      {/* Empty State */}
      <div
        className="card text-center py-16"
        style={{ background: "linear-gradient(135deg, rgba(80, 217, 144, 0.05) 0%, rgba(78, 153, 204, 0.05) 100%)" }}
      >
        <div className="text-6xl mb-4">📈</div>
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--brand-dark-blue)" }}
        >
          Belum Ada Simulasi
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Fitur simulasi investasi akan segera tersedia. Anda akan dapat mencoba berbagai skenario investasi tanpa risiko.
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

      {/* Feature Preview */}
      <h3
        className="text-lg font-semibold mt-8 mb-4"
        style={{ color: "var(--brand-dark-blue)" }}
      >
        Fitur yang Akan Tersedia
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: "Simulasi Reksa Dana",
            description: "Hitung estimasi pertumbuhan investasi reksa dana Anda dengan berbagai skenario.",
            icon: "🎯",
            color: "var(--brand-blue)",
          },
          {
            title: "Kalkulator Saham",
            description: "Simulasikan potensi keuntungan dan risiko dari investasi saham.",
            icon: "📊",
            color: "var(--brand-sage)",
          },
          {
            title: "Perbandingan Instrumen",
            description: "Bandingkan berbagai instrumen investasi sesuai profil risiko Anda.",
            icon: "⚖️",
            color: "var(--brand-blue)",
          },
          {
            title: "Proyeksi Jangka Panjang",
            description: "Lihat proyeksi pertumbuhan aset Anda dalam 5, 10, hingga 20 tahun.",
            icon: "🔮",
            color: "var(--brand-sage)",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="card opacity-60 flex items-start gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${feature.color}20` }}
            >
              {feature.icon}
            </div>
            <div>
              <h4
                className="font-semibold mb-1"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div
        className="mt-8 p-6 rounded-xl"
        style={{
          background: "rgba(33, 33, 33, 0.05)",
          border: "1px solid rgba(33, 33, 33, 0.1)",
        }}
      >
        <div className="flex items-start gap-4">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4
              className="font-semibold mb-1"
              style={{ color: "var(--brand-dark-blue)" }}
            >
              Catatan Penting
            </h4>
            <p className="text-sm text-gray-600">
              Finable adalah platform <strong>edukasi</strong>, bukan platform transaksi investasi.
              Semua simulasi bersifat edukatif dan tidak merepresentasikan keuntungan yang nyata.
              Selalu konsultasikan dengan penasihat keuangan profesional sebelum berinvestasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
