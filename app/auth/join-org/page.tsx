import { acceptEmailInvite } from "@/lib/server-api";
import { verifyIdToken } from "@/lib/server-auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const { orgId = "", token = "" } = await searchParams;
  const auth = await verifyIdToken();
  if (
    !auth ||
    !orgId ||
    typeof orgId !== "string" ||
    !token ||
    typeof token !== "string"
  ) {
    redirect("/auth/org-join-failed");
  }

  await acceptEmailInvite(token, orgId, auth.currentUser.uid);

  redirect("/");
}
