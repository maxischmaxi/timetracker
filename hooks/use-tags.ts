import { AuthContext } from "@/components/auth-provider";
import { getAllTags } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export function useTags() {
  const { user } = use(AuthContext);

  return useQuery({
    enabled: !!user,
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
