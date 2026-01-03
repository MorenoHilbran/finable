import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Get single module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("module_id", id)
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  
  return NextResponse.json(data);
}

// PUT - Update module (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdmin, error: authError } = await requireAdmin();
  
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }
  
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();
  
  const { data, error } = await supabase
    .from("learning_modules")
    .update({
      title: body.title,
      description: body.description,
      difficulty_level: body.difficulty_level,
      content_type: body.content_type,
      thumbnail_url: body.thumbnail_url,
      category: body.category,
      duration: body.duration,
      content: body.content,
      is_published: body.is_published,
      order_index: body.order_index,
      updated_at: new Date().toISOString(),
    })
    .eq("module_id", id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

// DELETE - Delete module (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdmin, error: authError } = await requireAdmin();
  
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }
  
  const { id } = await params;
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("learning_modules")
    .delete()
    .eq("module_id", id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
