"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavigationItem } from "@/types";
import { use } from "react";
import { SearchContext } from "./search-provider";
import { isRouteActive } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SearchIcon, SettingsIcon } from "lucide-react";
import { SettingsContext } from "./settings-provider";

type Props = {
  items: NavigationItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>;

export function NavSecondary({ items, ...props }: Props) {
  const { setOpen } = use(SearchContext);
  const { setOpen: setSettingsOpen } = use(SettingsContext);
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
              Einstellungen
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
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              className="inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <SearchIcon />
              <span>Suchen</span>
              <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
