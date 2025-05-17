import { AuthContext } from "@/components/auth-provider";
import { queryClient } from "@/components/providers";
import {
  createProject,
  getProject,
  getProjects,
  updateProject,
} from "@/lib/api";
import { CreateProject, Project, UpdateProject } from "@/project/v1/project_pb";
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
