import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./admin-dashboard-client";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as any).role !== "ADMIN") {
    redirect("/dashboard/member");
  }

  return <AdminDashboardClient />;
}