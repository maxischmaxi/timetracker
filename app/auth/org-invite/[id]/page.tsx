import { getOrgById } from "@/lib/server-api";
import { verifyIdToken } from "@/lib/server-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { token, email } = await searchParams;
  const { id } = await params;

  const org = await getOrgById(id);
  if (!org) {
    redirect("/auth/org-join-failed");
  }

  const auth = await verifyIdToken();

  if (!auth) {
    let url = "";
    if (email) {
      url = `/auth/register?joinToken=${token}&orgId=${org.id}&email=${email}`;
    } else {
      url = `/auth/register?joinToken=${token}&orgId=${org.id}`;
    }
    redirect(url);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <Link href={`/auth/join-org?orgId=${id}&token=${token}`}>
        {org?.name} beitreten!
      </Link>
    </div>
  );
}
