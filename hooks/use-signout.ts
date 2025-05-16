"use client";

import { signOut } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useSignout() {
  const router = useRouter();

  return useMutation({
    async mutationFn() {
      await signOut();
    },
    onSuccess() {
      router.push("/auth/login");
    },
  });
}
