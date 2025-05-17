import { PickOrg } from "@/components/pick-org";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthenticatedAppForUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect("/auth/login");
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <p className="text-sm text-secondary-foreground">
          Hey {currentUser.displayName}, noch ein Schritt und es kann losgehen!
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Auswahl der Organisation</CardTitle>
            <CardDescription>
              Wählen Sie die Organisation aus, mit der Sie fortfahren möchten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PickOrg />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
