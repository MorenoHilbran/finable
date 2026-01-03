import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  const modules = [
    {
      title: "Kelas Saya",
      description: "Akses modul pembelajaran investasi yang telah disesuaikan dengan kebutuhan Anda.",
      icon: "📚",
      href: "/dashboard/kelas-saya",
      color: "var(--brand-sage)",
      stats: "0 Modul",
    },
    {
      title: "Investasi",
      description: "Simulasi dan pantau perkembangan investasi Anda dengan visualisasi yang mudah dipahami.",
      icon: "📊",
      href: "/dashboard/investasi",
      color: "var(--brand-blue)",
      stats: "0 Simulasi",
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div
        className="rounded-2xl p-8 mb-8 text-white"
        style={{ backgroundColor: "var(--brand-sage)" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl animate-float">🦉</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Halo, {userName}! 👋
            </h1>
            <p className="text-gray-200 mt-1">
              Selamat datang di dashboard Finable. Mari lanjutkan belajar!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Modul Selesai", value: "0", icon: "✅", color: "var(--brand-sage)" },
          { label: "Dalam Proses", value: "0", icon: "📖", color: "var(--brand-blue)" },
          { label: "Sertifikat", value: "0", icon: "🏆", color: "var(--brand-sage)" },
          { label: "Poin", value: "0", icon: "⭐", color: "var(--brand-blue)" },
        ].map((stat, index) => (
          <div
            key={index}
            className="card text-center"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div
              className="text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: "var(--brand-black)" }}
      >
        Modul Pembelajaran
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {modules.map((module, index) => (
          <Link
            key={index}
            href={module.href}
            className="card group hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${module.color}20` }}
              >
                {module.icon}
              </div>
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold mb-1 group-hover:text-[var(--brand-sage)] transition-colors"
                  style={{ color: "var(--brand-black)" }}
                >
                  {module.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {module.description}
                </p>
                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: module.color }}
                >
                  <span>{module.stats}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* OWI CTA */}
      <div
        className="mt-8 rounded-2xl p-6 text-center"
        style={{ background: "linear-gradient(135deg, rgba(80, 217, 144, 0.1) 0%, rgba(78, 153, 204, 0.1) 100%)" }}
      >
        <div className="text-4xl mb-3">🦉</div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--brand-black)" }}
        >
          Butuh Bantuan?
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Tanyakan apapun tentang investasi kepada OWI, asisten AI Anda.
        </p>
        <button
          className="btn btn-primary"
          disabled
        >
          <span>💬</span>
          Tanya OWI (Segera Hadir)
        </button>
      </div>
    </div>
  );
}
