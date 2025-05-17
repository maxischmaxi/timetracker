import { LoginForm } from "@/components/login-form";
import { verifyIdToken } from "@/lib/server-auth";
import { notFound, redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const { orgId = "", token = "" } = await searchParams;

  const user = await verifyIdToken();
  if (user) {
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
