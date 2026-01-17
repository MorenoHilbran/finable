import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Get single module with joined master data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("learning_modules")
    .select(`
      *,
      categories(*),
      difficulty_levels(*),
      content_types(*),
      duration_units(*)
    `)
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
  
  // Build duration string from value and unit
  let durationString = body.duration;
  if (body.duration_value && body.duration_unit_id) {
    const { data: unitData } = await supabase
      .from("duration_units")
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
    const { data: catData } = await supabase
      .from("categories")
      .select("name")
      .eq("id", body.category_id)
      .single();
    
    if (catData) {
      categoryName = catData.name;
    }
  }
  
  const { data, error } = await supabase
    .from("learning_modules")
    .update({
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
      is_published: body.is_published,
      order_index: body.order_index,
      updated_at: new Date().toISOString(),
    })
    .eq("module_id", id)
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
