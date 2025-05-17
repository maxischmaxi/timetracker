import { OrgSelectPage } from "@/components/org-select-page";
import { getAuthenticatedAppForUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  return <OrgSelectPage />;
}
