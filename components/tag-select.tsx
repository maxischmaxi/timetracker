import { useTags } from "@/hooks/use-tags";
import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { cn } from "@/lib/utils";
import { KeyboardEvent, MouseEvent, useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { buttonVariants } from "./ui/button";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
};

export function TagSelect<T extends FieldValues>({
  control,
  name,
  label,
}: Props<T>) {
  const tags = useTags();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        function onNewTagValueKeyDown(e: KeyboardEvent<HTMLInputElement>) {
          if (e.key === "Enter") {
            e.preventDefault();
            const value = e.currentTarget.value;
            if (value) {
              if (typeof field.value === "string") {
                field.onChange([field.value, value]);
              }
              if (Array.isArray(field.value)) {
                const existingTags = field.value as string[];
                const newTags = [...existingTags, value];
                field.onChange(newTags);
              }
            }
            setOpen(false);
          }
        }

        function onRemoveTag(e: MouseEvent<HTMLButtonElement>, index: number) {
          e.stopPropagation();
          e.preventDefault();

          if (Array.isArray(field.value)) {
            const newTags = [...(field.value as string[])];
            newTags.splice(index, 1);
            field.onChange(newTags);
          }
        }

        const currentTags =
          typeof field.value === "string"
            ? [field.value]
            : Array.isArray(field.value)
              ? (field.value as unknown as string[])
              : [];

        return (
          <FormItem>
            {!!label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div>
                <div
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                    }),
                    currentTags.length === 0
                      ? "cursor-pointer"
                      : "cursor-default",
                    "pl-2 pr-0 gap-0 py-2 h-auto hover:bg-background",
                  )}
                  onClick={(e) => {
                    if (currentTags.length === 0) {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(true);
                    }
                  }}
                >
                  {currentTags.length === 0 && (
                    <span className="pr-4 pl-2">Tag hinzufügen...</span>
                  )}
                  {currentTags.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-2">
                      {currentTags.map((t, index) => (
                        <button
                          type="button"
                          key={index}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "py-0.5 cursor-pointer",
                          )}
                          onClick={(e) => onRemoveTag(e, index)}
                        >
                          {t}
                          <XIcon className="w-3 h-2" />
                        </button>
                      ))}
                    </div>
                  )}

                  {currentTags.length > 0 && (
                    <button
                      type="button"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "mx-2",
                      )}
                      onClick={(e) => {
                        setOpen(true);
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <PlusIcon />
                    </button>
                  )}
                </div>
                <CommandDialog open={open} onOpenChange={setOpen}>
                  <CommandInput
                    placeholder="Tag erstellen..."
                    onKeyDown={onNewTagValueKeyDown}
                  />
                  <CommandList>
                    <CommandGroup heading="Vorschläge">
                      {tags.data?.map((tag, index) => (
                        <CommandItem key={index}>{tag}</CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
