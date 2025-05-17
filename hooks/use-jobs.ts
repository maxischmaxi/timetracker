"use client";

import { AuthContext } from "@/components/auth-provider";
import { queryClient } from "@/components/providers";
import { createJob, getJobsByDate } from "@/lib/api";
import { CreateJobRequest, DateJob } from "@/project/v1/project_pb";
import { Plain } from "@/types";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { use } from "react";

export function useJobsByDate(
  date: Date,
): UseQueryResult<Array<Plain<DateJob>> | undefined, Error> {
  const { user } = use(AuthContext);

  return useQuery({
    enabled: !!user,
    queryKey: ["jobs-by-date", date],
    async queryFn() {
      return await getJobsByDate(date);
    },
  });
}

type CreateJobProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useCreateJob(props?: CreateJobProps) {
  return useMutation({
    async mutationFn(data: Plain<CreateJobRequest>) {
      await createJob(data);
    },
    onSuccess(_, params) {
      queryClient.refetchQueries({
        queryKey: ["jobs-by-date", params.date],
      });
      props?.onSuccess?.();
    },
    onError() {
      props?.onError?.();
    },
  });
}
