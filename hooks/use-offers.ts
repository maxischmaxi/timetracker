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
import { useCurrentOrg } from "./use-org";

type Props = {
  onSuccess?: (data: Plain<Offer>) => void;
  onError?: () => void;
};

export function useOffersByOrgId() {
  const org = useCurrentOrg();

  return useQuery({
    enabled: !!org?.id,
    queryKey: ["offers-by-org", org?.id],
    initialData: [],
    async queryFn() {
      return await getOffersByOrgId(org!.id);
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
