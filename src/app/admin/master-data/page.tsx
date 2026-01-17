import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import MasterDataClient from "./MasterDataClient";

export default async function MasterDataPage() {
  const { isAdmin, error } = await requireAdmin();
  
  if (!isAdmin) {
    redirect("/login");
  }
  
  return <MasterDataClient />;
}
