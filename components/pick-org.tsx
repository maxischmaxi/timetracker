"use client";

import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { AuthContext } from "./auth-provider";

export function PickOrg() {
  const { user } = use(AuthContext);
  const router = useRouter();
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const selectOrg = useCallback(
    (id: string) => {
      setRedirecting(true);
      Cookie.set("__org", id, {
        path: "/",
        secure: true,
        sameSite: "none",
      });
      router.push("/");
    },
    [router],
  );

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {user?.orgs.map((org) => (
        <Button
          variant="outline"
          type="button"
          onClick={() => selectOrg(org.id)}
          key={org.id}
        >
          {redirecting ? <Loader className="animate-spin" /> : org.name}
        </Button>
      ))}
    </div>
  );
}
