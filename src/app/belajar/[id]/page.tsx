import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Squares from "@/components/Squares";
import Link from "next/link";
import EnrollButton from "@/components/EnrollButton";
import TextReader from "@/components/TextReader";
import ListenButton from "@/components/ListenButton";
import SummarizeButton from "@/components/SummarizeButton";

// Local interfaces to resolve type inference issues
interface LocalLearningModule {
  module_id: number;
  title: string;
  category: string | null;
  description: string;
  thumbnail_url: string | null;
  content: string | null;
  difficulty_level: string;
  duration: string | null;
  content_type: string;
}

interface LocalModuleLesson {
  id: number;
  module_id: number;
  parent_id: number | null;
  title: string;
  content: string | null;
  order_index: number;
  is_published: boolean;
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moduleId = parseInt(id);
  const supabase = await createClient();

  // Validate moduleId
  if (isNaN(moduleId)) {
    notFound();
  }

  const { data: moduleData, error } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("module_id", moduleId)
    .eq("is_published", true)
    .single();

  const module = moduleData as unknown as LocalLearningModule | null;

  if (error || !module) {
    notFound();
  }

  // Check if user is logged in and enrolled
  const { data: { user } } = await supabase.auth.getUser();
  let isEnrolled = false;

  if (user) {
    const { data: userDataResponse } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_id", user.id)
      .single();

    const userData = userDataResponse as unknown as { user_id: number } | null;

    if (userData) {
      const { data: enrollment } = await supabase
        .from("user_enrollments")
        .select("id")
        .eq("user_id", userData.user_id)
        .eq("module_id", moduleId)
        .single();

      isEnrolled = !!enrollment;
    }
  }

  // Fetch recommended modules (other published modules, excluding current one)
  const { data: recommendedModulesData } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("is_published", true)
    .neq("module_id", moduleId)
    .order("order_index", { ascending: true })
    .limit(4);

  const recommendedModules = recommendedModulesData as unknown as LocalLearningModule[] | null;

  // Fetch lessons for this module (published only)
  const { data: lessonsData } = await supabase
    .from("module_lessons")
    .select("*")
    .eq("module_id", moduleId)
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  const lessons = lessonsData as unknown as LocalModuleLesson[] | null;

  // Build lesson tree (only level 0 and 1)
  const lessonTree = (lessons || [])
    .filter((l: any) => l.parent_id === null)
    .map((parent: any) => ({
      ...parent,
      children: (lessons || []).filter((c: any) => c.parent_id === parent.id),
    }));

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "basic": return "Pemula";
      case "intermediate": return "Menengah";
      case "advanced": return "Lanjutan";
      default: return level;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "text": return "📖 Teks";
      case "audio": return "🎧 Audio";
      case "visual": return "🎬 Visual";
      case "mixed": return "📦 Campuran";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section
          className="py-12 text-white"
          style={{ backgroundColor: "var(--brand-black)" }}
        >
          <div className="container px-6">
            <Link
              href="/belajar"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
            >
              ← Kembali ke Daftar Modul
            </Link>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                {module.category && (
                  <span
                    className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
                    style={{ backgroundColor: "var(--brand-blue)" }}
                  >
                    {module.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--brand-sage)" }}>
                  {module.title}
                </h1>
                <p className="text-lg text-gray-200">
                  {module.description}
                </p>

                {/* Mobile CTA */}
                <div className="mt-6 lg:hidden">
                  <EnrollButton
                    moduleId={module.module_id}
                    isEnrolled={isEnrolled}
                    isLoggedIn={!!user}
                  />
                </div>
              </div>

              <div className="hidden lg:block">
                {module.thumbnail_url ? (
                  <img
                    src={module.thumbnail_url}
                    alt={module.title}
                    className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-64 bg-white/10 rounded-2xl flex items-center justify-center">
                    <span className="text-6xl">📚</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 relative overflow-hidden">
          {/* Squares Background inside section */}
          <div className="absolute inset-0 -z-10">
            <Squares
              direction="diagonal"
              speed={0.3}
              squareSize={50}
              borderColor="rgba(33, 33, 33, 0.08)"
              hoverFillColor="rgba(80, 217, 144, 0.05)"
            />
          </div>

          <div className="container px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content - Left */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <h2 className="text-2xl font-bold" style={{ color: "var(--brand-black)" }}>
                      Tentang Modul
                    </h2>
                    <div className="flex gap-2">
                      <SummarizeButton content={module.content || ""} />
                      <ListenButton text={module.content || ""} title={module.title} />
                    </div>
                  </div>

                  {module.content ? (
                    <div
                      className="prose prose-lg max-w-none"
                      style={{
                        color: "var(--brand-black)",
                        wordBreak: "break-word",
                        overflowWrap: "break-word"
                      }}
                    >
                      {/* Simple markdown-like rendering */}
                      {module.content.split('\n').map((line: string, index: number) => {
                        if (line.startsWith('# ')) {
                          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 break-words">{line.slice(2)}</h2>;
                        }
                        if (line.startsWith('## ')) {
                          return <h3 key={index} className="text-xl font-bold mt-6 mb-3 break-words">{line.slice(3)}</h3>;
                        }
                        if (line.startsWith('### ')) {
                          return <h4 key={index} className="text-lg font-bold mt-4 mb-2 break-words">{line.slice(4)}</h4>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={index} className="ml-4 break-words">{line.slice(2)}</li>;
                        }
                        if (line.trim() === '') {
                          return <br key={index} />;
                        }
                        return <p key={index} className="mb-4 leading-relaxed break-words whitespace-pre-wrap">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p>Konten modul sedang dalam pengembangan</p>
                    </div>
                  )}
                </div>

                {/* Lessons Overview Card */}
                {lessonTree.length > 0 && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm mt-6">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--brand-black)" }}>
                      Materi yang Dipelajari
                    </h2>

                    <div className="space-y-3">
                      {lessonTree.map((lesson: any, idx: number) => (
                        <div key={lesson.id}>
                          {/* Parent Lesson */}
                          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                              style={{ backgroundColor: "var(--brand-sage)" }}
                            >
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold" style={{ color: "var(--brand-black)" }}>
                                  {lesson.title}
                                </h4>
                                {lesson.content && (
                                  <div className="shrink-0">
                                    <ListenButton text={lesson.content} title={lesson.title} variant="icon" />
                                  </div>
                                )}
                              </div>
                              {lesson.children && lesson.children.length > 0 && (
                                <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-2">
                                  {lesson.children.map((child: any, childIdx: number) => (
                                    <div key={child.id} className="flex items-center justify-between gap-2 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{idx + 1}.{childIdx + 1}</span>
                                        <span>{child.title}</span>
                                      </div>
                                      {child.content && (
                                        <div className="shrink-0">
                                          <ListenButton text={child.content} title={child.title} variant="icon" />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA at bottom of lessons */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <EnrollButton
                        moduleId={module.module_id}
                        isEnrolled={isEnrolled}
                        isLoggedIn={!!user}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Right */}
              <div className="lg:w-80 shrink-0">
                <div className="bg-white rounded-2xl p-6 shadow-sm sticky">
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--brand-black)" }}>
                    Informasi Modul
                  </h3>

                  <div className="space-y-4">
                    {/* Difficulty Level */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <span className="text-xl">📊</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Tingkat Kesulitan</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${module.difficulty_level === "basic"
                          ? "bg-green-100 text-green-700"
                          : module.difficulty_level === "intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          }`}>
                          {getLevelLabel(module.difficulty_level)}
                        </span>
                      </div>
                    </div>

                    {/* Duration */}
                    {module.duration && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <span className="text-xl">⏱️</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Durasi</p>
                          <p className="font-medium" style={{ color: "var(--brand-black)" }}>
                            {module.duration}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Total Lessons */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <span className="text-xl">📚</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Materi</p>
                        <p className="font-medium" style={{ color: "var(--brand-black)" }}>
                          {lessons?.length || 0} materi
                        </p>
                      </div>
                    </div>

                    {/* Content Type */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <span className="text-xl">
                          {module.content_type === "text" ? "📖"
                            : module.content_type === "audio" ? "🎧"
                              : module.content_type === "visual" ? "🎬"
                                : "📦"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Tipe Konten</p>
                        <p className="font-medium" style={{ color: "var(--brand-black)" }}>
                          {getContentTypeLabel(module.content_type).replace(/^[^\s]+\s/, '')}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    {module.category && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <span className="text-xl">📁</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Kategori</p>
                          <p className="font-medium" style={{ color: "var(--brand-black)" }}>
                            {module.category}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <EnrollButton
                      moduleId={module.module_id}
                      isEnrolled={isEnrolled}
                      isLoggedIn={!!user}
                    />
                    {!user && (
                      <p className="text-xs text-gray-500 text-center mt-3">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline">
                          Login
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Modules Section */}
        {recommendedModules && recommendedModules.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container px-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--brand-black)" }}>
                Modul Lainnya
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedModules.map((recModule: any) => (
                  <Link
                    key={recModule.module_id}
                    href={`/belajar/${recModule.module_id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      {/* Thumbnail */}
                      <div className="relative h-36 overflow-hidden">
                        {recModule.thumbnail_url ? (
                          <img
                            src={recModule.thumbnail_url}
                            alt={recModule.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-3xl">📚</span>
                          </div>
                        )}
                        {recModule.category && (
                          <div
                            className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: "var(--brand-blue)" }}
                          >
                            {recModule.category}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3
                          className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                          style={{ color: "var(--brand-black)" }}
                        >
                          {recModule.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${recModule.difficulty_level === "basic"
                            ? "bg-green-100 text-green-700"
                            : recModule.difficulty_level === "intermediate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                            }`}>
                            {getLevelLabel(recModule.difficulty_level)}
                          </span>
                          {recModule.duration && (
                            <span className="text-xs text-gray-500">
                              ⏱️ {recModule.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <TextReader />
      <Footer />
    </div>
  );
}
