"use client";

import { useCurrentOrg } from "@/hooks/use-org";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name?: Path<T>;
  label?: string;
  className?: string;
  popoverClassName?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export function ServiceTypeSelect<T extends FieldValues>(props: Props<T>) {
  const {
    className,
    value,
    onValueChange,
    popoverClassName,
    name,
    control,
    label,
  } = props;
  const org = useCurrentOrg();
  const [open, setOpen] = useState<boolean>(false);

  if (!org) {
    return null;
  }

  if (control && name) {
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
                    {field.value
                      ? org.serviceTypes.find(
                          (serviceType) => serviceType.id === field.value,
                        )?.name
                      : "Service Type wählen..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("p-0", popoverClassName)}>
                  <Command>
                    <CommandInput placeholder="ServiceType suchen" />
                    <CommandList>
                      <CommandEmpty>No ServiceType found.</CommandEmpty>
                      <CommandGroup>
                        {org.serviceTypes.map((serviceType) => (
                          <CommandItem
                            key={serviceType.id}
                            value={serviceType.id}
                            onSelect={(currentValue) => {
                              field.onChange(currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === serviceType.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {serviceType.name}
                          </CommandItem>
                        ))}
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? org.serviceTypes.find((serviceType) => serviceType.id === value)
                ?.name
            : "Service Type wählen..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", popoverClassName)}>
        <Command>
          <CommandInput placeholder="ServiceType suchen" />
          <CommandList>
            <CommandEmpty>No ServiceType found.</CommandEmpty>
            <CommandGroup>
              {org.serviceTypes.map((serviceType) => (
                <CommandItem
                  key={serviceType.id}
                  value={serviceType.id}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === serviceType.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {serviceType.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
