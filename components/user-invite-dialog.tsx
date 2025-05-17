"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useInviteEmailToOrg } from "@/hooks/use-org";
import { z } from "zod";
import { Input } from "./ui/input";
import { Loader } from "lucide-react";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { inviteEmailToOrgSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

type Props = {
  children: ReactNode;
};

export function UserInviteDialog({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const invite = useInviteEmailToOrg({
    onSuccess() {
      form.reset();
      setOpen(false);
      toast.info("Email wurde erfolgreich gesendet");
    },
    onError() {
      toast.error("Fehler beim senden der Email");
    },
  });
  const form = useForm<z.infer<typeof inviteEmailToOrgSchema>>({
    resolver: zodResolver(inviteEmailToOrgSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof inviteEmailToOrgSchema>) {
    await invite.mutateAsync(data.email);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nutzer einladen</DialogTitle>
          <DialogDescription>
            Sende eine Einladung an einen Nutzer, damit er deiner Organisation
            beitreten kann.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input
              control={form.control}
              name="email"
              label="Email eingeben"
              placeholder="max@mustermann.de"
              type="email"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Schließen
                </Button>
              </DialogClose>
              <Button type="submit" disabled={invite.isPending}>
                {invite.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Senden"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
