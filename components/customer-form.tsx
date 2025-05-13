"use client";

import { createCustomerSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customer";
import { Plain } from "@/types";
import { Customer } from "@/customer/v1/customer_pb";
import { Loader } from "lucide-react";

type Props = {
  className?: string;
  hideCancel?: boolean;
  customer?: Plain<Customer>;
  onSuccess?: (data: Plain<Customer>) => void;
};

export function CustomerForm({
  customer,
  className,
  hideCancel,
  onSuccess,
}: Props) {
  const form = useForm<z.infer<typeof createCustomerSchema>>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: customer || {
      name: "",
      email: "",
      phone: "",
      tag: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
  });

  const update = useUpdateCustomer({
    onSuccess(data) {
      form.reset();
      onSuccess?.(data);
    },
  });

  const create = useCreateCustomer({
    onSuccess(data) {
      form.reset();
      onSuccess?.(data);
    },
  });

  async function onSubmit(data: z.infer<typeof createCustomerSchema>) {
    if (customer) {
      await update.mutateAsync({
        id: customer.id,
        ...data,
      });
    } else {
      await create.mutateAsync(data);
    }
  }

  function onError(error: FieldErrors<z.infer<typeof createCustomerSchema>>) {
    console.error(error);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={cn("space-y-4", className)}
      >
        <Input
          control={form.control}
          name="name"
          label="Customer Name"
          placeholder="Customer Name"
        />
        <Input
          control={form.control}
          name="email"
          label="Email"
          placeholder="Email"
          type="email"
        />
        <Input
          control={form.control}
          name="phone"
          label="Phone"
          placeholder="Phone"
          type="tel"
        />
        <Input
          control={form.control}
          name="tag"
          label="Tag"
          placeholder="Tag"
        />
        <Input
          control={form.control}
          name="address.street"
          label="Street"
          placeholder="Street"
        />
        <Input
          control={form.control}
          name="address.city"
          label="City"
          placeholder="City"
        />
        <Input
          control={form.control}
          name="address.state"
          label="State"
          placeholder="State"
        />
        <Input
          control={form.control}
          name="address.zip"
          label="Zip Code"
          placeholder="Zip Code"
        />
        <Input
          control={form.control}
          name="address.country"
          label="Country"
          placeholder="Country"
        />
        <div className="flex flex-row flex-nowrap gap-4 justify-between">
          {!hideCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
              }}
            >
              Abbrechen
            </Button>
          )}
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Speichern"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
