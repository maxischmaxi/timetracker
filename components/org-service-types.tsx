"use client";

import {
  useCreateServiceType,
  useCurrentOrg,
  useDeletServiceType,
} from "@/hooks/use-org";
import { Button } from "./ui/button";
import { Loader, MoreHorizontal, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { serviceTypeSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Form } from "./ui/form";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ServiceType } from "@/org/v1/org_pb";
import { Checkbox } from "./ui/checkbox";
import { Plain } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { OrgUpdateServiceTypeButton } from "./org-update-service-type-button";

export function OrgServiceTypes() {
  const [open, setOpen] = useState<boolean>(false);
  const org = useCurrentOrg();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const form = useForm<z.infer<typeof serviceTypeSchema>>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: {
      name: "",
    },
  });
  const deleteServiceType = useDeletServiceType();
  const create = useCreateServiceType({
    onSuccess() {
      form.reset();
      setOpen(false);
    },
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  async function onSubmit(data: z.infer<typeof serviceTypeSchema>) {
    await create.mutateAsync(data.name);
  }

  const columns: ColumnDef<Plain<ServiceType>>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <OrgUpdateServiceTypeButton serviceType={row.original} />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <p>{row.original.name}</p>,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => deleteServiceType.mutate(row.original.id)}
                  disabled={deleteServiceType.isPending}
                >
                  Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteServiceType],
  );

  const table = useReactTable({
    data: org?.serviceTypes || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (!org) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center w-full mb-4">
        <p>Leistungsarten</p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline">
              <PlusIcon />
              <span className="hidden lg:inline">Leistungsart hinzufügen</span>
            </Button>
          </SheetTrigger>
          <SheetContent closeDisabled={create.isPending}>
            <SheetHeader>
              <SheetTitle>Leistungsart erstellen</SheetTitle>
              <SheetDescription>
                Leistungsarten können später einzelnen Nutzern zugewiesen werden
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 p-4"
              >
                <Input
                  control={form.control}
                  name="name"
                  label="Name der Leistungsart"
                  placeholder="Namen eingeben..."
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  disabled={create.isPending}
                />
                <div className="flex flex-col gap-2">
                  <SheetClose asChild disabled={create.isPending}>
                    <Button variant="outline" type="button">
                      Abbrechen
                    </Button>
                  </SheetClose>
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
          </SheetContent>
        </Sheet>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
