import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createOfferSchema, updateOfferSchema } from "@/lib/schemas";
import {
  createEmptyOffer,
  createOffer,
  deleteOffer,
  getOfferById,
  getOffersByOrgId,
  updateOffer,
} from "@/lib/api";
import { Plain } from "@/types";
import { Offer } from "@/offers/v1/offers_pb";
import { useCurrentOrg } from "./use-org";
import { queryClient } from "@/components/providers";
import { use } from "react";
import { AuthContext } from "@/components/auth-provider";

type Props = {
  onSuccess?: (data: Plain<Offer>) => void;
  onError?: () => void;
};

export function useOffersByOrgId() {
  const org = useCurrentOrg();
  return useQuery({
    enabled: Boolean(org?.id),
    queryKey: ["offers-by-org", org?.id],
    async queryFn() {
      return await getOffersByOrgId(org!.id);
    },
  });
}

export function useCreateEmptyOffer(props?: Props) {
  const org = useCurrentOrg();

  return useMutation({
    async mutationFn(orgId: string) {
      return await createEmptyOffer(orgId);
    },
    onSuccess(data) {
      if (org) {
        queryClient.refetchQueries({
          queryKey: ["offers-by-org", org.id],
        });
      }
      props?.onSuccess?.(data);
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useUpdateOffer(props?: Props) {
  const org = useCurrentOrg();

  return useMutation({
    async mutationFn(
      data: z.infer<typeof updateOfferSchema> & {
        orgId: string;
      },
    ) {
      return await updateOffer(data);
    },
    onSuccess(data) {
      if (org) {
        queryClient.refetchQueries({
          queryKey: ["offers-by-org", org.id],
        });
      }
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

export function useOfferById(id: string) {
  const { user } = use(AuthContext);
  return useQuery({
    queryKey: ["offer-by-id", id],
    enabled: !!id && Boolean(user),
    async queryFn({ queryKey }) {
      return await getOfferById(queryKey[1]);
    },
  });
}

type DeleteProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useDeleteOffer(props?: DeleteProps) {
  const org = useCurrentOrg();
  return useMutation({
    async mutationFn(id: string) {
      await deleteOffer(id);
      await queryClient.refetchQueries({
        queryKey: ["offers-by-org", org?.id],
      });
    },
    onSuccess() {
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}
