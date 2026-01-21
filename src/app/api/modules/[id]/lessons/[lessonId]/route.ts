import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Get single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const { lessonId } = await params;
  const supabase = await createClient();

  const { data, error } = await (supabase
    .from("module_lessons" as any) as any)
    .select("*")
    .eq("id", lessonId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT - Update lesson (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const { isAdmin, error: authError } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  const body = await request.json();

  const updateData: any = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.order_index !== undefined) updateData.order_index = body.order_index;
  if (body.is_published !== undefined) updateData.is_published = body.is_published;
  if (body.parent_id !== undefined) updateData.parent_id = body.parent_id;

  const { data, error } = await (supabase
    .from("module_lessons" as any) as any)
    .update(updateData as any)
    .eq("id", lessonId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE - Delete lesson (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const { isAdmin, error: authError } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();

  // Delete lesson (children will be deleted via CASCADE)
  const { error } = await (supabase
    .from("module_lessons" as any) as any)
    .delete()
    .eq("id", lessonId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
