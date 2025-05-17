import { AuthContext } from "@/components/auth-provider";
import { inviteEmailToOrg } from "@/lib/api";
import { Plain } from "@/types";
import Cookie from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { use, useMemo } from "react";
import { Org } from "@/org/v1/org_pb";

type InviteEmailToOrgProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useInviteEmailToOrg(props?: InviteEmailToOrgProps) {
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

  return useMemo(
    () => user?.orgs?.find((o) => o.id === Cookie.get("__org")) || null,
    [user?.orgs],
  );
}
