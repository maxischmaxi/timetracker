import { AuthContext } from "@/components/auth-provider";
import { getAllTags } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export function useTags() {
  const { authState } = use(AuthContext);

  return useQuery({
    enabled: authState === "signedIn",
    queryKey: ["tags"],
    initialData: [] as string[],
    async queryFn() {
      return await getAllTags().then((res) => {
        if (!res) return [];
        return res;
      });
    },
  });
}
