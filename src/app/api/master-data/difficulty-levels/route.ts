import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";

// GET - List all difficulty levels
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await (supabase
    .from("difficulty_levels" as any) as any)
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create difficulty level (admin only)
export async function POST(request: NextRequest) {
  const { isAdmin, error: authError } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: authError }, { status: 401 });
  }

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await (supabase
    .from("difficulty_levels" as any) as any)
    .insert({
      code: body.code,
      name: body.name,
      color_class: body.color_class,
      order_index: body.order_index || 0,
      is_active: body.is_active ?? true,
    } as any)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
