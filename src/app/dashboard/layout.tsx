import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardLayoutClient from "@/components/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile from public.users
  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("auth_id", user.id)
    .single();

  const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <DashboardLayoutClient
      userName={userName}
      userEmail={user.email || ""}
    >
      {children}
    </DashboardLayoutClient>
  );
}
