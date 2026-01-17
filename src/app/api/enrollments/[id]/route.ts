import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Get single enrollment with full progress details
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
  const { data: userData } = await supabase
    .from("users")
    .select("user_id")
    .eq("auth_id", user.id)
    .single();
  
  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  // Get enrollment
  const { data: enrollment, error } = await supabase
    .from("user_enrollments")
    .select(`
      *,
      learning_modules (*)
    `)
    .eq("id", id)
    .eq("user_id", userData.user_id)
    .single();
  
  if (error || !enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }
  
  // Get lessons with progress
  const { data: lessons } = await supabase
    .from("module_lessons")
    .select("*")
    .eq("module_id", enrollment.module_id)
    .eq("is_published", true)
    .order("order_index", { ascending: true });
  
  // Get progress for lessons
  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", userData.user_id);
  
  const lessonIds = (lessons || []).map((l: any) => l.id);
  const lessonProgress = (progress || []).filter((p: any) => 
    lessonIds.includes(p.lesson_id)
  );
  
  return NextResponse.json({
    ...enrollment,
    lessons: lessons || [],
    lesson_progress: lessonProgress
  });
}

// DELETE - Unenroll from class
export async function DELETE(
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
  const { data: userData } = await supabase
    .from("users")
    .select("user_id")
    .eq("auth_id", user.id)
    .single();
  
  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  // Delete enrollment (only if belongs to user)
  const { error } = await supabase
    .from("user_enrollments")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user_id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
