import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  
  return NextResponse.json(data);
}

// PUT - Update category (admin only)
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
    .from("categories")
    .update({
      name: body.name,
      description: body.description,
      icon: body.icon,
      order_index: body.order_index,
      is_active: body.is_active,
    })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

// DELETE - Delete category (admin only)
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
    .from("categories")
    .delete()
    .eq("id", id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
