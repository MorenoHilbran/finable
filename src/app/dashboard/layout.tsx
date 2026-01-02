import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-sm"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-bold"
            style={{ color: "var(--brand-dark-blue)" }}
          >
            <span className="text-2xl">💡</span>
            <span>FINABLE</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div
                className="text-sm font-medium"
                style={{ color: "var(--brand-dark-blue)" }}
              >
                {userName}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <Link
              href="/dashboard/profile"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity"
              style={{ background: "var(--gradient-cta)" }}
            >
              {userName.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation (Sidebar + Mobile Nav) */}
      <DashboardNav />

      {/* Main Content */}
      <main className="pt-16 md:pl-64 pb-20 md:pb-8">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
