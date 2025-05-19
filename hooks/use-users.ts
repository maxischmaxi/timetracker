"use client";

import { AuthContext } from "@/components/auth-provider";
import { queryClient } from "@/components/providers";
import { createUser, getAllUsers, register, updateUser } from "@/lib/api";
import { createUserSchema } from "@/lib/schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
import { use } from "react";
import { z } from "zod";
import { useCurrentOrg } from "./use-org";

type RegisterProps = {
  email: string;
  password: string;
  name: string;
  orgId: string | undefined;
};

type UseRegister = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useRegister(props?: UseRegister) {
  return useMutation({
    async mutationFn({ email, password, name, orgId }: RegisterProps) {
      await register(email, password, name, orgId);
    },
    onSuccess() {
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useUsers() {
  const { user } = use(AuthContext);

  return useQuery({
    enabled: !!user,
    queryKey: ["users"],
    async queryFn() {
      return await getAllUsers().then((res) => {
        if (!res) return [];
        return res;
      });
    },
  });
}

export function useCreateUser() {
  const org = useCurrentOrg();

  return useMutation({
    async mutationFn(data: z.infer<typeof createUserSchema>) {
      if (!org) {
        throw new Error("no org selected");
      }

      return await createUser(
        {
          name: data.name,
          tags: data.tags ?? [],
          email: data.email,
          employmentState: data.employmentState,
          projectIds: data.projectIds ?? [],
          vacations: data.vacations ?? [],
          address: {
            city: data.address.city,
            country: data.address.country,
            state: data.address.state,
            street: data.address.street,
            zip: data.address.zip,
          },
        },
        org.id,
      );
    },
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    async mutationFn(data: z.infer<typeof createUserSchema> & { id: string }) {
      return await updateUser(data.id, {
        address: {
          city: data.address.city,
          country: data.address.country,
          state: data.address.state,
          street: data.address.street,
          zip: data.address.zip,
        },
        projectIds: data.projectIds || [],
        tags: data.tags || [],
        name: data.name,
      });
    },
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useIsAdministrator(): boolean {
  const { user } = use(AuthContext);
  const org = useCurrentOrg();

  return Boolean(user?.user && org?.admins.includes(user.user.id));
}
