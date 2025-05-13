import { LoginForm } from "@/components/login-form";
import { verifyIdToken } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await verifyIdToken();
  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
