"use client";

import { Plain } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { User } from "@/user/v1/user_pb";
import { ChangeEvent, ReactNode, useCallback, useState } from "react";
import { Input } from "./ui/input";

type Props = {
  user: Plain<User>;
  children?: ReactNode;
};

export function UserDeleteDialog({ user, children }: Props) {
  const [userName, setUserName] = useState<string>("");

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nutzer {user.name} löschen?</DialogTitle>
        </DialogHeader>
        Diese Aktion kann nicht rückgängig gemacht werden.
        <Input value={userName} onChange={handleInputChange} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
