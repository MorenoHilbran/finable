import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET - List all modules (public: only published, admin: all)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  // Select with joined master data
  let query = (supabase
    .from("learning_modules" as any) as any)
    .select(`
      *,
      categories(*),
      difficulty_levels(*),
      content_types(*),
      duration_units(*)
    `)
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

  // Build duration string from value and unit
  let durationString = body.duration;
  if (body.duration_value && body.duration_unit_id) {
    // Fetch duration unit name for the duration string
    const { data: unitData } = await (supabase
      .from("duration_units" as any) as any)
      .select("name")
      .eq("id", body.duration_unit_id)
      .single();

    if (unitData) {
      durationString = `${body.duration_value} ${unitData.name}`;
    }
  }

  // Get category name if category_id is provided
  let categoryName = body.category;
  if (body.category_id) {
    const { data: catData } = await (supabase
      .from("categories" as any) as any)
      .select("name")
      .eq("id", body.category_id)
      .single();

    if (catData) {
      categoryName = catData.name;
    }
  }

  const { data, error } = await (supabase
    .from("learning_modules" as any) as any)
    .insert({
      title: body.title,
      description: body.description,
      // Legacy fields (for backward compatibility)
      difficulty_level: body.difficulty_level,
      content_type: body.content_type,
      category: categoryName,
      duration: durationString,
      // New foreign key fields
      category_id: body.category_id,
      difficulty_level_id: body.difficulty_level_id,
      content_type_id: body.content_type_id,
      duration_value: body.duration_value,
      duration_unit_id: body.duration_unit_id,
      // Other fields
      thumbnail_url: body.thumbnail_url,
      content: body.content,
      is_published: body.is_published || false,
      order_index: body.order_index || 0,
    } as any)
    .select(`
      *,
      categories(*),
      difficulty_levels(*),
      content_types(*),
      duration_units(*)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
