import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import LessonsClient from "./LessonsClient";

export default async function ModuleLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAdmin } = await requireAdmin();
  
  if (!isAdmin) {
    redirect("/login");
  }
  
  const { id } = await params;
  const supabase = await createClient();
  
  // Get module info
  const { data: module } = await supabase
    .from("learning_modules")
    .select("title")
    .eq("module_id", id)
    .single();
  
  if (!module) {
    redirect("/admin/modules");
  }
  
  return <LessonsClient moduleId={id} moduleTitle={(module as any).title} />;
}
