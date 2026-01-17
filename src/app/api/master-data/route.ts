import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch all master data in parallel
    const [categoriesRes, difficultyLevelsRes, durationUnitsRes, contentTypesRes] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("order_index"),
      supabase
        .from("difficulty_levels")
        .select("*")
        .eq("is_active", true)
        .order("order_index"),
      supabase
        .from("duration_units")
        .select("*")
        .eq("is_active", true)
        .order("order_index"),
      supabase
        .from("content_types")
        .select("*")
        .eq("is_active", true)
        .order("order_index"),
    ]);

    if (categoriesRes.error) throw categoriesRes.error;
    if (difficultyLevelsRes.error) throw difficultyLevelsRes.error;
    if (durationUnitsRes.error) throw durationUnitsRes.error;
    if (contentTypesRes.error) throw contentTypesRes.error;

    return NextResponse.json({
      categories: categoriesRes.data,
      difficultyLevels: difficultyLevelsRes.data,
      durationUnits: durationUnitsRes.data,
      contentTypes: contentTypesRes.data,
    });
  } catch (error) {
    console.error("Error fetching master data:", error);
    return NextResponse.json(
      { error: "Failed to fetch master data" },
      { status: 500 }
    );
  }
}
