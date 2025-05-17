import { OrgSelectPage } from "@/components/org-select-page";
import { verifyIdToken } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const auth = await verifyIdToken();

  if (!auth) {
    redirect("/auth/login");
  }

  return <OrgSelectPage />;
}
