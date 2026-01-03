import { createClient } from "@/lib/supabase/server";

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("auth_id", user.id)
    .single();
  
  return profile?.role === "admin";
}

export async function requireAdmin(): Promise<{ isAdmin: boolean; error?: string }> {
  const admin = await isAdmin();
  
  if (!admin) {
    return { isAdmin: false, error: "Unauthorized: Admin access required" };
  }
  
  return { isAdmin: true };
}
