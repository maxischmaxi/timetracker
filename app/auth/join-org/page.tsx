import { acceptEmailInvite } from "@/lib/server-api";
import { getAuthenticatedAppForUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const { orgId = "", token = "" } = await searchParams;
  const { currentUser } = await getAuthenticatedAppForUser();

  if (
    !currentUser ||
    !orgId ||
    typeof orgId !== "string" ||
    !token ||
    typeof token !== "string"
  ) {
    redirect("/auth/org-join-failed");
  }

  await acceptEmailInvite(token, orgId, currentUser.uid);

  redirect("/");
}
