import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

// Count only top-level materials for display (e.g. "5 materi")
function countTopLevelMaterials(lessonTree: any[]): number {
  return lessonTree.length;
}

// Get all lesson IDs for progress tracking (parent + children)
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

// Get ordered list of lessons for navigation
// Parent comes first, then its children
function getOrderedLessons(lessonTree: any[]): any[] {
  const lessons: any[] = [];
  for (const lesson of lessonTree) {
    lessons.push(lesson);
    if (lesson.children && lesson.children.length > 0) {
      lessons.push(...lesson.children);
    }
  }
  return lessons;
}

export default async function ModuleLearningPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }
  
  // Get user_id
  const { data: userData } = await supabase
    .from("users")
    .select("user_id")
    .eq("auth_id", user.id)
    .single();
  
  if (!userData) {
    redirect("/login");
  }
  
  // Get module data
  const { data: module, error: moduleError } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("module_id", moduleId)
    .single();
  
  if (moduleError || !module) {
    notFound();
  }
  
  // Check if enrolled
  const { data: enrollment } = await supabase
    .from("user_enrollments")
    .select("*")
    .eq("user_id", userData.user_id)
    .eq("module_id", moduleId)
    .single();
  
  if (!enrollment) {
    redirect(`/belajar/${moduleId}`);
  }
  
  // Get lessons (only parent and first-level children, no deeper nesting)
  const { data: lessons } = await supabase
    .from("module_lessons")
    .select("*")
    .eq("module_id", moduleId)
    .eq("is_published", true)
    .order("order_index", { ascending: true });
  
  // Build lesson tree (max 2 levels: parent and children)
  const lessonTree = (lessons || [])
    .filter((l: any) => l.parent_id === null)
    .map((parent: any) => ({
      ...parent,
      children: (lessons || [])
        .filter((c: any) => c.parent_id === parent.id)
        .sort((a: any, b: any) => a.order_index - b.order_index),
    }))
    .sort((a: any, b: any) => a.order_index - b.order_index);
  
  // Get all lesson IDs for progress tracking
  const allLessonIds = getAllLessonIds(lessonTree);
  // Top-level count for display
  const totalTopLevelMaterials = countTopLevelMaterials(lessonTree);
  // Total lessons for percentage calculation
  const totalLessonsForProgress = allLessonIds.length;
  
  // Get completed lessons
  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", userData.user_id)
    .in("lesson_id", allLessonIds.length > 0 ? allLessonIds : [0]);
  
  const completedLessonIds = (progress || [])
    .filter((p: any) => p.is_completed)
    .map((p: any) => p.lesson_id);
  
  // Count completed lessons
  const completedCount = completedLessonIds.filter((id: number) => 
    allLessonIds.includes(id)
  ).length;
  
  const progressPercentage = totalLessonsForProgress > 0 
    ? Math.round((completedCount / totalLessonsForProgress) * 100) 
    : 0;
  
  // Find first uncompleted lesson
  const orderedLessons = getOrderedLessons(lessonTree);
  const nextLesson = orderedLessons.find(
    (l: any) => !completedLessonIds.includes(l.id)
  ) || orderedLessons[0];
  
  // Determine which lessons are unlocked (sequential access)
  const unlockedLessonIds: number[] = [];
  for (let i = 0; i < orderedLessons.length; i++) {
    const lesson = orderedLessons[i];
    if (i === 0) {
      unlockedLessonIds.push(lesson.id);
    } else {
      const prevLesson = orderedLessons[i - 1];
      if (completedLessonIds.includes(prevLesson?.id)) {
        unlockedLessonIds.push(lesson.id);
      }
    }
  }
  // Also unlock all completed lessons
  completedLessonIds.forEach((id: number) => {
    if (!unlockedLessonIds.includes(id)) {
      unlockedLessonIds.push(id);
    }
  });
  
  const getLevelLabel = (level: string) => {
    switch (level) {
      case "basic": return "Pemula";
      case "intermediate": return "Menengah";
      case "advanced": return "Lanjutan";
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/kelas-saya"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--brand-sage)" }}
            >
              <span>←</span>
              <span>Kembali ke Kelas Saya</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {totalTopLevelMaterials} materi
              </span>
              <span className="font-bold text-lg" style={{ color: "var(--brand-sage)" }}>
                {progressPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero */}
      <div 
        className="py-8 sm:py-12 text-white"
        style={{ backgroundColor: "var(--brand-black)" }}
      >
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl">
            {module.category && (
              <span 
                className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
                style={{ backgroundColor: "var(--brand-blue)" }}
              >
                {module.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--brand-sage)" }}>
              {module.title}
            </h1>
            <p className="text-gray-300 mb-6">{module.description}</p>
            
            {/* Progress Bar */}
            <div className="bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: "var(--brand-sage)"
                }}
              />
            </div>
            <p className="text-sm text-gray-400">
              {progressPercentage}% selesai • {totalTopLevelMaterials} materi
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6" style={{ color: "var(--brand-black)" }}>
                Daftar Materi
              </h2>
              
              {lessonTree.length > 0 ? (
                <div className="space-y-4">
                  {lessonTree.map((lesson: any, idx: number) => {
                    const hasChildren = lesson.children && lesson.children.length > 0;
                    const isParentCompleted = completedLessonIds.includes(lesson.id);
                    const isParentUnlocked = unlockedLessonIds.includes(lesson.id);
                    
                    return (
                      <div key={lesson.id}>
                        {/* Parent Lesson - Always clickable now */}
                        {isParentUnlocked ? (
                          <Link
                            href={`/dashboard/belajar/${moduleId}/lesson/${lesson.id}`}
                            className={`flex items-start gap-4 p-4 rounded-xl transition-all hover:bg-gray-50 ${
                              isParentCompleted ? "opacity-80" : ""
                            }`}
                          >
                            <div 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                                isParentCompleted ? "bg-green-500" : ""
                              }`}
                              style={{ 
                                backgroundColor: isParentCompleted ? undefined : "var(--brand-sage)" 
                              }}
                            >
                              {isParentCompleted ? "✓" : idx + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold" style={{ color: "var(--brand-black)" }}>
                                {lesson.title}
                              </h3>
                              {hasChildren && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Pengantar • {lesson.children.length} sub-materi
                                </p>
                              )}
                            </div>
                            <span className="text-gray-400">→</span>
                          </Link>
                        ) : (
                          <div className="flex items-start gap-4 p-4 rounded-xl opacity-50 cursor-not-allowed">
                            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 font-bold shrink-0">
                              🔒
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-400">
                                {lesson.title}
                              </h3>
                              {hasChildren && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Pengantar • {lesson.children.length} sub-materi
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Children */}
                        {hasChildren && (
                          <div className="ml-14 space-y-2 mt-2">
                            {lesson.children.map((child: any, childIdx: number) => {
                              const isCompleted = completedLessonIds.includes(child.id);
                              const isUnlocked = unlockedLessonIds.includes(child.id);
                              
                              return isUnlocked ? (
                                <Link
                                  key={child.id}
                                  href={`/dashboard/belajar/${moduleId}/lesson/${child.id}`}
                                  className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 border-l-2 ${
                                    isCompleted 
                                      ? "border-green-500" 
                                      : "border-gray-200"
                                  }`}
                                >
                                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                                    isCompleted
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-100 text-gray-600"
                                  }`}>
                                    {isCompleted ? "✓" : `${idx + 1}.${childIdx + 1}`}
                                  </span>
                                  <span className="flex-1 text-sm" style={{ color: "var(--brand-black)" }}>
                                    {child.title}
                                  </span>
                                  <span className="text-gray-400 text-sm">→</span>
                                </Link>
                              ) : (
                                <div
                                  key={child.id}
                                  className="flex items-center gap-3 p-3 rounded-lg border-l-2 border-gray-200 opacity-50 cursor-not-allowed"
                                >
                                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-gray-100 text-gray-400">
                                    🔒
                                  </span>
                                  <span className="flex-1 text-sm text-gray-400">
                                    {child.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📝</div>
                  <p>Materi belum tersedia</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm sticky top-24">
              <h3 className="font-bold mb-4" style={{ color: "var(--brand-black)" }}>
                Informasi Kelas
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    📊
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tingkat</p>
                    <p className="font-medium" style={{ color: "var(--brand-black)" }}>
                      {getLevelLabel(module.difficulty_level)}
                    </p>
                  </div>
                </div>
                
                {module.duration && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      ⏱️
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Durasi</p>
                      <p className="font-medium" style={{ color: "var(--brand-black)" }}>
                        {module.duration}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    📚
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Materi</p>
                    <p className="font-medium" style={{ color: "var(--brand-black)" }}>
                      {totalTopLevelMaterials} materi
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              {nextLesson && completedCount < totalLessonsForProgress && (
                <Link
                  href={`/dashboard/belajar/${moduleId}/lesson/${nextLesson.id}`}
                  className="mt-6 w-full block text-center py-3 px-4 rounded-xl text-white font-medium transition-all hover:opacity-90"
                  style={{ 
                    backgroundColor: "var(--brand-sage)",
                    boxShadow: "0 4px 14px rgba(80, 217, 144, 0.3)"
                  }}
                >
                  {completedCount === 0 ? "Mulai Belajar" : "Lanjutkan Belajar"}
                </Link>
              )}
              
              {completedCount === totalLessonsForProgress && totalLessonsForProgress > 0 && (
                <div className="mt-6 text-center p-4 rounded-xl bg-green-50">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-semibold text-green-700">Selamat!</p>
                  <p className="text-sm text-green-600">Anda telah menyelesaikan kelas ini</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
