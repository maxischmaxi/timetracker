"use client";

import { AuthContext, refetchUser } from "@/components/auth-provider";
import {
  createServiceType,
  deleteServiceType,
  inviteEmailToOrg,
  setOrgPayment,
  updateServiceTypeStatus,
} from "@/lib/api";
import { Plain } from "@/types";
import Cookie from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { use, useMemo } from "react";
import { Org } from "@/org/v1/org_pb";

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useInviteEmailToOrg(props?: Props) {
  return useMutation({
    async mutationFn(email: string) {
      return await inviteEmailToOrg(email);
    },
    onSuccess() {
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useCurrentOrg(): Plain<Org> | null {
  const { user } = use(AuthContext);

  return useMemo(() => {
    if (!user || !user.orgs) return null;
    const orgId = Cookie.get("__org");
    if (!orgId) return null;
    return user.orgs.find((o) => o.id === orgId) || null;
  }, [user]);
}

export function useCreateServiceType(props?: Props) {
  const { firebaseUser } = use(AuthContext);
  return useMutation({
    async mutationFn(name: string) {
      await createServiceType(name);
      await refetchUser(firebaseUser?.uid);
    },
    onSuccess() {
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useUpdateServiceTypeStatus(props?: Props) {
  const { firebaseUser } = use(AuthContext);

  return useMutation({
    async mutationFn({ value, id }: { value: boolean; id: string }) {
      const res = await updateServiceTypeStatus(value, id);
      await refetchUser(firebaseUser?.uid);
      return res;
    },
    onSuccess() {
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useDeletServiceType(props?: Props) {
  const { firebaseUser } = use(AuthContext);

  return useMutation({
    async mutationFn(id: string) {
      await deleteServiceType(id);
      await refetchUser(firebaseUser?.uid);
    },
    onSuccess() {
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}

export function useSetOrgPayment(props?: Props) {
  return useMutation({
    async mutationFn(props: {
      orgId: string;
      bankName: string;
      iban: string;
      bic: string;
      legalNotice: string;
    }) {
      await setOrgPayment(props);
    },
    onSuccess() {
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}
