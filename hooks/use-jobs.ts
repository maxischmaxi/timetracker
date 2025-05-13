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

export function useJobs(): UseQueryResult<Array<Plain<Job>> | undefined> {
  return useQuery({
    queryKey: ["jobs"],
    async queryFn() {
      return await getJobs();
    },
  });
}

export function useJobsByDate(
  date: Date,
): UseQueryResult<Array<Plain<JobsByDateResponse>> | undefined, Error> {
  return useQuery({
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
      queryClient.invalidateQueries({
        queryKey: ["jobs-by-date", "jobs"],
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
