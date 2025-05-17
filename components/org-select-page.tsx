"use client";

import Cookie from "js-cookie";
import { AuthContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";
import { toast } from "sonner";

export function OrgSelectPage() {
  const { user } = use(AuthContext);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const router = useRouter();

  const onContinue = useCallback(() => {
    if (!selectedOrg) {
      toast.error("Bitte wähle eine Organisation aus um fortzufahren");
      return;
    }

    Cookie.set("__org", selectedOrg, {
      path: "/",
      sameSite: "none",
      secure: true,
    });
    router.push("/");
  }, [router, selectedOrg]);

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <p className="text-sm text-secondary-foreground">
          Hey {user?.user?.name}, noch ein Schritt und es kann losgehen!
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Auswahl der Organisation</CardTitle>
            <CardDescription>
              Wählen Sie die Organisation aus, mit der Sie fortfahren möchten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedOrg} onValueChange={setSelectedOrg}>
              {user?.orgs.map((org, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={org.id} id={org.id} />
                  <Label htmlFor={org.id}>{org.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={onContinue}>
              Fortfahren
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
