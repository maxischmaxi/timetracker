"use client";

import { FieldErrors, useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { z } from "zod";
import { Project } from "@/project/v1/project_pb";
import { Plain } from "@/types";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { createProjectSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CustomerSelect } from "./customer-select";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type Props = {
  className?: string;
  hideCancel?: boolean;
  onCancel?: () => void;
  onSuccess?: (data: Plain<Project>) => void;
  project?: Plain<Project>;
};

export function ProjectForm({
  className,
  hideCancel,
  onCancel,
  onSuccess,
  project,
}: Props) {
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: project || {
      name: "",
      description: "",
      customerId: "",
    },
  });

  const update = useUpdateProject({
    onSuccess(data) {
      form.reset();
      onSuccess?.(data);
    },
  });

  const create = useCreateProject({
    onSuccess(data) {
      form.reset();
      onSuccess?.(data);
    },
  });

  async function onSubmit(data: z.infer<typeof createProjectSchema>) {
    if (project) {
      await update.mutateAsync({
        id: project.id,
        name: data.name,
        description: data.description,
        customerId: data.customerId,
      });
    } else {
      await create.mutateAsync({
        name: data.name,
        description: data.description,
        customerId: data.customerId,
      });
    }
  }

  function onError(error: FieldErrors<z.infer<typeof createProjectSchema>>) {
    console.error(error);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={cn("space-y-4", className)}
      >
        <CustomerSelect control={form.control} name="customerId" />
        <Input
          control={form.control}
          name="name"
          label="Project Name"
          placeholder="Project Name"
        />
        <Textarea
          control={form.control}
          name="description"
          label="Description"
          placeholder="Description"
        />
        <div className="flex flex-row flex-nowrap justify-between gap-2">
          {!hideCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onCancel?.();
              }}
            >
              Abbrechen
            </Button>
          )}
          <Button type="submit">Erstellen</Button>
        </div>
      </form>
    </Form>
  );
}
