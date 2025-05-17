"use client";

import { Plain } from "@/types";
import { Switch } from "./ui/switch";
import { Project, ProjectType } from "@/project/v1/project_pb";
import { useCallback } from "react";
import { useUpdateProjectType } from "@/hooks/use-projects";
import { toast } from "sonner";

type Props = {
  project: Plain<Project>;
};

export function ProjectBillableSwitch({ project }: Props) {
  const update = useUpdateProjectType({
    onSuccess() {
      toast.info("Projekt aktualisiert");
    },
    onError() {
      toast.info("Fehler beim aktualisieren des Projekts");
    },
  });

  const handleCheckedChange = useCallback(
    async (value: boolean) => {
      await update.mutateAsync({
        value,
        projectId: project.id,
      });
    },
    [project.id, update],
  );

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`billable_switch_${project.id}`}
        checked={project.projectType === ProjectType.BILLABLE}
        onCheckedChange={handleCheckedChange}
        disabled={update.isPending}
      />
    </div>
  );
}
