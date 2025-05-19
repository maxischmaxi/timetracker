"use client";

import { orgPaymentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSetOrgPayment } from "@/hooks/use-org";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Plain } from "@/types";
import { Payment } from "@/org/v1/org_pb";

type Props = {
  wrapperClassName?: string;
  orgPayment: Plain<Payment> | undefined;
  orgId: string;
};

export function OrgPaymentForm({ orgId, wrapperClassName, orgPayment }: Props) {
  const form = useForm<z.infer<typeof orgPaymentSchema>>({
    resolver: zodResolver(orgPaymentSchema),
    defaultValues: orgPayment,
  });

  const setOrgPayment = useSetOrgPayment({
    onSuccess() {
      toast.info("Zahlung der Organisation erfolgreich aktualisiert");
    },
    onError() {
      toast.error("Fehler beim Aktualisieren der Zahlung!");
    },
  });

  async function onSubmit(data: z.infer<typeof orgPaymentSchema>) {
    await setOrgPayment.mutateAsync({
      ...data,
      orgId,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", wrapperClassName)}
      >
        <Input
          control={form.control}
          type="text"
          name="iban"
          placeholder="DE123123123"
          label="IBAN"
          disabled={setOrgPayment.isPending}
          autoComplete="iban"
        />
        <Input
          control={form.control}
          name="bic"
          type="text"
          placeholder="BYCLADEM"
          autoComplete="bic"
          label="BIC"
          disabled={setOrgPayment.isPending}
        />
        <Input
          control={form.control}
          name="bankName"
          autoComplete="organization"
          type="text"
          label="Name der Bank"
          placeholder="Namen eingeben..."
          disabled={setOrgPayment.isPending}
        />
        <div className="flex flex-row flex-nowrap">
          <Button
            disabled={setOrgPayment.isPending}
            type="submit"
            className="ml-auto"
          >
            {setOrgPayment.isPending ? (
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
