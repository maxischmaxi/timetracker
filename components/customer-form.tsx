"use client";

import { createCustomerSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customer";
import { Plain } from "@/types";
import { Customer } from "@/customer/v1/customer_pb";
import { Loader } from "lucide-react";
import { CountrySelect } from "./country-select";
import { getCustomer } from "@/lib/api";

type Props = {
  className?: string;
  hideCancel?: boolean;
  customer?: Plain<Customer>;
  onSuccess?: (data: Plain<Customer>) => void;
  onClose?: () => void;
};

export function CustomerForm({
  customer,
  className,
  hideCancel,
  onSuccess,
  onClose,
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
    async onSuccess(data) {
      if (customer) {
        const c = await getCustomer(customer.id);
        form.reset(c);
      } else {
        form.reset();
      }
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-2 lg:space-y-4", className)}
      >
        <div className="flex flex-row gap-4 md:flex-col">
          <Input
            control={form.control}
            name="name"
            label="Customer Name"
            placeholder="Customer Name"
            wrapperClassName="w-full md:w-auto"
          />
          <Input
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
            wrapperClassName="w-full md:w-auto"
            type="email"
          />
        </div>
        <div className="flex flex-row gap-4 md:flex-col">
          <Input
            control={form.control}
            name="phone"
            label="Phone"
            placeholder="Phone"
            type="tel"
            wrapperClassName="w-full md:w-auto"
          />
          <Input
            control={form.control}
            name="tag"
            label="Tag"
            placeholder="e.g. TTY, EXE, WWK"
            wrapperClassName="w-full md:w-auto"
          />
        </div>
        <div className="flex flex-row gap-4 md:flex-col">
          <Input
            control={form.control}
            name="address.city"
            label="City"
            placeholder="City"
            wrapperClassName="w-full md:w-auto"
          />
          <Input
            control={form.control}
            name="address.zip"
            label="Zip Code"
            placeholder="Zip Code"
            wrapperClassName="w-full md:w-auto"
          />
        </div>
        <div className="flex flex-row gap-4 md:flex-col">
          <Input
            control={form.control}
            name="address.street"
            label="Street"
            placeholder="Street"
            wrapperClassName="w-full md:w-auto"
          />
          <Input
            control={form.control}
            name="address.state"
            label="State"
            placeholder="State"
            wrapperClassName="w-full md:w-auto"
          />
        </div>
        <CountrySelect
          control={form.control}
          name="address.country"
          label="Land"
        />
        <div className="flex flex-row flex-nowrap gap-4 justify-between">
          {!hideCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onClose?.();
              }}
            >
              Abbrechen
            </Button>
          )}
          <Button type="submit" disabled={create.isPending || update.isPending}>
            {update.isPending || create.isPending ? (
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
