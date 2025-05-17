import { getAuthenticatedAppForUser } from "@/lib/server-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  const orgId = (await cookies()).get("__org")?.value;

  if (!orgId) {
    redirect("/auth/org");
  }

  redirect("/");
}
