"use client";

import { AuthContext } from "@/components/auth-provider";
import { queryClient } from "@/components/providers";
import {
  createJob,
  createProject,
  deleteJob,
  getJobsByDate,
  getProject,
  getProjects,
  updateProject,
  updateProjectType,
} from "@/lib/api";
import {
  CreateJobRequest,
  CreateProject,
  DateJob,
  Project,
  UpdateProject,
} from "@/project/v1/project_pb";
import { Plain } from "@/types";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { use } from "react";

export function useProjects(): UseQueryResult<
  Array<Plain<Project>> | undefined,
  Error
> {
  const { user } = use(AuthContext);

  return useQuery({
    enabled: !!user,
    queryKey: ["projects"],
    async queryFn() {
      return await getProjects();
    },
  });
}

export function useProject(id: string) {
  const { user } = use(AuthContext);
  return useQuery({
    queryKey: ["project", id],
    enabled: !!id && !!user,
    async queryFn() {
      return await getProject(id);
    },
  });
}

type CreateProjectProps = {
  onSuccess?: (project: Plain<Project>) => void;
  onError?: () => void;
};

export function useCreateProject(props?: CreateProjectProps) {
  return useMutation({
    async mutationFn(data: Plain<CreateProject>) {
      return await createProject(data);
    },
    onSuccess(data) {
      queryClient.refetchQueries({
        queryKey: ["projects"],
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

export function useUpdateProject(props?: CreateProjectProps) {
  return useMutation({
    async mutationFn(data: Plain<UpdateProject>) {
      return await updateProject(data);
    },
    onSuccess(data) {
      queryClient.refetchQueries({
        queryKey: ["projects"],
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

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useUpdateProjectType(props?: Props) {
  return useMutation({
    async mutationFn({
      value,
      projectId,
    }: {
      value: boolean;
      projectId: string;
    }) {
      await updateProjectType(projectId, value);
      await queryClient.refetchQueries({
        queryKey: ["projects"],
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

export function useDeleteJob(props?: Props) {
  return useMutation({
    async mutationFn({
      id,
      projectId,
    }: {
      id: string;
      projectId: string;
      date: string;
    }) {
      await deleteJob(id, projectId);
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

export function useCreateJob(props?: Props) {
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
