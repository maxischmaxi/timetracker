"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useCustomers } from "@/hooks/use-customer";

export function SiteHeader() {
  const pathname = usePathname();
  const customers = useCustomers();

  const parts = useMemo(() => {
    const pathParts = pathname.split("/").filter(Boolean);

    const breadcrumbItems = pathParts.map((part, index) => {
      const href = "/" + pathParts.slice(0, index + 1).join("/");
      return { name: part, href };
    });

    // if (breadcrumbItems[1].name === "Customers") {
    //   if (breadcrumbItems.length >= 3) {
    //     const id = breadcrumbItems[2].name;
    //     const customer = customers.data?.find((c) => c.id === id);
    //     if (customer) {
    //       breadcrumbItems[2].name = customer.name;
    //     }
    //   }
    // }

    return breadcrumbItems;
  }, [pathname]);

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {parts.length > 1 && (
              <>
                <BreadcrumbSeparator />
                {parts.slice(0, -1).map((part, index) => (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={part.href}>
                      {part.name.charAt(0).toUpperCase() + part.name.slice(1)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </>
            )}
            {parts.length > 0 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {parts[parts.length - 1].name.charAt(0).toUpperCase() +
                      parts[parts.length - 1].name.slice(1)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
