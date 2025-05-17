import { inviteEmailToOrg } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

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
