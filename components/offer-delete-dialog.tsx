"use client";

import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useDeleteOffer, useOffersByOrgId } from "@/hooks/use-offers";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
};

export function OfferDeleteDialog({ id, open, setOpen }: Props) {
  const deleteOffer = useDeleteOffer({
    onSuccess() {
      setInput("");
      setOpen(false);
    },
    onError() {
      toast.error("Fehler beim Löschen!");
    },
  });
  const offers = useOffersByOrgId();
  const [input, setInput] = useState<string>("");

  const offer = useMemo(
    () => offers.data?.find((o) => o.id === id),
    [id, offers.data],
  );

  async function handleDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!id) {
      toast.error("Interner fehler");
      return;
    }

    if (!offer) {
      toast.error("Kein passendes Angebote gefunden");
      return;
    }

    if (offer.offerNo !== input) {
      toast.error("Bitte geben sie die Angebotsnummer richtig ein.");
      return;
    }

    await deleteOffer.mutateAsync(id);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Löschen</DialogTitle>
          <DialogDescription>
            Sind Sie sicher, dass Sie Angebot {offer?.offerNo} löschen möchten?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDelete} className="mt-4 space-y-4">
          <p className="text-xs">
            Geben sie{" "}
            <i>
              <b>{offer?.offerNo}</b>
            </i>{" "}
            ein
          </p>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.currentTarget.value);
            }}
            label="Angebotsnummer"
            placeholder="2025-001"
          />
          <DialogFooter>
            <DialogClose disabled={deleteOffer.isPending}>
              Abbrechen
            </DialogClose>
            <Button
              disabled={deleteOffer.isPending}
              type="submit"
              variant="destructive"
            >
              {deleteOffer.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Löschen"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
