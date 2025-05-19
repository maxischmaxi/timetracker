"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  Building2Icon,
  ClipboardListIcon,
  FileArchiveIcon,
  FolderIcon,
  HelpCircleIcon,
  TimerIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavAdministration } from "./nav-administration";
import { use, useState } from "react";
import { AuthContext } from "./auth-provider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookie from "js-cookie";
import { useCurrentOrg } from "@/hooks/use-org";
import { useIsAdministrator } from "@/hooks/use-users";

const data = {
  navMain: [
    {
      title: "Jobs",
      url: "/jobs",
      icon: TimerIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderIcon,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: UsersIcon,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: ClipboardListIcon,
    },
    {
      title: "Angebote",
      url: "/offers",
      icon: FileArchiveIcon,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "/help",
      icon: HelpCircleIcon,
    },
  ],
  navAdministration: [
    {
      title: "Users",
      url: "/users",
      icon: UsersIcon,
    },
    {
      title: "Organisation",
      url: "/organization",
      icon: Building2Icon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = use(AuthContext);
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  function handleSelectOrg(orgId: string) {
    setOpen(false);
    if (orgId === Cookie.get("__org")) {
      toast.error(
        "Sie sind bereits in der entsprechenden Organisation eingeloggt",
      );
      return;
    }

    Cookie.set("__org", orgId, {
      path: "/",
      sameSite: "none",
      secure: true,
    });
    router.refresh();
  }

  const org = useCurrentOrg();

  const isAdmin = useIsAdministrator();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton className="cursor-pointer data-[slot=sidebar-menu-button]:!p-1.5">
                  <ArrowUpCircleIcon className="h-5 w-5" />
                  <span className="text-base font-semibold">{org?.name}</span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="space-y-2">
                {user?.orgs.map((org, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => handleSelectOrg(org.id)}
                    className="flex w-full max-w-full items-center justify-start truncate"
                    variant="outline"
                  >
                    {org.name}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {isAdmin && <NavAdministration items={data.navAdministration} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
