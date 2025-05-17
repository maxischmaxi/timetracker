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
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  TimerIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import Cookie from "js-cookie";
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
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
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "/search",
      icon: SearchIcon,
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
  const { firebaseUser, user, currentOrg } = use(AuthContext);
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  function handleSelectOrg(orgId: string) {
    setOpen(false);
    if (orgId === currentOrg?.id) {
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

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer">
                  <ArrowUpCircleIcon className="h-5 w-5" />
                  <span className="text-base font-semibold">
                    {currentOrg?.name}
                  </span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="space-y-2">
                {user?.orgs.map((org, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => handleSelectOrg(org.id)}
                    className="w-full flex items-center justify-start max-w-full truncate"
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
        {currentOrg &&
          user?.user &&
          currentOrg.admins.includes(user.user.id) && (
            <NavAdministration items={data.navAdministration} />
          )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: firebaseUser?.displayName ?? user?.user?.name ?? "...",
            email: firebaseUser?.email || "...",
            avatar: firebaseUser?.photoURL || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
