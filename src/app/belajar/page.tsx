import { createClient } from "@/lib/supabase/server";
import BelajarClient from "./BelajarClient";

export default async function BelajarPage() {
  const supabase = await createClient();
  
  // Fetch published modules
  const { data: modules, error } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });
  
  if (error) {
    console.error("Error fetching modules:", error);
  }
  
  return <BelajarClient modules={modules || []} />;
}
