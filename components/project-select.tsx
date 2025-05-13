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
} from "./ui/command";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  popoverClassName?: string;
  label?: string;
  onNavigateCreateJob?: () => void;
};

export function ProjectSelect<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    label,
    control,
    onNavigateCreateJob,
    className,
    popoverClassName,
  } = props;
  const projects = useProjects();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {!!label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("w-full justify-between", className)}
                >
                  {(projects.isPending || projects.isLoading) && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {!projects.isPending && !projects.isLoading && field.value
                    ? projects.data?.find(
                        (framework) => framework.id === field.value,
                      )?.name
                    : "Select Project..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={cn("p-0", popoverClassName)}>
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandList>
                    <CommandEmpty>No Project found.</CommandEmpty>
                    <CommandGroup>
                      {projects.data?.map((project) => (
                        <CommandItem
                          key={project.id}
                          value={project.id}
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
                    <CommandItem asChild>
                      <Link
                        href="/projects/create"
                        className="cursor-pointer"
                        onClick={() => {
                          setOpen(false);
                          onNavigateCreateJob?.();
                        }}
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create new Project...
                      </Link>
                    </CommandItem>
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
