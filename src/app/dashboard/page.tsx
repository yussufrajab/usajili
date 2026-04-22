import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Fomu - Dashboard ya Msimamizi",
};

export default async function DashboardPage() {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    redirect("/login");
  }

  return <DashboardClient />;
}