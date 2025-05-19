"use client";

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
import { useState } from "react";
import { Button } from "./ui/button";
import { cn, firstLetterUppercase } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { PositionUnitSchema } from "@/positions/v1/positions_pb";
import {} from "@bufbuild/protobuf";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
};

function toFriendlyName(name: string) {
  const parts = firstLetterUppercase(name)
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .split(" ");
  return parts.map((p) => firstLetterUppercase(p)).join(" ");
}

export function PositionUnitSelect<T extends FieldValues>(props: Props<T>) {
  const { control, name, label, className } = props;
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const currentValue = PositionUnitSchema.values.find(
          (v) => v.number === field.value,
        );

        return (
          <FormItem>
            {!!label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                  >
                    {!!currentValue
                      ? toFriendlyName(currentValue.localName)
                      : "Einheit wählen"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>Keine Einheit gefunden</CommandEmpty>
                      <CommandGroup>
                        {PositionUnitSchema.values
                          .filter((v) => v.number !== 0)
                          .map((value, index) => (
                            <CommandItem
                              keywords={[value.name, value.localName]}
                              key={index}
                              value={value.number.toString()}
                              onSelect={(value) => {
                                const no = parseInt(value);
                                if (isNaN(no)) {
                                  return;
                                }
                                field.onChange(no);
                                setOpen(false);
                              }}
                            >
                              {toFriendlyName(value.localName)}
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
