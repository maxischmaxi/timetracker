"use client";

import { useDeleteJob } from "@/hooks/use-projects";
import { DateJob } from "@/project/v1/project_pb";
import { Plain } from "@/types";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useIsAdministrator } from "@/hooks/use-users";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {
  job: Plain<DateJob>;
  children: ReactNode;
  date: string;
};

export function JobDeleteDialog({
  date,
  job: { job, project },
  children,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const remove = useDeleteJob({
    onSuccess() {
      setOpen(false);
    },
  });
  const isAdmin = useIsAdministrator();

  async function handleDelete() {
    if (!job || !project) {
      toast.error("Internal error occured");
      return;
    }

    await remove.mutateAsync({
      id: job.id,
      projectId: project.id,
      date,
    });
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Löschen</DialogTitle>
          <DialogDescription>
            Bist du sicher, dass du dein Eintrag löschen willst?
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Abbrechen
              </Button>
            </DialogClose>
            <Button
              disabled={remove.isPending}
              type="button"
              onClick={handleDelete}
              variant="destructive"
            >
              {remove.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Löschen"
              )}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
