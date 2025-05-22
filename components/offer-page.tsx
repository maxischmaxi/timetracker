"use client";

import { CustomerSelect } from "@/components/customer-select";
import { DatePicker } from "@/components/date-picker";
import { OfferStatusSelect } from "@/components/offer-status-select";
import { PositionUnitSelect } from "@/components/position-unit-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateOffer } from "@/hooks/use-offers";
import { useCurrentOrg } from "@/hooks/use-org";
import { updateOfferSchema } from "@/lib/schemas";
import { cn, formatCurrency } from "@/lib/utils";
import { Offer, OfferStatus } from "@/offers/v1/offers_pb";
import { DiscountType, PositionUnit } from "@/positions/v1/positions_pb";
import { Plain } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, Loader, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  offer: Plain<Offer>;
};

export function OfferForm({ offer }: Props) {
  const org = useCurrentOrg();
  const form = useForm<z.infer<typeof updateOfferSchema>>({
    resolver: zodResolver(updateOfferSchema),
    disabled: offer.status === OfferStatus.SENT,
    defaultValues: offer,
  });

  const update = useUpdateOffer({
    onSuccess() {
      toast.info("Angebot erfolgreich aktualisiert");
    },
    onError() {
      toast.error("Fehler beim Aktualisieren des Angebots");
    },
  });

  const positions = useFieldArray({
    control: form.control,
    name: "positions",
  });

  async function onSubmit(data: z.infer<typeof updateOfferSchema>) {
    if (!org?.id) {
      toast.error("Aktuell ist keine Organisation augewählt");
      return;
    }

    await update.mutateAsync({
      ...data,
      orgId: org.id,
    });
  }

  function addPosition() {
    positions.append({
      name: "",
      count: 0,
      description: "",
      price: 0,
      unit: PositionUnit.HOURS,
    });
  }

  const { discount, positions: pos } = useWatch({
    control: form.control,
  });

  const subtotalValue = useMemo(() => {
    if (!pos) return 0;

    return pos.reduce(
      (acc, curr) => acc + (curr.price || 0) * (curr.count || 0),
      0,
    );
  }, [pos]);

  const discountValue = useMemo(() => {
    if (!discount || !discount.value || !discount.type) return 0;

    if (discount.type === DiscountType.FIXED) {
      return discount.value;
    }
    return Math.abs((subtotalValue / 100) * discount.value);
  }, [discount, subtotalValue]);

  const totalValue = useMemo(
    () => subtotalValue - discountValue,
    [subtotalValue, discountValue],
  );

  const discountType = useWatch({
    control: form.control,
  }).discount?.type;

  return (
    <>
      <Form {...form}>
        <form
          className="h-full space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="bg-background sticky top-0 z-10 flex flex-row flex-nowrap justify-end gap-4 border-b p-4">
            <Button className="mr-auto" variant="outline" asChild>
              <Link href="/offers">
                <ChevronLeftIcon />
              </Link>
            </Button>
            <Button variant="outline">Drucken</Button>
            <Button
              type="submit"
              disabled={update.isPending || form.formState.disabled}
            >
              {update.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Speichern"
              )}
            </Button>
          </div>
          <div className="mx-auto flex w-full max-w-xl flex-col flex-nowrap gap-4 px-4 pt-8 lg:flex-row lg:px-0">
            <Input
              control={form.control}
              name="offerNo"
              label="Dokumentennummer"
              placeholder="2025-001"
              wrapperClassName="w-full"
            />
            <CustomerSelect
              control={form.control}
              name="customerId"
              label="Kunde"
              wrapperClassName="w-full"
            />
          </div>
          <div className="mx-auto flex w-full max-w-xl flex-col flex-nowrap gap-4 px-4 lg:flex-row lg:px-0">
            <DatePicker
              control={form.control}
              name="dateOfIssue"
              label="Ausstellungsdatum"
              wrapperClassName="w-full"
            />
            <DatePicker
              control={form.control}
              name="validUntil"
              label="Gültig bis"
              wrapperClassName="w-full"
            />
          </div>
          <div className="mx-auto flex w-full max-w-xl flex-col flex-nowrap gap-4 px-4 lg:flex-row lg:px-0">
            <OfferStatusSelect
              control={form.control}
              name="status"
              label="Status"
            />
          </div>
          <div className="mx-auto max-w-xl px-4 lg:px-0">
            <Card className={cn(form.formState.disabled && "bg-card/50")}>
              <CardHeader>
                <CardTitle
                  className={cn(form.formState.disabled && "opacity-50")}
                >
                  Artikel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-8">
                  {positions.fields.map((pos, index) => (
                    <li key={pos.id}>
                      <p className="text-xs font-bold">Position {index + 1}</p>
                      <Input
                        control={form.control}
                        name={`positions.${index}.name`}
                        label="Name"
                        placeholder="Name des Artikels"
                      />
                      <div className="flex flex-row flex-nowrap gap-4">
                        <PositionUnitSelect
                          control={form.control}
                          name={`positions.${index}.unit`}
                          label="Einheit"
                        />
                        <Input
                          control={form.control}
                          name={`positions.${index}.count`}
                          label="Menge"
                          inputMode="numeric"
                        />
                        <Input
                          control={form.control}
                          name={`positions.${index}.price`}
                          inputMode="numeric"
                          label="Preis"
                        />
                      </div>
                      <Textarea
                        control={form.control}
                        name={`positions.${index}.description`}
                        label="Beschreibung"
                        placeholder="Beschreibung des Artikels"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => positions.remove(index)}
                      >
                        Artikel entfernen
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  disabled={form.formState.disabled}
                  type="button"
                  onClick={addPosition}
                >
                  <PlusIcon />
                  Artikel hinzufügen
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mx-auto max-w-xl px-4 lg:px-0">
            <Textarea
              control={form.control}
              name="note"
              label="Notiz hinzufügen"
              placeholder="Gebe optional eine Notiz an"
            />
            <Textarea
              control={form.control}
              name="legalNotice"
              label="Allgemeine Geschäftsbedingungen (Optional)"
              placeholder="Fügen Sie Informationen zur rechtlichen Vereinbarung mit Ihrem Kunden hinzu."
            />
          </div>
          <div className="bg-background sticky bottom-0 z-10 flex max-h-[400px] w-full justify-end border-t py-8 pr-4">
            <div className="flex w-[400px] flex-col gap-1">
              <div className="flex flex-row justify-between text-sm">
                <p className="text-right">Zwischensumme</p>
                <p>{formatCurrency(subtotalValue, "EUR", "de-DE")}</p>
              </div>
              {!offer.isPending && !offer.isError && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button type="button">
                      Rabatt bearbeiten:{" "}
                      <span className="ml-auto">
                        {formatCurrency(discountValue, "EUR", "de-DE")}
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Rabatt hinzufügen</SheetTitle>
                      <SheetDescription>
                        Räumen Sie Ihrem Kunden einen Rabatt ein.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 px-4">
                      <div className="flex w-full flex-row flex-nowrap gap-4">
                        <Button
                          variant={
                            discountType === DiscountType.FIXED
                              ? "default"
                              : "outline"
                          }
                          type="button"
                          className="flex-1"
                          onClick={() => {
                            form.setValue("discount", {
                              value: 0,
                              type: DiscountType.FIXED,
                            });
                          }}
                        >
                          Festbetrag(€)
                        </Button>
                        <Button
                          className="flex-1"
                          type="button"
                          variant={
                            discountType === DiscountType.PERCENT
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            form.setValue("discount", {
                              value: 0,
                              type: DiscountType.PERCENT,
                            });
                          }}
                        >
                          Prozent(%)
                        </Button>
                      </div>
                      <Controller
                        control={form.control}
                        name="discount.value"
                        render={({ field }) => (
                          <Input
                            value={field.value}
                            onChange={(e) => {
                              const value = parseFloat(e.currentTarget.value);
                              if (isNaN(value)) return;
                              field.onChange(value);
                            }}
                            inputMode="numeric"
                            type="text"
                            placeholder="Betrag angeben"
                          />
                        )}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <div className="flex flex-row justify-between text-lg font-bold">
                <p className="text-right">Gesamtsumme</p>
                <p>{formatCurrency(totalValue, "EUR", "de-DE")}</p>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
