import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createOfferSchema, updateOfferSchema } from "@/lib/schemas";
import {
  createEmptyOffer,
  createOffer,
  getOffersByOrgId,
  updateOffer,
} from "@/lib/api";
import { Plain } from "@/types";
import { Offer } from "@/offers/v1/offers_pb";

type Props = {
  onSuccess?: (data: Plain<Offer>) => void;
  onError?: () => void;
};

export function useOffersByOrgId(orgId: string | undefined) {
  return useQuery({
    enabled: !!orgId,
    queryKey: ["offers", orgId],
    initialData: [],
    async queryFn({ queryKey }) {
      if (!queryKey[1]) {
        throw new Error("no query key set");
      }
      return await getOffersByOrgId(queryKey[1]);
    },
  });
}

export function useCreateEmptyOffer(props?: Props) {
  return useMutation({
    async mutationFn(orgId: string) {
      return await createEmptyOffer(orgId);
    },
    onSuccess(data) {
      props?.onSuccess?.(data);
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useUpdateOffer(props?: Props) {
  return useMutation({
    async mutationFn(
      data: z.infer<typeof updateOfferSchema> & {
        orgId: string;
      },
    ) {
      return await updateOffer(data);
    },
    onSuccess(data) {
      props?.onSuccess?.(data);
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useCreateOffer(props?: Props) {
  return useMutation({
    async mutationFn(
      data: z.infer<typeof createOfferSchema> & {
        orgId: string;
      },
    ) {
      const { orgId, ...rest } = data;
      return await createOffer(rest, orgId);
    },
    onSuccess(data) {
      props?.onSuccess?.(data);
    },
    onError() {
      props?.onError?.();
    },
  });
}
