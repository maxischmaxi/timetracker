"use client";

import { ReactNode, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { CustomerForm } from "./customer-form";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  children: ReactNode;
};

export function CustomerSheet(props: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Kunden hinzufügen</DialogTitle>
            <DialogDescription>Erstelle einen neuen Kunden</DialogDescription>
          </DialogHeader>
          <div className="h-full max-h-full overflow-y-auto">
            <CustomerForm className="px-2" onClose={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent>
        <SheetHeader className="gap-1">
          <SheetTitle>Kunden hinzufügen</SheetTitle>
          <SheetDescription>Erstelle einen neuen Kunden</SheetDescription>
        </SheetHeader>
        <div className="h-full max-h-full overflow-y-auto pb-12">
          <CustomerForm className="px-4" onClose={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
