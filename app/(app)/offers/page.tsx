"use client";

import { Button } from "@/components/ui/button";
import { useCreateEmptyOffer } from "@/hooks/use-offers";
import { useCurrentOrg } from "@/hooks/use-org";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const org = useCurrentOrg();
  const router = useRouter();

  const createEmpty = useCreateEmptyOffer({
    onSuccess(data) {
      router.push(`/offers/${data.id}`);
    },
  });

  async function create() {
    if (!org?.id) {
      toast.error("Keine Org ausgewählt");
      return;
    }
    await createEmpty.mutateAsync(org.id);
  }

  return (
    <div>
      <h1>Offers</h1>
      <Button type="button" onClick={create} disabled={createEmpty.isPending}>
        {createEmpty.isPending ? (
          <Loader className="animate-spin" />
        ) : (
          "Neues Angebot erstellen"
        )}
      </Button>
    </div>
  );
}
