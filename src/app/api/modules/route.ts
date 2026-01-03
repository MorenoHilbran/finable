import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET - List all modules (public: only published, admin: all)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";
  
  let query = supabase
    .from("learning_modules")
    .select("*")
    .order("order_index", { ascending: true });
  
  // If not requesting all, only show published
  if (!all) {
    query = query.eq("is_published", true);
  } else {
    // Check if user is admin for viewing all
    const { isAdmin } = await requireAdmin();
    if (!isAdmin) {
      query = query.eq("is_published", true);
    }
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

// POST - Create new module (admin only)
export async function POST(request: NextRequest) {
  const { isAdmin, error: authError } = await requireAdmin();
  
  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }
  
  const supabase = await createClient();
  const body = await request.json();
  
  const { data, error } = await supabase
    .from("learning_modules")
    .insert({
      title: body.title,
      description: body.description,
      difficulty_level: body.difficulty_level,
      content_type: body.content_type,
      thumbnail_url: body.thumbnail_url,
      category: body.category,
      duration: body.duration,
      content: body.content,
      is_published: body.is_published || false,
      order_index: body.order_index || 0,
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data, { status: 201 });
}
