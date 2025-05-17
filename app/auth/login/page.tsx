import { LoginForm } from "@/components/login-form";
import { getAuthenticatedAppForUser } from "@/lib/server-auth";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const { orgId = "", token = "" } = await searchParams;
  const { currentUser } = await getAuthenticatedAppForUser();

  if (currentUser) {
    const org_id = (await cookies()).get("__org")?.value;

    if (!org_id) {
      redirect("/auth/org");
    }

    redirect("/");
  }

  if (Array.isArray(orgId) || Array.isArray(token)) {
    notFound();
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm orgId={orgId} token={token} />
      </div>
    </main>
  );
}
