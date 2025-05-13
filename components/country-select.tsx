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
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import Image from "next/image";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
};

export function CountrySelect<T extends FieldValues>(props: Props<T>) {
  const { control, name, label, className } = props;
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
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
                  className={cn("w-[200px] justify-between", className)}
                >
                  {field.value
                    ? countries.find((c) => c.code === field.value)?.name
                    : "Select a country"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>Kein Land gefunden</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country, index) => (
                        <CommandItem
                          keywords={[
                            country.name,
                            country.code,
                            country.language.code,
                            country.region,
                            country.flag,
                          ]}
                          key={index}
                          value={country.code}
                          onSelect={(value) => {
                            field.onChange(value);
                            setOpen(false);
                          }}
                        >
                          <Image
                            src={country.flag}
                            alt={country.name}
                            width={18}
                            height={12}
                          />
                          {country.name}
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
