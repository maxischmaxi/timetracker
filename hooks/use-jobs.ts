import { AuthContext } from "@/components/auth-provider";
import { queryClient } from "@/components/providers";
import { CreateJob, Job, JobsByDateResponse } from "@/job/v1/job_pb";
import { createJob, getJobs, getJobsByDate } from "@/lib/api";
import { Plain } from "@/types";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { use } from "react";

export function useJobs(): UseQueryResult<Array<Plain<Job>> | undefined> {
  const { user } = use(AuthContext);

  return useQuery({
    enabled: !!user,
    queryKey: ["jobs"],
    async queryFn() {
      return await getJobs();
    },
  });
}

export function useJobsByDate(
  date: Date,
): UseQueryResult<Array<Plain<JobsByDateResponse>> | undefined, Error> {
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
  onSuccess?: (job: Plain<Job>) => void;
  onError?: () => void;
};

export function useCreateJob(
  props?: CreateJobProps,
): UseMutationResult<Plain<Job> | undefined, Error, Plain<CreateJob>> {
  return useMutation({
    async mutationFn(data: Plain<CreateJob>) {
      return await createJob(data);
    },
    onSuccess(data) {
      queryClient.refetchQueries({
        queryKey: ["jobs-by-date"],
      });
      queryClient.refetchQueries({
        queryKey: ["jobs"],
      });
      if (data) {
        props?.onSuccess?.(data);
      }
    },
    onError() {
      props?.onError?.();
    },
  });
}
