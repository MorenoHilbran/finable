import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import LessonContent from "./LessonContent";

// Count only top-level materials for display
function countTopLevelMaterials(lessonTree: any[]): number {
  return lessonTree.length;
}

// Get all lesson IDs for progress tracking
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

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await (supabase
    .from("users" as any) as any)
    .select("user_id")
    .eq("auth_id", user.id)
    .single();

  if (!userData) {
    redirect("/login");
  }

  const { data: module } = await (supabase
    .from("learning_modules" as any) as any)
    .select("*")
    .eq("module_id", moduleId)
    .single();

  if (!module) {
    notFound();
  }

  const { data: enrollment } = await (supabase
    .from("user_enrollments" as any) as any)
    .select("*")
    .eq("user_id", userData.user_id)
    .eq("module_id", moduleId)
    .single();

  if (!enrollment) {
    redirect(`/belajar/${moduleId}`);
  }

  const { data: lesson } = await (supabase
    .from("module_lessons" as any) as any)
    .select("*")
    .eq("id", lessonId)
    .eq("module_id", moduleId)
    .eq("is_published", true)
    .single();

  if (!lesson) {
    notFound();
  }

  const { data: allLessons } = await (supabase
    .from("module_lessons" as any) as any)
    .select("*")
    .eq("module_id", moduleId)
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  // Build lesson tree
  const lessonTree = (allLessons || [])
    .filter((l: any) => l.parent_id === null)
    .map((parent: any) => ({
      ...parent,
      children: (allLessons || [])
        .filter((c: any) => c.parent_id === parent.id)
        .sort((a: any, b: any) => a.order_index - b.order_index),
    }))
    .sort((a: any, b: any) => a.order_index - b.order_index);

  // Get all lesson IDs for progress
  const allLessonIds = getAllLessonIds(lessonTree);
  const totalTopLevelMaterials = countTopLevelMaterials(lessonTree);
  const totalLessonsForProgress = allLessonIds.length;

  const { data: progress } = await (supabase
    .from("user_lesson_progress" as any) as any)
    .select("*")
    .eq("user_id", userData.user_id)
    .in("lesson_id", allLessonIds.length > 0 ? allLessonIds : [0]);

  const completedLessonIds = (progress || [])
    .filter((p: any) => p.is_completed)
    .map((p: any) => p.lesson_id);

  const completedCount = completedLessonIds.filter((id: number) =>
    allLessonIds.includes(id)
  ).length;

  const progressPercentage = totalLessonsForProgress > 0
    ? Math.round((completedCount / totalLessonsForProgress) * 100)
    : 0;

  // Get ordered lessons for navigation
  const orderedLessons = getOrderedLessons(lessonTree);

  // Determine unlocked lessons
  const unlockedLessonIds: number[] = [];
  for (let i = 0; i < orderedLessons.length; i++) {
    const l = orderedLessons[i];
    if (i === 0) {
      unlockedLessonIds.push(l.id);
    } else {
      const prevLesson = orderedLessons[i - 1];
      if (completedLessonIds.includes(prevLesson?.id)) {
        unlockedLessonIds.push(l.id);
      }
    }
  }
  completedLessonIds.forEach((id: number) => {
    if (!unlockedLessonIds.includes(id)) {
      unlockedLessonIds.push(id);
    }
  });

  // If lesson is locked, redirect to module overview
  if (!unlockedLessonIds.includes(lesson.id)) {
    redirect(`/dashboard/belajar/${moduleId}`);
  }

  // Find prev/next lessons
  const currentIndex = orderedLessons.findIndex((l: any) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < orderedLessons.length - 1 ? orderedLessons[currentIndex + 1] : null;

  return (
    <LessonContent
      module={module}
      lesson={lesson}
      lessonTree={lessonTree}
      completedLessonIds={completedLessonIds}
      unlockedLessonIds={unlockedLessonIds}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      progressPercentage={progressPercentage}
      totalTopLevelMaterials={totalTopLevelMaterials}
      totalLessonsForProgress={totalLessonsForProgress}
      completedCount={completedCount}
    />
  );
}
