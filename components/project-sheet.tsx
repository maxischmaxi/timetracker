"use client";

import { ReactNode, useCallback, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ProjectForm } from "./project-form";

type Props = {
  children: ReactNode;
};

export function ProjectSheet({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Projekt erstellen</SheetTitle>
          <SheetDescription>
            Erstelle ein neues Projekt und weise es einem Kunden zu
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <ProjectForm onSuccess={onSuccess} onCancel={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
