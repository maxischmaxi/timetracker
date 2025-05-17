"use client";

import { LayoutDashboardIcon, MailIcon, PlusCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { JobForm } from "./job-form";
import { useState } from "react";
import { NavigationItem } from "@/types";
import { usePathname } from "next/navigation";
import { isRouteActive } from "@/lib/utils";

type Props = {
  items: NavigationItem[];
};

export function NavMain({ items }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  variant="outline"
                  className="min-w-8 cursor-pointer"
                >
                  <PlusCircleIcon />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quick Create</DialogTitle>
                  <DialogDescription>
                    Create a new job or project quickly without navigating away
                    from the current page.
                  </DialogDescription>
                </DialogHeader>
                <JobForm
                  date={new Date()}
                  onCancel={() => setOpen(false)}
                  onNavigateCreateJob={() => setOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              asChild
            >
              <Link href="/inbox">
                <MailIcon />
                <span className="sr-only">Inbox</span>
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/"}
              tooltip={"Dashboard"}
              asChild
            >
              <Link href="/">
                <LayoutDashboardIcon />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isRouteActive(item.url, pathname)}
                tooltip={item.title}
                asChild
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
