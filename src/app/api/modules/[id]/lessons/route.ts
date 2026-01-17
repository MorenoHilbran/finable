import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET - List all lessons for a module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("module_lessons")
    .select("*")
    .eq("module_id", id)
    .order("order_index", { ascending: true });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Build tree structure
  const buildTree = (items: any[], parentId: number | null = null): any[] => {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id),
      }));
  };
  
  const tree = buildTree(data || []);
  
  return NextResponse.json({ lessons: data, tree });
}

// POST - Create new lesson (admin only)
export async function POST(
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
  
  // Get max order_index for this module/parent
  const { data: existingLessons } = await supabase
    .from("module_lessons")
    .select("order_index")
    .eq("module_id", id)
    .eq("parent_id", body.parent_id ?? null)
    .order("order_index", { ascending: false })
    .limit(1);
  
  const nextOrder = existingLessons && existingLessons.length > 0 
    ? (existingLessons[0] as any).order_index + 1 
    : 0;
  
  const { data, error } = await supabase
    .from("module_lessons")
    .insert({
      module_id: parseInt(id),
      parent_id: body.parent_id || null,
      title: body.title,
      content: body.content || "",
      order_index: body.order_index ?? nextOrder,
      is_published: body.is_published ?? true,
    } as any)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data, { status: 201 });
}
