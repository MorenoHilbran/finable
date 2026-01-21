import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Count only top-level materials for display
function countTopLevelMaterials(lessons: any[]): number {
  return lessons.filter(l => l.parent_id === null).length;
}

// Get all lesson IDs for progress tracking
function getAllLessonIds(lessons: any[]): number[] {
  return lessons.map(l => l.id);
}

// GET - Get user's enrolled classes
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData, error: userError } = await (supabase
    .from("users" as any) as any)
    .select("user_id")
    .eq("auth_id", user.id)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: enrollments, error } = await (supabase
    .from("user_enrollments" as any) as any)
    .select(`
      *,
      learning_modules (
        module_id,
        title,
        description,
        thumbnail_url,
        difficulty_level,
        duration,
        category
      )
    `)
    .eq("user_id", userData.user_id)
    .order("last_accessed_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get progress for each enrollment
  const enrollmentsWithProgress = await Promise.all(
    (enrollments || []).map(async (enrollment: any) => {
      // Get all lessons for this module
      const { data: moduleLessons } = await (supabase
        .from("module_lessons" as any) as any)
        .select("id, parent_id")
        .eq("module_id", enrollment.module_id)
        .eq("is_published", true);

      // Count top-level for display
      const totalTopLevel = countTopLevelMaterials(moduleLessons || []);
      // Get all IDs for progress
      const allLessonIds = getAllLessonIds(moduleLessons || []);
      const totalForProgress = allLessonIds.length;

      // Get completed lessons
      const { data: completedLessons } = await (supabase
        .from("user_lesson_progress" as any) as any)
        .select("lesson_id")
        .eq("user_id", userData.user_id)
        .eq("is_completed", true);

      // Count completed
      const completedCount = (completedLessons || []).filter(
        (p: any) => allLessonIds.includes(p.lesson_id)
      ).length;

      return {
        ...enrollment,
        total_lessons: totalTopLevel, // Display count (top-level only)
        completed_lessons: completedCount,
        progress_percentage: totalForProgress > 0
          ? Math.round((completedCount / totalForProgress) * 100)
          : 0
      };
    })
  );

  return NextResponse.json(enrollmentsWithProgress);
}

// POST - Enroll user to a class
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { module_id } = body;

  if (!module_id) {
    return NextResponse.json({ error: "module_id is required" }, { status: 400 });
  }

  const { data: userDataResponse, error: userError } = await (supabase
    .from("users" as any) as any)
    .select("user_id")
    .eq("auth_id", user.id)
    .single();

  const userData = userDataResponse as any;

  if (userError || !userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: existing } = await (supabase
    .from("user_enrollments" as any) as any)
    .select("id")
    .eq("user_id", userData.user_id)
    .eq("module_id", module_id)
    .single();

  if (existing) {
    const { data, error } = await (supabase
      .from("user_enrollments" as any) as any)
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await (supabase
    .from("user_enrollments" as any) as any)
    .insert({
      user_id: userData.user_id,
      module_id: module_id
    } as any)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
