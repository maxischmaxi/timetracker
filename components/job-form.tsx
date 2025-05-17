"use client";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { ProjectSelect } from "@/components/project-select";
import { FieldErrors, useForm } from "react-hook-form";
import { createJobSchema } from "@/lib/schemas";
import { format } from "date-fns";
import { Plain } from "@/types";
import { useCreateJob } from "@/hooks/use-jobs";
import { Button } from "./ui/button";
import { CreateJobRequest, JobType } from "@/project/v1/project_pb";
import { ServiceTypeSelect } from "./service-type-select";

type Props = {
  date: Date;
  onSuccess?: () => void;
  onError?: () => void;
  onCancel?: () => void;
  onNavigateCreateJob?: () => void;
  hideCancel?: boolean;
};

export function JobForm({
  date,
  onSuccess: parentSuccess,
  onError: parentError,
  onCancel,
  onNavigateCreateJob,
  hideCancel,
}: Props) {
  const form = useForm<z.infer<typeof createJobSchema>>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      description: "",
      projectId: "",
      type: JobType.BILLABLE,
      hours: 0,
      minutes: 0,
      date: format(date, "yyyy-MM-dd"),
    },
  });
  const create = useCreateJob({
    onSuccess() {
      form.reset();
      parentSuccess?.();
    },
    onError() {
      parentError?.();
    },
  });

  function onError(error: FieldErrors<z.infer<typeof createJobSchema>>) {
    console.error(error);
    parentError?.();
  }

  async function onSubmit(data: z.infer<typeof createJobSchema>) {
    const job: Plain<CreateJobRequest> = {
      date: format(date, "yyyy-MM-dd"),
      serviceTypeId: data.serviceTypeId,
      type: data.type,
      projectId: data.projectId,
      description: data.description,
      hours: data.hours,
      minutes: data.minutes,
    };
    await create.mutateAsync(job);
  }

  function cancel() {
    form.reset();
    onCancel?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
        <ProjectSelect
          onNavigateCreateJob={onNavigateCreateJob}
          control={form.control}
          name="projectId"
        />
        <ServiceTypeSelect control={form.control} name="serviceTypeId" />
        <Textarea
          control={form.control}
          name="description"
          placeholder="Jobbeschreibung"
          label="Jobbeschreibung"
        />
        <Input
          control={form.control}
          name="hours"
          type="number"
          inputMode="numeric"
          label="Stunden"
        />
        <Input
          control={form.control}
          name="minutes"
          type="number"
          inputMode="numeric"
          label="Minuten"
        />
        <div className="flex flex-row flex-nowrap gap-2 justify-between">
          {!hideCancel && (
            <Button type="button" variant="outline" onClick={cancel}>
              Abbrechen
            </Button>
          )}
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Lade..." : "Job erstellen"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
