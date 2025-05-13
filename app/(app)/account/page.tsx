import { verifyIdToken } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await verifyIdToken();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <h1>{user.currentUser.email}</h1>
    </div>
  );
}
