import Link from "next/link";

export default function SimulasiPage() {
  return (
    <div className="p-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Back Button - Top Left */}
        <Link
          href="/dashboard/investasi"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-cyan)" }}
        >
          <span>←</span>
          <span>Kembali ke Investasi</span>
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
            <li>
              <Link
                href="/dashboard/investasi"
                className="transition-colors hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                Investasi
              </Link>
            </li>
            <li style={{ color: "var(--text-muted)" }}>/</li>
            <li
              className="font-medium"
              style={{ color: "var(--brand-dark-blue)" }}
            >
              Simulasi
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
          Simulasi Investasi
        </h1>
        <p className="text-gray-600">
          Latih kemampuan investasi Anda dengan simulasi tanpa risiko finansial nyata.
        </p>
      </div>

      {/* Coming Soon Hero */}
      <div
        className="card text-center py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(72, 189, 208, 0.08) 0%, rgba(70, 185, 131, 0.08) 100%)" }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-10 left-10 w-20 h-20 rounded-full animate-pulse"
            style={{ background: "rgba(72, 189, 208, 0.1)" }}
          />
          <div
            className="absolute bottom-10 right-10 w-32 h-32 rounded-full animate-pulse"
            style={{ background: "rgba(70, 185, 131, 0.1)", animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-pulse"
            style={{ background: "rgba(184, 48, 139, 0.05)", animationDelay: "0.5s" }}
          />
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <img src="/icons/icon-rocket.svg" alt="" className="w-20 h-20 mx-auto animate-bounce" style={{ animationDuration: "2s" }} />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: "var(--brand-dark-blue)" }}
          >
            Segera Hadir!
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Kami sedang mengembangkan fitur simulasi investasi yang akan membantu Anda 
            mempraktikkan strategi tanpa risiko uang nyata.
          </p>
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
            style={{
              background: "var(--gradient-cta)",
              color: "var(--brand-sage)",
              boxShadow: "0 4px 14px rgba(72, 189, 208, 0.3)",
            }}
          >
            <img src="/icons/icon-clock.svg" alt="" className="w-5 h-5 animate-spin" style={{ animationDuration: "3s" }} />
            Dalam Pengembangan
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <h3
        className="text-lg font-semibold mt-8 mb-4"
        style={{ color: "var(--brand-dark-blue)" }}
      >
        Fitur yang Sedang Dikembangkan
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: "Simulasi Reksa Dana",
            description: "Simulasikan investasi reksa dana dengan data historis nyata.",
            icon: "/icons/icon-trending.svg",
            color: "var(--brand-cyan)",
            progress: 65,
          },
          {
            title: "Simulasi Saham",
            description: "Beli dan jual saham virtual untuk belajar analisis pasar.",
            icon: "/icons/icon-bar-chart.svg",
            color: "var(--brand-green)",
            progress: 45,
          },
          {
            title: "Paper Trading",
            description: "Trading dengan uang virtual, pengalaman nyata tanpa risiko.",
            icon: "/icons/icon-chart.svg",
            color: "var(--brand-orange)",
            progress: 30,
          },
          {
            title: "Skenario Challenge",
            description: "Tantangan investasi dengan skenario ekonomi yang berbeda.",
            icon: "/icons/icon-certificate.svg",
            color: "var(--brand-magenta)",
            progress: 20,
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="card flex items-start gap-4"
            style={{ opacity: 0.8 }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${feature.color}20` }}
            >
              <img src={feature.icon} alt="" className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4
                className="font-semibold mb-1"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {feature.description}
              </p>
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${feature.progress}%`,
                      background: feature.color,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">{feature.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Sign Up */}
      <div
        className="mt-8 p-6 rounded-xl"
        style={{
          background: "rgba(72, 189, 208, 0.05)",
          border: "1px solid rgba(72, 189, 208, 0.2)",
        }}
      >
        <div className="flex items-start gap-4">
          <img src="/icons/icon-bell.svg" alt="" className="w-6 h-6" />
          <div>
            <h4
              className="font-semibold mb-1"
              style={{ color: "var(--brand-dark-blue)" }}
            >
              Ingin Diberitahu Saat Tersedia?
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Kami akan mengirimkan pemberitahuan saat fitur simulasi siap digunakan.
            </p>
            <button
              className="btn btn-primary text-sm py-2 px-4"
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            >
              Notifikasi (Segera Hadir)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
