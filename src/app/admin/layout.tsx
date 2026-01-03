import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Get user info
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }
  
  // Check if admin
  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name, email")
    .eq("auth_id", user.id)
    .single();
  
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }
  
  const userName = profile?.full_name || user.email?.split("@")[0] || "Admin";
  const userEmail = profile?.email || user.email || "";
  
  return (
    <AdminLayoutClient userName={userName} userEmail={userEmail}>
      {children}
    </AdminLayoutClient>
  );
}
