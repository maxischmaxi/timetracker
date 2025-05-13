"use client";

import { cn } from "@/lib/utils";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

type InputProps<T extends FieldValues> = {
  control?: Control<T>;
  name?: Path<T>;
  label?: string;
} & React.ComponentProps<"input">;

function Input<T extends FieldValues>(props: InputProps<T>) {
  const { className, label, control, name, type, ...rest } = props;

  if (control && name) {
    return (
      <FormField
        name={name}
        control={control}
        render={({ field: { onChange: fieldOnChange, ...field } }) => {
          function onChange(e: React.ChangeEvent<HTMLInputElement>) {
            if (type === "number") {
              const value = e.currentTarget.value;
              const parsedValue = value ? parseInt(value, 10) : 0;
              fieldOnChange(parsedValue);
            } else {
              fieldOnChange(e);
            }
          }

          return (
            <FormItem>
              {!!label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <input
                  type={type}
                  data-slot="input"
                  className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    className,
                  )}
                  {...rest}
                  {...field}
                  onChange={onChange}
                />
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
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      name={name}
      {...rest}
    />
  );
}

export { Input };
