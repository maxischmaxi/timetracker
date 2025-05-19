"use client";

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
import { useCustomers } from "@/hooks/use-customer";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  popoverClassName?: string;
  label?: string;
  onNavigateCreateCustomer?: () => void;
  disabled?: boolean;
  wrapperClassName?: string;
};

export function CustomerSelect<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    label,
    control,
    onNavigateCreateCustomer,
    className,
    disabled,
    popoverClassName,
    wrapperClassName,
  } = props;
  const customers = useCustomers();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={wrapperClassName}>
          {!!label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  disabled={
                    customers.isPending || customers.isLoading || disabled
                  }
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("justify-between", className)}
                >
                  {(customers.isPending || customers.isLoading) && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {!customers.isPending && !customers.isLoading && field.value
                    ? customers.data?.find(
                        (framework) => framework.id === field.value,
                      )?.name
                    : "Select Customer..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={cn("w-[300px] p-0", popoverClassName)}>
                <Command>
                  <CommandInput placeholder="Kunden suchen..." />
                  <CommandList>
                    <CommandEmpty>No Customer found.</CommandEmpty>
                    <CommandGroup>
                      {customers.data?.map((customer) => (
                        <CommandItem
                          key={customer.id}
                          value={customer.id}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === customer.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <b>{customer.tag.toUpperCase()}</b> {customer.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandItem asChild>
                      <Link
                        href="/customers/create"
                        className="cursor-pointer"
                        onClick={() => {
                          setOpen(false);
                          onNavigateCreateCustomer?.();
                        }}
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create new Customer...
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
