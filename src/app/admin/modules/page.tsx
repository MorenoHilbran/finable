import { createClient } from "@/lib/supabase/server";
import ModulesClient from "./ModulesClient";

export default async function AdminModulesPage() {
  const supabase = await createClient();
  
  const { data: modules, error } = await supabase
    .from("learning_modules")
    .select("*")
    .order("order_index", { ascending: true });
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading modules: {error.message}</p>
      </div>
    );
  }
  
  return <ModulesClient modules={modules || []} />;
}
