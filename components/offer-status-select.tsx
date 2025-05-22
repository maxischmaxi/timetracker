"use client";

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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn, enumToFriendlyName } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { OfferStatusSchema } from "@/offers/v1/offers_pb";

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name?: Path<T>;
  label?: string;
  className?: string;
  popoverClassName?: string;
  triggerClassName?: string;
  value?: number;
  onValueChange?: (value: number) => void;
};

export function OfferStatusSelect<T extends FieldValues>(props: Props<T>) {
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
  const [open, setOpen] = useState<boolean>(false);

  if (control && name) {
    return (
      <FormField
        name={name}
        control={control}
        render={({ field }) => {
          const value = OfferStatusSchema.values.find(
            (state) => state.number === field.value,
          );
          return (
            <FormItem className={className}>
              {!!label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={field.disabled}
                      className={cn("w-full justify-between", triggerClassName)}
                    >
                      {value
                        ? enumToFriendlyName(value.localName)
                        : "Status wählen..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={cn("p-0", popoverClassName)}>
                    <Command>
                      <CommandInput placeholder="Status suchen..." />
                      <CommandList>
                        <CommandEmpty>No ServiceType found.</CommandEmpty>
                        <CommandGroup>
                          {OfferStatusSchema.values
                            .filter((v) => v.number !== 0)
                            .map((state) => (
                              <CommandItem
                                key={state.number}
                                value={state.number.toString()}
                                keywords={[state.name, state.localName]}
                                onSelect={(currentValue) => {
                                  const numberValue = parseInt(currentValue);
                                  if (isNaN(numberValue)) return;
                                  field.onChange(numberValue);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === state.number
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {enumToFriendlyName(state.localName)}
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
          );
        }}
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
            ? OfferStatusSchema.values.find((state) => state.number === value)
                ?.name
            : "Status wählen..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", popoverClassName)}>
        <Command>
          <CommandInput placeholder="Status suchen..." />
          <CommandList>
            <CommandEmpty>No ServiceType found.</CommandEmpty>
            <CommandGroup>
              {OfferStatusSchema.values
                .filter((v) => v.number !== 0)
                .map((state) => (
                  <CommandItem
                    key={state.number}
                    value={state.number.toString()}
                    onSelect={(currentValue) => {
                      const numberValue = parseInt(currentValue);
                      if (isNaN(numberValue)) return;
                      onValueChange?.(numberValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === state.number ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {enumToFriendlyName(state.localName)}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
