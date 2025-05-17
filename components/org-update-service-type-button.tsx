"use client";

import { ServiceType } from "@/org/v1/org_pb";
import { Plain } from "@/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUpdateServiceTypeStatus } from "@/hooks/use-org";
import { Loader } from "lucide-react";

type Props = {
  serviceType: Plain<ServiceType>;
};

export function OrgUpdateServiceTypeButton({ serviceType }: Props) {
  const updateServiceTypeStatus = useUpdateServiceTypeStatus({
    onError() {
      toast.error("Fehler beim Aktualisieren der Leistungsart");
    },
  });

  return (
    <div className="flex items-center">
      <Button
        type="button"
        disabled={updateServiceTypeStatus.isPending}
        variant="outline"
        className={cn(
          "h-6 text-xs",
          serviceType.status
            ? "bg-green-200 border-green-500 hover:bg-green-300"
            : "bg-red-200 border-red-500 hover:bg-red-300",
        )}
        onClick={() =>
          updateServiceTypeStatus.mutate({
            value: !!!serviceType.status,
            id: serviceType.id,
          })
        }
        size="sm"
      >
        {updateServiceTypeStatus.isPending && (
          <Loader className="animate-spin" />
        )}
        {!updateServiceTypeStatus.isPending && (
          <>{serviceType.status ? "Active" : "Inactive"}</>
        )}
      </Button>
    </div>
  );
}
