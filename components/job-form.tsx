"use client";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { ProjectSelect } from "@/components/project-select";
import { useForm } from "react-hook-form";
import { createJobSchema } from "@/lib/schemas";
import { format } from "date-fns";
import { Plain } from "@/types";
import { Button } from "./ui/button";
import { CreateJobRequest, JobType } from "@/project/v1/project_pb";
import { ServiceTypeSelect } from "./service-type-select";
import { useCreateJob } from "@/hooks/use-projects";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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
      isMeeting: false,
      serviceTypeId: "",
    },
  });
  const create = useCreateJob({
    onSuccess() {
      form.setValue("description", "");
      form.setValue("hours", 0);
      form.setValue("minutes", 0);
      parentSuccess?.();
    },
    onError() {
      parentError?.();
    },
  });

  function onError() {
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
      isMeeting: data.isMeeting,
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
        <div className="flex flex-col flex-nowrap gap-2 lg:flex-row">
          <ProjectSelect
            onNavigateCreateJob={onNavigateCreateJob}
            control={form.control}
            name="projectId"
            className="w-full"
          />
          <ServiceTypeSelect
            control={form.control}
            name="serviceTypeId"
            className="w-full"
          />
        </div>
        <Textarea
          control={form.control}
          name="description"
          placeholder="Jobbeschreibung"
          label="Jobbeschreibung"
        />
        <div className="flex flex-col flex-nowrap gap-4 lg:flex-row">
          <Input
            control={form.control}
            name="hours"
            type="number"
            inputMode="numeric"
            label="Stunden"
            className="max-w-full lg:max-w-[100px]"
          />
          <Input
            control={form.control}
            name="minutes"
            type="number"
            inputMode="numeric"
            label="Minuten"
            className="max-w-full lg:max-w-[100px]"
          />
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.watch("isMeeting")}
              onCheckedChange={(value) => form.setValue("isMeeting", value)}
              id="isMeetingSwitch"
            />
            <Label htmlFor="isMeetingSwitch">Meeting?</Label>
          </div>
          {hideCancel && (
            <Button
              className="mt-0 mb-0 ml-0 lg:mt-auto lg:mb-2 lg:ml-auto"
              type="submit"
              disabled={create.isPending}
            >
              {create.isPending ? "Lade..." : "Job erstellen"}
            </Button>
          )}
        </div>
        {!hideCancel && (
          <div className="flex flex-row flex-nowrap justify-between gap-2">
            <Button type="button" variant="outline" onClick={cancel}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Lade..." : "Job erstellen"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
