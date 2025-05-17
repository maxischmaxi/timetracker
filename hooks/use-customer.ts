"use client";

import { AuthContext } from "@/components/auth-provider";
import { queryClient } from "@/components/providers";
import {
  CreateCustomer,
  Customer,
  UpdateCustomer,
} from "@/customer/v1/customer_pb";
import { createCustomer, getCustomers, updateCustomer } from "@/lib/api";
import { Plain } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { use } from "react";

export function useCustomers() {
  const { user } = use(AuthContext);

  return useQuery({
    enabled: !!user,
    queryKey: ["customers"],
    async queryFn() {
      return await getCustomers();
    },
  });
}

type CreateCustomerProps = {
  onSuccess?: (customer?: Plain<Customer>) => void;
  onError?: () => void;
};

export function useCreateCustomer(props?: CreateCustomerProps) {
  return useMutation({
    async mutationFn(data: Plain<CreateCustomer>) {
      return await createCustomer(data);
    },
    onSuccess(data) {
      queryClient.refetchQueries({
        queryKey: ["customers"],
      });
      if (data) {
        props?.onSuccess?.(data);
      }
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useUpdateCustomer(props?: CreateCustomerProps) {
  return useMutation({
    async mutationFn(data: Plain<UpdateCustomer>) {
      await updateCustomer(data);
    },
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: ["customers"],
      });
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}
