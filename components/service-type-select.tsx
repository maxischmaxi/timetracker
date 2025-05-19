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
  CommandSeparator,
} from "./ui/command";
import { Check, ChevronsUpDown, Loader, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name?: Path<T>;
  label?: string;
  className?: string;
  popoverClassName?: string;
  triggerClassName?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export function ServiceTypeSelect<T extends FieldValues>(props: Props<T>) {
  const {
    className,
    value,
    onValueChange,
    triggerClassName,
    popoverClassName,
    name,
    control,
    label,
  } = props;
  const org = useCurrentOrg();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  if (!org) {
    return (
      <Button type="button" variant="outline" role="combobox" disabled>
        <Loader className="mr-2 h-4 w-4 animate-spin" />
        Leistungsart wählen...
      </Button>
    );
  }

  if (control && name) {
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
                    {field.value
                      ? org.serviceTypes.find(
                          (serviceType) => serviceType.id === field.value,
                        )?.name
                      : "Leistungsart wählen..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("p-0", popoverClassName)}>
                  <Command>
                    <CommandInput placeholder="Leistungsart suchen..." />
                    <CommandList>
                      <CommandEmpty>No ServiceType found.</CommandEmpty>
                      <CommandGroup>
                        {org.serviceTypes.map((serviceType) => (
                          <CommandItem
                            key={serviceType.id}
                            value={serviceType.id}
                            keywords={[serviceType.id, serviceType.name]}
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
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem asChild>
                          <Button
                            variant="ghost"
                            className="w-full cursor-pointer"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpen(false);
                              router.push("/organization");
                            }}
                          >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Leistungsart erstellen
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
            : "Leistungsart wählen..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", popoverClassName)}>
        <Command>
          <CommandInput placeholder="Leistungsart suchen..." />
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
            <CommandSeparator />
            <CommandGroup>
              <CommandItem asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                    router.push("/organization");
                  }}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Leistungsart erstellen
                </Button>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
