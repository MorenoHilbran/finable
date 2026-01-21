import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Helper to get all lesson IDs from lesson tree
function getAllLessonIds(lessonTree: any[]): number[] {
  const ids: number[] = [];
  for (const lesson of lessonTree) {
    ids.push(lesson.id);
    if (lesson.children && lesson.children.length > 0) {
      ids.push(...lesson.children.map((c: any) => c.id));
    }
  }
  return ids;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  // Get user data for stats
  let completedModules = 0;
  let inProgressModules = 0;
  let totalBadges = 0;
  let enrolledCount = 0;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_id", user.id)
      .single();

    if (userData) {
      // Get user's enrollments
      const { data: enrollments } = await supabase
        .from("user_enrollments")
        .select("module_id")
        .eq("user_id", userData.user_id);

      enrolledCount = enrollments?.length || 0;

      if (enrollments && enrollments.length > 0) {
        // Check each module's completion status
        for (const enrollment of enrollments as { module_id: number }[]) {
          // Get all lessons for this module
          const { data: lessons } = await supabase
            .from("module_lessons")
            .select("id")
            .eq("module_id", enrollment.module_id)
            .eq("is_published", true);

          if (lessons && lessons.length > 0) {
            const lessonIds = (lessons as { id: number }[]).map(l => l.id);

            // Get completed lessons for this user in this module
            const { data: completedLessons } = await supabase
              .from("user_lesson_progress")
              .select("lesson_id")
              .eq("user_id", userData.user_id)
              .eq("is_completed", true)
              .in("lesson_id", lessonIds);

            // Check if all lessons are completed
            const completedLessonIds = ((completedLessons || []) as { lesson_id: number }[]).map(cl => cl.lesson_id);
            const allCompleted = lessonIds.every(id => completedLessonIds.includes(id));

            if (allCompleted && lessonIds.length > 0) {
              completedModules++;
            } else if (completedLessonIds.length > 0 && !allCompleted) {
              inProgressModules++;
            }
          }
        }
      }

      // Calculate badges (1 badge per completed module, max 20)
      totalBadges = Math.min(completedModules, 20);
    }
  }

  const modules = [
    {
      title: "Kelas Saya",
      description: "Akses modul pembelajaran investasi yang telah disesuaikan dengan kebutuhan Anda.",
      icon: "/icons/learn.svg",
      href: "/dashboard/kelas-saya",
      color: "var(--brand-sage)",
      stats: `${enrolledCount} Modul`,
    },
    {
      title: "Investasi",
      description: "Simulasi dan pantau perkembangan investasi Anda dengan visualisasi yang mudah dipahami.",
      icon: "/icons/invest.svg",
      href: "/dashboard/investasi",
      color: "var(--brand-blue)",
      stats: "0 Simulasi",
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div
        className="rounded-2xl p-8 mb-8 text-white"
        style={{ backgroundColor: "var(--brand-sage)" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="animate-float"><img src="/mascot/owi-mascot-1.svg" alt="OWI" className="w-16 h-16" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Halo, {userName}!
            </h1>
            <p className="text-gray-200 mt-1">
              Selamat datang di dashboard Finable. Mari lanjutkan belajar!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Modul Selesai", value: completedModules.toString(), icon: "/icons/icon-check.svg", color: "var(--brand-sage)" },
          { label: "Dalam Proses", value: inProgressModules.toString(), icon: "/icons/icon-progress.svg", color: "var(--brand-blue)" },
          { label: "Badges", value: totalBadges.toString(), icon: "/icons/icon-trophy.svg", color: "var(--brand-sage)" },
        ].map((stat, index) => (
          <div
            key={index}
            className="card text-center"
          >
            <img 
              src={stat.icon} 
              alt={stat.label} 
              className="w-10 h-10 mb-2 mx-auto" 
              style={{ 
                filter: stat.color === "var(--brand-sage)" 
                  ? "brightness(0) saturate(100%) invert(67%) sepia(52%) saturate(405%) hue-rotate(93deg) brightness(92%) contrast(87%)" 
                  : stat.color === "var(--brand-blue)" 
                    ? "brightness(0) saturate(100%) invert(52%) sepia(98%) saturate(234%) hue-rotate(166deg) brightness(94%) contrast(86%)"
                    : undefined 
              }}
            />
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
                <img src={module.icon} alt={module.title} className="w-8 h-8" />
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
        <div className="mb-3 flex justify-center"><img src="/mascot/owi-mascot-2.svg" alt="OWI" className="w-12 h-12" /></div>
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
          Tanya OWI (Segera Hadir)
        </button>
      </div>
    </div>
  );
}
