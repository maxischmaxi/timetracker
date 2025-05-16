"use client";

import { Plain } from "@/types";
import { EmploymentState, User } from "@/user/v1/user_pb";
import { FieldErrors, useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { z } from "zod";
import { createUserSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { TagSelect } from "./tag-select";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./country-select";
import { Button } from "./ui/button";

type Props = {
  user?: Plain<User>;
  className?: string;
};

const defaultValue = {
  email: "",
  name: "",
  address: {
    city: "",
    country: "",
    state: "",
    street: "",
    zip: "",
  },
  tags: [],
  employmentState: EmploymentState.ACTIVE,
  projectIds: [],
  vacations: [],
  vacationRequests: [],
} as unknown as z.infer<typeof createUserSchema>;

export function UserForm(props: Props) {
  const create = useCreateUser();
  const update = useUpdateUser();
  const form = useForm<z.infer<typeof createUserSchema>>({
    defaultValues: props.user || defaultValue,
  });

  async function onSubmit(data: z.infer<typeof createUserSchema>) {
    if (props.user && props.user.id) {
      await update.mutateAsync({
        id: props.user.id,
        ...data,
      });
    } else {
      await create.mutateAsync(data);
    }
  }

  function onError(error: FieldErrors<z.infer<typeof createUserSchema>>) {
    for (const e of Object.values(error)) {
      if (e.message) {
        toast.error(e.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={cn("space-y-4", props.className)}
      >
        <TagSelect control={form.control} name="tags" label="Tags" />
        <Input
          control={form.control}
          name="name"
          label="Name des Benutzers"
          type="text"
          placeholder="Vorname + Nachname eingeben"
        />
        <Input
          control={form.control}
          name="email"
          type="email"
          label="Email"
          placeholder="E-Mail-Adresse eingeben"
        />
        <Input
          control={form.control}
          name="address.street"
          label="Straße"
          placeholder="Straße angeben"
        />
        <div className="flex flex-row flex-nowrap gap-4">
          <Input
            control={form.control}
            name="address.zip"
            label="PLZ"
            placeholder="PLZ"
          />
          <Input
            control={form.control}
            name="address.city"
            label="Stadt"
            placeholder="Stadt"
            wrapperClassName="w-full"
          />
        </div>
        <div className="flex flex-row flex-nowrap gap-4">
          <Input
            type="text"
            control={form.control}
            name="address.state"
            label="Bundesland"
            placeholder="Bayern..."
            wrapperClassName="w-full"
          />
          <CountrySelect
            control={form.control}
            name="address.country"
            label="Land"
          />
        </div>
        <div className="flex flex-row flex-nowrap justify-between">
          <Button type="button" variant="outline">
            Abbrechen
          </Button>
          <Button type="submit">Speichern</Button>
        </div>
      </form>
    </Form>
  );
}
