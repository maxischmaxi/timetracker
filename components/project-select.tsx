"use client";

import { useProjects } from "@/hooks/use-projects";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Loader, PlusIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useRouter } from "next/navigation";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  popoverClassName?: string;
  label?: string;
  onNavigateCreateJob?: () => void;
  triggerClassName?: string;
};

export function ProjectSelect<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    label,
    control,
    onNavigateCreateJob,
    className,
    popoverClassName,
    triggerClassName,
  } = props;
  const projects = useProjects();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (projects.isPending) {
    return (
      <Button type="button" variant="outline" role="combobox" disabled>
        <Loader className="mr-2 h-4 w-4 animate-spin" />
        Projekt wählen...
      </Button>
    );
  }

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {!!label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("w-full justify-between", triggerClassName)}
                >
                  {!projects.isLoading && field.value
                    ? projects.data?.find(
                        (framework) => framework.id === field.value,
                      )?.name
                    : "Projekt wählen..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={cn("p-0", popoverClassName)}>
                <Command>
                  <CommandInput placeholder="Project suchen..." />
                  <CommandList>
                    <CommandEmpty>Kein Projekt gefunden.</CommandEmpty>
                    <CommandGroup>
                      {projects.data?.map((project) => (
                        <CommandItem
                          key={project.id}
                          value={project.id}
                          keywords={[
                            project.id,
                            project.name,
                            project.description,
                          ]}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === project.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {project.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem asChild>
                        <Button
                          className="w-full cursor-pointer"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setOpen(false);
                            router.push("/projects/create");
                            onNavigateCreateJob?.();
                          }}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Neues Projekt erstellen...
                        </Button>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
