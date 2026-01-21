import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Get lesson progress status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user_id
  const { data: userData } = await (supabase
    .from("users" as any) as any)
    .select("user_id")
    .eq("auth_id", user.id)
    .single();

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get progress for this lesson
  const { data: progress } = await (supabase
    .from("user_lesson_progress" as any) as any)
    .select("*")
    .eq("user_id", userData.user_id)
    .eq("lesson_id", id)
    .single();

  return NextResponse.json({
    lesson_id: parseInt(id),
    is_completed: progress?.is_completed || false,
    completed_at: progress?.completed_at || null
  });
}

// POST - Mark lesson as completed
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user_id
  const { data: userDataResponse } = await (supabase
    .from("users" as any) as any)
    .select("user_id")
    .eq("auth_id", user.id)
    .single();

  const userData = userDataResponse as any;

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if lesson exists
  const { data: lesson, error: lessonError } = await (supabase
    .from("module_lessons" as any) as any)
    .select("id, module_id")
    .eq("id", id)
    .single();

  if (lessonError || !lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Check if user is enrolled in the module
  const { data: enrollment } = await (supabase
    .from("user_enrollments" as any) as any)
    .select("id")
    .eq("user_id", userData.user_id)
    .eq("module_id", lesson.module_id)
    .single();

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
  }

  // Update last_accessed_at in enrollment
  await (supabase
    .from("user_enrollments" as any) as any)
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", enrollment.id);

  // Upsert progress
  const { data: progress, error } = await (supabase
    .from("user_lesson_progress" as any) as any)
    .upsert({
      user_id: userData.user_id,
      lesson_id: parseInt(id),
      is_completed: true,
      completed_at: new Date().toISOString()
    } as any, {
      onConflict: "user_id,lesson_id"
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(progress);
}
