import { RegisterForm } from "@/components/register-form";
import { getOrgById } from "@/lib/server-api";
import { notFound, redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const { joinToken = "", orgId = "", email = "" } = await searchParams;

  if (
    joinToken &&
    typeof joinToken === "string" &&
    orgId &&
    typeof orgId === "string"
  ) {
    const org = await getOrgById(orgId);
    if (!org) {
      redirect("/auth/register");
    }
  }

  if (Array.isArray(joinToken) || Array.isArray(orgId)) {
    notFound();
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm
          orgId={orgId}
          joinToken={joinToken}
          defaultEmail={String(email)}
        />
      </div>
    </main>
  );
}
