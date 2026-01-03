import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Get stats
  const { count: totalModules } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true });
  
  const { count: publishedModules } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);
  
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });
  
  const stats = [
    { 
      label: "Total Modul", 
      value: totalModules || 0, 
      icon: "📚", 
      color: "var(--brand-blue)" 
    },
    { 
      label: "Modul Dipublikasi", 
      value: publishedModules || 0, 
      icon: "✅", 
      color: "var(--brand-sage)" 
    },
    { 
      label: "Total Pengguna", 
      value: totalUsers || 0, 
      icon: "👥", 
      color: "var(--brand-black)" 
    },
  ];
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--brand-black)" }}>
          Dashboard Admin
        </h1>
        <p className="text-gray-600 mt-2">
          Selamat datang di panel admin Finable
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                {stat.icon}
              </div>
              <div>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--brand-black)" }}>
          Aksi Cepat
        </h2>
        <div className="flex gap-4">
          <Link
            href="/admin/modules/create"
            className="px-6 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--brand-sage)" }}
          >
            + Tambah Modul Baru
          </Link>
          <Link
            href="/admin/modules"
            className="px-6 py-3 rounded-xl font-medium border-2 transition-all hover:bg-gray-50"
            style={{ borderColor: "var(--brand-black)", color: "var(--brand-black)" }}
          >
            Kelola Modul
          </Link>
        </div>
      </div>
    </div>
  );
}
