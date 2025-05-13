import { getAllTags } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTags() {
  return useQuery({
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
