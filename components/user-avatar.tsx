"use client";

import { use, useMemo } from "react";
import { AuthContext } from "./auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  fallbackClassName?: string;
};

export function UserAvatar({ className, fallbackClassName }: Props) {
  const { firebaseUser } = use(AuthContext);

  const name = useMemo(() => {
    if (!firebaseUser || !firebaseUser.displayName) return "";
    const parts = firebaseUser.displayName.split(" ");

    if (parts.length === 0) {
      return "";
    }

    if (parts.length === 1) {
      const characters = parts[0].split("");

      if (characters.length === 0) {
        return "";
      }

      if (characters.length === 1) {
        return characters[0].toUpperCase();
      }

      return `${characters[0].toUpperCase()}${characters[1].toUpperCase()}`;
    }

    const first = parts[0].charAt(0).toUpperCase();
    const second = parts[1].charAt(0).toUpperCase();
    return `${first}${second}`;
  }, []);

  return (
    <Avatar className={cn("h-8 w-8 rounded-lg grayscale", className)}>
      <AvatarImage
        src={firebaseUser?.photoURL || ""}
        alt={firebaseUser?.displayName || ""}
      />
      <AvatarFallback className={cn("rounded-lg", fallbackClassName)}>
        {name}
      </AvatarFallback>
    </Avatar>
  );
}
