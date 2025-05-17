"use client";

import { Button } from "@/components/ui/button";
import { useJobsByDate } from "@/hooks/use-jobs";
import { useMemo, useState } from "react";
import {
  ChevronsUpDown,
  InfoIcon,
  Loader,
  TriangleAlertIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JobForm } from "@/components/job-form";
import React from "react";
import {
  GoogleCalendarEvent,
  useGoogleCalendarEvents,
  useImportGoogleCalendarEvent,
} from "@/hooks/use-google-events";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { GoogleIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useProjects } from "@/hooks/use-projects";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ServiceTypeSelect } from "@/components/service-type-select";

export default function Page() {
  const [date, setDate] = useState<Date>(new Date());
  const jobs = useJobsByDate(date);
  const googleCalendarEvents = useGoogleCalendarEvents(date);

  return (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  if (date) {
                    setDate(date);
                  } else {
                    setDate(new Date());
                  }
                }}
                initialFocus
              />
              <SidebarMenu>
                <SidebarMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <SidebarMenuButton
                        variant="outline"
                        className="cursor-pointer"
                      >
                        <GoogleIcon />
                        Google Calendar importieren
                      </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl w-full">
                      <DialogHeader>
                        <DialogTitle>Google Import</DialogTitle>
                        <DialogDescription>
                          Google Calendar Events importieren
                        </DialogDescription>
                      </DialogHeader>
                      <ul className="max-h-[600px] h-full overflow-y-auto flex flex-col gap-2">
                        {googleCalendarEvents.data?.map((e, index) => (
                          <GoogleCalendarListItem key={index} event={e} />
                        ))}
                      </ul>
                    </DialogContent>
                  </Dialog>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="w-full space-y-4 p-4">
        <JobForm date={date} />
        {jobs.isPending && (
          <div className="flex flex-row flex-nowrap items-center justify-start w-full gap-2">
            <Loader className="animate-spin w-4 h-4" />
            <p className="text-sm">Jobs werden geladen</p>
          </div>
        )}
        {!jobs.isPending && !jobs.isError && !jobs.data?.length && (
          <div className="flex flex-row flex-nowrap items-center justify-start w-full gap-2">
            <InfoIcon className="w-4 h-4" />
            <p className="text-sm">
              Keine Jobs vorhanden für{" "}
              {format(date, "dd.MM.yyyy", { locale: de })}
            </p>
          </div>
        )}
        {jobs.isError && (
          <div className="flex flex-row flex-nowrap items-center justify-start w-full gap-2">
            <TriangleAlertIcon className="w-4 h-4" />
            <p className="text-red-500 text-sm">Fehler beim Laden der Jobs.</p>
          </div>
        )}
        {!jobs.isPending && !jobs.isError && (jobs.data?.length || 0) > 0 && (
          <ul>
            {jobs.data?.map((job) => (
              <li key={job.job?.id}>
                <Badge style={{ backgroundColor: job.project?.customColor }}>
                  {job.project?.name}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SidebarProvider>
  );
}

type Props = {
  event: GoogleCalendarEvent;
};

function GoogleCalendarListItem({ event }: Props) {
  const googleImport = useImportGoogleCalendarEvent();
  const [projectId, setProjectId] = useState<string>("");
  const [serviceTypeId, setServiceTypeId] = useState<string>("");
  const projects = useProjects();
  const [open, setOpen] = useState<boolean>(false);

  async function executeImport() {
    if (projectId === "") {
      toast.error("Bitte wähle ein Projekt aus auf das gebucht werden soll!");
      return;
    }

    await googleImport.mutateAsync({
      data: event,
      projectId,
      serviceTypeId,
    });
  }

  const project = useMemo(() => {
    const p = projects.data?.find((p) => p.id === projectId);
    if (!p) return null;
    return p;
  }, [projectId, projects.data]);

  return (
    <li className="flex flex-row items-center flex-nowrap justify-end w-full gap-2">
      <Badge variant="secondary" className="mr-auto">
        <span className="mr-2">{`${format(
          event.start?.dateTime || new Date(),
          "dd.MM.yyyy hh:mm",
          {
            locale: de,
          },
        )} - ${format(event.end?.dateTime || new Date(), "hh:mm", { locale: de })}`}</span>
        <span>{event.summary}</span>
      </Badge>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {project ? project.name : "Projekt auswählen"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Projekt suchen..." />
            <CommandList>
              <CommandEmpty>Kein Projekt gefunden</CommandEmpty>
              <CommandGroup>
                {projects.data?.map((p, index) => (
                  <CommandItem
                    keywords={[p.name, p.description]}
                    key={index}
                    value={p.id}
                    onSelect={(value) => {
                      setProjectId(value);
                      setOpen(false);
                    }}
                  >
                    {p.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <ServiceTypeSelect
        value={serviceTypeId}
        onValueChange={setServiceTypeId}
      />
      <Button
        variant="outline"
        onClick={executeImport}
        disabled={googleImport.isPending}
      >
        {googleImport.isPending ? (
          <Loader className="animate-spin" />
        ) : (
          "Importieren"
        )}
      </Button>
    </li>
  );
}
