"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { de } from "date-fns/locale";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  wrapperClassName?: string;
  className?: string;
};

export function DatePicker<T extends FieldValues>(props: Props<T>) {
  const { name, control, label, wrapperClassName, className } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={wrapperClassName}>
          {!!label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={field.disabled}
                  className={cn(
                    "justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    className,
                  )}
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(field.value, "dd.MMMM yyyy", { locale: de })
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  locale={de}
                  onSelect={(date) => {
                    field.onChange(date);
                  }}
                  initialFocus
                />
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
